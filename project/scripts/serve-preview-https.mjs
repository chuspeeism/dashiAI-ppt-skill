#!/usr/bin/env node
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync, statSync, createReadStream } from 'node:fs';
import https from 'node:https';
import os from 'node:os';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const SERVE_ROOT = path.resolve(ROOT, process.argv[2] || 'output/theme-preview/ppt');
const PORT = Number(process.env.PORT || process.argv[3] || 4178);
const HOST = process.env.HOST || '0.0.0.0';
const LOCAL_HOSTNAME = getLocalHostname();
const LAN_IPS = getLanIps();
const CERT_DIR = path.join(ROOT, 'output/https-preview');
const CERT_META = path.join(CERT_DIR, 'cert-meta.json');
const CERT_KEY = path.join(CERT_DIR, 'localhost-key.pem');
const CERT_FILE = path.join(CERT_DIR, 'localhost-cert.pem');

if (!existsSync(path.join(SERVE_ROOT, 'index.html'))) {
  console.error(`Preview index.html not found: ${path.join(SERVE_ROOT, 'index.html')}`);
  process.exit(1);
}

ensureCertificate();

const server = https.createServer(
  {
    key: readFileSync(CERT_KEY),
    cert: readFileSync(CERT_FILE),
  },
  (req, res) => {
    const pathname = safePathname(req.url || '/');
    const requested = path.join(SERVE_ROOT, pathname === '/' ? 'index.html' : pathname);
    const file = resolveFile(requested);

    if (!file) {
      res.writeHead(404, { 'content-type': 'text/plain;charset=utf-8' });
      res.end('Not found');
      return;
    }

    res.writeHead(200, {
      'content-type': contentType(file),
      'cache-control': 'no-store',
    });
    createReadStream(file).pipe(res);
  },
);

server.listen(PORT, HOST, () => {
  const primary = `https://${LOCAL_HOSTNAME}.local:${PORT}/`;
  const urls = [primary, ...LAN_IPS.map((ip) => `https://${ip}:${PORT}/`)];
  console.log(`HTTPS preview serving ${SERVE_ROOT}`);
  console.log(`Open: ${urls.join(' or ')}`);
});

function ensureCertificate() {
  mkdirSync(CERT_DIR, { recursive: true });
  const names = ['localhost', `${LOCAL_HOSTNAME}.local`, ...LAN_IPS];
  const meta = JSON.stringify({ names }, null, 2);
  const current = existsSync(CERT_META) ? readFileSync(CERT_META, 'utf8') : '';
  if (existsSync(CERT_KEY) && existsSync(CERT_FILE) && current === meta) return;

  const config = path.join(CERT_DIR, 'openssl.cnf');
  writeFileSync(config, renderOpenSslConfig(names));
  execFileSync('openssl', [
    'req',
    '-x509',
    '-newkey',
    'rsa:2048',
    '-nodes',
    '-sha256',
    '-days',
    '365',
    '-keyout',
    CERT_KEY,
    '-out',
    CERT_FILE,
    '-config',
    config,
    '-extensions',
    'v3_req',
  ], { stdio: 'ignore' });
  writeFileSync(CERT_META, meta + '\n');
}

function renderOpenSslConfig(names) {
  const altNames = [];
  let dns = 1;
  let ip = 1;
  for (const name of names) {
    if (/^\d+\.\d+\.\d+\.\d+$/.test(name)) altNames.push(`IP.${ip++} = ${name}`);
    else altNames.push(`DNS.${dns++} = ${name}`);
  }
  return `[req]
default_bits = 2048
prompt = no
default_md = sha256
distinguished_name = dn

[dn]
CN = ${LOCAL_HOSTNAME}.local

[v3_req]
subjectAltName = @alt_names
keyUsage = critical, digitalSignature, keyEncipherment
extendedKeyUsage = serverAuth

[alt_names]
${altNames.join('\n')}
`;
}

function safePathname(url) {
  const parsed = new URL(url, 'https://local.invalid');
  const decoded = decodeURIComponent(parsed.pathname);
  return decoded.split('/').filter((part) => part && part !== '..').join('/');
}

function resolveFile(file) {
  const resolved = path.resolve(file);
  if (!resolved.startsWith(SERVE_ROOT + path.sep) && resolved !== SERVE_ROOT) return null;
  try {
    const stat = statSync(resolved);
    if (stat.isDirectory()) return resolveFile(path.join(resolved, 'index.html'));
    if (stat.isFile()) return resolved;
  } catch {}
  return null;
}

function contentType(file) {
  const ext = path.extname(file).toLowerCase();
  return {
    '.html': 'text/html;charset=utf-8',
    '.js': 'text/javascript;charset=utf-8',
    '.mjs': 'text/javascript;charset=utf-8',
    '.css': 'text/css;charset=utf-8',
    '.json': 'application/json;charset=utf-8',
    '.svg': 'image/svg+xml',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.webp': 'image/webp',
    '.gif': 'image/gif',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
  }[ext] || 'application/octet-stream';
}

function getLocalHostname() {
  try {
    return execFileSync('scutil', ['--get', 'LocalHostName'], { encoding: 'utf8' }).trim() || os.hostname().split('.')[0];
  } catch {
    return os.hostname().split('.')[0] || 'localhost';
  }
}

function getLanIps() {
  const ips = [];
  for (const entries of Object.values(os.networkInterfaces())) {
    for (const entry of entries || []) {
      if (entry.family === 'IPv4' && !entry.internal) ips.push(entry.address);
    }
  }
  return [...new Set(ips)];
}
