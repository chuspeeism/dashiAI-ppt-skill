#!/usr/bin/env node
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { GENERATED_THEME_PACKS } from '../src/components/themes/generated-metadata.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const tests = [
  ['layout-query returns compact media candidates', testLayoutQuery],
  ['inspect-layout exposes copy/media/count/control contract', testInspectLayout],
  ['write-safe-props preserves default array tail and count', testWriteSafeProps],
  ['media workflow supports planned/provided/image-gen slots', testMediaWorkflow],
  ['deck composer constrains media-aware roles', testDeckComposerMediaRoles],
  ['skill prompt keeps user-visible style and image-slot guidance', testSkillPromptGuidance],
  ['validate-goal-spec rejects unsafe goal shapes', testValidateGoalSpec],
  ['preview panel handles type: images as an image list control', testImagesControl],
];

const failures = [];

for (const [name, fn] of tests) {
  try {
    fn();
    console.log(`ok - ${name}`);
  } catch (error) {
    failures.push([name, error]);
    console.error(`not ok - ${name}`);
    console.error(`  ${error.message}`);
  }
}

if (failures.length) {
  console.error(`\n${failures.length} skill workflow validation test(s) failed.`);
  process.exit(1);
}

console.log('\nSkill workflow tool validation passed.');

function testLayoutQuery() {
  const result = runJson('scripts/layout-query.mjs', [
    '--theme', 'theme01',
    '--role', 'case',
    '--needs-media',
    '--keyword', '案例',
    '--limit', '5',
  ]);
  assert(Array.isArray(result.layouts), 'expected layouts array');
  assert(result.layouts.length > 0 && result.layouts.length <= 5, 'expected 1..5 layouts');
  assert(JSON.stringify(result).length < 7000, 'layout-query output is too large');
  assert(result.layouts.every(item => item.layout?.startsWith('theme01_')), 'expected theme01 layouts only');
  assert(result.layouts.some(item => item.mediaSlots?.length), 'expected at least one media slot candidate');
}

function testInspectLayout() {
  const result = runJson('scripts/inspect-layout.mjs', ['theme01_page020']);
  assert(result.layout === 'theme01_page020', 'unexpected layout');
  assert(result.copyKeys?.includes('title'), 'missing title copy key');
  assert(result.copyKeys?.includes('caption'), 'missing caption copy key');
  assert(result.arrayKeys?.includes('items'), 'missing items array key');
  assert(result.mediaSlots?.some(slot => slot.field === 'images' && slot.countKey === 'imageSlotCount'), 'missing images media slot');
  assert(result.countBindings?.some(binding => binding.key === 'imageSlotCount'), 'missing imageSlotCount binding');
  assert(result.controlKeys?.includes('images'), 'missing images control key');
  assert(JSON.stringify(result).length < 9000, 'inspect-layout output is too large');
}

function testWriteSafeProps() {
  const input = {
    title: '头部案例',
    images: ['hero-a.png', 'hero-b.png'],
    items: [
      { label: 'Alpha', sub: '第一项', amount: '10 亿' },
      { label: 'Beta', sub: '第二项', amount: '8 亿' },
    ],
  };
  const result = runJson('scripts/write-safe-props.mjs', ['theme01_page020', JSON.stringify(input)]);
  assert(!result.errors?.length, `unexpected errors: ${JSON.stringify(result.errors)}`);
  assert(result.props?.imageSlotCount === 2, 'expected imageSlotCount derived from authored images');
  assert(result.props?.images?.length >= 5, 'expected images default tail to be preserved');
  assert(result.props?.items?.length >= 5, 'expected items default tail to be preserved');
  const itemTail = result.props.items.slice(2);
  const tailText = JSON.stringify(itemTail);
  assert(!tailText.includes('xAI') && !tailText.includes('CoreWeave') && !tailText.includes('Figure AI'), 'expected item tail to remove template default copy');
  assert(itemTail[0].label.includes('请'), 'expected neutral editable placeholder in item tail');
  assert(charLength(itemTail[0].label) === charLength('xAI'), 'expected placeholder label length to match default label length');
  assert(charLength(itemTail[0].sub) === charLength('通用大模型'), 'expected placeholder sub length to match default sub length');
  assert(itemTail[0].tone === 'green', 'expected non-copy visual fields to stay intact');
  const unknown = runJson('scripts/write-safe-props.mjs', ['theme01_page020', JSON.stringify({ madeUpProp: true })]);
  assert(unknown.warnings?.some(item => item.includes('madeUpProp')), 'expected unknown prop warning');
}

function testMediaWorkflow() {
  const planned = runJson('scripts/layout-query.mjs', [
    '--theme', 'theme01',
    '--role', 'case',
    '--planned-images',
    '--limit', '4',
  ]);
  assert(planned.mediaIntent === 'planned-images', 'expected planned-images media intent');
  assert(planned.layouts.length > 0, 'expected planned image candidates');
  assert(planned.layouts.every(item => item.mediaSlots?.length), 'planned image candidates must all expose media slots');
  assert(planned.layouts.some(item => item.mediaSlots.some(slot => Number(slot.max || 0) >= 3)), 'expected a candidate that can keep 3 image slots');

  const imageGen = runJson('scripts/layout-query.mjs', [
    '--theme', 'theme01',
    '--role', 'image',
    '--image-gen',
    '--limit', '3',
  ]);
  assert(imageGen.mediaIntent === 'image-gen', 'expected image-gen media intent');
  assert(imageGen.layouts.length > 0, 'expected image-gen candidates');
  assert(imageGen.layouts.every(item => item.mediaSlots?.length), 'image-gen candidates must all expose media slots');

  const mediaCount = runJson('scripts/layout-query.mjs', [
    '--theme', 'theme01',
    '--media-count', '3',
    '--limit', '3',
  ]);
  assert(mediaCount.mediaCount === 3, 'expected media-count to be reflected');
  assert(mediaCount.needsMedia === true, 'media-count should mark needsMedia=true');
  assert(mediaCount.layouts.length > 0, 'expected media-count candidates');
  assert(mediaCount.layouts.every(item => item.mediaSlots?.length), 'media-count candidates must all expose media slots');

  const provided = runJson('scripts/write-safe-props.mjs', [
    'theme01_page020',
    JSON.stringify({ title: '提供图片案例' }),
    '--images',
    'a.png',
    'b.png',
    'c.png',
  ]);
  assert(provided.mediaIntent === 'provided-images', 'expected provided-images media intent');
  assert(provided.props?.imageSlotCount === 3, 'provided images should set imageSlotCount=3');
  assert(provided.props?.images?.slice(0, 3).join('|') === 'a.png|b.png|c.png', 'provided images should map to props.images');
  assert(provided.props?.images?.length >= 5, 'provided images should preserve default media tail');

  const tmp = mkdtempSync(path.join(tmpdir(), 'dashi-media-goal-'));
  try {
    expectGoalFailure(tmp, 'needs-visual-no-slot.json', {
      title: 'Needs Visual',
      goal: 'should fail',
      themePack: 'theme01',
      slides: [{ layout: 'theme01_page006', needsVisual: true, props: { title: '需要图片' } }],
    }, ['slide 1', 'theme01_page006', 'needsVisual', 'media slot']);

    expectGoalFailure(tmp, 'provided-images-not-written.json', {
      title: 'Provided Images',
      goal: 'should fail',
      themePack: 'theme01',
      slides: [{ layout: 'theme01_page020', providedImages: ['a.png', 'b.png', 'c.png'], props: { title: '未写入图片' } }],
    }, ['slide 1', 'theme01_page020', 'providedImages', 'props.images']);

    const plannedOk = path.join(tmp, 'planned-ok.json');
    writeFileSync(plannedOk, JSON.stringify({
      title: 'Planned Images',
      goal: 'should pass',
      themePack: 'theme01',
      slides: [{ layout: 'theme01_page020', needsVisual: true, plannedImages: 3, props: { title: '保留图片位' } }],
    }, null, 2));
    execFileSync('node', ['scripts/validate-goal-spec.mjs', plannedOk], { cwd: ROOT, stdio: 'pipe' });

    const imageGenOk = path.join(tmp, 'image-gen-ok.json');
    writeFileSync(imageGenOk, JSON.stringify({
      title: 'Image Gen',
      goal: 'should pass',
      themePack: 'theme01',
      slides: [{ layout: 'theme01_page020', imageGen: true, props: { title: '后续生成图片' } }],
    }, null, 2));
    execFileSync('node', ['scripts/validate-goal-spec.mjs', imageGenOk], { cwd: ROOT, stdio: 'pipe' });
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
}

function testDeckComposerMediaRoles() {
  const tsx = path.join(ROOT, 'node_modules', '.bin', 'tsx');
  const script = `
    import { composeDeck } from './src/deckComposer.jsx';
    import { inspectLayout } from './scripts/skill-workflow-utils.mjs';
    const coverDeck = composeDeck({
      title: 'Cover Role',
      goal: 'should use first five pages',
      themePack: 'theme01',
      randomSeed: 'cover-regression-3',
      slides: [{ role: 'cover', props: { title: '封面' } }]
    });
    const coverLayout = coverDeck.slides[0].layout;
    if (!/^theme\\d+_page00[1-5]$/.test(coverLayout)) {
      console.error(JSON.stringify({ role: 'cover', layout: coverLayout }));
      process.exit(4);
    }

    const deck = composeDeck({
      title: 'Media Role',
      goal: 'should use slots',
      themePack: 'theme08',
      randomSeed: 'media-role-regression',
      slides: [{ role: 'image', needsVisual: true, props: { headline: '视觉页' } }]
    });
    const slide = deck.slides[0];
    if (!slide.layout || !slide.layout.startsWith('theme08_')) process.exit(2);
    const details = inspectLayout(slide.layout);
    if (!details?.mediaSlots?.length) {
      console.error(JSON.stringify({ layout: slide.layout, mediaSlots: details?.mediaSlots || [] }));
      process.exit(3);
    }

    const visualCaseDeck = composeDeck({
      title: 'Visual Case',
      goal: 'case role should keep slots when needed',
      themePack: 'theme01',
      randomSeed: 'visual-case-regression',
      slides: [{ role: 'case', needsVisual: true, props: { title: '需要视觉案例' } }]
    });
    const visualCaseSlide = visualCaseDeck.slides[0];
    const visualCaseDetails = inspectLayout(visualCaseSlide.layout);
    if (!visualCaseDetails?.mediaSlots?.length) {
      console.error(JSON.stringify({ role: 'case', layout: visualCaseSlide.layout, mediaSlots: visualCaseDetails?.mediaSlots || [] }));
      process.exit(5);
    }
  `;
  execFileSync(tsx, ['-e', script], { cwd: ROOT, stdio: 'pipe' });
}

function testSkillPromptGuidance() {
  const skill = readFileSync(path.join(ROOT, 'SKILL.md'), 'utf8');
  const sync = readFileSync(path.join(ROOT, 'scripts/sync-skill.mjs'), 'utf8');
  const missing = [];
  if (!skill.includes('assets/skill/theme-style-grid.png')) missing.push('style grid image path');
  if (!(/风格选择提问/.test(skill) && /用户可见回复/.test(skill))) missing.push('user-visible style-choice reply rule');
  if (!/不能只在.*进度/.test(skill)) missing.push('progress-only style image warning');
  if (!(/用户未提供图片/.test(skill) && /询问/.test(skill) && /预留图片槽/.test(skill))) missing.push('ask-to-reserve-image-slots rule');
  for (const term of ['作品集', '品牌', '产品', '案例', '活动', '发布', '社媒', '设计', '人物', '团队', '方案展示']) {
    if (!skill.includes(term)) missing.push(`visual task trigger ${term}`);
  }
  if (!(/不能默认.*图片 slot.*0/.test(skill) || /不能默认.*图片槽.*0/.test(skill))) missing.push('do-not-default-image-slot-count-to-0 rule');
  if (!skill.includes('--planned-images <n>')) missing.push('planned-images workflow guidance');
  if (!skill.includes('--provided-images <n>')) missing.push('provided-images workflow guidance');
  if (!skill.includes('--image-gen')) missing.push('image-gen workflow guidance');
  const styleHintLines = skill.match(/`theme\d+`[^。\n]*适合[:：][^。\n]*人群[:：][^。\n]*/g) || [];
  if (styleHintLines.length !== 12) missing.push('12 short style scene/audience hints in the user-visible style-choice reply');
  for (const theme of GENERATED_THEME_PACKS) {
    const line = styleHintLines.find(item => item.includes(`\`${theme.key}\``)) || '';
    if (!line.includes(theme.displayName)) missing.push(`metadata displayName for ${theme.key}`);
    if (!line.includes(shortThemeText(theme.scenario))) missing.push(`metadata scenario for ${theme.key}`);
    if (!line.includes(shortThemeText(theme.audience))) missing.push(`metadata audience for ${theme.key}`);
  }
  for (const oldName of ['01-轻拟态质感', 'PULSE 色谱图表', '黑金实验质感']) {
    if (skill.includes(oldName)) missing.push(`old theme name ${oldName}`);
  }
  if (!sync.includes('theme-style-grid.png')) missing.push('sync style grid asset handling');
  if (/THEME_CHOICE_HINTS/.test(sync)) missing.push('hardcoded THEME_CHOICE_HINTS table');
  assert(!missing.length, `Skill prompt guidance missing: ${missing.join(', ')}`);
}

function testValidateGoalSpec() {
  const tmp = mkdtempSync(path.join(tmpdir(), 'dashi-goal-spec-'));
  try {
    expectGoalFailure(tmp, 'role-only.json', {
      title: 'Role Only',
      goal: 'should fail',
      themePack: 'theme01',
      slides: [{ role: 'case' }],
    }, ['slide 1', 'layout', 'role']);

    expectGoalFailure(tmp, 'media-field.json', {
      title: 'Media Field',
      goal: 'should fail',
      themePack: 'theme01',
      slides: [{ layout: 'theme01_page020', media: { images: ['x.png'] }, props: { title: 'x' } }],
    }, ['slide 1', 'theme01_page020', 'media', 'props.images']);

    expectGoalFailure(tmp, 'top-level-media.json', {
      title: 'Top Level Media',
      goal: 'should fail',
      themePack: 'theme01',
      media: { images: ['x.png'] },
      slides: [{ layout: 'theme01_page020', props: { title: 'x' } }],
    }, ['deck', 'media', 'props.images']);

    expectGoalFailure(tmp, 'unknown-prop.json', {
      title: 'Unknown Prop',
      goal: 'should fail',
      themePack: 'theme01',
      slides: [{ layout: 'theme01_page020', props: { madeUpProp: 'x' } }],
    }, ['slide 1', 'theme01_page020', 'madeUpProp']);

    expectGoalFailure(tmp, 'multi-cover.json', {
      title: 'Multi Cover',
      goal: 'should fail',
      themePack: 'theme01',
      slides: [
        { layout: 'theme01_page001', props: { title: 'a' } },
        { layout: 'theme01_page002', props: { title: 'b' } },
      ],
    }, ['cover', 'theme01_page001', 'theme01_page002']);

    expectGoalFailure(tmp, 'html-prop.json', {
      title: 'HTML Prop',
      goal: 'should fail',
      themePack: 'theme01',
      slides: [{ layout: 'theme01_page020', props: { title: '<div>自由 HTML</div>' } }],
    }, ['slide 1', 'theme01_page020', 'title', 'HTML']);

    const validPath = path.join(tmp, 'valid.json');
    writeFileSync(validPath, JSON.stringify({
      title: 'Valid',
      goal: 'should pass',
      themePack: 'theme01',
      slides: [{ layout: 'theme01_page020', props: { title: '头部案例', images: ['x.png'] } }],
    }, null, 2));
    execFileSync('node', ['scripts/validate-goal-spec.mjs', validPath], { cwd: ROOT, stdio: 'pipe' });
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
}

function testImagesControl() {
  const source = execFileSync('node', ['-e', `
    const fs = require('fs');
    const src = fs.readFileSync('assets/template-swiss.html', 'utf8');
    if (!/type\\s*===\\s*['"]images['"]/.test(src)) process.exit(2);
    if (!/image-list/.test(src)) process.exit(3);
    if (!/pp-image-list/.test(src)) process.exit(4);
  `], { cwd: ROOT, encoding: 'utf8', stdio: 'pipe' });
  assert(source === '', 'unexpected template probe output');
}

function expectGoalFailure(tmp, name, goal, expectedTerms) {
  const file = path.join(tmp, name);
  writeFileSync(file, JSON.stringify(goal, null, 2));
  const result = spawnSync('node', ['scripts/validate-goal-spec.mjs', file], {
    cwd: ROOT,
    encoding: 'utf8',
  });
  assert(result.status !== 0, `${name} unexpectedly passed`);
  const output = `${result.stdout}\n${result.stderr}`;
  for (const term of expectedTerms) {
    assert(output.includes(term), `${name} missing error term: ${term}\n${output}`);
  }
}

function runJson(script, args) {
  const stdout = execFileSync('node', [script, ...args], {
    cwd: ROOT,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  return JSON.parse(stdout);
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function charLength(value) {
  return Array.from(String(value || '')).length;
}

function shortThemeText(value) {
  return String(value || '')
    .split(/[、,，]/)
    .map(item => item.trim())
    .filter(Boolean)
    .slice(0, 2)
    .join(' / ');
}
