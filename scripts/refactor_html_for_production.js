#!/usr/bin/env node
/**
 * HTML Refactoring Tool for Production
 * 
 * Automatically refactors HTML files to:
 * - Use correct API endpoints (dev vs production)
 * - Connect to OAuth (Google, GitHub)
 * - Configure Cloudflare API, MeshyAI, CloudConvert, Resend integrations
 * - Ensure proper asset paths
 * - Add environment detection
 */

const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
    // API Endpoints
    apiEndpoints: {
        dev: 'https://ceosamprimeaux.github.io/meauxCLOUD',
        production: 'https://meauxcloud.org'
    },
    
    // OAuth Endpoints
    oauth: {
        google: {
            auth: '/api/auth/google',
            callback: '/api/auth/google/callback'
        },
        github: {
            auth: '/api/auth/github',
            callback: '/api/auth/github/callback'
        }
    },
    
    // API Routes
    apis: {
        dashboard: '/api/dashboard/stats',
        meshy: '/api/meshy/generate',
        cloudconvert: '/api/cloudconvert/jobs',
        resend: '/api/email/send',
        cloudflare: {
            gateways: '/api/cloudflare/gateways',
            images: '/api/images/list'
        },
        sql: '/api/sql/execute',
        chat: {
            messages: '/api/chat/messages',
            send: '/api/chat/send',
            ws: '/api/chat/ws'
        }
    }
};

/**
 * Detect environment from file path or build context
 */
function detectEnvironment(filePath) {
    // If in dist/ folder, it's for GitHub Pages (dev)
    if (filePath.includes('/dist/') || filePath.includes('\\dist\\')) {
        return 'dev';
    }
    // Otherwise assume production
    return 'production';
}

/**
 * Get base URL for current environment
 */
function getBaseUrl(env) {
    return CONFIG.apiEndpoints[env] || CONFIG.apiEndpoints.production;
}

/**
 * Refactor HTML content
 */
function refactorHTML(content, filePath) {
    const env = detectEnvironment(filePath);
    const baseUrl = getBaseUrl(env);
    
    let refactored = content;
    
    // 1. Fix API endpoint references
    // Replace relative API calls with full URLs
    refactored = refactored.replace(
        /fetch\(['"`](\/api\/[^'"`]+)['"`]\)/g,
        (match, endpoint) => {
            return `fetch('${baseUrl}${endpoint}')`;
        }
    );
    
    // 2. Fix OAuth links
    // Google OAuth
    refactored = refactored.replace(
        /href=["']\/api\/auth\/google["']/g,
        `href="${baseUrl}${CONFIG.oauth.google.auth}"`
    );
    
    // GitHub OAuth
    refactored = refactored.replace(
        /href=["']\/api\/auth\/github["']/g,
        `href="${baseUrl}${CONFIG.oauth.github.auth}"`
    );
    
    // 3. Add environment detection script
    const envScript = `
    <script>
        // Environment Detection & API Configuration
        (function() {
            const ENV = {
                isDev: ${env === 'dev' ? 'true' : 'false'},
                isProduction: ${env === 'production' ? 'true' : 'false'},
                baseUrl: '${baseUrl}',
                apiBase: '${baseUrl}',
                endpoints: ${JSON.stringify(CONFIG.apis, null, 2)},
                oauth: ${JSON.stringify(CONFIG.oauth, null, 2)}
            };
            
            // Make available globally
            window.MEAUX_ENV = ENV;
            
            // Helper function for API calls
            window.meauxAPI = {
                async call(endpoint, options = {}) {
                    const url = endpoint.startsWith('http') 
                        ? endpoint 
                        : \`\${ENV.apiBase}\${endpoint}\`;
                    
                    const response = await fetch(url, {
                        ...options,
                        headers: {
                            'Content-Type': 'application/json',
                            ...options.headers
                        },
                        credentials: 'include'
                    });
                    
                    if (!response.ok) {
                        throw new Error(\`API Error: \${response.status}\`);
                    }
                    
                    return response.json();
                },
                
                // Dashboard API
                async getDashboardStats() {
                    return this.call(ENV.endpoints.dashboard);
                },
                
                // OAuth
                async initiateGoogleAuth() {
                    window.location.href = \`\${ENV.apiBase}\${ENV.oauth.google.auth}\`;
                },
                
                async initiateGitHubAuth() {
                    window.location.href = \`\${ENV.apiBase}\${ENV.oauth.github.auth}\`;
                },
                
                // MeshyAI
                async generate3D(data) {
                    return this.call(ENV.endpoints.meshy, {
                        method: 'POST',
                        body: JSON.stringify(data)
                    });
                },
                
                // CloudConvert
                async createJob(data) {
                    return this.call(ENV.endpoints.cloudconvert, {
                        method: 'POST',
                        body: JSON.stringify(data)
                    });
                },
                
                // Resend Email
                async sendEmail(data) {
                    return this.call(ENV.endpoints.resend, {
                        method: 'POST',
                        body: JSON.stringify(data)
                    });
                },
                
                // Cloudflare Images
                async listImages() {
                    return this.call(ENV.endpoints.cloudflare.images);
                },
                
                // SQL Execution
                async executeSQL(query) {
                    return this.call(ENV.endpoints.sql, {
                        method: 'POST',
                        body: JSON.stringify({ query })
                    });
                },
                
                // Chat
                async getMessages() {
                    return this.call(ENV.endpoints.chat.messages);
                },
                
                async sendMessage(data) {
                    return this.call(ENV.endpoints.chat.send, {
                        method: 'POST',
                        body: JSON.stringify(data)
                    });
                }
            };
            
            console.log('✅ MeauxCLOUD API initialized for', ENV.isDev ? 'DEV' : 'PRODUCTION');
        })();
    </script>`;
    
    // Insert environment script before closing </head> tag
    if (!refactored.includes('window.MEAUX_ENV')) {
        refactored = refactored.replace('</head>', `${envScript}\n</head>`);
    }
    
    // 4. Fix asset paths for GitHub Pages (dev)
    if (env === 'dev') {
        // GitHub Pages serves from root, so relative paths work
        // But we need to ensure they're correct
        refactored = refactored.replace(
            /href=["'](\/assets\/[^'"`]+)["']/g,
            (match, assetPath) => {
                // Keep relative paths for GitHub Pages
                return match;
            }
        );
    } else {
        // Production: ensure absolute paths or relative to domain root
        refactored = refactored.replace(
            /href=["'](\/assets\/[^'"`]+)["']/g,
            (match, assetPath) => {
                return `href="${baseUrl}${assetPath}"`;
            }
        );
    }
    
    // 5. Add error handling wrapper for API calls
    const errorHandler = `
    <script>
        // Global error handler for API calls
        window.addEventListener('unhandledrejection', function(event) {
            console.error('Unhandled API Error:', event.reason);
            // You can add user-facing error notifications here
        });
    </script>`;
    
    if (!refactored.includes('unhandledrejection')) {
        refactored = refactored.replace('</body>', `${errorHandler}\n</body>`);
    }
    
    return refactored;
}

/**
 * Process a single HTML file
 */
function processFile(filePath) {
    try {
        console.log(`📄 Processing: ${filePath}`);
        
        const content = fs.readFileSync(filePath, 'utf8');
        const refactored = refactorHTML(content, filePath);
        
        // Write back to file
        fs.writeFileSync(filePath, refactored, 'utf8');
        
        console.log(`✅ Refactored: ${filePath}`);
        return true;
    } catch (error) {
        console.error(`❌ Error processing ${filePath}:`, error.message);
        return false;
    }
}

/**
 * Main function
 */
function main() {
    const args = process.argv.slice(2);
    
    if (args.length === 0) {
        console.log('Usage: node refactor_html_for_production.js <file1.html> [file2.html] ...');
        console.log('   or: node refactor_html_for_production.js --all');
        process.exit(1);
    }
    
    let files = [];
    
    if (args[0] === '--all') {
        // Process all HTML files in current directory and dist/
        const htmlFiles = [
            'index.html',
            'dashboard.html',
            'login.html',
            'dist/index.html',
            'dist/dashboard.html',
            'dist/login.html',
            'dist/dashboard_app.html'
        ].filter(f => {
            const fullPath = path.join(__dirname, '..', f);
            return fs.existsSync(fullPath);
        });
        
        files = htmlFiles.map(f => path.join(__dirname, '..', f));
    } else {
        files = args.map(f => path.resolve(f));
    }
    
    console.log('🚀 Starting HTML refactoring for production...\n');
    
    let successCount = 0;
    let failCount = 0;
    
    files.forEach(file => {
        if (processFile(file)) {
            successCount++;
        } else {
            failCount++;
        }
    });
    
    console.log(`\n📊 Refactoring complete:`);
    console.log(`   ✅ Success: ${successCount}`);
    console.log(`   ❌ Failed: ${failCount}`);
    
    if (failCount > 0) {
        process.exit(1);
    }
}

main();

