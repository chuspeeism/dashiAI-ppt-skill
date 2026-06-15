# Layout Pool

当前主题包互相独立,主题之间页面数量、文案和视觉结构互不对应。

## theme01

- 主题名: 01-轻拟态质感
- 页面数: 84
- 页面 key: `theme01_page001` 到 `theme01_page084`
- 封面候选: `theme01_page001` 到 `theme01_page005`,一个 deck 只选 1 页
- 视觉来源: `<skill-root>/project/src/components/themes/theme01`

## theme02

- 主题名: 02-炫光紫绿
- 页面数: 74
- 页面 key: `theme02_page001` 到 `theme02_page074`
- 封面候选: `theme02_page001` 到 `theme02_page005`,一个 deck 只选 1 页
- 视觉来源: `<skill-root>/project/src/components/themes/theme02`

## theme03

- 主题名: 03-深浅代码风
- 页面数: 77
- 页面 key: `theme03_page001` 到 `theme03_page077`
- 封面候选: `theme03_page001` 到 `theme03_page005`,一个 deck 只选 1 页
- 视觉来源: `<skill-root>/project/src/components/themes/theme03`

## theme04

- 主题名: 04-玻璃糖果
- 页面数: 74
- 页面 key: `theme04_page001` 到 `theme04_page074`
- 封面候选: `theme04_page001` 到 `theme04_page005`,一个 deck 只选 1 页
- 视觉来源: `<skill-root>/project/src/components/themes/theme04`

## theme05

- 主题名: 05-PULSE 色谱图表
- 页面数: 94
- 页面 key: `theme05_page001` 到 `theme05_page094`
- 封面候选: `theme05_page001` 到 `theme05_page005`,一个 deck 只选 1 页
- 视觉来源: `<skill-root>/project/src/components/themes/theme05`

## theme06

- 主题名: 06-深色数据图谱
- 页面数: 83
- 页面 key: `theme06_page001` 到 `theme06_page083`
- 封面候选: `theme06_page001` 到 `theme06_page005`,一个 deck 只选 1 页
- 视觉来源: `<skill-root>/project/src/components/themes/theme06`

## theme07

- 主题名: 07-冷白调研图谱
- 页面数: 71
- 页面 key: `theme07_page001` 到 `theme07_page071`
- 封面候选: `theme07_page001` 到 `theme07_page005`,一个 deck 只选 1 页
- 视觉来源: `<skill-root>/project/src/components/themes/theme07`

## theme08

- 主题名: 08-黑金实验质感
- 页面数: 84
- 页面 key: `theme08_page001` 到 `theme08_page084`
- 封面候选: `theme08_page001` 到 `theme08_page005`,一个 deck 只选 1 页
- 视觉来源: `<skill-root>/project/src/components/themes/theme08`

## theme09

- 主题名: 09-深蓝杂志
- 页面数: 111
- 页面 key: `theme09_page001` 到 `theme09_page111`
- 封面候选: `theme09_page001` 到 `theme09_page005`,一个 deck 只选 1 页
- 视觉来源: `<skill-root>/project/src/components/themes/theme09`

## theme10

- 主题名: 10-金色指数图表
- 页面数: 95
- 页面 key: `theme10_page001` 到 `theme10_page095`
- 封面候选: `theme10_page001` 到 `theme10_page005`,一个 deck 只选 1 页
- 视觉来源: `<skill-root>/project/src/components/themes/theme10`

## theme11

- 主题名: 11-高能增长图谱
- 页面数: 86
- 页面 key: `theme11_page001` 到 `theme11_page086`
- 封面候选: `theme11_page001` 到 `theme11_page005`,一个 deck 只选 1 页
- 视觉来源: `<skill-root>/project/src/components/themes/theme11`

## theme12

- 主题名: 12-声波霓虹
- 页面数: 86
- 页面 key: `theme12_page001` 到 `theme12_page086`
- 封面候选: `theme12_page001` 到 `theme12_page005`,一个 deck 只选 1 页
- 视觉来源: `<skill-root>/project/src/components/themes/theme12`

## Selection Procedure

1. 先根据用户要求确认 `themePack`;没有明确风格时先询问。
2. 根据用户内容拆出页面角色,例如: cover -> statement -> breakdown -> metrics -> actions -> closing。
3. 先从当前主题前 5 页中选 1 页作为封面;不要在同一个 deck 中使用多个前 5 页封面候选。
4. 正文页从第 6 页以后选择具体 `layout`,不要在最终 JSON 里只写 `role`。
5. 默认锁定模板结构,只填写文案/数据内容字段;不要按 `controls` 改样式或结构。
6. 同一页只承载一个主要信息角色,信息过多时压缩文字、拆页或换 layout。
7. 只有用户明确要求调整页面属性时,才读取 `layout-manifest.json` 并按 `controls` / `countBindings` 填对应 props。
8. 调整数量时通过 count 参数控制显示数量,不要截短数组;数组要保留模板默认尾部,保证用户后续能在控制面板加回。
