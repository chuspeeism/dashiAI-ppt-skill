// presetBase.js — DEMO preset for the new pages (05–08), whose 3D hero element
// is integral to the layout. Supplies each one a `decorSrc` + turns it on.
// Used by BOTH harnesses so the new pages always show their hero. The slide
// components keep decorSrc default null (portable — no hard-coded asset paths).

import ICONS from "./icons.js";

const byId = Object.fromEntries(ICONS.map((i) => [i.id, i.src]));

export const PRESET_BASE = {
  rank:     { showDecor: true, decorSrc: byId["10"] }, // 奖杯 → 排名 / 赢家
  table:    { showDecor: true, decorSrc: byId["11"] }, // 文件夹 → 数据速查表
  quadrant: { showDecor: true, decorSrc: byId["12"] }, // 箱体 → 象限中心（中性立方）
  chain:    { showDecor: true, decorSrc: byId["03"] }, // 方块 → 分层 / 积木
  case:     { showDecor: true, decorSrc: byId["07"] }, // 显示器 → AI / 案例
  spotlight:{ showDecor: true, decorSrc: byId["02"] }, // YES 按键 → xAI 案例聚焦
  coreweave:{ showDecor: true, decorSrc: byId["09"] }, // 拍立得 → CoreWeave 案例配图
  casecompare:{ showDecor: true, decorSrc: byId["11"] }, // 文件夹 → 案例对比表
  section:  { showDecor: true, decorSrc: byId["08"] }, // 复古电脑 → 结构 / 展望
  round:    { showDecor: true, decorSrc: byId["06"] }, // 掌机图表 → 轮次图表
  monthly:  { showDecor: true, decorSrc: byId["09"] }, // 拍立得 → 月度明细
  stat:     { showDecor: true, decorSrc: byId["05"] }, // YES 气泡 → 核心数据
  // geo / mosaic 不预置 3D：这两页以图片为主，留白更干净（仍可在 Tweaks 手动开启）
  valuationjump:{ showDecor: true, decorSrc: byId["06"] }, // 掌机图表 → 估值跃迁图表
  valuation:{ showDecor: true, decorSrc: byId["12"] }, // 番茄箱 → 估值体量
  risk:     { showDecor: true, decorSrc: byId["04"] }, // 8-bit 幽灵 → 风险
  riskchain:{ showDecor: true, decorSrc: byId["03"] }, // 404 方块 → 断裂 / 传导链
  outlook:  { showDecor: true, decorSrc: byId["02"] }, // YES 按键 → 投资建议
  timeline: { showDecor: true, decorSrc: byId["06"] }, // 掌机图表 → 阶段策略时间轴
  takeaway: { showDecor: true, decorSrc: byId["05"] }, // YES 气泡 → 核心结论
  quote:    { showDecor: true, decorSrc: byId["01"] }, // 胜利手势 → 结论金句
  aarrr:    { showDecor: true, decorSrc: byId["06"] }, // 掌机图表 → 增长漏斗
  rfm:      { showDecor: true, decorSrc: byId["12"] }, // 番茄箱 → 立方体 / RFM
  maba:     { showDecor: true, decorSrc: byId["03"] }, // 方块 → 矩阵 / 九宫格
  gantt:    { showDecor: true, decorSrc: byId["11"] }, // 文件夹 → 项目排期
  doublediamond: { showDecor: true, decorSrc: byId["02"] }, // YES 按键 → 设计决策
  swot:       { showDecor: true, decorSrc: byId["03"] }, // 404 方块 → 四象限
  fiveforces: { showDecor: true, decorSrc: byId["10"] }, // 奖杯 → 竞争 / 胜出
  canvas:     { showDecor: true, decorSrc: byId["11"] }, // 文件夹 → 商业模式画布
  journey:    { showDecor: true, decorSrc: byId["09"] }, // 拍立得 → 触点 / 旅程瞬间
  pyramid:    { showDecor: true, decorSrc: byId["12"] }, // 番茄箱 → 层层堆叠 / 金字塔
  bcg:        { showDecor: false, quadIcons: [byId["10"], byId["04"], byId["12"], byId["03"]] }, // 明星 奖杯 / 问题 幽灵 / 现金牛 收割箱 / 瘦狗 404
  flywheel:   { showDecor: true, decorSrc: byId["05"] }, // YES 气泡 → 动能 / 增长
  pest:       { showDecor: true, decorSrc: byId["08"] }, // 复古电脑 → 宏观环境扫描
  pareto:     { showDecor: true, decorSrc: byId["06"] }, // 掌机图表 → 集中度图表
  radar:      { showDecor: true, decorSrc: byId["04"] }, // 8-bit 幽灵 → 风险信号
  shift:      { showDecor: true, decorSrc: byId["01"] }, // 胜利手势 → 范式转变
  betmatrix:  { showDecor: true, decorSrc: byId["02"] }, // YES 按键 → 投资决策
  share:      { showDecor: true, decorSrc: byId["05"] }, // YES 气泡 → 资本大年
  waterfall:  { showDecor: true, decorSrc: byId["06"] }, // 掌机图表 → 季度节奏
  treemap:    { showDecor: true, decorSrc: byId["03"] }, // 404 方块 → 资金版图
  escalation: { showDecor: true, decorSrc: byId["10"] }, // 奖杯 → 巨额化 / 头部
  // gallery 不预置 3D：图片为主，留白更干净（仍可在 Tweaks 手动开启）
  sankey:    { showDecor: true, decorSrc: byId["06"] }, // 掌机图表 → 资金流向
  scorecard: { showDecor: true, decorSrc: byId["11"] }, // 文件夹 → 记分卡
  gauge:     { showDecor: true, decorSrc: byId["04"] }, // 8-bit 幽灵 → 估值风险
  // embodied 不预置 3D：图片为主，留白更干净（仍可在 Tweaks 手动开启）
  rose:      { showDecor: true, decorSrc: byId["06"] }, // 掌机图表 → 月度节律
  marimekko: { showDecor: true, decorSrc: byId["03"] }, // 404 方块 → 资金结构
  concentration: { showDecor: true, decorSrc: byId["10"] }, // 奖杯 → 赢家通吃
  tornado:   { showDecor: true, decorSrc: byId["06"] }, // 掌机图表 → 轮次结构
  bubble:    { showDecor: true, decorSrc: byId["06"] }, // 掌机图表 → 融资体量气泡阵
  chronicle: { showDecor: true, decorSrc: byId["06"] }, // 掌机图表 → 年度编年时间轴
  register:  { showDecor: true, decorSrc: byId["04"] }, // 8-bit 幽灵 → 风险登记册
  waffle:    { showDecor: true, decorSrc: byId["06"] }, // 掌机图表 → 轮次单位图
  peak:      { showDecor: true, decorSrc: byId["05"] }, // YES 气泡 → 单月峰值
  cumulative:{ showDecor: true, decorSrc: byId["06"] }, // 掌机图表 → 资金累积曲线
  hypecycle: { showDecor: true, decorSrc: byId["04"] }, // 8-bit 幽灵 → 炒作泡沫 / 周期
  horizon:   { showDecor: true, decorSrc: byId["02"] }, // YES 按键 → 三视野投资决策
  // statement 不预置 3D：全幅影像为主，留白更干净（仍可在 Tweaks 手动开启）
  layertable:{ showDecor: true, decorSrc: byId["11"] }, // 文件夹 → 产业链速查表
  // vertical 不预置 3D：图片为主，留白更干净（仍可在 Tweaks 手动开启）
  // compute 不预置 3D：图片为主，留白更干净（仍可在 Tweaks 手动开启）
  moat:      { showDecor: true, decorSrc: byId["10"] }, // 奖杯 → 护城河 / 胜出
  supply:    { showDecor: true, decorSrc: byId["04"] }, // 8-bit 幽灵 → 卡脖子风险
  // chips 不预置 3D：图片为主，留白更干净（仍可在 Tweaks 手动开启）
  colophon: { showDecor: true, decorSrc: byId["10"] }, // 奖杯 → 封底 / 下一程
};

export default PRESET_BASE;
