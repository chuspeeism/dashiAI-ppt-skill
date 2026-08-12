import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const INSTALLER = path.join(HERE, 'install.mjs');

function createFixture() {
  const root = mkdtempSync(path.join(os.tmpdir(), 'dashi-ppt-installer-test-'));
  const home = path.join(root, 'home');
  const packageRoot = path.join(root, 'package');
  mkdirSync(path.join(packageRoot, 'bin'), { recursive: true });
  mkdirSync(path.join(packageRoot, 'skill', 'project'), { recursive: true });
  cpSync(INSTALLER, path.join(packageRoot, 'bin', 'install.mjs'));
  writeFileSync(path.join(packageRoot, 'package.json'), '{"version":"9.9.9"}\n');
  writeFileSync(path.join(packageRoot, 'skill', 'SKILL.md'), '# fixture\n');
  writeFileSync(path.join(packageRoot, 'skill', 'project', 'package-lock.json'), '{}\n');
  writeFileSync(path.join(packageRoot, 'skill', 'project', 'npmrc.template'), 'registry=https://registry.npmjs.org\n');
  return { root, home, installer: path.join(packageRoot, 'bin', 'install.mjs') };
}

function skillRoot(home, ...segments) {
  return path.join(home, ...segments, 'dashi-ppt');
}

function mkdir(home, ...segments) {
  mkdirSync(path.join(home, ...segments), { recursive: true });
}

function runInstaller(fixture, args = [], expectFailure = false) {
  try {
    const stdout = execFileSync(process.execPath, [fixture.installer, ...args], {
      encoding: 'utf8',
      env: { ...process.env, HOME: fixture.home, USERPROFILE: fixture.home },
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    if (expectFailure) assert.fail('installer was expected to fail');
    return { status: 0, stdout, stderr: '' };
  } catch (error) {
    if (!expectFailure) throw error;
    return {
      status: error.status,
      stdout: String(error.stdout || ''),
      stderr: String(error.stderr || ''),
    };
  }
}

function withFixture(callback) {
  const fixture = createFixture();
  try {
    callback(fixture);
  } finally {
    rmSync(fixture.root, { recursive: true, force: true });
  }
}

test('fresh install prefers the shared .agents skills root', () => {
  withFixture((fixture) => {
    mkdir(fixture.home, '.agents', 'skills');
    mkdir(fixture.home, '.codex', 'skills');

    runInstaller(fixture);

    assert.equal(existsSync(skillRoot(fixture.home, '.agents', 'skills')), true);
    assert.equal(existsSync(skillRoot(fixture.home, '.codex', 'skills')), false);
  });
});

test('fresh install falls back to the only detected host-specific root', () => {
  withFixture((fixture) => {
    mkdir(fixture.home, '.codex', 'skills');

    runInstaller(fixture);

    assert.equal(existsSync(skillRoot(fixture.home, '.codex', 'skills')), true);
  });
});

test('a single existing installation is updated in place', () => {
  withFixture((fixture) => {
    mkdir(fixture.home, '.agents', 'skills');
    mkdir(fixture.home, '.codex', 'skills', 'dashi-ppt');
    writeFileSync(path.join(skillRoot(fixture.home, '.codex', 'skills'), 'old.txt'), 'old\n');

    runInstaller(fixture);

    assert.equal(existsSync(skillRoot(fixture.home, '.agents', 'skills')), false);
    assert.equal(existsSync(path.join(skillRoot(fixture.home, '.codex', 'skills'), 'SKILL.md')), true);
    assert.equal(existsSync(path.join(skillRoot(fixture.home, '.codex', 'skills'), 'old.txt')), false);
  });
});

test('a legacy installation is selected and migrated in place', () => {
  withFixture((fixture) => {
    mkdir(fixture.home, '.agents', 'skills');
    mkdir(fixture.home, '.codex', 'skills', 'dashiai-ppt');

    runInstaller(fixture);

    assert.equal(existsSync(skillRoot(fixture.home, '.agents', 'skills')), false);
    assert.equal(existsSync(skillRoot(fixture.home, '.codex', 'skills')), true);
    assert.equal(existsSync(path.join(fixture.home, '.codex', 'skills', 'dashiai-ppt')), false);
  });
});

test('multiple existing installations require an explicit choice', () => {
  withFixture((fixture) => {
    mkdir(fixture.home, '.agents', 'skills', 'dashi-ppt');
    mkdir(fixture.home, '.codex', 'skills', 'dashi-ppt');

    const result = runInstaller(fixture, [], true);

    assert.equal(result.status, 2);
    assert.match(result.stderr, /检测到多份 dashi-ppt 安装/);
    assert.match(result.stderr, /--dir/);
    assert.match(result.stderr, /--all/);
    assert.equal(existsSync(path.join(skillRoot(fixture.home, '.agents', 'skills'), 'SKILL.md')), false);
    assert.equal(existsSync(path.join(skillRoot(fixture.home, '.codex', 'skills'), 'SKILL.md')), false);
  });
});

test('multiple host-specific roots require an explicit choice', () => {
  withFixture((fixture) => {
    mkdir(fixture.home, '.claude', 'skills');
    mkdir(fixture.home, '.codex', 'skills');

    const result = runInstaller(fixture, [], true);

    assert.equal(result.status, 2);
    assert.match(result.stderr, /检测到多个技能目录/);
    assert.equal(existsSync(skillRoot(fixture.home, '.claude', 'skills')), false);
    assert.equal(existsSync(skillRoot(fixture.home, '.codex', 'skills')), false);
  });
});

test('--all installs into every detected root', () => {
  withFixture((fixture) => {
    mkdir(fixture.home, '.agents', 'skills');
    mkdir(fixture.home, '.codex', 'skills');

    runInstaller(fixture, ['--all']);

    assert.equal(existsSync(skillRoot(fixture.home, '.agents', 'skills')), true);
    assert.equal(existsSync(skillRoot(fixture.home, '.codex', 'skills')), true);
  });
});

test('--dir installs only into the explicitly selected root', () => {
  withFixture((fixture) => {
    mkdir(fixture.home, '.agents', 'skills');
    mkdir(fixture.home, '.codex', 'skills');
    const selected = path.join(fixture.home, '.codex', 'skills');

    runInstaller(fixture, ['--dir', selected]);

    assert.equal(existsSync(skillRoot(fixture.home, '.agents', 'skills')), false);
    assert.equal(existsSync(skillRoot(fixture.home, '.codex', 'skills')), true);
  });
});

test('no detected root reports an actionable error', () => {
  withFixture((fixture) => {
    const result = runInstaller(fixture, [], true);

    assert.equal(result.status, 2);
    assert.match(result.stderr, /未探测到技能目录/);
    assert.match(result.stderr, /--dir/);
  });
});

test('--dir and --all are mutually exclusive', () => {
  withFixture((fixture) => {
    const selected = path.join(fixture.home, '.codex', 'skills');
    const result = runInstaller(fixture, ['--dir', selected, '--all'], true);

    assert.equal(result.status, 2);
    assert.match(result.stderr, /不能同时使用/);
    assert.equal(existsSync(selected), false);
  });
});
