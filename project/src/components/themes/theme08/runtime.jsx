import { normalizeRuntimePages } from '../runtime-helpers.jsx';
import React from 'react';
import './source/image-slot.js';
import { AclTheme } from './source/components/AclPrimitives.jsx';
import * as M0 from './source/components/PageSupCover01.jsx';
import * as M1 from './source/components/PageSupCover02.jsx';
import * as M2 from './source/components/PageSupCover03.jsx';
import * as M3 from './source/components/PageCv2C.jsx';
import * as M4 from './source/components/Page01Cover.jsx';
import * as M5 from './source/components/Page02Summary.jsx';
import * as M6 from './source/components/Page03Chapters.jsx';
import * as M7 from './source/components/Page05Trend.jsx';
import * as M8 from './source/components/Page06Cross.jsx';
import * as M9 from './source/components/Page07Chain.jsx';
import * as M10 from './source/components/Page08Cases.jsx';
import * as M11 from './source/components/Page09Heatmap.jsx';
import * as M12 from './source/components/Page10Ranking.jsx';
import * as M13 from './source/components/Page11Quadrant.jsx';
import * as M14 from './source/components/Page13Strategy.jsx';
import * as M15 from './source/components/Page14Quote.jsx';
import * as M16 from './source/components/Page15Chapter.jsx';
import * as M17 from './source/components/Page16DealMap.jsx';
import * as M18 from './source/components/Page17Spotlight.jsx';
import * as M19 from './source/components/Page18Delta.jsx';
import * as M20 from './source/components/Page19Peak.jsx';
import * as M21 from './source/components/Page20Pullback.jsx';
import * as M22 from './source/components/Page21PeakTrough.jsx';
import * as M23 from './source/components/Page22Waterfall.jsx';
import * as M24 from './source/components/Page23SizeSplit.jsx';
import * as M25 from './source/components/Page24BigNumber.jsx';
import * as M26 from './source/components/Page25CapitalCurve.jsx';
import * as M27 from './source/components/Page26Chapter.jsx';
import * as M28 from './source/components/Page27Radar.jsx';
import * as M29 from './source/components/Page28Agent.jsx';
import * as M30 from './source/components/Page29Portal.jsx';
import * as M31 from './source/components/Page30Matrix.jsx';
import * as M32 from './source/components/Page31Triptych.jsx';
import * as M33 from './source/components/Page32Mix.jsx';
import * as M34 from './source/components/Page33Statement.jsx';
import * as M35 from './source/components/Page34Pipeline.jsx';
import * as M36 from './source/components/Page35Arch.jsx';
import * as M37 from './source/components/Page36Supply.jsx';
import * as M38 from './source/components/Page37Compute.jsx';
import * as M39 from './source/components/Page38ChipTiers.jsx';
import * as M40 from './source/components/Page39Embodied.jsx';
import * as M41 from './source/components/Page41Safety.jsx';
import * as M42 from './source/components/Page42Generative.jsx';
import * as M43 from './source/components/Page43Education.jsx';
import * as M44 from './source/components/Page44Support.jsx';
import * as M45 from './source/components/Page46LowCode.jsx';
import * as M46 from './source/components/Page47OpenSource.jsx';
import * as M47 from './source/components/Page48Alignment.jsx';
import * as M48 from './source/components/Page49Chapter.jsx';
import * as M49 from './source/components/Page50EarlyStage.jsx';
import * as M50 from './source/components/Page52InvestorMix.jsx';
import * as M51 from './source/components/Page53Resource.jsx';
import * as M52 from './source/components/Page54Loop.jsx';
import * as M53 from './source/components/Page55Ecosystem.jsx';
import * as M54 from './source/components/Page56GeoAnchor.jsx';
import * as M55 from './source/components/Page57NewYork.jsx';
import * as M56 from './source/components/Page58Seattle.jsx';
import * as M57 from './source/components/Page59Boston.jsx';
import * as M58 from './source/components/Page60OtherRegions.jsx';
import * as M59 from './source/components/Page61Resources.jsx';
import * as M60 from './source/components/Page64Network.jsx';
import * as M61 from './source/components/Page65Infra.jsx';
import * as M62 from './source/components/Page66DataInfra.jsx';
import * as M63 from './source/components/Page67Search.jsx';
import * as M64 from './source/components/Page68Platform.jsx';
import * as M65 from './source/components/Page69Knowledge.jsx';
import * as M66 from './source/components/Page71Narrative.jsx';
import * as M67 from './source/components/Page73Revenue.jsx';
import * as M68 from './source/components/Page74Regulation.jsx';
import * as M69 from './source/components/Page76Squeeze.jsx';
import * as M70 from './source/components/Page77Budget.jsx';
import * as M71 from './source/components/Page78Workflow.jsx';
import * as M72 from './source/components/Page79Repricing.jsx';
import * as M73 from './source/components/Page80Verdict.jsx';
import * as M74 from './source/components/Page81Mainlines.jsx';
import * as M75 from './source/components/Page82Migration.jsx';
import * as M76 from './source/components/Page83Playbooks.jsx';
import * as M77 from './source/components/Page84Gauge.jsx';
import * as M78 from './source/components/Page85HeroSplit.jsx';
import * as M79 from './source/components/Page86Dumbbell.jsx';
import * as M80 from './source/components/Page87Roadmap.jsx';
import * as M81 from './source/components/Page88PhotoWall.jsx';
import * as M82 from './source/components/Page90Scorecard.jsx';
import * as M83 from './source/components/Page91Quote.jsx';

const modules = [
  { id: 'sup1', label: "补充封面-① 智联万物", module: M0 },
  { id: 'sup2', label: "补充封面-② 深耕教学", module: M1 },
  { id: 'sup3', label: "补充封面-③ 新机遇新赛道", module: M2 },
  { id: 'cv2c', label: "封面2-③ 链通全国", module: M3 },
  { id: 'p1', label: "① 封面 · Cover", module: M4 },
  { id: 'p2', label: "② 摘要 · Overview", module: M5 },
  { id: 'p3', label: "③ 结构 · Contents", module: M6 },
  { id: 'p5', label: "⑤ 趋势 · Trend", module: M7 },
  { id: 'p6', label: "⑥ 透视 · Cross", module: M8 },
  { id: 'p7', label: "⑦ 产业链 · Chain", module: M9 },
  { id: 'p8', label: "⑧ 案例 · Cases", module: M10 },
  { id: 'p9', label: "⑨ 热力 · Heatmap", module: M11 },
  { id: 'p10', label: "⑩ 排名 · Ranking", module: M12 },
  { id: 'p11', label: "⑪ 象限 · Quadrant", module: M13 },
  { id: 'p13', label: "⑬ 策略 · Strategy", module: M14 },
  { id: 'p14', label: "⑭ 金句 · Quote", module: M15 },
  { id: 'p15', label: "⑮ 章节 · Chapter", module: M16 },
  { id: 'p16', label: "⑯ 气泡图 · Deal Map", module: M17 },
  { id: 'p17', label: "⑰ 季度聚焦 · Spotlight", module: M18 },
  { id: 'p18', label: "⑱ 指标对比 · Delta", module: M19 },
  { id: 'p19', label: "⑲ 峰值聚焦 · Peak", module: M20 },
  { id: 'p20', label: "⑳ 回落时间轴 · Pullback", module: M21 },
  { id: 'p21', label: "㉑ 峰谷对比 · Peak/Trough", module: M22 },
  { id: 'p22', label: "㉒ 贡献瀑布 · Waterfall", module: M23 },
  { id: 'p23', label: "㉓ 区间结构 · Size Split", module: M24 },
  { id: 'p24', label: "㉔ 大数字 · Big Number", module: M25 },
  { id: 'p25', label: "㉕ 累计曲线 · Capital Curve", module: M26 },
  { id: 'p26', label: "㉖ 章节 · Chapter", module: M27 },
  { id: 'p27', label: "㉗ 雷达图 · Radar", module: M28 },
  { id: 'p28', label: "㉘ 赛道卡 · Segment", module: M29 },
  { id: 'p29', label: "㉙ 知识入口 · Portal", module: M30 },
  { id: 'p30', label: "㉚ 场景矩阵 · Matrix", module: M31 },
  { id: 'p31', label: "㉛ 分支三联 · Triptych", module: M32 },
  { id: 'p32', label: "㉜ 场景占比 · Scene Split", module: M33 },
  { id: 'p33', label: "㉝ 金句 · Statement", module: M34 },
  { id: 'p34', label: "㉞ 数据底座 · Pipeline", module: M35 },
  { id: 'p35', label: "㉟ 架构 · Architecture", module: M36 },
  { id: 'p36', label: "㊱ 供应链 · Supply", module: M37 },
  { id: 'p37', label: "㊲ 算力网格 · Compute", module: M38 },
  { id: 'p38', label: "㊳ 芯片层级 · Chip Tiers", module: M39 },
  { id: 'p39', label: "㊴ 具身智能 · Embodied", module: M40 },
  { id: 'p41', label: "㊶ 安全防线 · Safety", module: M41 },
  { id: 'p42', label: "㊷ 内容生成 · Generative", module: M42 },
  { id: 'p43', label: "㊸ 学习路径 · Education", module: M43 },
  { id: 'p44', label: "㊹ 降本场景 · Support", module: M44 },
  { id: 'p46', label: "㊻ 流程嵌入 · Low Code", module: M45 },
  { id: 'p47', label: "㊼ 社区变现 · Open Source", module: M46 },
  { id: 'p48', label: "㊽ 安全对齐 · Alignment", module: M47 },
  { id: 'p49', label: "㊾ 章节 · Chapter", module: M48 },
  { id: 'p50', label: "㊿ 早期轮 · Early Stage", module: M49 },
  { id: 'p52', label: "(52) 资本来源 · Investor Mix", module: M50 },
  { id: 'p53', label: "(53) 资源绑定 · Resource Map", module: M51 },
  { id: 'p54', label: "(54) 算力闭环 · Closed Loop", module: M52 },
  { id: 'p55', label: "(55) GPU 生态 · Ecosystem", module: M53 },
  { id: 'p56', label: "(56) 大数字 · Geo Anchor", module: M54 },
  { id: 'p57', label: "(57) 地理卡 · New York", module: M55 },
  { id: 'p58', label: "(58) 地理卡 · Seattle", module: M56 },
  { id: 'p59', label: "(59) 地理卡 · Boston", module: M57 },
  { id: 'p60', label: "(60) 点阵图 · Other Regions", module: M58 },
  { id: 'p61', label: "(61) 金句 · Resources", module: M59 },
  { id: 'p64', label: "(64) 案例卡 · xAI", module: M60 },
  { id: 'p65', label: "(65) 案例卡 · CoreWeave", module: M61 },
  { id: 'p66', label: "(66) 案例表 · Scale AI", module: M62 },
  { id: 'p67', label: "(67) 案例卡 · Perplexity", module: M63 },
  { id: 'p68', label: "(68) 案例卡 · Databricks", module: M64 },
  { id: 'p69', label: "(69) 案例卡 · Glean", module: M65 },
  { id: 'p71', label: "(71) 案例卡 · SSI", module: M66 },
  { id: 'p73', label: "(73) 收入兑现 · Revenue", module: M67 },
  { id: 'p74', label: "(74) 合规台账 · Regulation", module: M68 },
  { id: 'p76', label: "(76) 壁垒压缩 · Squeeze", module: M69 },
  { id: 'p77', label: "(77) 策略卡 · Budget", module: M70 },
  { id: 'p78', label: "(78) 嵌入流程 · Workflow", module: M71 },
  { id: 'p79', label: "(79) 时间轴 · Repricing", module: M72 },
  { id: 'p80', label: "(80) 金句 · Verdict", module: M73 },
  { id: 'p81', label: "(81) 展望主线 · Mainlines", module: M74 },
  { id: 'p82', label: "(82) 迁移图 · Migration", module: M75 },
  { id: 'p83', label: "(83) 样板 · Playbooks", module: M76 },
  { id: 'p84', label: "(84) 大数字 · Gauge", module: M77 },
  { id: 'p85', label: "(85) 跨页 · Hero Split", module: M78 },
  { id: 'p86', label: "(86) 哑铃图 · Range", module: M79 },
  { id: 'p87', label: "(87) 路线图 · Roadmap", module: M80 },
  { id: 'p88', label: "(88) 照片墙 · Photo Wall", module: M81 },
  { id: 'p90', label: "(90) 记分卡 · Scorecard", module: M82 },
  { id: 'p91', label: "(91) 金句 · Two-Field", module: M83 }
];

const rawPages = modules.map(entry => ({
  id: entry.id,
  label: entry.label,
  Component: withAclTheme(entry.module.default),
  controls: entry.module.controls || entry.module.default?.controls || [],
  defaultProps: entry.module.defaults || entry.module.defaultProps || entry.module.default?.defaults || {},
}));

export const runtimePages = normalizeRuntimePages(rawPages, { themeKey: 'theme08', layoutPrefix: 'THEME08' });

function withAclTheme(Component) {
  return function Theme08Page(props) {
    return React.createElement(
      React.Fragment,
      null,
      React.createElement(AclTheme),
      React.createElement(Component, props),
    );
  };
}
