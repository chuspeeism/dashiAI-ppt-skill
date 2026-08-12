#!/usr/bin/env node
// dashi-ppt-skill 的 npx 安装器:把包内 skill/ 目录复制到本机技能目录。
// 用法:
//   npx dashi-ppt-skill@latest                  # 自动选择唯一安装目录
//   npx dashi-ppt-skill@latest --dir <path>     # 显式指定技能根目录
//   npx dashi-ppt-skill@latest --all            # 安装/更新全部探测到的技能目录
//   npx dashi-ppt-skill@latest --list           # 只列出探测到的候选目录
//
// 关键行为:
// - npm publish 会排除 .npmrc,包内以 project/npmrc.template 携带缺省镜像配置,
//   安装时重建 .npmrc;用户通过 --registry=npmmirror 安装(npm_config_registry
//   环境变量)即视为明确选择镜像,直接锁定并跳过后续探测。
// - 更新时保留 project/node_modules 与已探测的 .npmrc;但新旧 package-lock.json
//   内容不一致(依赖变化)时删除 node_modules/.package-lock.json 哨兵,强制
//   渲染脚本重跑 npm install(mtime 在复制后不可信,不能作为依据)。
import { cpSync, existsSync, mkdirSync, readFileSync, renameSync, rmSync, readdirSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const PKG_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SKILL_SOURCE = path.join(PKG_ROOT, 'skill');
const SKILL_NAME = 'dashi-ppt';
const LEGACY_SKILL_NAME = 'dashiai-ppt';
const MIRROR_REGISTRY = 'https://registry.npmmirror.com';
const PROBED_MARK = '# dashi-registry-probed';

const args = process.argv.slice(2);
const dirFlagIndex = args.indexOf('--dir');
const explicitDir = dirFlagIndex >= 0 ? args[dirFlagIndex + 1] : null;
if (dirFlagIndex >= 0 && (!explicitDir || explicitDir.startsWith('--'))) {
  console.error('--dir 需要一个路径参数,例如 --dir ~/.claude/skills');
  process.exit(2);
}
const installAll = args.includes('--all');
if (explicitDir && installAll) {
  console.error('--dir 与 --all 不能同时使用。');
  process.exit(2);
}
const listOnly = args.includes('--list');

const home = os.homedir();
const sharedSkillRoot = path.join(home, '.agents', 'skills');
const candidates = [
  sharedSkillRoot,
  path.join(home, '.claude', 'skills'),
  path.join(home, '.codex', 'skills'),
  path.join(home, '.config', 'agents', 'skills'),
];

function detectSkillRoots() {
  return candidates.filter((dir) => existsSync(dir));
}

function resolveTargetRoots(detected) {
  if (explicitDir) return { roots: [path.resolve(explicitDir)] };
  if (installAll) return { roots: detected };

  const installedPaths = detected.flatMap((root) =>
    [SKILL_NAME, LEGACY_SKILL_NAME]
      .map((name) => path.join(root, name))
      .filter((skillPath) => existsSync(skillPath)),
  );
  const installed = [...new Set(installedPaths.map((skillPath) => path.dirname(skillPath)))];
  if (installed.length === 1) return { roots: installed };
  if (installed.length > 1) {
    return {
      error: [
        '检测到多份 dashi-ppt 安装,为避免更新错误的副本,本次未执行:',
        ...installedPaths.map((skillPath) => `  ${skillPath}`),
        '请用 --dir <技能根目录> 选择一处更新,或用 --all 明确更新全部。',
      ].join('\n'),
    };
  }

  // 全新安装优先使用跨宿主共享目录;若它尚不存在,才考虑已有的宿主专用目录。
  if (detected.includes(sharedSkillRoot)) return { roots: [sharedSkillRoot] };
  if (detected.length === 1) return { roots: detected };
  if (detected.length > 1) {
    return {
      error: [
        '检测到多个技能目录,无法确定当前宿主,本次未执行:',
        ...detected.map((root) => `  ${root}`),
        '请用 --dir <技能根目录> 选择一处安装,或用 --all 明确安装到全部。',
      ].join('\n'),
    };
  }
  return {
    error: [
      '未探测到技能目录。请显式指定,例如:',
      '  npx dashi-ppt-skill --dir ~/.claude/skills',
      `常见位置:\n  ${candidates.join('\n  ')}`,
    ].join('\n'),
  };
}

function installerRegistryChoice() {
  const configured = String(process.env.npm_config_registry || '').toLowerCase();
  return configured.includes('npmmirror.com') ? MIRROR_REGISTRY : null;
}

function readFileOr(filePath, fallback = '') {
  try {
    return readFileSync(filePath, 'utf8');
  } catch {
    return fallback;
  }
}

// 安装后的 project/.npmrc 决策(优先级从高到低):
// 1. 本次经镜像 registry 安装 → 锁镜像并打探测标(用户已明确选择,不再探测官方);
// 2. 旧安装已有探测结果(带标) → 原样保留;
// 3. 包内模板 → 重建缺省(npmmirror 保底,首次生成时由 ensure-registry 探测调整)。
function resolveNpmrc(previousNpmrc) {
  const chosenMirror = installerRegistryChoice();
  if (chosenMirror) return `registry=${chosenMirror}\n${PROBED_MARK}\n`;
  if (previousNpmrc && previousNpmrc.includes(PROBED_MARK)) return previousNpmrc;
  const template = readFileOr(path.join(SKILL_SOURCE, 'project', 'npmrc.template'));
  return previousNpmrc || template || `registry=${MIRROR_REGISTRY}\n`;
}

function installInto(targetRoot, version) {
  const dest = path.join(targetRoot, SKILL_NAME);
  const destProject = path.join(dest, 'project');
  // 0.4.0 改名迁移:旧目录 dashiai-ppt 存在时,仅把旧依赖 node_modules
  // rename 进新目录(同盘瞬时;后续正常安装流程会照常保留它),然后整体
  // 移除旧目录,避免宿主把新旧两个目录双注册。
  const legacyDir = path.join(targetRoot, LEGACY_SKILL_NAME);
  if (existsSync(legacyDir) && legacyDir !== dest) {
    const legacyModules = path.join(legacyDir, 'project', 'node_modules');
    const destModules = path.join(destProject, 'node_modules');
    if (existsSync(legacyModules) && !existsSync(destModules)) {
      mkdirSync(destProject, { recursive: true });
      renameSync(legacyModules, destModules);
    }
    rmSync(legacyDir, { recursive: true, force: true });
    console.log(`已迁移并移除旧目录 ${legacyDir}(skill 改名 dashiai-ppt → dashi-ppt)。`);
  }
  // 原子替换:在同一目录构建 staging,rename 交换新旧目录。任何一步中断,
  // dest 要么是完整旧版要么是完整新版,最多留下带专属前缀的临时目录
  // (下次安装开头清理),绝不出现半删半拷的残缺 skill。
  const staging = path.join(targetRoot, `.${SKILL_NAME}-staging-${process.pid}`);
  const retired = path.join(targetRoot, `.${SKILL_NAME}-old-${process.pid}`);
  mkdirSync(targetRoot, { recursive: true });
  for (const entry of readdirSync(targetRoot)) {
    if (entry.startsWith(`.${SKILL_NAME}-staging-`) || entry.startsWith(`.${SKILL_NAME}-old-`)) {
      rmSync(path.join(targetRoot, entry), { recursive: true, force: true });
    }
  }

  const previousLock = readFileOr(path.join(destProject, 'package-lock.json'));
  const previousNpmrc = readFileOr(path.join(destProject, '.npmrc'));
  const hadModules = existsSync(path.join(destProject, 'node_modules'));

  console.log(`安装 Dashi PPT Skill v${version} → ${dest}`);
  cpSync(SKILL_SOURCE, staging, { recursive: true });
  writeFileSync(path.join(staging, 'project', '.npmrc'), resolveNpmrc(previousNpmrc));

  const nextLock = readFileOr(path.join(staging, 'project', 'package-lock.json'));
  const dependenciesChanged = hadModules && previousLock !== nextLock;

  if (existsSync(dest)) renameSync(dest, retired);
  renameSync(staging, dest);
  if (hadModules) {
    // 同一文件系统内 rename 移交 node_modules:瞬时且不产生拷贝。
    renameSync(path.join(retired, 'project', 'node_modules'), path.join(dest, 'project', 'node_modules'));
    if (dependenciesChanged) {
      // 依赖清单变了:删除安装哨兵,渲染脚本会重跑 npm install 增量补齐。
      rmSync(path.join(dest, 'project', 'node_modules', '.package-lock.json'), { force: true });
      console.log('依赖有更新:保留缓存并已标记,首次生成时将自动补齐安装。');
    } else {
      console.log('依赖未变化,保留原有 project/node_modules。');
    }
  }
  rmSync(retired, { recursive: true, force: true });
  const installedEntries = readdirSync(dest).length;
  console.log(`完成:${installedEntries} 个顶层条目。`);
}

function main() {
  if (!existsSync(SKILL_SOURCE)) {
    console.error('损坏的安装包:缺少 skill/ 内容。请重新安装 dashi-ppt-skill。');
    process.exit(1);
  }
  const detected = detectSkillRoots();
  if (listOnly) {
    console.log(detected.length ? detected.join('\n') : '(未探测到常见技能目录,请用 --dir 指定)');
    return;
  }
  const selection = resolveTargetRoots(detected);
  if (selection.error) {
    console.error(selection.error);
    process.exit(2);
  }
  const targetRoots = selection.roots;
  if (!targetRoots.length) {
    console.error('--all 未探测到可安装的技能目录,请先创建目录或使用 --dir 指定。');
    process.exit(2);
  }

  const version = JSON.parse(readFileSync(path.join(PKG_ROOT, 'package.json'), 'utf8')).version;
  for (const targetRoot of targetRoots) {
    installInto(targetRoot, version);
  }
  console.log('重新打开会话后即可使用 dashi-ppt。');
}

main();
