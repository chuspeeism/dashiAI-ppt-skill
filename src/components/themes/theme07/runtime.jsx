import { normalizeRuntimePages } from '../runtime-helpers.jsx';
import * as M0 from './source/src/pages/CoverPage.jsx';
import * as M1 from './source/src/pages/SummaryPage.jsx';
import * as M2 from './source/src/pages/ContentsPage.jsx';
import * as M3 from './source/src/pages/MethodPage.jsx';
import * as M4 from './source/src/pages/TrendPage.jsx';
import * as M5 from './source/src/pages/CrossPage.jsx';
import * as M6 from './source/src/pages/ChainPage.jsx';
import * as M7 from './source/src/pages/CasePage.jsx';
import * as M8 from './source/src/pages/MonthlyPage.jsx';
import * as M9 from './source/src/pages/RankingPage.jsx';
import * as M10 from './source/src/pages/MatrixPage.jsx';
import * as M11 from './source/src/pages/RiskPage.jsx';
import * as M12 from './source/src/pages/OutlookPage.jsx';
import * as M13 from './source/src/pages/QuotePage.jsx';
import * as M14 from './source/src/pages/ChapterPage.jsx';
import * as M15 from './source/src/pages/DealMapPage.jsx';
import * as M16 from './source/src/pages/ColdStartPage.jsx';
import * as M17 from './source/src/pages/AcceleratePage.jsx';
import * as M18 from './source/src/pages/PeakPage.jsx';
import * as M19 from './source/src/pages/CooldownPage.jsx';
import * as M20 from './source/src/pages/PeakTroughPage.jsx';
import * as M21 from './source/src/pages/WaterfallPage.jsx';
import * as M22 from './source/src/pages/DealSizePage.jsx';
import * as M23 from './source/src/pages/AvgTicketPage.jsx';
import * as M24 from './source/src/pages/InvestorPage.jsx';
import * as M25 from './source/src/pages/ActiveCapitalPage.jsx';
import * as M26 from './source/src/pages/ConcentrationPage.jsx';
import * as M27 from './source/src/pages/SyndicatePage.jsx';
import * as M28 from './source/src/pages/KnowledgePage.jsx';
import * as M29 from './source/src/pages/LegalPage.jsx';
import * as M30 from './source/src/pages/HealthcarePage.jsx';
import * as M31 from './source/src/pages/FinancePage.jsx';
import * as M32 from './source/src/pages/ComputePage.jsx';
import * as M33 from './source/src/pages/ChipPage.jsx';
import * as M34 from './source/src/pages/RoboticsPage.jsx';
import * as M35 from './source/src/pages/AutonomyPage.jsx';
import * as M36 from './source/src/pages/SafetyPage.jsx';
import * as M37 from './source/src/pages/ContentGenPage.jsx';
import * as M38 from './source/src/pages/EducationPage.jsx';
import * as M39 from './source/src/pages/SupportPage.jsx';
import * as M40 from './source/src/pages/SalesPage.jsx';
import * as M41 from './source/src/pages/LowCodePage.jsx';
import * as M42 from './source/src/pages/OpenSourcePage.jsx';
import * as M43 from './source/src/pages/AlignmentPage.jsx';
import * as M44 from './source/src/pages/CapitalChapterPage.jsx';
import * as M45 from './source/src/pages/EarlyStagePage.jsx';
import * as M46 from './source/src/pages/DealStructurePage.jsx';
import * as M47 from './source/src/pages/InvestorMixPage.jsx';
import * as M48 from './source/src/pages/ResourcePage.jsx';
import * as M49 from './source/src/pages/AlliancePage.jsx';
import * as M50 from './source/src/pages/EcosystemPage.jsx';
import * as M51 from './source/src/pages/GeoCenterPage.jsx';
import * as M52 from './source/src/pages/RegionClusterPage.jsx';
import * as M53 from './source/src/pages/ResourceTriadPage.jsx';
import * as M54 from './source/src/pages/OpenAICasePage.jsx';
import * as M55 from './source/src/pages/FigureCasePage.jsx';
import * as M56 from './source/src/pages/SSICasePage.jsx';
import * as M57 from './source/src/pages/RiskChapterPage.jsx';
import * as M58 from './source/src/pages/RevenuePage.jsx';
import * as M59 from './source/src/pages/CompliancePage.jsx';
import * as M60 from './source/src/pages/MarginPage.jsx';
import * as M61 from './source/src/pages/MoatPage.jsx';
import * as M62 from './source/src/pages/StrategyInfraPage.jsx';
import * as M63 from './source/src/pages/StrategyVerticalPage.jsx';
import * as M64 from './source/src/pages/RepricingPage.jsx';
import * as M65 from './source/src/pages/ClosingPage.jsx';
import * as M66 from './source/src/pages/AppendixChapterPage.jsx';
import * as M67 from './source/src/pages/ForwardPage.jsx';
import * as M68 from './source/src/pages/SourcesPage.jsx';
import * as M69 from './source/src/pages/AboutLabPage.jsx';

const modules = [
  { id: 'cover-page', label: "01 封面 01 · 精益智造", module: M0 },
  { id: 'summary-page', label: "10 02", module: M1 },
  { id: 'contents-page', label: "11 03", module: M2 },
  { id: 'method-page', label: "12 04", module: M3 },
  { id: 'trend-page', label: "13 05", module: M4 },
  { id: 'cross-page', label: "14 06", module: M5 },
  { id: 'chain-page', label: "15 07", module: M6 },
  { id: 'case-page', label: "16 08", module: M7 },
  { id: 'monthly-page', label: "17 09", module: M8 },
  { id: 'ranking-page', label: "18 10", module: M9 },
  { id: 'matrix-page', label: "19 11", module: M10 },
  { id: 'risk-page', label: "20 12", module: M11 },
  { id: 'outlook-page', label: "21 13", module: M12 },
  { id: 'quote-page', label: "22 14", module: M13 },
  { id: 'chapter-page', label: "23 15", module: M14 },
  { id: 'deal-map-page', label: "24 16", module: M15 },
  { id: 'cold-start-page', label: "25 17", module: M16 },
  { id: 'accelerate-page', label: "26 18", module: M17 },
  { id: 'peak-page', label: "27 19", module: M18 },
  { id: 'cooldown-page', label: "28 20", module: M19 },
  { id: 'peak-trough-page', label: "29 21", module: M20 },
  { id: 'waterfall-page', label: "30 22", module: M21 },
  { id: 'deal-size-page', label: "31 23", module: M22 },
  { id: 'avg-ticket-page', label: "32 24", module: M23 },
  { id: 'investor-page', label: "33 25", module: M24 },
  { id: 'active-capital-page', label: "34 26", module: M25 },
  { id: 'concentration-page', label: "35 28", module: M26 },
  { id: 'syndicate-page', label: "36 27", module: M27 },
  { id: 'knowledge-page', label: "37 29", module: M28 },
  { id: 'legal-page', label: "38 30", module: M29 },
  { id: 'healthcare-page', label: "39 31", module: M30 },
  { id: 'finance-page', label: "40 32", module: M31 },
  { id: 'compute-page', label: "41 33", module: M32 },
  { id: 'chip-page', label: "42 34", module: M33 },
  { id: 'robotics-page', label: "43 35", module: M34 },
  { id: 'autonomy-page', label: "44 36", module: M35 },
  { id: 'safety-page', label: "45 37", module: M36 },
  { id: 'content-gen-page', label: "46 38", module: M37 },
  { id: 'education-page', label: "47 39", module: M38 },
  { id: 'support-page', label: "48 40", module: M39 },
  { id: 'sales-page', label: "49 41", module: M40 },
  { id: 'low-code-page', label: "50 42", module: M41 },
  { id: 'open-source-page', label: "51 43", module: M42 },
  { id: 'alignment-page', label: "52 44", module: M43 },
  { id: 'capital-chapter-page', label: "53 45", module: M44 },
  { id: 'early-stage-page', label: "54 46", module: M45 },
  { id: 'deal-structure-page', label: "55 47", module: M46 },
  { id: 'investor-mix-page', label: "56 48", module: M47 },
  { id: 'resource-page', label: "57 49", module: M48 },
  { id: 'alliance-page', label: "58 50", module: M49 },
  { id: 'ecosystem-page', label: "59 51", module: M50 },
  { id: 'geo-center-page', label: "60 52", module: M51 },
  { id: 'region-cluster-page', label: "61 53", module: M52 },
  { id: 'resource-triad-page', label: "62 54", module: M53 },
  { id: 'open-aicase-page', label: "63 55", module: M54 },
  { id: 'figure-case-page', label: "64 59", module: M55 },
  { id: 'ssicase-page', label: "65 60", module: M56 },
  { id: 'risk-chapter-page', label: "66 61", module: M57 },
  { id: 'revenue-page', label: "67 62", module: M58 },
  { id: 'compliance-page', label: "68 63", module: M59 },
  { id: 'margin-page', label: "69 64", module: M60 },
  { id: 'moat-page', label: "70 65", module: M61 },
  { id: 'strategy-infra-page', label: "71 66", module: M62 },
  { id: 'strategy-vertical-page', label: "72 67", module: M63 },
  { id: 'repricing-page', label: "73 68", module: M64 },
  { id: 'closing-page', label: "74 69", module: M65 },
  { id: 'appendix-chapter-page', label: "75 70", module: M66 },
  { id: 'forward-page', label: "76 71", module: M67 },
  { id: 'sources-page', label: "77 72", module: M68 },
  { id: 'about-lab-page', label: "78 73", module: M69 }
];

const rawPages = modules.map(entry => ({
  id: entry.id,
  label: entry.label,
  Component: entry.module.default,
  controls: entry.module.controls || entry.module.default?.controls || [],
  defaultProps: entry.module.defaultProps || entry.module.defaults || entry.module.default?.defaultProps || entry.module.default?.defaults || {},
}));

export const runtimePages = normalizeRuntimePages(rawPages, { themeKey: 'theme07', layoutPrefix: 'THEME07' });
