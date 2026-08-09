#!/usr/bin/env node
import { execFileSync, spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// 相对路径按调用方目录解析:npm run(含 --prefix)会把脚本 cwd 切到项目根,INIT_CWD 才是用户所在目录。
const CALLER_CWD = process.env.INIT_CWD || process.cwd();


// Raster image formats that can be safely downsampled by sips (skip gif/svg).
const DOWNSCALE_EXTS = new Set(['.png', '.jpg', '.jpeg', '.webp']);
const MAX_LONG_EDGE = 2048;
const STAGE_MANIFEST_NAME = '.stage-media-manifest.json';
// 1x1 placeholder JPEG so a staged video always has a readable poster sibling
// (used when ffmpeg can't extract a frame). Defined up here to avoid the TDZ —
// the staging logic below runs at module evaluation.
const PLACEHOLDER_POSTER_B64 = '/9j/4AAQSkZJRgABAgAAAQABAAD//gAQTGF2YzYyLjI4LjEwMAD/2wBDAAgEBAQEBAUFBQUFBQYGBgYGBgYGBgYGBgYHBwcICAgHBwcGBgcHCAgICAkJCQgICAgJCQoKCgwMCwsODg4RERT/xABLAAEBAAAAAAAAAAAAAAAAAAAACAEBAAAAAAAAAAAAAAAAAAAAABABAAAAAAAAAAAAAAAAAAAAABEBAAAAAAAAAAAAAAAAAAAAAP/AABEIAAIAAgMBIgACEQADEQD/2gAMAwEAAhEDEQA/AJ/AB//Z';

// Only run the CLI when invoked directly (`node scripts/stage-media.mjs ...`).
// When imported (e.g. unit tests), expose the helpers without executing.
const isMainModule = Boolean(process.argv[1])
  && path.basename(process.argv[1]).toLowerCase() === path.basename(fileURLToPath(import.meta.url)).toLowerCase();

if (isMainModule) {
  runCli(process.argv.slice(2));
}

function runCli(argv) {
  const [outDirArg, ...sourceArgs] = argv;

  if (argv.includes('--help') || argv.includes('-h')) {
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

  const stageContext = createStageContext(outDir);
  const items = sourceArgs.map(sourceArg => {
    const source = resolveSourcePath(sourceArg);
    if (!fs.existsSync(source)) throw new Error(`Media file does not exist: ${path.resolve(CALLER_CWD, sourceArg)}`);
    const stat = fs.statSync(source);
    if (!stat.isFile()) throw new Error(`Media path is not a file: ${source}`);
    const ext = path.extname(source).toLowerCase();
    const kind = mediaKindForExt(ext);
    if (!kind) throw new Error(`Unsupported media file type: ${source}`);
    const prepared = prepareMedia(source, ext, kind, outDir, stageContext);
    return {
      source,
      relative: prepared.relative,
      kind,
      mime: prepared.mime,
      ...(prepared.convertedFrom ? { convertedFrom: prepared.convertedFrom } : {}),
    };
  });
  writeStageManifest(outDir, stageContext.manifest);

  process.stdout.write(`${JSON.stringify({
    input: path.resolve(CALLER_CWD, outDirArg),
    outDir,
    deckRoot: path.basename(outDir) === 'ppt' ? path.dirname(outDir) : outDir,
    items,
  }, null, 2)}\n`);
}

// Resolve a source argument to an existing on-disk path.
// macOS/Linux disagree on Unicode normalization: a name with combining marks,
// CJK, spaces or Unicode dashes may be stored in one normalization form (often
// NFD/NFC) while the argv string arrives in another. A byte-exact `existsSync`
// then reports "file not found" on normalization-preserving filesystems
// (e.g. ext4 on CI). When the fast path misses, scan the parent directory and
// match the basename under Unicode normalization so the staged file — and the
// returned `relative` — points at the real bytes on disk.
function resolveSourcePath(sourceArg) {
  const resolved = path.resolve(CALLER_CWD, sourceArg);
  if (fs.existsSync(resolved)) return resolved;

  const dir = path.dirname(resolved);
  const wanted = path.basename(resolved);
  let entries;
  try {
    entries = fs.readdirSync(dir);
  } catch {
    return resolved;
  }
  const match = matchNormalizedEntry(entries, wanted);
  return match ? path.join(dir, match) : resolved;
}

// Pure, filesystem-independent basename matcher. Returns the entry from
// `entries` whose name equals `wantedBasename` under any Unicode normalization
// form (NFC/NFD/NFKC/NFKD), preferring a byte-exact hit. Returns undefined when
// nothing matches.
function matchNormalizedEntry(entries, wantedBasename) {
  if (!Array.isArray(entries) || !wantedBasename) return undefined;
  for (const entry of entries) {
    if (entry === wantedBasename) return entry;
  }
  const wantedForms = normalizationForms(wantedBasename);
  for (const entry of entries) {
    if (normalizationForms(entry).some(form => wantedForms.includes(form))) return entry;
  }
  return undefined;
}

function normalizationForms(value) {
  const str = String(value);
  const forms = new Set();
  for (const form of ['NFC', 'NFD', 'NFKC', 'NFKD']) {
    try {
      forms.add(str.normalize(form));
    } catch {
      // ignore unsupported normalization form
    }
  }
  return Array.from(forms);
}

function printUsage() {
  console.error('Usage: stage-media.mjs <output-deck-dir|output-ppt-dir|output-ppt-index.html> <media-file...>');
  console.error('Writes media under the HTML output directory: <ppt>/assets/user-media/.');
}

function resolveOutputPptDir(value) {
  const target = path.resolve(CALLER_CWD, value);
  if (/\.html?$/i.test(target)) return path.dirname(target);
  if (path.basename(target) === 'ppt') return target;
  if (fs.existsSync(path.join(target, 'index.html'))) return target;
  return path.join(target, 'ppt');
}

function createStageContext(outDir) {
  const targetDir = path.join(outDir, 'assets/user-media');
  const manifest = readStageManifest(outDir);
  const usedNames = new Set();
  for (const entry of fs.readdirSync(targetDir, { withFileTypes: true })) {
    if (entry.isFile()) usedNames.add(entry.name);
  }
  const sourceItems = new Map();
  for (const item of manifest.items) {
    const name = stagedNameFromRelative(item.relative);
    if (!name) continue;
    usedNames.add(name);
    sourceItems.set(item.sourceId, item);
  }
  return { manifest, usedNames, sourceItems };
}

function readStageManifest(outDir) {
  const manifestPath = stageManifestPath(outDir);
  if (!fs.existsSync(manifestPath)) return { version: 1, items: [] };
  const parsed = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  const items = Array.isArray(parsed?.items) ? parsed.items.filter(isStageManifestItem) : [];
  return { version: 1, items };
}

function writeStageManifest(outDir, manifest) {
  fs.writeFileSync(stageManifestPath(outDir), `${JSON.stringify(manifest, null, 2)}\n`);
}

function stageManifestPath(outDir) {
  return path.join(outDir, 'assets/user-media', STAGE_MANIFEST_NAME);
}

function isStageManifestItem(item) {
  return item
    && typeof item.sourceId === 'string'
    && typeof item.relative === 'string'
    && typeof item.kind === 'string'
    && typeof item.mime === 'string';
}

function stagedNameFromRelative(relative) {
  const prefix = 'assets/user-media/';
  if (!String(relative || '').startsWith(prefix)) return '';
  const name = relative.slice(prefix.length);
  return name && !name.includes('/') ? name : '';
}

function sourceIdFor(source) {
  return createHash('sha256')
    .update(path.resolve(fs.realpathSync(source)).normalize('NFC'))
    .digest('hex')
    .slice(0, 12);
}

function reserveName(base, ext, context, sourceId) {
  const safeBase = base || 'media';
  let name = `${safeBase}${ext}`;
  if (!context.usedNames.has(name)) {
    context.usedNames.add(name);
    return name;
  }
  const suffix = sourceId.slice(0, 12);
  name = `${safeBase}-${suffix}${ext}`;
  let index = 2;
  while (context.usedNames.has(name)) {
    name = `${safeBase}-${suffix}-${index}${ext}`;
    index += 1;
  }
  context.usedNames.add(name);
  return name;
}

function recordStageItem(context, sourceId, item) {
  const manifestItem = {
    sourceId,
    relative: item.relative,
    kind: item.kind,
    mime: item.mime,
    ...(item.convertedFrom ? { convertedFrom: item.convertedFrom } : {}),
  };
  const index = context.manifest.items.findIndex(entry => entry.sourceId === sourceId);
  if (index >= 0) context.manifest.items[index] = manifestItem;
  else context.manifest.items.push(manifestItem);
  context.sourceItems.set(sourceId, manifestItem);
  const name = stagedNameFromRelative(item.relative);
  if (name) context.usedNames.add(name);
}

function slugify(value) {
  return String(value || '')
    .normalize('NFKD')
    // Map Unicode dashes (en/em/figure/horizontal-bar/minus) to a plain hyphen
    // so dashed names slug predictably instead of depending on the catch-all.
    .replace(/[\u2010-\u2015\u2212]/g, '-')
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

function prepareMedia(source, ext, kind, outDir, context) {
  const base = slugify(path.basename(source, ext));
  const sourceId = sourceIdFor(source);
  const existing = context.sourceItems.get(sourceId);
  if (ext === '.avif') {
    const converted = convertAvif(source, outDir, base, context, sourceId, existing?.relative);
    // AVIF lands as webp/png — cap its long edge too.
    maybeDownscaleImage(path.join(outDir, converted.relative));
    const prepared = {
      ...converted,
      kind,
      convertedFrom: 'avif',
    };
    recordStageItem(context, sourceId, prepared);
    return prepared;
  }
  const existingName = existing ? stagedNameFromRelative(existing.relative) : '';
  const name = existingName || reserveName(base, ext, context, sourceId);
  const relative = existingName ? existing.relative : path.posix.join('assets/user-media', name);
  const dest = path.join(outDir, relative);
  if (path.resolve(CALLER_CWD, source) !== path.resolve(CALLER_CWD, dest)) fs.copyFileSync(source, dest);
  if (kind === 'image' && DOWNSCALE_EXTS.has(ext)) {
    maybeDownscaleImage(dest);
  } else if (kind === 'video') {
    generateVideoPoster(dest);
  }
  const prepared = {
    relative,
    kind,
    mime: mimeForExt(ext, kind),
  };
  recordStageItem(context, sourceId, prepared);
  return prepared;
}

// Best-effort: cap the long edge at MAX_LONG_EDGE in place.
// Failure is non-fatal — the already-copied original stays in place.
// `sips` handles jpeg/png but cannot write webp, so fall back to `magick`.
function maybeDownscaleImage(filePath) {
  const dims = readImageDimensions(filePath);
  if (!dims || Math.max(dims.width, dims.height) <= MAX_LONG_EDGE) return;
  if (downscaleInPlace(filePath, 'sips', ['-Z', String(MAX_LONG_EDGE), filePath, '--out', '__TMP__'])) return;
  // `WxH>` only shrinks when larger and preserves aspect ratio.
  downscaleInPlace(filePath, 'magick', [filePath, '-resize', `${MAX_LONG_EDGE}x${MAX_LONG_EDGE}>`, '__TMP__']);
}

function downscaleInPlace(filePath, command, argsTemplate) {
  const tmp = `${filePath}.downscale.tmp${path.extname(filePath)}`;
  try {
    execFileSync(command, argsTemplate.map(a => (a === '__TMP__' ? tmp : a)), { stdio: 'ignore' });
    if (fs.existsSync(tmp)) {
      fs.renameSync(tmp, filePath);
      return true;
    }
  } catch {
    // fall through to cleanup + return false
  }
  fs.rmSync(tmp, { force: true });
  return false;
}

function readImageDimensions(filePath) {
  try {
    const out = execFileSync('sips', ['-g', 'pixelWidth', '-g', 'pixelHeight', filePath], { encoding: 'utf8' });
    const width = /pixelWidth:\s*(\d+)/.exec(out);
    const height = /pixelHeight:\s*(\d+)/.exec(out);
    if (!width || !height) return null;
    return { width: Number(width[1]), height: Number(height[1]) };
  } catch {
    return null;
  }
}

// Extract the first frame as a sibling `<name>.poster.jpg`. The renderer always
// emits poster={…poster.jpg} for staged videos, so this MUST produce a file:
// if ffmpeg is unavailable or the source isn't decodable, fall back to a 1px
// placeholder so the poster never 404s.
function generateVideoPoster(videoPath) {
  const ext = path.extname(videoPath);
  const posterPath = path.join(path.dirname(videoPath), `${path.basename(videoPath, ext)}.poster.jpg`);
  try {
    execFileSync('ffmpeg', ['-i', videoPath, '-frames:v', '1', '-q:v', '4', '-y', posterPath], { stdio: 'ignore' });
  } catch {
    // ffmpeg missing or source not a decodable video — fall through to placeholder.
  }
  if (!fs.existsSync(posterPath)) {
    try {
      fs.writeFileSync(posterPath, Buffer.from(PLACEHOLDER_POSTER_B64, 'base64'));
    } catch {
      // poster is best-effort
    }
  }
}

function convertAvif(source, outDir, base, context, sourceId, existingRelative = '') {
  const attempts = [
    { ext: '.webp', mime: 'image/webp', command: 'magick', args: target => [source, target] },
    { ext: '.webp', mime: 'image/webp', command: 'sips', args: target => ['-s', 'format', 'webp', source, '--out', target] },
    { ext: '.png', mime: 'image/png', command: 'magick', args: target => [source, target] },
    { ext: '.png', mime: 'image/png', command: 'sips', args: target => ['-s', 'format', 'png', source, '--out', target] },
  ];
  const existingName = stagedNameFromRelative(existingRelative);
  if (existingName) {
    const existingExt = path.extname(existingName).toLowerCase();
    const matchingAttempts = attempts.filter(attempt => attempt.ext === existingExt);
    const converted = tryConvertAvif(source, outDir, existingRelative, matchingAttempts);
    if (converted) return converted;
  }
  const errors = [];
  for (const attempt of attempts) {
    const name = reserveName(base, attempt.ext, context, sourceId);
    const relative = path.posix.join('assets/user-media', name);
    const target = path.join(outDir, relative);
    const result = spawnSync(attempt.command, attempt.args(target), { encoding: 'utf8' });
    if (result.status === 0 && fs.existsSync(target)) {
      return {
        relative,
        mime: attempt.mime,
      };
    }
    context.usedNames.delete(name);
    fs.rmSync(target, { force: true });
    const message = `${attempt.command} ${attempt.ext}: ${result.stderr || result.stdout || result.error?.message || `exit ${result.status}`}`;
    errors.push(message.trim());
  }
  throw new Error(`Could not convert AVIF media file: ${source}\n${errors.join('\n')}`);
}

function tryConvertAvif(source, outDir, relative, attempts) {
  const target = path.join(outDir, relative);
  for (const attempt of attempts) {
    const result = spawnSync(attempt.command, attempt.args(target), { encoding: 'utf8' });
    if (result.status === 0 && fs.existsSync(target)) {
      return {
        relative,
        mime: attempt.mime,
      };
    }
  }
  return null;
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

// Exposed for unit tests (the CLI body above is guarded by isMainModule) and for
// scripts/persist-deck-state.mjs, which reuses generateVideoPoster for server-side
// media saved from data: URLs (same poster convention as CLI-staged video files).
export { slugify, resolveSourcePath, matchNormalizedEntry, normalizationForms, generateVideoPoster };
