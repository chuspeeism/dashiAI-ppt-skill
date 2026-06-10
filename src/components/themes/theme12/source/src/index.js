// index.js — barrel + registry for the 声浪 / SoundWave slide system.
// Import individual components directly, or use `swSlides` to drive a renderer.

import SwSlideManifesto, { controls as manifestoControls, defaultProps as manifestoDefaults, meta as manifestoMeta } from './SwSlideManifesto.jsx';
import SwSlideQuote, { controls as quoteControls, defaultProps as quoteDefaults, meta as quoteMeta } from './SwSlideQuote.jsx';
import SwSlideAgenda, { controls as agendaControls, defaultProps as agendaDefaults, meta as agendaMeta } from './SwSlideAgenda.jsx';
import SwSlideStatement, { controls as statementControls, defaultProps as statementDefaults, meta as statementMeta } from './SwSlideStatement.jsx';
import SwSlideStack, { controls as stackControls, defaultProps as stackDefaults, meta as stackMeta } from './SwSlideStack.jsx';
import SwSlideBento, { controls as bentoControls, defaultProps as bentoDefaults, meta as bentoMeta } from './SwSlideBento.jsx';
import SwSlideProcess, { controls as processControls, defaultProps as processDefaults, meta as processMeta } from './SwSlideProcess.jsx';
import SwSlideSplit, { controls as splitControls, defaultProps as splitDefaults, meta as splitMeta } from './SwSlideSplit.jsx';
import SwSlideTriptych, { controls as triptychControls, defaultProps as triptychDefaults, meta as triptychMeta } from './SwSlideTriptych.jsx';
import SwSlideMagazine, { controls as magazineControls, defaultProps as magazineDefaults, meta as magazineMeta } from './SwSlideMagazine.jsx';
import SwSlideShowcase, { controls as showcaseControls, defaultProps as showcaseDefaults, meta as showcaseMeta } from './SwSlideShowcase.jsx';
import SwSlideHero, { controls as heroControls, defaultProps as heroDefaults, meta as heroMeta } from './SwSlideHero.jsx';
import SwSlideFullBleed, { controls as fullBleedControls, defaultProps as fullBleedDefaults, meta as fullBleedMeta } from './SwSlideFullBleed.jsx';
import SwSlidePolaroid, { controls as polaroidControls, defaultProps as polaroidDefaults, meta as polaroidMeta } from './SwSlidePolaroid.jsx';
import SwSlideFilmstrip, { controls as filmstripControls, defaultProps as filmstripDefaults, meta as filmstripMeta } from './SwSlideFilmstrip.jsx';
import SwSlideTable, { controls as tableControls, defaultProps as tableDefaults, meta as tableMeta } from './SwSlideTable.jsx';
import SwSlideChecklist, { controls as checklistControls, defaultProps as checklistDefaults, meta as checklistMeta } from './SwSlideChecklist.jsx';
import SwSlideContrast, { controls as contrastControls, defaultProps as contrastDefaults, meta as contrastMeta } from './SwSlideContrast.jsx';
import SwSlideFaq, { controls as faqControls, defaultProps as faqDefaults, meta as faqMeta } from './SwSlideFaq.jsx';
import SwSlidePricing, { controls as pricingControls, defaultProps as pricingDefaults, meta as pricingMeta } from './SwSlidePricing.jsx';
import SwSlideWhyNow, { controls as whyNowControls, defaultProps as whyNowDefaults, meta as whyNowMeta } from './SwSlideWhyNow.jsx';
import SwSlideDonut, { controls as donutControls, defaultProps as donutDefaults, meta as donutMeta } from './SwSlideDonut.jsx';
import SwSlideGrowth, { controls as growthControls, defaultProps as growthDefaults, meta as growthMeta } from './SwSlideGrowth.jsx';
import SwSlideFunnel, { controls as funnelControls, defaultProps as funnelDefaults, meta as funnelMeta } from './SwSlideFunnel.jsx';
import SwSlideStackBars, { controls as stackBarsControls, defaultProps as stackBarsDefaults, meta as stackBarsMeta } from './SwSlideStackBars.jsx';
import SwSlideRanking, { controls as rankingControls, defaultProps as rankingDefaults, meta as rankingMeta } from './SwSlideRanking.jsx';
import SwSlideGauges, { controls as gaugesControls, defaultProps as gaugesDefaults, meta as gaugesMeta } from './SwSlideGauges.jsx';
import SwSlideMatrix, { controls as matrixControls, defaultProps as matrixDefaults, meta as matrixMeta } from './SwSlideMatrix.jsx';
import SwSlideBigNumber, { controls as bigNumberControls, defaultProps as bigNumberDefaults, meta as bigNumberMeta } from './SwSlideBigNumber.jsx';
import SwSlideScoreboard, { controls as scoreboardControls, defaultProps as scoreboardDefaults, meta as scoreboardMeta } from './SwSlideScoreboard.jsx';
import SwSlideMosaic, { controls as mosaicControls, defaultProps as mosaicDefaults, meta as mosaicMeta } from './SwSlideMosaic.jsx';
import SwSlideGridWall, { controls as gridWallControls, defaultProps as gridWallDefaults, meta as gridWallMeta } from './SwSlideGridWall.jsx';
import SwSlideLogoWall, { controls as logoWallControls, defaultProps as logoWallDefaults, meta as logoWallMeta } from './SwSlideLogoWall.jsx';
import SwSlideDuo, { controls as duoControls, defaultProps as duoDefaults, meta as duoMeta } from './SwSlideDuo.jsx';
import SwSlideSpotlight, { controls as spotlightControls, defaultProps as spotlightDefaults, meta as spotlightMeta } from './SwSlideSpotlight.jsx';
import SwSlideQuoteImage, { controls as quoteImageControls, defaultProps as quoteImageDefaults, meta as quoteImageMeta } from './SwSlideQuoteImage.jsx';
import SwSlideSection, { controls as sectionControls, defaultProps as sectionDefaults, meta as sectionMeta } from './SwSlideSection.jsx';
import SwSlideTimeline, { controls as timelineControls, defaultProps as timelineDefaults, meta as timelineMeta } from './SwSlideTimeline.jsx';
import SwSlidePrinciples, { controls as principlesControls, defaultProps as principlesDefaults, meta as principlesMeta } from './SwSlidePrinciples.jsx';
import SwSlideTeam, { controls as teamControls, defaultProps as teamDefaults, meta as teamMeta } from './SwSlideTeam.jsx';
import SwSlideTestimonial, { controls as testimonialControls, defaultProps as testimonialDefaults, meta as testimonialMeta } from './SwSlideTestimonial.jsx';
import SwSlideJoin, { controls as joinControls, defaultProps as joinDefaults, meta as joinMeta } from './SwSlideJoin.jsx';
import SwSlideEditorial, { controls as editorialControls, defaultProps as editorialDefaults, meta as editorialMeta } from './SwSlideEditorial.jsx';
import SwSlidePanorama, { controls as panoramaControls, defaultProps as panoramaDefaults, meta as panoramaMeta } from './SwSlidePanorama.jsx';
import SwSlideSpecs, { controls as specsControls, defaultProps as specsDefaults, meta as specsMeta } from './SwSlideSpecs.jsx';
import SwSlideInterlude, { controls as interludeControls, defaultProps as interludeDefaults, meta as interludeMeta } from './SwSlideInterlude.jsx';
import SwSlideWaterfall, { controls as waterfallControls, defaultProps as waterfallDefaults, meta as waterfallMeta } from './SwSlideWaterfall.jsx';
import SwSlideRadar, { controls as radarControls, defaultProps as radarDefaults, meta as radarMeta } from './SwSlideRadar.jsx';
import SwSlideSpectrum, { controls as spectrumControls, defaultProps as spectrumDefaults, meta as spectrumMeta } from './SwSlideSpectrum.jsx';
import SwSlideJourney, { controls as journeyControls, defaultProps as journeyDefaults, meta as journeyMeta } from './SwSlideJourney.jsx';
import SwSlideEcosystem, { controls as ecosystemControls, defaultProps as ecosystemDefaults, meta as ecosystemMeta } from './SwSlideEcosystem.jsx';
import SwSlideLayers, { controls as layersControls, defaultProps as layersDefaults, meta as layersMeta } from './SwSlideLayers.jsx';
import SwSlidePostcard, { controls as postcardControls, defaultProps as postcardDefaults, meta as postcardMeta } from './SwSlidePostcard.jsx';
import SwSlideBeforeAfter, { controls as beforeAfterControls, defaultProps as beforeAfterDefaults, meta as beforeAfterMeta } from './SwSlideBeforeAfter.jsx';
import SwSlideCalendar, { controls as calendarControls, defaultProps as calendarDefaults, meta as calendarMeta } from './SwSlideCalendar.jsx';
import SwSlideDotPlot, { controls as dotPlotControls, defaultProps as dotPlotDefaults, meta as dotPlotMeta } from './SwSlideDotPlot.jsx';
import SwSlidePyramid, { controls as pyramidControls, defaultProps as pyramidDefaults, meta as pyramidMeta } from './SwSlidePyramid.jsx';
import SwSlideAlbum, { controls as albumControls, defaultProps as albumDefaults, meta as albumMeta } from './SwSlideAlbum.jsx';
import SwSlideTicket, { controls as ticketControls, defaultProps as ticketDefaults, meta as ticketMeta } from './SwSlideTicket.jsx';
import SwSlideCoverflow, { controls as coverflowControls, defaultProps as coverflowDefaults, meta as coverflowMeta } from './SwSlideCoverflow.jsx';
import SwSlideVinyl, { controls as vinylControls, defaultProps as vinylDefaults, meta as vinylMeta } from './SwSlideVinyl.jsx';
import SwSlideSlope, { controls as slopeControls, defaultProps as slopeDefaults, meta as slopeMeta } from './SwSlideSlope.jsx';
import SwSlideBubble, { controls as bubbleControls, defaultProps as bubbleDefaults, meta as bubbleMeta } from './SwSlideBubble.jsx';
import SwSlideTreemap, { controls as treemapControls, defaultProps as treemapDefaults, meta as treemapMeta } from './SwSlideTreemap.jsx';
import SwSlideRoadmap, { controls as roadmapControls, defaultProps as roadmapDefaults, meta as roadmapMeta } from './SwSlideRoadmap.jsx';
import SwSlideQuoteWall, { controls as quoteWallControls, defaultProps as quoteWallDefaults, meta as quoteWallMeta } from './SwSlideQuoteWall.jsx';
import SwSlideZine, { controls as zineControls, defaultProps as zineDefaults, meta as zineMeta } from './SwSlideZine.jsx';
import SwSlideCover, { controls as coverControls, defaultProps as coverDefaults, meta as coverMeta } from './SwSlideCover.jsx';
import SwSlideGalleryWall, { controls as galleryWallControls, defaultProps as galleryWallDefaults, meta as galleryWallMeta } from './SwSlideGalleryWall.jsx';
import SwSlideSankey, { controls as sankeyControls, defaultProps as sankeyDefaults, meta as sankeyMeta } from './SwSlideSankey.jsx';
import SwSlideHeatmap, { controls as heatmapControls, defaultProps as heatmapDefaults, meta as heatmapMeta } from './SwSlideHeatmap.jsx';
import SwSlideDirectory, { controls as directoryControls, defaultProps as directoryDefaults, meta as directoryMeta } from './SwSlideDirectory.jsx';
import SwSlideLyric, { controls as lyricControls, defaultProps as lyricDefaults, meta as lyricMeta } from './SwSlideLyric.jsx';
import SwSlideOrgChart, { controls as orgChartControls, defaultProps as orgChartDefaults, meta as orgChartMeta } from './SwSlideOrgChart.jsx';
import SwSlideMoodboard, { controls as moodboardControls, defaultProps as moodboardDefaults, meta as moodboardMeta } from './SwSlideMoodboard.jsx';
import SwSlideBillboard, { controls as billboardControls, defaultProps as billboardDefaults, meta as billboardMeta } from './SwSlideBillboard.jsx';
import SwSlideStampSheet, { controls as stampSheetControls, defaultProps as stampSheetDefaults, meta as stampSheetMeta } from './SwSlideStampSheet.jsx';
import SwSlideAreaStack, { controls as areaStackControls, defaultProps as areaStackDefaults, meta as areaStackMeta } from './SwSlideAreaStack.jsx';
import SwSlideBullet, { controls as bulletControls, defaultProps as bulletDefaults, meta as bulletMeta } from './SwSlideBullet.jsx';
import SwSlideScorecard, { controls as scorecardControls, defaultProps as scorecardDefaults, meta as scorecardMeta } from './SwSlideScorecard.jsx';
import SwSlideDivider, { controls as dividerControls, defaultProps as dividerDefaults, meta as dividerMeta } from './SwSlideDivider.jsx';
import SwSlideStat3, { controls as stat3Controls, defaultProps as stat3Defaults, meta as stat3Meta } from './SwSlideStat3.jsx';
import SwSlideCoverType, { controls as coverTypeControls, defaultProps as coverTypeDefaults, meta as coverTypeMeta } from './SwSlideCoverType.jsx';
import SwSlideCoverWave, { controls as coverWaveControls, defaultProps as coverWaveDefaults, meta as coverWaveMeta } from './SwSlideCoverWave.jsx';
import SwSlideCoverImage, { controls as coverImageControls, defaultProps as coverImageDefaults, meta as coverImageMeta } from './SwSlideCoverImage.jsx';
import SwSlideCoverGrid, { controls as coverGridControls, defaultProps as coverGridDefaults, meta as coverGridMeta } from './SwSlideCoverGrid.jsx';

export {
  SwSlideManifesto, SwSlideQuote, SwSlideAgenda, SwSlideStatement, SwSlideStack, SwSlideBento,
  SwSlideProcess, SwSlideSplit, SwSlideTriptych, SwSlideMagazine, SwSlideShowcase, SwSlideHero,
  SwSlideFullBleed, SwSlidePolaroid, SwSlideFilmstrip, SwSlideTable, SwSlideChecklist, SwSlideContrast,
  SwSlideFaq, SwSlidePricing, SwSlideWhyNow, SwSlideDonut, SwSlideGrowth, SwSlideFunnel,
  SwSlideStackBars, SwSlideRanking, SwSlideGauges, SwSlideMatrix, SwSlideBigNumber, SwSlideScoreboard,
  SwSlideMosaic, SwSlideGridWall, SwSlideLogoWall, SwSlideDuo, SwSlideSpotlight, SwSlideQuoteImage,
  SwSlideSection, SwSlideTimeline, SwSlidePrinciples, SwSlideTeam, SwSlideTestimonial, SwSlideJoin,
  SwSlideEditorial, SwSlidePanorama, SwSlideSpecs, SwSlideInterlude, SwSlideWaterfall, SwSlideRadar,
  SwSlideSpectrum, SwSlideJourney,
  SwSlideEcosystem, SwSlideLayers, SwSlidePostcard, SwSlideBeforeAfter, SwSlideCalendar,
  SwSlideDotPlot, SwSlidePyramid, SwSlideAlbum,
  SwSlideTicket, SwSlideCoverflow, SwSlideVinyl, SwSlideSlope, SwSlideBubble,
  SwSlideTreemap, SwSlideRoadmap, SwSlideQuoteWall,
  SwSlideZine, SwSlideCover, SwSlideGalleryWall, SwSlideSankey, SwSlideHeatmap,
  SwSlideDirectory, SwSlideLyric, SwSlideOrgChart,
  SwSlideMoodboard, SwSlideBillboard, SwSlideStampSheet, SwSlideAreaStack, SwSlideBullet,
  SwSlideScorecard, SwSlideDivider, SwSlideStat3,
  SwSlideCoverType, SwSlideCoverWave, SwSlideCoverImage, SwSlideCoverGrid,
};
export { default as SwImageSlot } from './SwImageSlot.jsx';
export { swTheme, swAccents, swCardPalette, swStatColors, swSeriesColors } from './swTheme.js';

// Ordered registry: each entry pairs a component with its controls schema,
// default props and meta. A host can map over this to render the deck and a
// controls UI without hard-coding component identities. Order = deck order,
// woven by content rhythm (image-led pages weighted highest).
export const swSlides = [
  { Component: SwSlideCoverType, controls: coverTypeControls, defaultProps: coverTypeDefaults, meta: coverTypeMeta },
  { Component: SwSlideCoverWave, controls: coverWaveControls, defaultProps: coverWaveDefaults, meta: coverWaveMeta },
  { Component: SwSlideCoverImage, controls: coverImageControls, defaultProps: coverImageDefaults, meta: coverImageMeta },
  { Component: SwSlideCoverGrid, controls: coverGridControls, defaultProps: coverGridDefaults, meta: coverGridMeta },
  { Component: SwSlideManifesto, controls: manifestoControls, defaultProps: manifestoDefaults, meta: manifestoMeta },
  { Component: SwSlideQuote, controls: quoteControls, defaultProps: quoteDefaults, meta: quoteMeta },
  { Component: SwSlideAgenda, controls: agendaControls, defaultProps: agendaDefaults, meta: agendaMeta },
  { Component: SwSlideStatement, controls: statementControls, defaultProps: statementDefaults, meta: statementMeta },
  { Component: SwSlideStack, controls: stackControls, defaultProps: stackDefaults, meta: stackMeta },
  { Component: SwSlideBento, controls: bentoControls, defaultProps: bentoDefaults, meta: bentoMeta },
  { Component: SwSlideProcess, controls: processControls, defaultProps: processDefaults, meta: processMeta },
  { Component: SwSlideEcosystem, controls: ecosystemControls, defaultProps: ecosystemDefaults, meta: ecosystemMeta },
  { Component: SwSlideOrgChart, controls: orgChartControls, defaultProps: orgChartDefaults, meta: orgChartMeta },
  { Component: SwSlideSplit, controls: splitControls, defaultProps: splitDefaults, meta: splitMeta },
  { Component: SwSlideTriptych, controls: triptychControls, defaultProps: triptychDefaults, meta: triptychMeta },
  { Component: SwSlideLayers, controls: layersControls, defaultProps: layersDefaults, meta: layersMeta },
  { Component: SwSlideMagazine, controls: magazineControls, defaultProps: magazineDefaults, meta: magazineMeta },
  { Component: SwSlideEditorial, controls: editorialControls, defaultProps: editorialDefaults, meta: editorialMeta },
  { Component: SwSlideShowcase, controls: showcaseControls, defaultProps: showcaseDefaults, meta: showcaseMeta },
  { Component: SwSlideHero, controls: heroControls, defaultProps: heroDefaults, meta: heroMeta },
  { Component: SwSlideCover, controls: coverControls, defaultProps: coverDefaults, meta: coverMeta },
  { Component: SwSlideFullBleed, controls: fullBleedControls, defaultProps: fullBleedDefaults, meta: fullBleedMeta },
  { Component: SwSlideBillboard, controls: billboardControls, defaultProps: billboardDefaults, meta: billboardMeta },
  { Component: SwSlidePanorama, controls: panoramaControls, defaultProps: panoramaDefaults, meta: panoramaMeta },
  { Component: SwSlidePolaroid, controls: polaroidControls, defaultProps: polaroidDefaults, meta: polaroidMeta },
  { Component: SwSlidePostcard, controls: postcardControls, defaultProps: postcardDefaults, meta: postcardMeta },
  { Component: SwSlideTicket, controls: ticketControls, defaultProps: ticketDefaults, meta: ticketMeta },
  { Component: SwSlideFilmstrip, controls: filmstripControls, defaultProps: filmstripDefaults, meta: filmstripMeta },
  { Component: SwSlideStampSheet, controls: stampSheetControls, defaultProps: stampSheetDefaults, meta: stampSheetMeta },
  { Component: SwSlideCoverflow, controls: coverflowControls, defaultProps: coverflowDefaults, meta: coverflowMeta },
  { Component: SwSlideBeforeAfter, controls: beforeAfterControls, defaultProps: beforeAfterDefaults, meta: beforeAfterMeta },
  { Component: SwSlideTable, controls: tableControls, defaultProps: tableDefaults, meta: tableMeta },
  { Component: SwSlideSpecs, controls: specsControls, defaultProps: specsDefaults, meta: specsMeta },
  { Component: SwSlideDirectory, controls: directoryControls, defaultProps: directoryDefaults, meta: directoryMeta },
  { Component: SwSlideCalendar, controls: calendarControls, defaultProps: calendarDefaults, meta: calendarMeta },
  { Component: SwSlideRoadmap, controls: roadmapControls, defaultProps: roadmapDefaults, meta: roadmapMeta },
  { Component: SwSlideHeatmap, controls: heatmapControls, defaultProps: heatmapDefaults, meta: heatmapMeta },
  { Component: SwSlideChecklist, controls: checklistControls, defaultProps: checklistDefaults, meta: checklistMeta },
  { Component: SwSlideContrast, controls: contrastControls, defaultProps: contrastDefaults, meta: contrastMeta },
  { Component: SwSlideFaq, controls: faqControls, defaultProps: faqDefaults, meta: faqMeta },
  { Component: SwSlidePricing, controls: pricingControls, defaultProps: pricingDefaults, meta: pricingMeta },
  { Component: SwSlideInterlude, controls: interludeControls, defaultProps: interludeDefaults, meta: interludeMeta },
  { Component: SwSlideWhyNow, controls: whyNowControls, defaultProps: whyNowDefaults, meta: whyNowMeta },
  { Component: SwSlideDonut, controls: donutControls, defaultProps: donutDefaults, meta: donutMeta },
  { Component: SwSlideTreemap, controls: treemapControls, defaultProps: treemapDefaults, meta: treemapMeta },
  { Component: SwSlideSankey, controls: sankeyControls, defaultProps: sankeyDefaults, meta: sankeyMeta },
  { Component: SwSlideWaterfall, controls: waterfallControls, defaultProps: waterfallDefaults, meta: waterfallMeta },
  { Component: SwSlideGrowth, controls: growthControls, defaultProps: growthDefaults, meta: growthMeta },
  { Component: SwSlideAreaStack, controls: areaStackControls, defaultProps: areaStackDefaults, meta: areaStackMeta },
  { Component: SwSlideSlope, controls: slopeControls, defaultProps: slopeDefaults, meta: slopeMeta },
  { Component: SwSlideFunnel, controls: funnelControls, defaultProps: funnelDefaults, meta: funnelMeta },
  { Component: SwSlideDotPlot, controls: dotPlotControls, defaultProps: dotPlotDefaults, meta: dotPlotMeta },
  { Component: SwSlideBubble, controls: bubbleControls, defaultProps: bubbleDefaults, meta: bubbleMeta },
  { Component: SwSlideStackBars, controls: stackBarsControls, defaultProps: stackBarsDefaults, meta: stackBarsMeta },
  { Component: SwSlideRanking, controls: rankingControls, defaultProps: rankingDefaults, meta: rankingMeta },
  { Component: SwSlideGauges, controls: gaugesControls, defaultProps: gaugesDefaults, meta: gaugesMeta },
  { Component: SwSlideBullet, controls: bulletControls, defaultProps: bulletDefaults, meta: bulletMeta },
  { Component: SwSlidePyramid, controls: pyramidControls, defaultProps: pyramidDefaults, meta: pyramidMeta },
  { Component: SwSlideRadar, controls: radarControls, defaultProps: radarDefaults, meta: radarMeta },
  { Component: SwSlideMatrix, controls: matrixControls, defaultProps: matrixDefaults, meta: matrixMeta },
  { Component: SwSlideScorecard, controls: scorecardControls, defaultProps: scorecardDefaults, meta: scorecardMeta },
  { Component: SwSlideBigNumber, controls: bigNumberControls, defaultProps: bigNumberDefaults, meta: bigNumberMeta },
  { Component: SwSlideStat3, controls: stat3Controls, defaultProps: stat3Defaults, meta: stat3Meta },
  { Component: SwSlideScoreboard, controls: scoreboardControls, defaultProps: scoreboardDefaults, meta: scoreboardMeta },
  { Component: SwSlideMosaic, controls: mosaicControls, defaultProps: mosaicDefaults, meta: mosaicMeta },
  { Component: SwSlideZine, controls: zineControls, defaultProps: zineDefaults, meta: zineMeta },
  { Component: SwSlideMoodboard, controls: moodboardControls, defaultProps: moodboardDefaults, meta: moodboardMeta },
  { Component: SwSlideAlbum, controls: albumControls, defaultProps: albumDefaults, meta: albumMeta },
  { Component: SwSlideVinyl, controls: vinylControls, defaultProps: vinylDefaults, meta: vinylMeta },
  { Component: SwSlideGridWall, controls: gridWallControls, defaultProps: gridWallDefaults, meta: gridWallMeta },
  { Component: SwSlideGalleryWall, controls: galleryWallControls, defaultProps: galleryWallDefaults, meta: galleryWallMeta },
  { Component: SwSlideSpectrum, controls: spectrumControls, defaultProps: spectrumDefaults, meta: spectrumMeta },
  { Component: SwSlideLogoWall, controls: logoWallControls, defaultProps: logoWallDefaults, meta: logoWallMeta },
  { Component: SwSlideDuo, controls: duoControls, defaultProps: duoDefaults, meta: duoMeta },
  { Component: SwSlideSpotlight, controls: spotlightControls, defaultProps: spotlightDefaults, meta: spotlightMeta },
  { Component: SwSlideJourney, controls: journeyControls, defaultProps: journeyDefaults, meta: journeyMeta },
  { Component: SwSlideQuoteImage, controls: quoteImageControls, defaultProps: quoteImageDefaults, meta: quoteImageMeta },
  { Component: SwSlideLyric, controls: lyricControls, defaultProps: lyricDefaults, meta: lyricMeta },
  { Component: SwSlideSection, controls: sectionControls, defaultProps: sectionDefaults, meta: sectionMeta },
  { Component: SwSlideDivider, controls: dividerControls, defaultProps: dividerDefaults, meta: dividerMeta },
  { Component: SwSlideTimeline, controls: timelineControls, defaultProps: timelineDefaults, meta: timelineMeta },
  { Component: SwSlidePrinciples, controls: principlesControls, defaultProps: principlesDefaults, meta: principlesMeta },
  { Component: SwSlideTeam, controls: teamControls, defaultProps: teamDefaults, meta: teamMeta },
  { Component: SwSlideTestimonial, controls: testimonialControls, defaultProps: testimonialDefaults, meta: testimonialMeta },
  { Component: SwSlideQuoteWall, controls: quoteWallControls, defaultProps: quoteWallDefaults, meta: quoteWallMeta },
  { Component: SwSlideJoin, controls: joinControls, defaultProps: joinDefaults, meta: joinMeta },
];
