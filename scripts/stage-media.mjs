#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const [, , outDirArg, ...sourceArgs] = process.argv;

if (process.argv.includes('--help') || process.argv.includes('-h')) {
  printUsage();
  process.exit(0);
}

if (!outDirArg || !sourceArgs.length) {
  printUsage();
  process.exit(2);
}

const outDir = resolveOutputPptDir(outDirArg);
const targetDir = path.join(outDir, 'assets/user-media');
fs.mkdirSync(targetDir, { recursive: true });

const usedNames = new Set();
const items = sourceArgs.map(sourceArg => {
  const source = path.resolve(sourceArg);
  if (!fs.existsSync(source)) throw new Error(`Media file does not exist: ${source}`);
  const stat = fs.statSync(source);
  if (!stat.isFile()) throw new Error(`Media path is not a file: ${source}`);
  const ext = path.extname(source).toLowerCase();
  const kind = mediaKindForExt(ext);
  if (!kind) throw new Error(`Unsupported media file type: ${source}`);
  const prepared = prepareMedia(source, ext, kind, outDir, usedNames);
  return {
    source,
    relative: prepared.relative,
    kind,
    mime: prepared.mime,
    ...(prepared.convertedFrom ? { convertedFrom: prepared.convertedFrom } : {}),
  };
});

process.stdout.write(`${JSON.stringify({
  input: path.resolve(outDirArg),
  outDir,
  deckRoot: path.basename(outDir) === 'ppt' ? path.dirname(outDir) : outDir,
  items,
}, null, 2)}\n`);

function printUsage() {
  console.error('Usage: stage-media.mjs <output-deck-dir|output-ppt-dir|output-ppt-index.html> <media-file...>');
  console.error('Writes media under the HTML output directory: <ppt>/assets/user-media/.');
}

function resolveOutputPptDir(value) {
  const target = path.resolve(value);
  if (/\.html?$/i.test(target)) return path.dirname(target);
  if (path.basename(target) === 'ppt') return target;
  if (fs.existsSync(path.join(target, 'index.html'))) return target;
  return path.join(target, 'ppt');
}

function uniqueName(base, ext, used) {
  const safeBase = base || 'media';
  let name = `${safeBase}${ext}`;
  let index = 2;
  while (used.has(name)) {
    name = `${safeBase}-${index}${ext}`;
    index += 1;
  }
  used.add(name);
  return name;
}

function slugify(value) {
  return String(value || '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function mediaKindForExt(ext) {
  if (['.png', '.jpg', '.jpeg', '.webp', '.gif', '.svg', '.avif'].includes(ext)) return 'image';
  if (['.mp4', '.webm', '.mov', '.m4v'].includes(ext)) return 'video';
  return null;
}

function prepareMedia(source, ext, kind, outDir, usedNames) {
  const base = slugify(path.basename(source, ext));
  if (ext === '.avif') {
    const converted = convertAvif(source, outDir, base, usedNames);
    return {
      ...converted,
      convertedFrom: 'avif',
    };
  }
  const name = uniqueName(base, ext, usedNames);
  const relative = path.posix.join('assets/user-media', name);
  fs.copyFileSync(source, path.join(outDir, relative));
  return {
    relative,
    mime: mimeForExt(ext, kind),
  };
}

function convertAvif(source, outDir, base, usedNames) {
  const attempts = [
    { ext: '.webp', mime: 'image/webp', command: 'magick', args: target => [source, target] },
    { ext: '.webp', mime: 'image/webp', command: 'sips', args: target => ['-s', 'format', 'webp', source, '--out', target] },
    { ext: '.png', mime: 'image/png', command: 'magick', args: target => [source, target] },
    { ext: '.png', mime: 'image/png', command: 'sips', args: target => ['-s', 'format', 'png', source, '--out', target] },
  ];
  const errors = [];
  for (const attempt of attempts) {
    const name = uniqueName(base, attempt.ext, usedNames);
    const relative = path.posix.join('assets/user-media', name);
    const target = path.join(outDir, relative);
    const result = spawnSync(attempt.command, attempt.args(target), { encoding: 'utf8' });
    if (result.status === 0 && fs.existsSync(target)) {
      return {
        relative,
        mime: attempt.mime,
      };
    }
    usedNames.delete(name);
    fs.rmSync(target, { force: true });
    const message = `${attempt.command} ${attempt.ext}: ${result.stderr || result.stdout || result.error?.message || `exit ${result.status}`}`;
    errors.push(message.trim());
  }
  throw new Error(`Could not convert AVIF media file: ${source}\n${errors.join('\n')}`);
}

function mimeForExt(ext, kind = null) {
  return {
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.webp': 'image/webp',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.mp4': 'video/mp4',
    '.webm': 'video/webm',
    '.mov': 'video/quicktime',
    '.m4v': 'video/mp4',
  }[ext] || (kind === 'image' ? 'image/*' : 'application/octet-stream');
}
