import React from 'react';
import { normalizeRuntimePages } from '../runtime-helpers.jsx';
import { GXN_SCHEMES, deckOverrideCSS } from './source/src/gxnTheme.js';
import { SlideCover, slideCoverDefaults, slideCoverControls } from './source/src/slides/SlideCover.jsx';
import { SlideCoverBeam, slideCoverBeamDefaults, slideCoverBeamControls } from './source/src/slides/SlideCoverBeam.jsx';
import { SlideCoverFigure, slideCoverFigureDefaults, slideCoverFigureControls } from './source/src/slides/SlideCoverFigure.jsx';
import { SlideCoverPoster, slideCoverPosterDefaults, slideCoverPosterControls } from './source/src/slides/SlideCoverPoster.jsx';
import { SlideCoverPanel, slideCoverPanelDefaults, slideCoverPanelControls } from './source/src/slides/SlideCoverPanel.jsx';
import { SlideMethod, slideMethodDefaults, slideMethodControls } from './source/src/slides/SlideMethod.jsx';
import { SlideAgenda, slideAgendaDefaults, slideAgendaControls } from './source/src/slides/SlideAgenda.jsx';
import { SlideTrend, slideTrendDefaults, slideTrendControls } from './source/src/slides/SlideTrend.jsx';
import { SlideHeatmap, slideHeatmapDefaults, slideHeatmapControls } from './source/src/slides/SlideHeatmap.jsx';
import { SlideIndustry, slideIndustryDefaults, slideIndustryControls } from './source/src/slides/SlideIndustry.jsx';
import { SlideRanking, slideRankingDefaults, slideRankingControls } from './source/src/slides/SlideRanking.jsx';
import { SlideTimeline, slideTimelineDefaults, slideTimelineControls } from './source/src/slides/SlideTimeline.jsx';
import { SlideShowcase, slideShowcaseDefaults, slideShowcaseControls } from './source/src/slides/SlideShowcase.jsx';
import { SlideSection, slideSectionDefaults, slideSectionControls } from './source/src/slides/SlideSection.jsx';
import { SlideQuadrant, slideQuadrantDefaults, slideQuadrantControls } from './source/src/slides/SlideQuadrant.jsx';
import { SlideRadar, slideRadarDefaults, slideRadarControls } from './source/src/slides/SlideRadar.jsx';
import { SlideMatrixTable, slideMatrixTableDefaults, slideMatrixTableControls } from './source/src/slides/SlideMatrixTable.jsx';
import { SlideChain, slideChainDefaults, slideChainControls } from './source/src/slides/SlideChain.jsx';
import { SlideMetrics, slideMetricsDefaults, slideMetricsControls } from './source/src/slides/SlideMetrics.jsx';
import { SlideBigNumber, slideBigNumberDefaults, slideBigNumberControls } from './source/src/slides/SlideBigNumber.jsx';
import { SlideDelta, slideDeltaDefaults, slideDeltaControls } from './source/src/slides/SlideDelta.jsx';
import { SlideBento, slideBentoDefaults, slideBentoControls } from './source/src/slides/SlideBento.jsx';
import { SlideSpotlight, slideSpotlightDefaults, slideSpotlightControls } from './source/src/slides/SlideSpotlight.jsx';
import { SlideFeature, slideFeatureDefaults, slideFeatureControls } from './source/src/slides/SlideFeature.jsx';
import { SlideCardGrid, slideCardGridDefaults, slideCardGridControls } from './source/src/slides/SlideCardGrid.jsx';
import { SlideZigzag, slideZigzagDefaults, slideZigzagControls } from './source/src/slides/SlideZigzag.jsx';
import { SlideGalleryBand, slideGalleryBandDefaults, slideGalleryBandControls } from './source/src/slides/SlideGalleryBand.jsx';
import { SlideLogoWall, slideLogoWallDefaults, slideLogoWallControls } from './source/src/slides/SlideLogoWall.jsx';
import { SlideCompare, slideCompareDefaults, slideCompareControls } from './source/src/slides/SlideCompare.jsx';
import { SlideRoundTable, slideRoundTableDefaults, slideRoundTableControls } from './source/src/slides/SlideRoundTable.jsx';
import { SlideCompareTable, slideCompareTableDefaults, slideCompareTableControls } from './source/src/slides/SlideCompareTable.jsx';
import { SlideRegion, slideRegionDefaults, slideRegionControls } from './source/src/slides/SlideRegion.jsx';
import { SlideMarimekko, slideMarimekkoDefaults, slideMarimekkoControls } from './source/src/slides/SlideMarimekko.jsx';
import { SlideFunnel, slideFunnelDefaults, slideFunnelControls } from './source/src/slides/SlideFunnel.jsx';
import { SlideScatter, slideScatterDefaults, slideScatterControls } from './source/src/slides/SlideScatter.jsx';
import { SlideWaterfall, slideWaterfallDefaults, slideWaterfallControls } from './source/src/slides/SlideWaterfall.jsx';
import { SlideGauge, slideGaugeDefaults, slideGaugeControls } from './source/src/slides/SlideGauge.jsx';
import { SlideProgress, slideProgressDefaults, slideProgressControls } from './source/src/slides/SlideProgress.jsx';
import { SlidePortraitQuote, slidePortraitQuoteDefaults, slidePortraitQuoteControls } from './source/src/slides/SlidePortraitQuote.jsx';
import { SlideVoices, slideVoicesDefaults, slideVoicesControls } from './source/src/slides/SlideVoices.jsx';
import { SlideProcess, slideProcessDefaults, slideProcessControls } from './source/src/slides/SlideProcess.jsx';
import { SlideTakeaway, slideTakeawayDefaults, slideTakeawayControls } from './source/src/slides/SlideTakeaway.jsx';
import { SlideRisk, slideRiskDefaults, slideRiskControls } from './source/src/slides/SlideRisk.jsx';
import { SlideQuote, slideQuoteDefaults, slideQuoteControls } from './source/src/slides/SlideQuote.jsx';
import { SlideStackedBar, slideStackedBarDefaults, slideStackedBarControls } from './source/src/slides/SlideStackedBar.jsx';
import { SlideMosaic, slideMosaicDefaults, slideMosaicControls } from './source/src/slides/SlideMosaic.jsx';
import { SlideDataTable, slideDataTableDefaults, slideDataTableControls } from './source/src/slides/SlideDataTable.jsx';
import { SlideVersus, slideVersusDefaults, slideVersusControls } from './source/src/slides/SlideVersus.jsx';
import { SlideProfile, slideProfileDefaults, slideProfileControls } from './source/src/slides/SlideProfile.jsx';
import { SlideStoryboard, slideStoryboardDefaults, slideStoryboardControls } from './source/src/slides/SlideStoryboard.jsx';
import { SlideDumbbell, slideDumbbellDefaults, slideDumbbellControls } from './source/src/slides/SlideDumbbell.jsx';
import { SlideManifesto, slideManifestoDefaults, slideManifestoControls } from './source/src/slides/SlideManifesto.jsx';
import { SlideRoadmap, slideRoadmapDefaults, slideRoadmapControls } from './source/src/slides/SlideRoadmap.jsx';
import { SlideBubbleTimeline, slideBubbleTimelineDefaults, slideBubbleTimelineControls } from './source/src/slides/SlideBubbleTimeline.jsx';
import { SlidePyramid, slidePyramidDefaults, slidePyramidControls } from './source/src/slides/SlidePyramid.jsx';
import { SlideEditorial, slideEditorialDefaults, slideEditorialControls } from './source/src/slides/SlideEditorial.jsx';
import { SlideSankey, slideSankeyDefaults, slideSankeyControls } from './source/src/slides/SlideSankey.jsx';
import { SlidePictogram, slidePictogramDefaults, slidePictogramControls } from './source/src/slides/SlidePictogram.jsx';
import { SlidePoster, slidePosterDefaults, slidePosterControls } from './source/src/slides/SlidePoster.jsx';
import { SlideClosing, slideClosingDefaults, slideClosingControls } from './source/src/slides/SlideClosing.jsx';
import { SlidePareto, slideParetoDefaults, slideParetoControls } from './source/src/slides/SlidePareto.jsx';
import { SlideRose, slideRoseDefaults, slideRoseControls } from './source/src/slides/SlideRose.jsx';
import { SlideTreemap, slideTreemapDefaults, slideTreemapControls } from './source/src/slides/SlideTreemap.jsx';
import { SlideCycleWheel, slideCycleWheelDefaults, slideCycleWheelControls } from './source/src/slides/SlideCycleWheel.jsx';
import { SlideSlope, slideSlopeDefaults, slideSlopeControls } from './source/src/slides/SlideSlope.jsx';
import { SlideOrbit, slideOrbitDefaults, slideOrbitControls } from './source/src/slides/SlideOrbit.jsx';
import { SlideLinkedSpheres, slideLinkedSpheresDefaults, slideLinkedSpheresControls } from './source/src/slides/SlideLinkedSpheres.jsx';
import { SlideMindmap, slideMindmapDefaults, slideMindmapControls } from './source/src/slides/SlideMindmap.jsx';
import { SlideSunburst, slideSunburstDefaults, slideSunburstControls } from './source/src/slides/SlideSunburst.jsx';
import { SlideBump, slideBumpDefaults, slideBumpControls } from './source/src/slides/SlideBump.jsx';
import { SlideMasonry, slideMasonryDefaults, slideMasonryControls } from './source/src/slides/SlideMasonry.jsx';
import { SlideVenn, slideVennDefaults, slideVennControls } from './source/src/slides/SlideVenn.jsx';
import { SlideStream, slideStreamDefaults, slideStreamControls } from './source/src/slides/SlideStream.jsx';
import { SlideHistogram, slideHistogramDefaults, slideHistogramControls } from './source/src/slides/SlideHistogram.jsx';

const THEME02_DECK_DEFAULTS = {
  scheme: 'green',
  emphasis: 'ticket',
  breath: 55,
  magnet: true,
  aurora: true,
  auroraSpeed: 1,
};

const THEME02_DECK_CONTROLS = [
  { key: 'scheme', type: 'enum', label: '配色方案', default: 'green', options: [['green', '霓虹绿'], ['violet', '炫光紫']], desc: '切换整页炫光配色。' },
  { key: 'emphasis', type: 'enum', label: '强调卡片', default: 'ticket', options: [['default', '默认发光'], ['ticket', '炫光票卡']], desc: '切换焦点卡片的发光质感。' },
  { key: 'breath', type: 'slider', label: '内光呼吸感', default: 55, min: 0, max: 100, step: 1, desc: '炫光票卡模式下的内光呼吸强度。' },
  { key: 'magnet', type: 'toggle', label: '磁吸悬停', default: true, desc: '焦点卡片跟随指针产生轻微位移和倾斜。' },
  { key: 'aurora', type: 'toggle', label: '渐变流光', default: true, desc: '开启标题、数字和图表重点元素的流光渐变。' },
  { key: 'auroraSpeed', type: 'slider', label: '流光速度', default: 1, min: 0.4, max: 3, step: 0.1, desc: '流光动画速度。' },
];

const sourcePages = [
  { key: 'cover', name: '封面 · Cover', mount: 'gxn-m-cover',
    Comp: SlideCover, defaults: slideCoverDefaults, controls: slideCoverControls },
  { key: 'coverbeam', name: '封面 A · 居中聚光', mount: 'gxn-m-coverbeam',
    Comp: SlideCoverBeam, defaults: slideCoverBeamDefaults, controls: slideCoverBeamControls },
  { key: 'coverfigure', name: '封面 B · 大数主视觉', mount: 'gxn-m-coverfigure',
    Comp: SlideCoverFigure, defaults: slideCoverFigureDefaults, controls: slideCoverFigureControls },
  { key: 'coverposter', name: '封面 C · 满幅图海报', mount: 'gxn-m-coverposter',
    Comp: SlideCoverPoster, defaults: slideCoverPosterDefaults, controls: slideCoverPosterControls },
  { key: 'coverpanel', name: '封面 D · 模块网格', mount: 'gxn-m-coverpanel',
    Comp: SlideCoverPanel, defaults: slideCoverPanelDefaults, controls: slideCoverPanelControls },
  { key: 'method', name: '研究方法 · Method', mount: 'gxn-m-method',
    Comp: SlideMethod, defaults: slideMethodDefaults, controls: slideMethodControls },
  { key: 'agenda', name: '报告目录 · Agenda', mount: 'gxn-m-agenda',
    Comp: SlideAgenda, defaults: slideAgendaDefaults, controls: slideAgendaControls },
  { key: 'trend', name: '市场全景 · Trend', mount: 'gxn-m-trend',
    Comp: SlideTrend, defaults: slideTrendDefaults, controls: slideTrendControls },
  { key: 'heatmap', name: '月度热力 · Heatmap', mount: 'gxn-m-heatmap',
    Comp: SlideHeatmap, defaults: slideHeatmapDefaults, controls: slideHeatmapControls },
  { key: 'industry', name: '行业占比 · Share', mount: 'gxn-m-industry',
    Comp: SlideIndustry, defaults: slideIndustryDefaults, controls: slideIndustryControls },
  { key: 'ranking', name: '融资榜单 · Leaderboard', mount: 'gxn-m-ranking',
    Comp: SlideRanking, defaults: slideRankingDefaults, controls: slideRankingControls },
  { key: 'timeline', name: '时间轴 · Timeline', mount: 'gxn-m-timeline',
    Comp: SlideTimeline, defaults: slideTimelineDefaults, controls: slideTimelineControls },
  { key: 'showcase', name: '案例图景 · Showcase', mount: 'gxn-m-showcase',
    Comp: SlideShowcase, defaults: slideShowcaseDefaults, controls: slideShowcaseControls },
  { key: 'section', name: '章节页 · Section', mount: 'gxn-m-section',
    Comp: SlideSection, defaults: slideSectionDefaults, controls: slideSectionControls },
  { key: 'quadrant', name: '四象限 · Matrix', mount: 'gxn-m-quadrant',
    Comp: SlideQuadrant, defaults: slideQuadrantDefaults, controls: slideQuadrantControls },
  { key: 'radar', name: '能力雷达 · Radar', mount: 'gxn-m-radar',
    Comp: SlideRadar, defaults: slideRadarDefaults, controls: slideRadarControls },
  { key: 'matrix', name: '评级矩阵 · Rating', mount: 'gxn-m-matrix',
    Comp: SlideMatrixTable, defaults: slideMatrixTableDefaults, controls: slideMatrixTableControls },
  { key: 'chain', name: '产业链分层 · Chain', mount: 'gxn-m-chain',
    Comp: SlideChain, defaults: slideChainDefaults, controls: slideChainControls },
  { key: 'sankey', name: '资金流向 · Sankey', mount: 'gxn-m-sankey',
    Comp: SlideSankey, defaults: slideSankeyDefaults, controls: slideSankeyControls },
  { key: 'metrics', name: '关键数字 · Metrics', mount: 'gxn-m-metrics',
    Comp: SlideMetrics, defaults: slideMetricsDefaults, controls: slideMetricsControls },
  { key: 'bignumber', name: '巨型数字 · Big Number', mount: 'gxn-m-bignumber',
    Comp: SlideBigNumber, defaults: slideBigNumberDefaults, controls: slideBigNumberControls },
  { key: 'delta', name: '今昔对照 · Delta', mount: 'gxn-m-delta',
    Comp: SlideDelta, defaults: slideDeltaDefaults, controls: slideDeltaControls },
  { key: 'bento', name: '数据看板 · Bento', mount: 'gxn-m-bento',
    Comp: SlideBento, defaults: slideBentoDefaults, controls: slideBentoControls },
  { key: 'spotlight', name: '案例聚焦 · Spotlight', mount: 'gxn-m-spotlight',
    Comp: SlideSpotlight, defaults: slideSpotlightDefaults, controls: slideSpotlightControls },
  { key: 'feature', name: '沉浸大图 · Feature', mount: 'gxn-m-feature',
    Comp: SlideFeature, defaults: slideFeatureDefaults, controls: slideFeatureControls },
  { key: 'poster', name: '主题海报 · Poster', mount: 'gxn-m-poster',
    Comp: SlidePoster, defaults: slidePosterDefaults, controls: slidePosterControls },
  { key: 'cardgrid', name: '图文卡组 · Card Grid', mount: 'gxn-m-cardgrid',
    Comp: SlideCardGrid, defaults: slideCardGridDefaults, controls: slideCardGridControls },
  { key: 'zigzag', name: '交错图文 · Zigzag', mount: 'gxn-m-zigzag',
    Comp: SlideZigzag, defaults: slideZigzagDefaults, controls: slideZigzagControls },
  { key: 'gallery', name: '案例图集 · Gallery', mount: 'gxn-m-gallery',
    Comp: SlideGalleryBand, defaults: slideGalleryBandDefaults, controls: slideGalleryBandControls },
  { key: 'logowall', name: '公司图谱 · Logo Wall', mount: 'gxn-m-logowall',
    Comp: SlideLogoWall, defaults: slideLogoWallDefaults, controls: slideLogoWallControls },
  { key: 'compare', name: '双图对比 · Compare', mount: 'gxn-m-compare',
    Comp: SlideCompare, defaults: slideCompareDefaults, controls: slideCompareControls },
  { key: 'rounds', name: '轮次结构 · Rounds', mount: 'gxn-m-rounds',
    Comp: SlideRoundTable, defaults: slideRoundTableDefaults, controls: slideRoundTableControls },
  { key: 'pictogram', name: '笔数分布 · Pictogram', mount: 'gxn-m-pictogram',
    Comp: SlidePictogram, defaults: slidePictogramDefaults, controls: slidePictogramControls },
  { key: 'comparetable', name: '特性对照 · Compare Table', mount: 'gxn-m-comparetable',
    Comp: SlideCompareTable, defaults: slideCompareTableDefaults, controls: slideCompareTableControls },
  { key: 'region', name: '地区分布 · Region', mount: 'gxn-m-region',
    Comp: SlideRegion, defaults: slideRegionDefaults, controls: slideRegionControls },
  { key: 'marimekko', name: '市场结构 · Marimekko', mount: 'gxn-m-marimekko',
    Comp: SlideMarimekko, defaults: slideMarimekkoDefaults, controls: slideMarimekkoControls },
  { key: 'funnel', name: '资本漏斗 · Funnel', mount: 'gxn-m-funnel',
    Comp: SlideFunnel, defaults: slideFunnelDefaults, controls: slideFunnelControls },
  { key: 'scatter', name: '估值散点 · Scatter', mount: 'gxn-m-scatter',
    Comp: SlideScatter, defaults: slideScatterDefaults, controls: slideScatterControls },
  { key: 'waterfall', name: '资本桥 · Waterfall', mount: 'gxn-m-waterfall',
    Comp: SlideWaterfall, defaults: slideWaterfallDefaults, controls: slideWaterfallControls },
  { key: 'gauge', name: '达成率 · Gauge', mount: 'gxn-m-gauge',
    Comp: SlideGauge, defaults: slideGaugeDefaults, controls: slideGaugeControls },
  { key: 'progress', name: '达成度 · Progress', mount: 'gxn-m-progress',
    Comp: SlideProgress, defaults: slideProgressDefaults, controls: slideProgressControls },
  { key: 'portrait', name: '人物金句 · Portrait', mount: 'gxn-m-portrait',
    Comp: SlidePortraitQuote, defaults: slidePortraitQuoteDefaults, controls: slidePortraitQuoteControls },
  { key: 'voices', name: '声音墙 · Voices', mount: 'gxn-m-voices',
    Comp: SlideVoices, defaults: slideVoicesDefaults, controls: slideVoicesControls },
  { key: 'process', name: '判断框架 · Process', mount: 'gxn-m-process',
    Comp: SlideProcess, defaults: slideProcessDefaults, controls: slideProcessControls },
  { key: 'takeaway', name: '核心结论 · Takeaways', mount: 'gxn-m-takeaway',
    Comp: SlideTakeaway, defaults: slideTakeawayDefaults, controls: slideTakeawayControls },
  { key: 'risk', name: '风险研判 · Risk', mount: 'gxn-m-risk',
    Comp: SlideRisk, defaults: slideRiskDefaults, controls: slideRiskControls },
  { key: 'quote', name: '结语金句 · Quote', mount: 'gxn-m-quote',
    Comp: SlideQuote, defaults: slideQuoteDefaults, controls: slideQuoteControls },
  { key: 'stacked', name: '资本结构 · Stacked Bar', mount: 'gxn-m-stacked',
    Comp: SlideStackedBar, defaults: slideStackedBarDefaults, controls: slideStackedBarControls },
  { key: 'mosaic', name: '案例拼贴 · Mosaic', mount: 'gxn-m-mosaic',
    Comp: SlideMosaic, defaults: slideMosaicDefaults, controls: slideMosaicControls },
  { key: 'datatable', name: '明细表 · Data Table', mount: 'gxn-m-datatable',
    Comp: SlideDataTable, defaults: slideDataTableDefaults, controls: slideDataTableControls },
  { key: 'versus', name: '多空对照 · Versus', mount: 'gxn-m-versus',
    Comp: SlideVersus, defaults: slideVersusDefaults, controls: slideVersusControls },
  { key: 'profile', name: '公司档案 · Profile', mount: 'gxn-m-profile',
    Comp: SlideProfile, defaults: slideProfileDefaults, controls: slideProfileControls },
  { key: 'storyboard', name: '进程图带 · Storyboard', mount: 'gxn-m-storyboard',
    Comp: SlideStoryboard, defaults: slideStoryboardDefaults, controls: slideStoryboardControls },
  { key: 'dumbbell', name: '差距图 · Dumbbell', mount: 'gxn-m-dumbbell',
    Comp: SlideDumbbell, defaults: slideDumbbellDefaults, controls: slideDumbbellControls },
  { key: 'manifesto', name: '结论主张 · Manifesto', mount: 'gxn-m-manifesto',
    Comp: SlideManifesto, defaults: slideManifestoDefaults, controls: slideManifestoControls },
  { key: 'roadmap', name: '策略路线 · Roadmap', mount: 'gxn-m-roadmap',
    Comp: SlideRoadmap, defaults: slideRoadmapDefaults, controls: slideRoadmapControls },
  { key: 'bubbletl', name: '月度气泡 · Bubble TL', mount: 'gxn-m-bubbletl',
    Comp: SlideBubbleTimeline, defaults: slideBubbleTimelineDefaults, controls: slideBubbleTimelineControls },
  { key: 'pyramid', name: '优先金字塔 · Pyramid', mount: 'gxn-m-pyramid',
    Comp: SlidePyramid, defaults: slidePyramidDefaults, controls: slidePyramidControls },
  { key: 'editorial', name: '杂志大图 · Editorial', mount: 'gxn-m-editorial',
    Comp: SlideEditorial, defaults: slideEditorialDefaults, controls: slideEditorialControls },
  { key: 'pareto', name: '集中度 · Pareto', mount: 'gxn-m-pareto',
    Comp: SlidePareto, defaults: slideParetoDefaults, controls: slideParetoControls },
  { key: 'rose', name: '节律玫瑰 · Rose', mount: 'gxn-m-rose',
    Comp: SlideRose, defaults: slideRoseDefaults, controls: slideRoseControls },
  { key: 'treemap', name: '赛道版图 · Treemap', mount: 'gxn-m-treemap',
    Comp: SlideTreemap, defaults: slideTreemapDefaults, controls: slideTreemapControls },
  { key: 'cyclewheel', name: '资本飞轮 · Cycle', mount: 'gxn-m-cyclewheel',
    Comp: SlideCycleWheel, defaults: slideCycleWheelDefaults, controls: slideCycleWheelControls },
  { key: 'slope', name: '斜率图 · Slope', mount: 'gxn-m-slope',
    Comp: SlideSlope, defaults: slideSlopeDefaults, controls: slideSlopeControls },
  { key: 'orbit', name: '径向枢纽 · Orbit', mount: 'gxn-m-orbit',
    Comp: SlideOrbit, defaults: slideOrbitDefaults, controls: slideOrbitControls },
  { key: 'spheres', name: '三球串联 · Spheres', mount: 'gxn-m-spheres',
    Comp: SlideLinkedSpheres, defaults: slideLinkedSpheresDefaults, controls: slideLinkedSpheresControls },
  { key: 'mindmap', name: '机会图谱 · Mindmap', mount: 'gxn-m-mindmap',
    Comp: SlideMindmap, defaults: slideMindmapDefaults, controls: slideMindmapControls },
  { key: 'sunburst', name: '资本去向 · Sunburst', mount: 'gxn-m-sunburst',
    Comp: SlideSunburst, defaults: slideSunburstDefaults, controls: slideSunburstControls },
  { key: 'bump', name: '名次变迁 · Bump', mount: 'gxn-m-bump',
    Comp: SlideBump, defaults: slideBumpDefaults, controls: slideBumpControls },
  { key: 'masonry', name: '瀑布流图墙 · Masonry', mount: 'gxn-m-masonry',
    Comp: SlideMasonry, defaults: slideMasonryDefaults, controls: slideMasonryControls },
  { key: 'venn', name: '维恩交集 · Venn', mount: 'gxn-m-venn',
    Comp: SlideVenn, defaults: slideVennDefaults, controls: slideVennControls },
  { key: 'stream', name: '主题河流 · Stream', mount: 'gxn-m-stream',
    Comp: SlideStream, defaults: slideStreamDefaults, controls: slideStreamControls },
  { key: 'histogram', name: '规模分布 · Distribution', mount: 'gxn-m-histogram',
    Comp: SlideHistogram, defaults: slideHistogramDefaults, controls: slideHistogramControls },
  { key: 'closing', name: '封底结语 · Closing', mount: 'gxn-m-closing',
    Comp: SlideClosing, defaults: slideClosingDefaults, controls: slideClosingControls },
];
const rawPages = sourcePages.map((entry, index) => ({
  ...entry,
  Comp: withTheme02Deck(entry.Comp),
  controls: [...THEME02_DECK_CONTROLS, ...(entry.controls || [])],
  defaults: {
    ...(entry.defaults || {}),
    ...THEME02_DECK_DEFAULTS,
    index: index === 0 ? null : String(index).padStart(2, '0') + ' / ' + (sourcePages.length - 1),
  },
}));

export const runtimePages = normalizeRuntimePages(rawPages, { themeKey: 'theme02', layoutPrefix: 'THEME02' });

function theme02SchemeProps(deck) {
  const selected = GXN_SCHEMES[deck.scheme] || GXN_SCHEMES.green;
  return {
    ...(selected.chart || {}),
    palette: selected.palette,
    aurora: deck.aurora ? selected.aurora : null,
    auroraSpeed: deck.auroraSpeed,
  };
}

function scopedDeckCss(css, scopeClass) {
  return css.replaceAll('.gxn-theme', '.' + scopeClass + ' .gxn-theme');
}

function withTheme02Deck(Component) {
  return function Theme02Page(props = {}) {
    const {
      scheme = THEME02_DECK_DEFAULTS.scheme,
      emphasis = THEME02_DECK_DEFAULTS.emphasis,
      breath = THEME02_DECK_DEFAULTS.breath,
      magnet = THEME02_DECK_DEFAULTS.magnet,
      aurora = THEME02_DECK_DEFAULTS.aurora,
      auroraSpeed = THEME02_DECK_DEFAULTS.auroraSpeed,
      gxnScheme,
      ...componentProps
    } = props;
    const deck = {
      scheme: scheme === 'violet' ? 'violet' : 'green',
      emphasis: emphasis === 'ticket' ? 'ticket' : 'default',
      breath,
      magnet: magnet !== false,
      aurora: aurora !== false,
      auroraSpeed,
    };
    const scopeClass = 'theme02-deck-scope-' + deck.scheme;
    const rootRef = React.useRef(null);
    React.useEffect(() => {
      if (deck.magnet === false) return undefined;
      const root = rootRef.current;
      if (!root) return undefined;
      const reach = 210;
      const pull = 0.22;
      const maxShift = 30;
      const maxTilt = 6.5;
      const clamp = (value, max) => Math.max(-max, Math.min(max, value));
      let mx = 0;
      let my = 0;
      let hasPointer = false;
      let pending = false;
      const apply = () => {
        pending = false;
        root.querySelectorAll('.gxn-panel.is-focus').forEach(card => {
          const active = card.closest('[data-deck-active]');
          const slide = card.closest('.gxn-slide');
          const rect = card.getBoundingClientRect();
          let tx = 0;
          let ty = 0;
          let rx = 0;
          let ry = 0;
          if (hasPointer && active && slide && rect.width) {
            const scale = slide.getBoundingClientRect().width / slide.offsetWidth || 1;
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            const dx = mx - cx;
            const dy = my - cy;
            const dist = Math.hypot(dx, dy);
            const influence = Math.max(rect.width, rect.height) / 2 + reach;
            if (dist < influence) {
              const factor = 1 - dist / influence;
              tx = clamp((dx * pull * factor) / scale, maxShift);
              ty = clamp((dy * pull * factor) / scale, maxShift);
              ry = clamp((dx / (rect.width / 2)) * maxTilt * factor, maxTilt);
              rx = clamp((-dy / (rect.height / 2)) * maxTilt * factor, maxTilt);
            }
          }
          card.style.setProperty('--gxn-mx', tx.toFixed(2) + 'px');
          card.style.setProperty('--gxn-my', ty.toFixed(2) + 'px');
          card.style.setProperty('--gxn-rx', rx.toFixed(2) + 'deg');
          card.style.setProperty('--gxn-ry', ry.toFixed(2) + 'deg');
        });
      };
      const schedule = () => {
        if (!pending) {
          pending = true;
          requestAnimationFrame(apply);
        }
      };
      const onMove = event => {
        mx = event.clientX;
        my = event.clientY;
        hasPointer = true;
        schedule();
      };
      const onLeave = () => {
        hasPointer = false;
        schedule();
      };
      window.addEventListener('pointermove', onMove, { passive: true });
      window.addEventListener('blur', onLeave);
      document.addEventListener('mouseleave', onLeave);
      return () => {
        window.removeEventListener('pointermove', onMove);
        window.removeEventListener('blur', onLeave);
        document.removeEventListener('mouseleave', onLeave);
        root.querySelectorAll('.gxn-panel.is-focus').forEach(card => {
          ['--gxn-mx', '--gxn-my', '--gxn-rx', '--gxn-ry'].forEach(prop => card.style.removeProperty(prop));
        });
      };
    }, [deck.magnet]);
    const css = scopedDeckCss(deckOverrideCSS(deck), scopeClass);
    return React.createElement(
      React.Fragment,
      null,
      React.createElement('style', null, css),
      React.createElement(
        'div',
        { ref: rootRef, className: scopeClass, style: { position: 'absolute', inset: 0, width: '100%', height: '100%' } },
        React.createElement(Component, { ...componentProps, gxnScheme: gxnScheme || theme02SchemeProps(deck) }),
      ),
    );
  };
}
