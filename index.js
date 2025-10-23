#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('[STARTUP] Test Pup starting...');
console.log('[STARTUP] __dirname:', __dirname);
console.log('[STARTUP] cwd:', process.cwd());

// Read version from version.json
const versionFile = path.join(__dirname, 'version.json');
console.log('[STARTUP] Looking for version file at:', versionFile);

let versionData;
try {
  versionData = JSON.parse(fs.readFileSync(versionFile, 'utf8'));
  console.log('[STARTUP] Version file loaded successfully');
} catch (error) {
  console.error('[ERROR] Failed to load version.json:', error.message);
  console.error('[ERROR] Files in __dirname:', fs.readdirSync(__dirname));
  process.exit(1);
}

// Log version information
console.log('=================================');
console.log('Test Pup - Dogebox Testing');
console.log('=================================');
console.log(`Name: ${versionData.name}`);
console.log(`Version: ${versionData.version}`);
console.log(`Description: ${versionData.description}`);
console.log('=================================');
console.log(`Started at: ${new Date().toISOString()}`);
console.log('Running... (Press Ctrl+C to stop)');

// Handle errors
process.on('uncaughtException', (error) => {
  console.error('[ERROR] Uncaught exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('[ERROR] Unhandled rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Keep the process running
setInterval(() => {
  console.log(`[${new Date().toISOString()}] Test Pup v${versionData.version} - heartbeat`);
}, 1000); // Log every second

console.log('[STARTUP] Service initialization complete, entering main loop');

