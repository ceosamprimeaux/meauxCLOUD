#!/usr/bin/env node
/**
 * Sync built assets from dist/ to R2 bucket
 * This ensures all CSS, JS, and HTML files are available for the Cloudflare Worker
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const mime = require('mime-types');

const DIST_DIR = path.join(__dirname, '../dist');
const BUCKET_NAME = 'meauxcloud';

// Files to sync
const filesToSync = [];

function getAllFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory()) {
            getAllFiles(filePath, fileList);
        } else {
            // Get relative path from dist/
            const relativePath = path.relative(DIST_DIR, filePath);
            fileList.push(relativePath);
        }
    });
    
    return fileList;
}

function uploadToR2(filePath) {
    const fullPath = path.join(DIST_DIR, filePath);
    const contentType = mime.lookup(fullPath) || 'application/octet-stream';
    
    try {
        // Use wrangler to upload
        const command = `npx wrangler r2 object put ${BUCKET_NAME}/${filePath} --file="${fullPath}" --content-type="${contentType}"`;
        execSync(command, { stdio: 'inherit', cwd: path.join(__dirname, '..') });
        console.log(`✅ Uploaded: ${filePath}`);
        return true;
    } catch (error) {
        console.error(`❌ Failed to upload ${filePath}:`, error.message);
        return false;
    }
}

function main() {
    console.log('🚀 Starting asset sync to R2...\n');
    
    if (!fs.existsSync(DIST_DIR)) {
        console.error(`❌ dist/ directory not found. Run 'npm run build' first.`);
        process.exit(1);
    }
    
    // Get all files from dist/
    const allFiles = getAllFiles(DIST_DIR);
    
    console.log(`📦 Found ${allFiles.length} files to sync\n`);
    
    let successCount = 0;
    let failCount = 0;
    
    // Upload each file
    allFiles.forEach(file => {
        if (uploadToR2(file)) {
            successCount++;
        } else {
            failCount++;
        }
    });
    
    console.log(`\n📊 Sync complete:`);
    console.log(`   ✅ Success: ${successCount}`);
    console.log(`   ❌ Failed: ${failCount}`);
    
    if (failCount > 0) {
        process.exit(1);
    }
}

main();

