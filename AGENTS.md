# Project Memory

## 布局组件组织

- 当前登记已通过接入验收的主题: `theme01` 到 `theme12`,共 1019 页;具体页数以 `src/components/themes/generated-metadata.js` 为准。
- 已删除浅色主题、深色主题、旧主题组件、旧素材、旧别名、旧 token 目录、旧设计变体字段、字体、字号、字重、风格和开发者模式入口;不要再恢复这些旧入口。
- Claude Design 导入主题放在 `src/components/themes/theme*/`,通过 `src/components/themes/generated-metadata.js` 和 `src/options.jsx` 登记。
- 不要登记 blocked 主题、0 页主题、旧 theme2/theme3 入口或旧 layout key。
- 保留侧边栏文本编辑、页面 props 控制、图片/视频 slot、组件原生元素动画、切换动画和导出功能。
- PPT 舞台固定 16:9 等比缩放,多出来的窗口区域用黑色填充;后续页面不要再按任意屏幕比例自适应构图。
- VM 文案 ID 必须稳定,不能依赖页码、排序或全局序号。文本覆盖统一使用 `text:<slideKey>:<slot>`;默认 `slideKey` 是 layout key,重复布局才追加页内出现序号。
- 每次提交前必须运行 `npm run manifest:update`、`npm test`、`npm run showcase:update`;更新 Skill 后运行 `npm run skill:sync` 同步到 `~/.agents/skills`。

## Skill 提示词更新原则

- 少而准:只写真正影响模型输出的约束;一句话能说清楚就不展开。
- 先减后加:默认先删重、合并、压缩;确认约束不足时再新增规则。
- 不写解释性禁令:禁止项直接写结果要求,不写“因为/所以”。
- 按阶段给信息:只在对应阶段放最重要规则,不要把全流程要求集中堆叠。
- 用状态词:优先短状态描述,不用长说明补充。
- 减少重复:同一含义只保留一个主规则,必要处只做短提醒。
