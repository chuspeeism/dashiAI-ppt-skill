import React from 'react';
import { slide } from '../../src/options.jsx';

const metrics = [
  { label: 'Latency', value: '420ms', note: '核心链路 P95' },
  { label: 'Save', value: '31%', note: '推理成本下降' },
  { label: 'Adopt', value: '74%', note: '一线团队周活跃' },
  { label: 'Risk', value: '0.8%', note: '人工复核命中率' },
];

export default {
  style: 'swiss',
  theme: 'ikb',
  fontSet: 'inter',
  title: 'AI 运营系统季度复盘',
  slides: [
    slide('cover', {
      title: 'AI 运营系统',
      kicker: 'OPERATING REVIEW / Q2',
      lead: '从模型能力展示，转向可度量、可回滚、可交接的日常运营系统。',
      meta: 'Platform Team · Internal Review',
      issue: 'AI · 01 / 06',
    }),
    slide('timeline', {
      page: '02 / 06',
      title: '四个阶段把试点变成系统',
      kicker: 'ROLL OUT',
      nodes: [
        { label: 'W01', value: 'Pilot', body: '限定客服知识库，建立问题分类和人工兜底。' },
        { label: 'W04', value: 'Guard', body: '加入评测集、审计日志和灰度开关。' },
        { label: 'W08', value: 'Scale', body: '接入销售、运营、成功三条工作流。', accent: true },
        { label: 'W12', value: 'Run', body: '进入周度复盘节奏，异常按运行手册处理。' },
      ],
      metrics,
    }),
    slide('kpiTower', {
      page: '03 / 06',
      title: '系统价值来自稳定性',
      kicker: 'OPERATING METRICS',
      lead: '这页强调运维视角，KPI 不是炫技，而是说明系统是否能被业务长期使用。',
      towers: [
        { icon: 'zap', label: 'Latency', value: '420ms', body: 'P95 响应延迟', height: 2 },
        { icon: 'wallet', label: 'Cost', value: '-31%', body: '单位任务推理成本', height: 3 },
        { icon: 'users', label: 'Adopt', value: '74%', body: '目标团队周活跃', height: 4, accent: true },
        { icon: 'shield-check', label: 'Risk', value: '0.8%', body: '高风险输出比例', height: 1 },
      ],
    }),
    slide('hBar', {
      page: '04 / 06',
      title: '收益先出现在高频任务',
      kicker: 'TASK MIX',
      label: 'WEEKLY AUTOMATION SHARE',
      rows: [
        { label: '工单摘要', width: '91%', value: '91%', accent: true },
        { label: '销售线索整理', width: '78%', value: '78%' },
        { label: '知识库问答', width: '66%', value: '66%' },
        { label: '客户健康度备注', width: '51%', value: '51%' },
        { label: '会议纪要归档', width: '39%', value: '39%' },
      ],
    }),
    slide('sixCells', {
      page: '05 / 06',
      title: '下一步只补系统短板',
      kicker: 'NEXT SYSTEM WORK',
      cells: [
        { icon: 'database', title: '评测集', body: '从真实失败样本持续回填。' },
        { icon: 'route', title: '路由', body: '按任务价值选择模型和工具。', accent: true },
        { icon: 'file-lock-2', title: '权限', body: '敏感字段默认最小可见。' },
        { icon: 'history', title: '回滚', body: '每条自动化都有人工接管点。' },
        { icon: 'gauge', title: '成本', body: '把单位任务成本纳入看板。' },
        { icon: 'book-open-check', title: '手册', body: '让业务能独立处理常见异常。' },
      ],
    }),
    slide('closing', {
      title: 'Stop demoing. Start operating.',
      note: '真正可复用的 AI 能力，最后都会长成运行机制，而不是一次演示。',
      author: 'AI Platform Team',
      date: 'Q2',
      takeaways: [
        { title: '稳定性优先于炫技', body: '业务采用来自可预测，而不是来自惊艳。' },
        { title: '评测是运行资产', body: '每次失败都必须沉淀成下一轮保护。' },
        { title: '系统要可交接', body: '没有运行手册的自动化，不算真正上线。' },
      ],
    }),
  ],
};
