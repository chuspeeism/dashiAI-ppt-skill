export const theme = {
  "key": "theme10",
  "displayName": "金色指数风",
  "label": "金色指数风",
  "name": "金色指数风",
  "scenario": "金融数据、投资报告、商业指数、年度榜单",
  "audience": "投资机构、金融分析师、咨询公司、商业媒体",
  "mode": "new"
};
export const pages = [
  {
    "key": "theme10_page001",
    "themeKey": "theme10",
    "pageNumber": 1,
    "layout": "THEME10-001",
    "slot": "coverdusk",
    "label": "暮光对角",
    "bgClass": "",
    "controls": [
      {
        "key": "theme",
        "type": "select",
        "label": "渐变情绪",
        "default": "dusk",
        "options": [
          {
            "value": "dusk",
            "label": "暮光"
          },
          {
            "value": "midnight",
            "label": "午夜"
          },
          {
            "value": "dawn",
            "label": "晨曦"
          }
        ],
        "description": "对角渐变的配色基调。",
        "publicKey": "theme",
        "publicLabel": "渐变情绪",
        "desc": "对角渐变的配色基调。"
      },
      {
        "key": "align",
        "type": "radio",
        "label": "文本对齐",
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
        "description": "标题区块的水平对齐。",
        "publicKey": "align",
        "publicLabel": "文本对齐",
        "desc": "标题区块的水平对齐。"
      },
      {
        "key": "showRule",
        "type": "toggle",
        "label": "强调横条",
        "default": true,
        "description": "标题上方的强调色横条。",
        "publicKey": "showRule",
        "publicLabel": "强调横条",
        "desc": "标题上方的强调色横条。"
      },
      {
        "key": "showFooter",
        "type": "toggle",
        "label": "页脚信息",
        "default": true,
        "description": "底部细线分隔的页脚信息行。",
        "publicKey": "showFooter",
        "publicLabel": "页脚信息",
        "desc": "底部细线分隔的页脚信息行。"
      },
      {
        "key": "showGrain",
        "type": "toggle",
        "label": "颗粒质感",
        "default": true,
        "description": "渐变之上的细颗粒纹理。",
        "publicKey": "showGrain",
        "publicLabel": "颗粒质感",
        "desc": "渐变之上的细颗粒纹理。"
      }
    ],
    "defaultProps": {
      "theme": "dusk",
      "align": "left",
      "showRule": true,
      "showFooter": true,
      "showGrain": true,
      "idPrefix": "coverdusk"
    }
  },
  {
    "key": "theme10_page002",
    "themeKey": "theme10",
    "pageNumber": 2,
    "layout": "THEME10-002",
    "slot": "coverfield",
    "label": "渐变色场分栏",
    "bgClass": "",
    "controls": [
      {
        "key": "theme",
        "type": "select",
        "label": "色场情绪",
        "default": "dusk",
        "options": [
          {
            "value": "dusk",
            "label": "暮光"
          },
          {
            "value": "dawn",
            "label": "晨曦"
          },
          {
            "value": "mono",
            "label": "灰阶"
          }
        ],
        "description": "渐变色场的配色基调。",
        "publicKey": "theme",
        "publicLabel": "色场情绪",
        "desc": "渐变色场的配色基调。"
      },
      {
        "key": "fieldSide",
        "type": "radio",
        "label": "色场位置",
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
        "description": "渐变色场位于文字面板的哪一侧。",
        "publicKey": "fieldSide",
        "publicLabel": "色场位置",
        "desc": "渐变色场位于文字面板的哪一侧。"
      },
      {
        "key": "panelWidth",
        "type": "slider",
        "label": "文字区宽度",
        "default": 46,
        "min": 40,
        "max": 58,
        "step": 1,
        "unit": "%",
        "description": "文字面板占整页的宽度比例。",
        "publicKey": "panelWidth",
        "publicLabel": "文字区宽度",
        "desc": "文字面板占整页的宽度比例。"
      },
      {
        "key": "showRule",
        "type": "toggle",
        "label": "强调横条",
        "default": true,
        "description": "标题上方的强调色横条。",
        "publicKey": "showRule",
        "publicLabel": "强调横条",
        "desc": "标题上方的强调色横条。"
      },
      {
        "key": "showFooter",
        "type": "toggle",
        "label": "页脚信息",
        "default": true,
        "description": "文字面板底部的页脚信息行。",
        "publicKey": "showFooter",
        "publicLabel": "页脚信息",
        "desc": "文字面板底部的页脚信息行。"
      }
    ],
    "defaultProps": {
      "theme": "dusk",
      "fieldSide": "right",
      "panelWidth": 46,
      "showRule": true,
      "showFooter": true,
      "idPrefix": "coverfield"
    }
  },
  {
    "key": "theme10_page003",
    "themeKey": "theme10",
    "pageNumber": 3,
    "layout": "THEME10-003",
    "slot": "coveratmostype",
    "label": "满版渐变大字",
    "bgClass": "",
    "controls": [
      {
        "key": "theme",
        "type": "select",
        "label": "渐变情绪",
        "default": "dusk",
        "options": [
          {
            "value": "dusk",
            "label": "暮蓝"
          },
          {
            "value": "dawn",
            "label": "晨曦"
          },
          {
            "value": "mono",
            "label": "灰阶"
          }
        ],
        "description": "竖向天空渐变的配色。",
        "publicKey": "theme",
        "publicLabel": "渐变情绪",
        "desc": "竖向天空渐变的配色。"
      },
      {
        "key": "showKicker",
        "type": "toggle",
        "label": "顶部标签",
        "default": true,
        "description": "左上角的等宽说明标签。",
        "publicKey": "showKicker",
        "publicLabel": "顶部标签",
        "desc": "左上角的等宽说明标签。"
      },
      {
        "key": "showRule",
        "type": "toggle",
        "label": "强调横条",
        "default": true,
        "description": "大标题上方的强调色横条。",
        "publicKey": "showRule",
        "publicLabel": "强调横条",
        "desc": "大标题上方的强调色横条。"
      },
      {
        "key": "showFooter",
        "type": "toggle",
        "label": "页脚信息",
        "default": true,
        "description": "底部细线分隔的页脚信息行。",
        "publicKey": "showFooter",
        "publicLabel": "页脚信息",
        "desc": "底部细线分隔的页脚信息行。"
      },
      {
        "key": "showGrain",
        "type": "toggle",
        "label": "颗粒质感",
        "default": true,
        "description": "渐变之上的细颗粒纹理。",
        "publicKey": "showGrain",
        "publicLabel": "颗粒质感",
        "desc": "渐变之上的细颗粒纹理。"
      }
    ],
    "defaultProps": {
      "theme": "dusk",
      "showKicker": true,
      "showRule": true,
      "showFooter": true,
      "showGrain": true,
      "idPrefix": "coveratmostype"
    }
  },
  {
    "key": "theme10_page004",
    "themeKey": "theme10",
    "pageNumber": 4,
    "layout": "THEME10-004",
    "slot": "coverhorizon",
    "label": "地平线渐变",
    "bgClass": "",
    "controls": [
      {
        "key": "theme",
        "type": "select",
        "label": "地平线色",
        "default": "dawn",
        "options": [
          {
            "value": "dawn",
            "label": "晨曦"
          },
          {
            "value": "dusk",
            "label": "暮蓝"
          },
          {
            "value": "ember",
            "label": "余烬"
          }
        ],
        "description": "地平线下方辉带的配色。",
        "publicKey": "theme",
        "publicLabel": "地平线色",
        "desc": "地平线下方辉带的配色。"
      },
      {
        "key": "horizon",
        "type": "slider",
        "label": "地平线高度",
        "default": 68,
        "min": 56,
        "max": 76,
        "step": 1,
        "unit": "%",
        "description": "夜空占整页的高度（地平线的位置）。",
        "publicKey": "horizon",
        "publicLabel": "地平线高度",
        "desc": "夜空占整页的高度（地平线的位置）。"
      },
      {
        "key": "showRule",
        "type": "toggle",
        "label": "强调横条",
        "default": true,
        "description": "标题上方的强调色横条。",
        "publicKey": "showRule",
        "publicLabel": "强调横条",
        "desc": "标题上方的强调色横条。"
      },
      {
        "key": "showFooter",
        "type": "toggle",
        "label": "页脚信息",
        "default": true,
        "description": "辉带底部的页脚信息行。",
        "publicKey": "showFooter",
        "publicLabel": "页脚信息",
        "desc": "辉带底部的页脚信息行。"
      },
      {
        "key": "showGrain",
        "type": "toggle",
        "label": "颗粒质感",
        "default": true,
        "description": "画面之上的细颗粒纹理。",
        "publicKey": "showGrain",
        "publicLabel": "颗粒质感",
        "desc": "画面之上的细颗粒纹理。"
      }
    ],
    "defaultProps": {
      "theme": "dawn",
      "horizon": 68,
      "showRule": true,
      "showFooter": true,
      "showGrain": true,
      "idPrefix": "coverhorizon"
    }
  },
  {
    "key": "theme10_page005",
    "themeKey": "theme10",
    "pageNumber": 5,
    "layout": "THEME10-005",
    "slot": "cover",
    "label": "封面",
    "bgClass": "",
    "controls": [
      {
        "key": "theme",
        "type": "select",
        "label": "背景主题",
        "default": "dusk",
        "options": [
          {
            "value": "dusk",
            "label": "暮光"
          },
          {
            "value": "midnight",
            "label": "午夜"
          },
          {
            "value": "graphite",
            "label": "石墨"
          },
          {
            "value": "dawn",
            "label": "晨光"
          },
          {
            "value": "paper",
            "label": "纸白"
          }
        ],
        "description": "整页背景渐变与配色基调。",
        "publicKey": "theme",
        "publicLabel": "背景主题",
        "desc": "整页背景渐变与配色基调。"
      },
      {
        "key": "align",
        "type": "radio",
        "label": "文本对齐",
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
        "description": "标题区块的水平对齐方式。",
        "publicKey": "align",
        "publicLabel": "文本对齐",
        "desc": "标题区块的水平对齐方式。"
      },
      {
        "key": "showEyebrow",
        "type": "toggle",
        "label": "装饰眉标",
        "default": true,
        "description": "标题上方的小型说明标签（装饰文案）。",
        "publicKey": "showEyebrow",
        "publicLabel": "装饰眉标",
        "desc": "标题上方的小型说明标签（装饰文案）。"
      },
      {
        "key": "showFooterMeta",
        "type": "toggle",
        "label": "页脚信息",
        "default": true,
        "description": "底部左右两侧的辅助信息行。",
        "publicKey": "showFooterMeta",
        "publicLabel": "页脚信息",
        "desc": "底部左右两侧的辅助信息行。"
      }
    ],
    "defaultProps": {
      "theme": "dusk",
      "align": "left",
      "showEyebrow": true,
      "showFooterMeta": true,
      "idPrefix": "cover"
    }
  },
  {
    "key": "theme10_page006",
    "themeKey": "theme10",
    "pageNumber": 6,
    "layout": "THEME10-006",
    "slot": "chapter",
    "label": "章节索引",
    "bgClass": "",
    "controls": [
      {
        "key": "theme",
        "type": "select",
        "label": "背景主题",
        "default": "dusk",
        "options": [
          {
            "value": "midnight",
            "label": "午夜"
          },
          {
            "value": "dusk",
            "label": "暮光"
          },
          {
            "value": "graphite",
            "label": "石墨"
          },
          {
            "value": "dawn",
            "label": "晨光"
          },
          {
            "value": "vapor",
            "label": "雾光"
          },
          {
            "value": "paper",
            "label": "纸白"
          }
        ],
        "description": "分章页的背景渐变与配色基调。",
        "publicKey": "theme",
        "publicLabel": "背景主题",
        "desc": "分章页的背景渐变与配色基调。"
      },
      {
        "key": "align",
        "type": "radio",
        "label": "标题对齐",
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
        "description": "大号编号与标题的对齐方式（居中时自动隐藏右侧目录）。",
        "publicKey": "align",
        "publicLabel": "标题对齐",
        "desc": "大号编号与标题的对齐方式（居中时自动隐藏右侧目录）。"
      },
      {
        "key": "currentIndex",
        "type": "slider",
        "label": "当前章节",
        "default": 2,
        "min": 1,
        "max": 5,
        "step": 1,
        "description": "指定“当前”章节，主标题与右侧目录的高亮会同步跟随。",
        "publicKey": "currentIndex",
        "publicLabel": "当前章节",
        "desc": "指定“当前”章节，主标题与右侧目录的高亮会同步跟随。"
      },
      {
        "key": "showIndex",
        "type": "toggle",
        "label": "章节目录",
        "default": true,
        "description": "右侧的全章节列表，显示阅读进度。",
        "publicKey": "showIndex",
        "publicLabel": "章节目录",
        "desc": "右侧的全章节列表，显示阅读进度。"
      },
      {
        "key": "showProgress",
        "type": "toggle",
        "label": "页码",
        "default": true,
        "description": "右上角的「当前 / 总数」计数标记。",
        "publicKey": "showProgress",
        "publicLabel": "页码",
        "desc": "右上角的「当前 / 总数」计数标记。"
      }
    ],
    "defaultProps": {
      "theme": "dusk",
      "align": "left",
      "currentIndex": 2,
      "showIndex": true,
      "showProgress": true,
      "idPrefix": "chapter"
    }
  },
  {
    "key": "theme10_page007",
    "themeKey": "theme10",
    "pageNumber": 7,
    "layout": "THEME10-007",
    "slot": "metrics",
    "label": "核心数据",
    "bgClass": "",
    "controls": [
      {
        "key": "tone",
        "type": "radio",
        "label": "页面底色",
        "default": "dark",
        "options": [
          {
            "value": "dark",
            "label": "深色",
            "image": "",
            "color": ""
          },
          {
            "value": "light",
            "label": "浅色",
            "image": "",
            "color": ""
          }
        ],
        "description": "整页深色或浅色底。",
        "publicKey": "tone",
        "publicLabel": "页面底色",
        "desc": "整页深色或浅色底。"
      },
      {
        "key": "chartType",
        "type": "radio",
        "label": "图表类型",
        "default": "bars",
        "options": [
          {
            "value": "area",
            "label": "面积"
          },
          {
            "value": "bars",
            "label": "柱状"
          },
          {
            "value": "line",
            "label": "折线"
          }
        ],
        "description": "主图表的呈现样式。",
        "publicKey": "chartType",
        "publicLabel": "图表类型",
        "desc": "主图表的呈现样式。"
      },
      {
        "key": "cardCount",
        "type": "slider",
        "label": "卡片数量",
        "default": 3,
        "min": 0,
        "max": 4,
        "step": 1,
        "description": "底部指标卡的数量（0 隐藏整行）。",
        "publicKey": "cardCount",
        "publicLabel": "卡片数量",
        "desc": "底部指标卡的数量（0 隐藏整行）。"
      },
      {
        "key": "focus",
        "type": "toggle",
        "label": "重点聚焦",
        "default": false,
        "description": "高亮某一张卡片，其余弱化。",
        "publicKey": "focus",
        "publicLabel": "重点聚焦",
        "desc": "高亮某一张卡片，其余弱化。"
      },
      {
        "key": "focusIndex",
        "type": "slider",
        "label": "聚焦第几项",
        "default": 1,
        "min": 1,
        "max": 4,
        "step": 1,
        "description": "需开启「重点聚焦」后生效，指定被高亮的卡片序号。",
        "publicKey": "focusIndex",
        "publicLabel": "聚焦第几项",
        "desc": "需开启「重点聚焦」后生效，指定被高亮的卡片序号。"
      },
      {
        "key": "showAxis",
        "type": "toggle",
        "label": "坐标轴",
        "default": true,
        "description": "图表底部的时间刻度标签。",
        "publicKey": "showAxis",
        "publicLabel": "坐标轴",
        "desc": "图表底部的时间刻度标签。"
      }
    ],
    "defaultProps": {
      "chartType": "bars",
      "cardCount": 3,
      "focus": false,
      "focusIndex": 1,
      "showAxis": true,
      "idPrefix": "metrics",
      "tone": "dark"
    }
  },
  {
    "key": "theme10_page008",
    "themeKey": "theme10",
    "pageNumber": 8,
    "layout": "THEME10-008",
    "slot": "spectrum",
    "label": "风险光谱",
    "bgClass": "",
    "controls": [
      {
        "key": "tone",
        "type": "radio",
        "label": "页面底色",
        "default": "light",
        "options": [
          {
            "value": "dark",
            "label": "深色",
            "image": "",
            "color": ""
          },
          {
            "value": "light",
            "label": "浅色",
            "image": "",
            "color": ""
          }
        ],
        "description": "整页深色或浅色底。",
        "publicKey": "tone",
        "publicLabel": "页面底色",
        "desc": "整页深色或浅色底。"
      },
      {
        "key": "segmentCount",
        "type": "slider",
        "label": "光谱段数",
        "default": 5,
        "min": 3,
        "max": 6,
        "step": 1,
        "description": "状态光谱划分的区段数量。",
        "publicKey": "segmentCount",
        "publicLabel": "光谱段数",
        "desc": "状态光谱划分的区段数量。"
      },
      {
        "key": "markerPos",
        "type": "slider",
        "label": "标记位置",
        "default": 62,
        "min": 0,
        "max": 100,
        "step": 1,
        "unit": "%",
        "description": "标记沿光谱的位置（0 最保守，100 最进取）。",
        "publicKey": "markerPos",
        "publicLabel": "标记位置",
        "desc": "标记沿光谱的位置（0 最保守，100 最进取）。"
      },
      {
        "key": "showMarker",
        "type": "toggle",
        "label": "定位标记",
        "default": true,
        "description": "光谱上的标记指针与上方读数。",
        "publicKey": "showMarker",
        "publicLabel": "定位标记",
        "desc": "光谱上的标记指针与上方读数。"
      },
      {
        "key": "showScale",
        "type": "toggle",
        "label": "数值刻度",
        "default": true,
        "description": "光谱下方的 0–100 刻度。",
        "publicKey": "showValueLabels",
        "publicLabel": "数值刻度",
        "desc": "光谱下方的 0–100 刻度。"
      },
      {
        "key": "showEnds",
        "type": "toggle",
        "label": "两端锚点",
        "default": true,
        "description": "光谱两端的高低取向说明。",
        "publicKey": "showEnds",
        "publicLabel": "两端锚点",
        "desc": "光谱两端的高低取向说明。"
      }
    ],
    "defaultProps": {
      "segmentCount": 5,
      "markerPos": 62,
      "showMarker": true,
      "showScale": true,
      "showEnds": true,
      "idPrefix": "spectrum",
      "tone": "light"
    }
  },
  {
    "key": "theme10_page009",
    "themeKey": "theme10",
    "pageNumber": 9,
    "layout": "THEME10-009",
    "slot": "quadrant",
    "label": "策略象限",
    "bgClass": "",
    "controls": [
      {
        "key": "tone",
        "type": "radio",
        "label": "页面底色",
        "default": "dark",
        "options": [
          {
            "value": "dark",
            "label": "深色",
            "image": "",
            "color": ""
          },
          {
            "value": "light",
            "label": "浅色",
            "image": "",
            "color": ""
          }
        ],
        "description": "整页深色或浅色底。",
        "publicKey": "tone",
        "publicLabel": "页面底色",
        "desc": "整页深色或浅色底。"
      },
      {
        "key": "pointCount",
        "type": "slider",
        "label": "坐标点数量",
        "default": 5,
        "min": 3,
        "max": 6,
        "step": 1,
        "description": "地图中绘制的定位点数量。",
        "publicKey": "pointCount",
        "publicLabel": "坐标点数量",
        "desc": "地图中绘制的定位点数量。"
      },
      {
        "key": "focus",
        "type": "toggle",
        "label": "重点聚焦",
        "default": false,
        "description": "高亮某一坐标点并显示坐标读数，其余弱化。",
        "publicKey": "focus",
        "publicLabel": "重点聚焦",
        "desc": "高亮某一坐标点并显示坐标读数，其余弱化。"
      },
      {
        "key": "focusIndex",
        "type": "slider",
        "label": "聚焦第几项",
        "default": 1,
        "min": 1,
        "max": 6,
        "step": 1,
        "description": "需开启「重点聚焦」后生效。",
        "publicKey": "focusIndex",
        "publicLabel": "聚焦第几项",
        "desc": "需开启「重点聚焦」后生效。"
      },
      {
        "key": "showIdealZone",
        "type": "toggle",
        "label": "理想区高亮",
        "default": true,
        "description": "为右上「理想区」象限叠加柔和的蓝色光晕。",
        "publicKey": "showIdealZone",
        "publicLabel": "理想区高亮",
        "desc": "为右上「理想区」象限叠加柔和的蓝色光晕。"
      },
      {
        "key": "showQuadrantLabels",
        "type": "toggle",
        "label": "象限标注",
        "default": true,
        "description": "四个角的象限说明文字。",
        "publicKey": "showQuadrantLabels",
        "publicLabel": "象限标注",
        "desc": "四个角的象限说明文字。"
      },
      {
        "key": "showAxisLabels",
        "type": "toggle",
        "label": "坐标轴标注",
        "default": true,
        "description": "两条坐标轴两端的高低标签。",
        "publicKey": "showAxisLabels",
        "publicLabel": "坐标轴标注",
        "desc": "两条坐标轴两端的高低标签。"
      }
    ],
    "defaultProps": {
      "pointCount": 5,
      "focus": false,
      "focusIndex": 1,
      "showIdealZone": true,
      "showQuadrantLabels": true,
      "showAxisLabels": true,
      "idPrefix": "quadrant",
      "tone": "dark"
    }
  },
  {
    "key": "theme10_page010",
    "themeKey": "theme10",
    "pageNumber": 10,
    "layout": "THEME10-010",
    "slot": "ledger",
    "label": "账本表",
    "bgClass": "",
    "controls": [
      {
        "key": "tone",
        "type": "radio",
        "label": "页面底色",
        "default": "light",
        "options": [
          {
            "value": "dark",
            "label": "深色",
            "image": "",
            "color": ""
          },
          {
            "value": "light",
            "label": "浅色",
            "image": "",
            "color": ""
          }
        ],
        "description": "整页深色或浅色底。",
        "publicKey": "tone",
        "publicLabel": "页面底色",
        "desc": "整页深色或浅色底。"
      },
      {
        "key": "rowCount",
        "type": "slider",
        "label": "表格行数",
        "default": 6,
        "min": 3,
        "max": 8,
        "step": 1,
        "description": "表格中显示的表格行数。",
        "publicKey": "rowCount",
        "publicLabel": "表格行数",
        "desc": "表格中显示的表格行数。"
      },
      {
        "key": "showWeightBar",
        "type": "toggle",
        "label": "权重条",
        "default": true,
        "description": "权重列内联的占比可视化条。",
        "publicKey": "showWeightBar",
        "publicLabel": "权重条",
        "desc": "权重列内联的占比可视化条。"
      },
      {
        "key": "showTotal",
        "type": "toggle",
        "label": "合计行",
        "default": true,
        "description": "底部的汇总 / 合计行。",
        "publicKey": "showTotal",
        "publicLabel": "合计行",
        "desc": "底部的汇总 / 合计行。"
      },
      {
        "key": "focus",
        "type": "toggle",
        "label": "重点聚焦",
        "default": false,
        "description": "高亮某一行，其余弱化。",
        "publicKey": "focus",
        "publicLabel": "重点聚焦",
        "desc": "高亮某一行，其余弱化。"
      },
      {
        "key": "focusIndex",
        "type": "slider",
        "label": "聚焦第几项",
        "default": 1,
        "min": 1,
        "max": 8,
        "step": 1,
        "description": "需开启「重点聚焦」后生效，指定被高亮的行。",
        "publicKey": "focusIndex",
        "publicLabel": "聚焦第几项",
        "desc": "需开启「重点聚焦」后生效，指定被高亮的行。"
      }
    ],
    "defaultProps": {
      "rowCount": 6,
      "showWeightBar": true,
      "showTotal": true,
      "focus": false,
      "focusIndex": 1,
      "idPrefix": "ledger",
      "tone": "light"
    }
  },
  {
    "key": "theme10_page011",
    "themeKey": "theme10",
    "pageNumber": 11,
    "layout": "THEME10-011",
    "slot": "allocation",
    "label": "配置明细",
    "bgClass": "",
    "controls": [
      {
        "key": "tone",
        "type": "radio",
        "label": "页面底色",
        "default": "light",
        "options": [
          {
            "value": "dark",
            "label": "深色",
            "image": "",
            "color": ""
          },
          {
            "value": "light",
            "label": "浅色",
            "image": "",
            "color": ""
          }
        ],
        "description": "整页深色或浅色底。",
        "publicKey": "tone",
        "publicLabel": "页面底色",
        "desc": "整页深色或浅色底。"
      },
      {
        "key": "rowCount",
        "type": "slider",
        "label": "配置条目",
        "default": 4,
        "min": 1,
        "max": 6,
        "step": 1,
        "description": "权重条与明细清单的行数。",
        "publicKey": "itemCount",
        "publicLabel": "配置条目",
        "desc": "权重条与明细清单的行数。"
      },
      {
        "key": "focus",
        "type": "toggle",
        "label": "重点聚焦",
        "default": false,
        "description": "高亮某一类配置（条段 + 明细行）。",
        "publicKey": "focus",
        "publicLabel": "重点聚焦",
        "desc": "高亮某一类配置（条段 + 明细行）。"
      },
      {
        "key": "focusIndex",
        "type": "slider",
        "label": "聚焦第几项",
        "default": 1,
        "min": 1,
        "max": 6,
        "step": 1,
        "description": "需开启「重点聚焦」后生效。",
        "publicKey": "focusIndex",
        "publicLabel": "聚焦第几项",
        "desc": "需开启「重点聚焦」后生效。"
      },
      {
        "key": "showScale",
        "type": "toggle",
        "label": "比例刻度",
        "default": true,
        "description": "权重条下方的 0 / 50 / 100% 刻度。",
        "publicKey": "showScale",
        "publicLabel": "比例刻度",
        "desc": "权重条下方的 0 / 50 / 100% 刻度。"
      },
      {
        "key": "mediaMode",
        "type": "radio",
        "label": "侧栏模式",
        "default": "gradient",
        "options": [
          {
            "value": "gradient",
            "label": "渐变"
          },
          {
            "value": "image",
            "label": "图片"
          },
          {
            "value": "none",
            "label": "无"
          }
        ],
        "description": "左侧竖栏：品牌渐变、可上传图片槽，或隐藏让信息满幅。",
        "publicKey": "mediaMode",
        "publicLabel": "侧栏模式",
        "desc": "左侧竖栏：品牌渐变、可上传图片槽，或隐藏让信息满幅。"
      }
    ],
    "defaultProps": {
      "rowCount": 4,
      "focus": false,
      "focusIndex": 1,
      "showScale": true,
      "mediaMode": "gradient",
      "idPrefix": "allocation",
      "tone": "light"
    }
  },
  {
    "key": "theme10_page012",
    "themeKey": "theme10",
    "pageNumber": 12,
    "layout": "THEME10-012",
    "slot": "stacked",
    "label": "构成对比",
    "bgClass": "",
    "controls": [
      {
        "key": "tone",
        "type": "radio",
        "label": "页面底色",
        "default": "dark",
        "options": [
          {
            "value": "dark",
            "label": "深色",
            "image": "",
            "color": ""
          },
          {
            "value": "light",
            "label": "浅色",
            "image": "",
            "color": ""
          }
        ],
        "description": "整页深色或浅色底。",
        "publicKey": "tone",
        "publicLabel": "页面底色",
        "desc": "整页深色或浅色底。"
      },
      {
        "key": "barCount",
        "type": "slider",
        "label": "类别柱数",
        "default": 4,
        "min": 2,
        "max": 6,
        "step": 1,
        "description": "参与对比的类别（柱体）数量。",
        "publicKey": "barCount",
        "publicLabel": "类别柱数",
        "desc": "参与对比的类别（柱体）数量。"
      },
      {
        "key": "segmentCount",
        "type": "slider",
        "label": "构成段数",
        "default": 4,
        "min": 2,
        "max": 5,
        "step": 1,
        "description": "每根柱体堆叠的构成段数量。",
        "publicKey": "segmentCount",
        "publicLabel": "构成段数",
        "desc": "每根柱体堆叠的构成段数量。"
      },
      {
        "key": "focus",
        "type": "toggle",
        "label": "重点聚焦",
        "default": false,
        "description": "高亮某一根柱体，其余弱化。",
        "publicKey": "focus",
        "publicLabel": "重点聚焦",
        "desc": "高亮某一根柱体，其余弱化。"
      },
      {
        "key": "focusIndex",
        "type": "slider",
        "label": "聚焦第几项",
        "default": 1,
        "min": 1,
        "max": 6,
        "step": 1,
        "description": "需开启「重点聚焦」后生效。",
        "publicKey": "focusIndex",
        "publicLabel": "聚焦第几项",
        "desc": "需开启「重点聚焦」后生效。"
      },
      {
        "key": "showLegend",
        "type": "toggle",
        "label": "图例",
        "default": true,
        "description": "右侧的构成段图例。",
        "publicKey": "showLegend",
        "publicLabel": "图例",
        "desc": "右侧的构成段图例。"
      },
      {
        "key": "showTotals",
        "type": "toggle",
        "label": "柱顶合计",
        "default": true,
        "description": "每根柱体顶部的合计数值。",
        "publicKey": "showValueLabels",
        "publicLabel": "柱顶合计",
        "desc": "每根柱体顶部的合计数值。"
      }
    ],
    "defaultProps": {
      "barCount": 4,
      "segmentCount": 4,
      "focus": false,
      "focusIndex": 1,
      "showLegend": true,
      "showTotals": true,
      "idPrefix": "stacked",
      "tone": "dark"
    }
  },
  {
    "key": "theme10_page013",
    "themeKey": "theme10",
    "pageNumber": 13,
    "layout": "THEME10-013",
    "slot": "treemap",
    "label": "占比树图",
    "bgClass": "",
    "controls": [
      {
        "key": "tone",
        "type": "radio",
        "label": "页面底色",
        "default": "dark",
        "options": [
          {
            "value": "dark",
            "label": "深色",
            "image": "",
            "color": ""
          },
          {
            "value": "light",
            "label": "浅色",
            "image": "",
            "color": ""
          }
        ],
        "description": "整页深色或浅色底。",
        "publicKey": "tone",
        "publicLabel": "页面底色",
        "desc": "整页深色或浅色底。"
      },
      {
        "key": "tileCount",
        "type": "slider",
        "label": "分块数量",
        "default": 6,
        "min": 4,
        "max": 9,
        "step": 1,
        "description": "树图分块数量（按权重自动布局，大块在左上）。",
        "publicKey": "tileCount",
        "publicLabel": "分块数量",
        "desc": "树图分块数量（按权重自动布局，大块在左上）。"
      },
      {
        "key": "showWeights",
        "type": "toggle",
        "label": "权重数字",
        "default": true,
        "description": "每个分块上的占比百分比。",
        "publicKey": "showWeights",
        "publicLabel": "权重数字",
        "desc": "每个分块上的占比百分比。"
      },
      {
        "key": "showSub",
        "type": "toggle",
        "label": "副标签",
        "default": true,
        "description": "较大分块内的副说明（小块自动隐藏）。",
        "publicKey": "showSub",
        "publicLabel": "副标签",
        "desc": "较大分块内的副说明（小块自动隐藏）。"
      },
      {
        "key": "gap",
        "type": "slider",
        "label": "间隙",
        "default": 6,
        "min": 2,
        "max": 14,
        "step": 1,
        "unit": "px",
        "description": "分块之间的间隙。",
        "publicKey": "gap",
        "publicLabel": "间隙",
        "desc": "分块之间的间隙。"
      },
      {
        "key": "focus",
        "type": "toggle",
        "label": "重点聚焦",
        "default": false,
        "description": "高亮某一分块，其余弱化。",
        "publicKey": "focus",
        "publicLabel": "重点聚焦",
        "desc": "高亮某一分块，其余弱化。"
      },
      {
        "key": "focusIndex",
        "type": "slider",
        "label": "聚焦第几项",
        "default": 1,
        "min": 1,
        "max": 9,
        "step": 1,
        "description": "需开启「重点聚焦」后生效（按权重排序后的序号）。",
        "publicKey": "focusIndex",
        "publicLabel": "聚焦第几项",
        "desc": "需开启「重点聚焦」后生效（按权重排序后的序号）。"
      }
    ],
    "defaultProps": {
      "tileCount": 6,
      "showWeights": true,
      "showSub": true,
      "gap": 6,
      "focus": false,
      "focusIndex": 1,
      "idPrefix": "treemap",
      "tone": "dark"
    }
  },
  {
    "key": "theme10_page014",
    "themeKey": "theme10",
    "pageNumber": 14,
    "layout": "THEME10-014",
    "slot": "mekko",
    "label": "份额矩阵",
    "bgClass": "",
    "controls": [
      {
        "key": "tone",
        "type": "radio",
        "label": "页面底色",
        "default": "dark",
        "options": [
          {
            "value": "dark",
            "label": "深色",
            "image": "",
            "color": ""
          },
          {
            "value": "light",
            "label": "浅色",
            "image": "",
            "color": ""
          }
        ],
        "description": "整页深色或浅色底。",
        "publicKey": "tone",
        "publicLabel": "页面底色",
        "desc": "整页深色或浅色底。"
      },
      {
        "key": "columnCount",
        "type": "slider",
        "label": "列数量",
        "default": 4,
        "min": 3,
        "max": 5,
        "step": 1,
        "description": "绘制的列（条目单元）数量；列宽按其占比自适应。",
        "publicKey": "itemCount",
        "publicLabel": "列数量",
        "desc": "绘制的列（条目单元）数量；列宽按其占比自适应。"
      },
      {
        "key": "segmentCount",
        "type": "slider",
        "label": "分层数量",
        "default": 4,
        "min": 2,
        "max": 4,
        "step": 1,
        "description": "每列内部堆叠的资产类别层数。",
        "publicKey": "segmentCount",
        "publicLabel": "分层数量",
        "desc": "每列内部堆叠的资产类别层数。"
      },
      {
        "key": "showShare",
        "type": "toggle",
        "label": "占比数字",
        "default": true,
        "description": "每列顶部的占比百分数。",
        "publicKey": "showShare",
        "publicLabel": "占比数字",
        "desc": "每列顶部的占比百分数。"
      },
      {
        "key": "showLegend",
        "type": "toggle",
        "label": "类别图例",
        "default": true,
        "description": "右上角的资产类别图例。",
        "publicKey": "showLegend",
        "publicLabel": "类别图例",
        "desc": "右上角的资产类别图例。"
      },
      {
        "key": "focus",
        "type": "toggle",
        "label": "重点聚焦",
        "default": false,
        "description": "高亮某一列并以强调色着色，其余弱化。",
        "publicKey": "focus",
        "publicLabel": "重点聚焦",
        "desc": "高亮某一列并以强调色着色，其余弱化。"
      },
      {
        "key": "focusIndex",
        "type": "slider",
        "label": "聚焦第几列",
        "default": 1,
        "min": 1,
        "max": 5,
        "step": 1,
        "description": "需开启「重点聚焦」后生效。",
        "publicKey": "focusIndex",
        "publicLabel": "聚焦第几列",
        "desc": "需开启「重点聚焦」后生效。"
      }
    ],
    "defaultProps": {
      "columnCount": 4,
      "segmentCount": 4,
      "showShare": true,
      "showLegend": true,
      "focus": false,
      "focusIndex": 1,
      "idPrefix": "mekko",
      "tone": "dark"
    }
  },
  {
    "key": "theme10_page015",
    "themeKey": "theme10",
    "pageNumber": 15,
    "layout": "THEME10-015",
    "slot": "grouped",
    "label": "分组柱图",
    "bgClass": "",
    "controls": [
      {
        "key": "tone",
        "type": "radio",
        "label": "页面底色",
        "default": "light",
        "options": [
          {
            "value": "dark",
            "label": "深色",
            "image": "",
            "color": ""
          },
          {
            "value": "light",
            "label": "浅色",
            "image": "",
            "color": ""
          }
        ],
        "description": "整页深色或浅色底。",
        "publicKey": "tone",
        "publicLabel": "页面底色",
        "desc": "整页深色或浅色底。"
      },
      {
        "key": "groupCount",
        "type": "slider",
        "label": "分组数量",
        "default": 6,
        "min": 3,
        "max": 6,
        "step": 1,
        "description": "x 轴上的类别分组数量。",
        "publicKey": "groupCount",
        "publicLabel": "分组数量",
        "desc": "x 轴上的类别分组数量。"
      },
      {
        "key": "seriesCount",
        "type": "slider",
        "label": "系列数量",
        "default": 3,
        "min": 2,
        "max": 3,
        "step": 1,
        "description": "每组内的柱子（对比系列）数量。",
        "publicKey": "seriesCount",
        "publicLabel": "系列数量",
        "desc": "每组内的柱子（对比系列）数量。"
      },
      {
        "key": "showValues",
        "type": "toggle",
        "label": "柱顶数值",
        "default": true,
        "description": "每根柱子顶部的数值。",
        "publicKey": "showValueLabels",
        "publicLabel": "柱顶数值",
        "desc": "每根柱子顶部的数值。"
      },
      {
        "key": "showLegend",
        "type": "toggle",
        "label": "图例",
        "default": true,
        "description": "右上角的系列图例。",
        "publicKey": "showLegend",
        "publicLabel": "图例",
        "desc": "右上角的系列图例。"
      },
      {
        "key": "showAxis",
        "type": "toggle",
        "label": "坐标轴",
        "default": true,
        "description": "底部基线与类别标签。",
        "publicKey": "showAxis",
        "publicLabel": "坐标轴",
        "desc": "底部基线与类别标签。"
      },
      {
        "key": "focusSeries",
        "type": "slider",
        "label": "强调系列",
        "default": 0,
        "min": 0,
        "max": 3,
        "step": 1,
        "description": "高亮某一系列（0 为不强调，其余弱化）。",
        "publicKey": "focusSeries",
        "publicLabel": "强调系列",
        "desc": "高亮某一系列（0 为不强调，其余弱化）。"
      }
    ],
    "defaultProps": {
      "groupCount": 6,
      "seriesCount": 3,
      "showValues": true,
      "showLegend": true,
      "showAxis": true,
      "focusSeries": 0,
      "idPrefix": "grouped",
      "tone": "light"
    }
  },
  {
    "key": "theme10_page016",
    "themeKey": "theme10",
    "pageNumber": 16,
    "layout": "THEME10-016",
    "slot": "orbit",
    "label": "核心卫星",
    "bgClass": "",
    "controls": [
      {
        "key": "tone",
        "type": "radio",
        "label": "页面底色",
        "default": "dark",
        "options": [
          {
            "value": "dark",
            "label": "深色",
            "image": "",
            "color": ""
          },
          {
            "value": "light",
            "label": "浅色",
            "image": "",
            "color": ""
          }
        ],
        "description": "整页深色或浅色底。",
        "publicKey": "tone",
        "publicLabel": "页面底色",
        "desc": "整页深色或浅色底。"
      },
      {
        "key": "layout",
        "type": "radio",
        "label": "布局",
        "default": "side",
        "options": [
          {
            "value": "top",
            "label": "上下"
          },
          {
            "value": "side",
            "label": "左右"
          }
        ],
        "description": "标题与图表的排布：上下堆叠或左右分栏。",
        "publicKey": "layout",
        "publicLabel": "布局",
        "desc": "标题与图表的排布：上下堆叠或左右分栏。"
      },
      {
        "key": "nodeCount",
        "type": "slider",
        "label": "卫星数量",
        "default": 5,
        "min": 3,
        "max": 6,
        "step": 1,
        "description": "环绕核心的卫星策略数量。",
        "publicKey": "nodeCount",
        "publicLabel": "卫星数量",
        "desc": "环绕核心的卫星策略数量。"
      },
      {
        "key": "showOrbit",
        "type": "toggle",
        "label": "轨道环",
        "default": true,
        "description": "卫星所在的虚线轨道。",
        "publicKey": "showOrbit",
        "publicLabel": "轨道环",
        "desc": "卫星所在的虚线轨道。"
      },
      {
        "key": "showSpokes",
        "type": "toggle",
        "label": "连接线",
        "default": true,
        "description": "核心到各卫星的连接辐条。",
        "publicKey": "showSpokes",
        "publicLabel": "连接线",
        "desc": "核心到各卫星的连接辐条。"
      },
      {
        "key": "showWeights",
        "type": "toggle",
        "label": "权重标签",
        "default": true,
        "description": "每个卫星圆盘内的权重百分比。",
        "publicKey": "showWeights",
        "publicLabel": "权重标签",
        "desc": "每个卫星圆盘内的权重百分比。"
      },
      {
        "key": "focus",
        "type": "toggle",
        "label": "重点聚焦",
        "default": false,
        "description": "高亮某一卫星，其余弱化。",
        "publicKey": "focus",
        "publicLabel": "重点聚焦",
        "desc": "高亮某一卫星，其余弱化。"
      },
      {
        "key": "focusIndex",
        "type": "slider",
        "label": "聚焦第几项",
        "default": 1,
        "min": 1,
        "max": 6,
        "step": 1,
        "description": "需开启「重点聚焦」后生效。",
        "publicKey": "focusIndex",
        "publicLabel": "聚焦第几项",
        "desc": "需开启「重点聚焦」后生效。"
      }
    ],
    "defaultProps": {
      "nodeCount": 5,
      "showOrbit": true,
      "showSpokes": true,
      "showWeights": true,
      "focus": false,
      "focusIndex": 1,
      "layout": "side",
      "idPrefix": "orbit",
      "tone": "dark"
    }
  },
  {
    "key": "theme10_page017",
    "themeKey": "theme10",
    "pageNumber": 17,
    "layout": "THEME10-017",
    "slot": "plans",
    "label": "方案对照",
    "bgClass": "",
    "controls": [
      {
        "key": "tone",
        "type": "radio",
        "label": "页面底色",
        "default": "light",
        "options": [
          {
            "value": "dark",
            "label": "深色",
            "image": "",
            "color": ""
          },
          {
            "value": "light",
            "label": "浅色",
            "image": "",
            "color": ""
          }
        ],
        "description": "整页深色或浅色底。",
        "publicKey": "tone",
        "publicLabel": "页面底色",
        "desc": "整页深色或浅色底。"
      },
      {
        "key": "columnCount",
        "type": "slider",
        "label": "方案数量",
        "default": 3,
        "min": 2,
        "max": 4,
        "step": 1,
        "description": "并列对照的方案 / 套餐列数。",
        "publicKey": "columnCount",
        "publicLabel": "方案数量",
        "desc": "并列对照的方案 / 套餐列数。"
      },
      {
        "key": "featureCount",
        "type": "slider",
        "label": "能力行数",
        "default": 6,
        "min": 3,
        "max": 6,
        "step": 1,
        "description": "对照表中的能力 / 功能行数。",
        "publicKey": "featureCount",
        "publicLabel": "能力行数",
        "desc": "对照表中的能力 / 功能行数。"
      },
      {
        "key": "highlightCol",
        "type": "toggle",
        "label": "高亮推荐",
        "default": true,
        "description": "将某一方案整列渲染为浅色面板带。",
        "publicKey": "highlightCol",
        "publicLabel": "高亮推荐",
        "desc": "将某一方案整列渲染为浅色面板带。"
      },
      {
        "key": "highlightIndex",
        "type": "slider",
        "label": "高亮第几个",
        "default": 2,
        "min": 1,
        "max": 4,
        "step": 1,
        "description": "需开启「高亮推荐」后生效。",
        "publicKey": "highlightIndex",
        "publicLabel": "高亮第几个",
        "desc": "需开启「高亮推荐」后生效。"
      },
      {
        "key": "showPrice",
        "type": "toggle",
        "label": "数字",
        "default": true,
        "description": "表头中每个方案的大号费率 / 价格。",
        "publicKey": "showPrice",
        "publicLabel": "数字",
        "desc": "表头中每个方案的大号费率 / 价格。"
      }
    ],
    "defaultProps": {
      "columnCount": 3,
      "featureCount": 6,
      "highlightCol": true,
      "highlightIndex": 2,
      "showPrice": true,
      "idPrefix": "plans",
      "tone": "light"
    }
  },
  {
    "key": "theme10_page018",
    "themeKey": "theme10",
    "pageNumber": 18,
    "layout": "THEME10-018",
    "slot": "versus",
    "label": "抉择双栏",
    "bgClass": "",
    "controls": [
      {
        "key": "tone",
        "type": "radio",
        "label": "页面底色",
        "default": "dark",
        "options": [
          {
            "value": "dark",
            "label": "深色",
            "image": "",
            "color": ""
          },
          {
            "value": "light",
            "label": "浅色",
            "image": "",
            "color": ""
          }
        ],
        "description": "整页深色或浅色底。",
        "publicKey": "tone",
        "publicLabel": "页面底色",
        "desc": "整页深色或浅色底。"
      },
      {
        "key": "pointCount",
        "type": "slider",
        "label": "每侧条目",
        "default": 4,
        "min": 1,
        "max": 5,
        "step": 1,
        "description": "每一侧展示的要点条目数量。",
        "publicKey": "itemCount",
        "publicLabel": "每侧条目",
        "desc": "每一侧展示的要点条目数量。"
      },
      {
        "key": "splitBias",
        "type": "slider",
        "label": "分割位置",
        "default": 52,
        "min": 42,
        "max": 60,
        "step": 1,
        "unit": "%",
        "description": "对角分割线距左边的位置。",
        "publicKey": "splitBias",
        "publicLabel": "分割位置",
        "desc": "对角分割线距左边的位置。"
      },
      {
        "key": "showStat",
        "type": "toggle",
        "label": "主数字",
        "default": true,
        "description": "每一侧的核心对比大数字。",
        "publicKey": "showStat",
        "publicLabel": "主数字",
        "desc": "每一侧的核心对比大数字。"
      },
      {
        "key": "showPoints",
        "type": "toggle",
        "label": "要点列表",
        "default": true,
        "description": "每一侧的要点清单。",
        "publicKey": "showPoints",
        "publicLabel": "要点列表",
        "desc": "每一侧的要点清单。"
      }
    ],
    "defaultProps": {
      "pointCount": 4,
      "splitBias": 52,
      "showStat": true,
      "showPoints": true,
      "idPrefix": "versus",
      "tone": "dark"
    }
  },
  {
    "key": "theme10_page019",
    "themeKey": "theme10",
    "pageNumber": 19,
    "layout": "THEME10-019",
    "slot": "capmatrix",
    "label": "能力对照",
    "bgClass": "",
    "controls": [
      {
        "key": "tone",
        "type": "radio",
        "label": "页面底色",
        "default": "light",
        "options": [
          {
            "value": "dark",
            "label": "深色",
            "image": "",
            "color": ""
          },
          {
            "value": "light",
            "label": "浅色",
            "image": "",
            "color": ""
          }
        ],
        "description": "整页深色或浅色底。",
        "publicKey": "tone",
        "publicLabel": "页面底色",
        "desc": "整页深色或浅色底。"
      },
      {
        "key": "rowCount",
        "type": "slider",
        "label": "能力行数",
        "default": 5,
        "min": 3,
        "max": 7,
        "step": 1,
        "description": "对照的能力 / 特性行数。",
        "publicKey": "rowCount",
        "publicLabel": "能力行数",
        "desc": "对照的能力 / 特性行数。"
      },
      {
        "key": "colCount",
        "type": "slider",
        "label": "方案列数",
        "default": 3,
        "min": 2,
        "max": 4,
        "step": 1,
        "description": "参与对照的方案列数。",
        "publicKey": "colCount",
        "publicLabel": "方案列数",
        "desc": "参与对照的方案列数。"
      },
      {
        "key": "highlightIndex",
        "type": "slider",
        "label": "强调第几列",
        "default": 3,
        "min": 1,
        "max": 4,
        "step": 1,
        "description": "被高亮强调的方案列（上限随列数）。",
        "publicKey": "highlightIndex",
        "publicLabel": "强调第几列",
        "desc": "被高亮强调的方案列（上限随列数）。"
      },
      {
        "key": "showHeadNote",
        "type": "toggle",
        "label": "列副标题",
        "default": true,
        "description": "每列表头下方的小字说明。",
        "publicKey": "showHeadNote",
        "publicLabel": "列副标题",
        "desc": "每列表头下方的小字说明。"
      },
      {
        "key": "zebra",
        "type": "toggle",
        "label": "斑马底纹",
        "default": true,
        "description": "隔行的浅色底纹。",
        "publicKey": "zebra",
        "publicLabel": "斑马底纹",
        "desc": "隔行的浅色底纹。"
      }
    ],
    "defaultProps": {
      "rowCount": 5,
      "colCount": 3,
      "highlightIndex": 3,
      "showHeadNote": true,
      "zebra": true,
      "idPrefix": "capmatrix",
      "tone": "light"
    }
  },
  {
    "key": "theme10_page020",
    "themeKey": "theme10",
    "pageNumber": 20,
    "layout": "THEME10-020",
    "slot": "slope",
    "label": "排名变化",
    "bgClass": "",
    "controls": [
      {
        "key": "tone",
        "type": "radio",
        "label": "页面底色",
        "default": "light",
        "options": [
          {
            "value": "dark",
            "label": "深色",
            "image": "",
            "color": ""
          },
          {
            "value": "light",
            "label": "浅色",
            "image": "",
            "color": ""
          }
        ],
        "description": "整页深色或浅色底。",
        "publicKey": "tone",
        "publicLabel": "页面底色",
        "desc": "整页深色或浅色底。"
      },
      {
        "key": "itemCount",
        "type": "slider",
        "label": "条目数量",
        "default": 5,
        "min": 3,
        "max": 7,
        "step": 1,
        "description": "对比的项目（连线）数量。",
        "publicKey": "itemCount",
        "publicLabel": "条目数量",
        "desc": "对比的项目（连线）数量。"
      },
      {
        "key": "showValues",
        "type": "toggle",
        "label": "端点数值",
        "default": true,
        "description": "每条线两端的数值。",
        "publicKey": "showValueLabels",
        "publicLabel": "端点数值",
        "desc": "每条线两端的数值。"
      },
      {
        "key": "showDelta",
        "type": "toggle",
        "label": "变化量",
        "default": true,
        "description": "右侧的升降变化标签。",
        "publicKey": "showDelta",
        "publicLabel": "变化量",
        "desc": "右侧的升降变化标签。"
      },
      {
        "key": "showDots",
        "type": "toggle",
        "label": "端点圆点",
        "default": true,
        "description": "两端轴上的圆点。",
        "publicKey": "showDots",
        "publicLabel": "端点圆点",
        "desc": "两端轴上的圆点。"
      },
      {
        "key": "focus",
        "type": "toggle",
        "label": "重点聚焦",
        "default": false,
        "description": "高亮某一条线，其余弱化。",
        "publicKey": "focus",
        "publicLabel": "重点聚焦",
        "desc": "高亮某一条线，其余弱化。"
      },
      {
        "key": "focusIndex",
        "type": "slider",
        "label": "聚焦第几项",
        "default": 1,
        "min": 1,
        "max": 7,
        "step": 1,
        "description": "需开启「重点聚焦」后生效。",
        "publicKey": "focusIndex",
        "publicLabel": "聚焦第几项",
        "desc": "需开启「重点聚焦」后生效。"
      }
    ],
    "defaultProps": {
      "itemCount": 5,
      "showValues": true,
      "showDelta": true,
      "showDots": true,
      "focus": false,
      "focusIndex": 1,
      "idPrefix": "slope",
      "tone": "light"
    }
  },
  {
    "key": "theme10_page021",
    "themeKey": "theme10",
    "pageNumber": 21,
    "layout": "THEME10-021",
    "slot": "goals",
    "label": "目标进度",
    "bgClass": "",
    "controls": [
      {
        "key": "tone",
        "type": "radio",
        "label": "页面底色",
        "default": "dark",
        "options": [
          {
            "value": "dark",
            "label": "深色",
            "image": "",
            "color": ""
          },
          {
            "value": "light",
            "label": "浅色",
            "image": "",
            "color": ""
          }
        ],
        "description": "整页深色或浅色底。",
        "publicKey": "tone",
        "publicLabel": "页面底色",
        "desc": "整页深色或浅色底。"
      },
      {
        "key": "goalCount",
        "type": "slider",
        "label": "目标数量",
        "default": 4,
        "min": 2,
        "max": 5,
        "step": 1,
        "description": "展示的目标行数。",
        "publicKey": "goalCount",
        "publicLabel": "目标数量",
        "desc": "展示的目标行数。"
      },
      {
        "key": "showFigures",
        "type": "toggle",
        "label": "数值数字",
        "default": true,
        "description": "进度条下方的已投 / 目标数值。",
        "publicKey": "showValueLabels",
        "publicLabel": "数值数字",
        "desc": "进度条下方的已投 / 目标数值。"
      },
      {
        "key": "showPercent",
        "type": "toggle",
        "label": "百分比",
        "default": true,
        "description": "右侧的大号完成百分比。",
        "publicKey": "showPercent",
        "publicLabel": "百分比",
        "desc": "右侧的大号完成百分比。"
      },
      {
        "key": "showNote",
        "type": "toggle",
        "label": "预计说明",
        "default": true,
        "description": "目标名称下方的达成预计 / 备注。",
        "publicKey": "showNote",
        "publicLabel": "预计说明",
        "desc": "目标名称下方的达成预计 / 备注。"
      },
      {
        "key": "focus",
        "type": "toggle",
        "label": "重点聚焦",
        "default": false,
        "description": "高亮某一目标，其余弱化。",
        "publicKey": "focus",
        "publicLabel": "重点聚焦",
        "desc": "高亮某一目标，其余弱化。"
      },
      {
        "key": "focusIndex",
        "type": "slider",
        "label": "聚焦第几项",
        "default": 1,
        "min": 1,
        "max": 5,
        "step": 1,
        "description": "需开启「重点聚焦」后生效。",
        "publicKey": "focusIndex",
        "publicLabel": "聚焦第几项",
        "desc": "需开启「重点聚焦」后生效。"
      }
    ],
    "defaultProps": {
      "goalCount": 4,
      "showFigures": true,
      "showPercent": true,
      "showNote": true,
      "focus": false,
      "focusIndex": 1,
      "idPrefix": "goals",
      "tone": "dark"
    }
  },
  {
    "key": "theme10_page022",
    "themeKey": "theme10",
    "pageNumber": 22,
    "layout": "THEME10-022",
    "slot": "bullet",
    "label": "目标子弹图",
    "bgClass": "",
    "controls": [
      {
        "key": "tone",
        "type": "radio",
        "label": "页面底色",
        "default": "light",
        "options": [
          {
            "value": "dark",
            "label": "深色",
            "image": "",
            "color": ""
          },
          {
            "value": "light",
            "label": "浅色",
            "image": "",
            "color": ""
          }
        ],
        "description": "整页深色或浅色底。",
        "publicKey": "tone",
        "publicLabel": "页面底色",
        "desc": "整页深色或浅色底。"
      },
      {
        "key": "rowCount",
        "type": "slider",
        "label": "指标行数",
        "default": 4,
        "min": 2,
        "max": 6,
        "step": 1,
        "description": "展示的指标行数。",
        "publicKey": "rowCount",
        "publicLabel": "指标行数",
        "desc": "展示的指标行数。"
      },
      {
        "key": "showTarget",
        "type": "toggle",
        "label": "目标刻度",
        "default": true,
        "description": "每行的目标位置竖线与达标标记。",
        "publicKey": "showTarget",
        "publicLabel": "目标刻度",
        "desc": "每行的目标位置竖线与达标标记。"
      },
      {
        "key": "showBands",
        "type": "toggle",
        "label": "背景分段",
        "default": true,
        "description": "衬托用的灰度分段（差/良/优）。",
        "publicKey": "showBands",
        "publicLabel": "背景分段",
        "desc": "衬托用的灰度分段（差/良/优）。"
      },
      {
        "key": "showValue",
        "type": "toggle",
        "label": "实际数值",
        "default": true,
        "description": "右侧的实际数值与达标标签。",
        "publicKey": "showValueLabels",
        "publicLabel": "实际数值",
        "desc": "右侧的实际数值与达标标签。"
      },
      {
        "key": "focus",
        "type": "toggle",
        "label": "重点聚焦",
        "default": false,
        "description": "高亮某一行，其余弱化。",
        "publicKey": "focus",
        "publicLabel": "重点聚焦",
        "desc": "高亮某一行，其余弱化。"
      },
      {
        "key": "focusIndex",
        "type": "slider",
        "label": "聚焦第几项",
        "default": 1,
        "min": 1,
        "max": 6,
        "step": 1,
        "description": "需开启「重点聚焦」后生效。",
        "publicKey": "focusIndex",
        "publicLabel": "聚焦第几项",
        "desc": "需开启「重点聚焦」后生效。"
      }
    ],
    "defaultProps": {
      "rowCount": 4,
      "showTarget": true,
      "showBands": true,
      "showValue": true,
      "focus": false,
      "focusIndex": 1,
      "idPrefix": "bullet",
      "tone": "light"
    }
  },
  {
    "key": "theme10_page023",
    "themeKey": "theme10",
    "pageNumber": 23,
    "layout": "THEME10-023",
    "slot": "profile",
    "label": "人物特写",
    "bgClass": "",
    "controls": [
      {
        "key": "backgroundMode",
        "label": "背景替换",
        "type": "segment",
        "def": "unicorn",
        "options": [
          {
            "value": "unicorn",
            "label": "动态"
          },
          {
            "value": "media",
            "label": "上传"
          }
        ],
        "desc": "动态 shader 或自定义背景媒体",
        "publicKey": "backgroundMode",
        "publicLabel": "背景替换",
        "description": "动态 shader 或自定义背景媒体"
      },
      {
        "key": "unicornScene",
        "label": "动态场景",
        "type": "segment",
        "def": "automations",
        "options": [
          {
            "value": "tech",
            "label": "科技"
          },
          {
            "value": "automations",
            "label": "自动化"
          },
          {
            "value": "moving",
            "label": "流动"
          },
          {
            "value": "goey",
            "label": "黏球"
          }
        ],
        "dependsOn": "backgroundMode",
        "dependsOnValue": "unicorn",
        "desc": "选择固定 Unicorn shader 场景",
        "publicKey": "dynamicVisual",
        "publicLabel": "动态场景",
        "description": "选择固定 Unicorn shader 场景"
      },
      {
        "key": "textSide",
        "type": "radio",
        "label": "文字位置",
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
        "description": "叠加文字块与暗角渐变所锚定的一侧（满幅肖像作背景）。",
        "publicKey": "textSide",
        "publicLabel": "文字位置",
        "desc": "叠加文字块与暗角渐变所锚定的一侧（满幅肖像作背景）。"
      },
      {
        "key": "showQuote",
        "type": "toggle",
        "label": "大文案",
        "default": true,
        "description": "叠加在肖像上的大号引述。",
        "publicKey": "showQuote",
        "publicLabel": "大文案",
        "desc": "叠加在肖像上的大号引述。"
      },
      {
        "key": "showCreds",
        "type": "toggle",
        "label": "小标签",
        "default": true,
        "description": "姓名下方的横排履历 / 资历条。",
        "publicKey": "showCreds",
        "publicLabel": "小标签",
        "desc": "姓名下方的横排履历 / 资历条。"
      }
    ],
    "defaultProps": {
      "textSide": "left",
      "showQuote": true,
      "showCreds": true,
      "backgroundMode": "unicorn",
      "unicornScene": "automations",
      "idPrefix": "profile"
    }
  },
  {
    "key": "theme10_page024",
    "themeKey": "theme10",
    "pageNumber": 24,
    "layout": "THEME10-024",
    "slot": "team",
    "label": "内容墙",
    "bgClass": "",
    "controls": [
      {
        "key": "tone",
        "type": "radio",
        "label": "页面底色",
        "default": "light",
        "options": [
          {
            "value": "dark",
            "label": "深色",
            "image": "",
            "color": ""
          },
          {
            "value": "light",
            "label": "浅色",
            "image": "",
            "color": ""
          }
        ],
        "description": "整页深色或浅色底。",
        "publicKey": "tone",
        "publicLabel": "页面底色",
        "desc": "整页深色或浅色底。"
      },
      {
        "key": "memberCount",
        "type": "slider",
        "label": "内容数量",
        "default": 4,
        "min": 2,
        "max": 6,
        "step": 1,
        "description": "内容卡片数量（自动分列填满版面）。",
        "publicKey": "memberCount",
        "publicLabel": "内容数量",
        "desc": "内容卡片数量（自动分列填满版面）。"
      },
      {
        "key": "showRole",
        "type": "toggle",
        "label": "副标签",
        "default": true,
        "description": "主标签下方的辅助说明。",
        "publicKey": "showRole",
        "publicLabel": "副标签",
        "desc": "主标签下方的辅助说明。"
      },
      {
        "key": "showIndex",
        "type": "toggle",
        "label": "编号",
        "default": false,
        "description": "姓名上方的 01/02… 序号。",
        "publicKey": "showIndex",
        "publicLabel": "编号",
        "desc": "姓名上方的 01/02… 序号。"
      },
      {
        "key": "radius",
        "type": "slider",
        "label": "圆角",
        "default": 12,
        "min": 0,
        "max": 28,
        "step": 2,
        "unit": "px",
        "description": "图片格的圆角半径。",
        "publicKey": "radius",
        "publicLabel": "圆角",
        "desc": "图片格的圆角半径。"
      }
    ],
    "defaultProps": {
      "memberCount": 4,
      "showRole": true,
      "showIndex": false,
      "radius": 12,
      "idPrefix": "team",
      "tone": "light"
    }
  },
  {
    "key": "theme10_page025",
    "themeKey": "theme10",
    "pageNumber": 25,
    "layout": "THEME10-025",
    "slot": "dashboard",
    "label": "数据仪表盘",
    "bgClass": "",
    "controls": [
      {
        "key": "tone",
        "type": "radio",
        "label": "页面底色",
        "default": "dark",
        "options": [
          {
            "value": "dark",
            "label": "深色",
            "image": "",
            "color": ""
          },
          {
            "value": "light",
            "label": "浅色",
            "image": "",
            "color": ""
          }
        ],
        "description": "整页深色或浅色底。",
        "publicKey": "tone",
        "publicLabel": "页面底色",
        "desc": "整页深色或浅色底。"
      },
      {
        "key": "chartType",
        "type": "radio",
        "label": "图表类型",
        "default": "bars",
        "options": [
          {
            "value": "area",
            "label": "面积"
          },
          {
            "value": "bars",
            "label": "柱状"
          },
          {
            "value": "line",
            "label": "折线"
          }
        ],
        "description": "所有图表（含迷你走势）的统一呈现样式。",
        "publicKey": "chartType",
        "publicLabel": "图表类型",
        "desc": "所有图表（含迷你走势）的统一呈现样式。"
      },
      {
        "key": "tileCount",
        "type": "slider",
        "label": "指标块数量",
        "default": 4,
        "min": 2,
        "max": 6,
        "step": 1,
        "description": "下方 KPI 指标块的数量（自动排布列数）。",
        "publicKey": "tileCount",
        "publicLabel": "指标块数量",
        "desc": "下方 KPI 指标块的数量（自动排布列数）。"
      },
      {
        "key": "showHero",
        "type": "toggle",
        "label": "主图面板",
        "default": true,
        "description": "顶部的大号走势图面板。",
        "publicKey": "showHero",
        "publicLabel": "主图面板",
        "desc": "顶部的大号走势图面板。"
      },
      {
        "key": "focus",
        "type": "toggle",
        "label": "重点聚焦",
        "default": false,
        "description": "高亮某一指标块，其余弱化。",
        "publicKey": "focus",
        "publicLabel": "重点聚焦",
        "desc": "高亮某一指标块，其余弱化。"
      },
      {
        "key": "focusIndex",
        "type": "slider",
        "label": "聚焦第几项",
        "default": 1,
        "min": 1,
        "max": 6,
        "step": 1,
        "description": "需开启「重点聚焦」后生效，指定被高亮的指标块。",
        "publicKey": "focusIndex",
        "publicLabel": "聚焦第几项",
        "desc": "需开启「重点聚焦」后生效，指定被高亮的指标块。"
      }
    ],
    "defaultProps": {
      "chartType": "bars",
      "tileCount": 4,
      "showHero": true,
      "focus": false,
      "focusIndex": 1,
      "idPrefix": "dashboard",
      "tone": "dark"
    }
  },
  {
    "key": "theme10_page026",
    "themeKey": "theme10",
    "pageNumber": 26,
    "layout": "THEME10-026",
    "slot": "waterfall",
    "label": "收益归因",
    "bgClass": "",
    "controls": [
      {
        "key": "tone",
        "type": "radio",
        "label": "页面底色",
        "default": "light",
        "options": [
          {
            "value": "dark",
            "label": "深色",
            "image": "",
            "color": ""
          },
          {
            "value": "light",
            "label": "浅色",
            "image": "",
            "color": ""
          }
        ],
        "description": "整页深色或浅色底。",
        "publicKey": "tone",
        "publicLabel": "页面底色",
        "desc": "整页深色或浅色底。"
      },
      {
        "key": "barCount",
        "type": "slider",
        "label": "归因步骤数",
        "default": 4,
        "min": 3,
        "max": 6,
        "step": 1,
        "description": "起点与终点之间的归因步骤数量。",
        "publicKey": "barCount",
        "publicLabel": "归因步骤数",
        "desc": "起点与终点之间的归因步骤数量。"
      },
      {
        "key": "focus",
        "type": "toggle",
        "label": "重点聚焦",
        "default": false,
        "description": "高亮某一归因步骤。",
        "publicKey": "focus",
        "publicLabel": "重点聚焦",
        "desc": "高亮某一归因步骤。"
      },
      {
        "key": "focusIndex",
        "type": "slider",
        "label": "聚焦第几项",
        "default": 1,
        "min": 1,
        "max": 6,
        "step": 1,
        "description": "需开启「重点聚焦」后生效（仅作用于中间步骤）。",
        "publicKey": "focusIndex",
        "publicLabel": "聚焦第几项",
        "desc": "需开启「重点聚焦」后生效（仅作用于中间步骤）。"
      },
      {
        "key": "showConnectors",
        "type": "toggle",
        "label": "台阶连线",
        "default": true,
        "description": "相邻柱体之间的虚线台阶连接。",
        "publicKey": "showConnectors",
        "publicLabel": "台阶连线",
        "desc": "相邻柱体之间的虚线台阶连接。"
      },
      {
        "key": "showValues",
        "type": "toggle",
        "label": "增减数值",
        "default": true,
        "description": "每根柱体上方的 +/− 数值标签。",
        "publicKey": "showValueLabels",
        "publicLabel": "增减数值",
        "desc": "每根柱体上方的 +/− 数值标签。"
      }
    ],
    "defaultProps": {
      "barCount": 4,
      "focus": false,
      "focusIndex": 1,
      "showConnectors": true,
      "showValues": true,
      "idPrefix": "waterfall",
      "tone": "light"
    }
  },
  {
    "key": "theme10_page027",
    "themeKey": "theme10",
    "pageNumber": 27,
    "layout": "THEME10-027",
    "slot": "curve",
    "label": "净值曲线",
    "bgClass": "",
    "controls": [
      {
        "key": "tone",
        "type": "radio",
        "label": "页面底色",
        "default": "light",
        "options": [
          {
            "value": "dark",
            "label": "深色",
            "image": "",
            "color": ""
          },
          {
            "value": "light",
            "label": "浅色",
            "image": "",
            "color": ""
          }
        ],
        "description": "整页深色或浅色底。",
        "publicKey": "tone",
        "publicLabel": "页面底色",
        "desc": "整页深色或浅色底。"
      },
      {
        "key": "annotationCount",
        "type": "slider",
        "label": "标注数量",
        "default": 3,
        "min": 0,
        "max": 4,
        "step": 1,
        "description": "曲线上钉住的事件标注数量。",
        "publicKey": "annotationCount",
        "publicLabel": "标注数量",
        "desc": "曲线上钉住的事件标注数量。"
      },
      {
        "key": "showArea",
        "type": "toggle",
        "label": "面积填充",
        "default": true,
        "description": "曲线下方的渐变面积。",
        "publicKey": "showArea",
        "publicLabel": "面积填充",
        "desc": "曲线下方的渐变面积。"
      },
      {
        "key": "showGrid",
        "type": "toggle",
        "label": "网格线",
        "default": true,
        "description": "横向参考网格。",
        "publicKey": "showGrid",
        "publicLabel": "网格线",
        "desc": "横向参考网格。"
      },
      {
        "key": "showEnd",
        "type": "toggle",
        "label": "末端数值",
        "default": true,
        "description": "曲线末端的最终数值徽标。",
        "publicKey": "showValueLabels",
        "publicLabel": "末端数值",
        "desc": "曲线末端的最终数值徽标。"
      },
      {
        "key": "smooth",
        "type": "toggle",
        "label": "平滑曲线",
        "default": true,
        "description": "平滑曲线或折线连接。",
        "publicKey": "smooth",
        "publicLabel": "平滑曲线",
        "desc": "平滑曲线或折线连接。"
      }
    ],
    "defaultProps": {
      "annotationCount": 3,
      "showArea": true,
      "showGrid": true,
      "showEnd": true,
      "smooth": true,
      "idPrefix": "curve",
      "tone": "light"
    }
  },
  {
    "key": "theme10_page028",
    "themeKey": "theme10",
    "pageNumber": 28,
    "layout": "THEME10-028",
    "slot": "areastack",
    "label": "堆叠面积",
    "bgClass": "",
    "controls": [
      {
        "key": "tone",
        "type": "radio",
        "label": "页面底色",
        "default": "dark",
        "options": [
          {
            "value": "dark",
            "label": "深色",
            "image": "",
            "color": ""
          },
          {
            "value": "light",
            "label": "浅色",
            "image": "",
            "color": ""
          }
        ],
        "description": "整页深色或浅色底。",
        "publicKey": "tone",
        "publicLabel": "页面底色",
        "desc": "整页深色或浅色底。"
      },
      {
        "key": "seriesCount",
        "type": "slider",
        "label": "系列数量",
        "default": 4,
        "min": 2,
        "max": 5,
        "step": 1,
        "description": "堆叠的资产类别条带数量。",
        "publicKey": "seriesCount",
        "publicLabel": "系列数量",
        "desc": "堆叠的资产类别条带数量。"
      },
      {
        "key": "normalized",
        "type": "toggle",
        "label": "百分比堆叠",
        "default": false,
        "description": "开启则铺满为 100% 占比视图，关闭为绝对数值。",
        "publicKey": "normalized",
        "publicLabel": "百分比堆叠",
        "desc": "开启则铺满为 100% 占比视图，关闭为绝对数值。"
      },
      {
        "key": "showLegend",
        "type": "toggle",
        "label": "图例",
        "default": true,
        "description": "右上角的系列图例。",
        "publicKey": "showLegend",
        "publicLabel": "图例",
        "desc": "右上角的系列图例。"
      },
      {
        "key": "showGrid",
        "type": "toggle",
        "label": "网格线",
        "default": true,
        "description": "横向参考网格。",
        "publicKey": "showGrid",
        "publicLabel": "网格线",
        "desc": "横向参考网格。"
      },
      {
        "key": "showAxis",
        "type": "toggle",
        "label": "时间轴",
        "default": true,
        "description": "底部的周期标签。",
        "publicKey": "showAxis",
        "publicLabel": "时间轴",
        "desc": "底部的周期标签。"
      }
    ],
    "defaultProps": {
      "seriesCount": 4,
      "showLegend": true,
      "showGrid": true,
      "showAxis": true,
      "normalized": false,
      "idPrefix": "areastack",
      "tone": "dark"
    }
  },
  {
    "key": "theme10_page029",
    "themeKey": "theme10",
    "pageNumber": 29,
    "layout": "THEME10-029",
    "slot": "distribution",
    "label": "收益分布",
    "bgClass": "",
    "controls": [
      {
        "key": "tone",
        "type": "radio",
        "label": "页面底色",
        "default": "dark",
        "options": [
          {
            "value": "dark",
            "label": "深色",
            "image": "",
            "color": ""
          },
          {
            "value": "light",
            "label": "浅色",
            "image": "",
            "color": ""
          }
        ],
        "description": "整页深色或浅色底。",
        "publicKey": "tone",
        "publicLabel": "页面底色",
        "desc": "整页深色或浅色底。"
      },
      {
        "key": "binCount",
        "type": "slider",
        "label": "分箱数量",
        "default": 11,
        "min": 7,
        "max": 15,
        "step": 1,
        "description": "直方图的分箱（柱）数量。",
        "publicKey": "binCount",
        "publicLabel": "分箱数量",
        "desc": "直方图的分箱（柱）数量。"
      },
      {
        "key": "showCurve",
        "type": "toggle",
        "label": "分布曲线",
        "default": true,
        "description": "叠加的平滑分布轮廓。",
        "publicKey": "showCurve",
        "publicLabel": "分布曲线",
        "desc": "叠加的平滑分布轮廓。"
      },
      {
        "key": "showMean",
        "type": "toggle",
        "label": "均值线",
        "default": true,
        "description": "均值位置的竖线标记。",
        "publicKey": "showMean",
        "publicLabel": "均值线",
        "desc": "均值位置的竖线标记。"
      },
      {
        "key": "showBand",
        "type": "toggle",
        "label": "典型区间",
        "default": true,
        "description": "中部典型区间的阴影带。",
        "publicKey": "showBand",
        "publicLabel": "典型区间",
        "desc": "中部典型区间的阴影带。"
      },
      {
        "key": "showAxis",
        "type": "toggle",
        "label": "刻度轴",
        "default": true,
        "description": "底部的分箱刻度标签。",
        "publicKey": "showAxis",
        "publicLabel": "刻度轴",
        "desc": "底部的分箱刻度标签。"
      }
    ],
    "defaultProps": {
      "binCount": 11,
      "showCurve": true,
      "showMean": true,
      "showBand": true,
      "showAxis": true,
      "idPrefix": "distribution",
      "tone": "dark"
    }
  },
  {
    "key": "theme10_page030",
    "themeKey": "theme10",
    "pageNumber": 30,
    "layout": "THEME10-030",
    "slot": "ladder",
    "label": "复利阶梯",
    "bgClass": "",
    "controls": [
      {
        "key": "tone",
        "type": "radio",
        "label": "页面底色",
        "default": "dark",
        "options": [
          {
            "value": "dark",
            "label": "深色",
            "image": "",
            "color": ""
          },
          {
            "value": "light",
            "label": "浅色",
            "image": "",
            "color": ""
          }
        ],
        "description": "整页深色或浅色底。",
        "publicKey": "tone",
        "publicLabel": "页面底色",
        "desc": "整页深色或浅色底。"
      },
      {
        "key": "stepCount",
        "type": "slider",
        "label": "阶梯数量",
        "default": 5,
        "min": 3,
        "max": 7,
        "step": 1,
        "description": "展示的年份阶梯数量。",
        "publicKey": "stepCount",
        "publicLabel": "阶梯数量",
        "desc": "展示的年份阶梯数量。"
      },
      {
        "key": "showValues",
        "type": "toggle",
        "label": "阶梯数值",
        "default": true,
        "description": "每级阶梯顶部的余额数字。",
        "publicKey": "showValueLabels",
        "publicLabel": "阶梯数值",
        "desc": "每级阶梯顶部的余额数字。"
      },
      {
        "key": "showDelta",
        "type": "toggle",
        "label": "增长说明",
        "default": true,
        "description": "每级下方的年化增长小字。",
        "publicKey": "showDelta",
        "publicLabel": "增长说明",
        "desc": "每级下方的年化增长小字。"
      },
      {
        "key": "showTread",
        "type": "toggle",
        "label": "阶梯描线",
        "default": true,
        "description": "描出阶梯顶部的虚线踏步轮廓。",
        "publicKey": "showTread",
        "publicLabel": "阶梯描线",
        "desc": "描出阶梯顶部的虚线踏步轮廓。"
      },
      {
        "key": "focus",
        "type": "toggle",
        "label": "重点聚焦",
        "default": false,
        "description": "高亮某一级阶梯，其余弱化。",
        "publicKey": "focus",
        "publicLabel": "重点聚焦",
        "desc": "高亮某一级阶梯，其余弱化。"
      },
      {
        "key": "focusIndex",
        "type": "slider",
        "label": "聚焦第几项",
        "default": 5,
        "min": 1,
        "max": 7,
        "step": 1,
        "description": "需开启「重点聚焦」后生效。",
        "publicKey": "focusIndex",
        "publicLabel": "聚焦第几项",
        "desc": "需开启「重点聚焦」后生效。"
      }
    ],
    "defaultProps": {
      "stepCount": 5,
      "showValues": true,
      "showDelta": true,
      "showTread": true,
      "focus": false,
      "focusIndex": 5,
      "idPrefix": "ladder",
      "tone": "dark"
    }
  },
  {
    "key": "theme10_page031",
    "themeKey": "theme10",
    "pageNumber": 31,
    "layout": "THEME10-031",
    "slot": "timeline",
    "label": "横向时间轴",
    "bgClass": "",
    "controls": [
      {
        "key": "tone",
        "type": "radio",
        "label": "页面底色",
        "default": "dark",
        "options": [
          {
            "value": "dark",
            "label": "深色",
            "image": "",
            "color": ""
          },
          {
            "value": "light",
            "label": "浅色",
            "image": "",
            "color": ""
          }
        ],
        "description": "整页深色或浅色底。",
        "publicKey": "tone",
        "publicLabel": "页面底色",
        "desc": "整页深色或浅色底。"
      },
      {
        "key": "nodeCount",
        "type": "slider",
        "label": "节点数量",
        "default": 5,
        "min": 3,
        "max": 6,
        "step": 1,
        "description": "时间轴上的里程碑节点数量。",
        "publicKey": "nodeCount",
        "publicLabel": "节点数量",
        "desc": "时间轴上的里程碑节点数量。"
      },
      {
        "key": "layout",
        "type": "radio",
        "label": "节点排布",
        "default": "alternate",
        "options": [
          {
            "value": "alternate",
            "label": "上下交错"
          },
          {
            "value": "below",
            "label": "统一下方"
          }
        ],
        "description": "说明卡片在基线上下交错，或全部置于基线下方。",
        "publicKey": "layout",
        "publicLabel": "节点排布",
        "desc": "说明卡片在基线上下交错，或全部置于基线下方。"
      },
      {
        "key": "focus",
        "type": "toggle",
        "label": "重点聚焦",
        "default": false,
        "description": "高亮某一节点，其余弱化。",
        "publicKey": "focus",
        "publicLabel": "重点聚焦",
        "desc": "高亮某一节点，其余弱化。"
      },
      {
        "key": "focusIndex",
        "type": "slider",
        "label": "聚焦第几项",
        "default": 1,
        "min": 1,
        "max": 6,
        "step": 1,
        "description": "需开启「重点聚焦」后生效。",
        "publicKey": "focusIndex",
        "publicLabel": "聚焦第几项",
        "desc": "需开启「重点聚焦」后生效。"
      },
      {
        "key": "showConnector",
        "type": "toggle",
        "label": "连接基线",
        "default": true,
        "description": "贯穿节点的连接线与圆点。",
        "publicKey": "showConnector",
        "publicLabel": "连接基线",
        "desc": "贯穿节点的连接线与圆点。"
      }
    ],
    "defaultProps": {
      "nodeCount": 5,
      "layout": "alternate",
      "focus": false,
      "focusIndex": 1,
      "showConnector": true,
      "idPrefix": "timeline",
      "tone": "dark"
    }
  },
  {
    "key": "theme10_page032",
    "themeKey": "theme10",
    "pageNumber": 32,
    "layout": "THEME10-032",
    "slot": "gantt",
    "label": "排期甘特",
    "bgClass": "",
    "controls": [
      {
        "key": "tone",
        "type": "radio",
        "label": "页面底色",
        "default": "light",
        "options": [
          {
            "value": "dark",
            "label": "深色",
            "image": "",
            "color": ""
          },
          {
            "value": "light",
            "label": "浅色",
            "image": "",
            "color": ""
          }
        ],
        "description": "整页深色或浅色底。",
        "publicKey": "tone",
        "publicLabel": "页面底色",
        "desc": "整页深色或浅色底。"
      },
      {
        "key": "taskCount",
        "type": "slider",
        "label": "任务行数",
        "default": 5,
        "min": 3,
        "max": 7,
        "step": 1,
        "description": "排期中的任务行数。",
        "publicKey": "taskCount",
        "publicLabel": "任务行数",
        "desc": "排期中的任务行数。"
      },
      {
        "key": "colCount",
        "type": "slider",
        "label": "周期列数",
        "default": 6,
        "min": 4,
        "max": 8,
        "step": 1,
        "description": "时间轴上的周期列数。",
        "publicKey": "colCount",
        "publicLabel": "周期列数",
        "desc": "时间轴上的周期列数。"
      },
      {
        "key": "showToday",
        "type": "toggle",
        "label": "今天标记",
        "default": true,
        "description": "当前时间的竖线标记。",
        "publicKey": "showToday",
        "publicLabel": "今天标记",
        "desc": "当前时间的竖线标记。"
      },
      {
        "key": "showDates",
        "type": "toggle",
        "label": "区间标签",
        "default": true,
        "description": "每条任务条上的起止区间。",
        "publicKey": "showDates",
        "publicLabel": "区间标签",
        "desc": "每条任务条上的起止区间。"
      },
      {
        "key": "showGrid",
        "type": "toggle",
        "label": "网格线",
        "default": true,
        "description": "纵向的周期网格线。",
        "publicKey": "showGrid",
        "publicLabel": "网格线",
        "desc": "纵向的周期网格线。"
      },
      {
        "key": "focus",
        "type": "toggle",
        "label": "重点聚焦",
        "default": false,
        "description": "高亮某一任务，其余弱化。",
        "publicKey": "focus",
        "publicLabel": "重点聚焦",
        "desc": "高亮某一任务，其余弱化。"
      },
      {
        "key": "focusIndex",
        "type": "slider",
        "label": "聚焦第几项",
        "default": 1,
        "min": 1,
        "max": 7,
        "step": 1,
        "description": "需开启「重点聚焦」后生效。",
        "publicKey": "focusIndex",
        "publicLabel": "聚焦第几项",
        "desc": "需开启「重点聚焦」后生效。"
      }
    ],
    "defaultProps": {
      "taskCount": 5,
      "colCount": 6,
      "showToday": true,
      "showDates": true,
      "showGrid": true,
      "focus": false,
      "focusIndex": 1,
      "idPrefix": "gantt",
      "tone": "light"
    }
  },
  {
    "key": "theme10_page033",
    "themeKey": "theme10",
    "pageNumber": 33,
    "layout": "THEME10-033",
    "slot": "steps",
    "label": "运作机制",
    "bgClass": "",
    "controls": [
      {
        "key": "tone",
        "type": "radio",
        "label": "页面底色",
        "default": "light",
        "options": [
          {
            "value": "dark",
            "label": "深色",
            "image": "",
            "color": ""
          },
          {
            "value": "light",
            "label": "浅色",
            "image": "",
            "color": ""
          }
        ],
        "description": "整页深色或浅色底。",
        "publicKey": "tone",
        "publicLabel": "页面底色",
        "desc": "整页深色或浅色底。"
      },
      {
        "key": "stepCount",
        "type": "slider",
        "label": "步骤数量",
        "default": 4,
        "min": 3,
        "max": 5,
        "step": 1,
        "description": "机制的步骤数量。",
        "publicKey": "stepCount",
        "publicLabel": "步骤数量",
        "desc": "机制的步骤数量。"
      },
      {
        "key": "showConnectors",
        "type": "toggle",
        "label": "连接箭头",
        "default": true,
        "description": "相邻步骤之间的连接线与箭头。",
        "publicKey": "showConnectors",
        "publicLabel": "连接箭头",
        "desc": "相邻步骤之间的连接线与箭头。"
      },
      {
        "key": "showDesc",
        "type": "toggle",
        "label": "步骤说明",
        "default": true,
        "description": "每个步骤下方的说明文字。",
        "publicKey": "showDesc",
        "publicLabel": "步骤说明",
        "desc": "每个步骤下方的说明文字。"
      },
      {
        "key": "focus",
        "type": "toggle",
        "label": "重点聚焦",
        "default": false,
        "description": "高亮某一步骤，其余弱化。",
        "publicKey": "focus",
        "publicLabel": "重点聚焦",
        "desc": "高亮某一步骤，其余弱化。"
      },
      {
        "key": "focusIndex",
        "type": "slider",
        "label": "聚焦第几项",
        "default": 1,
        "min": 1,
        "max": 5,
        "step": 1,
        "description": "需开启「重点聚焦」后生效。",
        "publicKey": "focusIndex",
        "publicLabel": "聚焦第几项",
        "desc": "需开启「重点聚焦」后生效。"
      }
    ],
    "defaultProps": {
      "stepCount": 4,
      "showConnectors": true,
      "showDesc": true,
      "focus": false,
      "focusIndex": 1,
      "idPrefix": "steps",
      "tone": "light"
    }
  },
  {
    "key": "theme10_page034",
    "themeKey": "theme10",
    "pageNumber": 34,
    "layout": "THEME10-034",
    "slot": "funnel",
    "label": "转化漏斗",
    "bgClass": "",
    "controls": [
      {
        "key": "tone",
        "type": "radio",
        "label": "页面底色",
        "default": "light",
        "options": [
          {
            "value": "dark",
            "label": "深色",
            "image": "",
            "color": ""
          },
          {
            "value": "light",
            "label": "浅色",
            "image": "",
            "color": ""
          }
        ],
        "description": "整页深色或浅色底。",
        "publicKey": "tone",
        "publicLabel": "页面底色",
        "desc": "整页深色或浅色底。"
      },
      {
        "key": "stageCount",
        "type": "slider",
        "label": "阶段数量",
        "default": 4,
        "min": 3,
        "max": 6,
        "step": 1,
        "description": "漏斗的阶段数量。",
        "publicKey": "stageCount",
        "publicLabel": "阶段数量",
        "desc": "漏斗的阶段数量。"
      },
      {
        "key": "showValues",
        "type": "toggle",
        "label": "阶段数值",
        "default": true,
        "description": "每段漏斗内的数值。",
        "publicKey": "showValueLabels",
        "publicLabel": "阶段数值",
        "desc": "每段漏斗内的数值。"
      },
      {
        "key": "showStepRate",
        "type": "toggle",
        "label": "环节转化",
        "default": true,
        "description": "相邻阶段之间的转化 / 增减百分比。",
        "publicKey": "showStepRate",
        "publicLabel": "环节转化",
        "desc": "相邻阶段之间的转化 / 增减百分比。"
      },
      {
        "key": "showShare",
        "type": "toggle",
        "label": "占起点比",
        "default": false,
        "description": "相对第一阶段的占比。",
        "publicKey": "showShare",
        "publicLabel": "占起点比",
        "desc": "相对第一阶段的占比。"
      },
      {
        "key": "focus",
        "type": "toggle",
        "label": "重点聚焦",
        "default": false,
        "description": "高亮某一阶段，其余弱化。",
        "publicKey": "focus",
        "publicLabel": "重点聚焦",
        "desc": "高亮某一阶段，其余弱化。"
      },
      {
        "key": "focusIndex",
        "type": "slider",
        "label": "聚焦第几项",
        "default": 1,
        "min": 1,
        "max": 6,
        "step": 1,
        "description": "需开启「重点聚焦」后生效。",
        "publicKey": "focusIndex",
        "publicLabel": "聚焦第几项",
        "desc": "需开启「重点聚焦」后生效。"
      }
    ],
    "defaultProps": {
      "stageCount": 4,
      "showValues": true,
      "showStepRate": true,
      "showShare": false,
      "focus": false,
      "focusIndex": 1,
      "idPrefix": "funnel",
      "tone": "light"
    }
  },
  {
    "key": "theme10_page035",
    "themeKey": "theme10",
    "pageNumber": 35,
    "layout": "THEME10-035",
    "slot": "cycle",
    "label": "闭环循环",
    "bgClass": "",
    "controls": [
      {
        "key": "tone",
        "type": "radio",
        "label": "页面底色",
        "default": "dark",
        "options": [
          {
            "value": "dark",
            "label": "深色",
            "image": "",
            "color": ""
          },
          {
            "value": "light",
            "label": "浅色",
            "image": "",
            "color": ""
          }
        ],
        "description": "整页深色或浅色底。",
        "publicKey": "tone",
        "publicLabel": "页面底色",
        "desc": "整页深色或浅色底。"
      },
      {
        "key": "layout",
        "type": "radio",
        "label": "布局",
        "default": "top",
        "options": [
          {
            "value": "top",
            "label": "上下"
          },
          {
            "value": "side",
            "label": "左右"
          }
        ],
        "description": "标题与图表的排布：上下堆叠或左右分栏。",
        "publicKey": "layout",
        "publicLabel": "布局",
        "desc": "标题与图表的排布：上下堆叠或左右分栏。"
      },
      {
        "key": "nodeCount",
        "type": "slider",
        "label": "节点数量",
        "default": 4,
        "min": 3,
        "max": 6,
        "step": 1,
        "description": "循环上的节点数量。",
        "publicKey": "nodeCount",
        "publicLabel": "节点数量",
        "desc": "循环上的节点数量。"
      },
      {
        "key": "showArrows",
        "type": "toggle",
        "label": "流向箭头",
        "default": true,
        "description": "节点之间的弧形流向箭头。",
        "publicKey": "showArrows",
        "publicLabel": "流向箭头",
        "desc": "节点之间的弧形流向箭头。"
      },
      {
        "key": "showHub",
        "type": "toggle",
        "label": "中心标签",
        "default": true,
        "description": "圆环中心的主体标签。",
        "publicKey": "showHub",
        "publicLabel": "中心标签",
        "desc": "圆环中心的主体标签。"
      },
      {
        "key": "showDesc",
        "type": "toggle",
        "label": "节点说明",
        "default": true,
        "description": "每个节点旁的说明文字。",
        "publicKey": "showDesc",
        "publicLabel": "节点说明",
        "desc": "每个节点旁的说明文字。"
      },
      {
        "key": "focus",
        "type": "toggle",
        "label": "重点聚焦",
        "default": false,
        "description": "高亮某一节点，其余弱化。",
        "publicKey": "focus",
        "publicLabel": "重点聚焦",
        "desc": "高亮某一节点，其余弱化。"
      },
      {
        "key": "focusIndex",
        "type": "slider",
        "label": "聚焦第几项",
        "default": 1,
        "min": 1,
        "max": 6,
        "step": 1,
        "description": "需开启「重点聚焦」后生效。",
        "publicKey": "focusIndex",
        "publicLabel": "聚焦第几项",
        "desc": "需开启「重点聚焦」后生效。"
      }
    ],
    "defaultProps": {
      "nodeCount": 4,
      "showArrows": true,
      "showHub": true,
      "showDesc": true,
      "focus": false,
      "focusIndex": 1,
      "layout": "top",
      "idPrefix": "cycle",
      "tone": "dark"
    }
  },
  {
    "key": "theme10_page036",
    "themeKey": "theme10",
    "pageNumber": 36,
    "layout": "THEME10-036",
    "slot": "swimlane",
    "label": "职责泳道",
    "bgClass": "",
    "controls": [
      {
        "key": "tone",
        "type": "radio",
        "label": "页面底色",
        "default": "light",
        "options": [
          {
            "value": "dark",
            "label": "深色",
            "image": "",
            "color": ""
          },
          {
            "value": "light",
            "label": "浅色",
            "image": "",
            "color": ""
          }
        ],
        "description": "整页深色或浅色底。",
        "publicKey": "tone",
        "publicLabel": "页面底色",
        "desc": "整页深色或浅色底。"
      },
      {
        "key": "laneCount",
        "type": "slider",
        "label": "泳道数量",
        "default": 3,
        "min": 2,
        "max": 4,
        "step": 1,
        "description": "参与方（泳道）数量。",
        "publicKey": "laneCount",
        "publicLabel": "泳道数量",
        "desc": "参与方（泳道）数量。"
      },
      {
        "key": "phaseCount",
        "type": "slider",
        "label": "阶段列数",
        "default": 4,
        "min": 3,
        "max": 5,
        "step": 1,
        "description": "阶段（列）数量。",
        "publicKey": "phaseCount",
        "publicLabel": "阶段列数",
        "desc": "阶段（列）数量。"
      },
      {
        "key": "showInactive",
        "type": "toggle",
        "label": "空格点",
        "default": true,
        "description": "无责任格里的浅色占位点。",
        "publicKey": "showInactive",
        "publicLabel": "空格点",
        "desc": "无责任格里的浅色占位点。"
      },
      {
        "key": "accentLane",
        "type": "slider",
        "label": "强调泳道",
        "default": 0,
        "min": 0,
        "max": 4,
        "step": 1,
        "description": "高亮某一条泳道（0 为不强调）。",
        "publicKey": "accentLane",
        "publicLabel": "强调泳道",
        "desc": "高亮某一条泳道（0 为不强调）。"
      }
    ],
    "defaultProps": {
      "laneCount": 4,
      "phaseCount": 5,
      "showInactive": true,
      "accentLane": 0,
      "idPrefix": "swimlane",
      "tone": "light"
    }
  },
  {
    "key": "theme10_page037",
    "themeKey": "theme10",
    "pageNumber": 37,
    "layout": "THEME10-037",
    "slot": "principles",
    "label": "投资原则",
    "bgClass": "",
    "controls": [
      {
        "key": "tone",
        "type": "radio",
        "label": "页面底色",
        "default": "light",
        "options": [
          {
            "value": "dark",
            "label": "深色",
            "image": "",
            "color": ""
          },
          {
            "value": "light",
            "label": "浅色",
            "image": "",
            "color": ""
          }
        ],
        "description": "整页深色或浅色底。",
        "publicKey": "tone",
        "publicLabel": "页面底色",
        "desc": "整页深色或浅色底。"
      },
      {
        "key": "itemCount",
        "type": "slider",
        "label": "原则数量",
        "default": 4,
        "min": 3,
        "max": 6,
        "step": 1,
        "description": "右侧编号清单展示的原则条目数量。",
        "publicKey": "itemCount",
        "publicLabel": "原则数量",
        "desc": "右侧编号清单展示的原则条目数量。"
      },
      {
        "key": "focusIndex",
        "type": "slider",
        "label": "主角原则",
        "default": 1,
        "min": 1,
        "max": 6,
        "step": 1,
        "description": "被放大到左侧聚光位、并在清单中以蓝色标记的那一条（1 起）。",
        "publicKey": "focusIndex",
        "publicLabel": "主角原则",
        "desc": "被放大到左侧聚光位、并在清单中以蓝色标记的那一条（1 起）。"
      },
      {
        "key": "showGhostNum",
        "type": "toggle",
        "label": "巨号序号",
        "default": true,
        "description": "左侧聚光位上方的超大蓝色序号。",
        "publicKey": "showGhostNum",
        "publicLabel": "巨号序号",
        "desc": "左侧聚光位上方的超大蓝色序号。"
      },
      {
        "key": "showLeadBody",
        "type": "toggle",
        "label": "主角正文",
        "default": true,
        "description": "左侧聚光原则下方的说明正文。",
        "publicKey": "showLeadBody",
        "publicLabel": "主角正文",
        "desc": "左侧聚光原则下方的说明正文。"
      }
    ],
    "defaultProps": {
      "itemCount": 4,
      "focusIndex": 1,
      "showGhostNum": true,
      "showLeadBody": true,
      "idPrefix": "principles",
      "tone": "light"
    }
  },
  {
    "key": "theme10_page038",
    "themeKey": "theme10",
    "pageNumber": 38,
    "layout": "THEME10-038",
    "slot": "divider",
    "label": "序号分章",
    "bgClass": "",
    "controls": [
      {
        "key": "theme",
        "type": "select",
        "label": "背景主题",
        "default": "dawn",
        "options": [
          {
            "value": "midnight",
            "label": "午夜"
          },
          {
            "value": "dusk",
            "label": "暮蓝"
          },
          {
            "value": "graphite",
            "label": "石墨"
          },
          {
            "value": "dawn",
            "label": "晨曦"
          },
          {
            "value": "vapor",
            "label": "雾光"
          },
          {
            "value": "paper",
            "label": "纸白"
          }
        ],
        "description": "整页背景渐变情绪（来自 DECK_THEMES）。",
        "publicKey": "theme",
        "publicLabel": "背景主题",
        "desc": "整页背景渐变情绪（来自 DECK_THEMES）。"
      },
      {
        "key": "numberSide",
        "type": "radio",
        "label": "序号位置",
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
        "description": "巨幅序号所在的一侧。",
        "publicKey": "numberSide",
        "publicLabel": "序号位置",
        "desc": "巨幅序号所在的一侧。"
      },
      {
        "key": "showRule",
        "type": "toggle",
        "label": "分隔标线",
        "default": true,
        "description": "序号与标题之间的竖向细线。",
        "publicKey": "showRule",
        "publicLabel": "分隔标线",
        "desc": "序号与标题之间的竖向细线。"
      },
      {
        "key": "showMeta",
        "type": "toggle",
        "label": "底部信息",
        "default": true,
        "description": "底部的元信息小字。",
        "publicKey": "showMeta",
        "publicLabel": "底部信息",
        "desc": "底部的元信息小字。"
      }
    ],
    "defaultProps": {
      "theme": "dawn",
      "numberSide": "left",
      "showRule": true,
      "showMeta": true,
      "idPrefix": "divider"
    }
  },
  {
    "key": "theme10_page039",
    "themeKey": "theme10",
    "pageNumber": 39,
    "layout": "THEME10-039",
    "slot": "quote",
    "label": "引言",
    "bgClass": "",
    "controls": [
      {
        "key": "theme",
        "type": "select",
        "label": "背景主题",
        "default": "vapor",
        "options": [
          {
            "value": "vapor",
            "label": "雾光"
          },
          {
            "value": "dusk",
            "label": "暮光"
          },
          {
            "value": "midnight",
            "label": "午夜"
          },
          {
            "value": "graphite",
            "label": "石墨"
          },
          {
            "value": "dawn",
            "label": "晨光"
          },
          {
            "value": "paper",
            "label": "纸白"
          }
        ],
        "description": "引言页背景。",
        "publicKey": "theme",
        "publicLabel": "背景主题",
        "desc": "引言页背景。"
      },
      {
        "key": "align",
        "type": "radio",
        "label": "对齐",
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
        "description": "文本对齐。",
        "publicKey": "align",
        "publicLabel": "对齐",
        "desc": "文本对齐。"
      },
      {
        "key": "showQuoteMark",
        "type": "toggle",
        "label": "引号装饰",
        "default": true,
        "description": "大号引号符。",
        "publicKey": "showQuoteMark",
        "publicLabel": "引号装饰",
        "desc": "大号引号符。"
      },
      {
        "key": "showAttribution",
        "type": "toggle",
        "label": "署名",
        "default": true,
        "description": "显示作者与头衔。",
        "publicKey": "showAttribution",
        "publicLabel": "署名",
        "desc": "显示作者与头衔。"
      }
    ],
    "defaultProps": {
      "theme": "vapor",
      "align": "left",
      "showQuoteMark": true,
      "showAttribution": true,
      "idPrefix": "quote"
    }
  },
  {
    "key": "theme10_page040",
    "themeKey": "theme10",
    "pageNumber": 40,
    "layout": "THEME10-040",
    "slot": "editorial",
    "label": "编排图文",
    "bgClass": "",
    "controls": [
      {
        "key": "tone",
        "type": "radio",
        "label": "页面底色",
        "default": "light",
        "options": [
          {
            "value": "dark",
            "label": "深色",
            "image": "",
            "color": ""
          },
          {
            "value": "light",
            "label": "浅色",
            "image": "",
            "color": ""
          }
        ],
        "description": "整页深色或浅色底。",
        "publicKey": "tone",
        "publicLabel": "页面底色",
        "desc": "整页深色或浅色底。"
      },
      {
        "key": "imageCount",
        "type": "slider",
        "label": "图片数量",
        "default": 3,
        "min": 0,
        "max": 4,
        "step": 1,
        "description": "右侧图片槽位数量（0 即纯文字编排版式）；每个槽位自适应所传图片的比例并自动排布。",
        "publicKey": "imageCount",
        "publicLabel": "图片数量",
        "desc": "右侧图片槽位数量（0 即纯文字编排版式）；每个槽位自适应所传图片的比例并自动排布。"
      },
      {
        "key": "imageSide",
        "type": "radio",
        "label": "图片位置",
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
        "description": "图片组在版面左侧还是右侧。",
        "publicKey": "imageSide",
        "publicLabel": "图片位置",
        "desc": "图片组在版面左侧还是右侧。"
      },
      {
        "key": "showPlates",
        "type": "toggle",
        "label": "编号索引",
        "default": true,
        "description": "文字列下方的图版编号清单（数量随图片数联动）。",
        "publicKey": "showPlates",
        "publicLabel": "编号索引",
        "desc": "文字列下方的图版编号清单（数量随图片数联动）。"
      },
      {
        "key": "showLead",
        "type": "toggle",
        "label": "引导段落",
        "default": true,
        "description": "标题下方的引导性说明段落。",
        "publicKey": "showLead",
        "publicLabel": "引导段落",
        "desc": "标题下方的引导性说明段落。"
      }
    ],
    "defaultProps": {
      "imageCount": 3,
      "imageSide": "right",
      "showPlates": true,
      "showLead": true,
      "idPrefix": "editorial",
      "tone": "light"
    }
  },
  {
    "key": "theme10_page041",
    "themeKey": "theme10",
    "pageNumber": 41,
    "layout": "THEME10-041",
    "slot": "magazine",
    "label": "杂志图文",
    "bgClass": "",
    "controls": [
      {
        "key": "tone",
        "type": "radio",
        "label": "页面底色",
        "default": "light",
        "options": [
          {
            "value": "dark",
            "label": "深色",
            "image": "",
            "color": ""
          },
          {
            "value": "light",
            "label": "浅色",
            "image": "",
            "color": ""
          }
        ],
        "description": "整页深色或浅色底。",
        "publicKey": "tone",
        "publicLabel": "页面底色",
        "desc": "整页深色或浅色底。"
      },
      {
        "key": "imageSide",
        "type": "radio",
        "label": "图片位置",
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
        "description": "大图出血所在的一侧（文字面板在另一侧浮起）。",
        "publicKey": "imageSide",
        "publicLabel": "图片位置",
        "desc": "大图出血所在的一侧（文字面板在另一侧浮起）。"
      },
      {
        "key": "imageCount",
        "type": "toggle",
        "label": "显示图片",
        "default": true,
        "description": "显示或隐藏主图。图片随上传比例自适应裁切。",
        "publicKey": "imageCount",
        "publicLabel": "显示图片",
        "desc": "显示或隐藏主图。图片随上传比例自适应裁切。"
      },
      {
        "key": "factCount",
        "type": "slider",
        "label": "数据条数",
        "default": 2,
        "min": 0,
        "max": 3,
        "step": 1,
        "description": "正文下方的关键数据条数量。",
        "publicKey": "factCount",
        "publicLabel": "数据条数",
        "desc": "正文下方的关键数据条数量。"
      },
      {
        "key": "panelGlass",
        "type": "toggle",
        "label": "毛玻璃面板",
        "default": true,
        "description": "文字面板为毛玻璃（叠在图上）或透明直排。",
        "publicKey": "panelGlass",
        "publicLabel": "毛玻璃面板",
        "desc": "文字面板为毛玻璃（叠在图上）或透明直排。"
      },
      {
        "key": "showKicker",
        "type": "toggle",
        "label": "栏目标签",
        "default": true,
        "description": "标题上方的栏目小标签。",
        "publicKey": "showKicker",
        "publicLabel": "栏目标签",
        "desc": "标题上方的栏目小标签。"
      }
    ],
    "defaultProps": {
      "imageSide": "right",
      "imageCount": true,
      "factCount": 2,
      "panelGlass": true,
      "showKicker": true,
      "idPrefix": "magazine",
      "tone": "light"
    }
  },
  {
    "key": "theme10_page042",
    "themeKey": "theme10",
    "pageNumber": 42,
    "layout": "THEME10-042",
    "slot": "triptych",
    "label": "三联影像",
    "bgClass": "",
    "controls": [
      {
        "key": "tone",
        "type": "radio",
        "label": "页面底色",
        "default": "dark",
        "options": [
          {
            "value": "dark",
            "label": "深色",
            "image": "",
            "color": ""
          },
          {
            "value": "light",
            "label": "浅色",
            "image": "",
            "color": ""
          }
        ],
        "description": "整页深色或浅色底。",
        "publicKey": "tone",
        "publicLabel": "页面底色",
        "desc": "整页深色或浅色底。"
      },
      {
        "key": "panelCount",
        "type": "slider",
        "label": "面板数量",
        "default": 3,
        "min": 2,
        "max": 4,
        "step": 1,
        "description": "并排影像面板数量。各面板等宽，图片随上传比例自适应裁切填满。",
        "publicKey": "panelCount",
        "publicLabel": "面板数量",
        "desc": "并排影像面板数量。各面板等宽，图片随上传比例自适应裁切填满。"
      },
      {
        "key": "showOverline",
        "type": "toggle",
        "label": "顶部标签",
        "default": true,
        "description": "面板上方的栏目小标签。",
        "publicKey": "showOverline",
        "publicLabel": "顶部标签",
        "desc": "面板上方的栏目小标签。"
      },
      {
        "key": "showIndex",
        "type": "toggle",
        "label": "序号",
        "default": true,
        "description": "每个面板上的 01/02… 序号。",
        "publicKey": "showIndex",
        "publicLabel": "序号",
        "desc": "每个面板上的 01/02… 序号。"
      },
      {
        "key": "captionPos",
        "type": "radio",
        "label": "文字位置",
        "default": "bottom",
        "options": [
          {
            "value": "bottom",
            "label": "底部"
          },
          {
            "value": "top",
            "label": "顶部"
          }
        ],
        "description": "叠在图片上的文字块位置。",
        "publicKey": "captionPos",
        "publicLabel": "文字位置",
        "desc": "叠在图片上的文字块位置。"
      },
      {
        "key": "radius",
        "type": "slider",
        "label": "圆角",
        "default": 12,
        "min": 0,
        "max": 28,
        "step": 2,
        "unit": "px",
        "description": "面板的圆角半径。",
        "publicKey": "radius",
        "publicLabel": "圆角",
        "desc": "面板的圆角半径。"
      }
    ],
    "defaultProps": {
      "panelCount": 3,
      "showOverline": true,
      "showIndex": true,
      "captionPos": "bottom",
      "radius": 12,
      "idPrefix": "triptych",
      "tone": "dark"
    }
  },
  {
    "key": "theme10_page043",
    "themeKey": "theme10",
    "pageNumber": 43,
    "layout": "THEME10-043",
    "slot": "strata",
    "label": "横向影像带",
    "bgClass": "",
    "controls": [
      {
        "key": "tone",
        "type": "radio",
        "label": "页面底色",
        "default": "dark",
        "options": [
          {
            "value": "dark",
            "label": "深色",
            "image": "",
            "color": ""
          },
          {
            "value": "light",
            "label": "浅色",
            "image": "",
            "color": ""
          }
        ],
        "description": "整页深色或浅色底。",
        "publicKey": "tone",
        "publicLabel": "页面底色",
        "desc": "整页深色或浅色底。"
      },
      {
        "key": "tileCount",
        "type": "slider",
        "label": "影像带数量",
        "default": 3,
        "min": 2,
        "max": 4,
        "step": 1,
        "description": "纵向堆叠的横向图片带数量（0 图时显示占位）。",
        "publicKey": "tileCount",
        "publicLabel": "影像带数量",
        "desc": "纵向堆叠的横向图片带数量（0 图时显示占位）。"
      },
      {
        "key": "showCaption",
        "type": "toggle",
        "label": "说明文字",
        "default": true,
        "description": "每条影像带标签下的说明小字。",
        "publicKey": "showCaption",
        "publicLabel": "说明文字",
        "desc": "每条影像带标签下的说明小字。"
      },
      {
        "key": "showIndex",
        "type": "toggle",
        "label": "序号",
        "default": true,
        "description": "每条影像带左侧的等宽序号。",
        "publicKey": "showIndex",
        "publicLabel": "序号",
        "desc": "每条影像带左侧的等宽序号。"
      },
      {
        "key": "focus",
        "type": "toggle",
        "label": "重点放大",
        "default": false,
        "description": "放大某一条影像带，其余压缩。",
        "publicKey": "focus",
        "publicLabel": "重点放大",
        "desc": "放大某一条影像带，其余压缩。"
      },
      {
        "key": "focusIndex",
        "type": "slider",
        "label": "放大第几条",
        "default": 1,
        "min": 1,
        "max": 4,
        "step": 1,
        "description": "需开启「重点放大」后生效。",
        "publicKey": "focusIndex",
        "publicLabel": "放大第几条",
        "desc": "需开启「重点放大」后生效。"
      }
    ],
    "defaultProps": {
      "tileCount": 3,
      "showCaption": true,
      "showIndex": true,
      "focus": false,
      "focusIndex": 1,
      "idPrefix": "strata",
      "tone": "dark"
    }
  },
  {
    "key": "theme10_page044",
    "themeKey": "theme10",
    "pageNumber": 44,
    "layout": "THEME10-044",
    "slot": "spark",
    "label": "持仓小图集",
    "bgClass": "",
    "controls": [
      {
        "key": "tone",
        "type": "radio",
        "label": "页面底色",
        "default": "light",
        "options": [
          {
            "value": "dark",
            "label": "深色",
            "image": "",
            "color": ""
          },
          {
            "value": "light",
            "label": "浅色",
            "image": "",
            "color": ""
          }
        ],
        "description": "整页深色或浅色底。",
        "publicKey": "tone",
        "publicLabel": "页面底色",
        "desc": "整页深色或浅色底。"
      },
      {
        "key": "cardCount",
        "type": "slider",
        "label": "卡片数量",
        "default": 6,
        "min": 3,
        "max": 8,
        "step": 1,
        "description": "展示的条目小卡数量（自动分列）。",
        "publicKey": "itemCount",
        "publicLabel": "卡片数量",
        "desc": "展示的条目小卡数量（自动分列）。"
      },
      {
        "key": "trendStyle",
        "type": "radio",
        "label": "走势样式",
        "default": "area",
        "options": [
          {
            "value": "area",
            "label": "面积"
          },
          {
            "value": "line",
            "label": "折线"
          },
          {
            "value": "bars",
            "label": "柱状"
          }
        ],
        "description": "迷你走势图是填充面积还是纯折线。",
        "publicKey": "trendStyle",
        "publicLabel": "走势样式",
        "desc": "迷你走势图是填充面积还是纯折线。"
      },
      {
        "key": "showDelta",
        "type": "toggle",
        "label": "角标",
        "default": true,
        "description": "每张卡右上角的说明角标。",
        "publicKey": "showDelta",
        "publicLabel": "角标",
        "desc": "每张卡右上角的说明角标。"
      },
      {
        "key": "focus",
        "type": "toggle",
        "label": "重点聚焦",
        "default": false,
        "description": "高亮某一张卡片，其余弱化。",
        "publicKey": "focus",
        "publicLabel": "重点聚焦",
        "desc": "高亮某一张卡片，其余弱化。"
      },
      {
        "key": "focusIndex",
        "type": "slider",
        "label": "聚焦第几项",
        "default": 1,
        "min": 1,
        "max": 8,
        "step": 1,
        "description": "需开启「重点聚焦」后生效。",
        "publicKey": "focusIndex",
        "publicLabel": "聚焦第几项",
        "desc": "需开启「重点聚焦」后生效。"
      }
    ],
    "defaultProps": {
      "cardCount": 6,
      "trendStyle": "area",
      "showDelta": true,
      "focus": true,
      "focusIndex": 1,
      "idPrefix": "spark",
      "tone": "light"
    }
  },
  {
    "key": "theme10_page045",
    "themeKey": "theme10",
    "pageNumber": 45,
    "layout": "THEME10-045",
    "slot": "testimonials",
    "label": "引述清单",
    "bgClass": "",
    "controls": [
      {
        "key": "tone",
        "type": "radio",
        "label": "页面底色",
        "default": "dark",
        "options": [
          {
            "value": "dark",
            "label": "深色",
            "image": "",
            "color": ""
          },
          {
            "value": "light",
            "label": "浅色",
            "image": "",
            "color": ""
          }
        ],
        "description": "整页深色或浅色底。",
        "publicKey": "tone",
        "publicLabel": "页面底色",
        "desc": "整页深色或浅色底。"
      },
      {
        "key": "cardCount",
        "type": "slider",
        "label": "内容数量",
        "default": 4,
        "min": 2,
        "max": 4,
        "step": 1,
        "description": "条目总数（1 条放大，其余进入右侧清单）。",
        "publicKey": "itemCount",
        "publicLabel": "内容数量",
        "desc": "条目总数（1 条放大，其余进入右侧清单）。"
      },
      {
        "key": "focusIndex",
        "type": "slider",
        "label": "重点内容",
        "default": 1,
        "min": 1,
        "max": 4,
        "step": 1,
        "description": "被放大为左侧重点内容的那一条（1 起）。",
        "publicKey": "focusIndex",
        "publicLabel": "重点内容",
        "desc": "被放大为左侧重点内容的那一条（1 起）。"
      },
      {
        "key": "showAvatar",
        "type": "toggle",
        "label": "圆形图片",
        "default": true,
        "description": "重点内容与清单中的圆形图片槽（可拖入媒体）。",
        "publicKey": "showAvatar",
        "publicLabel": "圆形图片",
        "desc": "重点内容与清单中的圆形图片槽（可拖入媒体）。"
      }
    ],
    "defaultProps": {
      "cardCount": 4,
      "focusIndex": 1,
      "showAvatar": true,
      "idPrefix": "testimonials",
      "tone": "dark"
    }
  },
  {
    "key": "theme10_page046",
    "themeKey": "theme10",
    "pageNumber": 46,
    "layout": "THEME10-046",
    "slot": "feature",
    "label": "图文特写",
    "bgClass": "",
    "controls": [
      {
        "key": "tone",
        "type": "radio",
        "label": "页面底色",
        "default": "light",
        "options": [
          {
            "value": "dark",
            "label": "深色",
            "image": "",
            "color": ""
          },
          {
            "value": "light",
            "label": "浅色",
            "image": "",
            "color": ""
          }
        ],
        "description": "整页深色或浅色底。",
        "publicKey": "tone",
        "publicLabel": "页面底色",
        "desc": "整页深色或浅色底。"
      },
      {
        "key": "split",
        "type": "toggle",
        "label": "半屏分色",
        "default": true,
        "description": "开启后一半图片、一半浅色文字面板（半黑半白）。",
        "publicKey": "split",
        "publicLabel": "半屏分色",
        "desc": "开启后一半图片、一半浅色文字面板（半黑半白）。"
      },
      {
        "key": "imageSide",
        "type": "radio",
        "label": "图片位置",
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
        "description": "图片在左还是在右。",
        "publicKey": "imageSide",
        "publicLabel": "图片位置",
        "desc": "图片在左还是在右。"
      },
      {
        "key": "showStats",
        "type": "toggle",
        "label": "数据点",
        "default": true,
        "description": "正文下方的小型数据。",
        "publicKey": "showStats",
        "publicLabel": "数据点",
        "desc": "正文下方的小型数据。"
      },
      {
        "key": "showCaption",
        "type": "toggle",
        "label": "图注",
        "default": false,
        "description": "图片下方的说明文字（非分色时显示）。",
        "publicKey": "showCaption",
        "publicLabel": "图注",
        "desc": "图片下方的说明文字（非分色时显示）。"
      }
    ],
    "defaultProps": {
      "imageSide": "right",
      "showStats": true,
      "showCaption": false,
      "split": true,
      "idPrefix": "feature",
      "tone": "light"
    }
  },
  {
    "key": "theme10_page047",
    "themeKey": "theme10",
    "pageNumber": 47,
    "layout": "THEME10-047",
    "slot": "compareimg",
    "label": "图像对照",
    "bgClass": "",
    "controls": [
      {
        "key": "tone",
        "type": "radio",
        "label": "页面底色",
        "default": "dark",
        "options": [
          {
            "value": "dark",
            "label": "深色",
            "image": "",
            "color": ""
          },
          {
            "value": "light",
            "label": "浅色",
            "image": "",
            "color": ""
          }
        ],
        "description": "整页深色或浅色底。",
        "publicKey": "tone",
        "publicLabel": "页面底色",
        "desc": "整页深色或浅色底。"
      },
      {
        "key": "split",
        "type": "slider",
        "label": "左右占比",
        "default": 50,
        "min": 35,
        "max": 65,
        "step": 5,
        "unit": "%",
        "description": "左侧画面所占的宽度比例。",
        "publicKey": "split",
        "publicLabel": "左右占比",
        "desc": "左侧画面所占的宽度比例。"
      },
      {
        "key": "showDivider",
        "type": "toggle",
        "label": "中缝与徽标",
        "default": true,
        "description": "中间的分隔与 VS 圆标。",
        "publicKey": "showDivider",
        "publicLabel": "中缝与徽标",
        "desc": "中间的分隔与 VS 圆标。"
      },
      {
        "key": "showLabels",
        "type": "toggle",
        "label": "分组标签",
        "default": true,
        "description": "每一侧顶部的标签胶囊。",
        "publicKey": "showLabels",
        "publicLabel": "分组标签",
        "desc": "每一侧顶部的标签胶囊。"
      },
      {
        "key": "showCaption",
        "type": "toggle",
        "label": "说明文字",
        "default": true,
        "description": "每一侧底部的说明文字。",
        "publicKey": "showCaption",
        "publicLabel": "说明文字",
        "desc": "每一侧底部的说明文字。"
      }
    ],
    "defaultProps": {
      "split": 50,
      "showDivider": true,
      "showLabels": true,
      "showCaption": true,
      "idPrefix": "compareimg",
      "tone": "dark"
    }
  },
  {
    "key": "theme10_page048",
    "themeKey": "theme10",
    "pageNumber": 48,
    "layout": "THEME10-048",
    "slot": "pinboard",
    "label": "影像贴墙",
    "bgClass": "",
    "controls": [
      {
        "key": "tone",
        "type": "radio",
        "label": "页面底色",
        "default": "dark",
        "options": [
          {
            "value": "dark",
            "label": "深色",
            "image": "",
            "color": ""
          },
          {
            "value": "light",
            "label": "浅色",
            "image": "",
            "color": ""
          }
        ],
        "description": "整页深色或浅色底。",
        "publicKey": "tone",
        "publicLabel": "页面底色",
        "desc": "整页深色或浅色底。"
      },
      {
        "key": "cardCount",
        "type": "slider",
        "label": "照片数量",
        "default": 4,
        "min": 2,
        "max": 5,
        "step": 1,
        "description": "贴墙上的照片卡数量；每张随上传图片比例自适应。",
        "publicKey": "cardCount",
        "publicLabel": "照片数量",
        "desc": "贴墙上的照片卡数量；每张随上传图片比例自适应。"
      },
      {
        "key": "showCaption",
        "type": "toggle",
        "label": "照片说明",
        "default": true,
        "description": "每张照片下方的说明条。",
        "publicKey": "showCaption",
        "publicLabel": "照片说明",
        "desc": "每张照片下方的说明条。"
      },
      {
        "key": "scatter",
        "type": "toggle",
        "label": "随性散布",
        "default": true,
        "description": "为照片卡施加轻微旋转与错落；关闭则整齐排列。",
        "publicKey": "scatter",
        "publicLabel": "随性散布",
        "desc": "为照片卡施加轻微旋转与错落；关闭则整齐排列。"
      },
      {
        "key": "showPin",
        "type": "toggle",
        "label": "图钉",
        "default": true,
        "description": "每张照片顶部的图钉。",
        "publicKey": "showPin",
        "publicLabel": "图钉",
        "desc": "每张照片顶部的图钉。"
      }
    ],
    "defaultProps": {
      "cardCount": 4,
      "showCaption": true,
      "scatter": true,
      "showPin": true,
      "idPrefix": "pinboard",
      "tone": "dark"
    }
  },
  {
    "key": "theme10_page049",
    "themeKey": "theme10",
    "pageNumber": 49,
    "layout": "THEME10-049",
    "slot": "filmstrip",
    "label": "影像长卷",
    "bgClass": "",
    "controls": [
      {
        "key": "tone",
        "type": "radio",
        "label": "页面底色",
        "default": "dark",
        "options": [
          {
            "value": "dark",
            "label": "深色",
            "image": "",
            "color": ""
          },
          {
            "value": "light",
            "label": "浅色",
            "image": "",
            "color": ""
          }
        ],
        "description": "整页深色或浅色底。",
        "publicKey": "tone",
        "publicLabel": "页面底色",
        "desc": "整页深色或浅色底。"
      },
      {
        "key": "imageCount",
        "type": "slider",
        "label": "影像数量",
        "default": 3,
        "min": 0,
        "max": 5,
        "step": 1,
        "description": "横排影像框数量（0 为留空提示态）。各框按数量均分宽度，图片在槽内裁切填满。",
        "publicKey": "imageCount",
        "publicLabel": "影像数量",
        "desc": "横排影像框数量（0 为留空提示态）。各框按数量均分宽度，图片在槽内裁切填满。"
      },
      {
        "key": "showCaptions",
        "type": "toggle",
        "label": "图注",
        "default": true,
        "description": "每帧下方的说明文字。",
        "publicKey": "showCaptions",
        "publicLabel": "图注",
        "desc": "每帧下方的说明文字。"
      },
      {
        "key": "showIndex",
        "type": "toggle",
        "label": "编号",
        "default": true,
        "description": "每帧下方的 01/02… 序号。",
        "publicKey": "showIndex",
        "publicLabel": "编号",
        "desc": "每帧下方的 01/02… 序号。"
      },
      {
        "key": "radius",
        "type": "slider",
        "label": "圆角",
        "default": 14,
        "min": 0,
        "max": 28,
        "step": 2,
        "unit": "px",
        "description": "影像框的圆角半径。",
        "publicKey": "radius",
        "publicLabel": "圆角",
        "desc": "影像框的圆角半径。"
      }
    ],
    "defaultProps": {
      "imageCount": 3,
      "showCaptions": true,
      "showIndex": true,
      "radius": 14,
      "idPrefix": "filmstrip",
      "tone": "dark"
    }
  },
  {
    "key": "theme10_page050",
    "themeKey": "theme10",
    "pageNumber": 50,
    "layout": "THEME10-050",
    "slot": "inset",
    "label": "满版角嵌",
    "bgClass": "",
    "controls": [
      {
        "key": "backgroundMode",
        "label": "背景替换",
        "type": "segment",
        "def": "unicorn",
        "options": [
          {
            "value": "unicorn",
            "label": "动态"
          },
          {
            "value": "media",
            "label": "上传"
          }
        ],
        "desc": "动态 shader 或自定义背景媒体",
        "publicKey": "backgroundMode",
        "publicLabel": "背景替换",
        "description": "动态 shader 或自定义背景媒体"
      },
      {
        "key": "unicornScene",
        "label": "动态场景",
        "type": "segment",
        "def": "goey",
        "options": [
          {
            "value": "tech",
            "label": "科技"
          },
          {
            "value": "automations",
            "label": "自动化"
          },
          {
            "value": "moving",
            "label": "流动"
          },
          {
            "value": "goey",
            "label": "黏球"
          }
        ],
        "dependsOn": "backgroundMode",
        "dependsOnValue": "unicorn",
        "desc": "选择固定 Unicorn shader 场景",
        "publicKey": "dynamicVisual",
        "publicLabel": "动态场景",
        "description": "选择固定 Unicorn shader 场景"
      },
      {
        "key": "textPos",
        "type": "radio",
        "label": "文字位置",
        "default": "bottom-left",
        "options": [
          {
            "value": "bottom-left",
            "label": "左下"
          },
          {
            "value": "top-left",
            "label": "左上"
          },
          {
            "value": "bottom-right",
            "label": "右下"
          }
        ],
        "description": "浮动文字锁的所在角；嵌图自动落在对角。",
        "publicKey": "textPos",
        "publicLabel": "文字位置",
        "desc": "浮动文字锁的所在角；嵌图自动落在对角。"
      },
      {
        "key": "scrim",
        "type": "slider",
        "label": "蒙版强度",
        "default": 58,
        "min": 30,
        "max": 80,
        "step": 2,
        "unit": "%",
        "description": "主图上方方向性暗角的强度。",
        "publicKey": "scrim",
        "publicLabel": "蒙版强度",
        "desc": "主图上方方向性暗角的强度。"
      },
      {
        "key": "showInset",
        "type": "toggle",
        "label": "角嵌图",
        "default": true,
        "description": "对角的小嵌图（随上传图片比例自适应）。",
        "publicKey": "showInset",
        "publicLabel": "角嵌图",
        "desc": "对角的小嵌图（随上传图片比例自适应）。"
      },
      {
        "key": "showNote",
        "type": "toggle",
        "label": "说明文字",
        "default": true,
        "description": "标题下方的说明句。",
        "publicKey": "showNote",
        "publicLabel": "说明文字",
        "desc": "标题下方的说明句。"
      }
    ],
    "defaultProps": {
      "textPos": "bottom-left",
      "scrim": 58,
      "showInset": true,
      "showNote": true,
      "backgroundMode": "unicorn",
      "unicornScene": "goey",
      "idPrefix": "inset"
    }
  },
  {
    "key": "theme10_page051",
    "themeKey": "theme10",
    "pageNumber": 51,
    "layout": "THEME10-051",
    "slot": "coverdawn",
    "label": "晨光卡",
    "bgClass": "",
    "controls": [
      {
        "key": "theme",
        "type": "select",
        "label": "渐变情绪",
        "default": "dawn",
        "options": [
          {
            "value": "dawn",
            "label": "晨曦"
          },
          {
            "value": "dusk",
            "label": "暮蓝"
          },
          {
            "value": "ember",
            "label": "余烬"
          }
        ],
        "description": "主卡片渐变的配色（仅在未启用照片时生效）。",
        "publicKey": "theme",
        "publicLabel": "渐变情绪",
        "desc": "主卡片渐变的配色（仅在未启用照片时生效）。"
      },
      {
        "key": "showImage",
        "type": "toggle",
        "label": "使用照片",
        "default": false,
        "description": "用上传照片替换主卡片的渐变（照片自适应填充）。",
        "publicKey": "showImage",
        "publicLabel": "使用照片",
        "desc": "用上传照片替换主卡片的渐变（照片自适应填充）。"
      },
      {
        "key": "rowCount",
        "type": "slider",
        "label": "配置项数量",
        "default": 4,
        "min": 0,
        "max": 4,
        "step": 1,
        "description": "底部配置明细的条目数量（0 时隐藏整条）。",
        "publicKey": "itemCount",
        "publicLabel": "配置项数量",
        "desc": "底部配置明细的条目数量（0 时隐藏整条）。"
      },
      {
        "key": "showFooter",
        "type": "toggle",
        "label": "页脚信息",
        "default": true,
        "description": "底部的页脚信息行。",
        "publicKey": "showFooter",
        "publicLabel": "页脚信息",
        "desc": "底部的页脚信息行。"
      }
    ],
    "defaultProps": {
      "theme": "dawn",
      "showImage": false,
      "rowCount": 4,
      "showFooter": true,
      "idPrefix": "coverdawn"
    }
  },
  {
    "key": "theme10_page052",
    "themeKey": "theme10",
    "pageNumber": 52,
    "layout": "THEME10-052",
    "slot": "sectionstatement",
    "label": "宣言章节",
    "bgClass": "",
    "controls": [
      {
        "key": "theme",
        "type": "select",
        "label": "背景主题",
        "default": "dusk",
        "options": [
          {
            "value": "dusk",
            "label": "暮光"
          },
          {
            "value": "midnight",
            "label": "午夜"
          },
          {
            "value": "graphite",
            "label": "石墨"
          },
          {
            "value": "dawn",
            "label": "晨光"
          },
          {
            "value": "vapor",
            "label": "雾光"
          },
          {
            "value": "paper",
            "label": "纸白"
          }
        ],
        "description": "分章页的背景渐变与配色基调。",
        "publicKey": "theme",
        "publicLabel": "背景主题",
        "desc": "分章页的背景渐变与配色基调。"
      },
      {
        "key": "align",
        "type": "radio",
        "label": "对齐",
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
        "description": "宣言文字的对齐方式。",
        "publicKey": "align",
        "publicLabel": "对齐",
        "desc": "宣言文字的对齐方式。"
      },
      {
        "key": "showIndex",
        "type": "toggle",
        "label": "章节标记",
        "default": true,
        "description": "右上角的「PART 编号 · 名称」标记。",
        "publicKey": "showIndex",
        "publicLabel": "章节标记",
        "desc": "右上角的「PART 编号 · 名称」标记。"
      },
      {
        "key": "showRule",
        "type": "toggle",
        "label": "强调横线",
        "default": false,
        "description": "宣言下方的强调色短横线。",
        "publicKey": "showRule",
        "publicLabel": "强调横线",
        "desc": "宣言下方的强调色短横线。"
      }
    ],
    "defaultProps": {
      "theme": "dusk",
      "align": "left",
      "showIndex": true,
      "showRule": false,
      "idPrefix": "sectionstatement"
    }
  },
  {
    "key": "theme10_page053",
    "themeKey": "theme10",
    "pageNumber": 53,
    "layout": "THEME10-053",
    "slot": "statement",
    "label": "声明金句",
    "bgClass": "",
    "controls": [
      {
        "key": "theme",
        "type": "select",
        "label": "背景主题",
        "default": "graphite",
        "options": [
          {
            "value": "graphite",
            "label": "石墨"
          },
          {
            "value": "midnight",
            "label": "午夜"
          },
          {
            "value": "dusk",
            "label": "暮光"
          },
          {
            "value": "dawn",
            "label": "晨光"
          },
          {
            "value": "vapor",
            "label": "雾光"
          },
          {
            "value": "paper",
            "label": "纸白"
          }
        ],
        "description": "整页背景渐变与配色基调。",
        "publicKey": "theme",
        "publicLabel": "背景主题",
        "desc": "整页背景渐变与配色基调。"
      },
      {
        "key": "mode",
        "type": "radio",
        "label": "版式模式",
        "default": "quote",
        "options": [
          {
            "value": "quote",
            "label": "金句"
          },
          {
            "value": "figure",
            "label": "大数字"
          }
        ],
        "description": "金句（强调一句话）或大数字（一个数字 + 说明）两种排版。",
        "publicKey": "mode",
        "publicLabel": "版式模式",
        "desc": "金句（强调一句话）或大数字（一个数字 + 说明）两种排版。"
      },
      {
        "key": "align",
        "type": "radio",
        "label": "对齐",
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
        "description": "整体内容的对齐方式。",
        "publicKey": "align",
        "publicLabel": "对齐",
        "desc": "整体内容的对齐方式。"
      },
      {
        "key": "accent",
        "type": "toggle",
        "label": "关键词强调",
        "default": true,
        "description": "将关键词 / 数字以强调色突出显示。",
        "publicKey": "accent",
        "publicLabel": "关键词强调",
        "desc": "将关键词 / 数字以强调色突出显示。"
      },
      {
        "key": "showMeta",
        "type": "toggle",
        "label": "署名出处",
        "default": true,
        "description": "底部的署名或出处行。",
        "publicKey": "showMeta",
        "publicLabel": "署名出处",
        "desc": "底部的署名或出处行。"
      }
    ],
    "defaultProps": {
      "theme": "graphite",
      "mode": "quote",
      "align": "left",
      "accent": true,
      "showMeta": true,
      "idPrefix": "statement"
    }
  },
  {
    "key": "theme10_page054",
    "themeKey": "theme10",
    "pageNumber": 54,
    "layout": "THEME10-054",
    "slot": "gallery2",
    "label": "影像集",
    "bgClass": "",
    "controls": [
      {
        "key": "tone",
        "type": "radio",
        "label": "页面底色",
        "default": "dark",
        "options": [
          {
            "value": "dark",
            "label": "深色",
            "image": "",
            "color": ""
          },
          {
            "value": "light",
            "label": "浅色",
            "image": "",
            "color": ""
          }
        ],
        "description": "整页深色或浅色底。",
        "publicKey": "tone",
        "publicLabel": "页面底色",
        "desc": "整页深色或浅色底。"
      },
      {
        "key": "imageCount",
        "type": "slider",
        "label": "图片数量",
        "default": 3,
        "min": 0,
        "max": 6,
        "step": 1,
        "description": "图片槽位的数量（0 即纯文字版式）；每个槽位自适应所传图片的比例。",
        "publicKey": "imageCount",
        "publicLabel": "图片数量",
        "desc": "图片槽位的数量（0 即纯文字版式）；每个槽位自适应所传图片的比例。"
      },
      {
        "key": "layout",
        "type": "select",
        "display": "select",
        "label": "构图方式",
        "default": "grid",
        "options": [
          {
            "value": "justified",
            "label": "等高排版（保留原比例）"
          },
          {
            "value": "grid",
            "label": "网格（统一裁切）"
          },
          {
            "value": "feature",
            "label": "主次（大图 + 缩略列）"
          }
        ],
        "description": "多图的排布策略，适配不同数量与比例。",
        "publicKey": "layout",
        "publicLabel": "构图方式",
        "desc": "多图的排布策略，适配不同数量与比例。"
      },
      {
        "key": "showCaption",
        "type": "toggle",
        "label": "装饰说明",
        "default": true,
        "description": "标题下方的辅助说明文案。",
        "publicKey": "showCaption",
        "publicLabel": "装饰说明",
        "desc": "标题下方的辅助说明文案。"
      }
    ],
    "defaultProps": {
      "imageCount": 3,
      "layout": "grid",
      "showCaption": true,
      "idPrefix": "gallery2",
      "tone": "dark"
    }
  },
  {
    "key": "theme10_page055",
    "themeKey": "theme10",
    "pageNumber": 55,
    "layout": "THEME10-055",
    "slot": "faq",
    "label": "常见问题",
    "bgClass": "",
    "controls": [
      {
        "key": "tone",
        "type": "radio",
        "label": "页面底色",
        "default": "light",
        "options": [
          {
            "value": "dark",
            "label": "深色",
            "image": "",
            "color": ""
          },
          {
            "value": "light",
            "label": "浅色",
            "image": "",
            "color": ""
          }
        ],
        "description": "整页深色或浅色底。",
        "publicKey": "tone",
        "publicLabel": "页面底色",
        "desc": "整页深色或浅色底。"
      },
      {
        "key": "itemCount",
        "type": "slider",
        "label": "问题数量",
        "default": 4,
        "min": 3,
        "max": 6,
        "step": 1,
        "description": "展示的问答行数（同时驱动左侧计数器）。",
        "publicKey": "itemCount",
        "publicLabel": "问题数量",
        "desc": "展示的问答行数（同时驱动左侧计数器）。"
      },
      {
        "key": "focus",
        "type": "toggle",
        "label": "重点聚焦",
        "default": false,
        "description": "高亮某一行问答，其余弱化。",
        "publicKey": "focus",
        "publicLabel": "重点聚焦",
        "desc": "高亮某一行问答，其余弱化。"
      },
      {
        "key": "focusIndex",
        "type": "slider",
        "label": "聚焦第几项",
        "default": 1,
        "min": 1,
        "max": 6,
        "step": 1,
        "description": "需开启「重点聚焦」后生效。",
        "publicKey": "focusIndex",
        "publicLabel": "聚焦第几项",
        "desc": "需开启「重点聚焦」后生效。"
      },
      {
        "key": "showIndex",
        "type": "toggle",
        "label": "问题编号",
        "default": true,
        "description": "每个问题前的 Q01 / Q02 大号编号。",
        "publicKey": "showIndex",
        "publicLabel": "问题编号",
        "desc": "每个问题前的 Q01 / Q02 大号编号。"
      }
    ],
    "defaultProps": {
      "itemCount": 4,
      "focus": false,
      "focusIndex": 1,
      "showIndex": true,
      "idPrefix": "faq",
      "tone": "light"
    }
  },
  {
    "key": "theme10_page056",
    "themeKey": "theme10",
    "pageNumber": 56,
    "layout": "THEME10-056",
    "slot": "bigstat",
    "label": "大字指标",
    "bgClass": "",
    "controls": [
      {
        "key": "theme",
        "type": "select",
        "label": "背景主题",
        "default": "paper",
        "options": [
          {
            "value": "dusk",
            "label": "暮光"
          },
          {
            "value": "midnight",
            "label": "午夜"
          },
          {
            "value": "graphite",
            "label": "石墨"
          },
          {
            "value": "dawn",
            "label": "晨光"
          },
          {
            "value": "paper",
            "label": "纸白"
          }
        ],
        "description": "背景渐变（纸白最贴近参考图）。",
        "publicKey": "theme",
        "publicLabel": "背景主题",
        "desc": "背景渐变（纸白最贴近参考图）。"
      },
      {
        "key": "showDelta",
        "type": "toggle",
        "label": "变化标记",
        "default": true,
        "description": "右下的同比/环比变化标记。",
        "publicKey": "showDelta",
        "publicLabel": "变化标记",
        "desc": "右下的同比/环比变化标记。"
      },
      {
        "key": "showStats",
        "type": "toggle",
        "label": "底部数据行",
        "default": true,
        "description": "底部一行小型指标（标签在上、数字在下）。",
        "publicKey": "showStats",
        "publicLabel": "底部数据行",
        "desc": "底部一行小型指标（标签在上、数字在下）。"
      },
      {
        "key": "showAction",
        "type": "toggle",
        "label": "右下环形按钮",
        "default": true,
        "description": "参考图的标志性圆形箭头＋说明。",
        "publicKey": "showAction",
        "publicLabel": "右下环形按钮",
        "desc": "参考图的标志性圆形箭头＋说明。"
      }
    ],
    "defaultProps": {
      "theme": "paper",
      "showDelta": true,
      "showStats": true,
      "showAction": true,
      "idPrefix": "bigstat"
    }
  },
  {
    "key": "theme10_page057",
    "themeKey": "theme10",
    "pageNumber": 57,
    "layout": "THEME10-057",
    "slot": "megafigure",
    "label": "巨幅数字",
    "bgClass": "",
    "controls": [
      {
        "key": "theme",
        "type": "select",
        "label": "背景主题",
        "default": "dusk",
        "options": [
          {
            "value": "dusk",
            "label": "暮蓝"
          },
          {
            "value": "midnight",
            "label": "午夜"
          },
          {
            "value": "graphite",
            "label": "石墨"
          },
          {
            "value": "dawn",
            "label": "晨曦"
          },
          {
            "value": "vapor",
            "label": "雾光"
          },
          {
            "value": "paper",
            "label": "纸白"
          }
        ],
        "description": "整页背景渐变情绪（来自 DECK_THEMES）。",
        "publicKey": "theme",
        "publicLabel": "背景主题",
        "desc": "整页背景渐变情绪（来自 DECK_THEMES）。"
      },
      {
        "key": "align",
        "type": "radio",
        "label": "对齐",
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
        "description": "整体内容的水平对齐。",
        "publicKey": "align",
        "publicLabel": "对齐",
        "desc": "整体内容的水平对齐。"
      },
      {
        "key": "showRule",
        "type": "toggle",
        "label": "竖向标尺",
        "default": true,
        "description": "巨幅数字旁的竖向强调标尺。",
        "publicKey": "showRule",
        "publicLabel": "竖向标尺",
        "desc": "巨幅数字旁的竖向强调标尺。"
      },
      {
        "key": "showStats",
        "type": "toggle",
        "label": "支撑数据",
        "default": true,
        "description": "底部一排支撑性指标。",
        "publicKey": "showStats",
        "publicLabel": "支撑数据",
        "desc": "底部一排支撑性指标。"
      },
      {
        "key": "statCount",
        "type": "slider",
        "label": "支撑数据数量",
        "default": 3,
        "min": 0,
        "max": 3,
        "step": 1,
        "description": "底部支撑指标的数量（需开启「支撑数据」）。",
        "publicKey": "statCount",
        "publicLabel": "支撑数据数量",
        "desc": "底部支撑指标的数量（需开启「支撑数据」）。"
      }
    ],
    "defaultProps": {
      "theme": "dusk",
      "align": "left",
      "showRule": true,
      "showStats": true,
      "statCount": 3,
      "idPrefix": "megafigure"
    }
  },
  {
    "key": "theme10_page058",
    "themeKey": "theme10",
    "pageNumber": 58,
    "layout": "THEME10-058",
    "slot": "scatter",
    "label": "风险气泡",
    "bgClass": "",
    "controls": [
      {
        "key": "tone",
        "type": "radio",
        "label": "页面底色",
        "default": "dark",
        "options": [
          {
            "value": "dark",
            "label": "深色",
            "image": "",
            "color": ""
          },
          {
            "value": "light",
            "label": "浅色",
            "image": "",
            "color": ""
          }
        ],
        "description": "整页深色或浅色底。",
        "publicKey": "tone",
        "publicLabel": "页面底色",
        "desc": "整页深色或浅色底。"
      },
      {
        "key": "pointCount",
        "type": "slider",
        "label": "气泡数量",
        "default": 6,
        "min": 3,
        "max": 7,
        "step": 1,
        "description": "参与绘制的条目气泡数量。",
        "publicKey": "itemCount",
        "publicLabel": "气泡数量",
        "desc": "参与绘制的条目气泡数量。"
      },
      {
        "key": "showGrid",
        "type": "toggle",
        "label": "背景网格",
        "default": true,
        "description": "坐标平面的辅助网格线。",
        "publicKey": "showGrid",
        "publicLabel": "背景网格",
        "desc": "坐标平面的辅助网格线。"
      },
      {
        "key": "showMean",
        "type": "toggle",
        "label": "均值十字线",
        "default": true,
        "description": "在数据均值处绘制十字参考线。",
        "publicKey": "showMean",
        "publicLabel": "均值十字线",
        "desc": "在数据均值处绘制十字参考线。"
      },
      {
        "key": "bubbleScale",
        "type": "slider",
        "label": "气泡大小",
        "default": 100,
        "min": 60,
        "max": 160,
        "step": 1,
        "unit": "%",
        "description": "所有气泡半径的统一缩放倍数。",
        "publicKey": "bubbleScale",
        "publicLabel": "气泡大小",
        "desc": "所有气泡半径的统一缩放倍数。"
      },
      {
        "key": "focus",
        "type": "toggle",
        "label": "重点聚焦",
        "default": false,
        "description": "高亮某一气泡，其余弱化。",
        "publicKey": "focus",
        "publicLabel": "重点聚焦",
        "desc": "高亮某一气泡，其余弱化。"
      },
      {
        "key": "focusIndex",
        "type": "slider",
        "label": "聚焦第几项",
        "default": 1,
        "min": 1,
        "max": 7,
        "step": 1,
        "description": "需开启「重点聚焦」后生效。",
        "publicKey": "focusIndex",
        "publicLabel": "聚焦第几项",
        "desc": "需开启「重点聚焦」后生效。"
      }
    ],
    "defaultProps": {
      "pointCount": 6,
      "showGrid": true,
      "showMean": true,
      "bubbleScale": 100,
      "focus": false,
      "focusIndex": 1,
      "idPrefix": "scatter",
      "tone": "dark"
    }
  },
  {
    "key": "theme10_page059",
    "themeKey": "theme10",
    "pageNumber": 59,
    "layout": "THEME10-059",
    "slot": "diverging",
    "label": "年度盈亏",
    "bgClass": "",
    "controls": [
      {
        "key": "tone",
        "type": "radio",
        "label": "页面底色",
        "default": "dark",
        "options": [
          {
            "value": "dark",
            "label": "深色",
            "image": "",
            "color": ""
          },
          {
            "value": "light",
            "label": "浅色",
            "image": "",
            "color": ""
          }
        ],
        "description": "整页深色或浅色底。",
        "publicKey": "tone",
        "publicLabel": "页面底色",
        "desc": "整页深色或浅色底。"
      },
      {
        "key": "barCount",
        "type": "slider",
        "label": "周期数量",
        "default": 8,
        "min": 4,
        "max": 10,
        "step": 1,
        "description": "展示的年份 / 周期数量。",
        "publicKey": "barCount",
        "publicLabel": "周期数量",
        "desc": "展示的年份 / 周期数量。"
      },
      {
        "key": "showValues",
        "type": "toggle",
        "label": "数值标签",
        "default": true,
        "description": "每根柱体端部的盈亏数值。",
        "publicKey": "showValueLabels",
        "publicLabel": "数值标签",
        "desc": "每根柱体端部的盈亏数值。"
      },
      {
        "key": "showAvg",
        "type": "toggle",
        "label": "均值线",
        "default": false,
        "description": "跨周期的平均值虚线。",
        "publicKey": "showAvg",
        "publicLabel": "均值线",
        "desc": "跨周期的平均值虚线。"
      },
      {
        "key": "showAxis",
        "type": "toggle",
        "label": "零轴",
        "default": true,
        "description": "中间的零值基准线。",
        "publicKey": "showAxis",
        "publicLabel": "零轴",
        "desc": "中间的零值基准线。"
      },
      {
        "key": "focus",
        "type": "toggle",
        "label": "重点聚焦",
        "default": false,
        "description": "高亮某一根柱体，其余弱化。",
        "publicKey": "focus",
        "publicLabel": "重点聚焦",
        "desc": "高亮某一根柱体，其余弱化。"
      },
      {
        "key": "focusIndex",
        "type": "slider",
        "label": "聚焦第几项",
        "default": 1,
        "min": 1,
        "max": 10,
        "step": 1,
        "description": "需开启「重点聚焦」后生效。",
        "publicKey": "focusIndex",
        "publicLabel": "聚焦第几项",
        "desc": "需开启「重点聚焦」后生效。"
      }
    ],
    "defaultProps": {
      "barCount": 8,
      "showValues": true,
      "showAvg": false,
      "showAxis": true,
      "focus": false,
      "focusIndex": 1,
      "idPrefix": "diverging",
      "tone": "dark"
    }
  },
  {
    "key": "theme10_page060",
    "themeKey": "theme10",
    "pageNumber": 60,
    "layout": "THEME10-060",
    "slot": "range",
    "label": "区间对比",
    "bgClass": "",
    "controls": [
      {
        "key": "tone",
        "type": "radio",
        "label": "页面底色",
        "default": "dark",
        "options": [
          {
            "value": "dark",
            "label": "深色",
            "image": "",
            "color": ""
          },
          {
            "value": "light",
            "label": "浅色",
            "image": "",
            "color": ""
          }
        ],
        "description": "整页深色或浅色底。",
        "publicKey": "tone",
        "publicLabel": "页面底色",
        "desc": "整页深色或浅色底。"
      },
      {
        "key": "rowCount",
        "type": "slider",
        "label": "类别行数",
        "default": 5,
        "min": 3,
        "max": 7,
        "step": 1,
        "description": "展示的资产类别行数。",
        "publicKey": "rowCount",
        "publicLabel": "类别行数",
        "desc": "展示的资产类别行数。"
      },
      {
        "key": "showExpect",
        "type": "toggle",
        "label": "预期值",
        "default": true,
        "description": "区间轨道上的预期 / 典型值标记。",
        "publicKey": "showExpect",
        "publicLabel": "预期值",
        "desc": "区间轨道上的预期 / 典型值标记。"
      },
      {
        "key": "showEnds",
        "type": "toggle",
        "label": "端点数值",
        "default": true,
        "description": "区间两端的最低 / 最高数值。",
        "publicKey": "showValueLabels",
        "publicLabel": "端点数值",
        "desc": "区间两端的最低 / 最高数值。"
      },
      {
        "key": "showScale",
        "type": "toggle",
        "label": "刻度轴",
        "default": true,
        "description": "底部的刻度参考。",
        "publicKey": "showScale",
        "publicLabel": "刻度轴",
        "desc": "底部的刻度参考。"
      },
      {
        "key": "focus",
        "type": "toggle",
        "label": "重点聚焦",
        "default": false,
        "description": "高亮某一行，其余弱化。",
        "publicKey": "focus",
        "publicLabel": "重点聚焦",
        "desc": "高亮某一行，其余弱化。"
      },
      {
        "key": "focusIndex",
        "type": "slider",
        "label": "聚焦第几项",
        "default": 1,
        "min": 1,
        "max": 7,
        "step": 1,
        "description": "需开启「重点聚焦」后生效。",
        "publicKey": "focusIndex",
        "publicLabel": "聚焦第几项",
        "desc": "需开启「重点聚焦」后生效。"
      }
    ],
    "defaultProps": {
      "rowCount": 5,
      "showExpect": true,
      "showEnds": true,
      "showScale": true,
      "focus": false,
      "focusIndex": 1,
      "idPrefix": "range",
      "tone": "dark"
    }
  },
  {
    "key": "theme10_page061",
    "themeKey": "theme10",
    "pageNumber": 61,
    "layout": "THEME10-061",
    "slot": "polar",
    "label": "极坐标花瓣",
    "bgClass": "",
    "controls": [
      {
        "key": "tone",
        "type": "radio",
        "label": "页面底色",
        "default": "dark",
        "options": [
          {
            "value": "dark",
            "label": "深色",
            "image": "",
            "color": ""
          },
          {
            "value": "light",
            "label": "浅色",
            "image": "",
            "color": ""
          }
        ],
        "description": "整页深色或浅色底。",
        "publicKey": "tone",
        "publicLabel": "页面底色",
        "desc": "整页深色或浅色底。"
      },
      {
        "key": "layout",
        "type": "radio",
        "label": "布局",
        "default": "top",
        "options": [
          {
            "value": "top",
            "label": "上下"
          },
          {
            "value": "side",
            "label": "左右"
          }
        ],
        "description": "标题与图表的排布：上下堆叠或左右分栏。",
        "publicKey": "layout",
        "publicLabel": "布局",
        "desc": "标题与图表的排布：上下堆叠或左右分栏。"
      },
      {
        "key": "wedgeCount",
        "type": "slider",
        "label": "花瓣数量",
        "default": 6,
        "min": 4,
        "max": 8,
        "step": 1,
        "description": "维度（花瓣）数量。",
        "publicKey": "wedgeCount",
        "publicLabel": "花瓣数量",
        "desc": "维度（花瓣）数量。"
      },
      {
        "key": "showRings",
        "type": "toggle",
        "label": "刻度环",
        "default": true,
        "description": "径向的刻度参考环。",
        "publicKey": "showRings",
        "publicLabel": "刻度环",
        "desc": "径向的刻度参考环。"
      },
      {
        "key": "showLabels",
        "type": "toggle",
        "label": "维度标签",
        "default": true,
        "description": "外圈的维度名称。",
        "publicKey": "showLabels",
        "publicLabel": "维度标签",
        "desc": "外圈的维度名称。"
      },
      {
        "key": "showValues",
        "type": "toggle",
        "label": "数值",
        "default": true,
        "description": "每个维度的数值。",
        "publicKey": "showValueLabels",
        "publicLabel": "数值",
        "desc": "每个维度的数值。"
      },
      {
        "key": "focus",
        "type": "toggle",
        "label": "重点聚焦",
        "default": false,
        "description": "高亮某一花瓣，其余弱化。",
        "publicKey": "focus",
        "publicLabel": "重点聚焦",
        "desc": "高亮某一花瓣，其余弱化。"
      },
      {
        "key": "focusIndex",
        "type": "slider",
        "label": "聚焦第几项",
        "default": 1,
        "min": 1,
        "max": 8,
        "step": 1,
        "description": "需开启「重点聚焦」后生效。",
        "publicKey": "focusIndex",
        "publicLabel": "聚焦第几项",
        "desc": "需开启「重点聚焦」后生效。"
      }
    ],
    "defaultProps": {
      "wedgeCount": 6,
      "showRings": true,
      "showLabels": true,
      "showValues": true,
      "focus": false,
      "focusIndex": 1,
      "layout": "top",
      "idPrefix": "polar",
      "tone": "dark"
    }
  },
  {
    "key": "theme10_page062",
    "themeKey": "theme10",
    "pageNumber": 62,
    "layout": "THEME10-062",
    "slot": "heatmap",
    "label": "相关性热力",
    "bgClass": "",
    "controls": [
      {
        "key": "tone",
        "type": "radio",
        "label": "页面底色",
        "default": "light",
        "options": [
          {
            "value": "dark",
            "label": "深色",
            "image": "",
            "color": ""
          },
          {
            "value": "light",
            "label": "浅色",
            "image": "",
            "color": ""
          }
        ],
        "description": "整页深色或浅色底。",
        "publicKey": "tone",
        "publicLabel": "页面底色",
        "desc": "整页深色或浅色底。"
      },
      {
        "key": "assetCount",
        "type": "slider",
        "label": "资产数量",
        "default": 6,
        "min": 4,
        "max": 7,
        "step": 1,
        "description": "矩阵维度 N（行列同时变化）。",
        "publicKey": "categoryCount",
        "publicLabel": "资产数量",
        "desc": "矩阵维度 N（行列同时变化）。"
      },
      {
        "key": "showValues",
        "type": "toggle",
        "label": "显示数值",
        "default": true,
        "description": "在每个格子里打印相关系数。",
        "publicKey": "showValueLabels",
        "publicLabel": "显示数值",
        "desc": "在每个格子里打印相关系数。"
      },
      {
        "key": "showLegend",
        "type": "toggle",
        "label": "色阶图例",
        "default": true,
        "description": "右侧 −1…+1 的颜色图例。",
        "publicKey": "showLegend",
        "publicLabel": "色阶图例",
        "desc": "右侧 −1…+1 的颜色图例。"
      },
      {
        "key": "focusRow",
        "type": "toggle",
        "label": "聚焦一行",
        "default": false,
        "description": "高亮某一资产的整行与整列。",
        "publicKey": "focusRow",
        "publicLabel": "聚焦一行",
        "desc": "高亮某一资产的整行与整列。"
      },
      {
        "key": "focusIndex",
        "type": "slider",
        "label": "聚焦第几项",
        "default": 1,
        "min": 1,
        "max": 7,
        "step": 1,
        "description": "需开启「聚焦一行」后生效。",
        "publicKey": "focusIndex",
        "publicLabel": "聚焦第几项",
        "desc": "需开启「聚焦一行」后生效。"
      }
    ],
    "defaultProps": {
      "assetCount": 6,
      "showValues": true,
      "showLegend": true,
      "focusRow": false,
      "focusIndex": 1,
      "idPrefix": "heatmap",
      "tone": "light"
    }
  },
  {
    "key": "theme10_page063",
    "themeKey": "theme10",
    "pageNumber": 63,
    "layout": "THEME10-063",
    "slot": "radar",
    "label": "因子雷达",
    "bgClass": "",
    "controls": [
      {
        "key": "tone",
        "type": "radio",
        "label": "页面底色",
        "default": "light",
        "options": [
          {
            "value": "dark",
            "label": "深色",
            "image": "",
            "color": ""
          },
          {
            "value": "light",
            "label": "浅色",
            "image": "",
            "color": ""
          }
        ],
        "description": "整页深色或浅色底。",
        "publicKey": "tone",
        "publicLabel": "页面底色",
        "desc": "整页深色或浅色底。"
      },
      {
        "key": "axisCount",
        "type": "slider",
        "label": "维度轴数",
        "default": 6,
        "min": 4,
        "max": 8,
        "step": 1,
        "description": "雷达图的因子轴数量。",
        "publicKey": "axisCount",
        "publicLabel": "维度轴数",
        "desc": "雷达图的因子轴数量。"
      },
      {
        "key": "showCompare",
        "type": "toggle",
        "label": "对比序列",
        "default": true,
        "description": "叠加第二条（基准）虚线多边形。",
        "publicKey": "showCompare",
        "publicLabel": "对比序列",
        "desc": "叠加第二条（基准）虚线多边形。"
      },
      {
        "key": "showGrid",
        "type": "toggle",
        "label": "极坐标网格",
        "default": true,
        "description": "同心环与放射状轴线。",
        "publicKey": "showGrid",
        "publicLabel": "极坐标网格",
        "desc": "同心环与放射状轴线。"
      },
      {
        "key": "fillArea",
        "type": "toggle",
        "label": "填充面积",
        "default": true,
        "description": "主多边形是否填充半透明色块。",
        "publicKey": "fillArea",
        "publicLabel": "填充面积",
        "desc": "主多边形是否填充半透明色块。"
      },
      {
        "key": "showScores",
        "type": "toggle",
        "label": "轴上评分",
        "default": true,
        "description": "在每个轴标签旁显示分值。",
        "publicKey": "showScores",
        "publicLabel": "轴上评分",
        "desc": "在每个轴标签旁显示分值。"
      }
    ],
    "defaultProps": {
      "axisCount": 6,
      "showCompare": true,
      "showGrid": true,
      "fillArea": true,
      "showScores": true,
      "idPrefix": "radar",
      "tone": "light"
    }
  },
  {
    "key": "theme10_page064",
    "themeKey": "theme10",
    "pageNumber": 64,
    "layout": "THEME10-064",
    "slot": "cartogram",
    "label": "区域敞口",
    "bgClass": "",
    "controls": [
      {
        "key": "tone",
        "type": "radio",
        "label": "页面底色",
        "default": "light",
        "options": [
          {
            "value": "dark",
            "label": "深色",
            "image": "",
            "color": ""
          },
          {
            "value": "light",
            "label": "浅色",
            "image": "",
            "color": ""
          }
        ],
        "description": "整页深色或浅色底。",
        "publicKey": "tone",
        "publicLabel": "页面底色",
        "desc": "整页深色或浅色底。"
      },
      {
        "key": "regionCount",
        "type": "slider",
        "label": "区域数量",
        "default": 8,
        "min": 4,
        "max": 10,
        "step": 1,
        "description": "展示的区域方块数量。",
        "publicKey": "regionCount",
        "publicLabel": "区域数量",
        "desc": "展示的区域方块数量。"
      },
      {
        "key": "showValues",
        "type": "toggle",
        "label": "数值",
        "default": true,
        "description": "每个区域方块上的敞口百分比。",
        "publicKey": "showValueLabels",
        "publicLabel": "数值",
        "desc": "每个区域方块上的敞口百分比。"
      },
      {
        "key": "showLegend",
        "type": "toggle",
        "label": "强度图例",
        "default": true,
        "description": "右下角的强度渐变图例。",
        "publicKey": "showLegend",
        "publicLabel": "强度图例",
        "desc": "右下角的强度渐变图例。"
      },
      {
        "key": "showName",
        "type": "toggle",
        "label": "区域名称",
        "default": true,
        "description": "方块底部的中文区域名（关闭则仅显示代码）。",
        "publicKey": "showName",
        "publicLabel": "区域名称",
        "desc": "方块底部的中文区域名（关闭则仅显示代码）。"
      },
      {
        "key": "focus",
        "type": "toggle",
        "label": "重点聚焦",
        "default": false,
        "description": "高亮某一区域，其余弱化。",
        "publicKey": "focus",
        "publicLabel": "重点聚焦",
        "desc": "高亮某一区域，其余弱化。"
      },
      {
        "key": "focusIndex",
        "type": "slider",
        "label": "聚焦第几项",
        "default": 1,
        "min": 1,
        "max": 10,
        "step": 1,
        "description": "需开启「重点聚焦」后生效。",
        "publicKey": "focusIndex",
        "publicLabel": "聚焦第几项",
        "desc": "需开启「重点聚焦」后生效。"
      }
    ],
    "defaultProps": {
      "regionCount": 8,
      "showValues": true,
      "showLegend": true,
      "showName": true,
      "focus": false,
      "focusIndex": 1,
      "idPrefix": "cartogram",
      "tone": "light"
    }
  },
  {
    "key": "theme10_page065",
    "themeKey": "theme10",
    "pageNumber": 65,
    "layout": "THEME10-065",
    "slot": "board",
    "label": "行情板",
    "bgClass": "",
    "controls": [
      {
        "key": "tone",
        "type": "radio",
        "label": "页面底色",
        "default": "light",
        "options": [
          {
            "value": "dark",
            "label": "深色",
            "image": "",
            "color": ""
          },
          {
            "value": "light",
            "label": "浅色",
            "image": "",
            "color": ""
          }
        ],
        "description": "整页深色或浅色底。",
        "publicKey": "tone",
        "publicLabel": "页面底色",
        "desc": "整页深色或浅色底。"
      },
      {
        "key": "tileCount",
        "type": "slider",
        "label": "行情块数量",
        "default": 6,
        "min": 3,
        "max": 8,
        "step": 1,
        "description": "行情板上的报价块数量。",
        "publicKey": "tileCount",
        "publicLabel": "行情块数量",
        "desc": "行情板上的报价块数量。"
      },
      {
        "key": "columns",
        "type": "slider",
        "label": "每行列数",
        "default": 3,
        "min": 2,
        "max": 4,
        "step": 1,
        "description": "网格的列数。",
        "publicKey": "columns",
        "publicLabel": "每行列数",
        "desc": "网格的列数。"
      },
      {
        "key": "showSpark",
        "type": "toggle",
        "label": "迷你走势线",
        "default": true,
        "description": "每个报价值下方的极简走势线。",
        "publicKey": "showSpark",
        "publicLabel": "迷你走势线",
        "desc": "每个报价值下方的极简走势线。"
      },
      {
        "key": "colorSign",
        "type": "toggle",
        "label": "涨跌着色",
        "default": true,
        "description": "按方向给涨跌幅着色（升=蓝，降=灰）。",
        "publicKey": "colorSign",
        "publicLabel": "涨跌着色",
        "desc": "按方向给涨跌幅着色（升=蓝，降=灰）。"
      },
      {
        "key": "focus",
        "type": "toggle",
        "label": "重点聚焦",
        "default": true,
        "description": "高亮某一报价块，其余弱化。",
        "publicKey": "focus",
        "publicLabel": "重点聚焦",
        "desc": "高亮某一报价块，其余弱化。"
      },
      {
        "key": "focusIndex",
        "type": "slider",
        "label": "聚焦第几项",
        "default": 1,
        "min": 1,
        "max": 8,
        "step": 1,
        "description": "需开启「重点聚焦」后生效。",
        "publicKey": "focusIndex",
        "publicLabel": "聚焦第几项",
        "desc": "需开启「重点聚焦」后生效。"
      }
    ],
    "defaultProps": {
      "tileCount": 6,
      "columns": 3,
      "showSpark": true,
      "colorSign": true,
      "focus": true,
      "focusIndex": 1,
      "idPrefix": "board",
      "tone": "light"
    }
  },
  {
    "key": "theme10_page066",
    "themeKey": "theme10",
    "pageNumber": 66,
    "layout": "THEME10-066",
    "slot": "ranking",
    "label": "排行榜",
    "bgClass": "",
    "controls": [
      {
        "key": "tone",
        "type": "radio",
        "label": "页面底色",
        "default": "light",
        "options": [
          {
            "value": "dark",
            "label": "深色",
            "image": "",
            "color": ""
          },
          {
            "value": "light",
            "label": "浅色",
            "image": "",
            "color": ""
          }
        ],
        "description": "整页深色或浅色底。",
        "publicKey": "tone",
        "publicLabel": "页面底色",
        "desc": "整页深色或浅色底。"
      },
      {
        "key": "rowCount",
        "type": "slider",
        "label": "榜单行数",
        "default": 6,
        "min": 4,
        "max": 8,
        "step": 1,
        "description": "排行榜显示的条目数量。",
        "publicKey": "itemCount",
        "publicLabel": "榜单行数",
        "desc": "排行榜显示的条目数量。"
      },
      {
        "key": "showBar",
        "type": "toggle",
        "label": "贡献条",
        "default": true,
        "description": "每行内联的贡献度条形图。",
        "publicKey": "showBar",
        "publicLabel": "贡献条",
        "desc": "每行内联的贡献度条形图。"
      },
      {
        "key": "showDelta",
        "type": "toggle",
        "label": "变化列",
        "default": true,
        "description": "右侧的同比增减列。",
        "publicKey": "showDelta",
        "publicLabel": "变化列",
        "desc": "右侧的同比增减列。"
      },
      {
        "key": "showHighlight",
        "type": "toggle",
        "label": "榜首高亮",
        "default": true,
        "description": "将某一名次抬起到强调底板上。",
        "publicKey": "showHighlight",
        "publicLabel": "榜首高亮",
        "desc": "将某一名次抬起到强调底板上。"
      },
      {
        "key": "highlightIndex",
        "type": "slider",
        "label": "高亮第几名",
        "default": 1,
        "min": 1,
        "max": 8,
        "step": 1,
        "description": "需开启「榜首高亮」后生效，上限随行数变化。",
        "publicKey": "highlightIndex",
        "publicLabel": "高亮第几名",
        "desc": "需开启「榜首高亮」后生效，上限随行数变化。"
      }
    ],
    "defaultProps": {
      "rowCount": 6,
      "showBar": true,
      "showDelta": true,
      "highlightIndex": 1,
      "showHighlight": true,
      "idPrefix": "ranking",
      "tone": "light"
    }
  },
  {
    "key": "theme10_page067",
    "themeKey": "theme10",
    "pageNumber": 67,
    "layout": "THEME10-067",
    "slot": "flow",
    "label": "资金流向",
    "bgClass": "",
    "controls": [
      {
        "key": "tone",
        "type": "radio",
        "label": "页面底色",
        "default": "dark",
        "options": [
          {
            "value": "dark",
            "label": "深色",
            "image": "",
            "color": ""
          },
          {
            "value": "light",
            "label": "浅色",
            "image": "",
            "color": ""
          }
        ],
        "description": "整页深色或浅色底。",
        "publicKey": "tone",
        "publicLabel": "页面底色",
        "desc": "整页深色或浅色底。"
      },
      {
        "key": "streamCount",
        "type": "slider",
        "label": "流向数量",
        "default": 5,
        "min": 3,
        "max": 6,
        "step": 1,
        "description": "从资金源分出的去向流数量。",
        "publicKey": "streamCount",
        "publicLabel": "流向数量",
        "desc": "从资金源分出的去向流数量。"
      },
      {
        "key": "showPercent",
        "type": "toggle",
        "label": "占比标签",
        "default": true,
        "description": "每条流向上的百分比标签。",
        "publicKey": "showPercent",
        "publicLabel": "占比标签",
        "desc": "每条流向上的百分比标签。"
      },
      {
        "key": "showSource",
        "type": "toggle",
        "label": "资金源面板",
        "default": true,
        "description": "左侧的资金总额来源条。",
        "publicKey": "showSource",
        "publicLabel": "资金源面板",
        "desc": "左侧的资金总额来源条。"
      },
      {
        "key": "curveAmt",
        "type": "slider",
        "label": "曲线弯度",
        "default": 70,
        "min": 0,
        "max": 100,
        "step": 1,
        "unit": "%",
        "description": "流带的弯曲程度，0 为直线。",
        "publicKey": "curveAmt",
        "publicLabel": "曲线弯度",
        "desc": "流带的弯曲程度，0 为直线。"
      },
      {
        "key": "focus",
        "type": "toggle",
        "label": "重点聚焦",
        "default": false,
        "description": "高亮某一条流向，其余弱化。",
        "publicKey": "focus",
        "publicLabel": "重点聚焦",
        "desc": "高亮某一条流向，其余弱化。"
      },
      {
        "key": "focusIndex",
        "type": "slider",
        "label": "聚焦第几项",
        "default": 1,
        "min": 1,
        "max": 6,
        "step": 1,
        "description": "需开启「重点聚焦」后生效。",
        "publicKey": "focusIndex",
        "publicLabel": "聚焦第几项",
        "desc": "需开启「重点聚焦」后生效。"
      }
    ],
    "defaultProps": {
      "streamCount": 5,
      "showPercent": true,
      "showSource": true,
      "curveAmt": 70,
      "focus": false,
      "focusIndex": 1,
      "idPrefix": "flow",
      "tone": "dark"
    }
  },
  {
    "key": "theme10_page068",
    "themeKey": "theme10",
    "pageNumber": 68,
    "layout": "THEME10-068",
    "slot": "journey",
    "label": "旅程进度",
    "bgClass": "",
    "controls": [
      {
        "key": "tone",
        "type": "radio",
        "label": "页面底色",
        "default": "light",
        "options": [
          {
            "value": "dark",
            "label": "深色",
            "image": "",
            "color": ""
          },
          {
            "value": "light",
            "label": "浅色",
            "image": "",
            "color": ""
          }
        ],
        "description": "整页深色或浅色底。",
        "publicKey": "tone",
        "publicLabel": "页面底色",
        "desc": "整页深色或浅色底。"
      },
      {
        "key": "stageCount",
        "type": "slider",
        "label": "里程碑数",
        "default": 5,
        "min": 3,
        "max": 6,
        "step": 1,
        "description": "旅程上的里程碑节点数量。",
        "publicKey": "stageCount",
        "publicLabel": "里程碑数",
        "desc": "旅程上的里程碑节点数量。"
      },
      {
        "key": "currentIndex",
        "type": "slider",
        "label": "当前进度",
        "default": 3,
        "min": 1,
        "max": 6,
        "step": 1,
        "description": "「你在这里」所处的里程碑（1 为起点）。",
        "publicKey": "currentIndex",
        "publicLabel": "当前进度",
        "desc": "「你在这里」所处的里程碑（1 为起点）。"
      },
      {
        "key": "layout",
        "type": "radio",
        "label": "卡片排布",
        "default": "alternate",
        "options": [
          {
            "value": "alternate",
            "label": "上下交错"
          },
          {
            "value": "below",
            "label": "统一在下"
          }
        ],
        "description": "阶段卡片是上下交错还是统一排在轨道下方。",
        "publicKey": "layout",
        "publicLabel": "卡片排布",
        "desc": "阶段卡片是上下交错还是统一排在轨道下方。"
      },
      {
        "key": "showTargets",
        "type": "toggle",
        "label": "目标数字",
        "default": true,
        "description": "每个里程碑的资产目标数字。",
        "publicKey": "showTargets",
        "publicLabel": "目标数字",
        "desc": "每个里程碑的资产目标数字。"
      },
      {
        "key": "showProgress",
        "type": "toggle",
        "label": "进度填充",
        "default": true,
        "description": "轨道上已完成部分的高亮填充。",
        "publicKey": "showProgress",
        "publicLabel": "进度填充",
        "desc": "轨道上已完成部分的高亮填充。"
      }
    ],
    "defaultProps": {
      "stageCount": 5,
      "currentIndex": 3,
      "layout": "alternate",
      "showTargets": true,
      "showProgress": true,
      "idPrefix": "journey",
      "tone": "light"
    }
  },
  {
    "key": "theme10_page069",
    "themeKey": "theme10",
    "pageNumber": 69,
    "layout": "THEME10-069",
    "slot": "calendar",
    "label": "回报日历",
    "bgClass": "",
    "controls": [
      {
        "key": "tone",
        "type": "radio",
        "label": "页面底色",
        "default": "light",
        "options": [
          {
            "value": "dark",
            "label": "深色",
            "image": "",
            "color": ""
          },
          {
            "value": "light",
            "label": "浅色",
            "image": "",
            "color": ""
          }
        ],
        "description": "整页深色或浅色底。",
        "publicKey": "tone",
        "publicLabel": "页面底色",
        "desc": "整页深色或浅色底。"
      },
      {
        "key": "columns",
        "type": "slider",
        "label": "每行月份数",
        "default": 4,
        "min": 3,
        "max": 6,
        "step": 1,
        "description": "日历网格的列数（共 12 个月自动换行）。",
        "publicKey": "columns",
        "publicLabel": "每行月份数",
        "desc": "日历网格的列数（共 12 个月自动换行）。"
      },
      {
        "key": "showValues",
        "type": "toggle",
        "label": "显示数值",
        "default": true,
        "description": "在每个月份格里打印回报率。",
        "publicKey": "showValueLabels",
        "publicLabel": "显示数值",
        "desc": "在每个月份格里打印回报率。"
      },
      {
        "key": "showSummary",
        "type": "toggle",
        "label": "汇总栏",
        "default": true,
        "description": "右侧的全年累计与最佳/最弱月。",
        "publicKey": "showSummary",
        "publicLabel": "汇总栏",
        "desc": "右侧的全年累计与最佳/最弱月。"
      },
      {
        "key": "accentLoss",
        "type": "toggle",
        "label": "标记下跌月",
        "default": true,
        "description": "让下跌月份也带上可见的底色。",
        "publicKey": "accentLoss",
        "publicLabel": "标记下跌月",
        "desc": "让下跌月份也带上可见的底色。"
      }
    ],
    "defaultProps": {
      "columns": 4,
      "showValues": true,
      "showSummary": true,
      "accentLoss": true,
      "idPrefix": "calendar",
      "tone": "light"
    }
  },
  {
    "key": "theme10_page070",
    "themeKey": "theme10",
    "pageNumber": 70,
    "layout": "THEME10-070",
    "slot": "mosaic",
    "label": "图文马赛克",
    "bgClass": "",
    "controls": [
      {
        "key": "tone",
        "type": "radio",
        "label": "页面底色",
        "default": "light",
        "options": [
          {
            "value": "dark",
            "label": "深色",
            "image": "",
            "color": ""
          },
          {
            "value": "light",
            "label": "浅色",
            "image": "",
            "color": ""
          }
        ],
        "description": "整页深色或浅色底。",
        "publicKey": "tone",
        "publicLabel": "页面底色",
        "desc": "整页深色或浅色底。"
      },
      {
        "key": "tileCount",
        "type": "slider",
        "label": "图片数量",
        "default": 4,
        "min": 0,
        "max": 6,
        "step": 1,
        "description": "马赛克的图片块数量（0 为纯文字，版式按数量自动重排）。",
        "publicKey": "tileCount",
        "publicLabel": "图片数量",
        "desc": "马赛克的图片块数量（0 为纯文字，版式按数量自动重排）。"
      },
      {
        "key": "railSide",
        "type": "radio",
        "label": "文字栏位置",
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
        "description": "标题与图注栏在画面的哪一侧。",
        "publicKey": "railSide",
        "publicLabel": "文字栏位置",
        "desc": "标题与图注栏在画面的哪一侧。"
      },
      {
        "key": "showIndex",
        "type": "toggle",
        "label": "图注编号",
        "default": true,
        "description": "在每条图注前显示等宽编号。",
        "publicKey": "showIndex",
        "publicLabel": "图注编号",
        "desc": "在每条图注前显示等宽编号。"
      },
      {
        "key": "gap",
        "type": "slider",
        "label": "图片间距",
        "default": 16,
        "min": 8,
        "max": 32,
        "step": 4,
        "unit": "px",
        "description": "马赛克图块之间的间隙。",
        "publicKey": "gap",
        "publicLabel": "图片间距",
        "desc": "马赛克图块之间的间隙。"
      }
    ],
    "defaultProps": {
      "tileCount": 4,
      "railSide": "left",
      "showIndex": true,
      "gap": 16,
      "idPrefix": "mosaic",
      "tone": "light"
    }
  },
  {
    "key": "theme10_page071",
    "themeKey": "theme10",
    "pageNumber": 71,
    "layout": "THEME10-071",
    "slot": "checklist",
    "label": "行动清单",
    "bgClass": "",
    "controls": [
      {
        "key": "tone",
        "type": "radio",
        "label": "页面底色",
        "default": "light",
        "options": [
          {
            "value": "dark",
            "label": "深色",
            "image": "",
            "color": ""
          },
          {
            "value": "light",
            "label": "浅色",
            "image": "",
            "color": ""
          }
        ],
        "description": "整页深色或浅色底。",
        "publicKey": "tone",
        "publicLabel": "页面底色",
        "desc": "整页深色或浅色底。"
      },
      {
        "key": "itemCount",
        "type": "slider",
        "label": "条目数量",
        "default": 6,
        "min": 3,
        "max": 8,
        "step": 1,
        "description": "清单条目数量。",
        "publicKey": "itemCount",
        "publicLabel": "条目数量",
        "desc": "清单条目数量。"
      },
      {
        "key": "columns",
        "type": "slider",
        "label": "列数",
        "default": 2,
        "min": 1,
        "max": 2,
        "step": 1,
        "description": "单列或双列排布。",
        "publicKey": "columns",
        "publicLabel": "列数",
        "desc": "单列或双列排布。"
      },
      {
        "key": "showOutcome",
        "type": "toggle",
        "label": "结果说明",
        "default": true,
        "description": "每条任务下方的结果小字。",
        "publicKey": "showOutcome",
        "publicLabel": "结果说明",
        "desc": "每条任务下方的结果小字。"
      },
      {
        "key": "checkedMode",
        "type": "radio",
        "label": "勾选状态",
        "default": "data",
        "options": [
          {
            "value": "data",
            "label": "按数据"
          },
          {
            "value": "all",
            "label": "全选"
          },
          {
            "value": "none",
            "label": "全空"
          }
        ],
        "description": "渲染为勾选的条目：按内容、全部勾选或全部留空。",
        "publicKey": "checkedMode",
        "publicLabel": "勾选状态",
        "desc": "渲染为勾选的条目：按内容、全部勾选或全部留空。"
      }
    ],
    "defaultProps": {
      "itemCount": 6,
      "columns": 2,
      "showOutcome": true,
      "checkedMode": "data",
      "idPrefix": "checklist",
      "tone": "light"
    }
  },
  {
    "key": "theme10_page072",
    "themeKey": "theme10",
    "pageNumber": 72,
    "layout": "THEME10-072",
    "slot": "candles",
    "label": "K线蜡烛",
    "bgClass": "",
    "controls": [
      {
        "key": "tone",
        "type": "radio",
        "label": "页面底色",
        "default": "dark",
        "options": [
          {
            "value": "dark",
            "label": "深色",
            "image": "",
            "color": ""
          },
          {
            "value": "light",
            "label": "浅色",
            "image": "",
            "color": ""
          }
        ],
        "description": "整页深色或浅色底。",
        "publicKey": "tone",
        "publicLabel": "页面底色",
        "desc": "整页深色或浅色底。"
      },
      {
        "key": "candleCount",
        "type": "slider",
        "label": "蜡烛数量",
        "default": 18,
        "min": 10,
        "max": 28,
        "step": 1,
        "description": "绘制的 K 线（周期）数量。",
        "publicKey": "candleCount",
        "publicLabel": "蜡烛数量",
        "desc": "绘制的 K 线（周期）数量。"
      },
      {
        "key": "showMA",
        "type": "toggle",
        "label": "均线叠加",
        "default": true,
        "description": "叠加一条移动平均虚线。",
        "publicKey": "showMA",
        "publicLabel": "均线叠加",
        "desc": "叠加一条移动平均虚线。"
      },
      {
        "key": "showVolume",
        "type": "toggle",
        "label": "成交量条",
        "default": true,
        "description": "价格图下方的成交量量柱条。",
        "publicKey": "showVolume",
        "publicLabel": "成交量条",
        "desc": "价格图下方的成交量量柱条。"
      },
      {
        "key": "showGrid",
        "type": "toggle",
        "label": "价格网格",
        "default": true,
        "description": "横向价格刻度网格线与标尺。",
        "publicKey": "showGrid",
        "publicLabel": "价格网格",
        "desc": "横向价格刻度网格线与标尺。"
      },
      {
        "key": "tagLast",
        "type": "toggle",
        "label": "末值标记",
        "default": true,
        "description": "在最后一根 K 线高度处标注现价读数。",
        "publicKey": "tagLast",
        "publicLabel": "末值标记",
        "desc": "在最后一根 K 线高度处标注现价读数。"
      }
    ],
    "defaultProps": {
      "candleCount": 18,
      "showMA": true,
      "showVolume": true,
      "showGrid": true,
      "tagLast": true,
      "idPrefix": "candles",
      "tone": "dark"
    }
  },
  {
    "key": "theme10_page073",
    "themeKey": "theme10",
    "pageNumber": 73,
    "layout": "THEME10-073",
    "slot": "sankey",
    "label": "资金桑基",
    "bgClass": "",
    "controls": [
      {
        "key": "tone",
        "type": "radio",
        "label": "页面底色",
        "default": "dark",
        "options": [
          {
            "value": "dark",
            "label": "深色",
            "image": "",
            "color": ""
          },
          {
            "value": "light",
            "label": "浅色",
            "image": "",
            "color": ""
          }
        ],
        "description": "整页深色或浅色底。",
        "publicKey": "tone",
        "publicLabel": "页面底色",
        "desc": "整页深色或浅色底。"
      },
      {
        "key": "sourceCount",
        "type": "slider",
        "label": "来源数量",
        "default": 3,
        "min": 2,
        "max": 4,
        "step": 1,
        "description": "左侧资金来源节点数量。",
        "publicKey": "sourceCount",
        "publicLabel": "来源数量",
        "desc": "左侧资金来源节点数量。"
      },
      {
        "key": "targetCount",
        "type": "slider",
        "label": "去向数量",
        "default": 4,
        "min": 3,
        "max": 5,
        "step": 1,
        "description": "右侧配置去向节点数量。",
        "publicKey": "targetCount",
        "publicLabel": "去向数量",
        "desc": "右侧配置去向节点数量。"
      },
      {
        "key": "showValues",
        "type": "toggle",
        "label": "数值标签",
        "default": true,
        "description": "各节点旁的合计数值。",
        "publicKey": "showValueLabels",
        "publicLabel": "数值标签",
        "desc": "各节点旁的合计数值。"
      },
      {
        "key": "showLabels",
        "type": "toggle",
        "label": "节点名称",
        "default": true,
        "description": "两侧节点名称标签。",
        "publicKey": "showLabels",
        "publicLabel": "节点名称",
        "desc": "两侧节点名称标签。"
      },
      {
        "key": "focus",
        "type": "toggle",
        "label": "重点聚焦",
        "default": false,
        "description": "高亮某一去向的全部流入带，其余弱化。",
        "publicKey": "focus",
        "publicLabel": "重点聚焦",
        "desc": "高亮某一去向的全部流入带，其余弱化。"
      },
      {
        "key": "focusIndex",
        "type": "slider",
        "label": "聚焦第几项",
        "default": 1,
        "min": 1,
        "max": 5,
        "step": 1,
        "description": "需开启「重点聚焦」后生效（按去向计）。",
        "publicKey": "focusIndex",
        "publicLabel": "聚焦第几项",
        "desc": "需开启「重点聚焦」后生效（按去向计）。"
      }
    ],
    "defaultProps": {
      "sourceCount": 3,
      "targetCount": 4,
      "showValues": true,
      "showLabels": true,
      "focus": false,
      "focusIndex": 1,
      "idPrefix": "sankey",
      "tone": "dark"
    }
  },
  {
    "key": "theme10_page074",
    "themeKey": "theme10",
    "pageNumber": 74,
    "layout": "THEME10-074",
    "slot": "meter",
    "label": "半环量规",
    "bgClass": "",
    "controls": [
      {
        "key": "tone",
        "type": "radio",
        "label": "页面底色",
        "default": "light",
        "options": [
          {
            "value": "dark",
            "label": "深色",
            "image": "",
            "color": ""
          },
          {
            "value": "light",
            "label": "浅色",
            "image": "",
            "color": ""
          }
        ],
        "description": "整页深色或浅色底。",
        "publicKey": "tone",
        "publicLabel": "页面底色",
        "desc": "整页深色或浅色底。"
      },
      {
        "key": "gaugeCount",
        "type": "slider",
        "label": "量规数量",
        "default": 4,
        "min": 2,
        "max": 5,
        "step": 1,
        "description": "一排半环仪表的数量。",
        "publicKey": "gaugeCount",
        "publicLabel": "量规数量",
        "desc": "一排半环仪表的数量。"
      },
      {
        "key": "showTrack",
        "type": "toggle",
        "label": "底环轨道",
        "default": true,
        "description": "数值弧背后的淡色满弧轨道。",
        "publicKey": "showGuide",
        "publicLabel": "底环轨道",
        "desc": "数值弧背后的淡色满弧轨道。"
      },
      {
        "key": "showDelta",
        "type": "toggle",
        "label": "变化量",
        "default": true,
        "description": "数值下方的升降变化标签。",
        "publicKey": "showValueLabels",
        "publicLabel": "变化量",
        "desc": "数值下方的升降变化标签。"
      },
      {
        "key": "showScale",
        "type": "toggle",
        "label": "量程刻度",
        "default": true,
        "description": "弧两端的 0 / 上限刻度。",
        "publicKey": "showScale",
        "publicLabel": "量程刻度",
        "desc": "弧两端的 0 / 上限刻度。"
      },
      {
        "key": "focus",
        "type": "toggle",
        "label": "重点聚焦",
        "default": false,
        "description": "高亮某一仪表，其余弱化。",
        "publicKey": "focus",
        "publicLabel": "重点聚焦",
        "desc": "高亮某一仪表，其余弱化。"
      },
      {
        "key": "focusIndex",
        "type": "slider",
        "label": "聚焦第几项",
        "default": 1,
        "min": 1,
        "max": 5,
        "step": 1,
        "description": "需开启「重点聚焦」后生效。",
        "publicKey": "focusIndex",
        "publicLabel": "聚焦第几项",
        "desc": "需开启「重点聚焦」后生效。"
      }
    ],
    "defaultProps": {
      "gaugeCount": 4,
      "showTrack": true,
      "showDelta": true,
      "showScale": true,
      "focus": false,
      "focusIndex": 1,
      "idPrefix": "meter",
      "tone": "light"
    }
  },
  {
    "key": "theme10_page075",
    "themeKey": "theme10",
    "pageNumber": 75,
    "layout": "THEME10-075",
    "slot": "schedule",
    "label": "条款明细",
    "bgClass": "",
    "controls": [
      {
        "key": "tone",
        "type": "radio",
        "label": "页面底色",
        "default": "light",
        "options": [
          {
            "value": "dark",
            "label": "深色",
            "image": "",
            "color": ""
          },
          {
            "value": "light",
            "label": "浅色",
            "image": "",
            "color": ""
          }
        ],
        "description": "整页深色或浅色底。",
        "publicKey": "tone",
        "publicLabel": "页面底色",
        "desc": "整页深色或浅色底。"
      },
      {
        "key": "rowCount",
        "type": "slider",
        "label": "条目数量",
        "default": 6,
        "min": 3,
        "max": 8,
        "step": 1,
        "description": "表格中的明细行数。",
        "publicKey": "itemCount",
        "publicLabel": "条目数量",
        "desc": "表格中的明细行数。"
      },
      {
        "key": "showNote",
        "type": "toggle",
        "label": "备注列",
        "default": true,
        "description": "最右侧的备注说明列。",
        "publicKey": "showNote",
        "publicLabel": "备注列",
        "desc": "最右侧的备注说明列。"
      },
      {
        "key": "showGroup",
        "type": "toggle",
        "label": "分组标题",
        "default": true,
        "description": "按类别插入的分组分隔标题。",
        "publicKey": "showGroup",
        "publicLabel": "分组标题",
        "desc": "按类别插入的分组分隔标题。"
      },
      {
        "key": "showTotal",
        "type": "toggle",
        "label": "合计行",
        "default": true,
        "description": "表尾的综合合计行。",
        "publicKey": "showTotal",
        "publicLabel": "合计行",
        "desc": "表尾的综合合计行。"
      },
      {
        "key": "focus",
        "type": "toggle",
        "label": "重点聚焦",
        "default": false,
        "description": "高亮某一行，其余弱化。",
        "publicKey": "focus",
        "publicLabel": "重点聚焦",
        "desc": "高亮某一行，其余弱化。"
      },
      {
        "key": "focusIndex",
        "type": "slider",
        "label": "聚焦第几项",
        "default": 1,
        "min": 1,
        "max": 8,
        "step": 1,
        "description": "需开启「重点聚焦」后生效。",
        "publicKey": "focusIndex",
        "publicLabel": "聚焦第几项",
        "desc": "需开启「重点聚焦」后生效。"
      }
    ],
    "defaultProps": {
      "rowCount": 6,
      "showNote": true,
      "showGroup": true,
      "showTotal": true,
      "focus": false,
      "focusIndex": 1,
      "idPrefix": "schedule",
      "tone": "light"
    }
  },
  {
    "key": "theme10_page076",
    "themeKey": "theme10",
    "pageNumber": 76,
    "layout": "THEME10-076",
    "slot": "collage",
    "label": "拼贴影像",
    "bgClass": "",
    "controls": [
      {
        "key": "tone",
        "type": "radio",
        "label": "页面底色",
        "default": "dark",
        "options": [
          {
            "value": "dark",
            "label": "深色",
            "image": "",
            "color": ""
          },
          {
            "value": "light",
            "label": "浅色",
            "image": "",
            "color": ""
          }
        ],
        "description": "整页深色或浅色底。",
        "publicKey": "tone",
        "publicLabel": "页面底色",
        "desc": "整页深色或浅色底。"
      },
      {
        "key": "imageCount",
        "type": "slider",
        "label": "图片数量",
        "default": 5,
        "min": 3,
        "max": 6,
        "step": 1,
        "description": "拼贴中的照片框数量；各框按上传图片真实比例自适应宽度。",
        "publicKey": "imageCount",
        "publicLabel": "图片数量",
        "desc": "拼贴中的照片框数量；各框按上传图片真实比例自适应宽度。"
      },
      {
        "key": "tilt",
        "type": "toggle",
        "label": "错落倾斜",
        "default": true,
        "description": "为每张照片施加轻微旋转的拼贴感。",
        "publicKey": "tilt",
        "publicLabel": "错落倾斜",
        "desc": "为每张照片施加轻微旋转的拼贴感。"
      },
      {
        "key": "showCaptions",
        "type": "toggle",
        "label": "照片说明",
        "default": true,
        "description": "每张照片下方的等宽说明文字。",
        "publicKey": "showCaptions",
        "publicLabel": "照片说明",
        "desc": "每张照片下方的等宽说明文字。"
      },
      {
        "key": "showIndex",
        "type": "toggle",
        "label": "角标编号",
        "default": true,
        "description": "每张照片左上角的圆形编号。",
        "publicKey": "showIndex",
        "publicLabel": "角标编号",
        "desc": "每张照片左上角的圆形编号。"
      }
    ],
    "defaultProps": {
      "imageCount": 5,
      "tilt": true,
      "showCaptions": true,
      "showIndex": true,
      "idPrefix": "collage",
      "tone": "dark"
    }
  },
  {
    "key": "theme10_page077",
    "themeKey": "theme10",
    "pageNumber": 77,
    "layout": "THEME10-077",
    "slot": "captioned",
    "label": "图注精读",
    "bgClass": "",
    "controls": [
      {
        "key": "tone",
        "type": "radio",
        "label": "页面底色",
        "default": "dark",
        "options": [
          {
            "value": "dark",
            "label": "深色",
            "image": "",
            "color": ""
          },
          {
            "value": "light",
            "label": "浅色",
            "image": "",
            "color": ""
          }
        ],
        "description": "整页深色或浅色底。",
        "publicKey": "tone",
        "publicLabel": "页面底色",
        "desc": "整页深色或浅色底。"
      },
      {
        "key": "imageSide",
        "type": "radio",
        "label": "图片位置",
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
        "description": "主图所在的一侧（标注列表在另一侧）。",
        "publicKey": "imageSide",
        "publicLabel": "图片位置",
        "desc": "主图所在的一侧（标注列表在另一侧）。"
      },
      {
        "key": "noteCount",
        "type": "slider",
        "label": "标注数量",
        "default": 3,
        "min": 2,
        "max": 5,
        "step": 1,
        "description": "图上的编号标记与右侧条目数量。",
        "publicKey": "itemCount",
        "publicLabel": "标注数量",
        "desc": "图上的编号标记与右侧条目数量。"
      },
      {
        "key": "showMarkers",
        "type": "toggle",
        "label": "图上标记",
        "default": false,
        "description": "图片上对应编号的圆形定位点。",
        "publicKey": "showMarkers",
        "publicLabel": "图上标记",
        "desc": "图片上对应编号的圆形定位点。"
      },
      {
        "key": "showOverline",
        "type": "toggle",
        "label": "栏目标签",
        "default": true,
        "description": "标题上方的等宽小标签。",
        "publicKey": "showOverline",
        "publicLabel": "栏目标签",
        "desc": "标题上方的等宽小标签。"
      }
    ],
    "defaultProps": {
      "imageSide": "left",
      "noteCount": 3,
      "showMarkers": false,
      "showOverline": true,
      "idPrefix": "captioned",
      "tone": "dark"
    }
  },
  {
    "key": "theme10_page078",
    "themeKey": "theme10",
    "pageNumber": 78,
    "layout": "THEME10-078",
    "slot": "showcase",
    "label": "沉浸大图",
    "bgClass": "",
    "controls": [
      {
        "key": "backgroundMode",
        "label": "背景替换",
        "type": "segment",
        "def": "unicorn",
        "options": [
          {
            "value": "unicorn",
            "label": "动态"
          },
          {
            "value": "media",
            "label": "上传"
          }
        ],
        "desc": "动态 shader 或自定义背景媒体",
        "publicKey": "backgroundMode",
        "publicLabel": "背景替换",
        "description": "动态 shader 或自定义背景媒体"
      },
      {
        "key": "unicornScene",
        "label": "动态场景",
        "type": "segment",
        "def": "moving",
        "options": [
          {
            "value": "tech",
            "label": "科技"
          },
          {
            "value": "automations",
            "label": "自动化"
          },
          {
            "value": "moving",
            "label": "流动"
          },
          {
            "value": "goey",
            "label": "黏球"
          }
        ],
        "dependsOn": "backgroundMode",
        "dependsOnValue": "unicorn",
        "desc": "选择固定 Unicorn shader 场景",
        "publicKey": "dynamicVisual",
        "publicLabel": "动态场景",
        "description": "选择固定 Unicorn shader 场景"
      },
      {
        "key": "textPos",
        "type": "radio",
        "label": "文字位置",
        "default": "bottom-left",
        "options": [
          {
            "value": "bottom-left",
            "label": "左下"
          },
          {
            "value": "center",
            "label": "居中"
          }
        ],
        "description": "标题块在画面中的位置。",
        "publicKey": "textPos",
        "publicLabel": "文字位置",
        "desc": "标题块在画面中的位置。"
      },
      {
        "key": "scrim",
        "type": "slider",
        "label": "压暗程度",
        "default": 60,
        "min": 30,
        "max": 85,
        "step": 1,
        "unit": "%",
        "description": "图片之上的渐变压暗强度，保证文字可读。",
        "publicKey": "scrim",
        "publicLabel": "压暗程度",
        "desc": "图片之上的渐变压暗强度，保证文字可读。"
      },
      {
        "key": "showTicker",
        "type": "toggle",
        "label": "指标走马条",
        "default": true,
        "description": "底部一排关键指标读数条。",
        "publicKey": "showTicker",
        "publicLabel": "指标走马条",
        "desc": "底部一排关键指标读数条。"
      },
      {
        "key": "tickerCount",
        "type": "slider",
        "label": "指标条数",
        "default": 3,
        "min": 2,
        "max": 4,
        "step": 1,
        "description": "走马条中的指标数量。",
        "publicKey": "tickerCount",
        "publicLabel": "指标条数",
        "desc": "走马条中的指标数量。"
      },
      {
        "key": "showOverline",
        "type": "toggle",
        "label": "栏目标签",
        "default": true,
        "description": "标题上方的等宽小标签。",
        "publicKey": "showOverline",
        "publicLabel": "栏目标签",
        "desc": "标题上方的等宽小标签。"
      }
    ],
    "defaultProps": {
      "textPos": "bottom-left",
      "scrim": 60,
      "showTicker": true,
      "tickerCount": 3,
      "showOverline": true,
      "backgroundMode": "unicorn",
      "unicornScene": "moving",
      "idPrefix": "showcase"
    }
  },
  {
    "key": "theme10_page079",
    "themeKey": "theme10",
    "pageNumber": 79,
    "layout": "THEME10-079",
    "slot": "poster",
    "label": "主视觉海报",
    "bgClass": "",
    "controls": [
      {
        "key": "backgroundMode",
        "label": "背景替换",
        "type": "segment",
        "def": "unicorn",
        "options": [
          {
            "value": "unicorn",
            "label": "动态"
          },
          {
            "value": "media",
            "label": "上传"
          }
        ],
        "desc": "动态 shader 或自定义背景媒体",
        "publicKey": "backgroundMode",
        "publicLabel": "背景替换",
        "description": "动态 shader 或自定义背景媒体"
      },
      {
        "key": "unicornScene",
        "label": "动态场景",
        "type": "segment",
        "def": "tech",
        "options": [
          {
            "value": "tech",
            "label": "科技"
          },
          {
            "value": "automations",
            "label": "自动化"
          },
          {
            "value": "moving",
            "label": "流动"
          },
          {
            "value": "goey",
            "label": "黏球"
          }
        ],
        "dependsOn": "backgroundMode",
        "dependsOnValue": "unicorn",
        "desc": "选择固定 Unicorn shader 场景",
        "publicKey": "dynamicVisual",
        "publicLabel": "动态场景",
        "description": "选择固定 Unicorn shader 场景"
      },
      {
        "key": "headlinePos",
        "type": "radio",
        "label": "标题位置",
        "default": "center",
        "options": [
          {
            "value": "top",
            "label": "顶部"
          },
          {
            "value": "center",
            "label": "居中"
          },
          {
            "value": "bottom",
            "label": "底部"
          }
        ],
        "description": "超大标题在画面中的垂直位置。",
        "publicKey": "headlinePos",
        "publicLabel": "标题位置",
        "desc": "超大标题在画面中的垂直位置。"
      },
      {
        "key": "scrim",
        "type": "slider",
        "label": "压暗程度",
        "default": 66,
        "min": 30,
        "max": 85,
        "step": 1,
        "unit": "%",
        "description": "图片之上的方向性压暗强度（左深右浅）。",
        "publicKey": "scrim",
        "publicLabel": "压暗程度",
        "desc": "图片之上的方向性压暗强度（左深右浅）。"
      },
      {
        "key": "showKicker",
        "type": "toggle",
        "label": "章节标签",
        "default": true,
        "description": "大标题上方的等宽章节标签。",
        "publicKey": "showKicker",
        "publicLabel": "章节标签",
        "desc": "大标题上方的等宽章节标签。"
      },
      {
        "key": "showFooter",
        "type": "toggle",
        "label": "页脚信息",
        "default": true,
        "description": "底部细线分隔的页脚信息行。",
        "publicKey": "showFooter",
        "publicLabel": "页脚信息",
        "desc": "底部细线分隔的页脚信息行。"
      },
      {
        "key": "showRule",
        "type": "toggle",
        "label": "强调竖条",
        "default": true,
        "description": "大标题左侧的强调色竖条。",
        "publicKey": "showRule",
        "publicLabel": "强调竖条",
        "desc": "大标题左侧的强调色竖条。"
      }
    ],
    "defaultProps": {
      "headlinePos": "center",
      "scrim": 66,
      "showKicker": true,
      "showFooter": true,
      "showRule": true,
      "backgroundMode": "unicorn",
      "unicornScene": "tech",
      "idPrefix": "poster"
    }
  },
  {
    "key": "theme10_page080",
    "themeKey": "theme10",
    "pageNumber": 80,
    "layout": "THEME10-080",
    "slot": "isotype",
    "label": "象形占比",
    "bgClass": "",
    "controls": [
      {
        "key": "tone",
        "type": "radio",
        "label": "页面底色",
        "default": "dark",
        "options": [
          {
            "value": "dark",
            "label": "深色",
            "image": "",
            "color": ""
          },
          {
            "value": "light",
            "label": "浅色",
            "image": "",
            "color": ""
          }
        ],
        "description": "整页深色或浅色底。",
        "publicKey": "tone",
        "publicLabel": "页面底色",
        "desc": "整页深色或浅色底。"
      },
      {
        "key": "catCount",
        "type": "slider",
        "label": "类别数量",
        "default": 3,
        "min": 2,
        "max": 4,
        "step": 1,
        "description": "填充百格网格的类别数。各类别占比按比例重新归一到 100 格。",
        "publicKey": "catCount",
        "publicLabel": "类别数量",
        "desc": "填充百格网格的类别数。各类别占比按比例重新归一到 100 格。"
      },
      {
        "key": "showLegend",
        "type": "toggle",
        "label": "图例",
        "default": true,
        "description": "右侧的类别名称 + 说明图例。",
        "publicKey": "showLegend",
        "publicLabel": "图例",
        "desc": "右侧的类别名称 + 说明图例。"
      },
      {
        "key": "showValues",
        "type": "toggle",
        "label": "百分数",
        "default": true,
        "description": "图例中的百分比数字。",
        "publicKey": "showValues",
        "publicLabel": "百分数",
        "desc": "图例中的百分比数字。"
      },
      {
        "key": "focus",
        "type": "toggle",
        "label": "重点聚焦",
        "default": false,
        "description": "高亮某一类别，其余格子弱化为底纹。",
        "publicKey": "focus",
        "publicLabel": "重点聚焦",
        "desc": "高亮某一类别，其余格子弱化为底纹。"
      },
      {
        "key": "focusIndex",
        "type": "slider",
        "label": "聚焦第几项",
        "default": 1,
        "min": 1,
        "max": 4,
        "step": 1,
        "description": "需开启「重点聚焦」后生效，指定被高亮的类别。",
        "publicKey": "focusIndex",
        "publicLabel": "聚焦第几项",
        "desc": "需开启「重点聚焦」后生效，指定被高亮的类别。"
      }
    ],
    "defaultProps": {
      "catCount": 3,
      "showLegend": true,
      "showValues": true,
      "focus": false,
      "focusIndex": 1,
      "idPrefix": "isotype",
      "tone": "dark"
    }
  },
  {
    "key": "theme10_page081",
    "themeKey": "theme10",
    "pageNumber": 81,
    "layout": "THEME10-081",
    "slot": "bump",
    "label": "名次走势",
    "bgClass": "",
    "controls": [
      {
        "key": "tone",
        "type": "radio",
        "label": "页面底色",
        "default": "dark",
        "options": [
          {
            "value": "dark",
            "label": "深色",
            "image": "",
            "color": ""
          },
          {
            "value": "light",
            "label": "浅色",
            "image": "",
            "color": ""
          }
        ],
        "description": "整页深色或浅色底。",
        "publicKey": "tone",
        "publicLabel": "页面底色",
        "desc": "整页深色或浅色底。"
      },
      {
        "key": "seriesCount",
        "type": "slider",
        "label": "序列数量",
        "default": 5,
        "min": 3,
        "max": 5,
        "step": 1,
        "description": "参与排名的策略/序列条数。线条交叉即代表名次反超。",
        "publicKey": "seriesCount",
        "publicLabel": "序列数量",
        "desc": "参与排名的策略/序列条数。线条交叉即代表名次反超。"
      },
      {
        "key": "periodCount",
        "type": "slider",
        "label": "周期数量",
        "default": 5,
        "min": 3,
        "max": 6,
        "step": 1,
        "description": "横轴的时间周期列数。",
        "publicKey": "periodCount",
        "publicLabel": "周期数量",
        "desc": "横轴的时间周期列数。"
      },
      {
        "key": "showDots",
        "type": "toggle",
        "label": "名次节点",
        "default": true,
        "description": "每个周期上的名次圆点。",
        "publicKey": "showDots",
        "publicLabel": "名次节点",
        "desc": "每个周期上的名次圆点。"
      },
      {
        "key": "showRankAxis",
        "type": "toggle",
        "label": "名次刻度",
        "default": true,
        "description": "左侧 1·2·3… 的名次刻度。",
        "publicKey": "showRankAxis",
        "publicLabel": "名次刻度",
        "desc": "左侧 1·2·3… 的名次刻度。"
      },
      {
        "key": "focus",
        "type": "toggle",
        "label": "重点聚焦",
        "default": false,
        "description": "高亮某一条序列，其余弱化。",
        "publicKey": "focus",
        "publicLabel": "重点聚焦",
        "desc": "高亮某一条序列，其余弱化。"
      },
      {
        "key": "focusIndex",
        "type": "slider",
        "label": "聚焦第几项",
        "default": 1,
        "min": 1,
        "max": 5,
        "step": 1,
        "description": "需开启「重点聚焦」后生效，指定被高亮的序列。",
        "publicKey": "focusIndex",
        "publicLabel": "聚焦第几项",
        "desc": "需开启「重点聚焦」后生效，指定被高亮的序列。"
      }
    ],
    "defaultProps": {
      "seriesCount": 5,
      "periodCount": 5,
      "showDots": true,
      "showRankAxis": true,
      "focus": false,
      "focusIndex": 1,
      "idPrefix": "bump",
      "tone": "dark"
    }
  },
  {
    "key": "theme10_page082",
    "themeKey": "theme10",
    "pageNumber": 82,
    "layout": "THEME10-082",
    "slot": "pyramid",
    "label": "财富金字塔",
    "bgClass": "",
    "controls": [
      {
        "key": "tone",
        "type": "radio",
        "label": "页面底色",
        "default": "light",
        "options": [
          {
            "value": "dark",
            "label": "深色",
            "image": "",
            "color": ""
          },
          {
            "value": "light",
            "label": "浅色",
            "image": "",
            "color": ""
          }
        ],
        "description": "整页深色或浅色底。",
        "publicKey": "tone",
        "publicLabel": "页面底色",
        "desc": "整页深色或浅色底。"
      },
      {
        "key": "tierCount",
        "type": "slider",
        "label": "层级数量",
        "default": 4,
        "min": 3,
        "max": 5,
        "step": 1,
        "description": "金字塔的层数（顶=机会、底=安全垫）。",
        "publicKey": "tierCount",
        "publicLabel": "层级数量",
        "desc": "金字塔的层数（顶=机会、底=安全垫）。"
      },
      {
        "key": "showValue",
        "type": "toggle",
        "label": "占比数值",
        "default": true,
        "description": "每层引出标注上的占比 / 数值。",
        "publicKey": "showValueLabels",
        "publicLabel": "占比数值",
        "desc": "每层引出标注上的占比 / 数值。"
      },
      {
        "key": "showNote",
        "type": "toggle",
        "label": "说明文字",
        "default": true,
        "description": "每层的一句说明。",
        "publicKey": "showNote",
        "publicLabel": "说明文字",
        "desc": "每层的一句说明。"
      },
      {
        "key": "side",
        "type": "radio",
        "label": "标注方向",
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
        "description": "引线与文字标注延伸的方向。",
        "publicKey": "side",
        "publicLabel": "标注方向",
        "desc": "引线与文字标注延伸的方向。"
      },
      {
        "key": "focus",
        "type": "toggle",
        "label": "重点聚焦",
        "default": false,
        "description": "高亮某一层，其余弱化。",
        "publicKey": "focus",
        "publicLabel": "重点聚焦",
        "desc": "高亮某一层，其余弱化。"
      },
      {
        "key": "focusIndex",
        "type": "slider",
        "label": "聚焦第几层",
        "default": 1,
        "min": 1,
        "max": 5,
        "step": 1,
        "description": "需开启「重点聚焦」后生效，1 = 顶层。",
        "publicKey": "focusIndex",
        "publicLabel": "聚焦第几层",
        "desc": "需开启「重点聚焦」后生效，1 = 顶层。"
      }
    ],
    "defaultProps": {
      "tierCount": 4,
      "showValue": true,
      "showNote": true,
      "side": "right",
      "focus": false,
      "focusIndex": 1,
      "idPrefix": "pyramid",
      "tone": "light"
    }
  },
  {
    "key": "theme10_page083",
    "themeKey": "theme10",
    "pageNumber": 83,
    "layout": "THEME10-083",
    "slot": "radialstack",
    "label": "同心环",
    "bgClass": "",
    "controls": [
      {
        "key": "tone",
        "type": "radio",
        "label": "页面底色",
        "default": "dark",
        "options": [
          {
            "value": "dark",
            "label": "深色",
            "image": "",
            "color": ""
          },
          {
            "value": "light",
            "label": "浅色",
            "image": "",
            "color": ""
          }
        ],
        "description": "整页深色或浅色底。",
        "publicKey": "tone",
        "publicLabel": "页面底色",
        "desc": "整页深色或浅色底。"
      },
      {
        "key": "ringCount",
        "type": "slider",
        "label": "圆环数量",
        "default": 4,
        "min": 3,
        "max": 5,
        "step": 1,
        "description": "同心圆环条数，每环为一项 0–100 的比率。",
        "publicKey": "ringCount",
        "publicLabel": "圆环数量",
        "desc": "同心圆环条数，每环为一项 0–100 的比率。"
      },
      {
        "key": "showTrack",
        "type": "toggle",
        "label": "底环轨道",
        "default": true,
        "description": "每环背后的 100% 浅色轨道。",
        "publicKey": "showGuide",
        "publicLabel": "底环轨道",
        "desc": "每环背后的 100% 浅色轨道。"
      },
      {
        "key": "showCenter",
        "type": "toggle",
        "label": "中心数值",
        "default": true,
        "description": "圆心的综合评分大数字。",
        "publicKey": "showValueLabels",
        "publicLabel": "中心数值",
        "desc": "圆心的综合评分大数字。"
      },
      {
        "key": "showLegend",
        "type": "toggle",
        "label": "图例",
        "default": true,
        "description": "右侧名称 + 数值图例。",
        "publicKey": "showValueLabels2",
        "publicLabel": "图例",
        "desc": "右侧名称 + 数值图例。"
      },
      {
        "key": "focus",
        "type": "toggle",
        "label": "重点聚焦",
        "default": false,
        "description": "高亮某一环，其余弱化。",
        "publicKey": "focus",
        "publicLabel": "重点聚焦",
        "desc": "高亮某一环，其余弱化。"
      },
      {
        "key": "focusIndex",
        "type": "slider",
        "label": "聚焦第几项",
        "default": 1,
        "min": 1,
        "max": 5,
        "step": 1,
        "description": "需开启「重点聚焦」后生效，1 = 最外环。",
        "publicKey": "focusIndex",
        "publicLabel": "聚焦第几项",
        "desc": "需开启「重点聚焦」后生效，1 = 最外环。"
      }
    ],
    "defaultProps": {
      "ringCount": 4,
      "showTrack": true,
      "showCenter": true,
      "showLegend": true,
      "focus": false,
      "focusIndex": 1,
      "idPrefix": "radialstack",
      "tone": "dark"
    }
  },
  {
    "key": "theme10_page084",
    "themeKey": "theme10",
    "pageNumber": 84,
    "layout": "THEME10-084",
    "slot": "annotated",
    "label": "标注影像",
    "bgClass": "",
    "controls": [
      {
        "key": "tone",
        "type": "radio",
        "label": "页面底色",
        "default": "dark",
        "options": [
          {
            "value": "dark",
            "label": "深色",
            "image": "",
            "color": ""
          },
          {
            "value": "light",
            "label": "浅色",
            "image": "",
            "color": ""
          }
        ],
        "description": "整页深色或浅色底。",
        "publicKey": "tone",
        "publicLabel": "页面底色",
        "desc": "整页深色或浅色底。"
      },
      {
        "key": "markerCount",
        "type": "slider",
        "label": "标注数量",
        "default": 4,
        "min": 2,
        "max": 5,
        "step": 1,
        "description": "图片上的编号标注点与右侧图例条数。图片随上传比例自适应裁切填满。",
        "publicKey": "markerCount",
        "publicLabel": "标注数量",
        "desc": "图片上的编号标注点与右侧图例条数。图片随上传比例自适应裁切填满。"
      },
      {
        "key": "imageSide",
        "type": "radio",
        "label": "图片位置",
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
        "description": "大图所在的一侧。",
        "publicKey": "imageSide",
        "publicLabel": "图片位置",
        "desc": "大图所在的一侧。"
      },
      {
        "key": "showPins",
        "type": "toggle",
        "label": "标注点",
        "default": true,
        "description": "叠在图片上的编号圆点。",
        "publicKey": "showPins",
        "publicLabel": "标注点",
        "desc": "叠在图片上的编号圆点。"
      },
      {
        "key": "showLegend",
        "type": "toggle",
        "label": "图例列表",
        "default": true,
        "description": "编号对应的标题 + 说明列表。",
        "publicKey": "showLegend",
        "publicLabel": "图例列表",
        "desc": "编号对应的标题 + 说明列表。"
      },
      {
        "key": "radius",
        "type": "slider",
        "label": "圆角",
        "default": 14,
        "min": 0,
        "max": 28,
        "step": 2,
        "unit": "px",
        "description": "图片的圆角半径。",
        "publicKey": "radius",
        "publicLabel": "圆角",
        "desc": "图片的圆角半径。"
      },
      {
        "key": "focus",
        "type": "toggle",
        "label": "重点聚焦",
        "default": false,
        "description": "高亮某一个标注点及其图例，其余弱化。",
        "publicKey": "focus",
        "publicLabel": "重点聚焦",
        "desc": "高亮某一个标注点及其图例，其余弱化。"
      },
      {
        "key": "focusIndex",
        "type": "slider",
        "label": "聚焦第几项",
        "default": 1,
        "min": 1,
        "max": 5,
        "step": 1,
        "description": "需开启「重点聚焦」后生效，指定被高亮的标注。",
        "publicKey": "focusIndex",
        "publicLabel": "聚焦第几项",
        "desc": "需开启「重点聚焦」后生效，指定被高亮的标注。"
      }
    ],
    "defaultProps": {
      "markerCount": 4,
      "imageSide": "left",
      "showPins": true,
      "showLegend": true,
      "radius": 14,
      "focus": false,
      "focusIndex": 1,
      "idPrefix": "annotated",
      "tone": "dark"
    }
  },
  {
    "key": "theme10_page085",
    "themeKey": "theme10",
    "pageNumber": 85,
    "layout": "THEME10-085",
    "slot": "quoteimg",
    "label": "影像金句",
    "bgClass": "",
    "controls": [
      {
        "key": "tone",
        "type": "radio",
        "label": "页面底色",
        "default": "dark",
        "options": [
          {
            "value": "dark",
            "label": "深色",
            "image": "",
            "color": ""
          },
          {
            "value": "light",
            "label": "浅色",
            "image": "",
            "color": ""
          }
        ],
        "description": "整页深色或浅色底。",
        "publicKey": "tone",
        "publicLabel": "页面底色",
        "desc": "整页深色或浅色底。"
      },
      {
        "key": "imageSide",
        "type": "radio",
        "label": "图片位置",
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
        "description": "肖像所在的一侧。图片随上传比例自适应裁切填满。",
        "publicKey": "imageSide",
        "publicLabel": "图片位置",
        "desc": "肖像所在的一侧。图片随上传比例自适应裁切填满。"
      },
      {
        "key": "split",
        "type": "slider",
        "label": "图片宽度",
        "default": 42,
        "min": 32,
        "max": 52,
        "step": 2,
        "unit": "%",
        "description": "图片列占整页的宽度。",
        "publicKey": "split",
        "publicLabel": "图片宽度",
        "desc": "图片列占整页的宽度。"
      },
      {
        "key": "showMark",
        "type": "toggle",
        "label": "引号装饰",
        "default": true,
        "description": "金句左上角的大引号。",
        "publicKey": "showMark",
        "publicLabel": "引号装饰",
        "desc": "金句左上角的大引号。"
      },
      {
        "key": "showAttribution",
        "type": "toggle",
        "label": "署名",
        "default": true,
        "description": "金句下方的姓名 / 职务。",
        "publicKey": "showAttribution",
        "publicLabel": "署名",
        "desc": "金句下方的姓名 / 职务。"
      },
      {
        "key": "radius",
        "type": "slider",
        "label": "圆角",
        "default": 16,
        "min": 0,
        "max": 28,
        "step": 2,
        "unit": "px",
        "description": "图片的圆角半径。",
        "publicKey": "radius",
        "publicLabel": "圆角",
        "desc": "图片的圆角半径。"
      }
    ],
    "defaultProps": {
      "imageSide": "left",
      "split": 42,
      "showMark": true,
      "showAttribution": true,
      "radius": 16,
      "idPrefix": "quoteimg",
      "tone": "dark"
    }
  },
  {
    "key": "theme10_page086",
    "themeKey": "theme10",
    "pageNumber": 86,
    "layout": "THEME10-086",
    "slot": "venn",
    "label": "策略交集",
    "bgClass": "",
    "controls": [
      {
        "key": "tone",
        "type": "radio",
        "label": "页面底色",
        "default": "dark",
        "options": [
          {
            "value": "dark",
            "label": "深色",
            "image": "",
            "color": ""
          },
          {
            "value": "light",
            "label": "浅色",
            "image": "",
            "color": ""
          }
        ],
        "description": "整页深色或浅色底。",
        "publicKey": "tone",
        "publicLabel": "页面底色",
        "desc": "整页深色或浅色底。"
      },
      {
        "key": "circleCount",
        "type": "slider",
        "label": "圆圈数量",
        "default": 3,
        "min": 2,
        "max": 3,
        "step": 1,
        "description": "参与交集的集合 / 圆圈数。",
        "publicKey": "circleCount",
        "publicLabel": "圆圈数量",
        "desc": "参与交集的集合 / 圆圈数。"
      },
      {
        "key": "showCenter",
        "type": "toggle",
        "label": "交集高亮",
        "default": true,
        "description": "中心重叠处的「黄金交集」标记与说明。",
        "publicKey": "showCenter",
        "publicLabel": "交集高亮",
        "desc": "中心重叠处的「黄金交集」标记与说明。"
      },
      {
        "key": "showLegend",
        "type": "toggle",
        "label": "图例",
        "default": true,
        "description": "右侧逐个集合的名称 + 说明。",
        "publicKey": "showLegend",
        "publicLabel": "图例",
        "desc": "右侧逐个集合的名称 + 说明。"
      },
      {
        "key": "showDiscLabels",
        "type": "toggle",
        "label": "圆上标签",
        "default": true,
        "description": "直接落在每个圆上的简短名称。",
        "publicKey": "showDiscLabels",
        "publicLabel": "圆上标签",
        "desc": "直接落在每个圆上的简短名称。"
      },
      {
        "key": "focus",
        "type": "toggle",
        "label": "重点聚焦",
        "default": false,
        "description": "高亮某一个集合，其余弱化。",
        "publicKey": "focus",
        "publicLabel": "重点聚焦",
        "desc": "高亮某一个集合，其余弱化。"
      },
      {
        "key": "focusIndex",
        "type": "slider",
        "label": "聚焦第几项",
        "default": 1,
        "min": 1,
        "max": 3,
        "step": 1,
        "description": "需开启「重点聚焦」后生效，指定被高亮的集合。",
        "publicKey": "focusIndex",
        "publicLabel": "聚焦第几项",
        "desc": "需开启「重点聚焦」后生效，指定被高亮的集合。"
      }
    ],
    "defaultProps": {
      "circleCount": 3,
      "showCenter": true,
      "showLegend": true,
      "showDiscLabels": true,
      "focus": false,
      "focusIndex": 1,
      "idPrefix": "venn",
      "tone": "dark"
    }
  },
  {
    "key": "theme10_page087",
    "themeKey": "theme10",
    "pageNumber": 87,
    "layout": "THEME10-087",
    "slot": "balance",
    "label": "权衡天平",
    "bgClass": "",
    "controls": [
      {
        "key": "tone",
        "type": "radio",
        "label": "页面底色",
        "default": "dark",
        "options": [
          {
            "value": "dark",
            "label": "深色",
            "image": "",
            "color": ""
          },
          {
            "value": "light",
            "label": "浅色",
            "image": "",
            "color": ""
          }
        ],
        "description": "整页深色或浅色底。",
        "publicKey": "tone",
        "publicLabel": "页面底色",
        "desc": "整页深色或浅色底。"
      },
      {
        "key": "tilt",
        "type": "radio",
        "label": "天平倾向",
        "default": "right",
        "options": [
          {
            "value": "left",
            "label": "左"
          },
          {
            "value": "level",
            "label": "平"
          },
          {
            "value": "right",
            "label": "右"
          }
        ],
        "description": "横梁倒向较重的一侧（左 / 持平 / 右）。",
        "publicKey": "tilt",
        "publicLabel": "天平倾向",
        "desc": "横梁倒向较重的一侧（左 / 持平 / 右）。"
      },
      {
        "key": "itemCount",
        "type": "slider",
        "label": "每侧条目",
        "default": 3,
        "min": 2,
        "max": 4,
        "step": 1,
        "description": "每侧列出的权衡要点条数。",
        "publicKey": "itemCount",
        "publicLabel": "每侧条目",
        "desc": "每侧列出的权衡要点条数。"
      },
      {
        "key": "showWeights",
        "type": "toggle",
        "label": "托盘标记",
        "default": true,
        "description": "托盘内显示「重量」标签（关则显示名称）。",
        "publicKey": "showWeights",
        "publicLabel": "托盘标记",
        "desc": "托盘内显示「重量」标签（关则显示名称）。"
      },
      {
        "key": "showVerdict",
        "type": "toggle",
        "label": "结论句",
        "default": true,
        "description": "天平下方的一句结论。",
        "publicKey": "showVerdict",
        "publicLabel": "结论句",
        "desc": "天平下方的一句结论。"
      }
    ],
    "defaultProps": {
      "tilt": "right",
      "itemCount": 3,
      "showWeights": true,
      "showVerdict": true,
      "idPrefix": "balance",
      "tone": "dark"
    }
  },
  {
    "key": "theme10_page088",
    "themeKey": "theme10",
    "pageNumber": 88,
    "layout": "THEME10-088",
    "slot": "tornado",
    "label": "敏感性分析",
    "bgClass": "",
    "controls": [
      {
        "key": "tone",
        "type": "radio",
        "label": "页面底色",
        "default": "dark",
        "options": [
          {
            "value": "dark",
            "label": "深色",
            "image": "",
            "color": ""
          },
          {
            "value": "light",
            "label": "浅色",
            "image": "",
            "color": ""
          }
        ],
        "description": "整页深色或浅色底。",
        "publicKey": "tone",
        "publicLabel": "页面底色",
        "desc": "整页深色或浅色底。"
      },
      {
        "key": "factorCount",
        "type": "slider",
        "label": "变量数量",
        "default": 6,
        "min": 2,
        "max": 7,
        "step": 1,
        "description": "参与敏感性分析的驱动变量条数（自动按总摆幅排序）。",
        "publicKey": "factorCount",
        "publicLabel": "变量数量",
        "desc": "参与敏感性分析的驱动变量条数（自动按总摆幅排序）。"
      },
      {
        "key": "showValues",
        "type": "toggle",
        "label": "数值标注",
        "default": true,
        "description": "每根条形末端显示 ± 影响幅度。",
        "publicKey": "showValueLabels",
        "publicLabel": "数值标注",
        "desc": "每根条形末端显示 ± 影响幅度。"
      },
      {
        "key": "showBaseline",
        "type": "toggle",
        "label": "基准轴",
        "default": true,
        "description": "中央基准参考线与底部基准情形说明。",
        "publicKey": "showBaseline",
        "publicLabel": "基准轴",
        "desc": "中央基准参考线与底部基准情形说明。"
      },
      {
        "key": "focus",
        "type": "toggle",
        "label": "重点聚焦",
        "default": false,
        "description": "高亮某一个变量，其余弱化。",
        "publicKey": "focus",
        "publicLabel": "重点聚焦",
        "desc": "高亮某一个变量，其余弱化。"
      },
      {
        "key": "focusIndex",
        "type": "slider",
        "label": "聚焦第几项",
        "default": 1,
        "min": 1,
        "max": 7,
        "step": 1,
        "description": "需开启「重点聚焦」后生效，指定被高亮的变量（按排序后顺序）。",
        "publicKey": "focusIndex",
        "publicLabel": "聚焦第几项",
        "desc": "需开启「重点聚焦」后生效，指定被高亮的变量（按排序后顺序）。"
      }
    ],
    "defaultProps": {
      "factorCount": 6,
      "showValues": true,
      "showBaseline": true,
      "focus": false,
      "focusIndex": 1,
      "idPrefix": "tornado",
      "tone": "dark"
    }
  },
  {
    "key": "theme10_page089",
    "themeKey": "theme10",
    "pageNumber": 89,
    "layout": "THEME10-089",
    "slot": "stream",
    "label": "主题河流",
    "bgClass": "",
    "controls": [
      {
        "key": "tone",
        "type": "radio",
        "label": "页面底色",
        "default": "dark",
        "options": [
          {
            "value": "dark",
            "label": "深色",
            "image": "",
            "color": ""
          },
          {
            "value": "light",
            "label": "浅色",
            "image": "",
            "color": ""
          }
        ],
        "description": "整页深色或浅色底。",
        "publicKey": "tone",
        "publicLabel": "页面底色",
        "desc": "整页深色或浅色底。"
      },
      {
        "key": "seriesCount",
        "type": "slider",
        "label": "系列数量",
        "default": 5,
        "min": 3,
        "max": 6,
        "step": 1,
        "description": "河流中堆叠的系列（资产类别）数量。",
        "publicKey": "seriesCount",
        "publicLabel": "系列数量",
        "desc": "河流中堆叠的系列（资产类别）数量。"
      },
      {
        "key": "showLegend",
        "type": "toggle",
        "label": "图例",
        "default": true,
        "description": "底部颜色 → 系列对照。",
        "publicKey": "showLegend",
        "publicLabel": "图例",
        "desc": "底部颜色 → 系列对照。"
      },
      {
        "key": "showAxis",
        "type": "toggle",
        "label": "时间刻度",
        "default": true,
        "description": "河流下方的周期刻度。",
        "publicKey": "showAxis",
        "publicLabel": "时间刻度",
        "desc": "河流下方的周期刻度。"
      },
      {
        "key": "focus",
        "type": "toggle",
        "label": "重点聚焦",
        "default": false,
        "description": "高亮某一条河带，其余弱化。",
        "publicKey": "focus",
        "publicLabel": "重点聚焦",
        "desc": "高亮某一条河带，其余弱化。"
      },
      {
        "key": "focusIndex",
        "type": "slider",
        "label": "聚焦第几项",
        "default": 1,
        "min": 1,
        "max": 6,
        "step": 1,
        "description": "需开启「重点聚焦」后生效，指定被高亮的系列。",
        "publicKey": "focusIndex",
        "publicLabel": "聚焦第几项",
        "desc": "需开启「重点聚焦」后生效，指定被高亮的系列。"
      }
    ],
    "defaultProps": {
      "seriesCount": 5,
      "showLegend": true,
      "showAxis": true,
      "focus": false,
      "focusIndex": 1,
      "idPrefix": "stream",
      "tone": "dark"
    }
  },
  {
    "key": "theme10_page090",
    "themeKey": "theme10",
    "pageNumber": 90,
    "layout": "THEME10-090",
    "slot": "quilt",
    "label": "资产拼花",
    "bgClass": "",
    "controls": [
      {
        "key": "tone",
        "type": "radio",
        "label": "页面底色",
        "default": "dark",
        "options": [
          {
            "value": "dark",
            "label": "深色",
            "image": "",
            "color": ""
          },
          {
            "value": "light",
            "label": "浅色",
            "image": "",
            "color": ""
          }
        ],
        "description": "整页深色或浅色底。",
        "publicKey": "tone",
        "publicLabel": "页面底色",
        "desc": "整页深色或浅色底。"
      },
      {
        "key": "colCount",
        "type": "slider",
        "label": "区间列数",
        "default": 5,
        "min": 4,
        "max": 6,
        "step": 1,
        "description": "展示的周期（年份）列数。",
        "publicKey": "colCount",
        "publicLabel": "区间列数",
        "desc": "展示的周期（年份）列数。"
      },
      {
        "key": "assetCount",
        "type": "slider",
        "label": "资产类别",
        "default": 7,
        "min": 5,
        "max": 8,
        "step": 1,
        "description": "参与排名的资产类别数（即每列瓦片数与图例项数）。",
        "publicKey": "categoryCount",
        "publicLabel": "资产类别",
        "desc": "参与排名的资产类别数（即每列瓦片数与图例项数）。"
      },
      {
        "key": "showLegend",
        "type": "toggle",
        "label": "图例",
        "default": true,
        "description": "底部颜色 → 资产类别对照。",
        "publicKey": "showLegend",
        "publicLabel": "图例",
        "desc": "底部颜色 → 资产类别对照。"
      },
      {
        "key": "highlight",
        "type": "toggle",
        "label": "追踪某类",
        "default": false,
        "description": "高亮某一资产类别在各年份的瓦片，串成其名次路径。",
        "publicKey": "highlight",
        "publicLabel": "追踪某类",
        "desc": "高亮某一资产类别在各年份的瓦片，串成其名次路径。"
      },
      {
        "key": "highlightIndex",
        "type": "slider",
        "label": "追踪第几类",
        "default": 1,
        "min": 1,
        "max": 8,
        "step": 1,
        "description": "需开启「追踪某类」后生效，按图例顺序指定。",
        "publicKey": "highlightIndex",
        "publicLabel": "追踪第几类",
        "desc": "需开启「追踪某类」后生效，按图例顺序指定。"
      }
    ],
    "defaultProps": {
      "colCount": 5,
      "assetCount": 7,
      "showLegend": true,
      "highlight": false,
      "highlightIndex": 1,
      "idPrefix": "quilt",
      "tone": "dark"
    }
  },
  {
    "key": "theme10_page091",
    "themeKey": "theme10",
    "pageNumber": 91,
    "layout": "THEME10-091",
    "slot": "hive",
    "label": "蜂窝指标",
    "bgClass": "",
    "controls": [
      {
        "key": "tone",
        "type": "radio",
        "label": "页面底色",
        "default": "dark",
        "options": [
          {
            "value": "dark",
            "label": "深色",
            "image": "",
            "color": ""
          },
          {
            "value": "light",
            "label": "浅色",
            "image": "",
            "color": ""
          }
        ],
        "description": "整页深色或浅色底。",
        "publicKey": "tone",
        "publicLabel": "页面底色",
        "desc": "整页深色或浅色底。"
      },
      {
        "key": "tileCount",
        "type": "slider",
        "label": "指标数量",
        "default": 6,
        "min": 4,
        "max": 7,
        "step": 1,
        "description": "蜂窝中的指标六边形数量。",
        "publicKey": "tileCount",
        "publicLabel": "指标数量",
        "desc": "蜂窝中的指标六边形数量。"
      },
      {
        "key": "showLeadHex",
        "type": "toggle",
        "label": "引导蜂格",
        "default": true,
        "description": "蜂窝起始的标题 / 说明六边形。",
        "publicKey": "showLeadHex",
        "publicLabel": "引导蜂格",
        "desc": "蜂窝起始的标题 / 说明六边形。"
      },
      {
        "key": "showUnits",
        "type": "toggle",
        "label": "单位标注",
        "default": true,
        "description": "每个数字旁的单位（% / SHARPE / 只 …）。",
        "publicKey": "showUnits",
        "publicLabel": "单位标注",
        "desc": "每个数字旁的单位（% / SHARPE / 只 …）。"
      },
      {
        "key": "focus",
        "type": "toggle",
        "label": "重点聚焦",
        "default": false,
        "description": "高亮某一个指标，其余弱化。",
        "publicKey": "focus",
        "publicLabel": "重点聚焦",
        "desc": "高亮某一个指标，其余弱化。"
      },
      {
        "key": "focusIndex",
        "type": "slider",
        "label": "聚焦第几项",
        "default": 1,
        "min": 1,
        "max": 7,
        "step": 1,
        "description": "需开启「重点聚焦」后生效，指定被高亮的指标。",
        "publicKey": "focusIndex",
        "publicLabel": "聚焦第几项",
        "desc": "需开启「重点聚焦」后生效，指定被高亮的指标。"
      }
    ],
    "defaultProps": {
      "tileCount": 6,
      "showLeadHex": true,
      "showUnits": true,
      "focus": false,
      "focusIndex": 1,
      "idPrefix": "hive",
      "tone": "dark"
    }
  },
  {
    "key": "theme10_page092",
    "themeKey": "theme10",
    "pageNumber": 92,
    "layout": "THEME10-092",
    "slot": "exhibit",
    "label": "标的档案",
    "bgClass": "",
    "controls": [
      {
        "key": "tone",
        "type": "radio",
        "label": "页面底色",
        "default": "light",
        "options": [
          {
            "value": "dark",
            "label": "深色",
            "image": "",
            "color": ""
          },
          {
            "value": "light",
            "label": "浅色",
            "image": "",
            "color": ""
          }
        ],
        "description": "整页深色或浅色底。",
        "publicKey": "tone",
        "publicLabel": "页面底色",
        "desc": "整页深色或浅色底。"
      },
      {
        "key": "imageSide",
        "type": "radio",
        "label": "图片位置",
        "default": "left",
        "options": [
          {
            "value": "left",
            "label": "左"
          },
          {
            "value": "right",
            "label": "右"
          }
        ],
        "description": "影像档案框位于左侧或右侧。",
        "publicKey": "imageSide",
        "publicLabel": "图片位置",
        "desc": "影像档案框位于左侧或右侧。"
      },
      {
        "key": "rowCount",
        "type": "slider",
        "label": "档案行数",
        "default": 5,
        "min": 3,
        "max": 7,
        "step": 1,
        "description": "右侧规格表的字段行数。",
        "publicKey": "rowCount",
        "publicLabel": "档案行数",
        "desc": "右侧规格表的字段行数。"
      },
      {
        "key": "showThesis",
        "type": "toggle",
        "label": "一句逻辑",
        "default": true,
        "description": "规格表下方的一句持有逻辑。",
        "publicKey": "showThesis",
        "publicLabel": "一句逻辑",
        "desc": "规格表下方的一句持有逻辑。"
      },
      {
        "key": "showTags",
        "type": "toggle",
        "label": "标签行",
        "default": true,
        "description": "底部的属性标签胶囊。",
        "publicKey": "showTags",
        "publicLabel": "标签行",
        "desc": "底部的属性标签胶囊。"
      },
      {
        "key": "showFileLabel",
        "type": "toggle",
        "label": "档案封边",
        "default": true,
        "description": "影像框侧边的竖排「DOSSIER」编号封边。",
        "publicKey": "showFileLabel",
        "publicLabel": "档案封边",
        "desc": "影像框侧边的竖排「DOSSIER」编号封边。"
      }
    ],
    "defaultProps": {
      "imageSide": "left",
      "rowCount": 5,
      "showThesis": true,
      "showTags": true,
      "showFileLabel": true,
      "idPrefix": "exhibit",
      "tone": "light"
    }
  },
  {
    "key": "theme10_page093",
    "themeKey": "theme10",
    "pageNumber": 93,
    "layout": "THEME10-093",
    "slot": "medallions",
    "label": "圆形图集",
    "bgClass": "",
    "controls": [
      {
        "key": "tone",
        "type": "radio",
        "label": "页面底色",
        "default": "dark",
        "options": [
          {
            "value": "dark",
            "label": "深色",
            "image": "",
            "color": ""
          },
          {
            "value": "light",
            "label": "浅色",
            "image": "",
            "color": ""
          }
        ],
        "description": "整页深色或浅色底。",
        "publicKey": "tone",
        "publicLabel": "页面底色",
        "desc": "整页深色或浅色底。"
      },
      {
        "key": "imageCount",
        "type": "slider",
        "label": "内容数量",
        "default": 5,
        "min": 0,
        "max": 6,
        "step": 1,
        "description": "圆形内容项的数量（0 为空态提示）；数量越少单项越大。",
        "publicKey": "imageCount",
        "publicLabel": "内容数量",
        "desc": "圆形内容项的数量（0 为空态提示）；数量越少单项越大。"
      },
      {
        "key": "arc",
        "type": "toggle",
        "label": "弧形排布",
        "default": true,
        "description": "让中间内容项微微抬起，形成弧线；关则平排。",
        "publicKey": "arc",
        "publicLabel": "弧形排布",
        "desc": "让中间内容项微微抬起，形成弧线；关则平排。"
      },
      {
        "key": "showLabels",
        "type": "toggle",
        "label": "标题标注",
        "default": true,
        "description": "每个内容项下方的主标签 + 副标签。",
        "publicKey": "showLabels",
        "publicLabel": "标题标注",
        "desc": "每个内容项下方的主标签 + 副标签。"
      },
      {
        "key": "showLead",
        "type": "toggle",
        "label": "引导段落",
        "default": true,
        "description": "标题右侧的一段引导说明。",
        "publicKey": "showLead",
        "publicLabel": "引导段落",
        "desc": "标题右侧的一段引导说明。"
      }
    ],
    "defaultProps": {
      "imageCount": 5,
      "arc": true,
      "showLabels": true,
      "showLead": true,
      "idPrefix": "medallions",
      "tone": "dark"
    }
  },
  {
    "key": "theme10_page094",
    "themeKey": "theme10",
    "pageNumber": 94,
    "layout": "THEME10-094",
    "slot": "glossary",
    "label": "名词释义",
    "bgClass": "",
    "controls": [
      {
        "key": "tone",
        "type": "radio",
        "label": "页面底色",
        "default": "light",
        "options": [
          {
            "value": "dark",
            "label": "深色",
            "image": "",
            "color": ""
          },
          {
            "value": "light",
            "label": "浅色",
            "image": "",
            "color": ""
          }
        ],
        "description": "整页深色或浅色底。",
        "publicKey": "tone",
        "publicLabel": "页面底色",
        "desc": "整页深色或浅色底。"
      },
      {
        "key": "itemCount",
        "type": "slider",
        "label": "词条数量",
        "default": 6,
        "min": 4,
        "max": 8,
        "step": 1,
        "description": "展示的名词释义条数。",
        "publicKey": "itemCount",
        "publicLabel": "词条数量",
        "desc": "展示的名词释义条数。"
      },
      {
        "key": "columns",
        "type": "slider",
        "label": "列数",
        "default": 2,
        "min": 1,
        "max": 2,
        "step": 1,
        "description": "单列长表或双列并排。",
        "publicKey": "columns",
        "publicLabel": "列数",
        "desc": "单列长表或双列并排。"
      },
      {
        "key": "showIndex",
        "type": "toggle",
        "label": "序号",
        "default": true,
        "description": "每个词条前的 01.. 计数。",
        "publicKey": "showIndex",
        "publicLabel": "序号",
        "desc": "每个词条前的 01.. 计数。"
      },
      {
        "key": "focus",
        "type": "toggle",
        "label": "重点聚焦",
        "default": false,
        "description": "高亮某一个词条，其余弱化。",
        "publicKey": "focus",
        "publicLabel": "重点聚焦",
        "desc": "高亮某一个词条，其余弱化。"
      },
      {
        "key": "focusIndex",
        "type": "slider",
        "label": "聚焦第几项",
        "default": 1,
        "min": 1,
        "max": 8,
        "step": 1,
        "description": "需开启「重点聚焦」后生效，指定被高亮的词条。",
        "publicKey": "focusIndex",
        "publicLabel": "聚焦第几项",
        "desc": "需开启「重点聚焦」后生效，指定被高亮的词条。"
      }
    ],
    "defaultProps": {
      "itemCount": 6,
      "columns": 2,
      "showIndex": true,
      "focus": false,
      "focusIndex": 1,
      "idPrefix": "glossary",
      "tone": "light"
    }
  },
  {
    "key": "theme10_page095",
    "themeKey": "theme10",
    "pageNumber": 95,
    "layout": "THEME10-095",
    "slot": "closing",
    "label": "结束",
    "bgClass": "",
    "controls": [
      {
        "key": "theme",
        "type": "select",
        "label": "背景主题",
        "default": "dusk",
        "options": [
          {
            "value": "dusk",
            "label": "暮光"
          },
          {
            "value": "midnight",
            "label": "午夜"
          },
          {
            "value": "graphite",
            "label": "石墨"
          },
          {
            "value": "dawn",
            "label": "晨光"
          },
          {
            "value": "paper",
            "label": "纸白"
          }
        ],
        "description": "背景渐变。",
        "publicKey": "theme",
        "publicLabel": "背景主题",
        "desc": "背景渐变。"
      },
      {
        "key": "align",
        "type": "radio",
        "label": "对齐",
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
        "description": "内容对齐。",
        "publicKey": "align",
        "publicLabel": "对齐",
        "desc": "内容对齐。"
      },
      {
        "key": "showContact",
        "type": "toggle",
        "label": "联系方式",
        "default": true,
        "description": "底部联系方式列表。",
        "publicKey": "showContact",
        "publicLabel": "联系方式",
        "desc": "底部联系方式列表。"
      },
      {
        "key": "showQR",
        "type": "toggle",
        "label": "二维码",
        "default": false,
        "description": "可上传二维码图片槽。",
        "publicKey": "showQR",
        "publicLabel": "二维码",
        "desc": "可上传二维码图片槽。"
      }
    ],
    "defaultProps": {
      "theme": "dusk",
      "align": "left",
      "showContact": true,
      "showQR": false,
      "idPrefix": "closing"
    }
  }
];
