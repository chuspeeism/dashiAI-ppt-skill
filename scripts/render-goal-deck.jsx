#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { composeDeck } from '../src/deckComposer.jsx';
import { renderDeck } from '../src/renderDeck.jsx';

const [, , specArg, outArg] = process.argv;

if (!specArg || !outArg) {
  console.error('Usage: npm run render:goal -- <goal-spec.json> <output/ppt/index.html>');
  process.exit(2);
}

const specPath = path.resolve(specArg);
const outFile = path.resolve(outArg);
const spec = JSON.parse(fs.readFileSync(specPath, 'utf8'));
const deck = composeDeck(spec);

renderDeck(deck, { outFile });
copyGoalSpec(specPath, outFile);
console.log(`Rendered ${deck.slides.length} slide(s): ${outFile}`);

function copyGoalSpec(from, to) {
  const outDir = path.dirname(to);
  const deckDir = path.basename(outDir) === 'ppt' ? path.dirname(outDir) : outDir;
  const target = path.join(deckDir, 'goal.json');
  fs.mkdirSync(deckDir, { recursive: true });
  if (path.resolve(from) !== path.resolve(target)) {
    fs.copyFileSync(from, target);
  }
}
