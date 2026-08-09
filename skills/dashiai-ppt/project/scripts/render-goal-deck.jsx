#!/usr/bin/env node
import { scrubLocalPaths } from './scrub-local-paths.mjs';
import fs from 'node:fs';
import path from 'node:path';
import { composeDeck } from '../src/deckComposer.jsx';
import { renderDeck } from '../src/renderDeck.jsx';
import { validateGoalSpec } from './validate-goal-spec.mjs';

// 相对路径按调用方目录解析:npm run(含 --prefix)会把脚本 cwd 切到项目根,INIT_CWD 才是用户所在目录。
const CALLER_CWD = process.env.INIT_CWD || process.cwd();

const [, , specArg, outArg] = process.argv;

if (!specArg || !outArg) {
  console.error('Usage: npm run render:goal -- <goal-spec.json> <output/ppt/index.html>');
  process.exit(2);
}

try {
  const specPath = path.resolve(CALLER_CWD, specArg);
  const outFile = path.resolve(CALLER_CWD, outArg);
  const spec = JSON.parse(fs.readFileSync(specPath, 'utf8'));
  const specErrors = validateGoalSpec(spec);
  if (specErrors.length) {
    console.error('Goal spec validation failed:');
    for (const error of specErrors) console.error(`- ${scrubLocalPaths(error)}`);
    process.exit(1);
  }
  const deck = composeDeck(spec);

  renderDeck(deck, { outFile });
  copyGoalSpec(specPath, outFile);
  if (fs.existsSync(outFile)) {
    let content = fs.readFileSync(outFile, 'utf8');
    content = content.replace(/\s*data-prop-controls="[^"]*"/g, '');
    fs.writeFileSync(outFile, content, 'utf8');
  }
  console.log(`Rendered ${deck.slides.length} slide(s): ${displayPath(outFile)}`);
} catch (error) {
  console.error(`Could not render goal deck: ${scrubLocalPaths(error?.message || error)}`);
  process.exit(1);
}

function copyGoalSpec(from, to) {
  const outDir = path.dirname(to);
  const deckDir = path.basename(outDir) === 'ppt' ? path.dirname(outDir) : outDir;
  const target = path.join(deckDir, 'goal.json');
  fs.mkdirSync(deckDir, { recursive: true });
  if (path.resolve(from) !== path.resolve(target)) {
    fs.copyFileSync(from, target);
  }
}

function displayPath(file) {
  const relative = path.relative(CALLER_CWD, file);
  return relative && !relative.startsWith('..') && !path.isAbsolute(relative) ? relative : path.basename(file);
}

