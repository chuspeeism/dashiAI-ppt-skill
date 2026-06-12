# Current Options

## themePack

- `theme01`: 01-轻拟态质感
- `theme02`: 02-炫光紫绿
- `theme03`: 03-深浅代码风
- `theme04`: 04-玻璃糖果
- `theme05`: 05-PULSE 色谱图表
- `theme06`: 06-深色数据图谱
- `theme07`: 07-冷白调研图谱
- `theme08`: 08-黑金实验质感
- `theme09`: 09-深蓝杂志
- `theme10`: 10-金色指数图表
- `theme11`: 11-高能增长图谱
- `theme12`: 12-声波霓虹

用户没有明确指定风格时,先列出以上风格并询问。

## slide

面向用户交付的每页使用 `layout` + `props`:

- `layout`: 直接指定页面 key,例如 `theme01_page001` 或 `theme12_page001`。
- `props`: 只填写可见文案/数据内容字段。普通生成不要写样式、结构、数量、显隐、强调、配色、图表或图片槽位控制字段。
- `role`: 只允许草稿阶段辅助选页,渲染前必须换成具体 `layout`。

每套主题的前 5 页都是封面候选。一个 deck 只能使用其中 1 页作为封面,正文页从第 6 页以后选择。

如果当前是在 Codex 环境中执行,且页面有插图/图片槽位或用户主题明显需要插图,必须先询问用户是否同意通过 image2 生图并插入 PPT。用户同意后,在对应插图位置/图片槽位写入生成图片;用户不同意或未回复时,不要生成图片,也不要替换图片槽位。

页面属性契约读取项目根目录的 `layout-manifest.json`。

需要调整卡片/条目数量时,用 `cardCount`、`itemCount`、`stepCount` 等 count 参数控制显示数量。数组字段是模板内容池,不要为了隐藏元素而截短 `cards`、`items`、`steps`、`stats` 等数组;只覆盖当前显示的前 N 项,保留后续默认项供控制面板加回。

不要使用旧的 `theme`、`fontSet`、`fontWeight`、`typeScale`、`styleVariant`、token 或开发者模式字段。
