import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const generatedFiles = ['docs/ADR.md', 'docs/project-files.md'];

const files = [...new Set([
  ...execFileSync('git', ['ls-files', '--cached', '--others', '--exclude-standard'], {
    cwd: ROOT,
    encoding: 'utf8',
  })
    .split('\n')
    .map((file) => file.trim())
    .filter(Boolean),
  ...generatedFiles,
])]
  .filter((file) => file !== '.DS_Store')
  .filter((file) => !file.startsWith('.codex/'))
  .filter((file) => !file.startsWith('.playwright-cli/'))
  .filter((file) => fs.existsSync(path.join(ROOT, file)))
  .sort();

writeFile('docs/project-files.md', renderProjectFiles(files));
writeFile('docs/ADR.md', renderAdr());
updateReadme(files);

function renderProjectFiles(fileList) {
  return `# 项目文件作用说明

本文件由 \`scripts/update-project-docs.mjs\` 生成,用于快速理解当前项目工作树下每个源码文件的主要作用。

\`\`\`text
.
${renderTree(fileList)}
\`\`\`
`;
}

function renderAdr() {
  return `# ADR

本文件由 \`scripts/update-project-docs.mjs\` 生成,记录当前项目已经采用的架构决策。

## ADR-001: 只登记已验收导入主题

当前对外主题包只包含已通过接入验收的 Claude Design 主题。blocked 主题、0 页主题、旧组件、旧素材、旧别名和旧 token 机制不登记进 Skill。

## ADR-002: React 只作为生成层

最终交付仍是静态 HTML。React 组件在本地渲染时生成 slide markup,浏览器运行时只负责翻页、预览控制、文本编辑、媒体替换、页面 props、动画和导出。

## ADR-003: Claude Design 主题是当前组件来源

页面组件放在 \`src/components/themes/theme*/\`。\`src/components/themes/generated-metadata.js\` 保存当前已验收主题、页面登记、默认内容和页面属性控制信息。

## ADR-004: 固定 16:9 舞台

PPT 舞台固定 16:9 等比缩放,窗口多余区域使用黑色填充。

## ADR-005: 输出目录是生成物

\`output/\` 用于 demo、验证 deck 和截图产物,不作为源码提交。

## ADR-006: 单一主题调试入口

\`npm run showcase:update\` 会检查 \`all-themes-showcase.jsx\` 覆盖当前全部已登记布局,并刷新唯一调试页 \`output/theme-preview/ppt/index.html\`。
`;
}

function updateReadme(fileList) {
  const readmePath = path.join(ROOT, 'README.md');
  const readme = fs.readFileSync(readmePath, 'utf8');
  fs.writeFileSync(readmePath, replaceSection(readme, 'project-docs', renderReadmeSection(fileList)));
}

function renderReadmeSection(fileList) {
  return `## 项目文档

以下文档由 \`npm run docs:update\` 同步。

- [ADR](docs/ADR.md): 当前架构决策记录
- [项目文件作用说明](docs/project-files.md): 当前 ${fileList.length} 个源码文件的主要作用
`;
}

function replaceSection(content, name, body) {
  const start = `<!-- ${name}:start -->`;
  const end = `<!-- ${name}:end -->`;
  const block = `${start}\n${body.trim()}\n${end}`;
  const pattern = new RegExp(`${escapeRegExp(start)}[\\s\\S]*?${escapeRegExp(end)}`);
  return pattern.test(content) ? content.replace(pattern, block) : `${content.trim()}\n\n${block}\n`;
}

function describe(file) {
  if (file === 'assets/template-swiss.html') return '静态 PPT HTML 外壳模板,包含 16:9 舞台、翻页、控制面板、媒体替换、文本编辑、动画和导出运行时。';
  if (file === 'src/options.jsx') return '布局选项注册表,只登记当前已验收主题页面。';
  if (file === 'src/deckComposer.jsx') return '目标 deck 编排器,把用户目标 JSON 计划映射为当前已验收主题页面。';
  if (file === 'src/renderDeck.jsx') return '核心渲染器,构建 Deck ViewModel 并把 React slides 注入 HTML 模板。';
  if (file.startsWith('src/components/themes/')) return 'Claude Design 导入主题组件、运行时、素材或登记元数据。';
  if (file.startsWith('src/components/shell/')) return '页面外壳组件,给 slide 注入稳定 VM 标识。';
  if (file.startsWith('src/view-model/')) return 'Deck ViewModel 构建层和 React Context。';
  if (file.startsWith('examples/component-decks/')) return '组件化 deck 示例配置。';
  if (file.startsWith('examples/goal-decks/')) return '按用户目标组合组件的 JSON 计划示例。';
  if (file.startsWith('scripts/')) return '本地命令脚本。';
  if (file.startsWith('docs/')) return '项目文档。';
  if (file.startsWith('assets/')) return '静态模板或浏览器运行时资源。';
  return '项目源码或配置文件。';
}

function renderTree(fileList) {
  const root = { children: new Map() };
  for (const file of fileList) {
    let cursor = root;
    const parts = file.split('/');
    parts.forEach((part, index) => {
      if (!cursor.children.has(part)) {
        cursor.children.set(part, {
          name: part,
          path: parts.slice(0, index + 1).join('/'),
          children: new Map(),
          isFile: index === parts.length - 1,
        });
      }
      cursor = cursor.children.get(part);
    });
  }
  return renderTreeNode(root).join('\n');
}

function renderTreeNode(node, prefix = '') {
  return [...node.children.values()]
    .sort((a, b) => {
      if (a.isFile !== b.isFile) return a.isFile ? 1 : -1;
      return a.name.localeCompare(b.name);
    })
    .flatMap((entry, index, entries) => {
      const isLast = index === entries.length - 1;
      const marker = isLast ? '`-- ' : '|-- ';
      const nextPrefix = `${prefix}${isLast ? '    ' : '|   '}`;
      if (entry.isFile) return [`${prefix}${marker}${entry.name} - ${describe(entry.path)}`];
      return [`${prefix}${marker}${entry.name}/`, ...renderTreeNode(entry, nextPrefix)];
    });
}

function writeFile(relativePath, content) {
  const filePath = path.join(ROOT, relativePath);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content);
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
