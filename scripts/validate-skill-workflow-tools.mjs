#!/usr/bin/env node
import { execFileSync, spawnSync } from 'node:child_process';
import { existsSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PNG } from 'pngjs';
import { GENERATED_THEME_PACKS } from '../src/components/themes/generated-metadata.js';
import {
  ACCEPTED_THEME_KEYS,
  filterAcceptedThemePacks,
} from '../src/accepted-themes.mjs';
import { RUNTIME_ASSET_PATHS } from '../src/runtime-assets.mjs';
import { inspectLayout } from './skill-workflow-utils.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ACCEPTED_THEME_PACKS = filterAcceptedThemePacks(GENERATED_THEME_PACKS);

const tests = [
  ['layout-query returns compact media candidates', testLayoutQuery],
  ['inspect-layout exposes copy/media/count/control contract', testInspectLayout],
  ['write-safe-props preserves default array tail and count', testWriteSafeProps],
  ['media workflow supports planned/provided/image-gen slots', testMediaWorkflow],
  ['deck composer constrains media-aware roles', testDeckComposerMediaRoles],
  ['skill prompt keeps user-visible style and image-slot guidance', testSkillPromptGuidance],
  ['skill prompt covers Codex image-gen and export delivery guidance', testCodexImageGenExportDeliveryGuidance],
  ['skill tools expose only accepted themes', testAcceptedThemeExposure],
  ['synced skill output only uses accepted themes and runtime assets', testSyncedSkillOutput],
  ['validate-swiss fails on missing referenced runtime assets', testValidateSwissMissingAsset],
  ['skill delivery uses HTTP/HTTPS preview for export support', testHttpPreviewDelivery],
  ['validate-goal-spec rejects unsafe goal shapes', testValidateGoalSpec],
  ['checked-in goal examples pass goal spec', testCheckedInGoalExamples],
  ['preview panel handles type: images as an image list control', testImagesControl],
  ['control naming stays generic across user and agent contracts', testControlNaming],
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

function testControlNaming() {
  const result = spawnSync('node', ['scripts/validate-control-naming.mjs'], {
    cwd: ROOT,
    encoding: 'utf8',
  });
  if (result.status === 0) return;
  const output = `${result.stdout}\n${result.stderr}`;
  const failures = output
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.startsWith('- '))
    .map(line => line.slice(2));
  assert(failures.length, `Control naming validation failed:\n${output.trim()}`);
  const unexpected = failures.filter(line => {
    const match = line.match(/^inspect-layout missing (theme\d+)_page\d+$/);
    return !match || ACCEPTED_THEME_KEYS.includes(match[1]);
  });
  assert(!unexpected.length, `Control naming validation failed:\n${unexpected.join('\n')}`);
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

  const quadrant = runJson('scripts/inspect-layout.mjs', ['theme01_page031']);
  assert(quadrant.propShapes?.quadrants?.[0]?.title === 'string', 'inspect-layout should expose array item shape');
  assert(quadrant.propShapes?.quadrants?.[0]?.chips?.[0] === 'string', 'inspect-layout should expose nested array shape');
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
  assert(result.props?.images?.join('|') === 'hero-a.png|hero-b.png', 'expected authored images to stay explicit without default image tail');
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

  const badNested = spawnSync('node', ['scripts/write-safe-props.mjs', 'theme01_page031', JSON.stringify({
    quadrants: [{ name: '高频低风险', desc: '错误字段应该被拒绝' }],
  })], {
    cwd: ROOT,
    encoding: 'utf8',
  });
  assert(badNested.status !== 0, 'expected malformed nested array props to fail');
  assert(`${badNested.stdout}\n${badNested.stderr}`.includes('props.quadrants[0].name'), 'expected nested prop shape error for quadrants[0].name');
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
  assert(provided.props?.images?.length === 3, 'provided images should stay explicit without default media tail');

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
  if (!skill.includes('<skill-root>/assets/skill/theme-style-grid.png')) missing.push('style grid absolute skill-root path');
  if (!(/Markdown 图片/.test(skill) && /绝对路径/.test(skill))) missing.push('style grid markdown absolute-path guidance');
  if (!(/风格选择提问/.test(skill) && /用户可见回复/.test(skill))) missing.push('user-visible style-choice reply rule');
  if (!/不能只在.*进度/.test(skill)) missing.push('progress-only style image warning');
  if (!(/视觉素材任务/.test(skill) && /先问/.test(skill) && /预留图片槽/.test(skill))) missing.push('ask-to-reserve-image-slots rule');
  if (!(/不能默认.*图片 slot.*0/.test(skill) || /不能默认.*图片槽.*0/.test(skill))) missing.push('do-not-default-image-slot-count-to-0 rule');
  if (!skill.includes('--planned-images <n>')) missing.push('planned-images workflow guidance');
  if (!skill.includes('--provided-images <n>')) missing.push('provided-images workflow guidance');
  if (!skill.includes('--image-gen')) missing.push('image-gen workflow guidance');
  for (const term of ['随意', '自拟', '你来定', '不用问', '直接开干']) {
    if (!skill.includes(term)) missing.push(`delegated no-question mode term ${term}`);
  }
  if (!/已验收主题[\s\S]{0,80}默认 HTML[\s\S]{0,80}默认不使用 image-gen/.test(skill)) {
    missing.push('delegated mode defaults to accepted themes, no image-gen, and HTML');
  }
  const styleHintLines = skill.match(/`theme\d+`[^。\n]*适合[:：][^。\n]*人群[:：][^。\n]*/g) || [];
  if (styleHintLines.length !== ACCEPTED_THEME_KEYS.length) missing.push('accepted-theme short style scene/audience hints in the user-visible style-choice reply');
  for (const theme of ACCEPTED_THEME_PACKS) {
    const line = styleHintLines.find(item => item.includes(`\`${theme.key}\``)) || '';
    if (!line.includes(theme.displayName)) missing.push(`metadata displayName for ${theme.key}`);
    if (!line.includes(shortThemeText(theme.scenario))) missing.push(`metadata scenario for ${theme.key}`);
    if (!line.includes(shortThemeText(theme.audience))) missing.push(`metadata audience for ${theme.key}`);
  }
  for (const theme of GENERATED_THEME_PACKS.filter(item => !ACCEPTED_THEME_KEYS.includes(item.key))) {
    if (skill.includes(`\`${theme.key}\``)) missing.push(`unaccepted theme exposed in SKILL.md: ${theme.key}`);
  }
  for (const oldName of ['01-轻拟态质感', 'PULSE 色谱图表', '黑金实验质感']) {
    if (skill.includes(oldName)) missing.push(`old theme name ${oldName}`);
  }
  if (!sync.includes('theme-style-grid.png')) missing.push('sync style grid asset handling');
  if (/THEME_CHOICE_HINTS/.test(sync)) missing.push('hardcoded THEME_CHOICE_HINTS table');
  assert(!missing.length, `Skill prompt guidance missing: ${missing.join(', ')}`);
}

function testCodexImageGenExportDeliveryGuidance() {
  const skill = readFileSync(path.join(ROOT, 'SKILL.md'), 'utf8');
  const sync = readFileSync(path.join(ROOT, 'scripts/sync-skill.mjs'), 'utf8');
  const missing = [];
  if (!/Codex\s*环境/.test(skill)) missing.push('Codex environment detection rule');
  if (!/Codex\s*环境[\s\S]{0,160}image-gen[\s\S]{0,120}生成图片/.test(skill)) missing.push('Codex image-gen prompt guidance');
  if (!/询问用户/.test(skill) && !/先询问/.test(skill)) missing.push('ask user before image-gen guidance');
  if (!/(预览\s*(URL|链接|地址)|本机 HTTP)/.test(skill)) missing.push('final delivery preview URL requirement');
  if (!/HTML 文件路径/.test(skill)) missing.push('final delivery HTML file path requirement');
  if (!/本机 HTTP[\s\S]{0,80}导出[\s\S]{0,80}(PPT|PPTX)/.test(skill)) missing.push('HTTP export-capable delivery distinction');
  if (!/(file:\/\/|本地 HTML)[\s\S]{0,120}不能导出可编辑 PPTX/.test(skill)) missing.push('file local HTML cannot export editable PPTX distinction');
  if (!/交付格式[\s\S]{0,80}默认 HTML/.test(skill)) missing.push('default HTML delivery state');
  if (!/“生成 PPT”[\s\S]{0,80}“做 PPT”[\s\S]{0,80}“制作 ppt”[\s\S]{0,80}PPT 呈现形态/.test(skill)) missing.push('plain PPT request defaults to HTML guidance');
  for (const term of ['PPTX', 'PPT/PPTX 文件', 'PowerPoint 文件', '可编辑 PPTX', '格式/文件类型为 PPT/PPTX']) {
    if (!skill.includes(term)) missing.push(`explicit PPTX file trigger ${term}`);
  }
  if (!/PPTX 文件[\s\S]{0,80}先生成 HTML[\s\S]{0,80}HTTP 导出服务/.test(skill)) missing.push('PPTX follows HTML-first export flow');
  if (!/PPTX 交付[\s\S]{0,80}只给 PPTX 文件路径或下载结果/.test(skill)) missing.push('PPTX final reply hides HTML delivery');
  if (!/HTTP\/HTTPS/.test(sync)) missing.push('synced installed skill preserves HTTP/HTTPS wording');
  if (!/playwright-core/.test(sync)) missing.push('synced runtime keeps PPTX export browser dependency');
  assert(!missing.length, `Codex/image-gen/export delivery guidance missing: ${missing.join(', ')}`);
}

function testAcceptedThemeExposure() {
  const themeQuery = runJson('scripts/layout-query.mjs', ['--role', 'cover', '--limit', '50']);
  assert(themeQuery.layouts.length > 0, 'expected accepted theme layouts');
  assert(themeQuery.layouts.every(item => ACCEPTED_THEME_KEYS.includes(item.theme)), 'layout-query should only expose accepted themes');
  for (const themeKey of ACCEPTED_THEME_KEYS) {
    const result = runJson('scripts/layout-query.mjs', ['--theme', themeKey, '--role', 'cover', '--limit', '5']);
    assert(result.layouts.some(item => item.theme === themeKey), `layout-query should expose ${themeKey}`);
    const firstLayout = result.layouts[0]?.layout || `${themeKey}_page001`;
    const inspected = runJson('scripts/inspect-layout.mjs', [firstLayout]);
    assert(inspected.theme === themeKey, `inspect-layout should expose ${themeKey}`);
  }
}

function testSyncedSkillOutput() {
  const tmp = mkdtempSync(path.join(tmpdir(), 'dashi-synced-skill-'));
  const skillRoot = path.join(tmp, 'skill');
  try {
    execFileSync('node', ['scripts/sync-skill.mjs'], {
      cwd: ROOT,
      env: { ...process.env, DASHI_PPT_SKILL_ROOT: skillRoot },
      stdio: 'pipe',
    });

    const visibleTextFiles = [
      'SKILL.md',
      'README.md',
      'references/options.md',
      'references/layout-pool.md',
      'references/layout-roles.md',
    ];
    for (const file of visibleTextFiles) {
      assertAcceptedThemeText(readFileSync(path.join(skillRoot, file), 'utf8'), file);
    }
    const styleGrid = PNG.sync.read(readFileSync(path.join(skillRoot, 'assets/skill/theme-style-grid.png')));
    assert(styleGrid.height <= Math.ceil(styleGrid.width / ACCEPTED_THEME_KEYS.length), 'synced style grid should be cropped to accepted themes');

    const schema = JSON.parse(readFileSync(path.join(skillRoot, 'references/goal-spec.schema.json'), 'utf8'));
    assert(
      JSON.stringify(schema.properties?.themePack?.enum || []) === JSON.stringify(ACCEPTED_THEME_KEYS),
      'synced schema themePack enum should contain only accepted themes',
    );
    assertAcceptedThemeText(JSON.stringify(schema), 'references/goal-spec.schema.json');

    const examplesRoot = path.join(skillRoot, 'references/examples');
    for (const file of readdirSync(examplesRoot).filter(item => item.endsWith('.json'))) {
      const examplePath = path.join(examplesRoot, file);
      const example = JSON.parse(readFileSync(examplePath, 'utf8'));
      assert(ACCEPTED_THEME_KEYS.includes(example.themePack), `${file} uses unaccepted themePack ${example.themePack}`);
      for (const slide of example.slides || []) {
        const themeKey = String(slide.layout || '').split('_')[0];
        assert(ACCEPTED_THEME_KEYS.includes(themeKey), `${file} uses unaccepted layout ${slide.layout}`);
      }
      assertAcceptedThemeText(JSON.stringify(example), `references/examples/${file}`);
      execFileSync('node', ['scripts/validate-goal-spec.mjs', examplePath], { cwd: ROOT, stdio: 'pipe' });
    }

    const installedMetadata = readFileSync(path.join(skillRoot, 'project/src/components/themes/generated-metadata.js'), 'utf8');
    assertAcceptedThemeText(installedMetadata, 'project/src/components/themes/generated-metadata.js');

    const installedManifest = JSON.parse(readFileSync(path.join(skillRoot, 'project/layout-manifest.json'), 'utf8'));
    for (const [layoutKey, record] of Object.entries(installedManifest.layouts || {})) {
      const themeKey = record?.themePack || record?.themeKey || layoutKey.split('_')[0];
      assert(ACCEPTED_THEME_KEYS.includes(themeKey), `synced layout manifest exposes unaccepted layout ${layoutKey}`);
    }
    assertAcceptedThemeText(JSON.stringify(installedManifest), 'project/layout-manifest.json');

    const projectAssetFiles = listFiles(path.join(skillRoot, 'project/assets'))
      .map(file => path.relative(path.join(skillRoot, 'project'), file).split(path.sep).join('/'));
    for (const file of projectAssetFiles) {
      assert(
        RUNTIME_ASSET_PATHS.some(assetPath => file === assetPath || file.startsWith(`${assetPath}/`)),
        `synced project copied non-runtime asset ${file}`,
      );
    }
    assert(
      !existsSync(path.join(skillRoot, 'project/assets/skill/theme-style-grid.png')),
      'synced project should not copy the full assets/skill directory',
    );
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
}

function testValidateSwissMissingAsset() {
  const tmp = mkdtempSync(path.join(tmpdir(), 'dashi-missing-asset-'));
  try {
    const goalPath = path.join(tmp, 'goal.json');
    const outPath = path.join(tmp, 'ppt/index.html');
    writeFileSync(goalPath, JSON.stringify({
      title: 'Missing Asset Smoke',
      goal: 'validate swiss should fail when a referenced runtime asset is missing',
      themePack: 'theme01',
      slides: [{ layout: 'theme01_page001', props: { kicker: 'ASSET', titleTop: 'Missing', titleBottom: 'Asset' } }],
    }, null, 2));

    execFileSync('npm', ['run', 'render:goal', '--', goalPath, outPath], { cwd: ROOT, stdio: 'pipe' });
    execFileSync('npm', ['run', 'validate:swiss', '--', outPath], { cwd: ROOT, stdio: 'pipe' });
    rmSync(path.join(tmp, 'ppt/assets/ui-icons/sidebar.svg'), { force: true });

    const result = spawnSync('npm', ['run', 'validate:swiss', '--', outPath], {
      cwd: ROOT,
      encoding: 'utf8',
    });
    assert(result.status !== 0, 'validate:swiss should fail after deleting a referenced runtime asset');
    assert(`${result.stdout}\n${result.stderr}`.includes('assets/ui-icons/sidebar.svg'), 'missing asset error should mention sidebar.svg');
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
}

function testHttpPreviewDelivery() {
  const skill = readFileSync(path.join(ROOT, 'SKILL.md'), 'utf8');
  const sync = readFileSync(path.join(ROOT, 'scripts/sync-skill.mjs'), 'utf8');
  const template = readFileSync(path.join(ROOT, 'assets/template-swiss.html'), 'utf8');
  const missing = [];
  if (!/preview:start/.test(skill)) missing.push('skill preview:start workflow');
  if (!/http:\/\/(?:127\.0\.0\.1|localhost):<port>\//.test(skill)) missing.push('local HTTP export URL guidance');
  if (!/http:\/\/jadon\.local:<port>\/[\s\S]{0,40}不作导出主入口/.test(skill)) missing.push('do not use jadon.local HTTP as final export URL rule');
  if (!/http:\/\/jadon\.local:<port>\/[\s\S]{0,40}不作导出主入口/.test(skill)) missing.push('jadon.local HTTP is not export entry');
  if (!/https:\/\/jadon\.local:<port>\//.test(skill)) missing.push('jadon.local preview URL guidance');
  if (!/HTML 文件路径/.test(skill)) missing.push('HTML file path delivery rule');
  if (!/本机 HTTP[\s\S]{0,80}导出[\s\S]{0,80}(PPT|PPTX)/.test(skill)) missing.push('local HTTP link exports PPT/PPTX rule');
  if (!/(file:\/\/|本地 HTML)[\s\S]{0,120}不能导出可编辑 PPTX/.test(skill)) missing.push('file/local HTML cannot export editable PPTX rule');
  if (!/preview:start/.test(sync)) missing.push('synced render shell starts preview');
  if (!/DASHI_PPT_PROJECT_ROOT/.test(sync)) missing.push('synced render shell project root override');
  if (!/http:\/\/(?:127\.0\.0\.1|localhost):<port>\//.test(sync)) missing.push('synced installed skill local HTTP wording');
  if (!/location\.protocol\s*===\s*['"]file:/.test(template)) missing.push('file:// PPTX export guard');
  if (!/preview:start/.test(template)) missing.push('file:// export message should point to preview:start');
  if (!/http:\/\/(?:127\.0\.0\.1|localhost):<port>\//.test(template)) missing.push('file:// export message should point to local HTTP');
  assert(!missing.length, `HTTP preview delivery guidance missing: ${missing.join(', ')}`);

  const tmp = mkdtempSync(path.join(tmpdir(), 'dashi-http-preview-'));
  const port = 47000 + (process.pid % 1000);
  try {
    const goalPath = path.join(tmp, 'goal.json');
    const outPath = path.join(tmp, 'ppt/index.html');
    writeFileSync(goalPath, JSON.stringify({
      title: 'HTTP Preview Smoke',
      goal: 'verify preview server delivery',
      audience: 'workflow validation',
      owner: 'DashAI PPT',
      randomSeed: 'http-preview-smoke',
      themePack: 'theme01',
      slides: [
        {
          layout: 'theme01_page001',
          props: {
            kicker: 'PREVIEW · SMOKE',
            titleTop: 'HTTP Preview',
            titleBottom: 'Smoke',
            en: 'Delivery Check',
            lead: 'Verify the rendered deck is served through the local HTTP and HTTPS preview URLs.',
            chips: ['HTTP', 'HTTPS', 'Delivery'],
            panelIndex: '01',
            panelEn: 'LOCAL PREVIEW',
            meta: [
              { label: 'MODE', value: 'Workflow' },
              { label: 'CHECK', value: 'Validation' },
              { label: 'ID', value: 'JAD-150' },
            ],
            footnote: 'DashAI PPT · Preview delivery smoke',
          },
        },
        {
          layout: 'theme01_page006',
          props: {
            kicker: 'Preview Result',
            value: '200',
            unit: 'OK',
            sub: 'Local HTTP and HTTPS previews respond with the generated deck.',
            highlightWord: 'HTTP',
            secondaries: [
              { value: '2', unit: 'URL', label: 'jadon.local previews' },
              { value: '1', unit: 'PID', label: 'server process' },
              { value: '0', unit: 'file://', label: 'not final delivery' },
            ],
            caption: 'HTTP Preview Smoke · Delivery Check',
          },
        },
      ],
    }, null, 2));
    const skillRoot = path.join(tmp, 'skill');
    execFileSync('node', ['scripts/sync-skill.mjs'], {
      cwd: ROOT,
      env: { ...process.env, DASHI_PPT_SKILL_ROOT: skillRoot },
      stdio: 'pipe',
    });
    assert(existsSync(path.join(skillRoot, 'project/assets/ui-icons/sidebar.svg')), 'synced skill project should include UI icons');
    assert(existsSync(path.join(skillRoot, 'project/assets/social-icons/github.svg')), 'synced skill project should include social icons');
    assert(existsSync(path.join(skillRoot, 'project/assets/skill/dashiai-ppt-favicon.png')), 'synced skill project should include favicon asset');
    const shell = path.join(skillRoot, 'scripts/render_goal_deck.sh');
    const output = execFileSync(shell, [goalPath, outPath], {
      cwd: ROOT,
      env: {
        ...process.env,
        DASHI_PPT_PROJECT_ROOT: ROOT,
        DASHI_PPT_PREVIEW_HOST: '127.0.0.1',
        DASHI_PPT_PREVIEW_PORT: String(port),
      },
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    assert(output.includes(`http://127.0.0.1:${port}/`) || output.includes(`http://localhost:${port}/`), 'render shell should print the final local HTTP export URL');
    assert(!/HTTP preview URL:\s*http:\/\/jadon\.local:/i.test(output), 'render shell must not label jadon.local HTTP as the final HTTP preview URL');
    assert(output.includes(`https://jadon.local:${port}/`), 'render shell should print the final jadon.local HTTPS preview URL');
    const html = fetchHttpsWithRetry(`https://localhost:${port}/`);
    const httpHtml = fetchHttpWithRetry(`http://localhost:${port}/`);
    assert(html.includes('HTTP Preview'), 'HTTPS preview should serve the rendered deck');
    assert(httpHtml.includes('HTTP Preview'), 'HTTP preview should serve the rendered deck on the same port');
    const previewState = JSON.parse(readFileSync(path.join(tmp, 'ppt/.preview-server.json'), 'utf8'));
    assert(
      previewState.httpUrl === `http://127.0.0.1:${port}/` || previewState.httpUrl === `http://localhost:${port}/`,
      'preview state httpUrl should be the local HTTP export URL',
    );
    assert(previewState.jadonHttpUrl === `http://jadon.local:${port}/` || previewState.lanHttpUrl === `http://jadon.local:${port}/`, 'preview state should keep jadon.local HTTP only as a backup field');
    assert(previewState.url === `https://jadon.local:${port}/`, 'preview state should keep jadon.local HTTPS URL');
    assert(previewState.pid, 'preview state should include server pid');
    cleanupPreviewProcess(previewState.pid);
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
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

    expectGoalFailure(tmp, 'unknown-nested-prop.json', {
      title: 'Unknown Nested Prop',
      goal: 'should fail',
      themePack: 'theme01',
      slides: [{ layout: 'theme01_page031', props: { quadrants: [{ name: '高频低风险', desc: '错误字段应该被拒绝' }] } }],
    }, ['slide 1', 'theme01_page031', 'props.quadrants[0].name']);

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

function testCheckedInGoalExamples() {
  const examplesRoot = path.join(ROOT, 'examples/goal-decks');
  for (const file of readdirSync(examplesRoot).filter(item => item.endsWith('.json'))) {
    execFileSync('node', ['scripts/validate-goal-spec.mjs', path.join(examplesRoot, file)], { cwd: ROOT, stdio: 'pipe' });
  }
}

function testImagesControl() {
  const source = execFileSync('node', ['-e', `
    const fs = require('fs');
    const src = fs.readFileSync('assets/template-swiss.html', 'utf8');
    if (!/type\\s*===\\s*['"]images['"]/.test(src)) process.exit(2);
    if (!/image-list/.test(src)) process.exit(3);
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

function assertAcceptedThemeText(text, label) {
  for (const theme of GENERATED_THEME_PACKS.filter(item => !ACCEPTED_THEME_KEYS.includes(item.key))) {
    assert(!text.includes(theme.key), `${label} exposes unaccepted theme ${theme.key}`);
  }
}

function listFiles(dir) {
  if (!existsSync(dir)) return [];
  const files = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...listFiles(file));
    } else if (entry.isFile()) {
      files.push(file);
    }
  }
  return files;
}

function cleanupPreviewProcess(pid) {
  const value = Number(pid);
  if (!Number.isFinite(value) || value <= 0) return;
  try {
    process.kill(value, 'SIGTERM');
  } catch {}
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

function fetchHttpsWithRetry(url) {
  let lastError = null;
  for (let attempt = 0; attempt < 12; attempt += 1) {
    try {
      return execFileSync(process.execPath, ['-e', `
        const https = require('node:https');
        https.get(${JSON.stringify(url)}, { rejectUnauthorized: false }, response => {
          let body = '';
          response.setEncoding('utf8');
          response.on('data', chunk => { body += chunk; });
          response.on('end', () => {
            if (response.statusCode !== 200) {
              console.error('status=' + response.statusCode);
              process.exit(2);
            }
            process.stdout.write(body);
          });
        }).on('error', error => {
          console.error(error.message);
          process.exit(1);
        });
      `], { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], timeout: 5000 });
    } catch (error) {
      lastError = error;
      sleep(250);
    }
  }
  throw new Error(`HTTPS preview did not respond: ${lastError?.stderr || lastError?.message || 'unknown error'}`);
}

function fetchHttpWithRetry(url) {
  let lastError = null;
  for (let attempt = 0; attempt < 12; attempt += 1) {
    try {
      return execFileSync(process.execPath, ['-e', `
        const http = require('node:http');
        http.get(${JSON.stringify(url)}, response => {
          let body = '';
          response.setEncoding('utf8');
          response.on('data', chunk => { body += chunk; });
          response.on('end', () => {
            if (response.statusCode !== 200) {
              console.error('status=' + response.statusCode);
              process.exit(2);
            }
            process.stdout.write(body);
          });
        }).on('error', error => {
          console.error(error.message);
          process.exit(1);
        });
      `], { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], timeout: 5000 });
    } catch (error) {
      lastError = error;
      sleep(250);
    }
  }
  throw new Error(`HTTP preview did not respond: ${lastError?.stderr || lastError?.message || 'unknown error'}`);
}

function sleep(ms) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
}
