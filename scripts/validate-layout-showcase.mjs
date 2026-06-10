#!/usr/bin/env node
import { readFileSync } from 'node:fs';

const manifestFile = 'layout-manifest.json';
const showcaseFile = 'examples/component-decks/all-themes-showcase.jsx';

const manifest = JSON.parse(readFileSync(manifestFile, 'utf8'));
const showcase = readFileSync(showcaseFile, 'utf8');

const registeredKeys = Object.keys(manifest.layouts || {});
const showcaseKeys = /THEME_PAGES\.map\(\(page\)\s*=>\s*slide\(page\.key\)\)/.test(showcase)
  ? registeredKeys
  : [...showcase.matchAll(/slide\('([^']+)'/g)].map((match) => match[1]);

const missing = registeredKeys.filter((key) => !showcaseKeys.includes(key));
const extra = showcaseKeys.filter((key) => !registeredKeys.includes(key));
const duplicates = showcaseKeys.filter((key, index) => showcaseKeys.indexOf(key) !== index);

if (missing.length || extra.length || duplicates.length) {
  if (missing.length) console.error(`Missing layout(s) in ${showcaseFile}: ${missing.join(', ')}`);
  if (extra.length) console.error(`Unknown layout(s) in ${showcaseFile}: ${extra.join(', ')}`);
  if (duplicates.length) console.error(`Duplicate layout(s) in ${showcaseFile}: ${[...new Set(duplicates)].join(', ')}`);
  process.exit(1);
}

console.log(`Layout showcase covers ${registeredKeys.length} imported layout(s).`);
