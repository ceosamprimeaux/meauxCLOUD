/**
 * Data Ingestion Pipeline
 * Handles massive context data without truncation or loss
 * 
 * Strategy:
 * 1. Store full context in R2 (unlimited storage)
 * 2. Extract metadata to D1 (fast queries)
 * 3. Optionally chunk and index in Vectorize (semantic search)
 */

/**
 * Store brand context in R2
 * @param {Object} r2 - R2 bucket binding
 * @param {string} brandSlug - Brand slug
 * @param {Object} contextData - Full context data
 * @returns {Promise<string>} R2 key path
 */
export async function storeBrandContextInR2(r2, brandSlug, contextData) {
    if (!r2) {
        throw new Error('R2 bucket not available');
    }

    const timestamp = Date.now();
    const r2Key = `brands/${brandSlug}/context/${timestamp}.json`;

    // Store full context as JSON
    await r2.put(r2Key, JSON.stringify({
        brand: brandSlug,
        data: contextData,
        metadata: {
            receivedAt: new Date().toISOString(),
            version: '1.0',
            size: JSON.stringify(contextData).length
        }
    }), {
        httpMetadata: {
            contentType: 'application/json',
        },
        customMetadata: {
            brand: brandSlug,
            type: 'brand-context'
        }
    });

    return r2Key;
}

/**
 * Retrieve brand context from R2
 * @param {Object} r2 - R2 bucket binding
 * @param {string} r2Key - R2 key path
 * @returns {Promise<Object>} Context data
 */
export async function getBrandContextFromR2(r2, r2Key) {
    if (!r2) {
        throw new Error('R2 bucket not available');
    }

    const object = await r2.get(r2Key);
    if (!object) {
        throw new Error(`Context not found: ${r2Key}`);
    }

    const data = await object.json();
    return data;
}

/**
 * Extract metadata from context for D1 storage
 * @param {Object} contextData - Full context data
 * @returns {Object} Metadata object
 */
export function extractMetadata(contextData) {
    return {
        name: contextData.name || contextData.brand || 'Unknown',
        slug: contextData.slug || contextData.name?.toLowerCase().replace(/\s+/g, '-'),
        category: contextData.category || 'other',
        description: contextData.description || contextData.summary || '',
        website_url: contextData.website || contextData.url || null,
        // Keep description short for D1 (max ~64KB per row)
        short_description: (contextData.description || '').substring(0, 1000)
    };
}

/**
 * Store brand with full context
 * @param {Object} db - D1 database binding
 * @param {Object} r2 - R2 bucket binding
 * @param {Object} contextData - Full context data
 * @returns {Promise<Object>} Stored brand record
 */
export async function storeBrandWithContext(db, r2, contextData) {
    // 1. Store full context in R2
    const metadata = extractMetadata(contextData);
    const r2Key = await storeBrandContextInR2(r2, metadata.slug, contextData);

    // 2. Store metadata in D1
    await db.prepare(`
        CREATE TABLE IF NOT EXISTS brands (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE,
            slug TEXT NOT NULL UNIQUE,
            description TEXT,
            category TEXT,
            status TEXT DEFAULT 'active',
            website_url TEXT,
            parent_brand_id INTEGER,
            r2_context_path TEXT,
            created_at INTEGER DEFAULT (unixepoch()),
            updated_at INTEGER DEFAULT (unixepoch())
        )
    `).run();

    const result = await db.prepare(`
        INSERT INTO brands (name, slug, description, category, website_url, r2_context_path, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, unixepoch(), unixepoch())
        ON CONFLICT(slug) DO UPDATE SET
            name = excluded.name,
            description = excluded.description,
            category = excluded.category,
            website_url = excluded.website_url,
            r2_context_path = excluded.r2_context_path,
            updated_at = unixepoch()
    `).bind(
        metadata.name,
        metadata.slug,
        metadata.short_description,
        metadata.category,
        metadata.website_url,
        r2Key
    ).run();

    const brand = await db.prepare('SELECT * FROM brands WHERE id = ?').bind(result.meta.last_row_id).first();

    return {
        brand,
        r2Key,
        message: 'Brand context stored successfully'
    };
}

/**
 * Chunk text for Vectorize indexing
 * @param {string} text - Text to chunk
 * @param {Object} options - Chunking options
 * @returns {Array<string>} Text chunks
 */
export function chunkText(text, options = {}) {
    const maxSize = options.maxSize || 1000;
    const overlap = options.overlap || 200;

    const chunks = [];
    let start = 0;

    while (start < text.length) {
        const end = Math.min(start + maxSize, text.length);
        chunks.push(text.substring(start, end));
        start = end - overlap; // Overlap for context
    }

    return chunks;
}

/**
 * Index brand context in Vectorize (if enabled)
 * @param {Object} vectorIndex - Vectorize binding
 * @param {Object} ai - AI binding
 * @param {string} r2Key - R2 key path
 * @param {Object} contextData - Context data
 * @returns {Promise<Object>} Indexing result
 */
export async function indexBrandInVectorize(vectorIndex, ai, r2Key, contextData) {
    if (!vectorIndex) {
        return { indexed: false, reason: 'Vectorize not enabled' };
    }

    if (!ai) {
        return { indexed: false, reason: 'AI binding not available' };
    }

    // Combine all text from context
    const fullText = [
        contextData.name,
        contextData.description,
        contextData.summary,
        contextData.context,
        JSON.stringify(contextData.urls || []),
        JSON.stringify(contextData.resources || [])
    ].filter(Boolean).join('\n\n');

    // Chunk the text
    const chunks = chunkText(fullText, { maxSize: 1000, overlap: 200 });

    // Create embeddings and index
    const vectors = [];
    for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i];

        // Create embedding
        const embedding = await ai.run('@cf/baai/bge-base-en-v1.5', {
            text: chunk
        });

        vectors.push({
            id: `${r2Key}-chunk-${i}`,
            values: embedding.data[0],
            metadata: {
                brand: contextData.slug || contextData.name,
                chunkIndex: i,
                r2Path: r2Key,
                text: chunk.substring(0, 200) // Preview
            }
        });
    }

    // Upsert to Vectorize
    await vectorIndex.upsert(vectors);

    return {
        indexed: true,
        chunks: chunks.length,
        vectors: vectors.length
    };
}

/**
 * Complete ingestion pipeline
 * @param {Object} env - Worker environment
 * @param {Object} contextData - Full context data
 * @returns {Promise<Object>} Ingestion result
 */
export async function ingestBrandData(env, contextData) {
    const { DB, R2_ASSETS, VECTOR_INDEX, AI } = env;

    // 1. Store in R2 + D1
    const { brand, r2Key } = await storeBrandWithContext(DB, R2_ASSETS, contextData);

    // 2. Optionally index in Vectorize
    let vectorizeResult = null;
    if (VECTOR_INDEX && AI) {
        vectorizeResult = await indexBrandInVectorize(VECTOR_INDEX, AI, r2Key, contextData);
    }

    return {
        success: true,
        brand,
        storage: {
            r2: r2Key,
            d1: brand.id
        },
        vectorize: vectorizeResult,
        message: 'Brand data ingested successfully'
    };
}

