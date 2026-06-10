#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { buildLayoutManifest } from '../src/propContracts.jsx';

const ROOT = path.resolve(import.meta.dirname, '..');
const outFile = path.join(ROOT, 'layout-manifest.json');

fs.writeFileSync(outFile, `${JSON.stringify(buildLayoutManifest(), null, 2)}\n`);
console.log(`Updated ${outFile}`);
