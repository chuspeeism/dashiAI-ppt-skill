import React from 'react';
import { normalizeRuntimePages } from '../runtime-helpers.jsx';
import SlideCoverA from './source/slides/SlideCoverA.jsx';
import SlideCoverB from './source/slides/SlideCoverB.jsx';
import SlideCoverC from './source/slides/SlideCoverC.jsx';
import SlideCoverD from './source/slides/SlideCoverD.jsx';
import SlideCover from './source/slides/SlideCover.jsx';
import SlideSummary from './source/slides/SlideSummary.jsx';
import SlideContents from './source/slides/SlideContents.jsx';
import SlideMethod from './source/slides/SlideMethod.jsx';
import SlideTrend from './source/slides/SlideTrend.jsx';
import SlideChapter from './source/slides/SlideChapter.jsx';
import SlideDealMap from './source/slides/SlideDealMap.jsx';
import SlideQuarter from './source/slides/SlideQuarter.jsx';
import SlidePeakMedia from './source/slides/SlidePeakMedia.jsx';
import SlideTimeline from './source/slides/SlideTimeline.jsx';
import SlidePeakTrough from './source/slides/SlidePeakTrough.jsx';
import SlideWaterfall from './source/slides/SlideWaterfall.jsx';
import SlideSizeSplit from './source/slides/SlideSizeSplit.jsx';
import SlideCumulative from './source/slides/SlideCumulative.jsx';
import SlideRadar from './source/slides/SlideRadar.jsx';
import SlideSegment from './source/slides/SlideSegment.jsx';
import SlideRanking from './source/slides/SlideRanking.jsx';
import SlideValueChain from './source/slides/SlideValueChain.jsx';
import SlideCases from './source/slides/SlideCases.jsx';
import SlideQuadrant from './source/slides/SlideQuadrant.jsx';
import SlideRisk from './source/slides/SlideRisk.jsx';
import SlideOutlook from './source/slides/SlideOutlook.jsx';
import SlideBigNumber from './source/slides/SlideBigNumber.jsx';
import SlideBranch from './source/slides/SlideBranch.jsx';
import SlideDonut from './source/slides/SlideDonut.jsx';
import SlideFlow from './source/slides/SlideFlow.jsx';
import SlideFunnel from './source/slides/SlideFunnel.jsx';
import SlideConvert from './source/slides/SlideConvert.jsx';
import SlideRounds from './source/slides/SlideRounds.jsx';
import SlideDealStruct from './source/slides/SlideDealStruct.jsx';
import SlideResource from './source/slides/SlideResource.jsx';
import SlideAlliance from './source/slides/SlideAlliance.jsx';
import SlideGeoCluster from './source/slides/SlideGeoCluster.jsx';
import SlideCaseStudy from './source/slides/SlideCaseStudy.jsx';
import SlideSpotlight from './source/slides/SlideSpotlight.jsx';
import SlideMeter from './source/slides/SlideMeter.jsx';
import SlideMatrix from './source/slides/SlideMatrix.jsx';
import SlideStrategy from './source/slides/SlideStrategy.jsx';
import SlideQuote from './source/slides/SlideQuote.jsx';
import SlideRoadmap from './source/slides/SlideRoadmap.jsx';
import SlideRecap from './source/slides/SlideRecap.jsx';
import SlideHeat from './source/slides/SlideHeat.jsx';
import SlideGallery from './source/slides/SlideGallery.jsx';
import SlideTreemap from './source/slides/SlideTreemap.jsx';
import SlideStatement from './source/slides/SlideStatement.jsx';

const sourcePages = [
  // ── 通用封面模板（标准页面组件，非 staticHtml）─────────────────
  { key: 'coverA',   Comp: SlideCoverA,   label: '封面A · 智联万物 / PRODUCT LAUNCH', defaultProps: SlideCoverA.defaults, controls: SlideCoverA.controls },
  { key: 'coverB',   Comp: SlideCoverB,   label: '封面B · 新机遇 / BUSINESS PLAN', defaultProps: SlideCoverB.defaults, controls: SlideCoverB.controls },
  { key: 'coverC',   Comp: SlideCoverC,   label: '封面C · 精益智造 / LEAN MFG', defaultProps: SlideCoverC.defaults, controls: SlideCoverC.controls },
  { key: 'coverD',   Comp: SlideCoverD,   label: '封面D · 品牌整合营销 / BRAND MKT', defaultProps: SlideCoverD.defaults, controls: SlideCoverD.controls },
  // ── 报告正文 ─────────────────────────────────────────────────
  { key: 'cover',    Comp: SlideCover,    label: '01 · 封面 / COVER', defaultProps: SlideCover.defaults, controls: SlideCover.controls },
  { key: 'summary',  Comp: SlideSummary,  label: '02 · 报告摘要 / OVERVIEW', defaultProps: SlideSummary.defaults, controls: SlideSummary.controls },
  { key: 'contents', Comp: SlideContents, label: '03 · 报告结构 / STRUCTURE', defaultProps: SlideContents.defaults, controls: SlideContents.controls },
  { key: 'method',   Comp: SlideMethod,   label: '04 · 研究方法 / METHODOLOGY', defaultProps: SlideMethod.defaults, controls: SlideMethod.controls },
  { key: 'trend',    Comp: SlideTrend,    label: '05 · 市场全景 / TREND', defaultProps: SlideTrend.defaults, controls: SlideTrend.controls },
  { key: 'chapter',  Comp: SlideChapter,  label: '06 · 市场数据深拆 / CHAPTER', defaultProps: SlideChapter.defaults, controls: SlideChapter.controls },
  { key: 'dealmap',  Comp: SlideDealMap,  label: '07 · 规模分层 / DEAL MAP', defaultProps: SlideDealMap.defaults, controls: SlideDealMap.controls },
  { key: 'q1',       Comp: SlideQuarter,  label: '08 · 冷启动季度 / Q1 BREAKDOWN', defaultProps: SlideQuarter.defaults, controls: SlideQuarter.controls },
  { key: 'q2',       Comp: SlideQuarter,  label: '09 · 加速季度 / Q2 BREAKDOWN', initial: SlideQuarter.presetQ2, defaultProps: { ...SlideQuarter.defaults, ...SlideQuarter.presetQ2 }, controls: SlideQuarter.controls },
  { key: 'q3',       Comp: SlidePeakMedia, label: '10 · 峰值季度 / Q3 PEAK', defaultProps: SlidePeakMedia.defaults, controls: SlidePeakMedia.controls },
  { key: 'q4',       Comp: SlideTimeline, label: '11 · 回落季度 / Q4 PULLBACK', defaultProps: SlideTimeline.defaults, controls: SlideTimeline.controls },
  { key: 'peaktrough', Comp: SlidePeakTrough, label: '12 · 峰值与低位 / PEAK & TROUGH', defaultProps: SlidePeakTrough.defaults, controls: SlidePeakTrough.controls },
  { key: 'waterfall', Comp: SlideWaterfall, label: '13 · 赛道贡献 / WATERFALL', defaultProps: SlideWaterfall.defaults, controls: SlideWaterfall.controls },
  { key: 'sizesplit', Comp: SlideSizeSplit, label: '14 · 金额区间结构 / SIZE SPLIT', defaultProps: SlideSizeSplit.defaults, controls: SlideSizeSplit.controls },
  { key: 'avgticket', Comp: SlideBigNumber, label: '15 · 赛道平均融资额 / AVG TICKET', initial: SlideBigNumber.presetTicket, defaultProps: { ...SlideBigNumber.defaults, ...SlideBigNumber.presetTicket }, controls: SlideBigNumber.controls },
  { key: 'cumulative', Comp: SlideCumulative, label: '16 · 累计资金分布 / CAPITAL CURVE', defaultProps: SlideCumulative.defaults, controls: SlideCumulative.controls },
  { key: 'ch03',      Comp: SlideChapter,   label: '17 · 赛道结构细分 / CHAPTER 03', initial: SlideChapter.presetCh03, defaultProps: { ...SlideChapter.defaults, ...SlideChapter.presetCh03 }, controls: SlideChapter.controls },
  { key: 'radar',    Comp: SlideRadar,    label: '18 · 模型实验室竞争 / MODEL LAB RACE', defaultProps: SlideRadar.defaults, controls: SlideRadar.controls },
  { key: 'agent',    Comp: SlideSegment,  label: '19 · 工作流自动化 / AI AGENTS', defaultProps: SlideSegment.defaults, controls: SlideSegment.controls },
  { key: 'search',   Comp: SlideSegment,  label: '20 · 知识入口 / ENTERPRISE SEARCH', initial: SlideSegment.presetSearch, defaultProps: { ...SlideSegment.defaults, ...SlideSegment.presetSearch }, controls: SlideSegment.controls },
  { key: 'legal',    Comp: SlideSegment,  label: '21 · 专业服务 / LEGAL AI', initial: SlideSegment.presetLegal, defaultProps: { ...SlideSegment.defaults, ...SlideSegment.presetLegal }, controls: SlideSegment.controls },
  { key: 'ranking',  Comp: SlideRanking,  label: '22 · 融资排名 / RANKING', defaultProps: SlideRanking.defaults, controls: SlideRanking.controls },
  { key: 'chain',    Comp: SlideValueChain, label: '23 · 产业链分层 / VALUE CHAIN', defaultProps: SlideValueChain.defaults, controls: SlideValueChain.controls },
  { key: 'cases',    Comp: SlideCases,    label: '24 · 典型案例 / CASE STUDIES', defaultProps: SlideCases.defaults, controls: SlideCases.controls },
  { key: 'quadrant', Comp: SlideQuadrant, label: '25 · 机会矩阵 / QUADRANT', defaultProps: SlideQuadrant.defaults, controls: SlideQuadrant.controls },
  { key: 'risk',     Comp: SlideRisk,     label: '26 · 风险研判 / RISK', defaultProps: SlideRisk.defaults, controls: SlideRisk.controls },
  { key: 'outlook',  Comp: SlideOutlook,  label: '27 · 投资建议 / OUTLOOK', defaultProps: SlideOutlook.defaults, controls: SlideOutlook.controls },
  { key: 'big',      Comp: SlideBigNumber, label: '28 · 大数字 / BIG NUMBER', defaultProps: SlideBigNumber.defaults, controls: SlideBigNumber.controls },
  { key: 'health',   Comp: SlideBranch,   label: '29 · 慢变量高壁垒 / HEALTHCARE AI', defaultProps: SlideBranch.defaults, controls: SlideBranch.controls },
  { key: 'finance',  Comp: SlideDonut,    label: '30 · 投研风控合规 / FINANCE AI', defaultProps: SlideDonut.defaults, controls: SlideDonut.controls },
  { key: 'dev',      Comp: SlideQuote,    label: '31 · 研发效率提升 / DEV TOOLS', initial: SlideQuote.presetDev, defaultProps: { ...SlideQuote.defaults, ...SlideQuote.presetDev }, controls: SlideQuote.controls },
  { key: 'datainfra', Comp: SlideFlow,    label: '32 · 企业 AI 底座 / DATA INFRA', defaultProps: SlideFlow.defaults, controls: SlideFlow.controls },
  { key: 'growth',   Comp: SlideFunnel,   label: '33 · 增长效率工具 / GROWTH', defaultProps: SlideFunnel.defaults, controls: SlideFunnel.controls },
  { key: 'lowcode',  Comp: SlideSegment,  label: '34 · 企业流程嵌入 / LOW CODE', initial: SlideSegment.presetLowcode, defaultProps: { ...SlideSegment.defaults, ...SlideSegment.presetLowcode }, controls: SlideSegment.controls },
  { key: 'opensource', Comp: SlideConvert, label: '35 · 社区影响力变现 / OPEN SOURCE', defaultProps: SlideConvert.defaults, controls: SlideConvert.controls },
  { key: 'safety',   Comp: SlideFlow,     label: '36 · 安全与对齐工具 / ALIGNMENT', initial: SlideFlow.presetSafety, defaultProps: { ...SlideFlow.defaults, ...SlideFlow.presetSafety }, controls: SlideFlow.controls },
  // ── 资本与地区结构 ──────────────────────────────
  { key: 'ch04',     Comp: SlideChapter,    label: '37 · 资本与地区结构 / CHAPTER 04', initial: SlideChapter.presetCh04, defaultProps: { ...SlideChapter.defaults, ...SlideChapter.presetCh04 }, controls: SlideChapter.controls },
  { key: 'rounds',   Comp: SlideRounds,     label: '38 · 新主题萌芽 / EARLY-STAGE SIGNAL', defaultProps: SlideRounds.defaults, controls: SlideRounds.controls },
  { key: 'dealstruct', Comp: SlideDealStruct, label: '39 · 复杂交易结构 / DEAL STRUCTURE', defaultProps: SlideDealStruct.defaults, controls: SlideDealStruct.controls },
  { key: 'investor', Comp: SlideDonut,      label: '40 · 资本来源结构 / INVESTOR MIX', initial: SlideDonut.presetInvestor, defaultProps: { ...SlideDonut.defaults, ...SlideDonut.presetInvestor }, controls: SlideDonut.controls },
  { key: 'resource', Comp: SlideResource,   label: '41 · 钱以外的资源 / STRATEGIC RESOURCES', defaultProps: SlideResource.defaults, controls: SlideResource.controls },
  { key: 'alliance', Comp: SlideAlliance,   label: '42 · 投资与算力消费闭环 / CLOUD ALLIANCES', defaultProps: SlideAlliance.defaults, controls: SlideAlliance.controls },
  { key: 'gpu',      Comp: SlideBranch,     label: '43 · GPU 资源链条 / NVIDIA ECOSYSTEM', initial: SlideBranch.presetGpu, defaultProps: { ...SlideBranch.defaults, ...SlideBranch.presetGpu }, controls: SlideBranch.controls },
  { key: 'bay',      Comp: SlideBigNumber,  label: '44 · 最大地理中心 / BAY AREA', initial: SlideBigNumber.presetBay, defaultProps: { ...SlideBigNumber.defaults, ...SlideBigNumber.presetBay }, controls: SlideBigNumber.controls },
  // ── 地区集群 ──────────
  { key: 'nyc',      Comp: SlideGeoCluster, label: '45 · 行业客户优势 / NEW YORK', defaultProps: SlideGeoCluster.defaults, controls: SlideGeoCluster.controls },
  { key: 'seattle',  Comp: SlideGeoCluster, label: '46 · 云计算人才外溢 / SEATTLE', initial: SlideGeoCluster.presetSeattle, defaultProps: { ...SlideGeoCluster.defaults, ...SlideGeoCluster.presetSeattle }, controls: SlideGeoCluster.controls },
  { key: 'boston',   Comp: SlideGeoCluster, label: '47 · 科研与硬科技 / BOSTON', initial: SlideGeoCluster.presetBoston, defaultProps: { ...SlideGeoCluster.defaults, ...SlideGeoCluster.presetBoston }, controls: SlideGeoCluster.controls },
  { key: 'other',    Comp: SlideGeoCluster, label: '48 · 分散型应用落地 / OTHER REGIONS', initial: SlideGeoCluster.presetOther, defaultProps: { ...SlideGeoCluster.defaults, ...SlideGeoCluster.presetOther }, controls: SlideGeoCluster.controls },
  // ── 资源三角 + 公司案例 ──────────────────────────────
  { key: 'triad',    Comp: SlideQuote,      label: '49 · 三类关键资源 / TALENT·CAPITAL·COMPUTE', initial: SlideQuote.presetTriad, defaultProps: { ...SlideQuote.defaults, ...SlideQuote.presetTriad }, controls: SlideQuote.controls },
  { key: 'openai',   Comp: SlideCaseStudy,  label: '50 · 商业化标杆 / OPENAI', defaultProps: SlideCaseStudy.defaults, controls: SlideCaseStudy.controls },
  { key: 'anthropic', Comp: SlideCaseStudy, label: '51 · 安全可靠模型 / ANTHROPIC', initial: SlideCaseStudy.presetAnthropic, defaultProps: { ...SlideCaseStudy.defaults, ...SlideCaseStudy.presetAnthropic }, controls: SlideCaseStudy.controls },
  { key: 'xai',      Comp: SlideCaseStudy,  label: '52 · 实时数据生态 / XAI', initial: SlideCaseStudy.presetXai, defaultProps: { ...SlideCaseStudy.defaults, ...SlideCaseStudy.presetXai }, controls: SlideCaseStudy.controls },
  // ── 算力 / 数据 基础设施案例 ──────────────────────────
  { key: 'coreweave', Comp: SlideCaseStudy, label: '53 · 算力基础设施 / COREWEAVE', initial: SlideCaseStudy.presetCoreweave, defaultProps: { ...SlideCaseStudy.defaults, ...SlideCaseStudy.presetCoreweave }, controls: SlideCaseStudy.controls },
  { key: 'scaleai',  Comp: SlideMatrix,     label: '54 · 数据基础设施 / SCALE AI · TABLE', defaultProps: SlideMatrix.defaults, controls: SlideMatrix.controls },
  // ── 公司案例续 ────────
  { key: 'perplexity', Comp: SlideSpotlight, label: '55 · AI 搜索入口 / PERPLEXITY', defaultProps: SlideSpotlight.defaults, controls: SlideSpotlight.controls },
  { key: 'databricks', Comp: SlideSpotlight, label: '56 · 数据平台延展 / DATABRICKS', initial: SlideSpotlight.presetDatabricks, defaultProps: { ...SlideSpotlight.defaults, ...SlideSpotlight.presetDatabricks }, controls: SlideSpotlight.controls },
  { key: 'glean',    Comp: SlideSpotlight,  label: '57 · 企业知识入口 / GLEAN', initial: SlideSpotlight.presetGlean, defaultProps: { ...SlideSpotlight.defaults, ...SlideSpotlight.presetGlean }, controls: SlideSpotlight.controls },
  { key: 'figure',   Comp: SlideBigNumber,  label: '58 · 人形机器人 / FIGURE AI', initial: SlideBigNumber.presetFigure, defaultProps: { ...SlideBigNumber.defaults, ...SlideBigNumber.presetFigure }, controls: SlideBigNumber.controls },
  // ── 案例收束 + 风险与策略 ───────────────────────
  { key: 'ssi',      Comp: SlideSpotlight,  label: '59 · 强叙事模型实验室 / SSI', initial: SlideSpotlight.presetSSI, defaultProps: { ...SlideSpotlight.defaults, ...SlideSpotlight.presetSSI }, controls: SlideSpotlight.controls },
  { key: 'ch05',     Comp: SlideChapter,    label: '60 · 风险与策略 / CHAPTER 05', initial: SlideChapter.presetCh05, defaultProps: { ...SlideChapter.defaults, ...SlideChapter.presetCh05 }, controls: SlideChapter.controls },
  { key: 'revrisk',  Comp: SlideMeter,      label: '61 · 从试点到稳定收入 / REVENUE RISK', defaultProps: SlideMeter.defaults, controls: SlideMeter.controls },
  { key: 'regrisk',  Comp: SlideMatrix,     label: '62 · 隐私版权与安全 / REGULATION · TABLE', initial: SlideMatrix.presetRegRisk, defaultProps: { ...SlideMatrix.defaults, ...SlideMatrix.presetRegRisk }, controls: SlideMatrix.controls },
  // ── 风险收尾 + 策略 ────────────────────────────
  { key: 'compute',  Comp: SlideBigNumber,  label: '63 · 毛利天花板 / COMPUTE COST', initial: SlideBigNumber.presetCompute, defaultProps: { ...SlideBigNumber.defaults, ...SlideBigNumber.presetCompute }, controls: SlideBigNumber.controls },
  { key: 'openrisk', Comp: SlideMeter,      label: '64 · 壁垒被压缩 / OPEN SOURCE RISK', initial: SlideMeter.presetOpenRisk, defaultProps: { ...SlideMeter.defaults, ...SlideMeter.presetOpenRisk }, controls: SlideMeter.controls },
  { key: 'infra',    Comp: SlideStrategy,   label: '65 · 确定性预算 / INFRA STRATEGY', defaultProps: SlideStrategy.defaults, controls: SlideStrategy.controls },
  { key: 'vertical', Comp: SlideStrategy,   label: '66 · 嵌入工作流 / VERTICAL STRATEGY', initial: SlideStrategy.presetVertical, defaultProps: { ...SlideStrategy.defaults, ...SlideStrategy.presetVertical }, controls: SlideStrategy.controls },
  { key: 'quote',    Comp: SlideQuote,    label: '67 · 结论 / CONCLUSION', defaultProps: SlideQuote.defaults, controls: SlideQuote.controls },
  // ── 收尾 ─────────────────
  { key: 'ipowatch', Comp: SlideRoadmap,  label: '68 · 估值锚重定价 / IPO WATCH', defaultProps: SlideRoadmap.defaults, controls: SlideRoadmap.controls },
  // ── 数据附录精读 ─────────────
  { key: 'ch06',     Comp: SlideChapter,  label: '69 · 数据附录精读 / CHAPTER 06', initial: SlideChapter.presetCh06, defaultProps: { ...SlideChapter.defaults, ...SlideChapter.presetCh06 }, controls: SlideChapter.controls },
  { key: 'heatmap',  Comp: SlideHeat,     label: '70 · 全年月度热力 / MONTHLY HEAT', defaultProps: SlideHeat.defaults, controls: SlideHeat.controls },
  { key: 'megadeals', Comp: SlideGallery, label: '71 · 超级交易画像 / MEGA DEALS', defaultProps: SlideGallery.defaults, controls: SlideGallery.controls },
  { key: 'megabig',  Comp: SlideBigNumber, label: '72 · 超级交易均值 / MEGA AVG', initial: SlideBigNumber.presetMega, defaultProps: { ...SlideBigNumber.defaults, ...SlideBigNumber.presetMega }, controls: SlideBigNumber.controls },
  { key: 'recap',    Comp: SlideRecap,    label: '73 · 全景速览 / YEAR IN ONE VIEW', defaultProps: SlideRecap.defaults, controls: SlideRecap.controls },
  { key: 'sources',  Comp: SlideMatrix,   label: '74 · 数据来源与口径 / SOURCES', initial: SlideMatrix.presetSources, defaultProps: { ...SlideMatrix.defaults, ...SlideMatrix.presetSources }, controls: SlideMatrix.controls },
  { key: 'closing',  Comp: SlideQuote,    label: '75 · 最终判断 / FINAL VERDICT', initial: SlideQuote.presetClosing, defaultProps: { ...SlideQuote.defaults, ...SlideQuote.presetClosing }, controls: SlideQuote.controls },
  // ── 前瞻信号 ────────────────────
  { key: 'ch07',     Comp: SlideChapter,  label: '76 · 前瞻信号 / CHAPTER 07', initial: SlideChapter.presetCh07, defaultProps: { ...SlideChapter.defaults, ...SlideChapter.presetCh07 }, controls: SlideChapter.controls },
  { key: 'capflow',  Comp: SlideTreemap,  label: '77 · 资本流向预测 / CAPITAL FLOW', defaultProps: SlideTreemap.defaults, controls: SlideTreemap.controls },
  { key: 'statement', Comp: SlideStatement, label: '78 · 前瞻主题 / FORWARD STATEMENT', defaultProps: SlideStatement.defaults, controls: SlideStatement.controls },
  { key: 'milestones', Comp: SlideRoadmap, label: '79 · 里程碑节奏 / MILESTONES 2025', initial: SlideRoadmap.presetSignals, defaultProps: { ...SlideRoadmap.defaults, ...SlideRoadmap.presetSignals }, controls: SlideRoadmap.controls },
];

const STATIC_HTML_CSS = "@import url(\"https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;800;900&family=Space+Mono:wght@400;700&family=Noto+Sans+SC:wght@400;500;700;900&family=Space+Grotesk:wght@400;500;600;700&display=swap\");\n.imported-static-cover{box-sizing:border-box}.imported-static-cover *{box-sizing:border-box}\n";
const staticCoverData = [];

const staticPages = staticCoverData.map(entry => ({
  id: entry.id,
  label: entry.label,
  staticHtml: true,
  Component: makeStaticHtmlComponent(entry),
}));

function makeStaticHtmlComponent(entry) {
  return function StaticHtmlPage() {
    return React.createElement(
      React.Fragment,
      null,
      STATIC_HTML_CSS ? React.createElement('style', null, STATIC_HTML_CSS) : null,
      React.createElement('div', {
        className: ['imported-static-cover', entry.className].filter(Boolean).join(' '),
        style: { position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'hidden' },
        dangerouslySetInnerHTML: { __html: entry.innerHtml },
      }),
    );
  };
}

const rawPages = [...staticPages, ...sourcePages];

export const runtimePages = normalizeRuntimePages(rawPages, { themeKey: 'theme06', layoutPrefix: 'THEME06' });
