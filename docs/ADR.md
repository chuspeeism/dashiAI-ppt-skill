# ADR

本文件由 `scripts/update-project-docs.mjs` 生成,记录当前项目已经采用的架构决策。

## ADR-001: 只登记已验收导入主题

当前对外主题包只包含已通过接入验收的 Claude Design 主题。blocked 主题、0 页主题、旧组件、旧素材、旧别名和旧 token 机制不登记进 Skill。

## ADR-002: React 只作为生成层

最终交付仍是静态 HTML。React 组件在本地渲染时生成 slide markup,浏览器运行时只负责翻页、预览控制、文本编辑、媒体替换、页面 props、动画和导出。

## ADR-003: Claude Design 主题是当前组件来源

页面组件放在 `src/components/themes/theme*/`。`src/components/themes/generated-metadata.js` 保存当前已验收主题、页面登记、默认内容和页面属性控制信息。

## ADR-004: 固定 16:9 舞台

PPT 舞台固定 16:9 等比缩放,窗口多余区域使用黑色填充。

## ADR-005: 输出目录是生成物

`output/` 用于 demo、验证 deck 和截图产物,不作为源码提交。

## ADR-006: 单一主题调试入口

`npm run showcase:update` 会检查 `all-themes-showcase.jsx` 覆盖当前全部已登记布局,并刷新唯一调试页 `output/theme-preview/ppt/index.html`。
