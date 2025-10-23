#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('Syncing version from package.json to other files...');

// Read version from package.json
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const version = packageJson.version;
console.log(`Version from package.json: ${version}`);

// Update manifest.json
const manifestPath = 'manifest.json';
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
manifest.meta.version = version;
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
console.log(`✓ Updated ${manifestPath}`);

// Update pup.nix
const pupNixPath = 'pup.nix';
let pupNixContent = fs.readFileSync(pupNixPath, 'utf8');
pupNixContent = pupNixContent.replace(
  /version = "[^"]+";/,
  `version = "${version}";`
);
fs.writeFileSync(pupNixPath, pupNixContent);
console.log(`✓ Updated ${pupNixPath}`);

console.log('Version sync complete!');

