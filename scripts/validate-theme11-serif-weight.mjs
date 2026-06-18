import { readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';

const ROOT = 'src/components/themes/theme11/source';
const FONT = 'Noto Serif SC';

function* jsxFiles(dir) {
  for (const name of readdirSync(dir)) {
    const file = path.join(dir, name);
    if (statSync(file).isDirectory()) {
      yield* jsxFiles(file);
    } else if (file.endsWith('.jsx')) {
      yield file;
    }
  }
}

function lineOf(text, index) {
  return text.slice(0, index).split('\n').length;
}

function describeRule(text, brace) {
  const lineStart = text.lastIndexOf('\n', brace);
  return text.slice(lineStart + 1, brace).trim() || '<inline style>';
}

const failures = [];

for (const file of jsxFiles(ROOT)) {
  const text = readFileSync(file, 'utf8');
  let index = text.indexOf(FONT);
  while (index !== -1) {
    const start = text.lastIndexOf('{', index);
    const end = text.indexOf('}', index);
    const block = start === -1 || end === -1 ? '' : text.slice(start, end + 1);
    const hasWeight800 = /font-weight\s*:\s*800\b/.test(block) || /fontWeight\s*:\s*['"]?800\b/.test(block);

    if (!hasWeight800) {
      failures.push({
        file,
        line: lineOf(text, index),
        rule: start === -1 ? '<unknown>' : describeRule(text, start),
      });
    }

    index = text.indexOf(FONT, index + FONT.length);
  }
}

if (failures.length > 0) {
  console.error(`Expected every ${FONT} rule in ${ROOT} to use font-weight:800.`);
  for (const failure of failures) {
    console.error(`${failure.file}:${failure.line} ${failure.rule}`);
  }
  process.exitCode = 1;
} else {
  console.log(`All ${FONT} rules in ${ROOT} use font-weight:800.`);
}
