import React from 'react';
import { slide } from '../../src/options.jsx';

const metrics = [
  { label: 'ARR', value: '¥48M', note: '同比增长 92%' },
  { label: 'NRR', value: '118%', note: '续费与扩容同步改善' },
  { label: 'MAU', value: '3.2M', note: '年度峰值月活' },
  { label: 'CSAT', value: '4.6', note: '企业客户平均评分' },
];

export default {
  style: 'swiss',
  theme: process.env.GUIZANG_THEME || 'ikb',
  fontSet: process.env.GUIZANG_FONT || 'inter',
  title: '组件化瑞士风演示',
  slides: [
    slide('cover', {
      title: '组件化生成',
      kicker: 'OPTION REGISTRY / STATIC HTML',
      lead: '主题、字体组合和每页布局都从登记选项里多选一；最终仍输出静态 HTML deck。',
      meta: 'Guizang PPT Skill · Option Demo',
      issue: 'OPT · 01 / 07',
    }),
    slide('timeline', {
      page: '02 / 07',
      title: '先沉淀结构，再填内容',
      kicker: 'GENERATION FLOW',
      nodes: [
        { label: '01', value: 'Theme', body: '从主题色选项中选一套，锁住 accent 与反色。' },
        { label: '02', value: 'Font', body: '从字体组合中选一套，控制中文、西文和等宽字体。' },
        { label: '03', value: 'Layout', body: '每页从版式选项中 n 选 1，再填写内容。', accent: true },
        { label: '04', value: 'HTML', body: '渲染进模板，保留翻页、Motion One 与低功耗模式。' },
      ],
      metrics,
    }),
    slide('sixCells', {
      page: '03 / 07',
      title: '组件化的是选择逻辑',
      kicker: 'OPTION ROLES',
      cells: [
        { icon: 'palette', title: '主题色', body: '一个 deck 只选一个 theme key。' },
        { icon: 'type', title: '字体组合', body: '一个 deck 只选一个 fontSet key。' },
        { icon: 'layout-grid', title: '页面版式', body: '每页只选一个 layout key。', accent: true },
        { icon: 'image', title: '媒体槽位', body: '图片比例由所选版式约束。' },
        { icon: 'sparkles', title: '动效 recipe', body: '版式组件声明动画语义。' },
        { icon: 'file-code-2', title: '静态输出', body: 'React 不进入最终运行时。' },
      ],
    }),
    slide('kpiTower', {
      page: '04 / 07',
      title: '指标页只暴露内容',
      kicker: 'KPI TOWER',
      lead: '组件把图标、塔高、accent 强调和文字层级固定下来，生成者只填业务含义。',
      towers: [
        { icon: 'trending-up', label: 'Speed', value: '3.1x', body: '从大纲到初稿的平均速度', height: 3 },
        { icon: 'blocks', label: 'Reuse', value: '62%', body: '版式结构复用率', height: 4, accent: true },
        { icon: 'scan-eye', label: 'QA', value: '14', body: '自动检查项覆盖', height: 2 },
        { icon: 'file-code-2', label: 'Output', value: 'HTML', body: '最终仍可离线打开', height: 1 },
      ],
    }),
    slide('hBar', {
      page: '05 / 07',
      title: '生成层越稳，视觉返工越少',
      kicker: 'IMPACT',
      label: 'WHERE COMPONENTS HELP',
      rows: [
        { label: '主题一致性', width: '92%', value: '92%', accent: true },
        { label: '文字层级', width: '84%', value: '84%' },
        { label: '图片比例', width: '76%', value: '76%' },
        { label: '动效标记', width: '68%', value: '68%' },
        { label: '页脚页码', width: '61%', value: '61%' },
      ],
    }),
    slide('imageHero', {
      page: '06 / 07',
      title: '需要图片时，组件先锁住槽位',
      kicker: 'IMAGE SLOT',
      stats: metrics,
    }),
    slide('closing', {
      title: 'Choose once. Compose often.',
      note: '组件化不是增加抽象，而是把反复出现的设计决策变成清晰的选项。',
      author: 'Guizang PPT Skill',
      date: '2026',
      takeaways: [
        { title: '模板继续负责运行时', body: '翻页、背景、低功耗和 Motion One 不需要 React 接管。' },
        { title: '配置只做多选一', body: '主题、字体、版式都从 registry 里选，不临时发明。' },
        { title: '最终交付保持静态', body: '输出仍是 index.html，可直接预览、截图和交付。' },
      ],
    }),
  ],
};
