#!/usr/bin/env node
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { renderDeck } from '../src/renderDeck.jsx';

const [, , configArg, outArg] = process.argv;

if (!configArg || !outArg) {
  console.error('Usage: npm run render:deck -- <deck-config.jsx> <output/ppt/index.html>');
  process.exit(2);
}

const configPath = path.resolve(configArg);
const outFile = path.resolve(outArg);
const mod = await import(pathToFileURL(configPath));
const deck = mod.default ?? mod.deck;

if (!deck) {
  console.error(`Deck config must export default or named "deck": ${configPath}`);
  process.exit(2);
}

renderDeck(deck, { outFile });
console.log(`Rendered ${deck.slides.length} slide(s): ${outFile}`);
