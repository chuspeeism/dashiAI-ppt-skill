# Claude Design 12 主题批量接入目标文档

## 背景

本项目是一个 PPT Skill。它的核心职责不是重新设计页面,而是根据用户目标选择合适页面模板,填入文案、图片和页面属性,生成可离线打开和导出的 HTML PPT。

Claude Design 负责产出视觉页面组件。本项目负责把这些组件作为主题包接入,完成登记、控制面板、页面属性契约、Skill 生成流程、导出和校验。

本次来源目录:

```text
/Volumes/大师的AI小灶 共享盘/PPT Skill 共享文件/定稿版本 html
```

该目录里包含 12 个 Claude Design 定稿主题,其中有 2 个主题是当前版本中已有主题的更新版。接入时必须区分“新增主题”和“替换现有主题”,不能把更新版误接成额外新主题。

当前 12 个主题的入口 HTML 文件必须按下表登记,导入时不要自动猜测入口:

| 主题序号 | 当前入口文件 |
|---|---|
| 01 | `AI融资调研报告.html` |
| 02 | `index.html` |
| 03 | `report-deck.html` |
| 04 | `小红书风格AI融资报告.html` |
| 05 | `pulse-deck.html` |
| 06 | `美国AI大额融资调研报告.html` |
| 07 | `美国AI融资调研报告.html` |
| 08 | `deck.html` |
| 09 | `index.html` |
| 10 | `财富指数模板.html` |
| 11 | `燃点 增长引擎 v3.html` |
| 12 | `声浪 SoundWave.html` |

## 总目标

完成 12 个 Claude Design 定稿主题的完整审计和接入:

- 符合项目标准的主题,完整接入当前 PPT Skill。
- 需要少量项目侧适配的主题,由当前项目完成适配后接入。
- 不符合项目标准的主题,不硬塞进项目,形成明确的 Claude Design 返修遗留清单。
- 最终 Skill 只暴露已经验收通过的主题。

一句话定义:

> 把 12 个 Claude Design 定稿主题做完整审计,凡符合项目标准的主题无遗留接入,凡不符合标准的主题形成可执行的 Claude Design 返修清单;最终用户只能选择已验收通过的主题。

## 基本原则

1. 页面视觉优先保持 Claude Design 原始效果,不在项目侧重写视觉。
2. 页面组件尽量作为黑盒接入,只做必要 adapter。
3. 每个主题互相独立,不要求页数、文案、字段、布局结构互相对应。
4. 页面固定 16:9 等比缩放,多余区域黑色填充。
5. 保留 Claude Design 页面组件自己的图片 slot、视频 slot 和原生元素动画。
6. 不恢复旧 token、旧主题、旧图片 slot、旧开发者模式、旧字体/字号/字重选择。
7. 用户最终导出的 deck 不显示主题切换选项。
8. 内部调试 demo 保留主题切换,用于检查全部已接入主题。
9. 不把不合格主题以 0 页、空主题、半成品形式登记进 UI、manifest 或 Skill。
10. 不注释旧代码来表示删除,不把不需要的素材闲置在目录里。

## 交付内容

### 1. 主题导入目标文件

新增或生成:

```text
theme-import-goal.json
```

该文件是本次导入任务的输入合同,必须包含:

- `sourceRoot`: Claude Design 定稿目录。
- `replaceAllExistingThemes`: 是否清理现有主题后按本次 12 主题重建。
- `themes`: 12 个主题的映射列表。
- `themes[].entry`: 每个主题的入口 HTML 文件名,必须使用上方入口清单中的值。

示例结构:

```json
{
  "sourceRoot": "/Volumes/大师的AI小灶 共享盘/PPT Skill 共享文件/定稿版本 html",
  "replaceAllExistingThemes": true,
  "themes": [
    {
      "key": "theme01",
      "name": "大师-轻拟态质感",
      "source": "01大师-轻拟态质感-带封面",
      "entry": "AI融资调研报告.html",
      "cover": "01 大师-轻拟态质感.jpg",
      "mode": "new",
      "expectedPages": 0
    },
    {
      "key": "theme03",
      "name": "大师-深浅代码风",
      "source": "03 大师-深浅代码风-带封面",
      "entry": "report-deck.html",
      "cover": "03 大师-深浅代码风.jpg",
      "mode": "replace",
      "expectedPages": 0
    }
  ]
}
```

`mode` 只允许:

- `new`: 新增主题。
- `replace`: 替换当前项目中已有主题。

两个当前版本更新主题必须使用 `replace`。

### 2. 主题审计报告

生成:

```text
output/theme-audit-report.json
```

每个主题必须有明确状态:

- `ready`: 可直接接入。
- `needs_adapter`: 可由当前项目做少量 adapter 后接入。
- `blocked_for_claude`: 不符合项目标准,必须回 Claude Design 返修。
- `replaced`: 已替换现有主题。

每个主题至少记录:

- 主题 key。
- 主题名称。
- 源目录。
- 入口 HTML 文件。
- 页面数量。
- 组件数量。
- 素材数量。
- 是否包含外部绝对路径。
- 是否包含独立 JSX 页面组件。
- 是否能识别 controls。
- 是否存在图片 / 视频 slot。
- 审计结论。

### 3. Claude Design 返修遗留清单

生成:

```text
output/blocked-for-claude.md
```

只记录必须交给 Claude Design 重新调整的问题。当前项目能低成本解决的问题不要写进这里。

每条问题必须包含:

- 主题名。
- 页面编号或组件名。
- 问题类型。
- 当前项目不能硬适配的原因。
- Claude Design 需要如何返修。
- 返修后重新接入的验收点。

示例:

```text
## theme07 / 第 12 页

问题类型: controls 缺失

当前问题:
页面中有 6 个卡片,但组件没有通过 props 暴露 cards / cardCount,文案和数量都写死在组件内部。

为什么不能项目侧硬适配:
硬拆 DOM 或字符串替换会破坏组件黑盒原则,后续 Skill 无法稳定控制卡片数量。

Claude Design 返修要求:
将卡片数据改为 cards prop,并提供 cardCount 控制。cards.length 与 cardCount 必须能一致控制最终显示数量。

返修验收:
传入 3 / 5 / 7 条 cards 时,页面分别显示 3 / 5 / 7 张卡片,构图仍保持美观。
```

### 4. 已接入主题代码

已通过审计的主题接入到项目源码中。

推荐目录:

```text
src/components/themes/theme01/
src/components/themes/theme02/
...
src/components/themes/theme12/
```

每个主题目录应包含:

- 页面组件。
- 主题内 adapter。
- 主题内样式。
- 主题内素材。
- 主题登记文件。

不再保留旧 `theme2` / `theme3` 命名惯性,除非 `theme-import-goal.json` 明确要求某个旧 key 被保留。

### 5. 统一主题登记

更新:

```text
src/options.jsx
```

要求:

- 只登记本次已接入且验收通过的主题。
- 不登记 blocked 主题。
- 不登记 0 页主题。
- 不保留旧主题入口、旧 layout key、旧别名。
- 每个主题的页面数量与审计报告一致。

### 6. 页面属性契约

重新生成:

```text
layout-manifest.json
```

只包含已接入主题的真实页面。

每个页面至少记录:

- layout key。
- theme key。
- 页面编号。
- 页面名称。
- controls。
- countBindings。
- 图片 slot / 视频 slot 信息。
- 是否有原生动画。

数量类属性必须继续遵守当前项目规则:

- 只填写数组不填写 count 时,项目自动补 count。
- 同时填写数组和 count 时,二者必须一致。
- 不一致时渲染失败,不能静默截断。

### 7. 内部调试 demo

更新内部调试页面:

```text
output/theme-preview/ppt/index.html
```

要求:

- 可切换全部已接入主题。
- 不显示 blocked 主题。
- 页面总览缩略图可打开。
- 控制面板能显示当前页面属性。
- selection 类型继续显示为 tab / segment。

### 8. Skill 同步

更新并同步:

```text
~/.agents/skills/dashi-ppt-skill
```

要求:

- Skill 开始阶段列出全部已验收主题。
- 不列出 blocked 主题。
- 用户生成结果中不显示主题切换。
- 内部 demo 保留主题切换。
- Skill 内置项目副本不依赖当前仓库路径。

### 9. 最终导入总结

生成:

```text
output/theme-import-summary.md
```

内容包括:

- 原始主题数。
- 已接入主题数。
- 替换现有主题数。
- 待 Claude Design 返修主题数。
- 每个已接入主题的页数。
- 每个 blocked 主题的阻塞原因。
- 删除的旧主题 / 旧素材清单。
- 校验命令结果。

## Claude Design 返修判定标准

出现以下情况时,不要在项目侧硬适配,必须遗留给 Claude Design 返修:

1. 页面不是独立 React JSX 组件。
2. 页面依赖 Claude Design 特有运行时、全局对象或不可迁移脚本。
3. 页面核心内容大量硬编码,无法通过 props 控制。
4. controls 缺失,或 controls 与实际 props 不对应。
5. 数量类参数不可控,例如给 7 条 cards 但页面永远只显示 4 条。
6. 图片 slot / 视频 slot 不是明确 prop 或组件内 slot,数量和比例无法表达。
7. 页面依赖外部绝对路径资源。
8. 多页共用一个大组件,无法拆成单页独立 layout。
9. 样式全局污染严重,接入后会影响其它主题或控制面板。
10. 原生动画依赖无法迁移的外部 DOM 结构。
11. 页面不是 16:9 构图,强行缩放会破坏页面视觉。
12. 源文件本身视觉未定稿,截图和代码实现明显不一致。

## 项目侧可以处理的适配

以下问题由当前项目处理,不需要打回 Claude Design:

- 改文件命名和目录结构。
- 新增主题登记。
- 包一层项目 adapter。
- 把 controls 映射到项目 manifest。
- 复制素材并改为相对路径。
- 删除旧主题和旧素材。
- 同步 Skill。
- 生成调试 demo。
- 做轻量 CSS 隔离,前提是不改变页面视觉。
- 根据数组长度自动补齐 count。
- 校验 count 与数组长度冲突。

## 导入流程

建议用一条 goal 命令执行:

```bash
npm run themes:import -- theme-import-goal.json
```

该命令应完成:

1. 读取 `theme-import-goal.json`。
2. 按每个主题的 `entry` 读取入口 HTML,不要自动猜测入口。
3. 扫描 12 个主题源目录。
4. 生成 `output/theme-audit-report.json`。
5. 对 `ready` / `needs_adapter` 主题执行接入。
6. 对 `blocked_for_claude` 主题生成 `output/blocked-for-claude.md`。
7. 删除被替换的旧主题、旧组件和旧素材。
8. 更新主题登记。
9. 生成 `layout-manifest.json`。
10. 刷新内部调试 demo。
11. 更新 Skill。
12. 同步到 `~/.agents/skills/dashi-ppt-skill`。
13. 输出 `output/theme-import-summary.md`。

## 验收标准

### 1. 审计完整性

- 12 个主题全部完成审计。
- 每个主题状态明确。
- 没有未审计但被跳过的主题。
- 两个当前版本更新主题被识别为 `replace`,不是新增副本。

### 2. 接入完整性

- 所有 `ready` 主题已接入。
- 所有 `needs_adapter` 主题完成必要 adapter 后接入。
- 所有 `blocked_for_claude` 主题没有进入 UI、Skill、manifest。
- 已接入主题页数与源目录统计一致。
- 已接入主题素材全部复制到项目内,没有外部绝对路径引用。

### 3. 无遗留

必须确认不存在:

- 旧主题入口。
- 旧主题组件。
- 旧 layout 别名。
- 旧 token 机制。
- 旧图片 slot 体系。
- 旧开发者模式入口。
- 0 页主题。
- 空组件。
- 注释掉的旧代码。
- 闲置旧素材。
- `/Volumes/...`、`/Downloads/...` 等外部路径引用。

### 4. 视觉验收

每个已接入主题至少抽查:

- 首页。
- 目录或结构页。
- 数据页。
- 图片 / 视频 slot 页。
- 结尾页。

要求:

- 页面保持 16:9。
- 多余区域黑色填充。
- 视觉尽量还原 Claude Design 原始效果。
- 无空白页。
- 无明显错位。
- 无素材丢失。
- 无字体大面积变化。
- 原生元素动画保留。

### 5. 控制能力验收

要求:

- 当前页 controls 能在控制面板显示。
- selection 类型显示为 tab / segment。
- toggle、range 控件可用。
- 数量类 props 与数组长度自动一致。
- 数量冲突时渲染失败。
- 侧边栏文本编辑仍可用。
- Claude Design 自带图片 / 视频 slot 仍可替换。

### 6. Skill 验收

至少用 3 个已接入主题跑实际 goal 生成:

- 5 页 deck。
- 8 页 deck。
- 10 页 deck。

每个输出必须满足:

- 用户最终页面不显示主题切换。
- 文案与用户目标对应。
- 不残留模板默认文案。
- 页面数量正确。
- 首尾页不空白。
- 可导出 HTML / PDF / PPTX。

### 7. 内部 demo 验收

内部调试 demo 必须满足:

- 能切换全部已接入主题。
- 不展示 blocked 主题。
- 每个主题页数正确。
- 页面总览缩略图能打开。
- 缩略图数量与当前主题页数一致。
- 控制面板在切页后显示对应页面属性。

### 8. 命令验收

至少通过:

```bash
npm run manifest:update
npm test
npm run showcase:update
npm run render:themes
npm run skill:sync
```

实际 goal 输出还需要通过:

```bash
npm run validate:swiss -- <output-html>
npm run validate:goal-copy -- <goal-json> <output-html>
```

## 不做事项

本任务不做:

- 不重新设计 Claude Design 主题视觉。
- 不为了凑齐 12 个主题硬接不合格代码。
- 不恢复旧主题系统。
- 不恢复旧 token 机制。
- 不恢复旧图片 slot。
- 不做任意屏幕比例自适应。
- 不在用户交付 deck 中显示主题切换。

## 最终完成定义

任务完成必须同时满足:

1. 12 个主题全部审计完成。
2. 符合标准的主题已完整接入。
3. 不符合标准的主题有明确 Claude Design 返修清单。
4. 项目内没有旧主题和无用素材遗留。
5. Skill 只暴露已验收通过的主题。
6. 内部 demo 可调试全部已接入主题。
7. 所有验收命令通过。

## 本轮执行结果

截至本轮接入,12 个入口全部完成审计。按“Skill 可稳定替换文案、可读取页面属性契约、可离线渲染”的标准,当前通过验收并进入 Skill 可选项的主题为:

- `theme01`: 大师-轻拟态质感 · 89 页
- `theme02`: 大师-炫光紫绿 · 74 页
- `theme08`: AI Capital Lab · 82 页

以下主题未进入 Skill 可选项,已写入 `output/blocked-for-claude.md`:

- `theme03`: 57/77 页缺少足够的 props 文案 / 数据默认值。
- `theme04`: 入口已确认并可读取 74 页,但 74/74 页缺少足够的 props 文案 / 数据默认值。
- `theme05`: 依赖 IIFE 和 `window.Pulse*` 全局注册。
- `theme06`: 45/79 页缺少足够的 props 文案 / 数据默认值,且 79/79 页没有 controls。
- `theme07`: 70/70 页缺少足够的 props 文案 / 数据默认值。
- `theme09`: 111/111 页缺少足够的 props 文案 / 数据默认值。
- `theme10`: 依赖 `window.DeckKit` / `Object.assign(window...)` 浏览器全局运行时。
- `theme11`: 38/86 页缺少足够的 props 文案 / 数据默认值。
- `theme12`: 86/86 页缺少足够的 props 文案 / 数据默认值。

已通过的关键命令:

```bash
npm run themes:import -- theme-import-goal.json
npm run manifest:update
npm test
npm run showcase:update
npm run render:themes
npm run skill:sync
```

实际 goal 验收:

- `theme01`: `examples/goal-decks/portfolio.json` 渲染 5 页,`validate:swiss` 和 `validate:goal-copy` 通过。
- `theme02`: `output/goal-check-theme02/goal.json` 渲染 8 页,`validate:swiss` 和 `validate:goal-copy` 通过。
- `theme08`: `output/goal-check-theme08-10/goal.json` 渲染 10 页,`validate:swiss` 和 `validate:goal-copy` 通过。

已同步到:

```text
~/.agents/skills/dashi-ppt-skill
```
