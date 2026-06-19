#!/usr/bin/env node
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const MACHINE_ID = 'dashiai-ppt';
const SKILL_DISPLAY_NAME = 'DashAI PPT';
const REPO_DISPLAY_NAME = 'DashAI PPT DEV';
const LEGACY_DISPLAY_NAMES = ['Dashi ' + 'PPT Skill', 'Dashi ' + 'Skill'];
const SKILL_ROOT = process.env.DASHI_PPT_SKILL_ROOT || path.join(os.homedir(), `.agents/skills/${MACHINE_ID}`);
const LEGACY_SKILL_ROOT = path.join(os.homedir(), '.agents/skills/dashi-ppt-skill');

const args = new Set(process.argv.slice(2));
const shouldCheckInstalled = args.has('--installed');
const failures = [];

checkSkillFile(path.join(ROOT, 'SKILL.md'), 'source SKILL.md');
checkPackageName(path.join(ROOT, 'package.json'), 'source package.json');
checkPackageName(path.join(ROOT, 'package-lock.json'), 'source package-lock.json');

checkBrandFile(path.join(ROOT, 'SKILL.md'), 'source SKILL.md', {
  displayName: SKILL_DISPLAY_NAME,
  requiredHeading: `# ${SKILL_DISPLAY_NAME}`,
});
checkBrandFile(path.join(ROOT, 'README.md'), 'source README.md', {
  displayName: REPO_DISPLAY_NAME,
  requiredHeading: `# ${REPO_DISPLAY_NAME}`,
});
checkBrandFile(path.join(ROOT, 'scripts/sync-skill.mjs'), 'skill sync generator');
checkBrandFile(path.join(ROOT, 'scripts/check_latest_version.mjs'), 'version update prompt');
checkBrandFile(path.join(ROOT, 'src/export-pdf/screenshot.mjs'), 'PDF author metadata');
checkBrandFile(path.join(ROOT, 'src/export-pptx/editable.mjs'), 'PPTX author metadata');
checkBrandFile(path.join(ROOT, 'scripts/validate-skill-workflow-tools.mjs'), 'workflow fixture content');

if (shouldCheckInstalled) {
  checkSkillFile(path.join(SKILL_ROOT, 'SKILL.md'), 'installed SKILL.md');
  checkBrandFile(path.join(SKILL_ROOT, 'SKILL.md'), 'installed SKILL.md', { requiredHeading: `# ${SKILL_DISPLAY_NAME}` });
  checkBrandFile(path.join(SKILL_ROOT, 'README.md'), 'installed README.md', { requiredHeading: `# ${SKILL_DISPLAY_NAME}` });
  if (SKILL_ROOT !== LEGACY_SKILL_ROOT && fs.existsSync(path.join(LEGACY_SKILL_ROOT, 'SKILL.md'))) {
    failures.push(`legacy installed skill metadata still exists at ${path.join(LEGACY_SKILL_ROOT, 'SKILL.md')}`);
  }
}

if (failures.length) {
  console.error(`Skill name validation failed (${failures.length}):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

const checked = shouldCheckInstalled ? `source and installed skill at ${SKILL_ROOT}` : 'source skill';
console.log(`Skill name validation passed for ${SKILL_DISPLAY_NAME} (${MACHINE_ID}) in ${checked}.`);

function checkSkillFile(filePath, label) {
  const content = readRequired(filePath, label);
  if (!content) return;
  const frontmatter = content.match(/^---\n([\s\S]*?)\n---/);
  if (!frontmatter) {
    failures.push(`${label} is missing YAML frontmatter`);
    return;
  }
  const name = frontmatter[1].match(/^name:\s*([a-z0-9-]+)\s*$/m)?.[1] || '';
  if (!name) failures.push(`${label} is missing a machine-readable name`);
  if (name && !/^[a-z0-9-]+$/.test(name)) failures.push(`${label} name "${name}" is not lowercase letters, digits, and hyphens only`);
  if (name && name !== MACHINE_ID) failures.push(`${label} name "${name}" should remain "${MACHINE_ID}"`);
}

function checkPackageName(filePath, label) {
  const content = readRequired(filePath, label);
  if (!content) return;
  try {
    const parsed = JSON.parse(content);
    if (parsed.name && parsed.name !== MACHINE_ID) failures.push(`${label} name "${parsed.name}" should remain "${MACHINE_ID}"`);
    if (parsed.packages?.['']?.name && parsed.packages[''].name !== MACHINE_ID) {
      failures.push(`${label} root package name "${parsed.packages[''].name}" should remain "${MACHINE_ID}"`);
    }
  } catch (error) {
    failures.push(`${label} is not valid JSON: ${error.message}`);
  }
}

function checkBrandFile(filePath, label, options = {}) {
  const content = readRequired(filePath, label);
  if (!content) return;
  const displayName = options.displayName || SKILL_DISPLAY_NAME;
  if (!content.includes(displayName)) failures.push(`${label} does not include visible display name "${displayName}"`);
  if (options.requiredHeading && !content.includes(options.requiredHeading)) {
    failures.push(`${label} does not include heading "${options.requiredHeading}"`);
  }
  for (const legacyName of LEGACY_DISPLAY_NAMES) {
    if (content.includes(legacyName)) failures.push(`${label} still includes legacy visible name "${legacyName}"`);
  }
}

function readRequired(filePath, label) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    failures.push(`${label} could not be read at ${filePath}: ${error.message}`);
    return '';
  }
}
