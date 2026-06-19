#!/usr/bin/env node
import fs from 'node:fs';
import https from 'node:https';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const SKILL_ROOT = path.resolve(SCRIPT_DIR, '..');
const INSTALLED_PACKAGE = path.join(SKILL_ROOT, 'project/package.json');
const SOURCE_PACKAGE = path.join(SKILL_ROOT, 'package.json');
const REMOTE_PACKAGE_URL = 'https://raw.githubusercontent.com/jadon7/dashi-ppt-skill/main/project/package.json';
const REQUEST_TIMEOUT_MS = 8000;

main().catch(() => {});

async function main() {
  const localVersion = readLocalVersion();
  if (!localVersion) return;
  const remoteVersion = await readRemoteVersion();
  if (!remoteVersion) return;
  if (compareVersions(remoteVersion, localVersion) <= 0) return;
  process.stdout.write(
    `发现 DashAI PPT 新版本 ${remoteVersion}（当前 ${localVersion}）。建议更新：重新拉取 https://github.com/jadon7/dashi-ppt-skill 后替换本地 DashAI PPT。\n`
  );
}

function readLocalVersion() {
  const packagePath = fs.existsSync(INSTALLED_PACKAGE) ? INSTALLED_PACKAGE : SOURCE_PACKAGE;
  try {
    return JSON.parse(fs.readFileSync(packagePath, 'utf8')).version || '';
  } catch {
    return '';
  }
}

function readRemoteVersion() {
  return new Promise(resolve => {
    const request = https.get(REMOTE_PACKAGE_URL, { timeout: REQUEST_TIMEOUT_MS }, response => {
      if (response.statusCode !== 200) {
        response.resume();
        resolve('');
        return;
      }
      let body = '';
      response.setEncoding('utf8');
      response.on('data', chunk => {
        body += chunk;
      });
      response.on('end', () => {
        try {
          resolve(JSON.parse(body).version || '');
        } catch {
          resolve('');
        }
      });
    });
    request.on('timeout', () => {
      request.destroy();
      resolve('');
    });
    request.on('error', () => resolve(''));
  });
}

function compareVersions(a, b) {
  const left = parseVersion(a);
  const right = parseVersion(b);
  for (let index = 0; index < Math.max(left.length, right.length); index += 1) {
    const delta = (left[index] || 0) - (right[index] || 0);
    if (delta !== 0) return delta;
  }
  return 0;
}

function parseVersion(version) {
  return String(version)
    .replace(/^v/i, '')
    .split(/[.-]/)
    .map(part => Number.parseInt(part, 10))
    .filter(Number.isFinite);
}
