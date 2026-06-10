// preset3d.js — DEMO preset for the FULL 3D version: pages 05–08 heroes
// (from presetBase) PLUS the corner-sticker emblems on pages 01–04.
// Used by report-deck-3d.html. The slide components stay default-off so the
// plain report-deck.html only shows the new pages' heroes.

import ICONS from "./icons.js";
import PRESET_BASE from "./presetBase.js";

const byId = Object.fromEntries(ICONS.map((i) => [i.id, i.src]));

export const PRESET_3D = {
  ...PRESET_BASE,
  cover:  { showDecor: true, decorSrc: byId["06"], imageCount: 0 }, // 掌机图表 → 市场数据
  coverband:   { showDecor: true, decorSrc: byId["02"] },           // 横向编辑式封面贴纸
  coverposter: { showDecor: true, decorSrc: byId["09"] },           // 中央海报式封面贴纸
  covergrid:   { showDecor: true, decorSrc: byId["10"] },           // 深色网格式封面贴纸
  agenda: { showDecor: true, decorSrc: byId["07"] },                // 像素显示器 → 目录导览
  method: { showDecor: true, decorSrc: byId["08"] },                // 复古电脑 → 分析方法
  trend:  { showDecor: true, decorSrc: byId["01"] },                // 胜利手势 → 增长 / 峰值
  sector: { showDecor: true, decorSrc: byId["11"] },                // 文件夹 → 赛道归类
};

export default PRESET_3D;
