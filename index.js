#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const http = require('http');

console.log('[STARTUP] Test Pup starting...');
console.log('[STARTUP] __dirname:', __dirname);
console.log('[STARTUP] cwd:', process.cwd());

// Read version from package.json
const packageFile = path.join(__dirname, 'package.json');
console.log('[STARTUP] Looking for package file at:', packageFile);

let versionData;
try {
  versionData = JSON.parse(fs.readFileSync(packageFile, 'utf8'));
  console.log('[STARTUP] Package file loaded successfully');
} catch (error) {
  console.error('[ERROR] Failed to load package.json:', error.message);
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

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function renderIndexHtml({ name, version, description, serverUrl }) {
  const safeName = escapeHtml(name ?? 'test-pup');
  const safeVersion = escapeHtml(version ?? 'unknown');
  const safeDescription = escapeHtml(description ?? '');
  const safeServerUrl = escapeHtml(serverUrl ?? 'not set');

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>${safeName} v${safeVersion}</title>
    <style>
      :root { color-scheme: light dark; }
      body { font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial; margin: 0; padding: 32px; }
      .card { max-width: 720px; margin: 0 auto; padding: 24px; border: 1px solid rgba(127,127,127,.35); border-radius: 16px; }
      .label { opacity: .75; font-size: 12px; letter-spacing: .08em; text-transform: uppercase; }
      .version { font-size: 48px; font-weight: 700; margin: 8px 0 0; }
      .meta { margin-top: 16px; opacity: .8; }
      code { padding: 2px 6px; border-radius: 8px; border: 1px solid rgba(127,127,127,.35); }
    </style>
  </head>
  <body>
    <div class="card">
      <div class="meta">
        <div><span class="label">Name</span>: <code>${safeName}</code></div>
        <div style="margin-top:8px"><span class="label">Server URL</span>: <code>${safeServerUrl}</code></div>
        ${safeDescription ? `<div style="margin-top:8px">${safeDescription}</div>` : ''}
      </div>
      <div class="label">Current version</div>
      <div class="version">${safeVersion}</div>
    </div>
  </body>
</html>`;
}

// Handle errors
process.on('uncaughtException', (error) => {
  console.error('[ERROR] Uncaught exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('[ERROR] Unhandled rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Minimal web UI (shows current version)
const PORT = Number(process.env.PORT || 1234);
const HOST = process.env.HOST || '0.0.0.0';
const SERVER_URL = process.env.server_url || process.env.SERVER_URL || 'not set';

const server = http.createServer((req, res) => {
  try {
    const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
    const pathname = url.pathname;

    if (pathname === '/' || pathname === '/index.html') {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(renderIndexHtml({ ...versionData, serverUrl: SERVER_URL }));
      return;
    }

    if (pathname === '/version') {
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ version: versionData.version }, null, 2));
      return;
    }

    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Not Found');
  } catch (err) {
    res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Internal Server Error');
  }
});

server.listen(PORT, HOST, () => {
  console.log(`[STARTUP] Web UI listening on http://${HOST}:${PORT} (version ${versionData.version})`);
});

// Keep the process running
setInterval(() => {
  console.log(`[${new Date().toISOString()}] Test Pup v${versionData.version} - heartbeat (server_url=${SERVER_URL})`);
}, 1000); // Log every second

console.log('[STARTUP] Service initialization complete, entering main loop');

