#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import {
  compactJson,
  getPreferredMediaSlot,
  normalizeProps,
} from './skill-workflow-utils.mjs';

const [, , layout, propsArg, ...extraArgs] = process.argv;

if (!layout || !propsArg) {
  console.error('Usage: node scripts/write-safe-props.mjs <layout> <props-json-or-file> [--images <path...>] [--media <path...>]');
  process.exit(2);
}

let props;
try {
  const source = propsArg.trim().startsWith('{') || propsArg.trim().startsWith('[')
    ? propsArg
    : readFileSync(propsArg, 'utf8');
  props = JSON.parse(source);
} catch (error) {
  console.error(`Invalid props JSON: ${error.message}`);
  process.exit(2);
}

const mediaInput = parseMediaInput(extraArgs);
let mediaIntent = null;
let mediaMapping = null;

if (mediaInput.items.length) {
  const slot = getPreferredMediaSlot(layout, { kind: mediaInput.kind, count: mediaInput.items.length });
  if (!slot) {
    process.stdout.write(compactJson({
      layout,
      props,
      warnings: [],
      errors: [`Layout "${layout}" has no media slot that can hold ${mediaInput.items.length} item(s)`],
    }));
    process.exit(1);
  }
  props = {
    ...props,
    [slot.field]: mediaInput.items,
  };
  mediaIntent = mediaInput.kind === 'media' ? 'provided-media' : 'provided-images';
  mediaMapping = {
    field: slot.field,
    countKey: slot.countKey,
    count: mediaInput.items.length,
  };
}

const result = normalizeProps(layout, props);
process.stdout.write(compactJson({
  layout,
  mediaIntent,
  mediaMapping,
  ...result,
}));

if (result.errors?.length) process.exit(1);

function parseMediaInput(args) {
  const result = { kind: null, items: [] };
  for (let index = 0; index < args.length; index += 1) {
    const item = args[index];
    if (item !== '--images' && item !== '--media') continue;
    result.kind = item === '--media' ? 'media' : 'images';
    for (let valueIndex = index + 1; valueIndex < args.length && !args[valueIndex].startsWith('--'); valueIndex += 1) {
      result.items.push(args[valueIndex]);
      index = valueIndex;
    }
  }
  return result;
}
