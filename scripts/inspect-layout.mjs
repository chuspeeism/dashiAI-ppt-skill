#!/usr/bin/env node
import {
  compactJson,
  inspectLayout,
} from './skill-workflow-utils.mjs';

const { layouts, compact } = parseCliLayouts(process.argv.slice(2));

if (!layouts.length) {
  printUsage();
  process.exit(2);
}

const results = [];
const unknown = [];
for (const layout of layouts) {
  const result = inspectLayout(layout, { compact });
  if (result) results.push(result);
  else unknown.push(layout);
}

if (unknown.length) {
  console.error(`Unknown layout(s): ${unknown.join(', ')}`);
  process.exit(1);
}

process.stdout.write(compactJson(results.length === 1 ? results[0] : { layouts: results }));

function parseCliLayouts(argv) {
  const result = { layouts: [], compact: false };
  for (let index = 0; index < argv.length; index += 1) {
    const item = argv[index];
    if (item === '--help' || item === '-h') {
      printUsage();
      process.exit(0);
    }
    if (item === '--compact') {
      result.compact = true;
      continue;
    }
    if (item === '--layout') {
      const next = argv[index + 1];
      if (!next || next.startsWith('--')) {
        console.error('--layout requires a layout value');
        process.exit(2);
      }
      result.layouts.push(...splitLayoutArg(next));
      index += 1;
      continue;
    }
    if (item.startsWith('--layout=')) {
      result.layouts.push(...splitLayoutArg(item.slice('--layout='.length)));
      continue;
    }
    if (item.startsWith('--')) {
      console.error(`Unknown option "${item}"`);
      process.exit(2);
    }
    result.layouts.push(...splitLayoutArg(item));
  }
  return {
    ...result,
    layouts: [...new Set(result.layouts.filter(Boolean))],
  };
}

function splitLayoutArg(value) {
  return String(value || '').split(',').map(item => item.trim()).filter(Boolean);
}

function printUsage() {
  console.error('Usage: node scripts/inspect-layout.mjs [--compact] [--layout <layout>] <layout...>');
  console.error('Examples:');
  console.error('  node scripts/inspect-layout.mjs theme01_page020');
  console.error('  node scripts/inspect-layout.mjs --layout theme01_page020 --layout theme01_page031');
}
