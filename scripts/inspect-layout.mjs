#!/usr/bin/env node
import {
  compactJson,
  inspectLayout,
} from './skill-workflow-utils.mjs';

const layout = process.argv[2];

if (!layout) {
  console.error('Usage: node scripts/inspect-layout.mjs <layout>');
  process.exit(2);
}

const result = inspectLayout(layout);
if (!result) {
  console.error(`Unknown layout "${layout}".`);
  process.exit(1);
}

process.stdout.write(compactJson(result));
