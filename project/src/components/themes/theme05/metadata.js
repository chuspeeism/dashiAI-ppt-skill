export const theme = {
  "key": "theme05",
  "name": "05-PULSE 色谱图表",
  "mode": "new"
};
export const pages = [
  {
    "key": "theme05_page001",
    "themeKey": "theme05",
    "pageNumber": 1,
    "layout": "THEME05-001",
    "slot": "excover1",
    "label": "封面 精益智造",
    "bgClass": "",
    "controls": [
      {
        "key": "accentColor",
        "label": "强调色",
        "type": "color",
        "default": "#E0301E",
        "options": [
          "#E0301E",
          "#E8741C",
          "#F2C00C",
          "#2F9450",
          "#2742C2"
        ],
        "desc": "眉标、指标英文与装饰元素的强调色。"
      },
      {
        "key": "showRail",
        "label": "右侧指标栏",
        "type": "toggle",
        "default": true,
        "desc": "显示右侧深色四项指标参数栏；关闭后标题区铺满整页。"
      },
      {
        "key": "specCount",
        "label": "指标行数",
        "type": "slider",
        "default": 4,
        "min": 1,
        "max": 4,
        "step": 1,
        "desc": "右侧指标栏展示的指标行数量。"
      },
      {
        "key": "showSwatch",
        "label": "色卡",
        "type": "toggle",
        "default": true,
        "desc": "右侧指标栏底部的四色色卡。"
      },
      {
        "key": "showFooter",
        "label": "底部色谱条",
        "type": "toggle",
        "default": true,
        "desc": "页面底部贯穿的文件信息与色谱条。"
      }
    ],
    "defaultProps": {
      "accentColor": "#E0301E",
      "showRail": true,
      "specCount": 4,
      "showSwatch": true,
      "showFooter": true
    }
  },
  {
    "key": "theme05_page002",
    "themeKey": "theme05",
    "pageNumber": 2,
    "layout": "THEME05-002",
    "slot": "excover2",
    "label": "封面 创意破圈",
    "bgClass": "",
    "controls": [
      {
        "key": "showTopRule",
        "label": "顶部分隔线",
        "type": "toggle",
        "default": true,
        "desc": "标题上方贯穿的品牌实验室分隔线。"
      },
      {
        "key": "showNumber",
        "label": "编号徽标",
        "type": "toggle",
        "default": true,
        "desc": "标题上方的 “NO. 02” 编号徽标。"
      },
      {
        "key": "chipCount",
        "label": "色块数量",
        "type": "slider",
        "default": 5,
        "min": 1,
        "max": 5,
        "step": 1,
        "desc": "标题下方的彩色色块条数量。"
      },
      {
        "key": "showBanner",
        "label": "底部标语条",
        "type": "toggle",
        "default": true,
        "desc": "页面底部的深色标语横幅。"
      }
    ],
    "defaultProps": {
      "showTopRule": true,
      "showNumber": true,
      "chipCount": 5,
      "showBanner": true
    }
  },
  {
    "key": "theme05_page003",
    "themeKey": "theme05",
    "pageNumber": 3,
    "layout": "THEME05-003",
    "slot": "excover3",
    "label": "封面 链通全国",
    "bgClass": "",
    "controls": [
      {
        "key": "accentColor",
        "label": "强调色",
        "type": "color",
        "default": "#E8741C",
        "options": [
          "#E8741C",
          "#E0301E",
          "#F2C00C",
          "#2F9450",
          "#2742C2"
        ],
        "desc": "中部眉标的强调色。"
      },
      {
        "key": "showYear",
        "label": "年份水印",
        "type": "toggle",
        "default": true,
        "desc": "左上角的大号年份水印 2026—2028。"
      },
      {
        "key": "showSummary",
        "label": "右上摘要",
        "type": "toggle",
        "default": true,
        "desc": "右上角的战略摘要文本块。"
      },
      {
        "key": "showBotBand",
        "label": "底部色谱条",
        "type": "toggle",
        "default": true,
        "desc": "页面底部贯穿的色谱条。"
      }
    ],
    "defaultProps": {
      "accentColor": "#E8741C",
      "showYear": true,
      "showSummary": true,
      "showBotBand": true
    }
  },
  {
    "key": "theme05_page004",
    "themeKey": "theme05",
    "pageNumber": 4,
    "layout": "THEME05-004",
    "slot": "excover4",
    "label": "封面 把握消费趋势",
    "bgClass": "",
    "controls": [
      {
        "key": "accentColor",
        "label": "高亮色",
        "type": "color",
        "default": "#E0301E",
        "options": [
          "#E0301E",
          "#E8741C",
          "#F2C00C",
          "#2F9450",
          "#7A3C9A"
        ],
        "desc": "菜单当前选中行的高亮底色。"
      },
      {
        "key": "showFrame",
        "label": "内边框",
        "type": "toggle",
        "default": true,
        "desc": "页面四周的双线内边框装饰。"
      },
      {
        "key": "menuCount",
        "label": "菜单行数",
        "type": "slider",
        "default": 4,
        "min": 1,
        "max": 4,
        "step": 1,
        "desc": "底部模拟菜单的条目数量。"
      },
      {
        "key": "showFoot",
        "label": "底部标语",
        "type": "toggle",
        "default": true,
        "desc": "页脚的口号与操作提示两行文本。"
      }
    ],
    "defaultProps": {
      "accentColor": "#E0301E",
      "showFrame": true,
      "menuCount": 4,
      "showFoot": true
    }
  },
  {
    "key": "theme05_page005",
    "themeKey": "theme05",
    "pageNumber": 5,
    "layout": "THEME05-005",
    "slot": "cover",
    "label": "封面 Cover",
    "bgClass": "",
    "controls": [
      {
        "key": "accentColor",
        "label": "强调色",
        "type": "color",
        "default": "#d8402e",
        "options": [
          "#d8402e",
          "#e2742c",
          "#efbe2e",
          "#3c9a52",
          "#4da0c6",
          "#2c44a0",
          "#7a3c90"
        ],
        "desc": "眉标与装饰条的强调色，取自色谱。"
      },
      {
        "key": "showSidePanel",
        "label": "侧栏参数面板",
        "type": "toggle",
        "default": true,
        "desc": "显示右侧规格参数面板。"
      },
      {
        "key": "sidePanelTheme",
        "label": "侧栏主题",
        "type": "radio",
        "default": "dark",
        "options": [
          "dark",
          "light"
        ],
        "desc": "侧栏深色 / 浅色两种配色。"
      },
      {
        "key": "metaCount",
        "label": "参数行数",
        "type": "slider",
        "default": 4,
        "min": 1,
        "max": 5,
        "step": 1,
        "desc": "侧栏展示的规格行数量。"
      },
      {
        "key": "showSwatches",
        "label": "色谱色卡",
        "type": "toggle",
        "default": true,
        "desc": "侧栏底部的七色色谱色卡。"
      },
      {
        "key": "showColorBand",
        "label": "底部色谱条",
        "type": "toggle",
        "default": true,
        "desc": "页面底部贯穿的色谱条带。"
      },
      {
        "key": "showTagline",
        "label": "装饰标语",
        "type": "toggle",
        "default": true,
        "desc": "左下角的一句装饰性结语。"
      }
    ],
    "defaultProps": {
      "accentColor": "#d8402e",
      "showSidePanel": true,
      "sidePanelTheme": "dark",
      "metaCount": 4,
      "showSwatches": true,
      "showColorBand": true,
      "showTagline": true
    }
  },
  {
    "key": "theme05_page006",
    "themeKey": "theme05",
    "pageNumber": 6,
    "layout": "THEME05-006",
    "slot": "spec",
    "label": "摘要 Overview",
    "bgClass": "",
    "controls": [
      {
        "key": "imageCount",
        "label": "图片数量",
        "type": "slider",
        "default": 1,
        "min": 0,
        "max": 2,
        "step": 1,
        "desc": "左侧图示槽位数量（0–2），图片按上传比例自适应。"
      },
      {
        "key": "specRowCount",
        "label": "指标行数",
        "type": "slider",
        "default": 4,
        "min": 2,
        "max": 5,
        "step": 1,
        "desc": "右侧规格指标表的行数。"
      },
      {
        "key": "showHighlight",
        "label": "关键数据高亮",
        "type": "toggle",
        "default": true,
        "desc": "正文中关键数字使用强调色高亮。"
      },
      {
        "key": "accentColor",
        "label": "强调色",
        "type": "color",
        "default": "#2c44a0",
        "options": [
          "#d8402e",
          "#e2742c",
          "#efbe2e",
          "#3c9a52",
          "#4da0c6",
          "#2c44a0",
          "#7a3c90"
        ],
        "desc": "正文高亮使用的强调色。"
      },
      {
        "key": "chartType",
        "label": "占比图样式",
        "type": "radio",
        "default": "bar",
        "options": [
          "bar",
          "cells"
        ],
        "desc": "占比可视化：整条堆叠 (bar) 或分段色块 (cells)。"
      },
      {
        "key": "showProportionBar",
        "label": "底部占比图",
        "type": "toggle",
        "default": true,
        "desc": "显示底部赛道占比可视化。"
      },
      {
        "key": "showSheetLabel",
        "label": "页码标签",
        "type": "toggle",
        "default": true,
        "desc": "右上角的页码 / 章节标签。"
      }
    ],
    "defaultProps": {
      "imageCount": 1,
      "specRowCount": 4,
      "showHighlight": true,
      "accentColor": "#2c44a0",
      "chartType": "bar",
      "showProportionBar": true,
      "showSheetLabel": true
    }
  },
  {
    "key": "theme05_page007",
    "themeKey": "theme05",
    "pageNumber": 7,
    "layout": "THEME05-007",
    "slot": "grid",
    "label": "结构 Contents",
    "bgClass": "",
    "controls": [
      {
        "key": "cardCount",
        "label": "卡片数量",
        "type": "slider",
        "default": 7,
        "min": 1,
        "max": 8,
        "step": 1,
        "desc": "展示的章节卡数量。"
      },
      {
        "key": "columns",
        "label": "列数",
        "type": "slider",
        "default": 4,
        "min": 2,
        "max": 4,
        "step": 1,
        "desc": "网格列数，行数自动换行。"
      },
      {
        "key": "focusEnabled",
        "label": "重点卡",
        "type": "toggle",
        "default": true,
        "desc": "是否突出显示某一张卡片。"
      },
      {
        "key": "focusIndex",
        "label": "重点卡序号",
        "type": "slider",
        "default": 2,
        "min": 1,
        "max": 8,
        "step": 1,
        "desc": "被突出显示的卡片序号（从 1 起）。"
      },
      {
        "key": "showCardGraphic",
        "label": "色块图形",
        "type": "toggle",
        "default": true,
        "desc": "卡片内的抽象色块构图。"
      },
      {
        "key": "showCardIndex",
        "label": "序号",
        "type": "toggle",
        "default": true,
        "desc": "卡片右上角的两位序号。"
      },
      {
        "key": "showCardCode",
        "label": "卡片代号",
        "type": "toggle",
        "default": true,
        "desc": "卡片右下角的大号代号。"
      },
      {
        "key": "showNote",
        "label": "装饰注释",
        "type": "toggle",
        "default": true,
        "desc": "标题右侧的装饰性说明文字。"
      }
    ],
    "defaultProps": {
      "cardCount": 7,
      "columns": 4,
      "focusEnabled": true,
      "focusIndex": 2,
      "showCardGraphic": true,
      "showCardIndex": true,
      "showCardCode": true,
      "showNote": true
    }
  },
  {
    "key": "theme05_page008",
    "themeKey": "theme05",
    "pageNumber": 8,
    "layout": "THEME05-008",
    "slot": "split",
    "label": "方法 Methodology",
    "bgClass": "",
    "controls": [
      {
        "key": "menuItemCount",
        "label": "菜单项数量",
        "type": "slider",
        "default": 6,
        "min": 2,
        "max": 6,
        "step": 1,
        "desc": "右侧控制菜单的行数。"
      },
      {
        "key": "focusEnabled",
        "label": "高亮项",
        "type": "toggle",
        "default": true,
        "desc": "是否高亮某一条菜单项。"
      },
      {
        "key": "focusIndex",
        "label": "高亮项序号",
        "type": "slider",
        "default": 1,
        "min": 1,
        "max": 6,
        "step": 1,
        "desc": "被高亮的菜单项序号（从 1 起）。"
      },
      {
        "key": "panelColor",
        "label": "面板色",
        "type": "color",
        "default": "#2c44a0",
        "options": [
          "#2c44a0",
          "#7a3c90",
          "#3c9a52",
          "#d8402e",
          "#1a1814"
        ],
        "desc": "右侧菜单面板背景色（取深色保证文字可读）。"
      },
      {
        "key": "accentColor",
        "label": "强调色",
        "type": "color",
        "default": "#d8402e",
        "options": [
          "#d8402e",
          "#e2742c",
          "#efbe2e",
          "#3c9a52",
          "#4da0c6",
          "#2c44a0",
          "#7a3c90"
        ],
        "desc": "左侧眉标的强调色。"
      },
      {
        "key": "specRowCount",
        "label": "左侧条目数",
        "type": "slider",
        "default": 4,
        "min": 2,
        "max": 4,
        "step": 1,
        "desc": "左侧方法说明的条目数量。"
      },
      {
        "key": "showColorBand",
        "label": "色谱条",
        "type": "toggle",
        "default": true,
        "desc": "左下角的小色谱条带。"
      },
      {
        "key": "showWordmark",
        "label": "标识",
        "type": "toggle",
        "default": true,
        "desc": "左下角的品牌标识。"
      }
    ],
    "defaultProps": {
      "menuItemCount": 6,
      "focusEnabled": true,
      "focusIndex": 1,
      "panelColor": "#2c44a0",
      "accentColor": "#d8402e",
      "specRowCount": 4,
      "showColorBand": true,
      "showWordmark": true
    }
  },
  {
    "key": "theme05_page009",
    "themeKey": "theme05",
    "pageNumber": 9,
    "layout": "THEME05-009",
    "slot": "trend",
    "label": "趋势 Trend",
    "bgClass": "",
    "controls": [
      {
        "key": "chartType",
        "label": "图表类型",
        "type": "radio",
        "default": "bar",
        "options": [
          {
            "value": "bar",
            "label": "柱状"
          },
          {
            "value": "line",
            "label": "折线"
          },
          {
            "value": "area",
            "label": "面积"
          }
        ],
        "desc": "主图表呈现方式：柱状 / 折线 / 面积。"
      },
      {
        "key": "pointCount",
        "label": "数据点数量",
        "type": "slider",
        "default": 4,
        "min": 2,
        "max": 4,
        "step": 1,
        "desc": "图表与指标列表展示的数据点（时间截面）数量。"
      },
      {
        "key": "focusEnabled",
        "label": "重点标注",
        "type": "toggle",
        "default": true,
        "desc": "是否突出某一个数据点（峰值 / 关键截面）。"
      },
      {
        "key": "focusIndex",
        "label": "重点数据点",
        "type": "slider",
        "default": 3,
        "min": 1,
        "max": 4,
        "step": 1,
        "desc": "被突出的数据点序号（从 1 起）。"
      },
      {
        "key": "showSecondary",
        "label": "副数据系列",
        "type": "toggle",
        "default": true,
        "desc": "叠加第二条数据系列（虚线）。"
      },
      {
        "key": "showMetrics",
        "label": "指标列表",
        "type": "toggle",
        "default": true,
        "desc": "右侧的逐项数据指标列表。"
      },
      {
        "key": "accentColor",
        "label": "强调色",
        "type": "color",
        "default": "#d8402e",
        "options": [
          "#d8402e",
          "#e2742c",
          "#efbe2e",
          "#3c9a52",
          "#4da0c6",
          "#2c44a0",
          "#7a3c90"
        ],
        "desc": "重点标注与眉标的强调色。"
      },
      {
        "key": "showConclusion",
        "label": "结论文案",
        "type": "toggle",
        "default": true,
        "desc": "右下角的一句装饰性结论。"
      },
      {
        "key": "showSheetLabel",
        "label": "页码标签",
        "type": "toggle",
        "default": true,
        "desc": "右上角的页码 / 章节标签。"
      }
    ],
    "defaultProps": {
      "chartType": "bar",
      "pointCount": 4,
      "focusEnabled": true,
      "focusIndex": 3,
      "showSecondary": true,
      "showMetrics": true,
      "accentColor": "#d8402e",
      "showConclusion": true,
      "showSheetLabel": true
    }
  },
  {
    "key": "theme05_page010",
    "themeKey": "theme05",
    "pageNumber": 10,
    "layout": "THEME05-010",
    "slot": "share",
    "label": "占比 Share",
    "bgClass": "",
    "controls": [
      {
        "key": "chartType",
        "label": "图表类型",
        "type": "radio",
        "default": "donut",
        "options": [
          {
            "value": "donut",
            "label": "环形"
          },
          {
            "value": "bar",
            "label": "条形"
          },
          {
            "value": "stack",
            "label": "堆叠"
          }
        ],
        "desc": "占比图呈现方式：环形 / 条形 / 堆叠。"
      },
      {
        "key": "segmentCount",
        "label": "分段数量",
        "type": "slider",
        "default": 5,
        "min": 3,
        "max": 5,
        "step": 1,
        "desc": "参与占比拆分的分段数量。"
      },
      {
        "key": "focusEnabled",
        "label": "重点分段",
        "type": "toggle",
        "default": true,
        "desc": "是否突出某一个分段（环形居中显示该项）。"
      },
      {
        "key": "focusIndex",
        "label": "重点分段序号",
        "type": "slider",
        "default": 1,
        "min": 1,
        "max": 5,
        "step": 1,
        "desc": "被突出的分段序号（从 1 起）。"
      },
      {
        "key": "showLegend",
        "label": "图例列表",
        "type": "toggle",
        "default": true,
        "desc": "右侧带数值的图例列表。"
      },
      {
        "key": "showConclusion",
        "label": "结论文案",
        "type": "toggle",
        "default": true,
        "desc": "图例下方的一句装饰性结论。"
      },
      {
        "key": "accentColor",
        "label": "强调色",
        "type": "color",
        "default": "#d8402e",
        "options": [
          "#d8402e",
          "#e2742c",
          "#efbe2e",
          "#3c9a52",
          "#4da0c6",
          "#2c44a0",
          "#7a3c90"
        ],
        "desc": "眉标与重点项的强调色。"
      },
      {
        "key": "showSheetLabel",
        "label": "页码标签",
        "type": "toggle",
        "default": true,
        "desc": "右上角的页码 / 章节标签。"
      }
    ],
    "defaultProps": {
      "chartType": "donut",
      "segmentCount": 5,
      "focusEnabled": true,
      "focusIndex": 1,
      "showLegend": true,
      "showConclusion": true,
      "accentColor": "#d8402e",
      "showSheetLabel": true
    }
  },
  {
    "key": "theme05_page011",
    "themeKey": "theme05",
    "pageNumber": 11,
    "layout": "THEME05-011",
    "slot": "chain",
    "label": "产业链 Value Chain",
    "bgClass": "",
    "controls": [
      {
        "key": "layerCount",
        "label": "层级数量",
        "type": "slider",
        "default": 3,
        "min": 2,
        "max": 4,
        "step": 1,
        "desc": "纵向堆叠的结构层级数量。"
      },
      {
        "key": "focusEnabled",
        "label": "重点层级",
        "type": "toggle",
        "default": true,
        "desc": "是否突出某一层级。"
      },
      {
        "key": "focusIndex",
        "label": "重点层级序号",
        "type": "slider",
        "default": 2,
        "min": 1,
        "max": 4,
        "step": 1,
        "desc": "被突出的层级序号（从 1 起）。"
      },
      {
        "key": "showItems",
        "label": "层级标签",
        "type": "toggle",
        "default": true,
        "desc": "每个层级内部的要素标签。"
      },
      {
        "key": "showSidePanel",
        "label": "侧栏分布",
        "type": "toggle",
        "default": true,
        "desc": "右侧的分布占比面板。"
      },
      {
        "key": "accentColor",
        "label": "强调色",
        "type": "color",
        "default": "#d8402e",
        "options": [
          "#d8402e",
          "#e2742c",
          "#efbe2e",
          "#3c9a52",
          "#4da0c6",
          "#2c44a0",
          "#7a3c90"
        ],
        "desc": "眉标与重点层级标记的强调色。"
      },
      {
        "key": "showConclusion",
        "label": "结论文案",
        "type": "toggle",
        "default": true,
        "desc": "侧栏底部的一句装饰性结论。"
      },
      {
        "key": "showSheetLabel",
        "label": "页码标签",
        "type": "toggle",
        "default": true,
        "desc": "右上角的页码 / 章节标签。"
      }
    ],
    "defaultProps": {
      "layerCount": 3,
      "focusEnabled": true,
      "focusIndex": 2,
      "showItems": true,
      "showSidePanel": true,
      "accentColor": "#d8402e",
      "showConclusion": true,
      "showSheetLabel": true
    }
  },
  {
    "key": "theme05_page012",
    "themeKey": "theme05",
    "pageNumber": 12,
    "layout": "THEME05-012",
    "slot": "cases",
    "label": "案例 Cases",
    "bgClass": "",
    "controls": [
      {
        "key": "cardCount",
        "label": "案例卡数量",
        "type": "slider",
        "default": 3,
        "min": 2,
        "max": 4,
        "step": 1,
        "desc": "横向排列的案例卡数量。"
      },
      {
        "key": "focusEnabled",
        "label": "重点卡",
        "type": "toggle",
        "default": true,
        "desc": "是否突出某一张案例卡。"
      },
      {
        "key": "focusIndex",
        "label": "重点卡序号",
        "type": "slider",
        "default": 1,
        "min": 1,
        "max": 4,
        "step": 1,
        "desc": "被突出的案例卡序号（从 1 起）。"
      },
      {
        "key": "imageCount",
        "label": "图片槽数量",
        "type": "slider",
        "default": 2,
        "min": 0,
        "max": 3,
        "step": 1,
        "desc": "底部图片槽数量（0–3）；按各图比例自适应排布，构图自动均衡。"
      },
      {
        "key": "showMetrics",
        "label": "卡内指标",
        "type": "toggle",
        "default": true,
        "desc": "案例卡内部的指标列表。"
      },
      {
        "key": "showGalleryCaption",
        "label": "图注",
        "type": "toggle",
        "default": true,
        "desc": "图片区上方的装饰性图注。"
      },
      {
        "key": "accentColor",
        "label": "强调色",
        "type": "color",
        "default": "#d8402e",
        "options": [
          "#d8402e",
          "#e2742c",
          "#efbe2e",
          "#3c9a52",
          "#4da0c6",
          "#2c44a0",
          "#7a3c90"
        ],
        "desc": "眉标的强调色。"
      },
      {
        "key": "showSheetLabel",
        "label": "页码标签",
        "type": "toggle",
        "default": true,
        "desc": "右上角的页码 / 章节标签。"
      }
    ],
    "defaultProps": {
      "cardCount": 3,
      "focusEnabled": true,
      "focusIndex": 1,
      "imageCount": 2,
      "showMetrics": true,
      "showGalleryCaption": true,
      "accentColor": "#d8402e",
      "showSheetLabel": true
    }
  },
  {
    "key": "theme05_page013",
    "themeKey": "theme05",
    "pageNumber": 13,
    "layout": "THEME05-013",
    "slot": "heat",
    "label": "热力 Heatmap",
    "bgClass": "",
    "controls": [
      {
        "key": "cellCount",
        "label": "数据格数量",
        "type": "slider",
        "default": 12,
        "min": 6,
        "max": 12,
        "step": 1,
        "desc": "参与展示的周期格（月份）数量。"
      },
      {
        "key": "columns",
        "label": "网格列数",
        "type": "slider",
        "default": 4,
        "min": 2,
        "max": 6,
        "step": 1,
        "desc": "热力网格的列数，决定排布形状。"
      },
      {
        "key": "colorScale",
        "label": "色阶模式",
        "type": "radio",
        "default": "warm",
        "options": [
          {
            "value": "warm",
            "label": "暖色"
          },
          {
            "value": "cool",
            "label": "冷色"
          },
          {
            "value": "mono",
            "label": "单色"
          }
        ],
        "desc": "数值映射到颜色的色阶：暖色 / 冷色 / 单色。"
      },
      {
        "key": "focusEnabled",
        "label": "突出极值",
        "type": "toggle",
        "default": true,
        "desc": "是否在网格上标记数值最高的若干格。"
      },
      {
        "key": "focusCount",
        "label": "极值数量",
        "type": "slider",
        "default": 2,
        "min": 1,
        "max": 4,
        "step": 1,
        "desc": "被标记 / 列出的峰值格数量（取最大的前 N 个）。"
      },
      {
        "key": "showValues",
        "label": "显示数值",
        "type": "toggle",
        "default": true,
        "desc": "在每个格内显示数值。"
      },
      {
        "key": "showPeakList",
        "label": "峰值列表",
        "type": "toggle",
        "default": true,
        "desc": "右侧按数值排序的峰值列表。"
      },
      {
        "key": "showScaleLegend",
        "label": "色阶图例",
        "type": "toggle",
        "default": true,
        "desc": "右侧的色阶渐变图例条。"
      },
      {
        "key": "accentColor",
        "label": "强调色",
        "type": "color",
        "default": "#d8402e",
        "options": [
          "#d8402e",
          "#e2742c",
          "#efbe2e",
          "#3c9a52",
          "#4da0c6",
          "#2c44a0",
          "#7a3c90"
        ],
        "desc": "峰值标记与眉标的强调色。"
      },
      {
        "key": "showConclusion",
        "label": "结论文案",
        "type": "toggle",
        "default": true,
        "desc": "右下角的一句装饰性结论。"
      },
      {
        "key": "showSheetLabel",
        "label": "页码标签",
        "type": "toggle",
        "default": true,
        "desc": "右上角的页码 / 章节标签。"
      }
    ],
    "defaultProps": {
      "cellCount": 12,
      "columns": 4,
      "colorScale": "warm",
      "focusEnabled": true,
      "focusCount": 2,
      "showValues": true,
      "showPeakList": true,
      "showScaleLegend": true,
      "accentColor": "#d8402e",
      "showConclusion": true,
      "showSheetLabel": true
    }
  },
  {
    "key": "theme05_page014",
    "themeKey": "theme05",
    "pageNumber": 14,
    "layout": "THEME05-014",
    "slot": "rank",
    "label": "排名 Ranking",
    "bgClass": "",
    "controls": [
      {
        "key": "rowCount",
        "label": "排名条目数",
        "type": "slider",
        "default": 10,
        "min": 3,
        "max": 10,
        "step": 1,
        "desc": "榜单展示的条目数量（按数值从高到低）。"
      },
      {
        "key": "focusEnabled",
        "label": "突出榜首",
        "type": "toggle",
        "default": true,
        "desc": "是否突出排名靠前的若干条目。"
      },
      {
        "key": "focusCount",
        "label": "突出数量",
        "type": "slider",
        "default": 3,
        "min": 1,
        "max": 3,
        "step": 1,
        "desc": "被突出的头部条目数量（前 N 名）。"
      },
      {
        "key": "colorMode",
        "label": "配色模式",
        "type": "radio",
        "default": "category",
        "options": [
          {
            "value": "category",
            "label": "按类别"
          },
          {
            "value": "accent",
            "label": "强调色"
          },
          {
            "value": "mono",
            "label": "单色"
          }
        ],
        "desc": "条形配色：按类别 / 统一强调色 / 单色。"
      },
      {
        "key": "showRankNumber",
        "label": "排名序号",
        "type": "toggle",
        "default": true,
        "desc": "每行左侧的两位排名序号。"
      },
      {
        "key": "showTag",
        "label": "类别标签",
        "type": "toggle",
        "default": true,
        "desc": "名称下方的类别 / 赛道标签。"
      },
      {
        "key": "showValue",
        "label": "数值标注",
        "type": "toggle",
        "default": true,
        "desc": "每行右侧的数值标注。"
      },
      {
        "key": "accentColor",
        "label": "强调色",
        "type": "color",
        "default": "#d8402e",
        "options": [
          "#d8402e",
          "#e2742c",
          "#efbe2e",
          "#3c9a52",
          "#4da0c6",
          "#2c44a0",
          "#7a3c90"
        ],
        "desc": "突出条目与眉标的强调色。"
      },
      {
        "key": "showConclusion",
        "label": "结论文案",
        "type": "toggle",
        "default": true,
        "desc": "底部的一句装饰性结论。"
      },
      {
        "key": "showSheetLabel",
        "label": "页码标签",
        "type": "toggle",
        "default": true,
        "desc": "右上角的页码 / 章节标签。"
      }
    ],
    "defaultProps": {
      "rowCount": 10,
      "focusEnabled": true,
      "focusCount": 3,
      "colorMode": "category",
      "showRankNumber": true,
      "showTag": true,
      "showValue": true,
      "accentColor": "#d8402e",
      "showConclusion": true,
      "showSheetLabel": true
    }
  },
  {
    "key": "theme05_page015",
    "themeKey": "theme05",
    "pageNumber": 15,
    "layout": "THEME05-015",
    "slot": "quad",
    "label": "象限 Quadrant",
    "bgClass": "",
    "controls": [
      {
        "key": "focusEnabled",
        "label": "突出象限",
        "type": "toggle",
        "default": true,
        "desc": "是否突出某一个象限。"
      },
      {
        "key": "focusIndex",
        "label": "重点象限",
        "type": "slider",
        "default": 1,
        "min": 1,
        "max": 4,
        "step": 1,
        "desc": "被突出的象限序号（1 明星兑现 / 2 叙事泡沫 / 3 隐形价值 / 4 等待验证）。"
      },
      {
        "key": "quadrantTint",
        "label": "象限底色",
        "type": "toggle",
        "default": false,
        "desc": "是否为四个象限填充类别底色（关闭则为线框留白风格）。"
      },
      {
        "key": "showItems",
        "label": "代表方向",
        "type": "toggle",
        "default": true,
        "desc": "每个象限内的代表方向标签。"
      },
      {
        "key": "showScatter",
        "label": "散点标记",
        "type": "toggle",
        "default": true,
        "desc": "象限内装饰性散点（代表落点公司）。"
      },
      {
        "key": "showAxisLabels",
        "label": "坐标轴标签",
        "type": "toggle",
        "default": true,
        "desc": "矩阵外侧的两条坐标轴标签。"
      },
      {
        "key": "accentColor",
        "label": "强调色",
        "type": "color",
        "default": "#d8402e",
        "options": [
          "#d8402e",
          "#e2742c",
          "#efbe2e",
          "#3c9a52",
          "#4da0c6",
          "#2c44a0",
          "#7a3c90"
        ],
        "desc": "重点象限标记与眉标的强调色。"
      },
      {
        "key": "showConclusion",
        "label": "结论文案",
        "type": "toggle",
        "default": true,
        "desc": "底部的一句装饰性结论。"
      },
      {
        "key": "showSheetLabel",
        "label": "页码标签",
        "type": "toggle",
        "default": true,
        "desc": "右上角的页码 / 章节标签。"
      }
    ],
    "defaultProps": {
      "focusEnabled": true,
      "focusIndex": 1,
      "quadrantTint": false,
      "showItems": true,
      "showScatter": true,
      "showAxisLabels": true,
      "accentColor": "#d8402e",
      "showConclusion": true,
      "showSheetLabel": true
    }
  },
  {
    "key": "theme05_page016",
    "themeKey": "theme05",
    "pageNumber": 16,
    "layout": "THEME05-016",
    "slot": "risk",
    "label": "风险 Risk",
    "bgClass": "",
    "controls": [
      {
        "key": "chainCount",
        "label": "传导链节点",
        "type": "slider",
        "default": 4,
        "min": 3,
        "max": 5,
        "step": 1,
        "desc": "顶部风险传导链的节点数量。"
      },
      {
        "key": "cardCount",
        "label": "风险卡数量",
        "type": "slider",
        "default": 4,
        "min": 2,
        "max": 5,
        "step": 1,
        "desc": "风险因素卡片数量（网格列数随之变化）。"
      },
      {
        "key": "focusEnabled",
        "label": "突出风险",
        "type": "toggle",
        "default": true,
        "desc": "是否突出某一张风险卡。"
      },
      {
        "key": "focusIndex",
        "label": "重点风险卡",
        "type": "slider",
        "default": 1,
        "min": 1,
        "max": 5,
        "step": 1,
        "desc": "被突出的风险卡序号（从 1 起）。"
      },
      {
        "key": "imageCount",
        "label": "图片槽数量",
        "type": "slider",
        "default": 1,
        "min": 0,
        "max": 2,
        "step": 1,
        "desc": "底部图片槽数量（0–2）；按各图比例自适应排布，构图自动均衡。"
      },
      {
        "key": "showChain",
        "label": "传导链",
        "type": "toggle",
        "default": true,
        "desc": "顶部的风险传导链。"
      },
      {
        "key": "showLevel",
        "label": "风险等级",
        "type": "toggle",
        "default": true,
        "desc": "卡片内的风险等级标识（高 / 中 / 低）。"
      },
      {
        "key": "showGalleryCaption",
        "label": "图注",
        "type": "toggle",
        "default": true,
        "desc": "图片区上方的装饰性图注。"
      },
      {
        "key": "accentColor",
        "label": "强调色",
        "type": "color",
        "default": "#d8402e",
        "options": [
          "#d8402e",
          "#e2742c",
          "#efbe2e",
          "#3c9a52",
          "#4da0c6",
          "#2c44a0",
          "#7a3c90"
        ],
        "desc": "眉标的强调色。"
      },
      {
        "key": "showConclusion",
        "label": "结论文案",
        "type": "toggle",
        "default": true,
        "desc": "底部的一句装饰性结论。"
      },
      {
        "key": "showSheetLabel",
        "label": "页码标签",
        "type": "toggle",
        "default": true,
        "desc": "右上角的页码 / 章节标签。"
      }
    ],
    "defaultProps": {
      "chainCount": 4,
      "cardCount": 4,
      "focusEnabled": true,
      "focusIndex": 1,
      "imageCount": 1,
      "showChain": true,
      "showLevel": true,
      "showGalleryCaption": true,
      "accentColor": "#d8402e",
      "showConclusion": true,
      "showSheetLabel": true
    }
  },
  {
    "key": "theme05_page017",
    "themeKey": "theme05",
    "pageNumber": 17,
    "layout": "THEME05-017",
    "slot": "outlook",
    "label": "策略 Outlook",
    "bgClass": "",
    "controls": [
      {
        "key": "listItemCount",
        "label": "每栏条目数",
        "type": "slider",
        "default": 3,
        "min": 2,
        "max": 4,
        "step": 1,
        "desc": "左右对比栏各自显示的条目数量。"
      },
      {
        "key": "showTimeline",
        "label": "阶段时间轴",
        "type": "toggle",
        "default": true,
        "desc": "是否显示底部的横向阶段时间轴。"
      },
      {
        "key": "timelineNodeCount",
        "label": "时间轴节点数",
        "type": "slider",
        "default": 4,
        "min": 2,
        "max": 4,
        "step": 1,
        "desc": "时间轴上的阶段节点数量。"
      },
      {
        "key": "focusEnabled",
        "label": "重点节点",
        "type": "toggle",
        "default": true,
        "desc": "是否突出某一个时间轴节点。"
      },
      {
        "key": "focusIndex",
        "label": "重点节点序号",
        "type": "slider",
        "default": 2,
        "min": 1,
        "max": 4,
        "step": 1,
        "desc": "被突出的时间轴节点序号（从 1 起）。"
      },
      {
        "key": "leftColor",
        "label": "左栏色",
        "type": "color",
        "default": "#3c9a52",
        "options": [
          "#d8402e",
          "#e2742c",
          "#efbe2e",
          "#3c9a52",
          "#4da0c6",
          "#2c44a0",
          "#7a3c90"
        ],
        "desc": "左侧对比栏的标题条颜色。"
      },
      {
        "key": "rightColor",
        "label": "右栏色",
        "type": "color",
        "default": "#d8402e",
        "options": [
          "#d8402e",
          "#e2742c",
          "#efbe2e",
          "#3c9a52",
          "#4da0c6",
          "#2c44a0",
          "#7a3c90"
        ],
        "desc": "右侧对比栏的标题条颜色。"
      },
      {
        "key": "accentColor",
        "label": "强调色",
        "type": "color",
        "default": "#d8402e",
        "options": [
          "#d8402e",
          "#e2742c",
          "#efbe2e",
          "#3c9a52",
          "#4da0c6",
          "#2c44a0",
          "#7a3c90"
        ],
        "desc": "眉标与时间轴重点节点的强调色。"
      },
      {
        "key": "showConclusion",
        "label": "结论文案",
        "type": "toggle",
        "default": true,
        "desc": "底部的一句装饰性结论。"
      },
      {
        "key": "showSheetLabel",
        "label": "页码标签",
        "type": "toggle",
        "default": true,
        "desc": "右上角的页码 / 章节标签。"
      }
    ],
    "defaultProps": {
      "listItemCount": 3,
      "showTimeline": true,
      "timelineNodeCount": 4,
      "focusEnabled": true,
      "focusIndex": 2,
      "leftColor": "#3c9a52",
      "rightColor": "#d8402e",
      "accentColor": "#d8402e",
      "showConclusion": true,
      "showSheetLabel": true
    }
  },
  {
    "key": "theme05_page018",
    "themeKey": "theme05",
    "pageNumber": 18,
    "layout": "THEME05-018",
    "slot": "quote",
    "label": "结论 Conclusion",
    "bgClass": "",
    "controls": [
      {
        "key": "theme",
        "label": "背景主题",
        "type": "radio",
        "default": "paper",
        "options": [
          {
            "value": "paper",
            "label": "纸色"
          },
          {
            "value": "dark",
            "label": "深色"
          }
        ],
        "desc": "页面整体明 / 暗背景。"
      },
      {
        "key": "quoteAlign",
        "label": "金句对齐",
        "type": "radio",
        "default": "left",
        "options": [
          {
            "value": "left",
            "label": "左对齐"
          },
          {
            "value": "center",
            "label": "居中"
          }
        ],
        "desc": "金句的对齐方式。"
      },
      {
        "key": "conclusionCount",
        "label": "结论点数量",
        "type": "slider",
        "default": 3,
        "min": 0,
        "max": 3,
        "step": 1,
        "desc": "金句下方的支撑结论点数量（0 隐藏）。"
      },
      {
        "key": "showQuoteMark",
        "label": "引号装饰",
        "type": "toggle",
        "default": true,
        "desc": "金句上方的大号装饰引号。"
      },
      {
        "key": "accentColor",
        "label": "强调色",
        "type": "color",
        "default": "#d8402e",
        "options": [
          "#d8402e",
          "#e2742c",
          "#efbe2e",
          "#3c9a52",
          "#4da0c6",
          "#2c44a0",
          "#7a3c90"
        ],
        "desc": "眉标、引号与金句重点词的强调色。"
      },
      {
        "key": "showSource",
        "label": "数据来源",
        "type": "toggle",
        "default": true,
        "desc": "底部的数据口径 / 来源说明。"
      },
      {
        "key": "showColorBand",
        "label": "色谱条",
        "type": "toggle",
        "default": true,
        "desc": "右下角的小色谱条带。"
      },
      {
        "key": "showSheetLabel",
        "label": "页码标签",
        "type": "toggle",
        "default": true,
        "desc": "右上角的页码 / 章节标签。"
      }
    ],
    "defaultProps": {
      "theme": "paper",
      "quoteAlign": "left",
      "conclusionCount": 3,
      "showQuoteMark": true,
      "accentColor": "#d8402e",
      "showSource": true,
      "showColorBand": true,
      "showSheetLabel": true
    }
  },
  {
    "key": "theme05_page019",
    "themeKey": "theme05",
    "pageNumber": 19,
    "layout": "THEME05-019",
    "slot": "chapter",
    "label": "章节 Chapter",
    "bgClass": "",
    "controls": [
      {
        "key": "theme",
        "label": "背景主题",
        "type": "radio",
        "default": "dark",
        "options": [
          {
            "value": "dark",
            "label": "深色"
          },
          {
            "value": "paper",
            "label": "纸色"
          },
          {
            "value": "color",
            "label": "色块"
          }
        ],
        "desc": "章节页背景：深色 / 纸色 / 整页色块。"
      },
      {
        "key": "bgColor",
        "label": "色块背景",
        "type": "color",
        "default": "#2c44a0",
        "options": [
          "#d8402e",
          "#e2742c",
          "#efbe2e",
          "#3c9a52",
          "#4da0c6",
          "#2c44a0",
          "#7a3c90"
        ],
        "desc": "「色块」主题下的整页背景色。"
      },
      {
        "key": "showBigNumber",
        "label": "大号章节号",
        "type": "toggle",
        "default": true,
        "desc": "右侧的超大章节编号。"
      },
      {
        "key": "keywordCount",
        "label": "关键词数量",
        "type": "slider",
        "default": 4,
        "min": 0,
        "max": 4,
        "step": 1,
        "desc": "底部关键词标签数量（0 隐藏）。"
      },
      {
        "key": "accentColor",
        "label": "强调色",
        "type": "color",
        "default": "#d8402e",
        "options": [
          "#d8402e",
          "#e2742c",
          "#efbe2e",
          "#3c9a52",
          "#4da0c6",
          "#2c44a0",
          "#7a3c90"
        ],
        "desc": "眉标与章节编号的强调色（色块主题除外）。"
      },
      {
        "key": "showColorBand",
        "label": "色谱条",
        "type": "toggle",
        "default": true,
        "desc": "底部的色谱条带。"
      },
      {
        "key": "showWordmark",
        "label": "品牌标识",
        "type": "toggle",
        "default": true,
        "desc": "左上角的品牌标识。"
      },
      {
        "key": "showSheetLabel",
        "label": "页码标签",
        "type": "toggle",
        "default": true,
        "desc": "右上角的章节 / 页码标签。"
      }
    ],
    "defaultProps": {
      "theme": "dark",
      "bgColor": "#2c44a0",
      "showBigNumber": true,
      "keywordCount": 4,
      "accentColor": "#d8402e",
      "showColorBand": true,
      "showWordmark": true,
      "showSheetLabel": true
    }
  },
  {
    "key": "theme05_page020",
    "themeKey": "theme05",
    "pageNumber": 20,
    "layout": "THEME05-020",
    "slot": "bubble",
    "label": "气泡 Deal Map",
    "bgClass": "",
    "controls": [
      {
        "key": "tierCount",
        "label": "金额分层数",
        "type": "slider",
        "default": 4,
        "min": 2,
        "max": 4,
        "step": 1,
        "desc": "展示的金额区间（气泡分组）数量。"
      },
      {
        "key": "bubbleScale",
        "label": "气泡大小",
        "type": "slider",
        "default": 1,
        "min": 0.6,
        "max": 1.6,
        "step": 0.1,
        "desc": "气泡整体大小的缩放系数。"
      },
      {
        "key": "focusEnabled",
        "label": "重点分层",
        "type": "toggle",
        "default": true,
        "desc": "是否突出某一金额区间（其余气泡淡出）。"
      },
      {
        "key": "focusIndex",
        "label": "重点分层序号",
        "type": "slider",
        "default": 4,
        "min": 1,
        "max": 4,
        "step": 1,
        "desc": "被突出的金额区间序号（从 1 起，小额→大额）。"
      },
      {
        "key": "colorMode",
        "label": "配色方式",
        "type": "radio",
        "default": "category",
        "options": [
          {
            "value": "category",
            "label": "按类别"
          },
          {
            "value": "accent",
            "label": "强调色"
          },
          {
            "value": "mono",
            "label": "单色"
          }
        ],
        "desc": "气泡配色：按赛道类别 / 单一强调色 / 单色。"
      },
      {
        "key": "showGrid",
        "label": "网格背景",
        "type": "toggle",
        "default": true,
        "desc": "气泡区域的背景网格线。"
      },
      {
        "key": "showLegend",
        "label": "图例",
        "type": "toggle",
        "default": true,
        "desc": "右侧的金额区间图例（含笔数与合计）。"
      },
      {
        "key": "accentColor",
        "label": "强调色",
        "type": "color",
        "default": "#d8402e",
        "options": [
          "#d8402e",
          "#e2742c",
          "#efbe2e",
          "#3c9a52",
          "#4da0c6",
          "#2c44a0",
          "#7a3c90"
        ],
        "desc": "眉标的强调色（强调色配色模式下也用于气泡）。"
      },
      {
        "key": "showConclusion",
        "label": "结论文案",
        "type": "toggle",
        "default": true,
        "desc": "右下角的一句装饰性结论。"
      },
      {
        "key": "showSheetLabel",
        "label": "页码标签",
        "type": "toggle",
        "default": true,
        "desc": "右上角的页码 / 章节标签。"
      }
    ],
    "defaultProps": {
      "tierCount": 4,
      "bubbleScale": 1,
      "focusEnabled": true,
      "focusIndex": 4,
      "colorMode": "category",
      "showGrid": true,
      "showLegend": true,
      "accentColor": "#d8402e",
      "showConclusion": true,
      "showSheetLabel": true
    }
  },
  {
    "key": "theme05_page021",
    "themeKey": "theme05",
    "pageNumber": 21,
    "layout": "THEME05-021",
    "slot": "snapshot",
    "label": "季度快照 Snapshot",
    "bgClass": "",
    "controls": [
      {
        "key": "chartType",
        "label": "图表类型",
        "type": "radio",
        "default": "bar",
        "options": [
          {
            "value": "bar",
            "label": "柱状"
          },
          {
            "value": "line",
            "label": "折线"
          },
          {
            "value": "area",
            "label": "面积"
          }
        ],
        "desc": "右侧证据图表的呈现方式：柱状 / 折线 / 面积。"
      },
      {
        "key": "pointCount",
        "label": "数据点数量",
        "type": "slider",
        "default": 3,
        "min": 2,
        "max": 3,
        "step": 1,
        "desc": "证据图表展示的数据点（时间截面）数量。"
      },
      {
        "key": "focusEnabled",
        "label": "重点标注",
        "type": "toggle",
        "default": true,
        "desc": "是否突出某一个数据点（峰值 / 关键截面）。"
      },
      {
        "key": "focusIndex",
        "label": "重点数据点",
        "type": "slider",
        "default": 3,
        "min": 1,
        "max": 3,
        "step": 1,
        "desc": "被突出的数据点序号（从 1 起）。"
      },
      {
        "key": "metricCount",
        "label": "指标行数",
        "type": "slider",
        "default": 4,
        "min": 2,
        "max": 4,
        "step": 1,
        "desc": "左侧主体卡的指标行数量。"
      },
      {
        "key": "showSwatches",
        "label": "色谱色卡",
        "type": "toggle",
        "default": true,
        "desc": "左下角的装饰性色谱色卡。"
      },
      {
        "key": "accentColor",
        "label": "强调色",
        "type": "color",
        "default": "#2c44a0",
        "options": [
          "#d8402e",
          "#e2742c",
          "#efbe2e",
          "#3c9a52",
          "#4da0c6",
          "#2c44a0",
          "#7a3c90"
        ],
        "desc": "主体字形 / 重点标注 / 眉标的强调色。"
      },
      {
        "key": "showConclusion",
        "label": "结论文案",
        "type": "toggle",
        "default": true,
        "desc": "面板下方的一句装饰性结论。"
      },
      {
        "key": "showSheetLabel",
        "label": "页码标签",
        "type": "toggle",
        "default": true,
        "desc": "右上角的页码 / 章节标签。"
      }
    ],
    "defaultProps": {
      "chartType": "bar",
      "pointCount": 3,
      "focusEnabled": true,
      "focusIndex": 3,
      "metricCount": 4,
      "showSwatches": true,
      "accentColor": "#2c44a0",
      "showConclusion": true,
      "showSheetLabel": true
    }
  },
  {
    "key": "theme05_page022",
    "themeKey": "theme05",
    "pageNumber": 22,
    "layout": "THEME05-022",
    "slot": "delta",
    "label": "环比对比 Delta",
    "bgClass": "",
    "controls": [
      {
        "key": "rowCount",
        "label": "对比行数",
        "type": "slider",
        "default": 3,
        "min": 2,
        "max": 3,
        "step": 1,
        "desc": "下方分段（子周期）条形的数量。"
      },
      {
        "key": "focusEnabled",
        "label": "重点标注",
        "type": "toggle",
        "default": true,
        "desc": "是否突出某一条分段（峰值 / 关键项）。"
      },
      {
        "key": "focusIndex",
        "label": "重点分段",
        "type": "slider",
        "default": 2,
        "min": 1,
        "max": 3,
        "step": 1,
        "desc": "被突出的分段序号（从 1 起）。"
      },
      {
        "key": "showDelta",
        "label": "变化量标注",
        "type": "toggle",
        "default": true,
        "desc": "顶部的大号环比变化量（箭头 + 百分比）。"
      },
      {
        "key": "showCompare",
        "label": "前后对比",
        "type": "toggle",
        "default": true,
        "desc": "变化量右侧的前 / 后两段对比柱。"
      },
      {
        "key": "showArrow",
        "label": "趋势箭头",
        "type": "toggle",
        "default": true,
        "desc": "变化量左侧的趋势方向箭头。"
      },
      {
        "key": "metricCount",
        "label": "指标行数",
        "type": "slider",
        "default": 4,
        "min": 2,
        "max": 4,
        "step": 1,
        "desc": "左侧主体卡的指标行数量。"
      },
      {
        "key": "showSwatches",
        "label": "色谱色卡",
        "type": "toggle",
        "default": true,
        "desc": "左下角的装饰性色谱色卡。"
      },
      {
        "key": "accentColor",
        "label": "强调色",
        "type": "color",
        "default": "#e2742c",
        "options": [
          "#d8402e",
          "#e2742c",
          "#efbe2e",
          "#3c9a52",
          "#4da0c6",
          "#2c44a0",
          "#7a3c90"
        ],
        "desc": "主体字形 / 变化量 / 重点标注的强调色。"
      },
      {
        "key": "showConclusion",
        "label": "结论文案",
        "type": "toggle",
        "default": true,
        "desc": "面板下方的一句装饰性结论。"
      },
      {
        "key": "showSheetLabel",
        "label": "页码标签",
        "type": "toggle",
        "default": true,
        "desc": "右上角的页码 / 章节标签。"
      }
    ],
    "defaultProps": {
      "rowCount": 3,
      "focusEnabled": true,
      "focusIndex": 2,
      "showDelta": true,
      "showCompare": true,
      "showArrow": true,
      "metricCount": 4,
      "showSwatches": true,
      "accentColor": "#e2742c",
      "showConclusion": true,
      "showSheetLabel": true
    }
  },
  {
    "key": "theme05_page023",
    "themeKey": "theme05",
    "pageNumber": 23,
    "layout": "THEME05-023",
    "slot": "peak",
    "label": "峰值图文 Peak",
    "bgClass": "",
    "controls": [
      {
        "key": "chartType",
        "label": "图表类型",
        "type": "radio",
        "default": "area",
        "options": [
          {
            "value": "area",
            "label": "面积"
          },
          {
            "value": "bar",
            "label": "柱状"
          },
          {
            "value": "line",
            "label": "折线"
          }
        ],
        "desc": "峰值证据图表的呈现方式：面积 / 柱状 / 折线。"
      },
      {
        "key": "pointCount",
        "label": "数据点数量",
        "type": "slider",
        "default": 3,
        "min": 2,
        "max": 3,
        "step": 1,
        "desc": "图表展示的数据点（时间截面）数量。"
      },
      {
        "key": "focusEnabled",
        "label": "峰值标记",
        "type": "toggle",
        "default": true,
        "desc": "是否标记峰值数据点（关闭时自动取最大值）。"
      },
      {
        "key": "focusIndex",
        "label": "峰值数据点",
        "type": "slider",
        "default": 2,
        "min": 1,
        "max": 3,
        "step": 1,
        "desc": "被标记为峰值的数据点序号（从 1 起）。"
      },
      {
        "key": "imageCount",
        "label": "图片槽数量",
        "type": "slider",
        "default": 1,
        "min": 0,
        "max": 3,
        "step": 1,
        "desc": "面板下方图片槽数量（0–3）；按各图比例自适应排布，构图自动均衡。"
      },
      {
        "key": "showPeakBadge",
        "label": "峰值徽标",
        "type": "toggle",
        "default": true,
        "desc": "面板右上角的峰值徽标（关闭时显示单位说明）。"
      },
      {
        "key": "showGalleryCaption",
        "label": "图注",
        "type": "toggle",
        "default": true,
        "desc": "图片区上方的装饰性图注。"
      },
      {
        "key": "metricCount",
        "label": "指标行数",
        "type": "slider",
        "default": 4,
        "min": 2,
        "max": 4,
        "step": 1,
        "desc": "左侧主体卡的指标行数量。"
      },
      {
        "key": "showSwatches",
        "label": "色谱色卡",
        "type": "toggle",
        "default": true,
        "desc": "左下角的装饰性色谱色卡。"
      },
      {
        "key": "accentColor",
        "label": "强调色",
        "type": "color",
        "default": "#d8402e",
        "options": [
          "#d8402e",
          "#e2742c",
          "#efbe2e",
          "#3c9a52",
          "#4da0c6",
          "#2c44a0",
          "#7a3c90"
        ],
        "desc": "主体字形 / 峰值标记 / 眉标的强调色。"
      },
      {
        "key": "showConclusion",
        "label": "结论文案",
        "type": "toggle",
        "default": true,
        "desc": "面板下方的一句装饰性结论。"
      },
      {
        "key": "showSheetLabel",
        "label": "页码标签",
        "type": "toggle",
        "default": true,
        "desc": "右上角的页码 / 章节标签。"
      }
    ],
    "defaultProps": {
      "chartType": "area",
      "pointCount": 3,
      "focusEnabled": true,
      "focusIndex": 2,
      "imageCount": 1,
      "showPeakBadge": true,
      "showGalleryCaption": true,
      "metricCount": 4,
      "showSwatches": true,
      "accentColor": "#d8402e",
      "showConclusion": true,
      "showSheetLabel": true
    }
  },
  {
    "key": "theme05_page024",
    "themeKey": "theme05",
    "pageNumber": 24,
    "layout": "THEME05-024",
    "slot": "curve",
    "label": "走势曲线 Curve",
    "bgClass": "",
    "controls": [
      {
        "key": "chartType",
        "label": "曲线类型",
        "type": "radio",
        "default": "area",
        "options": [
          {
            "value": "area",
            "label": "面积"
          },
          {
            "value": "line",
            "label": "折线"
          }
        ],
        "desc": "走势曲线的呈现方式：面积 / 折线。"
      },
      {
        "key": "scope",
        "label": "数据范围",
        "type": "radio",
        "default": "year",
        "options": [
          {
            "value": "year",
            "label": "全程"
          },
          {
            "value": "month",
            "label": "本段"
          }
        ],
        "desc": "曲线绘制全程（各分段）还是仅当前子周期。"
      },
      {
        "key": "focusEnabled",
        "label": "重点标注",
        "type": "toggle",
        "default": true,
        "desc": "是否突出某一个数据点（终点 / 关键截面）。"
      },
      {
        "key": "focusIndex",
        "label": "重点数据点",
        "type": "slider",
        "default": 4,
        "min": 1,
        "max": 4,
        "step": 1,
        "desc": "被突出的数据点序号（从 1 起；超出范围自动收敛到末点）。"
      },
      {
        "key": "showBaseline",
        "label": "基准参考线",
        "type": "toggle",
        "default": true,
        "desc": "起点水平的虚线参考线，用于对比当前是否仍高于起点。"
      },
      {
        "key": "showDeltaBadge",
        "label": "变化量标注",
        "type": "toggle",
        "default": true,
        "desc": "面板右上角的变化量徽标（关闭时显示单位说明）。"
      },
      {
        "key": "metricCount",
        "label": "指标行数",
        "type": "slider",
        "default": 4,
        "min": 2,
        "max": 4,
        "step": 1,
        "desc": "左侧主体卡的指标行数量。"
      },
      {
        "key": "showSwatches",
        "label": "色谱色卡",
        "type": "toggle",
        "default": true,
        "desc": "左下角的装饰性色谱色卡。"
      },
      {
        "key": "accentColor",
        "label": "强调色",
        "type": "color",
        "default": "#4da0c6",
        "options": [
          "#d8402e",
          "#e2742c",
          "#efbe2e",
          "#3c9a52",
          "#4da0c6",
          "#2c44a0",
          "#7a3c90"
        ],
        "desc": "主体字形 / 曲线 / 重点标注的强调色。"
      },
      {
        "key": "showConclusion",
        "label": "结论文案",
        "type": "toggle",
        "default": true,
        "desc": "面板下方的一句装饰性结论。"
      },
      {
        "key": "showSheetLabel",
        "label": "页码标签",
        "type": "toggle",
        "default": true,
        "desc": "右上角的页码 / 章节标签。"
      }
    ],
    "defaultProps": {
      "chartType": "area",
      "scope": "year",
      "focusEnabled": true,
      "focusIndex": 4,
      "showBaseline": true,
      "showDeltaBadge": true,
      "metricCount": 4,
      "showSwatches": true,
      "accentColor": "#4da0c6",
      "showConclusion": true,
      "showSheetLabel": true
    }
  },
  {
    "key": "theme05_page025",
    "themeKey": "theme05",
    "pageNumber": 25,
    "layout": "THEME05-025",
    "slot": "peaktrough",
    "label": "峰谷 Peak/Trough",
    "bgClass": "",
    "controls": [
      {
        "key": "pointCount",
        "label": "数据点数量",
        "type": "slider",
        "default": 5,
        "min": 3,
        "max": 5,
        "step": 1,
        "desc": "参与峰谷对比的柱子（数据点）数量。"
      },
      {
        "key": "highBandCount",
        "label": "高位数量",
        "type": "slider",
        "default": 3,
        "min": 1,
        "max": 4,
        "step": 1,
        "desc": "归入“高位”色组的前 N 个数据点，其余归入“低位”（自动不超过总数-1）。"
      },
      {
        "key": "focusEnabled",
        "label": "重点标注",
        "type": "toggle",
        "default": true,
        "desc": "是否突出某一个数据点（极值 / 关键截面）。"
      },
      {
        "key": "focusIndex",
        "label": "重点数据点",
        "type": "slider",
        "default": 1,
        "min": 1,
        "max": 5,
        "step": 1,
        "desc": "被突出的数据点序号（从 1 起，按数值由高到低排列）。"
      },
      {
        "key": "showBaseline",
        "label": "均值参考线",
        "type": "toggle",
        "default": true,
        "desc": "叠加一条数据均值的水平虚线参考线。"
      },
      {
        "key": "showValue",
        "label": "数值显示",
        "type": "toggle",
        "default": true,
        "desc": "柱顶显示数值。"
      },
      {
        "key": "showMetrics",
        "label": "指标列表",
        "type": "toggle",
        "default": true,
        "desc": "右侧带高位 / 低位标签的逐项列表。"
      },
      {
        "key": "highColor",
        "label": "高位色",
        "type": "color",
        "default": "#d8402e",
        "options": [
          "#d8402e",
          "#e2742c",
          "#efbe2e",
          "#3c9a52",
          "#4da0c6",
          "#2c44a0",
          "#7a3c90"
        ],
        "desc": "高位色组的柱体颜色。"
      },
      {
        "key": "lowColor",
        "label": "低位色",
        "type": "color",
        "default": "#4da0c6",
        "options": [
          "#d8402e",
          "#e2742c",
          "#efbe2e",
          "#3c9a52",
          "#4da0c6",
          "#2c44a0",
          "#7a3c90"
        ],
        "desc": "低位色组的柱体颜色。"
      },
      {
        "key": "accentColor",
        "label": "强调色",
        "type": "color",
        "default": "#d8402e",
        "options": [
          "#d8402e",
          "#e2742c",
          "#efbe2e",
          "#3c9a52",
          "#4da0c6",
          "#2c44a0",
          "#7a3c90"
        ],
        "desc": "眉标与重点标注的强调色。"
      },
      {
        "key": "showConclusion",
        "label": "结论文案",
        "type": "toggle",
        "default": true,
        "desc": "右下角的一句装饰性结论。"
      },
      {
        "key": "showSheetLabel",
        "label": "页码标签",
        "type": "toggle",
        "default": true,
        "desc": "右上角的页码 / 章节标签。"
      }
    ],
    "defaultProps": {
      "pointCount": 5,
      "highBandCount": 3,
      "focusEnabled": true,
      "focusIndex": 1,
      "showBaseline": true,
      "showValue": true,
      "showMetrics": true,
      "highColor": "#d8402e",
      "lowColor": "#4da0c6",
      "accentColor": "#d8402e",
      "showConclusion": true,
      "showSheetLabel": true
    }
  },
  {
    "key": "theme05_page026",
    "themeKey": "theme05",
    "pageNumber": 26,
    "layout": "THEME05-026",
    "slot": "waterfall",
    "label": "瀑布 Waterfall",
    "bgClass": "",
    "controls": [
      {
        "key": "stepCount",
        "label": "分段数量",
        "type": "slider",
        "default": 5,
        "min": 3,
        "max": 5,
        "step": 1,
        "desc": "参与累计贡献的分段（瀑布台阶）数量。"
      },
      {
        "key": "showTotal",
        "label": "合计列",
        "type": "toggle",
        "default": true,
        "desc": "末尾的累计合计柱与图例合计行。"
      },
      {
        "key": "showConnectors",
        "label": "连接线",
        "type": "toggle",
        "default": true,
        "desc": "相邻台阶之间的累计水平虚线连接线。"
      },
      {
        "key": "focusEnabled",
        "label": "重点分段",
        "type": "toggle",
        "default": true,
        "desc": "是否突出某一个分段（贡献台阶）。"
      },
      {
        "key": "focusIndex",
        "label": "重点分段序号",
        "type": "slider",
        "default": 1,
        "min": 1,
        "max": 5,
        "step": 1,
        "desc": "被突出的分段序号（从 1 起）。"
      },
      {
        "key": "showValue",
        "label": "数值显示",
        "type": "toggle",
        "default": true,
        "desc": "柱顶显示数值。"
      },
      {
        "key": "colorMode",
        "label": "配色方式",
        "type": "radio",
        "default": "category",
        "options": [
          {
            "value": "category",
            "label": "按类别"
          },
          {
            "value": "accent",
            "label": "强调色"
          },
          {
            "value": "mono",
            "label": "单色"
          }
        ],
        "desc": "台阶配色：按类别 / 统一强调色 / 单色。"
      },
      {
        "key": "showLegend",
        "label": "图例列表",
        "type": "toggle",
        "default": true,
        "desc": "右侧带数值与占比的明细列表。"
      },
      {
        "key": "accentColor",
        "label": "强调色",
        "type": "color",
        "default": "#d8402e",
        "options": [
          "#d8402e",
          "#e2742c",
          "#efbe2e",
          "#3c9a52",
          "#4da0c6",
          "#2c44a0",
          "#7a3c90"
        ],
        "desc": "眉标与重点项的强调色（强调色配色下也用于台阶）。"
      },
      {
        "key": "showConclusion",
        "label": "结论文案",
        "type": "toggle",
        "default": true,
        "desc": "右下角的一句装饰性结论。"
      },
      {
        "key": "showSheetLabel",
        "label": "页码标签",
        "type": "toggle",
        "default": true,
        "desc": "右上角的页码 / 章节标签。"
      }
    ],
    "defaultProps": {
      "stepCount": 5,
      "showTotal": true,
      "showConnectors": true,
      "focusEnabled": true,
      "focusIndex": 1,
      "showValue": true,
      "colorMode": "category",
      "showLegend": true,
      "accentColor": "#d8402e",
      "showConclusion": true,
      "showSheetLabel": true
    }
  },
  {
    "key": "theme05_page027",
    "themeKey": "theme05",
    "pageNumber": 27,
    "layout": "THEME05-027",
    "slot": "stacked",
    "label": "双维堆叠 Split",
    "bgClass": "",
    "controls": [
      {
        "key": "segmentCount",
        "label": "分段数量",
        "type": "slider",
        "default": 4,
        "min": 2,
        "max": 4,
        "step": 1,
        "desc": "参与拆分的分段（金额区间）数量。"
      },
      {
        "key": "showSecondDimension",
        "label": "第二维度",
        "type": "toggle",
        "default": true,
        "desc": "是否显示第二条维度堆叠条（关闭则仅显示第一维度）。"
      },
      {
        "key": "focusEnabled",
        "label": "重点分段",
        "type": "toggle",
        "default": true,
        "desc": "是否突出某一个分段（其余分段淡出）。"
      },
      {
        "key": "focusIndex",
        "label": "重点分段序号",
        "type": "slider",
        "default": 4,
        "min": 1,
        "max": 4,
        "step": 1,
        "desc": "被突出的分段序号（从 1 起）。"
      },
      {
        "key": "showValue",
        "label": "数值显示",
        "type": "toggle",
        "default": true,
        "desc": "在足够宽的色块内显示数值与占比。"
      },
      {
        "key": "showLegend",
        "label": "图例列表",
        "type": "toggle",
        "default": true,
        "desc": "右侧带两个维度数值的明细列表。"
      },
      {
        "key": "accentColor",
        "label": "强调色",
        "type": "color",
        "default": "#d8402e",
        "options": [
          "#d8402e",
          "#e2742c",
          "#efbe2e",
          "#3c9a52",
          "#4da0c6",
          "#2c44a0",
          "#7a3c90"
        ],
        "desc": "眉标的强调色。"
      },
      {
        "key": "showConclusion",
        "label": "结论文案",
        "type": "toggle",
        "default": true,
        "desc": "右下角的一句装饰性结论。"
      },
      {
        "key": "showSheetLabel",
        "label": "页码标签",
        "type": "toggle",
        "default": true,
        "desc": "右上角的页码 / 章节标签。"
      }
    ],
    "defaultProps": {
      "segmentCount": 4,
      "showSecondDimension": true,
      "focusEnabled": true,
      "focusIndex": 4,
      "showValue": true,
      "showLegend": true,
      "accentColor": "#d8402e",
      "showConclusion": true,
      "showSheetLabel": true
    }
  },
  {
    "key": "theme05_page028",
    "themeKey": "theme05",
    "pageNumber": 28,
    "layout": "THEME05-028",
    "slot": "bignumber",
    "label": "大数字 Big Number",
    "bgClass": "",
    "controls": [
      {
        "key": "auxCount",
        "label": "辅助指标数量",
        "type": "slider",
        "default": 3,
        "min": 0,
        "max": 3,
        "step": 1,
        "desc": "底部支撑指标的数量（0 隐藏整行）。"
      },
      {
        "key": "numberAlign",
        "label": "主数字对齐",
        "type": "radio",
        "default": "left",
        "options": [
          {
            "value": "left",
            "label": "左对齐"
          },
          {
            "value": "center",
            "label": "居中"
          }
        ],
        "desc": "主数字与说明文字的对齐方式。"
      },
      {
        "key": "showUnit",
        "label": "单位显示",
        "type": "toggle",
        "default": true,
        "desc": "主数字后的单位后缀。"
      },
      {
        "key": "showCaption",
        "label": "解释说明",
        "type": "toggle",
        "default": true,
        "desc": "主数字下方的一句解释说明。"
      },
      {
        "key": "showMessage",
        "label": "支撑文案",
        "type": "toggle",
        "default": true,
        "desc": "解释下方的一句支撑性文案。"
      },
      {
        "key": "accentColor",
        "label": "强调色",
        "type": "color",
        "default": "#2c44a0",
        "options": [
          "#d8402e",
          "#e2742c",
          "#efbe2e",
          "#3c9a52",
          "#4da0c6",
          "#2c44a0",
          "#7a3c90"
        ],
        "desc": "主数字与眉标的强调色。"
      },
      {
        "key": "showWordmark",
        "label": "品牌标识",
        "type": "toggle",
        "default": true,
        "desc": "左下角的品牌标识。"
      },
      {
        "key": "showColorBand",
        "label": "色谱条",
        "type": "toggle",
        "default": true,
        "desc": "右下角的装饰色谱条。"
      },
      {
        "key": "showSheetLabel",
        "label": "页码标签",
        "type": "toggle",
        "default": true,
        "desc": "右上角的页码 / 章节标签。"
      }
    ],
    "defaultProps": {
      "auxCount": 3,
      "numberAlign": "left",
      "showUnit": true,
      "showCaption": true,
      "showMessage": true,
      "accentColor": "#2c44a0",
      "showWordmark": true,
      "showColorBand": true,
      "showSheetLabel": true
    }
  },
  {
    "key": "theme05_page029",
    "themeKey": "theme05",
    "pageNumber": 29,
    "layout": "THEME05-029",
    "slot": "cumulative",
    "label": "累计曲线 Cumulative",
    "bgClass": "",
    "controls": [
      {
        "key": "chartType",
        "label": "曲线类型",
        "type": "radio",
        "default": "area",
        "options": [
          {
            "value": "area",
            "label": "面积"
          },
          {
            "value": "line",
            "label": "折线"
          }
        ],
        "desc": "累计曲线呈现方式：面积 / 折线。"
      },
      {
        "key": "nodeCount",
        "label": "节点数量",
        "type": "slider",
        "default": 4,
        "min": 2,
        "max": 4,
        "step": 1,
        "desc": "累计曲线的分位节点（Top-N 档位）数量。"
      },
      {
        "key": "focusEnabled",
        "label": "重点节点",
        "type": "toggle",
        "default": true,
        "desc": "是否突出某一个分位节点。"
      },
      {
        "key": "focusIndex",
        "label": "重点节点序号",
        "type": "slider",
        "default": 4,
        "min": 1,
        "max": 4,
        "step": 1,
        "desc": "被突出的节点序号（从 1 起）。"
      },
      {
        "key": "showStageLabels",
        "label": "阶段占比标签",
        "type": "toggle",
        "default": true,
        "desc": "各节点上方的累计占比标签。"
      },
      {
        "key": "showMetrics",
        "label": "指标列表",
        "type": "toggle",
        "default": true,
        "desc": "右侧带累计值与边际增量的列表。"
      },
      {
        "key": "accentColor",
        "label": "强调色",
        "type": "color",
        "default": "#7a3c90",
        "options": [
          "#d8402e",
          "#e2742c",
          "#efbe2e",
          "#3c9a52",
          "#4da0c6",
          "#2c44a0",
          "#7a3c90"
        ],
        "desc": "重点标注与眉标的强调色。"
      },
      {
        "key": "showConclusion",
        "label": "结论文案",
        "type": "toggle",
        "default": true,
        "desc": "右下角的一句装饰性结论。"
      },
      {
        "key": "showSheetLabel",
        "label": "页码标签",
        "type": "toggle",
        "default": true,
        "desc": "右上角的页码 / 章节标签。"
      }
    ],
    "defaultProps": {
      "chartType": "area",
      "nodeCount": 4,
      "focusEnabled": true,
      "focusIndex": 4,
      "showStageLabels": true,
      "showMetrics": true,
      "accentColor": "#7a3c90",
      "showConclusion": true,
      "showSheetLabel": true
    }
  },
  {
    "key": "theme05_page030",
    "themeKey": "theme05",
    "pageNumber": 30,
    "layout": "THEME05-030",
    "slot": "chapter3",
    "label": "章节 Chapter 03",
    "bgClass": "",
    "controls": [
      {
        "key": "theme",
        "label": "背景主题",
        "type": "radio",
        "default": "color",
        "options": [
          {
            "value": "dark",
            "label": "深色"
          },
          {
            "value": "paper",
            "label": "纸色"
          },
          {
            "value": "color",
            "label": "色块"
          }
        ],
        "desc": "章节页背景：深色 / 纸色 / 整页色块。"
      },
      {
        "key": "bgColor",
        "label": "色块背景",
        "type": "color",
        "default": "#d8402e",
        "options": [
          "#d8402e",
          "#e2742c",
          "#efbe2e",
          "#3c9a52",
          "#4da0c6",
          "#2c44a0",
          "#7a3c90"
        ],
        "desc": "「色块」主题下的整页背景色。"
      },
      {
        "key": "showBigNumber",
        "label": "大号章节号",
        "type": "toggle",
        "default": true,
        "desc": "右侧的超大章节编号。"
      },
      {
        "key": "keywordCount",
        "label": "关键词数量",
        "type": "slider",
        "default": 4,
        "min": 0,
        "max": 4,
        "step": 1,
        "desc": "底部关键词标签数量（0 隐藏）。"
      },
      {
        "key": "accentColor",
        "label": "强调色",
        "type": "color",
        "default": "#d8402e",
        "options": [
          "#d8402e",
          "#e2742c",
          "#efbe2e",
          "#3c9a52",
          "#4da0c6",
          "#2c44a0",
          "#7a3c90"
        ],
        "desc": "眉标与章节编号的强调色（色块主题除外）。"
      },
      {
        "key": "showColorBand",
        "label": "色谱条",
        "type": "toggle",
        "default": true,
        "desc": "底部的色谱条带。"
      },
      {
        "key": "showWordmark",
        "label": "品牌标识",
        "type": "toggle",
        "default": true,
        "desc": "左上角的品牌标识。"
      },
      {
        "key": "showSheetLabel",
        "label": "页码标签",
        "type": "toggle",
        "default": true,
        "desc": "右上角的章节 / 页码标签。"
      }
    ],
    "defaultProps": {
      "theme": "color",
      "bgColor": "#d8402e",
      "showBigNumber": true,
      "keywordCount": 4,
      "accentColor": "#d8402e",
      "showColorBand": true,
      "showWordmark": true,
      "showSheetLabel": true
    }
  },
  {
    "key": "theme05_page031",
    "themeKey": "theme05",
    "pageNumber": 31,
    "layout": "THEME05-031",
    "slot": "radar",
    "label": "雷达 Radar",
    "bgClass": "",
    "controls": [
      {
        "key": "axisCount",
        "label": "维度数量",
        "type": "slider",
        "default": 4,
        "min": 3,
        "max": 4,
        "step": 1,
        "desc": "雷达图的能力维度（轴）数量（雷达至少 3 维）。"
      },
      {
        "key": "fillShape",
        "label": "填充形态",
        "type": "toggle",
        "default": true,
        "desc": "数据多边形填充（开）或仅描边（关）。"
      },
      {
        "key": "showGrid",
        "label": "网格刻度",
        "type": "toggle",
        "default": true,
        "desc": "同心环刻度与放射轴线。"
      },
      {
        "key": "showLabels",
        "label": "维度标签",
        "type": "toggle",
        "default": true,
        "desc": "各轴外侧的维度名称与数值标签。"
      },
      {
        "key": "focusEnabled",
        "label": "重点维度",
        "type": "toggle",
        "default": true,
        "desc": "是否突出某一个维度。"
      },
      {
        "key": "focusIndex",
        "label": "重点维度序号",
        "type": "slider",
        "default": 1,
        "min": 1,
        "max": 4,
        "step": 1,
        "desc": "被突出的维度序号（从 1 起）。"
      },
      {
        "key": "showMetrics",
        "label": "指标列表",
        "type": "toggle",
        "default": true,
        "desc": "右侧的逐维数值列表。"
      },
      {
        "key": "accentColor",
        "label": "强调色",
        "type": "color",
        "default": "#3c9a52",
        "options": [
          "#d8402e",
          "#e2742c",
          "#efbe2e",
          "#3c9a52",
          "#4da0c6",
          "#2c44a0",
          "#7a3c90"
        ],
        "desc": "数据多边形与重点 / 眉标的强调色。"
      },
      {
        "key": "showConclusion",
        "label": "结论文案",
        "type": "toggle",
        "default": true,
        "desc": "右下角的一句装饰性结论。"
      },
      {
        "key": "showSheetLabel",
        "label": "页码标签",
        "type": "toggle",
        "default": true,
        "desc": "右上角的页码 / 章节标签。"
      }
    ],
    "defaultProps": {
      "axisCount": 4,
      "fillShape": true,
      "showGrid": true,
      "showLabels": true,
      "focusEnabled": true,
      "focusIndex": 1,
      "showMetrics": true,
      "accentColor": "#3c9a52",
      "showConclusion": true,
      "showSheetLabel": true
    }
  },
  {
    "key": "theme05_page032",
    "themeKey": "theme05",
    "pageNumber": 32,
    "layout": "THEME05-032",
    "slot": "segment",
    "label": "赛道剖析 Segment",
    "bgClass": "",
    "controls": [
      {
        "key": "imageCount",
        "label": "图片槽数量",
        "type": "slider",
        "default": 2,
        "min": 0,
        "max": 3,
        "step": 1,
        "desc": "图片槽数量（0–3）；按各图比例自适应排布。为 0 时主体卡自动铺满整幅。"
      },
      {
        "key": "metricCount",
        "label": "指标行数",
        "type": "slider",
        "default": 4,
        "min": 2,
        "max": 4,
        "step": 1,
        "desc": "主体卡内的指标行数。"
      },
      {
        "key": "cardTheme",
        "label": "主体卡主题",
        "type": "radio",
        "default": "color",
        "options": [
          {
            "value": "color",
            "label": "色块"
          },
          {
            "value": "dark",
            "label": "深色"
          },
          {
            "value": "paper",
            "label": "纸色"
          }
        ],
        "desc": "主体卡背景：强调色块 / 深色 / 纸色。"
      },
      {
        "key": "showGalleryCaption",
        "label": "图注",
        "type": "toggle",
        "default": true,
        "desc": "图片区上方的装饰性图注。"
      },
      {
        "key": "accentColor",
        "label": "强调色",
        "type": "color",
        "default": "#2c44a0",
        "options": [
          "#d8402e",
          "#e2742c",
          "#efbe2e",
          "#3c9a52",
          "#4da0c6",
          "#2c44a0",
          "#7a3c90"
        ],
        "desc": "眉标与「色块」主题下主体卡的颜色。"
      },
      {
        "key": "showConclusion",
        "label": "结论文案",
        "type": "toggle",
        "default": true,
        "desc": "底部的一句装饰性结论。"
      },
      {
        "key": "showSheetLabel",
        "label": "页码标签",
        "type": "toggle",
        "default": true,
        "desc": "右上角的页码 / 章节标签。"
      }
    ],
    "defaultProps": {
      "imageCount": 2,
      "metricCount": 4,
      "cardTheme": "color",
      "showGalleryCaption": true,
      "accentColor": "#2c44a0",
      "showConclusion": true,
      "showSheetLabel": true
    }
  },
  {
    "key": "theme05_page033",
    "themeKey": "theme05",
    "pageNumber": 33,
    "layout": "THEME05-033",
    "slot": "spotlight",
    "label": "赛道聚焦 Spotlight",
    "bgClass": "",
    "controls": [
      {
        "key": "imageCount",
        "label": "图片槽数量",
        "type": "slider",
        "default": 1,
        "min": 0,
        "max": 2,
        "step": 1,
        "desc": "主视觉图片槽数量（0–2）；按比例自适应。为 0 时文本卡铺满整幅、指标转两列。"
      },
      {
        "key": "imageSide",
        "label": "图片位置",
        "type": "radio",
        "default": "right",
        "options": [
          {
            "value": "right",
            "label": "右侧"
          },
          {
            "value": "left",
            "label": "左侧"
          }
        ],
        "desc": "图片相对文本卡的位置（仅在有图片时生效）。"
      },
      {
        "key": "metricCount",
        "label": "指标行数",
        "type": "slider",
        "default": 4,
        "min": 2,
        "max": 4,
        "step": 1,
        "desc": "文本卡内的指标行数。"
      },
      {
        "key": "cardTheme",
        "label": "文本卡主题",
        "type": "radio",
        "default": "color",
        "options": [
          {
            "value": "color",
            "label": "色块"
          },
          {
            "value": "dark",
            "label": "深色"
          },
          {
            "value": "paper",
            "label": "纸色"
          }
        ],
        "desc": "文本卡背景：强调色块 / 深色 / 纸色。"
      },
      {
        "key": "focusEnabled",
        "label": "重点指标",
        "type": "toggle",
        "default": false,
        "desc": "是否突出某一条指标。"
      },
      {
        "key": "focusIndex",
        "label": "重点指标序号",
        "type": "slider",
        "default": 1,
        "min": 1,
        "max": 4,
        "step": 1,
        "desc": "被突出的指标序号（从 1 起）。"
      },
      {
        "key": "showLead",
        "label": "引导文案",
        "type": "toggle",
        "default": true,
        "desc": "标题下方的一段引导说明。"
      },
      {
        "key": "showMediaCaption",
        "label": "图注",
        "type": "toggle",
        "default": true,
        "desc": "图片区上方的装饰性图注。"
      },
      {
        "key": "accentColor",
        "label": "强调色",
        "type": "color",
        "default": "#efbe2e",
        "options": [
          "#d8402e",
          "#e2742c",
          "#efbe2e",
          "#3c9a52",
          "#4da0c6",
          "#2c44a0",
          "#7a3c90"
        ],
        "desc": "眉标与「色块」主题下文本卡的颜色。"
      },
      {
        "key": "showConclusion",
        "label": "结论文案",
        "type": "toggle",
        "default": true,
        "desc": "底部的一句装饰性结论。"
      },
      {
        "key": "showSheetLabel",
        "label": "页码标签",
        "type": "toggle",
        "default": true,
        "desc": "右上角的页码 / 章节标签。"
      }
    ],
    "defaultProps": {
      "imageCount": 1,
      "imageSide": "right",
      "metricCount": 4,
      "cardTheme": "color",
      "focusEnabled": false,
      "focusIndex": 1,
      "showLead": true,
      "showMediaCaption": true,
      "accentColor": "#efbe2e",
      "showConclusion": true,
      "showSheetLabel": true
    }
  },
  {
    "key": "theme05_page034",
    "themeKey": "theme05",
    "pageNumber": 34,
    "layout": "THEME05-034",
    "slot": "matrix",
    "label": "对照表 Matrix",
    "bgClass": "",
    "controls": [
      {
        "key": "rowCount",
        "label": "数据行数",
        "type": "slider",
        "default": 4,
        "min": 2,
        "max": 4,
        "step": 1,
        "desc": "表格的数据行数量。"
      },
      {
        "key": "showVerdict",
        "label": "判断列",
        "type": "toggle",
        "default": true,
        "desc": "是否显示末尾的「判断」标签列（关闭则为三列表）。"
      },
      {
        "key": "zebra",
        "label": "斑马纹",
        "type": "toggle",
        "default": false,
        "desc": "隔行底色，便于横向读取。"
      },
      {
        "key": "focusEnabled",
        "label": "重点行",
        "type": "toggle",
        "default": true,
        "desc": "是否突出某一行。"
      },
      {
        "key": "focusIndex",
        "label": "重点行序号",
        "type": "slider",
        "default": 1,
        "min": 1,
        "max": 4,
        "step": 1,
        "desc": "被突出的行序号（从 1 起）。"
      },
      {
        "key": "showIntro",
        "label": "引导栏",
        "type": "toggle",
        "default": true,
        "desc": "表格上方的引导文案与维度说明。"
      },
      {
        "key": "accentColor",
        "label": "强调色",
        "type": "color",
        "default": "#2c44a0",
        "options": [
          "#d8402e",
          "#e2742c",
          "#efbe2e",
          "#3c9a52",
          "#4da0c6",
          "#2c44a0",
          "#7a3c90"
        ],
        "desc": "眉标与重点行的强调色。"
      },
      {
        "key": "showConclusion",
        "label": "结论文案",
        "type": "toggle",
        "default": true,
        "desc": "表格下方的一句装饰性结论。"
      },
      {
        "key": "showSheetLabel",
        "label": "页码标签",
        "type": "toggle",
        "default": true,
        "desc": "右上角的页码 / 章节标签。"
      }
    ],
    "defaultProps": {
      "rowCount": 4,
      "showVerdict": true,
      "zebra": false,
      "focusEnabled": true,
      "focusIndex": 1,
      "showIntro": true,
      "accentColor": "#2c44a0",
      "showConclusion": true,
      "showSheetLabel": true
    }
  },
  {
    "key": "theme05_page035",
    "themeKey": "theme05",
    "pageNumber": 35,
    "layout": "THEME05-035",
    "slot": "breakdown",
    "label": "子项拆分 Breakdown",
    "bgClass": "",
    "controls": [
      {
        "key": "itemCount",
        "label": "子项数量",
        "type": "slider",
        "default": 3,
        "min": 2,
        "max": 3,
        "step": 1,
        "desc": "子项拆分的横条数量。"
      },
      {
        "key": "imageCount",
        "label": "图片槽数量",
        "type": "slider",
        "default": 0,
        "min": 0,
        "max": 3,
        "step": 1,
        "desc": "底部图片槽数量（0–3），按比例自适应；为 0 时隐藏整条图片带。"
      },
      {
        "key": "sortDescending",
        "label": "按值降序",
        "type": "toggle",
        "default": true,
        "desc": "横条是否按数值由大到小排序。"
      },
      {
        "key": "focusEnabled",
        "label": "重点子项",
        "type": "toggle",
        "default": true,
        "desc": "是否突出某一个子项。"
      },
      {
        "key": "focusIndex",
        "label": "重点子项序号",
        "type": "slider",
        "default": 1,
        "min": 1,
        "max": 3,
        "step": 1,
        "desc": "被突出的子项序号（按原始顺序，从 1 起）。"
      },
      {
        "key": "colorMode",
        "label": "配色方式",
        "type": "radio",
        "default": "category",
        "options": [
          {
            "value": "category",
            "label": "按类别"
          },
          {
            "value": "accent",
            "label": "强调色"
          },
          {
            "value": "mono",
            "label": "单色"
          }
        ],
        "desc": "横条配色：按类别 / 统一强调色 / 单色。"
      },
      {
        "key": "cardTheme",
        "label": "主体卡主题",
        "type": "radio",
        "default": "color",
        "options": [
          {
            "value": "color",
            "label": "色块"
          },
          {
            "value": "dark",
            "label": "深色"
          },
          {
            "value": "paper",
            "label": "纸色"
          }
        ],
        "desc": "主体卡背景：强调色块 / 深色 / 纸色。"
      },
      {
        "key": "showTotal",
        "label": "合计区",
        "type": "toggle",
        "default": true,
        "desc": "主体卡底部的赛道合计数值。"
      },
      {
        "key": "accentColor",
        "label": "强调色",
        "type": "color",
        "default": "#2c44a0",
        "options": [
          "#d8402e",
          "#e2742c",
          "#efbe2e",
          "#3c9a52",
          "#4da0c6",
          "#2c44a0",
          "#7a3c90"
        ],
        "desc": "眉标 /「色块」主题主体卡 / 重点项的强调色。"
      },
      {
        "key": "showConclusion",
        "label": "结论文案",
        "type": "toggle",
        "default": true,
        "desc": "底部的一句装饰性结论。"
      },
      {
        "key": "showSheetLabel",
        "label": "页码标签",
        "type": "toggle",
        "default": true,
        "desc": "右上角的页码 / 章节标签。"
      }
    ],
    "defaultProps": {
      "itemCount": 3,
      "imageCount": 0,
      "sortDescending": true,
      "focusEnabled": true,
      "focusIndex": 1,
      "colorMode": "category",
      "cardTheme": "color",
      "showTotal": true,
      "accentColor": "#2c44a0",
      "showConclusion": true,
      "showSheetLabel": true
    }
  },
  {
    "key": "theme05_page036",
    "themeKey": "theme05",
    "pageNumber": 36,
    "layout": "THEME05-036",
    "slot": "scene",
    "label": "场景占比 Scene",
    "bgClass": "",
    "controls": [
      {
        "key": "chartType",
        "label": "图表类型",
        "type": "radio",
        "default": "donut",
        "options": [
          {
            "value": "donut",
            "label": "环形"
          },
          {
            "value": "pie",
            "label": "饼图"
          }
        ],
        "desc": "占比图呈现方式：环形（中心显示重点）/ 饼图。"
      },
      {
        "key": "sceneCount",
        "label": "场景数量",
        "type": "slider",
        "default": 4,
        "min": 2,
        "max": 4,
        "step": 1,
        "desc": "参与占比拆分的场景数量。"
      },
      {
        "key": "imageCount",
        "label": "图片槽数量",
        "type": "slider",
        "default": 0,
        "min": 0,
        "max": 1,
        "step": 1,
        "desc": "环图下方的图片槽（0–1），按比例自适应；为 0 时隐藏。"
      },
      {
        "key": "focusEnabled",
        "label": "重点场景",
        "type": "toggle",
        "default": true,
        "desc": "是否突出某一个场景（环形中心显示该项）。"
      },
      {
        "key": "focusIndex",
        "label": "重点场景序号",
        "type": "slider",
        "default": 1,
        "min": 1,
        "max": 4,
        "step": 1,
        "desc": "被突出的场景序号（从 1 起）。"
      },
      {
        "key": "showLegend",
        "label": "图例列表",
        "type": "toggle",
        "default": true,
        "desc": "右侧带占比的场景图例。"
      },
      {
        "key": "accentColor",
        "label": "强调色",
        "type": "color",
        "default": "#2c44a0",
        "options": [
          "#d8402e",
          "#e2742c",
          "#efbe2e",
          "#3c9a52",
          "#4da0c6",
          "#2c44a0",
          "#7a3c90"
        ],
        "desc": "眉标与环形中心数字的强调色。"
      },
      {
        "key": "showConclusion",
        "label": "结论文案",
        "type": "toggle",
        "default": true,
        "desc": "右下角的一句装饰性结论。"
      },
      {
        "key": "showSheetLabel",
        "label": "页码标签",
        "type": "toggle",
        "default": true,
        "desc": "右上角的页码 / 章节标签。"
      }
    ],
    "defaultProps": {
      "chartType": "donut",
      "sceneCount": 4,
      "imageCount": 0,
      "focusEnabled": true,
      "focusIndex": 1,
      "showLegend": true,
      "accentColor": "#2c44a0",
      "showConclusion": true,
      "showSheetLabel": true
    }
  },
  {
    "key": "theme05_page037",
    "themeKey": "theme05",
    "pageNumber": 37,
    "layout": "THEME05-037",
    "slot": "statement",
    "label": "金句 Statement",
    "bgClass": "",
    "controls": [
      {
        "key": "theme",
        "label": "背景主题",
        "type": "radio",
        "default": "dark",
        "options": [
          {
            "value": "paper",
            "label": "纸色"
          },
          {
            "value": "dark",
            "label": "深色"
          },
          {
            "value": "color",
            "label": "色块"
          }
        ],
        "desc": "页面背景：纸色 / 深色 / 整页强调色块。"
      },
      {
        "key": "bgColor",
        "label": "色块背景",
        "type": "color",
        "default": "#2c44a0",
        "options": [
          "#d8402e",
          "#e2742c",
          "#efbe2e",
          "#3c9a52",
          "#4da0c6",
          "#2c44a0",
          "#7a3c90"
        ],
        "desc": "「色块」主题下的整页背景色（其它主题忽略）。"
      },
      {
        "key": "align",
        "label": "对齐方式",
        "type": "radio",
        "default": "left",
        "options": [
          {
            "value": "left",
            "label": "左对齐"
          },
          {
            "value": "center",
            "label": "居中"
          }
        ],
        "desc": "金句与辅助信息的对齐方式。"
      },
      {
        "key": "showIndex",
        "label": "装饰大号数字",
        "type": "toggle",
        "default": true,
        "desc": "背景中的超大半透明序号（装饰）。"
      },
      {
        "key": "emphasis",
        "label": "重点词高亮",
        "type": "toggle",
        "default": true,
        "desc": "是否用强调色高亮金句中的关键词。"
      },
      {
        "key": "keywordCount",
        "label": "关键词数量",
        "type": "slider",
        "default": 3,
        "min": 0,
        "max": 3,
        "step": 1,
        "desc": "底部装饰关键词标签数量（0 隐藏整行）。"
      },
      {
        "key": "showSub",
        "label": "辅助说明",
        "type": "toggle",
        "default": true,
        "desc": "金句下方的一行辅助说明文字。"
      },
      {
        "key": "accentColor",
        "label": "强调色",
        "type": "color",
        "default": "#efbe2e",
        "options": [
          "#d8402e",
          "#e2742c",
          "#efbe2e",
          "#3c9a52",
          "#4da0c6",
          "#2c44a0",
          "#7a3c90"
        ],
        "desc": "眉标 / 重点词 / 装饰数字的强调色。"
      },
      {
        "key": "showColorBand",
        "label": "色谱条",
        "type": "toggle",
        "default": true,
        "desc": "右下角的小色谱条带。"
      },
      {
        "key": "showSheetLabel",
        "label": "页码标签",
        "type": "toggle",
        "default": true,
        "desc": "右上角的页码 / 章节标签。"
      }
    ],
    "defaultProps": {
      "theme": "dark",
      "bgColor": "#2c44a0",
      "align": "left",
      "showIndex": true,
      "emphasis": true,
      "keywordCount": 3,
      "showSub": true,
      "accentColor": "#efbe2e",
      "showColorBand": true,
      "showSheetLabel": true
    }
  },
  {
    "key": "theme05_page038",
    "themeKey": "theme05",
    "pageNumber": 38,
    "layout": "THEME05-038",
    "slot": "flow",
    "label": "流程增长 Flow",
    "bgClass": "",
    "controls": [
      {
        "key": "nodeCount",
        "label": "流程节点数量",
        "type": "slider",
        "default": 4,
        "min": 3,
        "max": 5,
        "step": 1,
        "desc": "主视觉管线的阶段（节点）数量。"
      },
      {
        "key": "focusEnabled",
        "label": "重点节点",
        "type": "toggle",
        "default": true,
        "desc": "是否突出某一阶段（其余阶段淡出）。"
      },
      {
        "key": "focusIndex",
        "label": "重点节点序号",
        "type": "slider",
        "default": 4,
        "min": 1,
        "max": 5,
        "step": 1,
        "desc": "被突出的阶段序号（从 1 起；超出节点数自动收敛到末段）。"
      },
      {
        "key": "showGrowth",
        "label": "增长指标面板",
        "type": "toggle",
        "default": true,
        "desc": "右下深色面板：巨号增长数字 + 迷你图表。"
      },
      {
        "key": "chartType",
        "label": "图表类型",
        "type": "radio",
        "default": "bar",
        "options": [
          {
            "value": "bar",
            "label": "柱状"
          },
          {
            "value": "line",
            "label": "折线"
          },
          {
            "value": "area",
            "label": "面积"
          }
        ],
        "desc": "增长面板内迷你图表的呈现方式。"
      },
      {
        "key": "pointCount",
        "label": "数据点数量",
        "type": "slider",
        "default": 3,
        "min": 2,
        "max": 3,
        "step": 1,
        "desc": "增长迷你图表的数据点（时间截面）数量。"
      },
      {
        "key": "metricCount",
        "label": "指标行数",
        "type": "slider",
        "default": 3,
        "min": 2,
        "max": 3,
        "step": 1,
        "desc": "右上指标卡的指标行数。"
      },
      {
        "key": "showFlowCaption",
        "label": "管线图注",
        "type": "toggle",
        "default": true,
        "desc": "主视觉上方的装饰性图注。"
      },
      {
        "key": "accentColor",
        "label": "强调色",
        "type": "color",
        "default": "#3c9a52",
        "options": [
          "#d8402e",
          "#e2742c",
          "#efbe2e",
          "#3c9a52",
          "#4da0c6",
          "#2c44a0",
          "#7a3c90"
        ],
        "desc": "眉标 / 增长数字 / 指标卡的强调色。"
      },
      {
        "key": "showConclusion",
        "label": "结论文案",
        "type": "toggle",
        "default": true,
        "desc": "底部的一句装饰性结论。"
      },
      {
        "key": "showSheetLabel",
        "label": "页码标签",
        "type": "toggle",
        "default": true,
        "desc": "右上角的页码 / 章节标签。"
      }
    ],
    "defaultProps": {
      "nodeCount": 4,
      "focusEnabled": true,
      "focusIndex": 4,
      "showGrowth": true,
      "chartType": "bar",
      "pointCount": 3,
      "metricCount": 3,
      "showFlowCaption": true,
      "accentColor": "#3c9a52",
      "showConclusion": true,
      "showSheetLabel": true
    }
  },
  {
    "key": "theme05_page039",
    "themeKey": "theme05",
    "pageNumber": 39,
    "layout": "THEME05-039",
    "slot": "diagram",
    "label": "图示规格 Diagram",
    "bgClass": "",
    "controls": [
      {
        "key": "imageCount",
        "label": "图片槽数量",
        "type": "slider",
        "default": 1,
        "min": 0,
        "max": 2,
        "step": 1,
        "desc": "主视觉图片槽数量（0–2）；按各图比例自适应。为 0 时规格卡铺满整幅、指标转两列。"
      },
      {
        "key": "imageSide",
        "label": "图片位置",
        "type": "radio",
        "default": "left",
        "options": [
          {
            "value": "left",
            "label": "左侧"
          },
          {
            "value": "right",
            "label": "右侧"
          }
        ],
        "desc": "图片相对规格卡的位置（有图片时生效）。"
      },
      {
        "key": "metricCount",
        "label": "指标行数",
        "type": "slider",
        "default": 4,
        "min": 2,
        "max": 4,
        "step": 1,
        "desc": "规格卡内的指标行数。"
      },
      {
        "key": "cardTheme",
        "label": "规格卡主题",
        "type": "radio",
        "default": "dark",
        "options": [
          {
            "value": "color",
            "label": "色块"
          },
          {
            "value": "dark",
            "label": "深色"
          },
          {
            "value": "paper",
            "label": "纸色"
          }
        ],
        "desc": "规格卡背景：强调色块 / 深色 / 纸色。"
      },
      {
        "key": "showLead",
        "label": "引导文案",
        "type": "toggle",
        "default": true,
        "desc": "标题下方的一段引导说明。"
      },
      {
        "key": "showMediaCaption",
        "label": "图注",
        "type": "toggle",
        "default": true,
        "desc": "图片区上方的装饰性图注。"
      },
      {
        "key": "accentColor",
        "label": "强调色",
        "type": "color",
        "default": "#4da0c6",
        "options": [
          "#d8402e",
          "#e2742c",
          "#efbe2e",
          "#3c9a52",
          "#4da0c6",
          "#2c44a0",
          "#7a3c90"
        ],
        "desc": "眉标 / 卡内强调条 /「色块」主题下规格卡的颜色。"
      },
      {
        "key": "showConclusion",
        "label": "结论文案",
        "type": "toggle",
        "default": true,
        "desc": "底部的一句装饰性结论。"
      },
      {
        "key": "showSheetLabel",
        "label": "页码标签",
        "type": "toggle",
        "default": true,
        "desc": "右上角的页码 / 章节标签。"
      }
    ],
    "defaultProps": {
      "imageCount": 1,
      "imageSide": "left",
      "metricCount": 4,
      "cardTheme": "dark",
      "showLead": true,
      "showMediaCaption": true,
      "accentColor": "#4da0c6",
      "showConclusion": true,
      "showSheetLabel": true
    }
  },
  {
    "key": "theme05_page040",
    "themeKey": "theme05",
    "pageNumber": 40,
    "layout": "THEME05-040",
    "slot": "mix",
    "label": "构成占比 Mix",
    "bgClass": "",
    "controls": [
      {
        "key": "imageCount",
        "label": "图片槽数量",
        "type": "slider",
        "default": 1,
        "min": 0,
        "max": 2,
        "step": 1,
        "desc": "主视觉图片槽数量（0–2）；按各图比例自适应。为 0 时卡片铺满整幅。"
      },
      {
        "key": "imageSide",
        "label": "图片位置",
        "type": "radio",
        "default": "right",
        "options": [
          {
            "value": "right",
            "label": "右侧"
          },
          {
            "value": "left",
            "label": "左侧"
          }
        ],
        "desc": "图片相对卡片的位置（有图片时生效）。"
      },
      {
        "key": "barCount",
        "label": "占比条数量",
        "type": "slider",
        "default": 3,
        "min": 2,
        "max": 3,
        "step": 1,
        "desc": "构成区横向占比条的数量。"
      },
      {
        "key": "sortDescending",
        "label": "按占比降序",
        "type": "toggle",
        "default": true,
        "desc": "占比条是否按数值由大到小排序。"
      },
      {
        "key": "colorMode",
        "label": "占比条配色",
        "type": "radio",
        "default": "category",
        "options": [
          {
            "value": "category",
            "label": "按类别"
          },
          {
            "value": "accent",
            "label": "强调色"
          },
          {
            "value": "mono",
            "label": "单色"
          }
        ],
        "desc": "占比条的配色方式：按类别 / 统一强调色 / 单色阶。"
      },
      {
        "key": "focusEnabled",
        "label": "重点占比条",
        "type": "toggle",
        "default": true,
        "desc": "是否突出某一条占比。"
      },
      {
        "key": "focusIndex",
        "label": "重点条序号",
        "type": "slider",
        "default": 1,
        "min": 1,
        "max": 3,
        "step": 1,
        "desc": "被突出的占比条序号（按当前排序后顺序）。"
      },
      {
        "key": "showMetrics",
        "label": "指标对",
        "type": "toggle",
        "default": true,
        "desc": "卡片上半部分的一对关键指标。"
      },
      {
        "key": "accentColor",
        "label": "强调色",
        "type": "color",
        "default": "#e2742c",
        "options": [
          "#d8402e",
          "#e2742c",
          "#efbe2e",
          "#3c9a52",
          "#4da0c6",
          "#2c44a0",
          "#7a3c90"
        ],
        "desc": "眉标 / 重点条 /「强调色」配色模式下占比条的颜色。"
      },
      {
        "key": "showConclusion",
        "label": "结论文案",
        "type": "toggle",
        "default": true,
        "desc": "底部的一句装饰性结论。"
      },
      {
        "key": "showSheetLabel",
        "label": "页码标签",
        "type": "toggle",
        "default": true,
        "desc": "右上角的页码 / 章节标签。"
      }
    ],
    "defaultProps": {
      "imageCount": 1,
      "imageSide": "right",
      "barCount": 3,
      "sortDescending": true,
      "colorMode": "category",
      "focusEnabled": true,
      "focusIndex": 1,
      "showMetrics": true,
      "accentColor": "#e2742c",
      "showConclusion": true,
      "showSheetLabel": true
    }
  },
  {
    "key": "theme05_page041",
    "themeKey": "theme05",
    "pageNumber": 41,
    "layout": "THEME05-041",
    "slot": "capacity",
    "label": "容量栅格 Capacity",
    "bgClass": "",
    "controls": [
      {
        "key": "unitCount",
        "label": "容量单元数",
        "type": "slider",
        "default": 32,
        "min": 16,
        "max": 48,
        "step": 1,
        "desc": "占用栅格的单元（算力节点）总数。"
      },
      {
        "key": "columns",
        "label": "栅格列数",
        "type": "slider",
        "default": 8,
        "min": 4,
        "max": 10,
        "step": 1,
        "desc": "占用栅格的列数。"
      },
      {
        "key": "fillPercent",
        "label": "占用率(%)",
        "type": "slider",
        "default": 58,
        "min": 30,
        "max": 95,
        "step": 1,
        "desc": "被占用单元的比例（同时作为占用率读数）。"
      },
      {
        "key": "showUtil",
        "label": "占用率读数",
        "type": "toggle",
        "default": true,
        "desc": "栅格上方的巨号占用率百分比。"
      },
      {
        "key": "chartType",
        "label": "资源构成图表",
        "type": "radio",
        "default": "bar",
        "options": [
          {
            "value": "bar",
            "label": "条形"
          },
          {
            "value": "stack",
            "label": "堆叠"
          }
        ],
        "desc": "资源构成的呈现方式：逐项条形 / 单条堆叠。"
      },
      {
        "key": "shareCount",
        "label": "资源构成项数",
        "type": "slider",
        "default": 4,
        "min": 2,
        "max": 4,
        "step": 1,
        "desc": "资源构成（部分-整体）的分项数量。"
      },
      {
        "key": "focusEnabled",
        "label": "重点构成项",
        "type": "toggle",
        "default": true,
        "desc": "是否突出某一资源构成分项。"
      },
      {
        "key": "focusIndex",
        "label": "重点构成序号",
        "type": "slider",
        "default": 1,
        "min": 1,
        "max": 4,
        "step": 1,
        "desc": "被突出的资源构成分项序号（从 1 起）。"
      },
      {
        "key": "showShare",
        "label": "资源构成块",
        "type": "toggle",
        "default": true,
        "desc": "右下的资源构成（部分-整体）模块。"
      },
      {
        "key": "metricCount",
        "label": "指标行数",
        "type": "slider",
        "default": 4,
        "min": 2,
        "max": 4,
        "step": 1,
        "desc": "右上指标卡的指标行数。"
      },
      {
        "key": "accentColor",
        "label": "强调色",
        "type": "color",
        "default": "#d8402e",
        "options": [
          "#d8402e",
          "#e2742c",
          "#efbe2e",
          "#3c9a52",
          "#4da0c6",
          "#2c44a0",
          "#7a3c90"
        ],
        "desc": "眉标 / 占用单元 / 指标卡的强调色。"
      },
      {
        "key": "showConclusion",
        "label": "结论文案",
        "type": "toggle",
        "default": true,
        "desc": "底部的一句装饰性结论。"
      },
      {
        "key": "showSheetLabel",
        "label": "页码标签",
        "type": "toggle",
        "default": true,
        "desc": "右上角的页码 / 章节标签。"
      }
    ],
    "defaultProps": {
      "unitCount": 32,
      "columns": 8,
      "fillPercent": 58,
      "showUtil": true,
      "chartType": "bar",
      "shareCount": 4,
      "focusEnabled": true,
      "focusIndex": 1,
      "showShare": true,
      "metricCount": 4,
      "accentColor": "#d8402e",
      "showConclusion": true,
      "showSheetLabel": true
    }
  },
  {
    "key": "theme05_page042",
    "themeKey": "theme05",
    "pageNumber": 42,
    "layout": "THEME05-042",
    "slot": "ledger",
    "label": "结构表 Ledger",
    "bgClass": "",
    "controls": [
      {
        "key": "rowCount",
        "label": "数据行数",
        "type": "slider",
        "default": 3,
        "min": 2,
        "max": 4,
        "step": 1,
        "desc": "表格的数据行数量。"
      },
      {
        "key": "showBar",
        "label": "内联占比条",
        "type": "toggle",
        "default": true,
        "desc": "「资金占比」列内的水平占比条（数据条表）。"
      },
      {
        "key": "showTotal",
        "label": "合计行",
        "type": "toggle",
        "default": true,
        "desc": "末尾按当前行自动汇总的合计行。"
      },
      {
        "key": "showVerdict",
        "label": "判断列",
        "type": "toggle",
        "default": true,
        "desc": "末列的「判断」标签 chip（关闭则收起该列）。"
      },
      {
        "key": "zebra",
        "label": "斑马纹",
        "type": "toggle",
        "default": false,
        "desc": "隔行底色，便于横向读取。"
      },
      {
        "key": "focusEnabled",
        "label": "重点行",
        "type": "toggle",
        "default": true,
        "desc": "是否突出某一行。"
      },
      {
        "key": "focusIndex",
        "label": "重点行序号",
        "type": "slider",
        "default": 1,
        "min": 1,
        "max": 4,
        "step": 1,
        "desc": "被突出的行序号（从 1 起）。"
      },
      {
        "key": "colorMode",
        "label": "占比条配色",
        "type": "radio",
        "default": "category",
        "options": [
          {
            "value": "category",
            "label": "按类别"
          },
          {
            "value": "accent",
            "label": "强调色"
          },
          {
            "value": "mono",
            "label": "单色"
          }
        ],
        "desc": "内联占比条的配色方式。"
      },
      {
        "key": "showIntro",
        "label": "引导栏",
        "type": "toggle",
        "default": true,
        "desc": "表格上方的引导文案与维度说明。"
      },
      {
        "key": "accentColor",
        "label": "强调色",
        "type": "color",
        "default": "#2c44a0",
        "options": [
          "#d8402e",
          "#e2742c",
          "#efbe2e",
          "#3c9a52",
          "#4da0c6",
          "#2c44a0",
          "#7a3c90"
        ],
        "desc": "眉标 / 重点行 / 合计行的强调色。"
      },
      {
        "key": "showConclusion",
        "label": "结论文案",
        "type": "toggle",
        "default": true,
        "desc": "表格下方的一句装饰性结论。"
      },
      {
        "key": "showSheetLabel",
        "label": "页码标签",
        "type": "toggle",
        "default": true,
        "desc": "右上角的页码 / 章节标签。"
      }
    ],
    "defaultProps": {
      "rowCount": 3,
      "showBar": true,
      "showTotal": true,
      "showVerdict": true,
      "zebra": false,
      "focusEnabled": true,
      "focusIndex": 1,
      "colorMode": "category",
      "showIntro": true,
      "accentColor": "#2c44a0",
      "showConclusion": true,
      "showSheetLabel": true
    }
  },
  {
    "key": "theme05_page043",
    "themeKey": "theme05",
    "pageNumber": 43,
    "layout": "THEME05-043",
    "slot": "showcase",
    "label": "图像主视觉 Showcase",
    "bgClass": "",
    "controls": [
      {
        "key": "imageCount",
        "label": "图片槽数量",
        "type": "slider",
        "default": 1,
        "min": 0,
        "max": 2,
        "step": 1,
        "desc": "主视觉图片槽数量（0–2）；按各图比例自适应。为 0 时身份卡铺满整幅、指标转两列。"
      },
      {
        "key": "imageSide",
        "label": "图片位置",
        "type": "radio",
        "default": "left",
        "options": [
          {
            "value": "left",
            "label": "左侧"
          },
          {
            "value": "right",
            "label": "右侧"
          }
        ],
        "desc": "图片相对身份卡的位置（有图片时生效）。"
      },
      {
        "key": "cardTheme",
        "label": "身份卡主题",
        "type": "radio",
        "default": "color",
        "options": [
          {
            "value": "color",
            "label": "色块"
          },
          {
            "value": "dark",
            "label": "深色"
          },
          {
            "value": "paper",
            "label": "纸色"
          }
        ],
        "desc": "身份卡背景：强调色块 / 深色 / 纸色。"
      },
      {
        "key": "metricCount",
        "label": "指标行数",
        "type": "slider",
        "default": 3,
        "min": 2,
        "max": 4,
        "step": 1,
        "desc": "身份卡内的指标行数。"
      },
      {
        "key": "distCount",
        "label": "分布项数",
        "type": "slider",
        "default": 3,
        "min": 2,
        "max": 3,
        "step": 1,
        "desc": "底部应用分布带的分项数量。"
      },
      {
        "key": "showDistribution",
        "label": "应用分布带",
        "type": "toggle",
        "default": true,
        "desc": "底部全宽的应用分布带（单条 100% 分段 + 图例）。"
      },
      {
        "key": "focusEnabled",
        "label": "重点分布项",
        "type": "toggle",
        "default": false,
        "desc": "是否突出某一分布分项（其余淡出）。"
      },
      {
        "key": "focusIndex",
        "label": "重点分布序号",
        "type": "slider",
        "default": 1,
        "min": 1,
        "max": 3,
        "step": 1,
        "desc": "被突出的分布分项序号（从 1 起）。"
      },
      {
        "key": "showLead",
        "label": "引导文案",
        "type": "toggle",
        "default": true,
        "desc": "标题下方的一段引导说明。"
      },
      {
        "key": "showMediaCaption",
        "label": "图注",
        "type": "toggle",
        "default": true,
        "desc": "图片区上方的装饰性图注。"
      },
      {
        "key": "accentColor",
        "label": "强调色",
        "type": "color",
        "default": "#d8402e",
        "options": [
          "#d8402e",
          "#e2742c",
          "#efbe2e",
          "#3c9a52",
          "#4da0c6",
          "#2c44a0",
          "#7a3c90"
        ],
        "desc": "眉标 /「色块」主题身份卡的颜色。"
      },
      {
        "key": "showConclusion",
        "label": "结论文案",
        "type": "toggle",
        "default": true,
        "desc": "底部的一句装饰性结论。"
      },
      {
        "key": "showSheetLabel",
        "label": "页码标签",
        "type": "toggle",
        "default": true,
        "desc": "右上角的页码 / 章节标签。"
      }
    ],
    "defaultProps": {
      "imageCount": 1,
      "imageSide": "left",
      "cardTheme": "color",
      "metricCount": 3,
      "distCount": 3,
      "showDistribution": true,
      "focusEnabled": false,
      "focusIndex": 1,
      "showLead": true,
      "showMediaCaption": true,
      "accentColor": "#d8402e",
      "showConclusion": true,
      "showSheetLabel": true
    }
  },
  {
    "key": "theme05_page044",
    "themeKey": "theme05",
    "pageNumber": 44,
    "layout": "THEME05-044",
    "slot": "atlas",
    "label": "架构图 Atlas",
    "bgClass": "",
    "controls": [
      {
        "key": "imageCount",
        "label": "图片槽数量",
        "type": "slider",
        "default": 1,
        "min": 0,
        "max": 2,
        "step": 1,
        "desc": "主视觉图片槽数量（0–2）；按各图比例自适应。为 0 时身份卡铺满整幅、指标转两列。"
      },
      {
        "key": "imageSide",
        "label": "图片位置",
        "type": "radio",
        "default": "right",
        "options": [
          {
            "value": "left",
            "label": "左侧"
          },
          {
            "value": "right",
            "label": "右侧"
          }
        ],
        "desc": "图片相对身份卡的位置（有图片时生效）。"
      },
      {
        "key": "cardTheme",
        "label": "身份卡主题",
        "type": "radio",
        "default": "dark",
        "options": [
          {
            "value": "color",
            "label": "色块"
          },
          {
            "value": "dark",
            "label": "深色"
          },
          {
            "value": "paper",
            "label": "纸色"
          }
        ],
        "desc": "身份卡背景：强调色块 / 深色 / 纸色。"
      },
      {
        "key": "metricCount",
        "label": "指标行数",
        "type": "slider",
        "default": 3,
        "min": 2,
        "max": 4,
        "step": 1,
        "desc": "身份卡内的指标行数。"
      },
      {
        "key": "sceneCount",
        "label": "场景块数",
        "type": "slider",
        "default": 3,
        "min": 2,
        "max": 3,
        "step": 1,
        "desc": "底部场景拆分带的 stat 块数量。"
      },
      {
        "key": "showScenes",
        "label": "场景拆分带",
        "type": "toggle",
        "default": true,
        "desc": "底部全宽的场景拆分带（离散 stat 块）。"
      },
      {
        "key": "focusEnabled",
        "label": "重点场景块",
        "type": "toggle",
        "default": true,
        "desc": "是否突出某一场景块（其余淡出）。"
      },
      {
        "key": "focusIndex",
        "label": "重点场景序号",
        "type": "slider",
        "default": 1,
        "min": 1,
        "max": 3,
        "step": 1,
        "desc": "被突出的场景块序号（从 1 起）。"
      },
      {
        "key": "showLead",
        "label": "引导文案",
        "type": "toggle",
        "default": true,
        "desc": "标题下方的一段引导说明。"
      },
      {
        "key": "showMediaCaption",
        "label": "图注",
        "type": "toggle",
        "default": true,
        "desc": "图片区上方的装饰性图注。"
      },
      {
        "key": "accentColor",
        "label": "强调色",
        "type": "color",
        "default": "#4da0c6",
        "options": [
          "#d8402e",
          "#e2742c",
          "#efbe2e",
          "#3c9a52",
          "#4da0c6",
          "#2c44a0",
          "#7a3c90"
        ],
        "desc": "眉标 / 卡内强调条 /「色块」主题身份卡的颜色。"
      },
      {
        "key": "showConclusion",
        "label": "结论文案",
        "type": "toggle",
        "default": true,
        "desc": "底部的一句装饰性结论。"
      },
      {
        "key": "showSheetLabel",
        "label": "页码标签",
        "type": "toggle",
        "default": true,
        "desc": "右上角的页码 / 章节标签。"
      }
    ],
    "defaultProps": {
      "imageCount": 1,
      "imageSide": "right",
      "cardTheme": "dark",
      "metricCount": 3,
      "sceneCount": 3,
      "showScenes": true,
      "focusEnabled": true,
      "focusIndex": 1,
      "showLead": true,
      "showMediaCaption": true,
      "accentColor": "#4da0c6",
      "showConclusion": true,
      "showSheetLabel": true
    }
  },
  {
    "key": "theme05_page045",
    "themeKey": "theme05",
    "pageNumber": 45,
    "layout": "THEME05-045",
    "slot": "gate",
    "label": "分层防线 Gate",
    "bgClass": "",
    "controls": [
      {
        "key": "layerCount",
        "label": "防线层数",
        "type": "slider",
        "default": 4,
        "min": 2,
        "max": 4,
        "step": 1,
        "desc": "纵向堆叠的防线（分层）数量。"
      },
      {
        "key": "chartType",
        "label": "防线图样式",
        "type": "radio",
        "default": "nested",
        "options": [
          {
            "value": "nested",
            "label": "嵌套"
          },
          {
            "value": "bar",
            "label": "条形"
          }
        ],
        "desc": "分层呈现方式：居中嵌套塔 / 左对齐横向条形。"
      },
      {
        "key": "focusEnabled",
        "label": "重点防线",
        "type": "toggle",
        "default": true,
        "desc": "是否突出某一层（其余淡出）。"
      },
      {
        "key": "focusIndex",
        "label": "重点防线序号",
        "type": "slider",
        "default": 1,
        "min": 1,
        "max": 4,
        "step": 1,
        "desc": "被突出的防线序号（从 1 起）。"
      },
      {
        "key": "showValue",
        "label": "防线数值",
        "type": "toggle",
        "default": true,
        "desc": "各层右侧的数值标注。"
      },
      {
        "key": "showMetricCard",
        "label": "侧栏指标卡",
        "type": "toggle",
        "default": true,
        "desc": "右侧的彩色指标规格卡。"
      },
      {
        "key": "metricCount",
        "label": "指标行数",
        "type": "slider",
        "default": 4,
        "min": 2,
        "max": 4,
        "step": 1,
        "desc": "侧栏指标卡的指标行数。"
      },
      {
        "key": "showNote",
        "label": "侧栏说明",
        "type": "toggle",
        "default": true,
        "desc": "侧栏底部的一段说明文案。"
      },
      {
        "key": "accentColor",
        "label": "强调色",
        "type": "color",
        "default": "#2c44a0",
        "options": [
          "#d8402e",
          "#e2742c",
          "#efbe2e",
          "#3c9a52",
          "#4da0c6",
          "#2c44a0",
          "#7a3c90"
        ],
        "desc": "眉标 / 指标卡 / 重点标记的强调色。"
      },
      {
        "key": "showConclusion",
        "label": "结论文案",
        "type": "toggle",
        "default": true,
        "desc": "底部的一句装饰性结论。"
      },
      {
        "key": "showSheetLabel",
        "label": "页码标签",
        "type": "toggle",
        "default": true,
        "desc": "右上角的页码 / 章节标签。"
      }
    ],
    "defaultProps": {
      "layerCount": 4,
      "chartType": "nested",
      "focusEnabled": true,
      "focusIndex": 1,
      "showValue": true,
      "showMetricCard": true,
      "metricCount": 4,
      "showNote": true,
      "accentColor": "#2c44a0",
      "showConclusion": true,
      "showSheetLabel": true
    }
  },
  {
    "key": "theme05_page046",
    "themeKey": "theme05",
    "pageNumber": 46,
    "layout": "THEME05-046",
    "slot": "catalog",
    "label": "图像型录 Catalog",
    "bgClass": "",
    "controls": [
      {
        "key": "cardCount",
        "label": "型录卡数量",
        "type": "slider",
        "default": 4,
        "min": 2,
        "max": 4,
        "step": 1,
        "desc": "类型卡（型录单元）的数量。"
      },
      {
        "key": "imageCount",
        "label": "图片槽数量",
        "type": "slider",
        "default": 2,
        "min": 0,
        "max": 4,
        "step": 1,
        "desc": "前 N 张卡作为图片槽（按比例填充）；其余卡为纯色型录块。"
      },
      {
        "key": "widthByValue",
        "label": "按数值定宽",
        "type": "toggle",
        "default": true,
        "desc": "卡片宽度按数值分配（整行即一条资金分布）；关闭则等宽。"
      },
      {
        "key": "showCode",
        "label": "卡片代号",
        "type": "toggle",
        "default": true,
        "desc": "卡片角上的两字母代号。"
      },
      {
        "key": "showValue",
        "label": "卡片数值",
        "type": "toggle",
        "default": true,
        "desc": "卡片底部的数值标注。"
      },
      {
        "key": "focusEnabled",
        "label": "重点卡片",
        "type": "toggle",
        "default": false,
        "desc": "是否突出某一张卡（其余淡出）。"
      },
      {
        "key": "focusIndex",
        "label": "重点卡序号",
        "type": "slider",
        "default": 1,
        "min": 1,
        "max": 4,
        "step": 1,
        "desc": "被突出的卡片序号（从 1 起）。"
      },
      {
        "key": "showHeadline",
        "label": "指标条",
        "type": "toggle",
        "default": true,
        "desc": "型录上方的标题指标条。"
      },
      {
        "key": "showGalleryCaption",
        "label": "图注",
        "type": "toggle",
        "default": true,
        "desc": "型录区上方的装饰性图注。"
      },
      {
        "key": "accentColor",
        "label": "强调色",
        "type": "color",
        "default": "#d8402e",
        "options": [
          "#d8402e",
          "#e2742c",
          "#efbe2e",
          "#3c9a52",
          "#4da0c6",
          "#2c44a0",
          "#7a3c90"
        ],
        "desc": "眉标 / 指标条强调色。"
      },
      {
        "key": "showConclusion",
        "label": "结论文案",
        "type": "toggle",
        "default": true,
        "desc": "底部的一句装饰性结论。"
      },
      {
        "key": "showSheetLabel",
        "label": "页码标签",
        "type": "toggle",
        "default": true,
        "desc": "右上角的页码 / 章节标签。"
      }
    ],
    "defaultProps": {
      "cardCount": 4,
      "imageCount": 2,
      "widthByValue": true,
      "showCode": true,
      "showValue": true,
      "focusEnabled": false,
      "focusIndex": 1,
      "showHeadline": true,
      "showGalleryCaption": true,
      "accentColor": "#d8402e",
      "showConclusion": true,
      "showSheetLabel": true
    }
  },
  {
    "key": "theme05_page047",
    "themeKey": "theme05",
    "pageNumber": 47,
    "layout": "THEME05-047",
    "slot": "path",
    "label": "学习路径 Path",
    "bgClass": "",
    "controls": [
      {
        "key": "nodeCount",
        "label": "路径节点数",
        "type": "slider",
        "default": 4,
        "min": 2,
        "max": 4,
        "step": 1,
        "desc": "学习路径的阶段（节点）数量。"
      },
      {
        "key": "imageCount",
        "label": "图片槽数量",
        "type": "slider",
        "default": 1,
        "min": 0,
        "max": 3,
        "step": 1,
        "desc": "图片槽数量（0–3）；按各图比例自适应排布。为 0 时路径铺满整幅。"
      },
      {
        "key": "imageSide",
        "label": "图片位置",
        "type": "radio",
        "default": "right",
        "options": [
          {
            "value": "left",
            "label": "左侧"
          },
          {
            "value": "right",
            "label": "右侧"
          }
        ],
        "desc": "图片相对路径的位置（有图片时生效）。"
      },
      {
        "key": "focusEnabled",
        "label": "重点节点",
        "type": "toggle",
        "default": true,
        "desc": "是否突出某一路径节点。"
      },
      {
        "key": "focusIndex",
        "label": "重点节点序号",
        "type": "slider",
        "default": 2,
        "min": 1,
        "max": 4,
        "step": 1,
        "desc": "被突出的节点序号（从 1 起）。"
      },
      {
        "key": "sceneCount",
        "label": "场景卡数量",
        "type": "slider",
        "default": 3,
        "min": 2,
        "max": 3,
        "step": 1,
        "desc": "底部场景拆分带的卡片数量。"
      },
      {
        "key": "showScenes",
        "label": "场景拆分带",
        "type": "toggle",
        "default": true,
        "desc": "底部全宽的场景拆分带。"
      },
      {
        "key": "showLead",
        "label": "引导文案",
        "type": "toggle",
        "default": true,
        "desc": "标题下方的一段引导说明。"
      },
      {
        "key": "showMetrics",
        "label": "指标对",
        "type": "toggle",
        "default": true,
        "desc": "引导文案右侧的一对关键指标。"
      },
      {
        "key": "showGalleryCaption",
        "label": "图注",
        "type": "toggle",
        "default": true,
        "desc": "图片区上方的装饰性图注。"
      },
      {
        "key": "accentColor",
        "label": "强调色",
        "type": "color",
        "default": "#3c9a52",
        "options": [
          "#d8402e",
          "#e2742c",
          "#efbe2e",
          "#3c9a52",
          "#4da0c6",
          "#2c44a0",
          "#7a3c90"
        ],
        "desc": "眉标 / 重点节点 / 指标的强调色。"
      },
      {
        "key": "showConclusion",
        "label": "结论文案",
        "type": "toggle",
        "default": true,
        "desc": "底部的一句装饰性结论。"
      },
      {
        "key": "showSheetLabel",
        "label": "页码标签",
        "type": "toggle",
        "default": true,
        "desc": "右上角的页码 / 章节标签。"
      }
    ],
    "defaultProps": {
      "nodeCount": 4,
      "imageCount": 1,
      "imageSide": "right",
      "focusEnabled": true,
      "focusIndex": 2,
      "sceneCount": 3,
      "showScenes": true,
      "showLead": true,
      "showMetrics": true,
      "showGalleryCaption": true,
      "accentColor": "#3c9a52",
      "showConclusion": true,
      "showSheetLabel": true
    }
  },
  {
    "key": "theme05_page048",
    "themeKey": "theme05",
    "pageNumber": 48,
    "layout": "THEME05-048",
    "slot": "meter",
    "label": "指标仪表 Meter",
    "bgClass": "",
    "controls": [
      {
        "key": "rowCount",
        "label": "指标行数",
        "type": "slider",
        "default": 4,
        "min": 2,
        "max": 4,
        "step": 1,
        "desc": "表格的指标行数量。"
      },
      {
        "key": "showGauge",
        "label": "仪表列",
        "type": "toggle",
        "default": true,
        "desc": "0–100 的指标仪表条列（关闭则收起该列）。"
      },
      {
        "key": "showBenchmark",
        "label": "行业基准标记",
        "type": "toggle",
        "default": true,
        "desc": "仪表条上的行业基准刻度与差值。"
      },
      {
        "key": "showVerdict",
        "label": "判断列",
        "type": "toggle",
        "default": true,
        "desc": "末尾的「判断」标签列（关闭则收起该列）。"
      },
      {
        "key": "zebra",
        "label": "斑马纹",
        "type": "toggle",
        "default": false,
        "desc": "隔行底色，便于横向读取。"
      },
      {
        "key": "focusEnabled",
        "label": "重点行",
        "type": "toggle",
        "default": true,
        "desc": "是否突出某一行。"
      },
      {
        "key": "focusIndex",
        "label": "重点行序号",
        "type": "slider",
        "default": 2,
        "min": 1,
        "max": 4,
        "step": 1,
        "desc": "被突出的行序号（从 1 起）。"
      },
      {
        "key": "showProcess",
        "label": "流程条",
        "type": "toggle",
        "default": true,
        "desc": "表格上方的工单流程节点条。"
      },
      {
        "key": "processNodeCount",
        "label": "流程节点数",
        "type": "slider",
        "default": 4,
        "min": 2,
        "max": 4,
        "step": 1,
        "desc": "流程条的节点数量。"
      },
      {
        "key": "showIntro",
        "label": "引导栏",
        "type": "toggle",
        "default": true,
        "desc": "表格上方的引导文案、维度说明与指标对。"
      },
      {
        "key": "accentColor",
        "label": "强调色",
        "type": "color",
        "default": "#d8402e",
        "options": [
          "#d8402e",
          "#e2742c",
          "#efbe2e",
          "#3c9a52",
          "#4da0c6",
          "#2c44a0",
          "#7a3c90"
        ],
        "desc": "眉标 / 重点行 / 仪表填充的强调色。"
      },
      {
        "key": "showConclusion",
        "label": "结论文案",
        "type": "toggle",
        "default": true,
        "desc": "表格下方的一句装饰性结论。"
      },
      {
        "key": "showSheetLabel",
        "label": "页码标签",
        "type": "toggle",
        "default": true,
        "desc": "右上角的页码 / 章节标签。"
      }
    ],
    "defaultProps": {
      "rowCount": 4,
      "showGauge": true,
      "showBenchmark": true,
      "showVerdict": true,
      "zebra": false,
      "focusEnabled": true,
      "focusIndex": 2,
      "showProcess": true,
      "processNodeCount": 4,
      "showIntro": true,
      "accentColor": "#d8402e",
      "showConclusion": true,
      "showSheetLabel": true
    }
  },
  {
    "key": "theme05_page049",
    "themeKey": "theme05",
    "pageNumber": 49,
    "layout": "THEME05-049",
    "slot": "funnel",
    "label": "增长漏斗 Funnel",
    "bgClass": "",
    "controls": [
      {
        "key": "tierCount",
        "label": "漏斗层数",
        "type": "slider",
        "default": 4,
        "min": 2,
        "max": 4,
        "step": 1,
        "desc": "漏斗的层级（阶段）数量。"
      },
      {
        "key": "imageCount",
        "label": "图片槽数量",
        "type": "slider",
        "default": 1,
        "min": 0,
        "max": 3,
        "step": 1,
        "desc": "图片槽数量（0–3）；按各图比例自适应。为 0 时漏斗铺满整幅。"
      },
      {
        "key": "imageSide",
        "label": "图片位置",
        "type": "radio",
        "default": "right",
        "options": [
          {
            "value": "left",
            "label": "左侧"
          },
          {
            "value": "right",
            "label": "右侧"
          }
        ],
        "desc": "图片相对漏斗的位置（有图片时生效）。"
      },
      {
        "key": "focusEnabled",
        "label": "重点层",
        "type": "toggle",
        "default": false,
        "desc": "是否突出某一漏斗层（其余淡出）。"
      },
      {
        "key": "focusIndex",
        "label": "重点层序号",
        "type": "slider",
        "default": 1,
        "min": 1,
        "max": 4,
        "step": 1,
        "desc": "被突出的漏斗层序号（从 1 起）。"
      },
      {
        "key": "showValue",
        "label": "层数值",
        "type": "toggle",
        "default": true,
        "desc": "各层右侧的数值标注。"
      },
      {
        "key": "showMetrics",
        "label": "指标对",
        "type": "toggle",
        "default": true,
        "desc": "引导文案右侧的一对关键指标。"
      },
      {
        "key": "showLead",
        "label": "引导文案",
        "type": "toggle",
        "default": true,
        "desc": "标题下方的一段引导说明。"
      },
      {
        "key": "showGalleryCaption",
        "label": "图注",
        "type": "toggle",
        "default": true,
        "desc": "图片区上方的装饰性图注。"
      },
      {
        "key": "accentColor",
        "label": "强调色",
        "type": "color",
        "default": "#e2742c",
        "options": [
          "#d8402e",
          "#e2742c",
          "#efbe2e",
          "#3c9a52",
          "#4da0c6",
          "#2c44a0",
          "#7a3c90"
        ],
        "desc": "眉标 / 指标 / 重点层的强调色。"
      },
      {
        "key": "showConclusion",
        "label": "结论文案",
        "type": "toggle",
        "default": true,
        "desc": "底部的一句装饰性结论。"
      },
      {
        "key": "showSheetLabel",
        "label": "页码标签",
        "type": "toggle",
        "default": true,
        "desc": "右上角的页码 / 章节标签。"
      }
    ],
    "defaultProps": {
      "tierCount": 4,
      "imageCount": 1,
      "imageSide": "right",
      "focusEnabled": false,
      "focusIndex": 1,
      "showValue": true,
      "showMetrics": true,
      "showLead": true,
      "showGalleryCaption": true,
      "accentColor": "#e2742c",
      "showConclusion": true,
      "showSheetLabel": true
    }
  },
  {
    "key": "theme05_page050",
    "themeKey": "theme05",
    "pageNumber": 50,
    "layout": "THEME05-050",
    "slot": "hero",
    "label": "大数字 Hero",
    "bgClass": "",
    "controls": [
      {
        "key": "imageCount",
        "label": "图片槽数量",
        "type": "slider",
        "default": 1,
        "min": 0,
        "max": 2,
        "step": 1,
        "desc": "图片槽数量（0–2）；按各图比例自适应。为 0 时主数字块铺满整幅。"
      },
      {
        "key": "imageSide",
        "label": "图片位置",
        "type": "radio",
        "default": "right",
        "options": [
          {
            "value": "left",
            "label": "左侧"
          },
          {
            "value": "right",
            "label": "右侧"
          }
        ],
        "desc": "图片相对主数字块的位置（有图片时生效）。"
      },
      {
        "key": "auxCount",
        "label": "辅助指标数",
        "type": "slider",
        "default": 3,
        "min": 0,
        "max": 3,
        "step": 1,
        "desc": "主数字下方的支撑指标数量（0 隐藏整行）。"
      },
      {
        "key": "showUnit",
        "label": "数字单位",
        "type": "toggle",
        "default": true,
        "desc": "主数字后的单位后缀。"
      },
      {
        "key": "showCaption",
        "label": "数字说明",
        "type": "toggle",
        "default": true,
        "desc": "主数字下方的解释说明。"
      },
      {
        "key": "showMessage",
        "label": "支撑文案",
        "type": "toggle",
        "default": true,
        "desc": "说明下方的一段支撑性文案。"
      },
      {
        "key": "showGalleryCaption",
        "label": "图注",
        "type": "toggle",
        "default": true,
        "desc": "图片区上方的装饰性图注。"
      },
      {
        "key": "accentColor",
        "label": "强调色",
        "type": "color",
        "default": "#3c9a52",
        "options": [
          "#d8402e",
          "#e2742c",
          "#efbe2e",
          "#3c9a52",
          "#4da0c6",
          "#2c44a0",
          "#7a3c90"
        ],
        "desc": "主数字 / 眉标 / 辅助指标的强调色。"
      },
      {
        "key": "showConclusion",
        "label": "结论文案",
        "type": "toggle",
        "default": true,
        "desc": "底部的一句装饰性结论。"
      },
      {
        "key": "showSheetLabel",
        "label": "页码标签",
        "type": "toggle",
        "default": true,
        "desc": "右上角的页码 / 章节标签。"
      }
    ],
    "defaultProps": {
      "imageCount": 1,
      "imageSide": "right",
      "auxCount": 3,
      "showUnit": true,
      "showCaption": true,
      "showMessage": true,
      "showGalleryCaption": true,
      "accentColor": "#3c9a52",
      "showConclusion": true,
      "showSheetLabel": true
    }
  },
  {
    "key": "theme05_page051",
    "themeKey": "theme05",
    "pageNumber": 51,
    "layout": "THEME05-051",
    "slot": "flux",
    "label": "转化通道 Flux",
    "bgClass": "",
    "controls": [
      {
        "key": "imageCount",
        "label": "图片槽数量",
        "type": "slider",
        "default": 1,
        "min": 0,
        "max": 3,
        "step": 1,
        "desc": "图片槽数量（0–3）；按各图比例自适应。为 0 时转化通道铺满整幅。"
      },
      {
        "key": "imageSide",
        "label": "图片位置",
        "type": "radio",
        "default": "right",
        "options": [
          {
            "value": "left",
            "label": "左侧"
          },
          {
            "value": "right",
            "label": "右侧"
          }
        ],
        "desc": "图片相对转化通道的位置（有图片时生效）。"
      },
      {
        "key": "showTransfer",
        "label": "转化连接带",
        "type": "toggle",
        "default": true,
        "desc": "两个池之间的转化连接带与说明。"
      },
      {
        "key": "emphasize",
        "label": "强调端",
        "type": "radio",
        "default": "dest",
        "options": [
          {
            "value": "source",
            "label": "源头"
          },
          {
            "value": "dest",
            "label": "终点"
          }
        ],
        "desc": "用强调色着重的一端（源头社区 / 终点企业）。"
      },
      {
        "key": "showMetrics",
        "label": "指标对",
        "type": "toggle",
        "default": true,
        "desc": "引导文案右侧的一对关键指标。"
      },
      {
        "key": "showLead",
        "label": "引导文案",
        "type": "toggle",
        "default": true,
        "desc": "标题下方的一段引导说明。"
      },
      {
        "key": "showGalleryCaption",
        "label": "图注",
        "type": "toggle",
        "default": true,
        "desc": "图片区上方的装饰性图注。"
      },
      {
        "key": "accentColor",
        "label": "强调色",
        "type": "color",
        "default": "#7a3c90",
        "options": [
          "#d8402e",
          "#e2742c",
          "#efbe2e",
          "#3c9a52",
          "#4da0c6",
          "#2c44a0",
          "#7a3c90"
        ],
        "desc": "眉标 / 指标 / 强调端的颜色。"
      },
      {
        "key": "showConclusion",
        "label": "结论文案",
        "type": "toggle",
        "default": true,
        "desc": "底部的一句装饰性结论。"
      },
      {
        "key": "showSheetLabel",
        "label": "页码标签",
        "type": "toggle",
        "default": true,
        "desc": "右上角的页码 / 章节标签。"
      }
    ],
    "defaultProps": {
      "imageCount": 1,
      "imageSide": "right",
      "showTransfer": true,
      "emphasize": "dest",
      "showMetrics": true,
      "showLead": true,
      "showGalleryCaption": true,
      "accentColor": "#7a3c90",
      "showConclusion": true,
      "showSheetLabel": true
    }
  },
  {
    "key": "theme05_page052",
    "themeKey": "theme05",
    "pageNumber": 52,
    "layout": "THEME05-052",
    "slot": "shield",
    "label": "评测流程 Shield",
    "bgClass": "",
    "controls": [
      {
        "key": "stageCount",
        "label": "流程节点数",
        "type": "slider",
        "default": 3,
        "min": 2,
        "max": 3,
        "step": 1,
        "desc": "评测流程的阶段（节点）数量。"
      },
      {
        "key": "focusEnabled",
        "label": "重点节点",
        "type": "toggle",
        "default": true,
        "desc": "是否突出某一节点（其余淡出）。"
      },
      {
        "key": "focusIndex",
        "label": "重点节点序号",
        "type": "slider",
        "default": 1,
        "min": 1,
        "max": 3,
        "step": 1,
        "desc": "被突出的节点序号（从 1 起）。"
      },
      {
        "key": "showValue",
        "label": "节点数值",
        "type": "toggle",
        "default": true,
        "desc": "各节点柱顶的数值标注。"
      },
      {
        "key": "showArrows",
        "label": "流程箭头",
        "type": "toggle",
        "default": true,
        "desc": "相邻节点间的流向箭头。"
      },
      {
        "key": "showMetricCard",
        "label": "侧栏指标卡",
        "type": "toggle",
        "default": true,
        "desc": "右侧的彩色指标规格卡。"
      },
      {
        "key": "metricCount",
        "label": "指标行数",
        "type": "slider",
        "default": 3,
        "min": 2,
        "max": 3,
        "step": 1,
        "desc": "侧栏指标卡的指标行数。"
      },
      {
        "key": "showNote",
        "label": "侧栏说明",
        "type": "toggle",
        "default": true,
        "desc": "侧栏底部的一段说明文案。"
      },
      {
        "key": "accentColor",
        "label": "强调色",
        "type": "color",
        "default": "#2c44a0",
        "options": [
          "#d8402e",
          "#e2742c",
          "#efbe2e",
          "#3c9a52",
          "#4da0c6",
          "#2c44a0",
          "#7a3c90"
        ],
        "desc": "眉标 / 指标卡 / 重点标记的强调色。"
      },
      {
        "key": "showConclusion",
        "label": "结论文案",
        "type": "toggle",
        "default": true,
        "desc": "底部的一句装饰性结论。"
      },
      {
        "key": "showSheetLabel",
        "label": "页码标签",
        "type": "toggle",
        "default": true,
        "desc": "右上角的页码 / 章节标签。"
      }
    ],
    "defaultProps": {
      "stageCount": 3,
      "focusEnabled": true,
      "focusIndex": 1,
      "showValue": true,
      "showArrows": true,
      "showMetricCard": true,
      "metricCount": 3,
      "showNote": true,
      "accentColor": "#2c44a0",
      "showConclusion": true,
      "showSheetLabel": true
    }
  },
  {
    "key": "theme05_page053",
    "themeKey": "theme05",
    "pageNumber": 53,
    "layout": "THEME05-053",
    "slot": "chapter4",
    "label": "章节 Chapter 04",
    "bgClass": "",
    "controls": [
      {
        "key": "theme",
        "label": "背景主题",
        "type": "radio",
        "default": "color",
        "options": [
          {
            "value": "dark",
            "label": "深色"
          },
          {
            "value": "paper",
            "label": "纸色"
          },
          {
            "value": "color",
            "label": "色块"
          }
        ],
        "desc": "章节页背景：深色 / 纸色 / 整页色块。"
      },
      {
        "key": "bgColor",
        "label": "色块背景",
        "type": "color",
        "default": "#2c44a0",
        "options": [
          "#d8402e",
          "#e2742c",
          "#efbe2e",
          "#3c9a52",
          "#4da0c6",
          "#2c44a0",
          "#7a3c90"
        ],
        "desc": "「色块」主题下的整页背景色。"
      },
      {
        "key": "showBigNumber",
        "label": "大号章节号",
        "type": "toggle",
        "default": true,
        "desc": "右侧的超大章节编号。"
      },
      {
        "key": "keywordCount",
        "label": "关键词数量",
        "type": "slider",
        "default": 4,
        "min": 0,
        "max": 6,
        "step": 1,
        "desc": "底部关键词标签数量（0 隐藏）。"
      },
      {
        "key": "accentColor",
        "label": "强调色",
        "type": "color",
        "default": "#2c44a0",
        "options": [
          "#d8402e",
          "#e2742c",
          "#efbe2e",
          "#3c9a52",
          "#4da0c6",
          "#2c44a0",
          "#7a3c90"
        ],
        "desc": "眉标与章节编号的强调色（色块主题除外）。"
      },
      {
        "key": "showColorBand",
        "label": "色谱条",
        "type": "toggle",
        "default": true,
        "desc": "底部的色谱条带。"
      },
      {
        "key": "showWordmark",
        "label": "品牌标识",
        "type": "toggle",
        "default": true,
        "desc": "左上角的品牌标识。"
      },
      {
        "key": "showSheetLabel",
        "label": "页码标签",
        "type": "toggle",
        "default": true,
        "desc": "右上角的章节 / 页码标签。"
      }
    ],
    "defaultProps": {
      "theme": "color",
      "bgColor": "#2c44a0",
      "showBigNumber": true,
      "keywordCount": 4,
      "accentColor": "#2c44a0",
      "showColorBand": true,
      "showWordmark": true,
      "showSheetLabel": true
    }
  },
  {
    "key": "theme05_page054",
    "themeKey": "theme05",
    "pageNumber": 54,
    "layout": "THEME05-054",
    "slot": "signal",
    "label": "早期信号表 Signal",
    "bgClass": "",
    "controls": [
      {
        "key": "rowCount",
        "label": "数据行数",
        "type": "slider",
        "default": 4,
        "min": 2,
        "max": 4,
        "step": 1,
        "desc": "表格的数据行数量。"
      },
      {
        "key": "showSignal",
        "label": "信号强度列",
        "type": "toggle",
        "default": true,
        "desc": "末尾的信号强度点阵列（关闭则收起该列）。"
      },
      {
        "key": "scaleMax",
        "label": "信号刻度上限",
        "type": "slider",
        "default": 5,
        "min": 3,
        "max": 5,
        "step": 1,
        "desc": "信号点阵的总刻度数（点的总个数）。"
      },
      {
        "key": "sortDescending",
        "label": "按信号降序",
        "type": "toggle",
        "default": true,
        "desc": "是否按信号强度由高到低排序行。"
      },
      {
        "key": "zebra",
        "label": "斑马纹",
        "type": "toggle",
        "default": false,
        "desc": "隔行底色，便于横向读取。"
      },
      {
        "key": "focusEnabled",
        "label": "重点行",
        "type": "toggle",
        "default": true,
        "desc": "是否突出某一行。"
      },
      {
        "key": "focusIndex",
        "label": "重点行序号",
        "type": "slider",
        "default": 1,
        "min": 1,
        "max": 4,
        "step": 1,
        "desc": "被突出的行序号（按当前排序后顺序，从 1 起）。"
      },
      {
        "key": "showIntro",
        "label": "引导栏",
        "type": "toggle",
        "default": true,
        "desc": "表格上方的引导文案与一对头部指标。"
      },
      {
        "key": "accentColor",
        "label": "强调色",
        "type": "color",
        "default": "#efbe2e",
        "options": [
          "#d8402e",
          "#e2742c",
          "#efbe2e",
          "#3c9a52",
          "#4da0c6",
          "#2c44a0",
          "#7a3c90"
        ],
        "desc": "眉标 / 头部指标 / 重点行 / 信号点的强调色。"
      },
      {
        "key": "showConclusion",
        "label": "结论文案",
        "type": "toggle",
        "default": true,
        "desc": "表格下方的一句装饰性结论。"
      },
      {
        "key": "showSheetLabel",
        "label": "页码标签",
        "type": "toggle",
        "default": true,
        "desc": "右上角的页码 / 章节标签。"
      }
    ],
    "defaultProps": {
      "rowCount": 4,
      "showSignal": true,
      "scaleMax": 5,
      "sortDescending": true,
      "zebra": false,
      "focusEnabled": true,
      "focusIndex": 1,
      "showIntro": true,
      "accentColor": "#efbe2e",
      "showConclusion": true,
      "showSheetLabel": true
    }
  },
  {
    "key": "theme05_page055",
    "themeKey": "theme05",
    "pageNumber": 55,
    "layout": "THEME05-055",
    "slot": "composite",
    "label": "结构拆解 Composite",
    "bgClass": "",
    "controls": [
      {
        "key": "partCount",
        "label": "构成分项数",
        "type": "slider",
        "default": 4,
        "min": 2,
        "max": 4,
        "step": 1,
        "desc": "交易结构的构成分项数量。"
      },
      {
        "key": "chartType",
        "label": "图表类型",
        "type": "radio",
        "default": "bars",
        "options": [
          {
            "value": "bars",
            "label": "分项条"
          },
          {
            "value": "stack",
            "label": "百分比堆叠"
          }
        ],
        "desc": "构成呈现方式：逐项横向条 / 单条 100% 堆叠。"
      },
      {
        "key": "showAnchor",
        "label": "主体锚点卡",
        "type": "toggle",
        "default": true,
        "desc": "左侧的深色主体卡（巨号读数）。"
      },
      {
        "key": "focusEnabled",
        "label": "重点分项",
        "type": "toggle",
        "default": false,
        "desc": "是否突出某一分项（其余淡出）。"
      },
      {
        "key": "focusIndex",
        "label": "重点分项序号",
        "type": "slider",
        "default": 1,
        "min": 1,
        "max": 4,
        "step": 1,
        "desc": "被突出的分项序号（从 1 起）。"
      },
      {
        "key": "showValue",
        "label": "分项数值",
        "type": "toggle",
        "default": true,
        "desc": "各分项的百分比数值标注。"
      },
      {
        "key": "showLegend",
        "label": "图例",
        "type": "toggle",
        "default": true,
        "desc": "100% 堆叠模式下方的分项图例。"
      },
      {
        "key": "accentColor",
        "label": "强调色",
        "type": "color",
        "default": "#4da0c6",
        "options": [
          "#d8402e",
          "#e2742c",
          "#efbe2e",
          "#3c9a52",
          "#4da0c6",
          "#2c44a0",
          "#7a3c90"
        ],
        "desc": "眉标 / 主体卡巨号读数的强调色。"
      },
      {
        "key": "showConclusion",
        "label": "结论文案",
        "type": "toggle",
        "default": true,
        "desc": "底部的一句装饰性结论。"
      },
      {
        "key": "showSheetLabel",
        "label": "页码标签",
        "type": "toggle",
        "default": true,
        "desc": "右上角的页码 / 章节标签。"
      }
    ],
    "defaultProps": {
      "partCount": 4,
      "chartType": "bars",
      "showAnchor": true,
      "focusEnabled": false,
      "focusIndex": 1,
      "showValue": true,
      "showLegend": true,
      "accentColor": "#4da0c6",
      "showConclusion": true,
      "showSheetLabel": true
    }
  },
  {
    "key": "theme05_page056",
    "themeKey": "theme05",
    "pageNumber": 56,
    "layout": "THEME05-056",
    "slot": "source",
    "label": "资本来源 Source",
    "bgClass": "",
    "controls": [
      {
        "key": "typeCount",
        "label": "投资人类型数",
        "type": "slider",
        "default": 4,
        "min": 2,
        "max": 4,
        "step": 1,
        "desc": "投资人类型环图的分段数量。"
      },
      {
        "key": "chartType",
        "label": "图表类型",
        "type": "radio",
        "default": "donut",
        "options": [
          {
            "value": "donut",
            "label": "环形"
          },
          {
            "value": "pie",
            "label": "饼图"
          }
        ],
        "desc": "占比图呈现方式：环形（中心显示重点）/ 饼图。"
      },
      {
        "key": "focusEnabled",
        "label": "重点类型",
        "type": "toggle",
        "default": true,
        "desc": "是否突出某一类型（环形中心显示该项）。"
      },
      {
        "key": "focusIndex",
        "label": "重点类型序号",
        "type": "slider",
        "default": 1,
        "min": 1,
        "max": 4,
        "step": 1,
        "desc": "被突出的投资人类型序号（从 1 起）。"
      },
      {
        "key": "showLegend",
        "label": "类型图例",
        "type": "toggle",
        "default": true,
        "desc": "环图右侧带占比的类型图例。"
      },
      {
        "key": "showTimeline",
        "label": "演进时间轴",
        "type": "toggle",
        "default": true,
        "desc": "底部的横向资本来源演进时间轴。"
      },
      {
        "key": "nodeCount",
        "label": "时间轴节点数",
        "type": "slider",
        "default": 4,
        "min": 2,
        "max": 4,
        "step": 1,
        "desc": "演进时间轴的节点数量。"
      },
      {
        "key": "timelineFocus",
        "label": "重点节点序号",
        "type": "slider",
        "default": 4,
        "min": 1,
        "max": 4,
        "step": 1,
        "desc": "被突出的时间轴节点序号（从 1 起）。"
      },
      {
        "key": "accentColor",
        "label": "强调色",
        "type": "color",
        "default": "#2c44a0",
        "options": [
          "#d8402e",
          "#e2742c",
          "#efbe2e",
          "#3c9a52",
          "#4da0c6",
          "#2c44a0",
          "#7a3c90"
        ],
        "desc": "眉标 / 环心数字 / 重点节点的强调色。"
      },
      {
        "key": "showConclusion",
        "label": "结论文案",
        "type": "toggle",
        "default": true,
        "desc": "底部的一句装饰性结论。"
      },
      {
        "key": "showSheetLabel",
        "label": "页码标签",
        "type": "toggle",
        "default": true,
        "desc": "右上角的页码 / 章节标签。"
      }
    ],
    "defaultProps": {
      "typeCount": 4,
      "chartType": "donut",
      "focusEnabled": true,
      "focusIndex": 1,
      "showLegend": true,
      "showTimeline": true,
      "nodeCount": 4,
      "timelineFocus": 4,
      "accentColor": "#2c44a0",
      "showConclusion": true,
      "showSheetLabel": true
    }
  },
  {
    "key": "theme05_page057",
    "themeKey": "theme05",
    "pageNumber": 57,
    "layout": "THEME05-057",
    "slot": "resource",
    "label": "资源类型 Resource",
    "bgClass": "",
    "controls": [
      {
        "key": "cardCount",
        "label": "卡片数量",
        "type": "slider",
        "default": 4,
        "min": 2,
        "max": 4,
        "step": 1,
        "desc": "资源类型卡数量（2–4）。"
      },
      {
        "key": "imageCount",
        "label": "图片槽数量",
        "type": "slider",
        "default": 1,
        "min": 0,
        "max": 3,
        "step": 1,
        "desc": "主视觉图片槽数量（0–3），按各图比例自适应。为 0 时卡片自动转两列网格、铺满整幅。"
      },
      {
        "key": "imageSide",
        "label": "图片位置",
        "type": "radio",
        "default": "right",
        "options": [
          {
            "value": "right",
            "label": "右侧"
          },
          {
            "value": "left",
            "label": "左侧"
          }
        ],
        "desc": "图片相对资源卡的位置（有图片时生效）。"
      },
      {
        "key": "showValue",
        "label": "卡内数值",
        "type": "toggle",
        "default": true,
        "desc": "各资源卡内的大号数值与单位。"
      },
      {
        "key": "focusEnabled",
        "label": "重点卡片",
        "type": "toggle",
        "default": true,
        "desc": "是否突出某一张资源卡（其余淡出）。"
      },
      {
        "key": "focusIndex",
        "label": "重点卡序号",
        "type": "slider",
        "default": 1,
        "min": 1,
        "max": 4,
        "step": 1,
        "desc": "被突出的资源卡序号（从 1 起）。"
      },
      {
        "key": "showLead",
        "label": "引导文案",
        "type": "toggle",
        "default": true,
        "desc": "标题下方的一段引导说明。"
      },
      {
        "key": "showMediaCaption",
        "label": "图注",
        "type": "toggle",
        "default": true,
        "desc": "图片区上方的装饰性图注。"
      },
      {
        "key": "accentColor",
        "label": "强调色",
        "type": "color",
        "default": "#d8402e",
        "options": [
          "#d8402e",
          "#e2742c",
          "#efbe2e",
          "#3c9a52",
          "#4da0c6",
          "#2c44a0",
          "#7a3c90"
        ],
        "desc": "眉标 / 重点标记的强调色。"
      },
      {
        "key": "showConclusion",
        "label": "结论文案",
        "type": "toggle",
        "default": true,
        "desc": "底部的一句装饰性结论。"
      },
      {
        "key": "showSheetLabel",
        "label": "页码标签",
        "type": "toggle",
        "default": true,
        "desc": "右上角的页码 / 章节标签。"
      }
    ],
    "defaultProps": {
      "cardCount": 4,
      "imageCount": 1,
      "imageSide": "right",
      "showValue": true,
      "focusEnabled": true,
      "focusIndex": 1,
      "showLead": true,
      "showMediaCaption": true,
      "accentColor": "#d8402e",
      "showConclusion": true,
      "showSheetLabel": true
    }
  },
  {
    "key": "theme05_page058",
    "themeKey": "theme05",
    "pageNumber": 58,
    "layout": "THEME05-058",
    "slot": "loop",
    "label": "投资闭环 Loop",
    "bgClass": "",
    "controls": [
      {
        "key": "nodeCount",
        "label": "联盟节点数",
        "type": "slider",
        "default": 4,
        "min": 2,
        "max": 4,
        "step": 1,
        "desc": "云厂商联盟条形的数量（2–4）。"
      },
      {
        "key": "focusEnabled",
        "label": "重点节点",
        "type": "toggle",
        "default": true,
        "desc": "是否突出某一条联盟条（其余淡出）。"
      },
      {
        "key": "focusIndex",
        "label": "重点节点序号",
        "type": "slider",
        "default": 1,
        "min": 1,
        "max": 4,
        "step": 1,
        "desc": "被突出的联盟条序号（按数值由高到低，从 1 起）。"
      },
      {
        "key": "showValue",
        "label": "条形数值",
        "type": "toggle",
        "default": true,
        "desc": "各联盟条末端的数值标注。"
      },
      {
        "key": "showLoop",
        "label": "闭环面板",
        "type": "toggle",
        "default": true,
        "desc": "右侧的资金—算力闭环面板（阶段 + 回流箭头）。"
      },
      {
        "key": "stageCount",
        "label": "闭环阶段数",
        "type": "slider",
        "default": 3,
        "min": 2,
        "max": 3,
        "step": 1,
        "desc": "闭环面板内的阶段数量（2–3）。"
      },
      {
        "key": "showReturn",
        "label": "回流箭头",
        "type": "toggle",
        "default": true,
        "desc": "闭环面板的「价值回流」回路箭头（构成可见闭环）。"
      },
      {
        "key": "accentColor",
        "label": "强调色",
        "type": "color",
        "default": "#e2742c",
        "options": [
          "#d8402e",
          "#e2742c",
          "#efbe2e",
          "#3c9a52",
          "#4da0c6",
          "#2c44a0",
          "#7a3c90"
        ],
        "desc": "眉标 / 重点条 / 闭环面板的强调色。"
      },
      {
        "key": "showConclusion",
        "label": "结论文案",
        "type": "toggle",
        "default": true,
        "desc": "底部的一句装饰性结论。"
      },
      {
        "key": "showSheetLabel",
        "label": "页码标签",
        "type": "toggle",
        "default": true,
        "desc": "右上角的页码 / 章节标签。"
      }
    ],
    "defaultProps": {
      "nodeCount": 4,
      "focusEnabled": true,
      "focusIndex": 1,
      "showValue": true,
      "showLoop": true,
      "stageCount": 3,
      "showReturn": true,
      "accentColor": "#e2742c",
      "showConclusion": true,
      "showSheetLabel": true
    }
  },
  {
    "key": "theme05_page059",
    "themeKey": "theme05",
    "pageNumber": 59,
    "layout": "THEME05-059",
    "slot": "orbit",
    "label": "生态环图 Orbit",
    "bgClass": "",
    "controls": [
      {
        "key": "nodeCount",
        "label": "卫星节点数",
        "type": "slider",
        "default": 4,
        "min": 2,
        "max": 4,
        "step": 1,
        "desc": "围绕核心的生态节点数量（2–4）。"
      },
      {
        "key": "imageCount",
        "label": "图片槽数量",
        "type": "slider",
        "default": 1,
        "min": 0,
        "max": 3,
        "step": 1,
        "desc": "主视觉图片槽数量（0–3），按各图比例自适应。为 0 时环图铺满整幅并显示侧栏图例。"
      },
      {
        "key": "imageSide",
        "label": "图片位置",
        "type": "radio",
        "default": "right",
        "options": [
          {
            "value": "right",
            "label": "右侧"
          },
          {
            "value": "left",
            "label": "左侧"
          }
        ],
        "desc": "图片相对环图的位置（有图片时生效）。"
      },
      {
        "key": "showSpokes",
        "label": "连接轨道",
        "type": "toggle",
        "default": true,
        "desc": "核心到各节点的放射连线与同心轨道环。"
      },
      {
        "key": "showValue",
        "label": "节点数值",
        "type": "toggle",
        "default": true,
        "desc": "各节点内的数值标注（节点尺寸已按数值缩放）。"
      },
      {
        "key": "focusEnabled",
        "label": "重点节点",
        "type": "toggle",
        "default": true,
        "desc": "是否突出某一个节点（其余淡出）。"
      },
      {
        "key": "focusIndex",
        "label": "重点节点序号",
        "type": "slider",
        "default": 1,
        "min": 1,
        "max": 4,
        "step": 1,
        "desc": "被突出的节点序号（从 1 起）。"
      },
      {
        "key": "showMediaCaption",
        "label": "图注",
        "type": "toggle",
        "default": true,
        "desc": "图片区上方的装饰性图注。"
      },
      {
        "key": "accentColor",
        "label": "强调色",
        "type": "color",
        "default": "#3c9a52",
        "options": [
          "#d8402e",
          "#e2742c",
          "#efbe2e",
          "#3c9a52",
          "#4da0c6",
          "#2c44a0",
          "#7a3c90"
        ],
        "desc": "眉标 / 核心 / 重点节点的强调色。"
      },
      {
        "key": "showConclusion",
        "label": "结论文案",
        "type": "toggle",
        "default": true,
        "desc": "底部的一句装饰性结论。"
      },
      {
        "key": "showSheetLabel",
        "label": "页码标签",
        "type": "toggle",
        "default": true,
        "desc": "右上角的页码 / 章节标签。"
      }
    ],
    "defaultProps": {
      "nodeCount": 4,
      "imageCount": 1,
      "imageSide": "right",
      "showSpokes": true,
      "showValue": true,
      "focusEnabled": true,
      "focusIndex": 1,
      "showMediaCaption": true,
      "accentColor": "#3c9a52",
      "showConclusion": true,
      "showSheetLabel": true
    }
  },
  {
    "key": "theme05_page060",
    "themeKey": "theme05",
    "pageNumber": 60,
    "layout": "THEME05-060",
    "slot": "dominance",
    "label": "占比大数字 Dominance",
    "bgClass": "",
    "controls": [
      {
        "key": "showGauge",
        "label": "份额量规",
        "type": "toggle",
        "default": true,
        "desc": "右侧把主数字渲染成「部分-整体」的占比量规。"
      },
      {
        "key": "gaugeStyle",
        "label": "量规样式",
        "type": "radio",
        "default": "bar",
        "options": [
          {
            "value": "bar",
            "label": "竖向占比"
          },
          {
            "value": "grid",
            "label": "点阵"
          }
        ],
        "desc": "占比量规呈现：竖向填充条 / 10×10 点阵。"
      },
      {
        "key": "numberAlign",
        "label": "数字对齐",
        "type": "radio",
        "default": "left",
        "options": [
          {
            "value": "left",
            "label": "左对齐"
          },
          {
            "value": "center",
            "label": "居中"
          }
        ],
        "desc": "主数字块的对齐方式（关闭量规时整幅居中更佳）。"
      },
      {
        "key": "auxCount",
        "label": "辅助指标数",
        "type": "slider",
        "default": 3,
        "min": 0,
        "max": 3,
        "step": 1,
        "desc": "主数字下方的支撑指标数量（0 隐藏整行）。"
      },
      {
        "key": "showUnit",
        "label": "数字单位",
        "type": "toggle",
        "default": true,
        "desc": "主数字后的单位后缀。"
      },
      {
        "key": "showCaption",
        "label": "数字说明",
        "type": "toggle",
        "default": true,
        "desc": "主数字下方的解释说明。"
      },
      {
        "key": "showMessage",
        "label": "支撑文案",
        "type": "toggle",
        "default": true,
        "desc": "说明下方的一段支撑性文案。"
      },
      {
        "key": "accentColor",
        "label": "强调色",
        "type": "color",
        "default": "#2c44a0",
        "options": [
          "#d8402e",
          "#e2742c",
          "#efbe2e",
          "#3c9a52",
          "#4da0c6",
          "#2c44a0",
          "#7a3c90"
        ],
        "desc": "主数字 / 眉标 / 量规填充的强调色。"
      },
      {
        "key": "showWordmark",
        "label": "品牌标识",
        "type": "toggle",
        "default": true,
        "desc": "左下角的 PULSE 品牌标识。"
      },
      {
        "key": "showColorBand",
        "label": "装饰色谱条",
        "type": "toggle",
        "default": true,
        "desc": "右下角的装饰性 TR-808 色谱条。"
      },
      {
        "key": "showSheetLabel",
        "label": "页码标签",
        "type": "toggle",
        "default": true,
        "desc": "右上角的页码 / 章节标签。"
      }
    ],
    "defaultProps": {
      "showGauge": true,
      "gaugeStyle": "bar",
      "numberAlign": "left",
      "auxCount": 3,
      "showUnit": true,
      "showCaption": true,
      "showMessage": true,
      "accentColor": "#2c44a0",
      "showWordmark": true,
      "showColorBand": true,
      "showSheetLabel": true
    }
  },
  {
    "key": "theme05_page061",
    "themeKey": "theme05",
    "pageNumber": 61,
    "layout": "THEME05-061",
    "slot": "region",
    "label": "地理身份 Region",
    "bgClass": "",
    "controls": [
      {
        "key": "imageCount",
        "label": "图片槽数量",
        "type": "slider",
        "default": 1,
        "min": 0,
        "max": 3,
        "step": 1,
        "desc": "主视觉图片槽数量（0–3），按各图比例自适应。为 0 时身份卡铺满整幅、指标转两列。"
      },
      {
        "key": "imageSide",
        "label": "图片位置",
        "type": "radio",
        "default": "right",
        "options": [
          {
            "value": "right",
            "label": "右侧"
          },
          {
            "value": "left",
            "label": "左侧"
          }
        ],
        "desc": "图片相对身份卡的位置（有图片时生效）。"
      },
      {
        "key": "cardTheme",
        "label": "身份卡主题",
        "type": "radio",
        "default": "paper",
        "options": [
          {
            "value": "paper",
            "label": "纸色"
          },
          {
            "value": "dark",
            "label": "深色"
          },
          {
            "value": "color",
            "label": "色块"
          }
        ],
        "desc": "身份卡背景：纸色 / 深色 / 强调色块。"
      },
      {
        "key": "metricCount",
        "label": "指标行数",
        "type": "slider",
        "default": 4,
        "min": 2,
        "max": 4,
        "step": 1,
        "desc": "身份卡内的指标行数。"
      },
      {
        "key": "tagCount",
        "label": "标签数量",
        "type": "slider",
        "default": 4,
        "min": 0,
        "max": 4,
        "step": 1,
        "desc": "行业 / 主题标签 chip 数量（0 隐藏整行）。"
      },
      {
        "key": "showLocator",
        "label": "定位标签",
        "type": "toggle",
        "default": true,
        "desc": "地名下方的方位 / 坐标定位标签。"
      },
      {
        "key": "focusEnabled",
        "label": "重点指标",
        "type": "toggle",
        "default": false,
        "desc": "是否突出某一条指标行。"
      },
      {
        "key": "focusIndex",
        "label": "重点指标序号",
        "type": "slider",
        "default": 1,
        "min": 1,
        "max": 4,
        "step": 1,
        "desc": "被突出的指标行序号（从 1 起）。"
      },
      {
        "key": "showLead",
        "label": "引导文案",
        "type": "toggle",
        "default": true,
        "desc": "地名下方的一段引导说明。"
      },
      {
        "key": "showMediaCaption",
        "label": "图注",
        "type": "toggle",
        "default": true,
        "desc": "图片区上方的装饰性图注。"
      },
      {
        "key": "accentColor",
        "label": "强调色",
        "type": "color",
        "default": "#2c44a0",
        "options": [
          "#d8402e",
          "#e2742c",
          "#efbe2e",
          "#3c9a52",
          "#4da0c6",
          "#2c44a0",
          "#7a3c90"
        ],
        "desc": "眉标 / 强调条 /「色块」主题身份卡的颜色。"
      },
      {
        "key": "showConclusion",
        "label": "结论文案",
        "type": "toggle",
        "default": true,
        "desc": "底部的一句装饰性结论。"
      },
      {
        "key": "showSheetLabel",
        "label": "页码标签",
        "type": "toggle",
        "default": true,
        "desc": "右上角的页码 / 章节标签。"
      }
    ],
    "defaultProps": {
      "imageCount": 1,
      "imageSide": "right",
      "cardTheme": "paper",
      "metricCount": 4,
      "tagCount": 4,
      "showLocator": true,
      "focusEnabled": false,
      "focusIndex": 1,
      "showLead": true,
      "showMediaCaption": true,
      "accentColor": "#2c44a0",
      "showConclusion": true,
      "showSheetLabel": true
    }
  },
  {
    "key": "theme05_page062",
    "themeKey": "theme05",
    "pageNumber": 62,
    "layout": "THEME05-062",
    "slot": "locale",
    "label": "区域定位 Locale",
    "bgClass": "",
    "controls": [
      {
        "key": "imageCount",
        "label": "图片槽数量",
        "type": "slider",
        "default": 1,
        "min": 0,
        "max": 3,
        "step": 1,
        "desc": "主视觉图片槽数量（0–3），按各图比例自适应。为 0 时定位图铺满整幅并显示侧栏图例。"
      },
      {
        "key": "imageSide",
        "label": "图片位置",
        "type": "radio",
        "default": "left",
        "options": [
          {
            "value": "right",
            "label": "右侧"
          },
          {
            "value": "left",
            "label": "左侧"
          }
        ],
        "desc": "图片相对定位图的位置（有图片时生效）。"
      },
      {
        "key": "mosaicCols",
        "label": "网格列数",
        "type": "slider",
        "default": 7,
        "min": 5,
        "max": 9,
        "step": 1,
        "desc": "定位图的网格列数。"
      },
      {
        "key": "mosaicRows",
        "label": "网格行数",
        "type": "slider",
        "default": 4,
        "min": 3,
        "max": 6,
        "step": 1,
        "desc": "定位图的网格行数。"
      },
      {
        "key": "markerIndex",
        "label": "定位格序号",
        "type": "slider",
        "default": 4,
        "min": 1,
        "max": 54,
        "step": 1,
        "desc": "被标记为本集群的网格单元序号（按行优先，自动收敛到网格范围内）。"
      },
      {
        "key": "showPeers",
        "label": "邻近区域",
        "type": "toggle",
        "default": true,
        "desc": "网格内装饰性的邻近区域 tinted 单元。"
      },
      {
        "key": "peerCount",
        "label": "邻近区域数",
        "type": "slider",
        "default": 6,
        "min": 0,
        "max": 10,
        "step": 1,
        "desc": "邻近区域 tinted 单元的数量。"
      },
      {
        "key": "metricCount",
        "label": "指标项数",
        "type": "slider",
        "default": 4,
        "min": 2,
        "max": 4,
        "step": 1,
        "desc": "顶部指标条的指标数量。"
      },
      {
        "key": "tagCount",
        "label": "标签数量",
        "type": "slider",
        "default": 4,
        "min": 0,
        "max": 4,
        "step": 1,
        "desc": "主题标签 chip 数量（0 隐藏整行）。"
      },
      {
        "key": "showLead",
        "label": "引导文案",
        "type": "toggle",
        "default": true,
        "desc": "标题下方的一段引导说明。"
      },
      {
        "key": "showMediaCaption",
        "label": "图注",
        "type": "toggle",
        "default": true,
        "desc": "图片区上方的装饰性图注。"
      },
      {
        "key": "accentColor",
        "label": "强调色",
        "type": "color",
        "default": "#4da0c6",
        "options": [
          "#d8402e",
          "#e2742c",
          "#efbe2e",
          "#3c9a52",
          "#4da0c6",
          "#2c44a0",
          "#7a3c90"
        ],
        "desc": "眉标 / 定位格 / 指标的强调色。"
      },
      {
        "key": "showConclusion",
        "label": "结论文案",
        "type": "toggle",
        "default": true,
        "desc": "底部的一句装饰性结论。"
      },
      {
        "key": "showSheetLabel",
        "label": "页码标签",
        "type": "toggle",
        "default": true,
        "desc": "右上角的页码 / 章节标签。"
      }
    ],
    "defaultProps": {
      "imageCount": 1,
      "imageSide": "left",
      "mosaicCols": 7,
      "mosaicRows": 4,
      "markerIndex": 4,
      "showPeers": true,
      "peerCount": 6,
      "metricCount": 4,
      "tagCount": 4,
      "showLead": true,
      "showMediaCaption": true,
      "accentColor": "#4da0c6",
      "showConclusion": true,
      "showSheetLabel": true
    }
  },
  {
    "key": "theme05_page063",
    "themeKey": "theme05",
    "pageNumber": 63,
    "layout": "THEME05-063",
    "slot": "profile",
    "label": "图像主视觉 Profile",
    "bgClass": "",
    "controls": [
      {
        "key": "imageCount",
        "label": "图片槽数量",
        "type": "slider",
        "default": 1,
        "min": 0,
        "max": 3,
        "step": 1,
        "desc": "主视觉图片槽数量（0–3），按各图比例自适应。为 0 时数据列铺满整幅、主指标放大。"
      },
      {
        "key": "imageSide",
        "label": "图片位置",
        "type": "radio",
        "default": "left",
        "options": [
          {
            "value": "left",
            "label": "左侧"
          },
          {
            "value": "right",
            "label": "右侧"
          }
        ],
        "desc": "图片相对数据列的位置（有图片时生效）。"
      },
      {
        "key": "heroIndex",
        "label": "主指标序号",
        "type": "slider",
        "default": 1,
        "min": 1,
        "max": 4,
        "step": 1,
        "desc": "作为巨号主指标突出显示的指标序号（从 1 起）。"
      },
      {
        "key": "metricCount",
        "label": "指标项数",
        "type": "slider",
        "default": 4,
        "min": 2,
        "max": 4,
        "step": 1,
        "desc": "参与显示的指标数量（主指标 + 阶梯）。"
      },
      {
        "key": "showLadderIndex",
        "label": "阶梯序号",
        "type": "toggle",
        "default": true,
        "desc": "阶梯指标行左侧的两位序号。"
      },
      {
        "key": "tagCount",
        "label": "标签数量",
        "type": "slider",
        "default": 4,
        "min": 0,
        "max": 4,
        "step": 1,
        "desc": "主题标签 chip 数量（0 隐藏整行）。"
      },
      {
        "key": "showLead",
        "label": "引导文案",
        "type": "toggle",
        "default": true,
        "desc": "地名下方的一段引导说明。"
      },
      {
        "key": "showMediaCaption",
        "label": "图注",
        "type": "toggle",
        "default": true,
        "desc": "图片区上方的装饰性图注。"
      },
      {
        "key": "accentColor",
        "label": "强调色",
        "type": "color",
        "default": "#7a3c90",
        "options": [
          "#d8402e",
          "#e2742c",
          "#efbe2e",
          "#3c9a52",
          "#4da0c6",
          "#2c44a0",
          "#7a3c90"
        ],
        "desc": "眉标 / 主指标 / 强调条的强调色。"
      },
      {
        "key": "showConclusion",
        "label": "结论文案",
        "type": "toggle",
        "default": true,
        "desc": "底部的一句装饰性结论。"
      },
      {
        "key": "showSheetLabel",
        "label": "页码标签",
        "type": "toggle",
        "default": true,
        "desc": "右上角的页码 / 章节标签。"
      }
    ],
    "defaultProps": {
      "imageCount": 1,
      "imageSide": "left",
      "heroIndex": 1,
      "metricCount": 4,
      "showLadderIndex": true,
      "tagCount": 4,
      "showLead": true,
      "showMediaCaption": true,
      "accentColor": "#7a3c90",
      "showConclusion": true,
      "showSheetLabel": true
    }
  },
  {
    "key": "theme05_page064",
    "themeKey": "theme05",
    "pageNumber": 64,
    "layout": "THEME05-064",
    "slot": "spread",
    "label": "区域分布 Spread",
    "bgClass": "",
    "controls": [
      {
        "key": "cols",
        "label": "网格列数",
        "type": "slider",
        "default": 12,
        "min": 8,
        "max": 16,
        "step": 1,
        "desc": "分布点阵的列数。"
      },
      {
        "key": "rows",
        "label": "网格行数",
        "type": "slider",
        "default": 6,
        "min": 4,
        "max": 8,
        "step": 1,
        "desc": "分布点阵的行数。"
      },
      {
        "key": "activeCount",
        "label": "活跃单元数",
        "type": "slider",
        "default": 26,
        "min": 6,
        "max": 60,
        "step": 1,
        "desc": "被点亮（有落地）的单元数量，散布呈现分散度（自动收敛到网格容量内）。"
      },
      {
        "key": "categoryCount",
        "label": "类别数量",
        "type": "slider",
        "default": 4,
        "min": 2,
        "max": 4,
        "step": 1,
        "desc": "活跃单元的类别（配色 / 图例）数量。"
      },
      {
        "key": "focusEnabled",
        "label": "重点类别",
        "type": "toggle",
        "default": false,
        "desc": "是否突出某一类别（其余单元淡出）。"
      },
      {
        "key": "focusIndex",
        "label": "重点类别序号",
        "type": "slider",
        "default": 1,
        "min": 1,
        "max": 4,
        "step": 1,
        "desc": "被突出的类别序号（从 1 起）。"
      },
      {
        "key": "showLegend",
        "label": "类别图例",
        "type": "toggle",
        "default": true,
        "desc": "右侧带单元计数的类别图例。"
      },
      {
        "key": "showCounts",
        "label": "图例计数",
        "type": "toggle",
        "default": true,
        "desc": "图例中各类别的活跃单元计数。"
      },
      {
        "key": "showMetrics",
        "label": "头部指标",
        "type": "toggle",
        "default": true,
        "desc": "引导文案右侧的一对头部指标。"
      },
      {
        "key": "imageCount",
        "label": "图片槽数量",
        "type": "slider",
        "default": 0,
        "min": 0,
        "max": 2,
        "step": 1,
        "desc": "可选图片槽数量（0–2），按比例自适应；为 0 时不显示图片。"
      },
      {
        "key": "accentColor",
        "label": "强调色",
        "type": "color",
        "default": "#e2742c",
        "options": [
          "#d8402e",
          "#e2742c",
          "#efbe2e",
          "#3c9a52",
          "#4da0c6",
          "#2c44a0",
          "#7a3c90"
        ],
        "desc": "眉标 / 头部指标的强调色。"
      },
      {
        "key": "showConclusion",
        "label": "结论文案",
        "type": "toggle",
        "default": true,
        "desc": "底部的一句装饰性结论。"
      },
      {
        "key": "showSheetLabel",
        "label": "页码标签",
        "type": "toggle",
        "default": true,
        "desc": "右上角的页码 / 章节标签。"
      }
    ],
    "defaultProps": {
      "cols": 12,
      "rows": 6,
      "activeCount": 26,
      "categoryCount": 4,
      "focusEnabled": false,
      "focusIndex": 1,
      "showLegend": true,
      "showCounts": true,
      "showMetrics": true,
      "imageCount": 0,
      "accentColor": "#e2742c",
      "showConclusion": true,
      "showSheetLabel": true
    }
  },
  {
    "key": "theme05_page065",
    "themeKey": "theme05",
    "pageNumber": 65,
    "layout": "THEME05-065",
    "slot": "triad",
    "label": "三类资源 Triad",
    "bgClass": "",
    "controls": [
      {
        "key": "theme",
        "label": "页面主题",
        "type": "radio",
        "default": "paper",
        "options": [
          {
            "value": "paper",
            "label": "纸色"
          },
          {
            "value": "dark",
            "label": "深色"
          },
          {
            "value": "color",
            "label": "色块"
          }
        ],
        "desc": "整页背景：纸色 / 深色 / 整页强调色块。"
      },
      {
        "key": "bgColor",
        "label": "色块背景",
        "type": "color",
        "default": "#2c44a0",
        "options": [
          "#d8402e",
          "#e2742c",
          "#efbe2e",
          "#3c9a52",
          "#4da0c6",
          "#2c44a0",
          "#7a3c90"
        ],
        "desc": "「色块」主题下的整页背景色。"
      },
      {
        "key": "pillarCount",
        "label": "支柱数量",
        "type": "slider",
        "default": 3,
        "min": 2,
        "max": 3,
        "step": 1,
        "desc": "底部概念支柱块的数量（2–3）。"
      },
      {
        "key": "focusEnabled",
        "label": "重点支柱",
        "type": "toggle",
        "default": false,
        "desc": "是否突出某一支柱（其余淡出）。"
      },
      {
        "key": "focusIndex",
        "label": "重点支柱序号",
        "type": "slider",
        "default": 1,
        "min": 1,
        "max": 3,
        "step": 1,
        "desc": "被突出的支柱序号（从 1 起）。"
      },
      {
        "key": "showRoman",
        "label": "支柱编号",
        "type": "toggle",
        "default": true,
        "desc": "各支柱角上的罗马数字编号。"
      },
      {
        "key": "showGhost",
        "label": "装饰数字",
        "type": "toggle",
        "default": true,
        "desc": "背景超大半透明装饰数字。"
      },
      {
        "key": "emphasis",
        "label": "关键词高亮",
        "type": "toggle",
        "default": true,
        "desc": "金句中关键词的强调色高亮。"
      },
      {
        "key": "accentColor",
        "label": "强调色",
        "type": "color",
        "default": "#d8402e",
        "options": [
          "#d8402e",
          "#e2742c",
          "#efbe2e",
          "#3c9a52",
          "#4da0c6",
          "#2c44a0",
          "#7a3c90"
        ],
        "desc": "眉标 / 关键词 / 装饰数字的强调色。"
      },
      {
        "key": "showSub",
        "label": "辅助说明",
        "type": "toggle",
        "default": true,
        "desc": "金句下方的一句辅助说明。"
      },
      {
        "key": "showColorBand",
        "label": "色谱条",
        "type": "toggle",
        "default": true,
        "desc": "右下角的小色谱条。"
      },
      {
        "key": "showSheetLabel",
        "label": "页码标签",
        "type": "toggle",
        "default": true,
        "desc": "右上角的页码 / 章节标签。"
      }
    ],
    "defaultProps": {
      "theme": "paper",
      "bgColor": "#2c44a0",
      "pillarCount": 3,
      "focusEnabled": false,
      "focusIndex": 1,
      "showRoman": true,
      "showGhost": true,
      "emphasis": true,
      "accentColor": "#d8402e",
      "showSub": true,
      "showColorBand": true,
      "showSheetLabel": true
    }
  },
  {
    "key": "theme05_page066",
    "themeKey": "theme05",
    "pageNumber": 66,
    "layout": "THEME05-066",
    "slot": "benchmark",
    "label": "标杆案例 Benchmark",
    "bgClass": "",
    "controls": [
      {
        "key": "imageCount",
        "label": "图片槽数量",
        "type": "slider",
        "default": 1,
        "min": 0,
        "max": 2,
        "step": 1,
        "desc": "图片槽数量（0–2），按各图比例自适应排布；为 0 时主体卡铺满整幅、指标转两列。"
      },
      {
        "key": "imageSide",
        "label": "图片位置",
        "type": "radio",
        "default": "right",
        "options": [
          {
            "value": "right",
            "label": "右侧"
          },
          {
            "value": "left",
            "label": "左侧"
          }
        ],
        "desc": "图片相对主体卡的位置（有图片时生效）。"
      },
      {
        "key": "metricCount",
        "label": "指标行数",
        "type": "slider",
        "default": 3,
        "min": 2,
        "max": 4,
        "step": 1,
        "desc": "主体卡内的大号指标行数。"
      },
      {
        "key": "cardTheme",
        "label": "主体卡主题",
        "type": "radio",
        "default": "color",
        "options": [
          {
            "value": "color",
            "label": "色块"
          },
          {
            "value": "dark",
            "label": "深色"
          },
          {
            "value": "paper",
            "label": "纸色"
          }
        ],
        "desc": "主体卡背景：强调色块 / 深色 / 纸色。"
      },
      {
        "key": "showBadge",
        "label": "角标",
        "type": "toggle",
        "default": true,
        "desc": "主体卡右上角的标杆角标。"
      },
      {
        "key": "showLead",
        "label": "引导说明",
        "type": "toggle",
        "default": true,
        "desc": "标题下方的一句引导说明。"
      },
      {
        "key": "showGalleryCaption",
        "label": "图注",
        "type": "toggle",
        "default": true,
        "desc": "图片区上方的装饰性图注。"
      },
      {
        "key": "accentColor",
        "label": "强调色",
        "type": "color",
        "default": "#3c9a52",
        "options": [
          "#d8402e",
          "#e2742c",
          "#efbe2e",
          "#3c9a52",
          "#4da0c6",
          "#2c44a0",
          "#7a3c90"
        ],
        "desc": "眉标 / 角标 /「色块」主题下主体卡的颜色。"
      },
      {
        "key": "showConclusion",
        "label": "结论文案",
        "type": "toggle",
        "default": true,
        "desc": "底部的一句装饰性结论。"
      },
      {
        "key": "showSheetLabel",
        "label": "页码标签",
        "type": "toggle",
        "default": true,
        "desc": "右上角的页码 / 章节标签。"
      }
    ],
    "defaultProps": {
      "imageCount": 1,
      "imageSide": "right",
      "metricCount": 3,
      "cardTheme": "color",
      "showBadge": true,
      "showLead": true,
      "showGalleryCaption": true,
      "accentColor": "#3c9a52",
      "showConclusion": true,
      "showSheetLabel": true
    }
  },
  {
    "key": "theme05_page067",
    "themeKey": "theme05",
    "pageNumber": 67,
    "layout": "THEME05-067",
    "slot": "dossier",
    "label": "档案卡 Dossier",
    "bgClass": "",
    "controls": [
      {
        "key": "imageCount",
        "label": "图片槽数量",
        "type": "slider",
        "default": 1,
        "min": 0,
        "max": 2,
        "step": 1,
        "desc": "图片槽数量（0–2），按各图比例自适应排布；为 0 时主体卡铺满整幅、明细转两列。"
      },
      {
        "key": "imageSide",
        "label": "图片位置",
        "type": "radio",
        "default": "right",
        "options": [
          {
            "value": "right",
            "label": "右侧"
          },
          {
            "value": "left",
            "label": "左侧"
          }
        ],
        "desc": "图片相对主体卡的位置（有图片时生效）。"
      },
      {
        "key": "tagCount",
        "label": "标签数量",
        "type": "slider",
        "default": 3,
        "min": 0,
        "max": 4,
        "step": 1,
        "desc": "关键词标签 chip 数量（0 隐藏整条）。"
      },
      {
        "key": "metricCount",
        "label": "明细行数",
        "type": "slider",
        "default": 4,
        "min": 2,
        "max": 4,
        "step": 1,
        "desc": "主体卡内的指标明细行数。"
      },
      {
        "key": "cardTheme",
        "label": "主体卡主题",
        "type": "radio",
        "default": "dark",
        "options": [
          {
            "value": "dark",
            "label": "深色"
          },
          {
            "value": "color",
            "label": "色块"
          },
          {
            "value": "paper",
            "label": "纸色"
          }
        ],
        "desc": "主体卡背景：深色 / 强调色块 / 纸色。"
      },
      {
        "key": "focusEnabled",
        "label": "重点明细",
        "type": "toggle",
        "default": false,
        "desc": "是否突出某一条明细行。"
      },
      {
        "key": "focusIndex",
        "label": "重点行序号",
        "type": "slider",
        "default": 1,
        "min": 1,
        "max": 4,
        "step": 1,
        "desc": "被突出的明细行序号（从 1 起）。"
      },
      {
        "key": "showLead",
        "label": "引导说明",
        "type": "toggle",
        "default": true,
        "desc": "标题下方的一句引导说明。"
      },
      {
        "key": "showGalleryCaption",
        "label": "图注",
        "type": "toggle",
        "default": true,
        "desc": "图片区上方的装饰性图注。"
      },
      {
        "key": "accentColor",
        "label": "强调色",
        "type": "color",
        "default": "#efbe2e",
        "options": [
          "#d8402e",
          "#e2742c",
          "#efbe2e",
          "#3c9a52",
          "#4da0c6",
          "#2c44a0",
          "#7a3c90"
        ],
        "desc": "眉标 /「色块」主题下主体卡的颜色。"
      },
      {
        "key": "showConclusion",
        "label": "结论文案",
        "type": "toggle",
        "default": true,
        "desc": "底部的一句装饰性结论。"
      },
      {
        "key": "showSheetLabel",
        "label": "页码标签",
        "type": "toggle",
        "default": true,
        "desc": "右上角的页码 / 章节标签。"
      }
    ],
    "defaultProps": {
      "imageCount": 1,
      "imageSide": "right",
      "tagCount": 3,
      "metricCount": 4,
      "cardTheme": "dark",
      "focusEnabled": false,
      "focusIndex": 1,
      "showLead": true,
      "showGalleryCaption": true,
      "accentColor": "#efbe2e",
      "showConclusion": true,
      "showSheetLabel": true
    }
  },
  {
    "key": "theme05_page068",
    "themeKey": "theme05",
    "pageNumber": 68,
    "layout": "THEME05-068",
    "slot": "nexus",
    "label": "生态连接 Nexus",
    "bgClass": "",
    "controls": [
      {
        "key": "imageCount",
        "label": "图片槽数量",
        "type": "slider",
        "default": 1,
        "min": 0,
        "max": 2,
        "step": 1,
        "desc": "图片槽数量（0–2），按各图比例自适应排布；为 0 时主体卡铺满整幅。"
      },
      {
        "key": "imageSide",
        "label": "图片位置",
        "type": "radio",
        "default": "right",
        "options": [
          {
            "value": "right",
            "label": "右侧"
          },
          {
            "value": "left",
            "label": "左侧"
          }
        ],
        "desc": "图片相对主体卡的位置（有图片时生效）。"
      },
      {
        "key": "nodeCount",
        "label": "生态节点数",
        "type": "slider",
        "default": 4,
        "min": 2,
        "max": 4,
        "step": 1,
        "desc": "连接带中围绕中枢的生态节点数量。"
      },
      {
        "key": "showSpokes",
        "label": "连接连线",
        "type": "toggle",
        "default": true,
        "desc": "中枢到各节点的放射连线。"
      },
      {
        "key": "focusEnabled",
        "label": "重点节点",
        "type": "toggle",
        "default": false,
        "desc": "是否突出某一节点（其余淡出）。"
      },
      {
        "key": "focusIndex",
        "label": "重点节点序号",
        "type": "slider",
        "default": 1,
        "min": 1,
        "max": 4,
        "step": 1,
        "desc": "被突出的节点序号（从 1 起）。"
      },
      {
        "key": "metricCount",
        "label": "指标数量",
        "type": "slider",
        "default": 2,
        "min": 1,
        "max": 2,
        "step": 1,
        "desc": "主体卡内的关键指标对数量。"
      },
      {
        "key": "cardTheme",
        "label": "主体卡主题",
        "type": "radio",
        "default": "color",
        "options": [
          {
            "value": "color",
            "label": "色块"
          },
          {
            "value": "dark",
            "label": "深色"
          },
          {
            "value": "paper",
            "label": "纸色"
          }
        ],
        "desc": "主体卡背景：强调色块 / 深色 / 纸色。"
      },
      {
        "key": "showLead",
        "label": "引导说明",
        "type": "toggle",
        "default": true,
        "desc": "标题下方的一句引导说明。"
      },
      {
        "key": "showGalleryCaption",
        "label": "图注",
        "type": "toggle",
        "default": true,
        "desc": "图片区上方的装饰性图注。"
      },
      {
        "key": "accentColor",
        "label": "强调色",
        "type": "color",
        "default": "#4da0c6",
        "options": [
          "#d8402e",
          "#e2742c",
          "#efbe2e",
          "#3c9a52",
          "#4da0c6",
          "#2c44a0",
          "#7a3c90"
        ],
        "desc": "眉标 / 重点节点 /「色块」主题下主体卡的颜色。"
      },
      {
        "key": "showConclusion",
        "label": "结论文案",
        "type": "toggle",
        "default": true,
        "desc": "底部的一句装饰性结论。"
      },
      {
        "key": "showSheetLabel",
        "label": "页码标签",
        "type": "toggle",
        "default": true,
        "desc": "右上角的页码 / 章节标签。"
      }
    ],
    "defaultProps": {
      "imageCount": 1,
      "imageSide": "right",
      "nodeCount": 4,
      "showSpokes": true,
      "focusEnabled": false,
      "focusIndex": 1,
      "metricCount": 2,
      "cardTheme": "color",
      "showLead": true,
      "showGalleryCaption": true,
      "accentColor": "#4da0c6",
      "showConclusion": true,
      "showSheetLabel": true
    }
  },
  {
    "key": "theme05_page069",
    "themeKey": "theme05",
    "pageNumber": 69,
    "layout": "THEME05-069",
    "slot": "foundry",
    "label": "算力集群 Foundry",
    "bgClass": "",
    "controls": [
      {
        "key": "imageCount",
        "label": "图片槽数量",
        "type": "slider",
        "default": 1,
        "min": 0,
        "max": 3,
        "step": 1,
        "desc": "图片槽数量（0–3），按各图比例自适应排布；为 0 时主体卡铺满整幅、指标转两列。"
      },
      {
        "key": "imageSide",
        "label": "图片位置",
        "type": "radio",
        "default": "right",
        "options": [
          {
            "value": "right",
            "label": "右侧"
          },
          {
            "value": "left",
            "label": "左侧"
          }
        ],
        "desc": "图片相对主体卡的位置（有图片时生效）。"
      },
      {
        "key": "metricCount",
        "label": "指标行数",
        "type": "slider",
        "default": 4,
        "min": 2,
        "max": 4,
        "step": 1,
        "desc": "主体卡内的大号指标行数。"
      },
      {
        "key": "cardTheme",
        "label": "主体卡主题",
        "type": "radio",
        "default": "dark",
        "options": [
          {
            "value": "dark",
            "label": "深色"
          },
          {
            "value": "color",
            "label": "色块"
          },
          {
            "value": "paper",
            "label": "纸色"
          }
        ],
        "desc": "主体卡背景：深色 / 强调色块 / 纸色。"
      },
      {
        "key": "showRack",
        "label": "集群栅格",
        "type": "toggle",
        "default": true,
        "desc": "底部 GPU 集群占用栅格带（关闭则隐藏整条）。"
      },
      {
        "key": "rackColumnCount",
        "label": "集群列数",
        "type": "slider",
        "default": 8,
        "min": 4,
        "max": 14,
        "step": 1,
        "desc": "集群栅格的列（机柜）数量。"
      },
      {
        "key": "rackFill",
        "label": "占用率",
        "type": "slider",
        "default": 72,
        "min": 20,
        "max": 100,
        "step": 1,
        "desc": "被占用单元比例（同时作为巨号占用率读数）。"
      },
      {
        "key": "focusEnabled",
        "label": "重点列",
        "type": "toggle",
        "default": true,
        "desc": "是否突出某一列（满载并以强调色着色）。"
      },
      {
        "key": "focusIndex",
        "label": "重点列序号",
        "type": "slider",
        "default": 3,
        "min": 1,
        "max": 14,
        "step": 1,
        "desc": "被突出的集群列序号（从 1 起）。"
      },
      {
        "key": "showLead",
        "label": "引导说明",
        "type": "toggle",
        "default": true,
        "desc": "标题下方的一句引导说明。"
      },
      {
        "key": "showGalleryCaption",
        "label": "图注",
        "type": "toggle",
        "default": true,
        "desc": "图片区上方的装饰性图注。"
      },
      {
        "key": "accentColor",
        "label": "强调色",
        "type": "color",
        "default": "#d8402e",
        "options": [
          "#d8402e",
          "#e2742c",
          "#efbe2e",
          "#3c9a52",
          "#4da0c6",
          "#2c44a0",
          "#7a3c90"
        ],
        "desc": "眉标 / 占用单元 /「色块」主题下主体卡的颜色。"
      },
      {
        "key": "showConclusion",
        "label": "结论文案",
        "type": "toggle",
        "default": true,
        "desc": "底部的一句装饰性结论。"
      },
      {
        "key": "showSheetLabel",
        "label": "页码标签",
        "type": "toggle",
        "default": true,
        "desc": "右上角的页码 / 章节标签。"
      }
    ],
    "defaultProps": {
      "imageCount": 1,
      "imageSide": "right",
      "metricCount": 4,
      "cardTheme": "dark",
      "showRack": true,
      "rackColumnCount": 8,
      "rackFill": 72,
      "focusEnabled": true,
      "focusIndex": 3,
      "showLead": true,
      "showGalleryCaption": true,
      "accentColor": "#d8402e",
      "showConclusion": true,
      "showSheetLabel": true
    }
  },
  {
    "key": "theme05_page070",
    "themeKey": "theme05",
    "pageNumber": 70,
    "layout": "THEME05-070",
    "slot": "process",
    "label": "流程表 Process",
    "bgClass": "",
    "controls": [
      {
        "key": "rowCount",
        "label": "数据行数",
        "type": "slider",
        "default": 4,
        "min": 2,
        "max": 4,
        "step": 1,
        "desc": "表格的数据行数量。"
      },
      {
        "key": "showProcess",
        "label": "流程带",
        "type": "toggle",
        "default": true,
        "desc": "表格上方的数据流程管线带（关闭则隐藏整条）。"
      },
      {
        "key": "stageCount",
        "label": "流程节点数",
        "type": "slider",
        "default": 4,
        "min": 2,
        "max": 4,
        "step": 1,
        "desc": "流程管线的阶段（节点）数量。"
      },
      {
        "key": "stageFocus",
        "label": "重点节点",
        "type": "slider",
        "default": 2,
        "min": 1,
        "max": 4,
        "step": 1,
        "desc": "被突出的流程节点序号（从 1 起）。"
      },
      {
        "key": "showStageTag",
        "label": "阶段标签列",
        "type": "toggle",
        "default": true,
        "desc": "维度列内的彩色阶段标签（与流程带对应）。"
      },
      {
        "key": "showVerdict",
        "label": "判断列",
        "type": "toggle",
        "default": true,
        "desc": "末尾「判断」标签列（关闭则为三列表）。"
      },
      {
        "key": "zebra",
        "label": "斑马纹",
        "type": "toggle",
        "default": false,
        "desc": "隔行底色，便于横向读取。"
      },
      {
        "key": "focusEnabled",
        "label": "重点行",
        "type": "toggle",
        "default": true,
        "desc": "是否突出某一行。"
      },
      {
        "key": "focusIndex",
        "label": "重点行序号",
        "type": "slider",
        "default": 1,
        "min": 1,
        "max": 4,
        "step": 1,
        "desc": "被突出的行序号（从 1 起）。"
      },
      {
        "key": "showIntro",
        "label": "引导栏",
        "type": "toggle",
        "default": true,
        "desc": "流程带上方的引导文案与一对头部指标。"
      },
      {
        "key": "accentColor",
        "label": "强调色",
        "type": "color",
        "default": "#4da0c6",
        "options": [
          "#d8402e",
          "#e2742c",
          "#efbe2e",
          "#3c9a52",
          "#4da0c6",
          "#2c44a0",
          "#7a3c90"
        ],
        "desc": "眉标 / 头部指标 / 重点行的强调色。"
      },
      {
        "key": "showConclusion",
        "label": "结论文案",
        "type": "toggle",
        "default": true,
        "desc": "表格下方的一句装饰性结论。"
      },
      {
        "key": "showSheetLabel",
        "label": "页码标签",
        "type": "toggle",
        "default": true,
        "desc": "右上角的页码 / 章节标签。"
      }
    ],
    "defaultProps": {
      "rowCount": 4,
      "showProcess": true,
      "stageCount": 4,
      "stageFocus": 2,
      "showStageTag": true,
      "showVerdict": true,
      "zebra": false,
      "focusEnabled": true,
      "focusIndex": 1,
      "showIntro": true,
      "accentColor": "#4da0c6",
      "showConclusion": true,
      "showSheetLabel": true
    }
  },
  {
    "key": "theme05_page071",
    "themeKey": "theme05",
    "pageNumber": 71,
    "layout": "THEME05-071",
    "slot": "gateway",
    "label": "转化漏斗 Gateway",
    "bgClass": "",
    "controls": [
      {
        "key": "imageCount",
        "label": "图片槽数量",
        "type": "slider",
        "default": 1,
        "min": 0,
        "max": 2,
        "step": 1,
        "desc": "图片槽数量（0–2），按各图比例自适应排布；为 0 时主体卡铺满整幅、指标转两列。"
      },
      {
        "key": "imageSide",
        "label": "图片位置",
        "type": "radio",
        "default": "right",
        "options": [
          {
            "value": "right",
            "label": "右侧"
          },
          {
            "value": "left",
            "label": "左侧"
          }
        ],
        "desc": "图片相对主体卡的位置（有图片时生效）。"
      },
      {
        "key": "metricCount",
        "label": "指标行数",
        "type": "slider",
        "default": 3,
        "min": 2,
        "max": 3,
        "step": 1,
        "desc": "主体卡内的指标行数。"
      },
      {
        "key": "cardTheme",
        "label": "主体卡主题",
        "type": "radio",
        "default": "color",
        "options": [
          {
            "value": "color",
            "label": "色块"
          },
          {
            "value": "dark",
            "label": "深色"
          },
          {
            "value": "paper",
            "label": "纸色"
          }
        ],
        "desc": "主体卡背景：强调色块 / 深色 / 纸色。"
      },
      {
        "key": "showLadder",
        "label": "转化漏斗",
        "type": "toggle",
        "default": true,
        "desc": "底部用户漏斗 / 转化阶梯带（关闭则隐藏整条）。"
      },
      {
        "key": "stepCount",
        "label": "漏斗层数",
        "type": "slider",
        "default": 3,
        "min": 2,
        "max": 3,
        "step": 1,
        "desc": "转化阶梯的层级（阶段）数量。"
      },
      {
        "key": "showRate",
        "label": "转化率标注",
        "type": "toggle",
        "default": true,
        "desc": "相邻层之间的转化率百分比标注。"
      },
      {
        "key": "focusEnabled",
        "label": "重点层",
        "type": "toggle",
        "default": true,
        "desc": "是否突出某一层（其余淡出）。"
      },
      {
        "key": "focusIndex",
        "label": "重点层序号",
        "type": "slider",
        "default": 3,
        "min": 1,
        "max": 3,
        "step": 1,
        "desc": "被突出的层序号（从 1 起）。"
      },
      {
        "key": "showLead",
        "label": "引导说明",
        "type": "toggle",
        "default": true,
        "desc": "标题下方的一句引导说明。"
      },
      {
        "key": "showGalleryCaption",
        "label": "图注",
        "type": "toggle",
        "default": true,
        "desc": "图片区上方的装饰性图注。"
      },
      {
        "key": "accentColor",
        "label": "强调色",
        "type": "color",
        "default": "#7a3c90",
        "options": [
          "#d8402e",
          "#e2742c",
          "#efbe2e",
          "#3c9a52",
          "#4da0c6",
          "#2c44a0",
          "#7a3c90"
        ],
        "desc": "眉标 / 漏斗终点 /「色块」主题下主体卡的颜色。"
      },
      {
        "key": "showConclusion",
        "label": "结论文案",
        "type": "toggle",
        "default": true,
        "desc": "底部的一句装饰性结论。"
      },
      {
        "key": "showSheetLabel",
        "label": "页码标签",
        "type": "toggle",
        "default": true,
        "desc": "右上角的页码 / 章节标签。"
      }
    ],
    "defaultProps": {
      "imageCount": 1,
      "imageSide": "right",
      "metricCount": 3,
      "cardTheme": "color",
      "showLadder": true,
      "stepCount": 3,
      "showRate": true,
      "focusEnabled": true,
      "focusIndex": 3,
      "showLead": true,
      "showGalleryCaption": true,
      "accentColor": "#7a3c90",
      "showConclusion": true,
      "showSheetLabel": true
    }
  },
  {
    "key": "theme05_page072",
    "themeKey": "theme05",
    "pageNumber": 72,
    "layout": "THEME05-072",
    "slot": "stack",
    "label": "架构栈 Stack",
    "bgClass": "",
    "controls": [
      {
        "key": "tierCount",
        "label": "架构层数",
        "type": "slider",
        "default": 4,
        "min": 2,
        "max": 4,
        "step": 1,
        "desc": "平台架构的层级（tier）数量。"
      },
      {
        "key": "focusEnabled",
        "label": "突出层",
        "type": "toggle",
        "default": true,
        "desc": "是否突出某一层（作为「AI 延展层」以强调色着色）。"
      },
      {
        "key": "focusIndex",
        "label": "突出层序号",
        "type": "slider",
        "default": 2,
        "min": 1,
        "max": 4,
        "step": 1,
        "desc": "被突出的层序号（自顶向下，从 1 起）。"
      },
      {
        "key": "showItems",
        "label": "能力标签",
        "type": "toggle",
        "default": true,
        "desc": "各层右侧的能力 chip 标签。"
      },
      {
        "key": "showExpand",
        "label": "扩张读数",
        "type": "toggle",
        "default": true,
        "desc": "架构带顶部的净收入留存扩张读数。"
      },
      {
        "key": "cardTheme",
        "label": "主体卡主题",
        "type": "radio",
        "default": "dark",
        "options": [
          {
            "value": "dark",
            "label": "深色"
          },
          {
            "value": "color",
            "label": "色块"
          },
          {
            "value": "paper",
            "label": "纸色"
          }
        ],
        "desc": "主体卡背景：深色 / 强调色块 / 纸色。"
      },
      {
        "key": "metricCount",
        "label": "明细行数",
        "type": "slider",
        "default": 4,
        "min": 2,
        "max": 4,
        "step": 1,
        "desc": "主体卡内的指标明细行数。"
      },
      {
        "key": "showLead",
        "label": "引导说明",
        "type": "toggle",
        "default": true,
        "desc": "标题下方的一句引导说明。"
      },
      {
        "key": "accentColor",
        "label": "强调色",
        "type": "color",
        "default": "#d8402e",
        "options": [
          "#d8402e",
          "#e2742c",
          "#efbe2e",
          "#3c9a52",
          "#4da0c6",
          "#2c44a0",
          "#7a3c90"
        ],
        "desc": "眉标 / 延展层 /「色块」主题下主体卡的颜色。"
      },
      {
        "key": "showConclusion",
        "label": "结论文案",
        "type": "toggle",
        "default": true,
        "desc": "底部的一句装饰性结论。"
      },
      {
        "key": "showSheetLabel",
        "label": "页码标签",
        "type": "toggle",
        "default": true,
        "desc": "右上角的页码 / 章节标签。"
      }
    ],
    "defaultProps": {
      "tierCount": 4,
      "focusEnabled": true,
      "focusIndex": 2,
      "showItems": true,
      "showExpand": true,
      "cardTheme": "dark",
      "metricCount": 4,
      "showLead": true,
      "accentColor": "#d8402e",
      "showConclusion": true,
      "showSheetLabel": true
    }
  },
  {
    "key": "theme05_page073",
    "themeKey": "theme05",
    "pageNumber": 73,
    "layout": "THEME05-073",
    "slot": "index",
    "label": "知识索引 Index",
    "bgClass": "",
    "controls": [
      {
        "key": "imageCount",
        "label": "图片槽数量",
        "type": "slider",
        "default": 1,
        "min": 0,
        "max": 3,
        "step": 1,
        "desc": "图片槽数量（0–3），按各图比例自适应排布；为 0 时主体卡铺满整幅、指标转两列。"
      },
      {
        "key": "imageSide",
        "label": "图片位置",
        "type": "radio",
        "default": "right",
        "options": [
          {
            "value": "right",
            "label": "右侧"
          },
          {
            "value": "left",
            "label": "左侧"
          }
        ],
        "desc": "图片相对主体卡的位置（有图片时生效）。"
      },
      {
        "key": "metricCount",
        "label": "指标行数",
        "type": "slider",
        "default": 3,
        "min": 2,
        "max": 3,
        "step": 1,
        "desc": "主体卡内的指标行数。"
      },
      {
        "key": "cardTheme",
        "label": "主体卡主题",
        "type": "radio",
        "default": "dark",
        "options": [
          {
            "value": "dark",
            "label": "深色"
          },
          {
            "value": "color",
            "label": "色块"
          },
          {
            "value": "paper",
            "label": "纸色"
          }
        ],
        "desc": "主体卡背景：深色 / 强调色块 / 纸色。"
      },
      {
        "key": "showDirectory",
        "label": "来源索引",
        "type": "toggle",
        "default": true,
        "desc": "底部知识来源索引目录（关闭则隐藏整条）。"
      },
      {
        "key": "sourceCount",
        "label": "索引条数",
        "type": "slider",
        "default": 4,
        "min": 2,
        "max": 5,
        "step": 1,
        "desc": "知识来源目录的行数。"
      },
      {
        "key": "showCoverage",
        "label": "覆盖度条",
        "type": "toggle",
        "default": true,
        "desc": "各来源右侧的覆盖度比例条。"
      },
      {
        "key": "focusEnabled",
        "label": "重点来源",
        "type": "toggle",
        "default": true,
        "desc": "是否突出某一条来源（以强调色着色）。"
      },
      {
        "key": "focusIndex",
        "label": "重点条序号",
        "type": "slider",
        "default": 1,
        "min": 1,
        "max": 5,
        "step": 1,
        "desc": "被突出的来源序号（从 1 起）。"
      },
      {
        "key": "showRing",
        "label": "续约环",
        "type": "toggle",
        "default": true,
        "desc": "索引末端的环形续约率读数。"
      },
      {
        "key": "showLead",
        "label": "引导说明",
        "type": "toggle",
        "default": true,
        "desc": "标题下方的一句引导说明。"
      },
      {
        "key": "showGalleryCaption",
        "label": "图注",
        "type": "toggle",
        "default": true,
        "desc": "图片区上方的装饰性图注。"
      },
      {
        "key": "accentColor",
        "label": "强调色",
        "type": "color",
        "default": "#3c9a52",
        "options": [
          "#d8402e",
          "#e2742c",
          "#efbe2e",
          "#3c9a52",
          "#4da0c6",
          "#2c44a0",
          "#7a3c90"
        ],
        "desc": "眉标 / 重点来源 / 续约环 /「色块」主题主体卡的颜色。"
      },
      {
        "key": "showConclusion",
        "label": "结论文案",
        "type": "toggle",
        "default": true,
        "desc": "底部的一句装饰性结论。"
      },
      {
        "key": "showSheetLabel",
        "label": "页码标签",
        "type": "toggle",
        "default": true,
        "desc": "右上角的页码 / 章节标签。"
      }
    ],
    "defaultProps": {
      "imageCount": 1,
      "imageSide": "right",
      "metricCount": 3,
      "cardTheme": "dark",
      "showDirectory": true,
      "sourceCount": 4,
      "showCoverage": true,
      "focusEnabled": true,
      "focusIndex": 1,
      "showRing": true,
      "showLead": true,
      "showGalleryCaption": true,
      "accentColor": "#3c9a52",
      "showConclusion": true,
      "showSheetLabel": true
    }
  },
  {
    "key": "theme05_page074",
    "themeKey": "theme05",
    "pageNumber": 74,
    "layout": "THEME05-074",
    "slot": "monolith",
    "label": "大数字 Monolith",
    "bgClass": "",
    "controls": [
      {
        "key": "showMeter",
        "label": "色阶量表",
        "type": "toggle",
        "default": true,
        "desc": "主数字旁的竖向色阶量表（关闭则数字占满）。"
      },
      {
        "key": "meterSegments",
        "label": "色阶段数",
        "type": "slider",
        "default": 7,
        "min": 3,
        "max": 7,
        "step": 1,
        "desc": "竖向量表的色块段数。"
      },
      {
        "key": "meterLevel",
        "label": "点亮段数",
        "type": "slider",
        "default": 4,
        "min": 1,
        "max": 7,
        "step": 1,
        "desc": "量表自下而上点亮的段数。"
      },
      {
        "key": "focusEnabled",
        "label": "重点段",
        "type": "toggle",
        "default": true,
        "desc": "是否突出某一段（描边强调）。"
      },
      {
        "key": "focusIndex",
        "label": "重点段序号",
        "type": "slider",
        "default": 4,
        "min": 1,
        "max": 7,
        "step": 1,
        "desc": "被突出的色阶段序号（自下而上，从 1 起）。"
      },
      {
        "key": "auxCount",
        "label": "辅助指标数量",
        "type": "slider",
        "default": 3,
        "min": 0,
        "max": 3,
        "step": 1,
        "desc": "右侧支撑指标的数量（0 隐藏整列）。"
      },
      {
        "key": "showCaption",
        "label": "解释说明",
        "type": "toggle",
        "default": true,
        "desc": "主数字下方的一句解释说明。"
      },
      {
        "key": "showMessage",
        "label": "支撑文案",
        "type": "toggle",
        "default": true,
        "desc": "解释下方的一句支撑性文案。"
      },
      {
        "key": "accentColor",
        "label": "强调色",
        "type": "color",
        "default": "#efbe2e",
        "options": [
          "#d8402e",
          "#e2742c",
          "#efbe2e",
          "#3c9a52",
          "#4da0c6",
          "#2c44a0",
          "#7a3c90"
        ],
        "desc": "主数字 / 眉标 / 重点段的强调色。"
      },
      {
        "key": "showConclusion",
        "label": "结论文案",
        "type": "toggle",
        "default": true,
        "desc": "底部的一句装饰性结论。"
      },
      {
        "key": "showSheetLabel",
        "label": "页码标签",
        "type": "toggle",
        "default": true,
        "desc": "右上角的页码 / 章节标签。"
      }
    ],
    "defaultProps": {
      "showMeter": true,
      "meterSegments": 7,
      "meterLevel": 4,
      "focusEnabled": true,
      "focusIndex": 4,
      "auxCount": 3,
      "showCaption": true,
      "showMessage": true,
      "accentColor": "#efbe2e",
      "showConclusion": true,
      "showSheetLabel": true
    }
  },
  {
    "key": "theme05_page075",
    "themeKey": "theme05",
    "pageNumber": 75,
    "layout": "THEME05-075",
    "slot": "horizon",
    "label": "兑现轨迹 Horizon",
    "bgClass": "",
    "controls": [
      {
        "key": "imageCount",
        "label": "图片槽数量",
        "type": "slider",
        "default": 1,
        "min": 0,
        "max": 2,
        "step": 1,
        "desc": "图片槽数量（0–2），按各图比例自适应排布；为 0 时主体卡铺满整幅、指标转两列。"
      },
      {
        "key": "imageSide",
        "label": "图片位置",
        "type": "radio",
        "default": "right",
        "options": [
          {
            "value": "right",
            "label": "右侧"
          },
          {
            "value": "left",
            "label": "左侧"
          }
        ],
        "desc": "图片相对主体卡的位置（有图片时生效）。"
      },
      {
        "key": "metricCount",
        "label": "指标行数",
        "type": "slider",
        "default": 4,
        "min": 2,
        "max": 4,
        "step": 1,
        "desc": "主体卡内的指标行数。"
      },
      {
        "key": "cardTheme",
        "label": "主体卡主题",
        "type": "radio",
        "default": "dark",
        "options": [
          {
            "value": "dark",
            "label": "深色"
          },
          {
            "value": "color",
            "label": "色块"
          },
          {
            "value": "paper",
            "label": "纸色"
          }
        ],
        "desc": "主体卡背景：深色 / 强调色块 / 纸色。"
      },
      {
        "key": "showHorizon",
        "label": "兑现轨迹",
        "type": "toggle",
        "default": true,
        "desc": "底部「现在 → 远期」的兑现轨迹带（关闭则隐藏整条）。"
      },
      {
        "key": "milestoneCount",
        "label": "里程碑数",
        "type": "slider",
        "default": 3,
        "min": 1,
        "max": 3,
        "step": 1,
        "desc": "轨迹上的里程碑节点数量。"
      },
      {
        "key": "curveStyle",
        "label": "轨迹线型",
        "type": "radio",
        "default": "dashed",
        "options": [
          {
            "value": "dashed",
            "label": "虚线"
          },
          {
            "value": "solid",
            "label": "实线"
          }
        ],
        "desc": "兑现轨迹的线型（虚线 = 不确定的远期）。"
      },
      {
        "key": "focusEnabled",
        "label": "重点里程碑",
        "type": "toggle",
        "default": true,
        "desc": "是否突出某一里程碑节点。"
      },
      {
        "key": "focusIndex",
        "label": "重点节点序号",
        "type": "slider",
        "default": 3,
        "min": 1,
        "max": 3,
        "step": 1,
        "desc": "被突出的里程碑序号（从 1 起）。"
      },
      {
        "key": "showLead",
        "label": "引导说明",
        "type": "toggle",
        "default": true,
        "desc": "标题下方的一句引导说明。"
      },
      {
        "key": "showGalleryCaption",
        "label": "图注",
        "type": "toggle",
        "default": true,
        "desc": "图片区上方的装饰性图注。"
      },
      {
        "key": "accentColor",
        "label": "强调色",
        "type": "color",
        "default": "#2c44a0",
        "options": [
          "#d8402e",
          "#e2742c",
          "#efbe2e",
          "#3c9a52",
          "#4da0c6",
          "#2c44a0",
          "#7a3c90"
        ],
        "desc": "眉标 / 轨迹 / 重点节点 /「色块」主题主体卡的颜色。"
      },
      {
        "key": "showConclusion",
        "label": "结论文案",
        "type": "toggle",
        "default": true,
        "desc": "底部的一句装饰性结论。"
      },
      {
        "key": "showSheetLabel",
        "label": "页码标签",
        "type": "toggle",
        "default": true,
        "desc": "右上角的页码 / 章节标签。"
      }
    ],
    "defaultProps": {
      "imageCount": 1,
      "imageSide": "right",
      "metricCount": 4,
      "cardTheme": "dark",
      "showHorizon": true,
      "milestoneCount": 3,
      "curveStyle": "dashed",
      "focusEnabled": true,
      "focusIndex": 3,
      "showLead": true,
      "showGalleryCaption": true,
      "accentColor": "#2c44a0",
      "showConclusion": true,
      "showSheetLabel": true
    }
  },
  {
    "key": "theme05_page076",
    "themeKey": "theme05",
    "pageNumber": 76,
    "layout": "THEME05-076",
    "slot": "chapter5",
    "label": "章节 Chapter 05",
    "bgClass": "",
    "controls": [
      {
        "key": "theme",
        "label": "背景主题",
        "type": "radio",
        "default": "dark",
        "options": [
          {
            "value": "dark",
            "label": "深色"
          },
          {
            "value": "paper",
            "label": "纸色"
          },
          {
            "value": "color",
            "label": "色块"
          }
        ],
        "desc": "章节页背景：深色 / 纸色 / 整页色块。"
      },
      {
        "key": "bgColor",
        "label": "色块背景",
        "type": "color",
        "default": "#2c44a0",
        "options": [
          "#d8402e",
          "#e2742c",
          "#efbe2e",
          "#3c9a52",
          "#4da0c6",
          "#2c44a0",
          "#7a3c90"
        ],
        "desc": "「色块」主题下的整页背景色。"
      },
      {
        "key": "showBigNumber",
        "label": "站台号",
        "type": "toggle",
        "default": true,
        "desc": "右上的大号章节「站台」编号。"
      },
      {
        "key": "rowCount",
        "label": "看板行数",
        "type": "slider",
        "default": 5,
        "min": 2,
        "max": 5,
        "step": 1,
        "desc": "出发看板的关键词行数。"
      },
      {
        "key": "showStatus",
        "label": "状态灯",
        "type": "toggle",
        "default": true,
        "desc": "各行右侧的状态指示灯。"
      },
      {
        "key": "showGloss",
        "label": "英文注",
        "type": "toggle",
        "default": true,
        "desc": "各行关键词的英文注释列。"
      },
      {
        "key": "focusEnabled",
        "label": "高亮行",
        "type": "toggle",
        "default": true,
        "desc": "是否高亮某一行（作为「下一站」）。"
      },
      {
        "key": "focusIndex",
        "label": "高亮行序号",
        "type": "slider",
        "default": 1,
        "min": 1,
        "max": 5,
        "step": 1,
        "desc": "被高亮的看板行序号（从 1 起）。"
      },
      {
        "key": "accentColor",
        "label": "强调色",
        "type": "color",
        "default": "#d8402e",
        "options": [
          "#d8402e",
          "#e2742c",
          "#efbe2e",
          "#3c9a52",
          "#4da0c6",
          "#2c44a0",
          "#7a3c90"
        ],
        "desc": "眉标 / 站台号 / 高亮行 / 状态灯的强调色。"
      },
      {
        "key": "showColorBand",
        "label": "色谱条",
        "type": "toggle",
        "default": true,
        "desc": "底部的色谱条带。"
      },
      {
        "key": "showWordmark",
        "label": "品牌标识",
        "type": "toggle",
        "default": true,
        "desc": "左上角的品牌标识。"
      },
      {
        "key": "showSheetLabel",
        "label": "页码标签",
        "type": "toggle",
        "default": true,
        "desc": "右上角的章节 / 页码标签。"
      }
    ],
    "defaultProps": {
      "theme": "dark",
      "bgColor": "#2c44a0",
      "showBigNumber": true,
      "rowCount": 5,
      "showStatus": true,
      "showGloss": true,
      "focusEnabled": true,
      "focusIndex": 1,
      "accentColor": "#d8402e",
      "showColorBand": true,
      "showWordmark": true,
      "showSheetLabel": true
    }
  },
  {
    "key": "theme05_page077",
    "themeKey": "theme05",
    "pageNumber": 77,
    "layout": "THEME05-077",
    "slot": "ladder",
    "label": "转化阶梯 Ladder",
    "bgClass": "",
    "controls": [
      {
        "key": "stageCount",
        "label": "阶段数量",
        "type": "slider",
        "default": 4,
        "min": 2,
        "max": 4,
        "step": 1,
        "desc": "转化阶梯的阶段（台阶）数量。"
      },
      {
        "key": "chartType",
        "label": "阶梯样式",
        "type": "radio",
        "default": "ladder",
        "options": [
          {
            "value": "ladder",
            "label": "居中收窄"
          },
          {
            "value": "bars",
            "label": "左对齐条"
          }
        ],
        "desc": "阶梯呈现：居中收窄（漏斗感）/ 左对齐横向条。"
      },
      {
        "key": "focusEnabled",
        "label": "重点阶段",
        "type": "toggle",
        "default": true,
        "desc": "是否突出某一阶段（其余淡出）。"
      },
      {
        "key": "focusIndex",
        "label": "重点阶段序号",
        "type": "slider",
        "default": 2,
        "min": 1,
        "max": 4,
        "step": 1,
        "desc": "被突出的阶段序号（从 1 起）。"
      },
      {
        "key": "showDropoff",
        "label": "流失标注",
        "type": "toggle",
        "default": true,
        "desc": "相邻阶段之间的流失（drop-off）标注。"
      },
      {
        "key": "showValue",
        "label": "数值标注",
        "type": "toggle",
        "default": true,
        "desc": "各阶段的占比数值标注。"
      },
      {
        "key": "showMetricCard",
        "label": "指标卡",
        "type": "toggle",
        "default": true,
        "desc": "右侧的「风险卡」指标卡（关闭则阶梯铺满整幅）。"
      },
      {
        "key": "metricCount",
        "label": "指标行数",
        "type": "slider",
        "default": 4,
        "min": 2,
        "max": 4,
        "step": 1,
        "desc": "指标卡内的指标行数。"
      },
      {
        "key": "cardTheme",
        "label": "指标卡主题",
        "type": "radio",
        "default": "dark",
        "options": [
          {
            "value": "dark",
            "label": "深色"
          },
          {
            "value": "color",
            "label": "色块"
          },
          {
            "value": "paper",
            "label": "纸色"
          }
        ],
        "desc": "指标卡背景：深色 / 强调色块 / 纸色。"
      },
      {
        "key": "showLead",
        "label": "引导说明",
        "type": "toggle",
        "default": true,
        "desc": "标题下方的一句引导说明。"
      },
      {
        "key": "accentColor",
        "label": "强调色",
        "type": "color",
        "default": "#d8402e",
        "options": [
          "#d8402e",
          "#e2742c",
          "#efbe2e",
          "#3c9a52",
          "#4da0c6",
          "#2c44a0",
          "#7a3c90"
        ],
        "desc": "眉标 / 重点阶段 /「色块」主题指标卡的颜色。"
      },
      {
        "key": "showConclusion",
        "label": "结论文案",
        "type": "toggle",
        "default": true,
        "desc": "底部的一句装饰性结论。"
      },
      {
        "key": "showSheetLabel",
        "label": "页码标签",
        "type": "toggle",
        "default": true,
        "desc": "右上角的页码 / 章节标签。"
      }
    ],
    "defaultProps": {
      "stageCount": 4,
      "chartType": "ladder",
      "focusEnabled": true,
      "focusIndex": 2,
      "showDropoff": true,
      "showValue": true,
      "showMetricCard": true,
      "metricCount": 4,
      "cardTheme": "dark",
      "showLead": true,
      "accentColor": "#d8402e",
      "showConclusion": true,
      "showSheetLabel": true
    }
  },
  {
    "key": "theme05_page078",
    "themeKey": "theme05",
    "pageNumber": 78,
    "layout": "THEME05-078",
    "slot": "register",
    "label": "风险登记表 Register",
    "bgClass": "",
    "controls": [
      {
        "key": "rowCount",
        "label": "数据行数",
        "type": "slider",
        "default": 4,
        "min": 2,
        "max": 4,
        "step": 1,
        "desc": "表格的数据行数量。"
      },
      {
        "key": "showExposure",
        "label": "严重度带",
        "type": "toggle",
        "default": true,
        "desc": "末尾的严重度暴露带列（green→red 色阶，关闭则收起该列）。"
      },
      {
        "key": "scaleMax",
        "label": "严重度刻度",
        "type": "slider",
        "default": 5,
        "min": 3,
        "max": 5,
        "step": 1,
        "desc": "严重度暴露带的总刻度段数。"
      },
      {
        "key": "showVerdict",
        "label": "判断标签",
        "type": "toggle",
        "default": true,
        "desc": "严重度带旁的「低 / 中 / 高」判断 chip。"
      },
      {
        "key": "sortDescending",
        "label": "按严重度降序",
        "type": "toggle",
        "default": true,
        "desc": "是否按严重度由高到低排序行。"
      },
      {
        "key": "zebra",
        "label": "斑马纹",
        "type": "toggle",
        "default": false,
        "desc": "隔行底色，便于横向读取。"
      },
      {
        "key": "focusEnabled",
        "label": "重点行",
        "type": "toggle",
        "default": true,
        "desc": "是否突出某一行。"
      },
      {
        "key": "focusIndex",
        "label": "重点行序号",
        "type": "slider",
        "default": 1,
        "min": 1,
        "max": 4,
        "step": 1,
        "desc": "被突出的行序号（按当前排序后顺序，从 1 起）。"
      },
      {
        "key": "showIntro",
        "label": "引导栏",
        "type": "toggle",
        "default": true,
        "desc": "表格上方的引导文案与一对头部指标。"
      },
      {
        "key": "accentColor",
        "label": "强调色",
        "type": "color",
        "default": "#d8402e",
        "options": [
          "#d8402e",
          "#e2742c",
          "#efbe2e",
          "#3c9a52",
          "#4da0c6",
          "#2c44a0",
          "#7a3c90"
        ],
        "desc": "眉标 / 头部指标 / 重点行的强调色（严重度带用独立色阶）。"
      },
      {
        "key": "showConclusion",
        "label": "结论文案",
        "type": "toggle",
        "default": true,
        "desc": "表格下方的一句装饰性结论。"
      },
      {
        "key": "showSheetLabel",
        "label": "页码标签",
        "type": "toggle",
        "default": true,
        "desc": "右上角的页码 / 章节标签。"
      }
    ],
    "defaultProps": {
      "rowCount": 4,
      "showExposure": true,
      "scaleMax": 5,
      "showVerdict": true,
      "sortDescending": true,
      "zebra": false,
      "focusEnabled": true,
      "focusIndex": 1,
      "showIntro": true,
      "accentColor": "#d8402e",
      "showConclusion": true,
      "showSheetLabel": true
    }
  },
  {
    "key": "theme05_page079",
    "themeKey": "theme05",
    "pageNumber": 79,
    "layout": "THEME05-079",
    "slot": "ceiling",
    "label": "毛利天花板 Ceiling",
    "bgClass": "",
    "controls": [
      {
        "key": "showGauge",
        "label": "压力量表",
        "type": "toggle",
        "default": true,
        "desc": "主数字旁的竖向压力量表（关闭则数字占满）。"
      },
      {
        "key": "gaugeValue",
        "label": "压力水位",
        "type": "slider",
        "default": 61,
        "min": 0,
        "max": 100,
        "step": 1,
        "desc": "量表自下而上的填充比例（0–100，天花板线随之移动）。"
      },
      {
        "key": "showThresholdLine",
        "label": "天花板线",
        "type": "toggle",
        "default": true,
        "desc": "填充顶部的天花板阈值线与上方剖面网纹。"
      },
      {
        "key": "auxCount",
        "label": "辅助指标数量",
        "type": "slider",
        "default": 3,
        "min": 0,
        "max": 3,
        "step": 1,
        "desc": "右侧支撑指标的数量（0 隐藏整列）。"
      },
      {
        "key": "numberAlign",
        "label": "主数字对齐",
        "type": "radio",
        "default": "left",
        "options": [
          {
            "value": "left",
            "label": "左对齐"
          },
          {
            "value": "center",
            "label": "居中"
          }
        ],
        "desc": "主数字与说明的对齐方式。"
      },
      {
        "key": "showCaption",
        "label": "解释说明",
        "type": "toggle",
        "default": true,
        "desc": "主数字下方的一句解释说明。"
      },
      {
        "key": "showMessage",
        "label": "支撑文案",
        "type": "toggle",
        "default": true,
        "desc": "解释下方的一句支撑性文案。"
      },
      {
        "key": "accentColor",
        "label": "强调色",
        "type": "color",
        "default": "#d8402e",
        "options": [
          "#d8402e",
          "#e2742c",
          "#efbe2e",
          "#3c9a52",
          "#4da0c6",
          "#2c44a0",
          "#7a3c90"
        ],
        "desc": "主数字 / 眉标 / 压力填充的强调色。"
      },
      {
        "key": "showConclusion",
        "label": "结论文案",
        "type": "toggle",
        "default": true,
        "desc": "底部的一句装饰性结论。"
      },
      {
        "key": "showSheetLabel",
        "label": "页码标签",
        "type": "toggle",
        "default": true,
        "desc": "右上角的页码 / 章节标签。"
      }
    ],
    "defaultProps": {
      "showGauge": true,
      "gaugeValue": 61,
      "showThresholdLine": true,
      "auxCount": 3,
      "numberAlign": "left",
      "showCaption": true,
      "showMessage": true,
      "accentColor": "#d8402e",
      "showConclusion": true,
      "showSheetLabel": true
    }
  },
  {
    "key": "theme05_page080",
    "themeKey": "theme05",
    "pageNumber": 80,
    "layout": "THEME05-080",
    "slot": "squeeze",
    "label": "壁垒压缩 Squeeze",
    "bgClass": "",
    "controls": [
      {
        "key": "itemCount",
        "label": "压力维度数量",
        "type": "slider",
        "default": 3,
        "min": 2,
        "max": 3,
        "step": 1,
        "desc": "参与压缩的压力维度（行）数量。"
      },
      {
        "key": "chartType",
        "label": "图表样式",
        "type": "radio",
        "default": "pincer",
        "options": [
          {
            "value": "pincer",
            "label": "夹击残余"
          },
          {
            "value": "bars",
            "label": "普通条形"
          }
        ],
        "desc": "夹击残余（侵蚀+残余壁垒+箭头）/ 普通左对齐条形。"
      },
      {
        "key": "focusEnabled",
        "label": "重点维度",
        "type": "toggle",
        "default": true,
        "desc": "是否突出某一压力维度（其余淡出）。"
      },
      {
        "key": "focusIndex",
        "label": "重点维度序号",
        "type": "slider",
        "default": 1,
        "min": 1,
        "max": 3,
        "step": 1,
        "desc": "被突出的压力维度序号（从 1 起）。"
      },
      {
        "key": "showResidual",
        "label": "残余壁垒",
        "type": "toggle",
        "default": true,
        "desc": "右侧深色「残余壁垒空间」段与数值（pincer 样式下生效）。"
      },
      {
        "key": "showArrow",
        "label": "夹击箭头",
        "type": "toggle",
        "default": true,
        "desc": "侵蚀段前缘指向壁垒墙的夹击箭头。"
      },
      {
        "key": "showValue",
        "label": "数值标注",
        "type": "toggle",
        "default": true,
        "desc": "各压力维度的侵蚀百分比标注。"
      },
      {
        "key": "showAnchor",
        "label": "残余锚点卡",
        "type": "toggle",
        "default": true,
        "desc": "右侧深色残余壁垒锚点卡（巨号读数 + 说明）。"
      },
      {
        "key": "showLead",
        "label": "引导说明",
        "type": "toggle",
        "default": true,
        "desc": "标题下方的一句引导说明。"
      },
      {
        "key": "accentColor",
        "label": "强调色",
        "type": "color",
        "default": "#7a3c90",
        "options": [
          "#d8402e",
          "#e2742c",
          "#efbe2e",
          "#3c9a52",
          "#4da0c6",
          "#2c44a0",
          "#7a3c90"
        ],
        "desc": "眉标 / 锚点卡巨号 / 重点维度的强调色。"
      },
      {
        "key": "showConclusion",
        "label": "结论文案",
        "type": "toggle",
        "default": true,
        "desc": "底部的一句装饰性结论。"
      },
      {
        "key": "showSheetLabel",
        "label": "页码标签",
        "type": "toggle",
        "default": true,
        "desc": "右上角的页码 / 章节标签。"
      }
    ],
    "defaultProps": {
      "itemCount": 3,
      "chartType": "pincer",
      "focusEnabled": true,
      "focusIndex": 1,
      "showResidual": true,
      "showArrow": true,
      "showValue": true,
      "showAnchor": true,
      "showLead": true,
      "accentColor": "#7a3c90",
      "showConclusion": true,
      "showSheetLabel": true
    }
  },
  {
    "key": "theme05_page081",
    "themeKey": "theme05",
    "pageNumber": 81,
    "layout": "THEME05-081",
    "slot": "slate",
    "label": "策略推荐 Slate",
    "bgClass": "",
    "controls": [
      {
        "key": "cardCount",
        "label": "方向卡数量",
        "type": "slider",
        "default": 4,
        "min": 2,
        "max": 4,
        "step": 1,
        "desc": "推荐方向卡的数量。"
      },
      {
        "key": "columns",
        "label": "网格列数",
        "type": "slider",
        "default": 2,
        "min": 2,
        "max": 4,
        "step": 1,
        "desc": "方向卡网格的列数。"
      },
      {
        "key": "focusEnabled",
        "label": "重点方向",
        "type": "toggle",
        "default": true,
        "desc": "是否突出某一张方向卡（其余淡出）。"
      },
      {
        "key": "focusIndex",
        "label": "重点方向序号",
        "type": "slider",
        "default": 1,
        "min": 1,
        "max": 4,
        "step": 1,
        "desc": "被突出的方向卡序号（从 1 起）。"
      },
      {
        "key": "showCardCode",
        "label": "卡片代号",
        "type": "toggle",
        "default": true,
        "desc": "方向卡上的英文代号。"
      },
      {
        "key": "showCardTag",
        "label": "卡片说明",
        "type": "toggle",
        "default": true,
        "desc": "方向卡底部的一行说明标签。"
      },
      {
        "key": "showCriteria",
        "label": "筛选面板",
        "type": "toggle",
        "default": true,
        "desc": "右侧的筛选指标面板（关闭则方向卡铺满整幅）。"
      },
      {
        "key": "criteriaCount",
        "label": "筛选项数量",
        "type": "slider",
        "default": 4,
        "min": 2,
        "max": 4,
        "step": 1,
        "desc": "筛选指标清单的条目数量。"
      },
      {
        "key": "panelTheme",
        "label": "面板主题",
        "type": "radio",
        "default": "dark",
        "options": [
          {
            "value": "dark",
            "label": "深色"
          },
          {
            "value": "color",
            "label": "色块"
          },
          {
            "value": "paper",
            "label": "纸色"
          }
        ],
        "desc": "筛选面板背景：深色 / 强调色块 / 纸色。"
      },
      {
        "key": "showLead",
        "label": "引导说明",
        "type": "toggle",
        "default": true,
        "desc": "标题下方的一句引导说明。"
      },
      {
        "key": "accentColor",
        "label": "强调色",
        "type": "color",
        "default": "#2c44a0",
        "options": [
          "#d8402e",
          "#e2742c",
          "#efbe2e",
          "#3c9a52",
          "#4da0c6",
          "#2c44a0",
          "#7a3c90"
        ],
        "desc": "眉标 / 重点方向 /「色块」主题面板 / 筛选标记的颜色。"
      },
      {
        "key": "showConclusion",
        "label": "结论文案",
        "type": "toggle",
        "default": true,
        "desc": "底部的一句装饰性结论。"
      },
      {
        "key": "showSheetLabel",
        "label": "页码标签",
        "type": "toggle",
        "default": true,
        "desc": "右上角的页码 / 章节标签。"
      }
    ],
    "defaultProps": {
      "cardCount": 4,
      "columns": 2,
      "focusEnabled": true,
      "focusIndex": 1,
      "showCardCode": true,
      "showCardTag": true,
      "showCriteria": true,
      "criteriaCount": 4,
      "panelTheme": "dark",
      "showLead": true,
      "accentColor": "#2c44a0",
      "showConclusion": true,
      "showSheetLabel": true
    }
  },
  {
    "key": "theme05_page082",
    "themeKey": "theme05",
    "pageNumber": 82,
    "layout": "THEME05-082",
    "slot": "embed",
    "label": "工作流嵌入 Embed",
    "bgClass": "",
    "controls": [
      {
        "key": "nodeCount",
        "label": "流程阶段数",
        "type": "slider",
        "default": 4,
        "min": 3,
        "max": 5,
        "step": 1,
        "desc": "宿主工作流的阶段（节点）数量。"
      },
      {
        "key": "focusEnabled",
        "label": "嵌入标记",
        "type": "toggle",
        "default": true,
        "desc": "是否在某一阶段显示「AI 嵌入」标记（嵌入点）。"
      },
      {
        "key": "focusIndex",
        "label": "嵌入点序号",
        "type": "slider",
        "default": 2,
        "min": 1,
        "max": 5,
        "step": 1,
        "desc": "AI 嵌入所在的阶段序号（从 1 起）。"
      },
      {
        "key": "showConnectors",
        "label": "流向箭头",
        "type": "toggle",
        "default": true,
        "desc": "相邻阶段之间的流向箭头。"
      },
      {
        "key": "showMetrics",
        "label": "指标面板",
        "type": "toggle",
        "default": true,
        "desc": "右侧的关注指标面板（关闭则工作流铺满整幅）。"
      },
      {
        "key": "metricCount",
        "label": "指标项数量",
        "type": "slider",
        "default": 4,
        "min": 2,
        "max": 4,
        "step": 1,
        "desc": "关注指标清单的条目数量。"
      },
      {
        "key": "panelTheme",
        "label": "面板主题",
        "type": "radio",
        "default": "dark",
        "options": [
          {
            "value": "dark",
            "label": "深色"
          },
          {
            "value": "color",
            "label": "色块"
          },
          {
            "value": "paper",
            "label": "纸色"
          }
        ],
        "desc": "指标面板背景：深色 / 强调色块 / 纸色。"
      },
      {
        "key": "showScenes",
        "label": "场景带",
        "type": "toggle",
        "default": true,
        "desc": "底部的全宽落地场景标签带。"
      },
      {
        "key": "sceneCount",
        "label": "场景数量",
        "type": "slider",
        "default": 5,
        "min": 2,
        "max": 5,
        "step": 1,
        "desc": "落地场景标签的数量。"
      },
      {
        "key": "showLead",
        "label": "引导说明",
        "type": "toggle",
        "default": true,
        "desc": "标题下方的一句引导说明。"
      },
      {
        "key": "accentColor",
        "label": "强调色",
        "type": "color",
        "default": "#e2742c",
        "options": [
          "#d8402e",
          "#e2742c",
          "#efbe2e",
          "#3c9a52",
          "#4da0c6",
          "#2c44a0",
          "#7a3c90"
        ],
        "desc": "眉标 / 嵌入节点 /「色块」主题面板 / 标记的颜色。"
      },
      {
        "key": "showConclusion",
        "label": "结论文案",
        "type": "toggle",
        "default": true,
        "desc": "底部的一句装饰性结论。"
      },
      {
        "key": "showSheetLabel",
        "label": "页码标签",
        "type": "toggle",
        "default": true,
        "desc": "右上角的页码 / 章节标签。"
      }
    ],
    "defaultProps": {
      "nodeCount": 4,
      "focusEnabled": true,
      "focusIndex": 2,
      "showConnectors": true,
      "showMetrics": true,
      "metricCount": 4,
      "panelTheme": "dark",
      "showScenes": true,
      "sceneCount": 5,
      "showLead": true,
      "accentColor": "#e2742c",
      "showConclusion": true,
      "showSheetLabel": true
    }
  },
  {
    "key": "theme05_page083",
    "themeKey": "theme05",
    "pageNumber": 83,
    "layout": "THEME05-083",
    "slot": "beacon",
    "label": "估值锚 Re-anchor",
    "bgClass": "",
    "controls": [
      {
        "key": "nodeCount",
        "label": "阶段节点数",
        "type": "slider",
        "default": 4,
        "min": 2,
        "max": 4,
        "step": 1,
        "desc": "时间轴的阶段（节点）数量。"
      },
      {
        "key": "focusEnabled",
        "label": "重点节点",
        "type": "toggle",
        "default": true,
        "desc": "是否突出某一个时间轴节点。"
      },
      {
        "key": "focusIndex",
        "label": "重点节点序号",
        "type": "slider",
        "default": 2,
        "min": 1,
        "max": 4,
        "step": 1,
        "desc": "被突出的节点序号（同时决定窗口进度的终点，从 1 起）。"
      },
      {
        "key": "showWindowFill",
        "label": "窗口进度",
        "type": "toggle",
        "default": true,
        "desc": "轴线上从起点到重点节点的强调色进度叠层（已进入的观察窗口）。"
      },
      {
        "key": "showWatchlist",
        "label": "观察对象带",
        "type": "toggle",
        "default": true,
        "desc": "顶部的观察对象标签带（关闭则隐藏整条）。"
      },
      {
        "key": "watchCount",
        "label": "观察对象数",
        "type": "slider",
        "default": 4,
        "min": 2,
        "max": 4,
        "step": 1,
        "desc": "观察对象标签的数量。"
      },
      {
        "key": "showIndicators",
        "label": "指标面板",
        "type": "toggle",
        "default": true,
        "desc": "底部的观察指标面板（关闭则时间轴铺满整幅）。"
      },
      {
        "key": "indicatorCount",
        "label": "指标项数量",
        "type": "slider",
        "default": 4,
        "min": 2,
        "max": 4,
        "step": 1,
        "desc": "观察指标的条目数量。"
      },
      {
        "key": "panelTheme",
        "label": "面板主题",
        "type": "radio",
        "default": "dark",
        "options": [
          {
            "value": "dark",
            "label": "深色"
          },
          {
            "value": "color",
            "label": "色块"
          },
          {
            "value": "paper",
            "label": "纸色"
          }
        ],
        "desc": "指标面板背景：深色 / 强调色块 / 纸色。"
      },
      {
        "key": "showLead",
        "label": "引导说明",
        "type": "toggle",
        "default": true,
        "desc": "标题下方的一句引导说明。"
      },
      {
        "key": "accentColor",
        "label": "强调色",
        "type": "color",
        "default": "#2c44a0",
        "options": [
          "#d8402e",
          "#e2742c",
          "#efbe2e",
          "#3c9a52",
          "#4da0c6",
          "#2c44a0",
          "#7a3c90"
        ],
        "desc": "眉标 / 重点节点 / 窗口进度 /「色块」主题面板的颜色。"
      },
      {
        "key": "showConclusion",
        "label": "结论文案",
        "type": "toggle",
        "default": true,
        "desc": "底部的一句装饰性结论。"
      },
      {
        "key": "showSheetLabel",
        "label": "页码标签",
        "type": "toggle",
        "default": true,
        "desc": "右上角的页码 / 章节标签。"
      }
    ],
    "defaultProps": {
      "nodeCount": 4,
      "focusEnabled": true,
      "focusIndex": 2,
      "showWindowFill": true,
      "showWatchlist": true,
      "watchCount": 4,
      "showIndicators": true,
      "indicatorCount": 4,
      "panelTheme": "dark",
      "showLead": true,
      "accentColor": "#2c44a0",
      "showConclusion": true,
      "showSheetLabel": true
    }
  },
  {
    "key": "theme05_page084",
    "themeKey": "theme05",
    "pageNumber": 84,
    "layout": "THEME05-084",
    "slot": "verdict",
    "label": "最终判断 Verdict",
    "bgClass": "",
    "controls": [
      {
        "key": "theme",
        "label": "背景主题",
        "type": "radio",
        "default": "dark",
        "options": [
          {
            "value": "paper",
            "label": "纸色"
          },
          {
            "value": "dark",
            "label": "深色"
          },
          {
            "value": "color",
            "label": "色块"
          }
        ],
        "desc": "页面背景：纸色 / 深色 / 整页强调色块。"
      },
      {
        "key": "bgColor",
        "label": "色块背景",
        "type": "color",
        "default": "#d8402e",
        "options": [
          "#d8402e",
          "#e2742c",
          "#efbe2e",
          "#3c9a52",
          "#4da0c6",
          "#2c44a0",
          "#7a3c90"
        ],
        "desc": "「色块」主题下的整页背景色（其它主题忽略）。"
      },
      {
        "key": "align",
        "label": "对齐方式",
        "type": "radio",
        "default": "center",
        "options": [
          {
            "value": "left",
            "label": "左对齐"
          },
          {
            "value": "center",
            "label": "居中"
          }
        ],
        "desc": "金句与辅助信息的对齐方式。"
      },
      {
        "key": "emphasis",
        "label": "重点词高亮",
        "type": "toggle",
        "default": true,
        "desc": "是否用强调色高亮金句中的关键词。"
      },
      {
        "key": "showTag",
        "label": "判断标签",
        "type": "toggle",
        "default": true,
        "desc": "金句上方的「最终判断」标签。"
      },
      {
        "key": "showSub",
        "label": "辅助说明",
        "type": "toggle",
        "default": true,
        "desc": "金句下方的一行辅助说明文字。"
      },
      {
        "key": "showMarker",
        "label": "收尾标记",
        "type": "toggle",
        "default": true,
        "desc": "右下角的「完 / END」收尾装饰标记。"
      },
      {
        "key": "showFooter",
        "label": "页脚署名",
        "type": "toggle",
        "default": true,
        "desc": "底部品牌标识与报告署名（与封面呼应）。"
      },
      {
        "key": "showColorBand",
        "label": "色谱条",
        "type": "toggle",
        "default": true,
        "desc": "页脚处的小色谱条带。"
      },
      {
        "key": "accentColor",
        "label": "强调色",
        "type": "color",
        "default": "#d8402e",
        "options": [
          "#d8402e",
          "#e2742c",
          "#efbe2e",
          "#3c9a52",
          "#4da0c6",
          "#2c44a0",
          "#7a3c90"
        ],
        "desc": "标签 / 重点词 / 收尾标记的强调色。"
      },
      {
        "key": "showSheetLabel",
        "label": "页码标签",
        "type": "toggle",
        "default": true,
        "desc": "右上角的页码 / 章节标签。"
      }
    ],
    "defaultProps": {
      "theme": "dark",
      "bgColor": "#d8402e",
      "align": "center",
      "emphasis": true,
      "showTag": true,
      "showSub": true,
      "showMarker": true,
      "showFooter": true,
      "showColorBand": true,
      "accentColor": "#d8402e",
      "showSheetLabel": true
    }
  },
  {
    "key": "theme05_page085",
    "themeKey": "theme05",
    "pageNumber": 85,
    "layout": "THEME05-085",
    "slot": "slope",
    "label": "排名变迁 Slope",
    "bgClass": "",
    "controls": [
      {
        "key": "itemCount",
        "label": "条目数量",
        "type": "slider",
        "default": 6,
        "min": 4,
        "max": 7,
        "step": 1,
        "desc": "参与排名对比的条目数量（4–7）。两侧排名按各自周期分值自动计算。"
      },
      {
        "key": "colorMode",
        "label": "连线配色",
        "type": "radio",
        "default": "change",
        "options": [
          {
            "value": "change",
            "label": "涨跌"
          },
          {
            "value": "category",
            "label": "类别"
          },
          {
            "value": "mono",
            "label": "单色"
          }
        ],
        "desc": "连线着色：按排名涨跌（升绿/降红/平墨）/ 按类别色谱 / 单色。"
      },
      {
        "key": "focusEnabled",
        "label": "重点条目",
        "type": "toggle",
        "default": true,
        "desc": "是否突出某一条目（其余连线淡出）。"
      },
      {
        "key": "focusIndex",
        "label": "重点序号",
        "type": "slider",
        "default": 1,
        "min": 1,
        "max": 7,
        "step": 1,
        "desc": "重点条目序号（按本周期排名）。"
      },
      {
        "key": "showRankNumber",
        "label": "排名序号",
        "type": "toggle",
        "default": true,
        "desc": "两侧的大号排名序号。"
      },
      {
        "key": "showValue",
        "label": "数值标注",
        "type": "toggle",
        "default": true,
        "desc": "条目名称旁的本期数值。"
      },
      {
        "key": "showDelta",
        "label": "升降标记",
        "type": "toggle",
        "default": true,
        "desc": "右侧的排名升降量（▲/▼）标记。"
      },
      {
        "key": "accentColor",
        "label": "强调色",
        "type": "color",
        "default": "#d8402e",
        "options": [
          "#d8402e",
          "#e2742c",
          "#efbe2e",
          "#3c9a52",
          "#4da0c6",
          "#2c44a0",
          "#7a3c90"
        ],
        "desc": "眉标 / 重点连线 / 标记的强调色。"
      },
      {
        "key": "showConclusion",
        "label": "结论文案",
        "type": "toggle",
        "default": true,
        "desc": "底部的一句装饰性结论。"
      },
      {
        "key": "showSheetLabel",
        "label": "页码标签",
        "type": "toggle",
        "default": true,
        "desc": "右上角的页码 / 章节标签。"
      }
    ],
    "defaultProps": {
      "itemCount": 6,
      "colorMode": "change",
      "focusEnabled": true,
      "focusIndex": 1,
      "showRankNumber": true,
      "showValue": true,
      "showDelta": true,
      "accentColor": "#d8402e",
      "showConclusion": true,
      "showSheetLabel": true
    }
  },
  {
    "key": "theme05_page086",
    "themeKey": "theme05",
    "pageNumber": 86,
    "layout": "THEME05-086",
    "slot": "scorecard",
    "label": "综合评分 Scorecard",
    "bgClass": "",
    "controls": [
      {
        "key": "rowCount",
        "label": "评分主体数",
        "type": "slider",
        "default": 5,
        "min": 3,
        "max": 6,
        "step": 1,
        "desc": "参与评分的主体（行）数量（3–6）。"
      },
      {
        "key": "colCount",
        "label": "评分维度数",
        "type": "slider",
        "default": 4,
        "min": 3,
        "max": 5,
        "step": 1,
        "desc": "评分维度（列）数量（3–5）。"
      },
      {
        "key": "gradeStyle",
        "label": "单元样式",
        "type": "radio",
        "default": "letter",
        "options": [
          {
            "value": "letter",
            "label": "等级"
          },
          {
            "value": "score",
            "label": "分值"
          },
          {
            "value": "dot",
            "label": "点阵"
          }
        ],
        "desc": "单元格内容：字母等级 / 0–100 分值 / 五点评级。"
      },
      {
        "key": "colorScale",
        "label": "色阶",
        "type": "radio",
        "default": "heat",
        "options": [
          {
            "value": "heat",
            "label": "热力"
          },
          {
            "value": "accent",
            "label": "强调"
          },
          {
            "value": "mono",
            "label": "单色"
          }
        ],
        "desc": "单元格底色映射：热力色阶 / 强调色深浅 / 单色深浅。"
      },
      {
        "key": "showOverall",
        "label": "综合列",
        "type": "toggle",
        "default": true,
        "desc": "末尾加权综合分列（强调显示）。"
      },
      {
        "key": "focusEnabled",
        "label": "重点行",
        "type": "toggle",
        "default": true,
        "desc": "是否突出某一行（整行描边）。"
      },
      {
        "key": "focusIndex",
        "label": "重点序号",
        "type": "slider",
        "default": 1,
        "min": 1,
        "max": 6,
        "step": 1,
        "desc": "重点行序号。"
      },
      {
        "key": "zebra",
        "label": "隔行底色",
        "type": "toggle",
        "default": false,
        "desc": "行名称列的斑马纹底色。"
      },
      {
        "key": "showIntro",
        "label": "引导文案",
        "type": "toggle",
        "default": true,
        "desc": "表格上方的引导说明。"
      },
      {
        "key": "accentColor",
        "label": "强调色",
        "type": "color",
        "default": "#2c44a0",
        "options": [
          "#d8402e",
          "#e2742c",
          "#efbe2e",
          "#3c9a52",
          "#4da0c6",
          "#2c44a0",
          "#7a3c90"
        ],
        "desc": "眉标 / 表头 / 重点行 / 综合列的强调色。"
      },
      {
        "key": "showConclusion",
        "label": "结论文案",
        "type": "toggle",
        "default": true,
        "desc": "表格下方的一句装饰性结论。"
      },
      {
        "key": "showSheetLabel",
        "label": "页码标签",
        "type": "toggle",
        "default": true,
        "desc": "右上角的页码 / 章节标签。"
      }
    ],
    "defaultProps": {
      "rowCount": 5,
      "colCount": 4,
      "gradeStyle": "letter",
      "colorScale": "heat",
      "showOverall": true,
      "focusEnabled": true,
      "focusIndex": 1,
      "zebra": false,
      "showIntro": true,
      "accentColor": "#2c44a0",
      "showConclusion": true,
      "showSheetLabel": true
    }
  },
  {
    "key": "theme05_page087",
    "themeKey": "theme05",
    "pageNumber": 87,
    "layout": "THEME05-087",
    "slot": "era",
    "label": "周期里程 Era",
    "bgClass": "",
    "controls": [
      {
        "key": "nodeCount",
        "label": "节点数量",
        "type": "slider",
        "default": 5,
        "min": 3,
        "max": 6,
        "step": 1,
        "desc": "时间轴里程碑节点数量（3–6）。"
      },
      {
        "key": "layout",
        "label": "卡片排布",
        "type": "radio",
        "default": "alternate",
        "options": [
          {
            "value": "alternate",
            "label": "上下交错"
          },
          {
            "value": "below",
            "label": "全部在下"
          }
        ],
        "desc": "节点卡片相对轴线的位置：上下交错 / 全部在轴线下方。"
      },
      {
        "key": "focusEnabled",
        "label": "重点节点",
        "type": "toggle",
        "default": true,
        "desc": "是否突出某一节点（放大 + 强调色）。"
      },
      {
        "key": "focusIndex",
        "label": "重点序号",
        "type": "slider",
        "default": 4,
        "min": 1,
        "max": 6,
        "step": 1,
        "desc": "重点节点序号。"
      },
      {
        "key": "showValue",
        "label": "节点数值",
        "type": "toggle",
        "default": true,
        "desc": "每个节点的巨号数值（如季度金额）。"
      },
      {
        "key": "showNote",
        "label": "节点说明",
        "type": "toggle",
        "default": true,
        "desc": "每个节点卡片内的一句说明。"
      },
      {
        "key": "showAxisCaps",
        "label": "轴端标签",
        "type": "toggle",
        "default": true,
        "desc": "轴线两端的「起点 / 当前」标签。"
      },
      {
        "key": "accentColor",
        "label": "强调色",
        "type": "color",
        "default": "#2c44a0",
        "options": [
          "#d8402e",
          "#e2742c",
          "#efbe2e",
          "#3c9a52",
          "#4da0c6",
          "#2c44a0",
          "#7a3c90"
        ],
        "desc": "眉标 / 轴线 / 重点节点的强调色。"
      },
      {
        "key": "showConclusion",
        "label": "结论文案",
        "type": "toggle",
        "default": true,
        "desc": "底部的一句装饰性结论。"
      },
      {
        "key": "showSheetLabel",
        "label": "页码标签",
        "type": "toggle",
        "default": true,
        "desc": "右上角的页码 / 章节标签。"
      }
    ],
    "defaultProps": {
      "nodeCount": 5,
      "layout": "alternate",
      "focusEnabled": true,
      "focusIndex": 4,
      "showValue": true,
      "showNote": true,
      "showAxisCaps": true,
      "accentColor": "#2c44a0",
      "showConclusion": true,
      "showSheetLabel": true
    }
  },
  {
    "key": "theme05_page088",
    "themeKey": "theme05",
    "pageNumber": 88,
    "layout": "THEME05-088",
    "slot": "mosaic",
    "label": "影像档案 Mosaic",
    "bgClass": "",
    "controls": [
      {
        "key": "imageCount",
        "label": "图片槽数量",
        "type": "slider",
        "default": 3,
        "min": 0,
        "max": 5,
        "step": 1,
        "desc": "图片槽数量（0–5），按各图比例自适应均衡排布。为 0 时身份列铺满整幅、媒体侧转为色谱占位。"
      },
      {
        "key": "imageSide",
        "label": "图片位置",
        "type": "radio",
        "default": "right",
        "options": [
          {
            "value": "right",
            "label": "右侧"
          },
          {
            "value": "left",
            "label": "左侧"
          }
        ],
        "desc": "图片区相对身份列的位置（有图片时生效）。"
      },
      {
        "key": "heroWeight",
        "label": "首图主图",
        "type": "toggle",
        "default": true,
        "desc": "首张图片额外加宽，作为视觉主图锚定构图。"
      },
      {
        "key": "showDisplay",
        "label": "巨号字标",
        "type": "toggle",
        "default": true,
        "desc": "身份列的巨号数字字标与说明。"
      },
      {
        "key": "showIndex",
        "label": "图片编号",
        "type": "toggle",
        "default": true,
        "desc": "各图角上的序号标签。"
      },
      {
        "key": "tagCount",
        "label": "标签数量",
        "type": "slider",
        "default": 4,
        "min": 0,
        "max": 4,
        "step": 1,
        "desc": "主题标签 chip 数量（0 隐藏整行）。"
      },
      {
        "key": "showLead",
        "label": "引导文案",
        "type": "toggle",
        "default": true,
        "desc": "标题下方的一段引导说明。"
      },
      {
        "key": "showMediaCaption",
        "label": "图注",
        "type": "toggle",
        "default": true,
        "desc": "图片区上方的装饰性图注。"
      },
      {
        "key": "accentColor",
        "label": "强调色",
        "type": "color",
        "default": "#d8402e",
        "options": [
          "#d8402e",
          "#e2742c",
          "#efbe2e",
          "#3c9a52",
          "#4da0c6",
          "#2c44a0",
          "#7a3c90"
        ],
        "desc": "眉标 / 巨号字标 / 强调条的强调色。"
      },
      {
        "key": "showConclusion",
        "label": "结论文案",
        "type": "toggle",
        "default": true,
        "desc": "底部的一句装饰性结论。"
      },
      {
        "key": "showSheetLabel",
        "label": "页码标签",
        "type": "toggle",
        "default": true,
        "desc": "右上角的页码 / 章节标签。"
      }
    ],
    "defaultProps": {
      "imageCount": 3,
      "imageSide": "right",
      "heroWeight": true,
      "showDisplay": true,
      "showIndex": true,
      "tagCount": 4,
      "showLead": true,
      "showMediaCaption": true,
      "accentColor": "#d8402e",
      "showConclusion": true,
      "showSheetLabel": true
    }
  },
  {
    "key": "theme05_page089",
    "themeKey": "theme05",
    "pageNumber": 89,
    "layout": "THEME05-089",
    "slot": "plate",
    "label": "全幅影像 Plate",
    "bgClass": "",
    "controls": [
      {
        "key": "imageCount",
        "label": "图片槽数量",
        "type": "slider",
        "default": 1,
        "min": 0,
        "max": 3,
        "step": 1,
        "desc": "全幅图片槽数量（0–3）。1 张铺满整幅；多张按比例自适应分列；为 0 时显示色谱占位。"
      },
      {
        "key": "panelPosition",
        "label": "标题位置",
        "type": "radio",
        "default": "tl",
        "options": [
          {
            "value": "tl",
            "label": "左上"
          },
          {
            "value": "tr",
            "label": "右上"
          },
          {
            "value": "bl",
            "label": "左下"
          }
        ],
        "desc": "标题面板的锚定位置（左下时自动隐藏底部指标条以避免重叠）。"
      },
      {
        "key": "panelTheme",
        "label": "面板主题",
        "type": "radio",
        "default": "ink",
        "options": [
          {
            "value": "ink",
            "label": "墨色"
          },
          {
            "value": "paper",
            "label": "纸色"
          },
          {
            "value": "color",
            "label": "色块"
          }
        ],
        "desc": "标题面板背景：墨色 / 纸色 / 强调色块（保证压在图片上的可读性）。"
      },
      {
        "key": "showKicker",
        "label": "引导文案",
        "type": "toggle",
        "default": true,
        "desc": "标题面板内的一句引导说明。"
      },
      {
        "key": "showTicker",
        "label": "指标条",
        "type": "toggle",
        "default": true,
        "desc": "底部贯穿的指标 ticker（左下标题时自动隐藏）。"
      },
      {
        "key": "tickerCount",
        "label": "指标条目数",
        "type": "slider",
        "default": 4,
        "min": 1,
        "max": 4,
        "step": 1,
        "desc": "底部指标条的条目数量。"
      },
      {
        "key": "showScrim",
        "label": "压暗蒙层",
        "type": "toggle",
        "default": true,
        "desc": "图片上的渐变压暗蒙层（提升叠字可读性）。"
      },
      {
        "key": "showMediaCaption",
        "label": "图注",
        "type": "toggle",
        "default": true,
        "desc": "图片角上的装饰性图注。"
      },
      {
        "key": "accentColor",
        "label": "强调色",
        "type": "color",
        "default": "#d8402e",
        "options": [
          "#d8402e",
          "#e2742c",
          "#efbe2e",
          "#3c9a52",
          "#4da0c6",
          "#2c44a0",
          "#7a3c90"
        ],
        "desc": "眉标 / 色块面板 / 指标条强调色。"
      },
      {
        "key": "showSheetLabel",
        "label": "页码标签",
        "type": "toggle",
        "default": true,
        "desc": "角上的页码 / 章节标签。"
      }
    ],
    "defaultProps": {
      "imageCount": 1,
      "panelPosition": "tl",
      "panelTheme": "ink",
      "showKicker": true,
      "showTicker": true,
      "tickerCount": 4,
      "showScrim": true,
      "showMediaCaption": true,
      "accentColor": "#d8402e",
      "showSheetLabel": true
    }
  },
  {
    "key": "theme05_page090",
    "themeKey": "theme05",
    "pageNumber": 90,
    "layout": "THEME05-090",
    "slot": "mekko",
    "label": "变宽堆叠 Mekko",
    "bgClass": "",
    "controls": [
      {
        "key": "colCount",
        "label": "列数量",
        "type": "slider",
        "default": 4,
        "min": 2,
        "max": 5,
        "step": 1,
        "desc": "变宽列的数量（2–5）。列宽按各列体量自动分配。"
      },
      {
        "key": "segmentCount",
        "label": "分段数量",
        "type": "slider",
        "default": 4,
        "min": 2,
        "max": 4,
        "step": 1,
        "desc": "每列内堆叠分段的数量（2–4）。列高按所选分段求和归一。"
      },
      {
        "key": "focusEnabled",
        "label": "重点列",
        "type": "toggle",
        "default": true,
        "desc": "是否突出某一列（其余列淡出）。"
      },
      {
        "key": "focusIndex",
        "label": "重点序号",
        "type": "slider",
        "default": 1,
        "min": 1,
        "max": 5,
        "step": 1,
        "desc": "重点列序号（按当前列顺序）。"
      },
      {
        "key": "showSegValue",
        "label": "分段占比",
        "type": "toggle",
        "default": true,
        "desc": "足够高的分段内显示其列内占比 %。"
      },
      {
        "key": "showColTotal",
        "label": "列体量标注",
        "type": "toggle",
        "default": true,
        "desc": "各列下方的体量数值与整体占比。"
      },
      {
        "key": "showLegend",
        "label": "分段图例",
        "type": "toggle",
        "default": true,
        "desc": "顶部的分段类别图例。"
      },
      {
        "key": "accentColor",
        "label": "强调色",
        "type": "color",
        "default": "#d8402e",
        "options": [
          "#d8402e",
          "#e2742c",
          "#efbe2e",
          "#3c9a52",
          "#4da0c6",
          "#2c44a0",
          "#7a3c90"
        ],
        "desc": "眉标 / 重点列标记强调色。"
      },
      {
        "key": "showConclusion",
        "label": "结论文案",
        "type": "toggle",
        "default": true,
        "desc": "底部的一句装饰性结论。"
      },
      {
        "key": "showSheetLabel",
        "label": "页码标签",
        "type": "toggle",
        "default": true,
        "desc": "右上角的页码 / 章节标签。"
      }
    ],
    "defaultProps": {
      "colCount": 4,
      "segmentCount": 4,
      "focusEnabled": true,
      "focusIndex": 1,
      "showSegValue": true,
      "showColTotal": true,
      "showLegend": true,
      "accentColor": "#d8402e",
      "showConclusion": true,
      "showSheetLabel": true
    }
  },
  {
    "key": "theme05_page091",
    "themeKey": "theme05",
    "pageNumber": 91,
    "layout": "THEME05-091",
    "slot": "versus",
    "label": "对比大数字 Versus",
    "bgClass": "",
    "controls": [
      {
        "key": "operator",
        "label": "对比符号",
        "type": "radio",
        "default": "ratio",
        "options": [
          {
            "value": "ratio",
            "label": "∶"
          },
          {
            "value": "times",
            "label": "×"
          },
          {
            "value": "arrow",
            "label": "→"
          }
        ],
        "desc": "两个数字之间的运算 / 关系符号。"
      },
      {
        "key": "emphasize",
        "label": "强调侧",
        "type": "radio",
        "default": "left",
        "options": [
          {
            "value": "left",
            "label": "左"
          },
          {
            "value": "right",
            "label": "右"
          },
          {
            "value": "both",
            "label": "两侧"
          }
        ],
        "desc": "用强调色着重的一侧数字。"
      },
      {
        "key": "showBadge",
        "label": "倍数徽标",
        "type": "toggle",
        "default": true,
        "desc": "中心的比值 / 倍数徽标。"
      },
      {
        "key": "showCaption",
        "label": "数字说明",
        "type": "toggle",
        "default": true,
        "desc": "每个数字下方的一句说明。"
      },
      {
        "key": "auxCount",
        "label": "辅助指标数",
        "type": "slider",
        "default": 3,
        "min": 0,
        "max": 3,
        "step": 1,
        "desc": "底部支撑指标的数量（0 隐藏整行）。"
      },
      {
        "key": "showClosing",
        "label": "结语文案",
        "type": "toggle",
        "default": true,
        "desc": "底部的一句结语。"
      },
      {
        "key": "accentColor",
        "label": "强调色",
        "type": "color",
        "default": "#d8402e",
        "options": [
          "#d8402e",
          "#e2742c",
          "#efbe2e",
          "#3c9a52",
          "#4da0c6",
          "#2c44a0",
          "#7a3c90"
        ],
        "desc": "眉标 / 强调侧数字 / 徽标的强调色。"
      },
      {
        "key": "showWordmark",
        "label": "品牌标识",
        "type": "toggle",
        "default": true,
        "desc": "左下角的品牌标识。"
      },
      {
        "key": "showColorBand",
        "label": "色谱条",
        "type": "toggle",
        "default": true,
        "desc": "右下角的装饰色谱条。"
      },
      {
        "key": "showSheetLabel",
        "label": "页码标签",
        "type": "toggle",
        "default": true,
        "desc": "右上角的页码 / 章节标签。"
      }
    ],
    "defaultProps": {
      "operator": "ratio",
      "emphasize": "left",
      "showBadge": true,
      "showCaption": true,
      "auxCount": 3,
      "showClosing": true,
      "accentColor": "#d8402e",
      "showWordmark": true,
      "showColorBand": true,
      "showSheetLabel": true
    }
  },
  {
    "key": "theme05_page092",
    "themeKey": "theme05",
    "pageNumber": 92,
    "layout": "THEME05-092",
    "slot": "lede",
    "label": "金句 Lede",
    "bgClass": "",
    "controls": [
      {
        "key": "theme",
        "label": "背景主题",
        "type": "radio",
        "default": "paper",
        "options": [
          {
            "value": "paper",
            "label": "纸色"
          },
          {
            "value": "dark",
            "label": "深色"
          },
          {
            "value": "color",
            "label": "色块"
          }
        ],
        "desc": "页面背景：纸色 / 深色 / 整页强调色块。"
      },
      {
        "key": "bgColor",
        "label": "色块背景",
        "type": "color",
        "default": "#2c44a0",
        "options": [
          "#d8402e",
          "#e2742c",
          "#efbe2e",
          "#3c9a52",
          "#4da0c6",
          "#2c44a0",
          "#7a3c90"
        ],
        "desc": "「色块」主题下的整页背景色（其它主题忽略）。"
      },
      {
        "key": "align",
        "label": "对齐",
        "type": "radio",
        "default": "left",
        "options": [
          {
            "value": "left",
            "label": "左对齐"
          },
          {
            "value": "center",
            "label": "居中"
          }
        ],
        "desc": "金句对齐方式（左对齐时启用首字下沉）。"
      },
      {
        "key": "showInitial",
        "label": "首字下沉",
        "type": "toggle",
        "default": true,
        "desc": "句首的巨号下沉首字（仅左对齐生效）。"
      },
      {
        "key": "emphasis",
        "label": "关键词强调",
        "type": "toggle",
        "default": true,
        "desc": "用强调色高亮句中的关键词。"
      },
      {
        "key": "showSource",
        "label": "来源署名",
        "type": "toggle",
        "default": true,
        "desc": "金句下方的来源 / 署名行。"
      },
      {
        "key": "showTag",
        "label": "主题标签",
        "type": "toggle",
        "default": true,
        "desc": "顶部的一枚主题标签。"
      },
      {
        "key": "accentColor",
        "label": "强调色",
        "type": "color",
        "default": "#d8402e",
        "options": [
          "#d8402e",
          "#e2742c",
          "#efbe2e",
          "#3c9a52",
          "#4da0c6",
          "#2c44a0",
          "#7a3c90"
        ],
        "desc": "眉标 / 首字 / 关键词强调色。"
      },
      {
        "key": "showColorBand",
        "label": "色谱条",
        "type": "toggle",
        "default": true,
        "desc": "底部贯穿的色谱条带。"
      },
      {
        "key": "showSheetLabel",
        "label": "页码标签",
        "type": "toggle",
        "default": true,
        "desc": "右上角的页码 / 章节标签。"
      }
    ],
    "defaultProps": {
      "theme": "paper",
      "bgColor": "#2c44a0",
      "align": "left",
      "showInitial": true,
      "emphasis": true,
      "showSource": true,
      "showTag": true,
      "accentColor": "#d8402e",
      "showColorBand": true,
      "showSheetLabel": true
    }
  },
  {
    "key": "theme05_page093",
    "themeKey": "theme05",
    "pageNumber": 93,
    "layout": "THEME05-093",
    "slot": "colophon",
    "label": "数据来源 Appendix",
    "bgClass": "",
    "controls": [
      {
        "key": "sourceCount",
        "label": "来源条目数",
        "type": "slider",
        "default": 4,
        "min": 2,
        "max": 4,
        "step": 1,
        "desc": "数据来源台账的条目数量。"
      },
      {
        "key": "columns",
        "label": "来源列数",
        "type": "slider",
        "default": 2,
        "min": 1,
        "max": 2,
        "step": 1,
        "desc": "数据来源台账的排布列数。"
      },
      {
        "key": "showScopePanel",
        "label": "口径面板",
        "type": "toggle",
        "default": true,
        "desc": "左侧的研究口径面板（关闭则来源台账铺满整幅）。"
      },
      {
        "key": "specRowCount",
        "label": "口径行数",
        "type": "slider",
        "default": 5,
        "min": 2,
        "max": 5,
        "step": 1,
        "desc": "研究口径面板的行数。"
      },
      {
        "key": "panelTheme",
        "label": "面板主题",
        "type": "radio",
        "default": "dark",
        "options": [
          {
            "value": "dark",
            "label": "深色"
          },
          {
            "value": "color",
            "label": "色块"
          },
          {
            "value": "paper",
            "label": "纸色"
          }
        ],
        "desc": "口径面板背景：深色 / 强调色块 / 纸色。"
      },
      {
        "key": "focusEnabled",
        "label": "重点来源",
        "type": "toggle",
        "default": false,
        "desc": "是否突出某一条数据来源。"
      },
      {
        "key": "focusIndex",
        "label": "重点来源序号",
        "type": "slider",
        "default": 1,
        "min": 1,
        "max": 4,
        "step": 1,
        "desc": "被突出的来源序号（从 1 起）。"
      },
      {
        "key": "showMethodChips",
        "label": "方法标签带",
        "type": "toggle",
        "default": true,
        "desc": "底部的方法说明标签带。"
      },
      {
        "key": "methodCount",
        "label": "方法标签数",
        "type": "slider",
        "default": 4,
        "min": 2,
        "max": 4,
        "step": 1,
        "desc": "方法说明标签的数量。"
      },
      {
        "key": "showLead",
        "label": "引导说明",
        "type": "toggle",
        "default": true,
        "desc": "标题下方的一句引导说明。"
      },
      {
        "key": "accentColor",
        "label": "强调色",
        "type": "color",
        "default": "#4da0c6",
        "options": [
          "#d8402e",
          "#e2742c",
          "#efbe2e",
          "#3c9a52",
          "#4da0c6",
          "#2c44a0",
          "#7a3c90"
        ],
        "desc": "眉标 / 来源序号 /「色块」主题面板 / 重点项的颜色。"
      },
      {
        "key": "showConclusion",
        "label": "结论文案",
        "type": "toggle",
        "default": true,
        "desc": "底部的一句装饰性结论。"
      },
      {
        "key": "showSheetLabel",
        "label": "页码标签",
        "type": "toggle",
        "default": true,
        "desc": "右上角的页码 / 章节标签。"
      }
    ],
    "defaultProps": {
      "sourceCount": 4,
      "columns": 2,
      "showScopePanel": true,
      "specRowCount": 5,
      "panelTheme": "dark",
      "focusEnabled": false,
      "focusIndex": 1,
      "showMethodChips": true,
      "methodCount": 4,
      "showLead": true,
      "accentColor": "#4da0c6",
      "showConclusion": true,
      "showSheetLabel": true
    }
  },
  {
    "key": "theme05_page094",
    "themeKey": "theme05",
    "pageNumber": 94,
    "layout": "THEME05-094",
    "slot": "endcap",
    "label": "封底 Back Cover",
    "bgClass": "",
    "controls": [
      {
        "key": "theme",
        "label": "背景主题",
        "type": "radio",
        "default": "dark",
        "options": [
          {
            "value": "dark",
            "label": "深色"
          },
          {
            "value": "paper",
            "label": "纸色"
          },
          {
            "value": "color",
            "label": "色块"
          }
        ],
        "desc": "页面背景：深色 / 纸色 / 整页强调色块。"
      },
      {
        "key": "bgColor",
        "label": "色块背景",
        "type": "color",
        "default": "#2c44a0",
        "options": [
          "#d8402e",
          "#e2742c",
          "#efbe2e",
          "#3c9a52",
          "#4da0c6",
          "#2c44a0",
          "#7a3c90"
        ],
        "desc": "「色块」主题下的整页背景色（其它主题忽略）。"
      },
      {
        "key": "layout",
        "label": "构图方式",
        "type": "radio",
        "default": "left",
        "options": [
          {
            "value": "left",
            "label": "左对齐"
          },
          {
            "value": "center",
            "label": "居中"
          }
        ],
        "desc": "大字与信息的整体构图：左对齐（带侧栏面板）/ 居中。"
      },
      {
        "key": "showMetaBar",
        "label": "顶部品牌条",
        "type": "toggle",
        "default": true,
        "desc": "顶部的品牌标识与元信息条。"
      },
      {
        "key": "showPanel",
        "label": "版本信息面板",
        "type": "toggle",
        "default": true,
        "desc": "右侧 COLOPHON 版本信息面板（居中构图时转为底部信息行）。"
      },
      {
        "key": "specRowCount",
        "label": "信息行数",
        "type": "slider",
        "default": 4,
        "min": 1,
        "max": 4,
        "step": 1,
        "desc": "版本信息面板的行数。"
      },
      {
        "key": "showClosing",
        "label": "结语标语",
        "type": "toggle",
        "default": true,
        "desc": "大字下方的一句结语标语。"
      },
      {
        "key": "showSwatches",
        "label": "色谱色卡",
        "type": "toggle",
        "default": true,
        "desc": "面板内的七色色谱色卡。"
      },
      {
        "key": "showColorBand",
        "label": "底部色谱条",
        "type": "toggle",
        "default": true,
        "desc": "页面底部贯穿的色谱条带。"
      },
      {
        "key": "accentColor",
        "label": "强调色",
        "type": "color",
        "default": "#d8402e",
        "options": [
          "#d8402e",
          "#e2742c",
          "#efbe2e",
          "#3c9a52",
          "#4da0c6",
          "#2c44a0",
          "#7a3c90"
        ],
        "desc": "眉标 / 大字强调的颜色。"
      },
      {
        "key": "showSheetLabel",
        "label": "页码标签",
        "type": "toggle",
        "default": false,
        "desc": "右上角的封底标签（封底默认隐藏）。"
      }
    ],
    "defaultProps": {
      "theme": "dark",
      "bgColor": "#2c44a0",
      "layout": "left",
      "showMetaBar": true,
      "showPanel": true,
      "specRowCount": 4,
      "showClosing": true,
      "showSwatches": true,
      "showColorBand": true,
      "accentColor": "#d8402e",
      "showSheetLabel": false
    }
  }
];
