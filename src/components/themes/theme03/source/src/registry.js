// registry.js — single source of truth for the deck.
// Each entry pairs a pure slide component with its controls schema and its
// complete default props. The controls schema keys map 1:1 onto component
// props, so a host (the demo Tweaks panel, or any real app) can drive every
// slide generically without knowing its internals.

import CoverSlide, { controls as coverControls, defaultProps as coverDefaults } from "./slides/CoverSlide.jsx";
import CoverBandSlide, { controls as coverBandControls, defaultProps as coverBandDefaults } from "./slides/CoverBandSlide.jsx";
import CoverPosterSlide, { controls as coverPosterControls, defaultProps as coverPosterDefaults } from "./slides/CoverPosterSlide.jsx";
import CoverGridSlide, { controls as coverGridControls, defaultProps as coverGridDefaults } from "./slides/CoverGridSlide.jsx";
import CoverImageSlide, { controls as coverImageControls, defaultProps as coverImageDefaults } from "./slides/CoverImageSlide.jsx";
import MethodSlide, { controls as methodControls, defaultProps as methodDefaults } from "./slides/MethodSlide.jsx";
import TrendSlide, { controls as trendControls, defaultProps as trendDefaults } from "./slides/TrendSlide.jsx";
import SectorSlide, { controls as sectorControls, defaultProps as sectorDefaults } from "./slides/SectorSlide.jsx";
import RankSlide, { controls as rankControls, defaultProps as rankDefaults } from "./slides/RankSlide.jsx";
import QuadrantSlide, { controls as quadrantControls, defaultProps as quadrantDefaults } from "./slides/QuadrantSlide.jsx";
import ChainSlide, { controls as chainControls, defaultProps as chainDefaults } from "./slides/ChainSlide.jsx";
import CaseSlide, { controls as caseControls, defaultProps as caseDefaults } from "./slides/CaseSlide.jsx";
import SectionSlide, { controls as sectionControls, defaultProps as sectionDefaults } from "./slides/SectionSlide.jsx";
import RoundSlide, { controls as roundControls, defaultProps as roundDefaults } from "./slides/RoundSlide.jsx";
import MonthlySlide, { controls as monthlyControls, defaultProps as monthlyDefaults } from "./slides/MonthlySlide.jsx";
import StatSlide, { controls as statControls, defaultProps as statDefaults } from "./slides/StatSlide.jsx";
import GeoSlide, { controls as geoControls, defaultProps as geoDefaults } from "./slides/GeoSlide.jsx";
import RiskSlide, { controls as riskControls, defaultProps as riskDefaults } from "./slides/RiskSlide.jsx";
import OutlookSlide, { controls as outlookControls, defaultProps as outlookDefaults } from "./slides/OutlookSlide.jsx";
import QuoteSlide, { controls as quoteControls, defaultProps as quoteDefaults } from "./slides/QuoteSlide.jsx";
import TableSlide, { controls as tableControls, defaultProps as tableDefaults } from "./slides/TableSlide.jsx";
import SpotlightSlide, { controls as spotlightControls, defaultProps as spotlightDefaults } from "./slides/SpotlightSlide.jsx";
import MosaicSlide, { controls as mosaicControls, defaultProps as mosaicDefaults } from "./slides/MosaicSlide.jsx";
import TimelineSlide, { controls as timelineControls, defaultProps as timelineDefaults } from "./slides/TimelineSlide.jsx";
import CoreweaveSlide, { controls as coreweaveControls, defaultProps as coreweaveDefaults } from "./slides/CoreweaveSlide.jsx";
import ValuationSlide, { controls as valuationControls, defaultProps as valuationDefaults } from "./slides/ValuationSlide.jsx";
import RiskChainSlide, { controls as riskChainControls, defaultProps as riskChainDefaults } from "./slides/RiskChainSlide.jsx";
import TakeawaySlide, { controls as takeawayControls, defaultProps as takeawayDefaults } from "./slides/TakeawaySlide.jsx";
import AgendaSlide, { controls as agendaControls, defaultProps as agendaDefaults } from "./slides/AgendaSlide.jsx";
import ValuationJumpSlide, { controls as valuationJumpControls, defaultProps as valuationJumpDefaults } from "./slides/ValuationJumpSlide.jsx";
import CaseCompareSlide, { controls as caseCompareControls, defaultProps as caseCompareDefaults } from "./slides/CaseCompareSlide.jsx";
import ColophonSlide, { controls as colophonControls, defaultProps as colophonDefaults } from "./slides/ColophonSlide.jsx";
import AarrrSlide, { controls as aarrrControls, defaultProps as aarrrDefaults } from "./slides/AarrrSlide.jsx";
import RfmSlide, { controls as rfmControls, defaultProps as rfmDefaults } from "./slides/RfmSlide.jsx";
import MabaSlide, { controls as mabaControls, defaultProps as mabaDefaults } from "./slides/MabaSlide.jsx";
import GanttSlide, { controls as ganttControls, defaultProps as ganttDefaults } from "./slides/GanttSlide.jsx";
import DoubleDiamondSlide, { controls as doubleDiamondControls, defaultProps as doubleDiamondDefaults } from "./slides/DoubleDiamondSlide.jsx";
import SwotSlide, { controls as swotControls, defaultProps as swotDefaults } from "./slides/SwotSlide.jsx";
import FiveForcesSlide, { controls as fiveForcesControls, defaultProps as fiveForcesDefaults } from "./slides/FiveForcesSlide.jsx";
import CanvasSlide, { controls as canvasControls, defaultProps as canvasDefaults } from "./slides/CanvasSlide.jsx";
import JourneySlide, { controls as journeyControls, defaultProps as journeyDefaults } from "./slides/JourneySlide.jsx";
import PyramidSlide, { controls as pyramidControls, defaultProps as pyramidDefaults } from "./slides/PyramidSlide.jsx";
import BcgSlide, { controls as bcgControls, defaultProps as bcgDefaults } from "./slides/BcgSlide.jsx";
import FlywheelSlide, { controls as flywheelControls, defaultProps as flywheelDefaults } from "./slides/FlywheelSlide.jsx";
import PestSlide, { controls as pestControls, defaultProps as pestDefaults } from "./slides/PestSlide.jsx";
import ParetoSlide, { controls as paretoControls, defaultProps as paretoDefaults } from "./slides/ParetoSlide.jsx";
import RadarSlide, { controls as radarControls, defaultProps as radarDefaults } from "./slides/RadarSlide.jsx";
import ShiftSlide, { controls as shiftControls, defaultProps as shiftDefaults } from "./slides/ShiftSlide.jsx";
import BetMatrixSlide, { controls as betMatrixControls, defaultProps as betMatrixDefaults } from "./slides/BetMatrixSlide.jsx";
import TreemapSlide, { controls as treemapControls, defaultProps as treemapDefaults } from "./slides/TreemapSlide.jsx";
import WaterfallSlide, { controls as waterfallControls, defaultProps as waterfallDefaults } from "./slides/WaterfallSlide.jsx";
import ShareSlide, { controls as shareControls, defaultProps as shareDefaults } from "./slides/ShareSlide.jsx";
import EscalationSlide, { controls as escalationControls, defaultProps as escalationDefaults } from "./slides/EscalationSlide.jsx";
import SankeySlide, { controls as sankeyControls, defaultProps as sankeyDefaults } from "./slides/SankeySlide.jsx";
import GallerySlide, { controls as galleryControls, defaultProps as galleryDefaults } from "./slides/GallerySlide.jsx";
import ScorecardSlide, { controls as scorecardControls, defaultProps as scorecardDefaults } from "./slides/ScorecardSlide.jsx";
import GaugeSlide, { controls as gaugeControls, defaultProps as gaugeDefaults } from "./slides/GaugeSlide.jsx";
import EmbodiedSlide, { controls as embodiedControls, defaultProps as embodiedDefaults } from "./slides/EmbodiedSlide.jsx";
import RoseSlide, { controls as roseControls, defaultProps as roseDefaults } from "./slides/RoseSlide.jsx";
import MarimekkoSlide, { controls as marimekkoControls, defaultProps as marimekkoDefaults } from "./slides/MarimekkoSlide.jsx";
import ConcentrationSlide, { controls as concentrationControls, defaultProps as concentrationDefaults } from "./slides/ConcentrationSlide.jsx";
import TornadoSlide, { controls as tornadoControls, defaultProps as tornadoDefaults } from "./slides/TornadoSlide.jsx";
import MoatSlide, { controls as moatControls, defaultProps as moatDefaults } from "./slides/MoatSlide.jsx";
import SupplyChainSlide, { controls as supplyControls, defaultProps as supplyDefaults } from "./slides/SupplyChainSlide.jsx";
import ChipsSlide, { controls as chipsControls, defaultProps as chipsDefaults } from "./slides/ChipsSlide.jsx";
import BubbleSlide, { controls as bubbleControls, defaultProps as bubbleDefaults } from "./slides/BubbleSlide.jsx";
import ChronicleSlide, { controls as chronicleControls, defaultProps as chronicleDefaults } from "./slides/ChronicleSlide.jsx";
import ComputeSlide, { controls as computeControls, defaultProps as computeDefaults } from "./slides/ComputeSlide.jsx";
import RegisterSlide, { controls as registerControls, defaultProps as registerDefaults } from "./slides/RegisterSlide.jsx";
import VerticalSlide, { controls as verticalControls, defaultProps as verticalDefaults } from "./slides/VerticalSlide.jsx";
import WaffleSlide, { controls as waffleControls, defaultProps as waffleDefaults } from "./slides/WaffleSlide.jsx";
import PeakSlide, { controls as peakControls, defaultProps as peakDefaults } from "./slides/PeakSlide.jsx";
import LayerTableSlide, { controls as layerTableControls, defaultProps as layerTableDefaults } from "./slides/LayerTableSlide.jsx";
import CumulativeSlide, { controls as cumulativeControls, defaultProps as cumulativeDefaults } from "./slides/CumulativeSlide.jsx";
import HypeCycleSlide, { controls as hypeCycleControls, defaultProps as hypeCycleDefaults } from "./slides/HypeCycleSlide.jsx";
import HorizonSlide, { controls as horizonControls, defaultProps as horizonDefaults } from "./slides/HorizonSlide.jsx";
import StatementSlide, { controls as statementControls, defaultProps as statementDefaults } from "./slides/StatementHeroSlide.jsx";

export const SLIDES = [
  { id: "cover",  label: "封面",     title: "调研报告封面",     Component: CoverSlide,  controls: coverControls,  defaultProps: coverDefaults },
  { id: "coverband",  label: "封面·横向", title: "横向编辑式封面", Component: CoverBandSlide,  controls: coverBandControls,  defaultProps: coverBandDefaults },
  { id: "coverposter", label: "封面·海报", title: "中央对称海报封面", Component: CoverPosterSlide, controls: coverPosterControls, defaultProps: coverPosterDefaults },
  { id: "covergrid",  label: "封面·网格", title: "深色模块网格封面", Component: CoverGridSlide,  controls: coverGridControls,  defaultProps: coverGridDefaults },
  { id: "coverimage", label: "封面·影像", title: "全幅影像封面",     Component: CoverImageSlide, controls: coverImageControls, defaultProps: coverImageDefaults },
  { id: "agenda", label: "导览",     title: "报告导览 / 目录",   Component: AgendaSlide, controls: agendaControls, defaultProps: agendaDefaults },
  { id: "method", label: "研究方法", title: "横纵分析法",       Component: MethodSlide, controls: methodControls, defaultProps: methodDefaults },
  { id: "trend",  label: "市场全景", title: "逐季度融资额走势", Component: TrendSlide,  controls: trendControls,  defaultProps: trendDefaults },
  { id: "chronicle", label: "年度编年", title: "2024 大额融资事件编年", Component: ChronicleSlide, controls: chronicleControls, defaultProps: chronicleDefaults },
  { id: "sector", label: "横向透视", title: "行业赛道融资额占比", Component: SectorSlide, controls: sectorControls, defaultProps: sectorDefaults },
  { id: "rank",   label: "头部玩家", title: "头部玩家融资排名",     Component: RankSlide,     controls: rankControls,     defaultProps: rankDefaults },
  { id: "table",  label: "速查表",   title: "头部玩家融资速查表",   Component: TableSlide,    controls: tableControls,    defaultProps: tableDefaults },
  { id: "bubble", label: "融资体量", title: "Top 10 公司融资气泡阵", Component: BubbleSlide, controls: bubbleControls, defaultProps: bubbleDefaults },
  { id: "quadrant", label: "选题四象限", title: "资本热度 × 商业兑现", Component: QuadrantSlide, controls: quadrantControls, defaultProps: quadrantDefaults },
  { id: "chain",  label: "产业链分层", title: "产业链分层透视",     Component: ChainSlide,    controls: chainControls,    defaultProps: chainDefaults },
  { id: "layertable", label: "产业链速查", title: "AI 产业链分层速查表", Component: LayerTableSlide, controls: layerTableControls, defaultProps: layerTableDefaults },
  { id: "vertical", label: "应用层",   title: "下游应用层 · 垂直应用", Component: VerticalSlide, controls: verticalControls, defaultProps: verticalDefaults },
  { id: "case",   label: "典型案例", title: "Anthropic 案例",      Component: CaseSlide,     controls: caseControls,     defaultProps: caseDefaults },
  { id: "spotlight", label: "案例聚焦", title: "xAI 案例聚焦",        Component: SpotlightSlide, controls: spotlightControls, defaultProps: spotlightDefaults },
  { id: "coreweave", label: "卖铲赢家", title: "CoreWeave 案例",       Component: CoreweaveSlide, controls: coreweaveControls, defaultProps: coreweaveDefaults },
  { id: "casecompare", label: "案例对比", title: "三大案例对比速览", Component: CaseCompareSlide, controls: caseCompareControls, defaultProps: caseCompareDefaults },
  { id: "section", label: "章节页",  title: "结构透视与展望",      Component: SectionSlide,  controls: sectionControls,  defaultProps: sectionDefaults },
  { id: "round",  label: "轮次结构", title: "融资轮次结构对比",     Component: RoundSlide,    controls: roundControls,    defaultProps: roundDefaults },
  { id: "waffle", label: "轮次单位图", title: "97 笔大额融资 · 轮次构成", Component: WaffleSlide, controls: waffleControls, defaultProps: waffleDefaults },
  { id: "monthly", label: "月度明细", title: "逐月融资额明细",      Component: MonthlySlide,  controls: monthlyControls,  defaultProps: monthlyDefaults },
  { id: "peak",   label: "单月峰值", title: "全年单月峰值 · 双峰节奏", Component: PeakSlide, controls: peakControls, defaultProps: peakDefaults },
  { id: "cumulative", label: "资金累积", title: "全年资金累积 · S 曲线", Component: CumulativeSlide, controls: cumulativeControls, defaultProps: cumulativeDefaults },
  { id: "stat",   label: "核心数据", title: "大数字 · 资本大年",     Component: StatSlide,     controls: statControls,     defaultProps: statDefaults },
  { id: "geo",    label: "地区分布", title: "融资的地理版图",     Component: GeoSlide,      controls: geoControls,      defaultProps: geoDefaults },
  { id: "mosaic", label: "地理图集", title: "资本地理图集",        Component: MosaicSlide,   controls: mosaicControls,   defaultProps: mosaicDefaults },
  { id: "valuationjump", label: "估值跃迁", title: "Anthropic 估值跃迁", Component: ValuationJumpSlide, controls: valuationJumpControls, defaultProps: valuationJumpDefaults },
  { id: "valuation", label: "估值之谜", title: "估值之谜 · 市销率",    Component: ValuationSlide, controls: valuationControls, defaultProps: valuationDefaults },
  { id: "risk",   label: "风险研判", title: "当前市场的主要风险", Component: RiskSlide,     controls: riskControls,     defaultProps: riskDefaults },
  { id: "riskchain", label: "风险传导", title: "风险传导链条",        Component: RiskChainSlide, controls: riskChainControls, defaultProps: riskChainDefaults },
  { id: "outlook", label: "投资建议", title: "投资建议与策略",   Component: OutlookSlide,  controls: outlookControls,  defaultProps: outlookDefaults },
  { id: "timeline", label: "策略时间轴", title: "阶段性投资策略路线图", Component: TimelineSlide, controls: timelineControls, defaultProps: timelineDefaults },
  { id: "horizon", label: "三视野", title: "三视野投资框架", Component: HorizonSlide, controls: horizonControls, defaultProps: horizonDefaults },
  { id: "takeaway", label: "核心结论", title: "三条核心结论",        Component: TakeawaySlide, controls: takeawayControls, defaultProps: takeawayDefaults },
  { id: "quote",  label: "金句页",   title: "结论 · 一句话总结",   Component: QuoteSlide,    controls: quoteControls,    defaultProps: quoteDefaults },
  { id: "aarrr", label: "AARRR",   title: "AARRR 增长漏斗模型",  Component: AarrrSlide,   controls: aarrrControls,   defaultProps: aarrrDefaults },
  { id: "rfm",   label: "RFM",     title: "RFM 标的分层模型",    Component: RfmSlide,     controls: rfmControls,     defaultProps: rfmDefaults },
  { id: "maba",  label: "MABA",    title: "MABA 赛道矩阵",       Component: MabaSlide,    controls: mabaControls,    defaultProps: mabaDefaults },
  { id: "gantt", label: "建仓甘特",   title: "分阶段建仓路线图",     Component: GanttSlide,   controls: ganttControls,   defaultProps: ganttDefaults },
  { id: "doublediamond", label: "决策双钻", title: "投资决策双钻",        Component: DoubleDiamondSlide, controls: doubleDiamondControls, defaultProps: doubleDiamondDefaults },
  { id: "swot",  label: "SWOT",    title: "SWOT 模型",            Component: SwotSlide,       controls: swotControls,       defaultProps: swotDefaults },
  { id: "fiveforces", label: "五力", title: "波特五力模型",       Component: FiveForcesSlide, controls: fiveForcesControls, defaultProps: fiveForcesDefaults },
  { id: "canvas", label: "画布",    title: "商业模式画布",         Component: CanvasSlide,     controls: canvasControls,     defaultProps: canvasDefaults },
  { id: "journey", label: "旅程图", title: "用户旅程地图",         Component: JourneySlide,    controls: journeyControls,    defaultProps: journeyDefaults },
  { id: "pyramid", label: "金字塔", title: "金字塔模型",           Component: PyramidSlide,    controls: pyramidControls,    defaultProps: pyramidDefaults },
  { id: "bcg",     label: "波士顿矩阵", title: "BCG 波士顿矩阵",     Component: BcgSlide,        controls: bcgControls,        defaultProps: bcgDefaults },
  { id: "flywheel", label: "飞轮", title: "飞轮模型",              Component: FlywheelSlide,   controls: flywheelControls,   defaultProps: flywheelDefaults },
  { id: "pest",    label: "PEST",    title: "PEST 宏观环境分析",    Component: PestSlide,       controls: pestControls,       defaultProps: pestDefaults },
  { id: "pareto",  label: "资本集中度", title: "资本集中度 · 帕累托",  Component: ParetoSlide,     controls: paretoControls,     defaultProps: paretoDefaults },
  { id: "radar",   label: "风险雷达", title: "风险信号雷达图",        Component: RadarSlide,      controls: radarControls,      defaultProps: radarDefaults },
  { id: "register", label: "风险登记册", title: "风险登记册",          Component: RegisterSlide,   controls: registerControls,   defaultProps: registerDefaults },
  { id: "shift",   label: "范式转变", title: "叙事驱动 → 兑现驱动",   Component: ShiftSlide,      controls: shiftControls,      defaultProps: shiftDefaults },
  { id: "hypecycle", label: "成熟度曲线", title: "技术成熟度曲线", Component: HypeCycleSlide, controls: hypeCycleControls, defaultProps: hypeCycleDefaults },
  { id: "betmatrix", label: "决策矩阵", title: "投资标的决策矩阵",     Component: BetMatrixSlide,  controls: betMatrixControls,  defaultProps: betMatrixDefaults },
  { id: "share",   label: "资本大年", title: "AI 占全美风投份额",     Component: ShareSlide,      controls: shareControls,      defaultProps: shareDefaults },
  { id: "waterfall", label: "季度节奏", title: "季度融资节奏 · 桥接", Component: WaterfallSlide,  controls: waterfallControls,  defaultProps: waterfallDefaults },
  { id: "treemap", label: "资金版图", title: "赛道资金版图 · 树图",  Component: TreemapSlide,    controls: treemapControls,    defaultProps: treemapDefaults },
  { id: "escalation", label: "单笔阶梯", title: "资金巨额化 · 单笔阶梯", Component: EscalationSlide, controls: escalationControls, defaultProps: escalationDefaults },
  { id: "gallery",  label: "实验室影像", title: "模型层头部实验室影像志", Component: GallerySlide,   controls: galleryControls,   defaultProps: galleryDefaults },
  { id: "sankey",   label: "资本流向",   title: "资本流向桑基图",       Component: SankeySlide,    controls: sankeyControls,    defaultProps: sankeyDefaults },
  { id: "scorecard", label: "投资记分卡", title: "头部标的投资记分卡",   Component: ScorecardSlide, controls: scorecardControls, defaultProps: scorecardDefaults },
  { id: "gauge",    label: "泡沫温度计", title: "估值泡沫温度计",       Component: GaugeSlide,     controls: gaugeControls,     defaultProps: gaugeDefaults },
  { id: "embodied", label: "具身智能", title: "下游前沿 · 具身智能",     Component: EmbodiedSlide,  controls: embodiedControls,  defaultProps: embodiedDefaults },
  { id: "rose",     label: "月度玫瑰", title: "逐月融资 · 玫瑰图",       Component: RoseSlide,      controls: roseControls,      defaultProps: roseDefaults },
  { id: "marimekko", label: "资金矩阵", title: "产业链资金结构矩阵",   Component: MarimekkoSlide, controls: marimekkoControls, defaultProps: marimekkoDefaults },
  { id: "concentration", label: "三重集中", title: "资本大年 · 三重集中", Component: ConcentrationSlide, controls: concentrationControls, defaultProps: concentrationDefaults },
  { id: "statement", label: "资本主张", title: "全幅影像主张页", Component: StatementSlide, controls: statementControls, defaultProps: statementDefaults },
  { id: "tornado",  label: "轮次背向", title: "轮次结构 · 笔数 ↔ 金额", Component: TornadoSlide,  controls: tornadoControls,  defaultProps: tornadoDefaults },
  { id: "moat",     label: "护城河",   title: "头部公司护城河剖析",   Component: MoatSlide,      controls: moatControls,      defaultProps: moatDefaults },
  { id: "supply",   label: "算力卡脖", title: "算力供应链的瓶颈",   Component: SupplyChainSlide, controls: supplyControls, defaultProps: supplyDefaults },
  { id: "chips",    label: "AI 芯片", title: "上游硬件 · AI 芯片",     Component: ChipsSlide,     controls: chipsControls,     defaultProps: chipsDefaults },
  { id: "compute",  label: "算力军备", title: "算力军备竞赛 · GPU 集群", Component: ComputeSlide, controls: computeControls, defaultProps: computeDefaults },
  { id: "colophon", label: "封底",     title: "数据来源 / 封底",   Component: ColophonSlide, controls: colophonControls, defaultProps: colophonDefaults },
];

export default SLIDES;
