import React from 'react';
import { MediaPlaceholder } from '../blacktech/primitives.jsx';
import { ChartSwitch } from '../charts/index.jsx';
import { SlideShell } from '../shell/index.jsx';

export function ReportSlide({ layout, tone = 'light', className = '', children }) {
  const chromeTone = ['dark', 'red', 'blue', 'ink'].includes(tone) ? 'dark' : 'light';
  return (
    <SlideShell layout={layout} tone={chromeTone} animate="cascade" className={`report-slide ${className}`.trim()}>
      {children}
    </SlideShell>
  );
}

export function Mark() {
  return (
    <div className="rp-mark" data-editable-skip="true">
      <span className="rp-slash" />
      <span data-editable-id="report-brand" data-sync-text="report-brand">NW LABS</span>
    </div>
  );
}

export function Footer({ left, right }) {
  return (
    <div className="rp-footer">
      <div>{left}</div>
      <div data-editable-id="report-footer-right" data-sync-text="report-footer-right">{right}</div>
    </div>
  );
}

export function Lines({ lines }) {
  const value = Array.isArray(lines) ? lines : String(lines || '').split('\n');
  return (
    <>
      {value.map((line, index) => (
        <React.Fragment key={`${line}-${index}`}>
          {line}
          {index < value.length - 1 ? <br /> : null}
        </React.Fragment>
      ))}
    </>
  );
}

export function TopBar({ eyebrow }) {
  return (
    <div className="rp-between">
      <div className="rp-eyebrow">{eyebrow}</div>
      <Mark />
    </div>
  );
}

export function StatGrid({ stats }) {
  return (
    <div className="rp-stat-grid">
      {stats.map((stat) => (
        <div className={`rp-stat ${stat.dark ? 'is-dark' : ''}`} key={stat.label}>
          <div className="rp-stat-label">{stat.label}</div>
          <div className={`rp-stat-num ${stat.color || ''}`}>{stat.value}</div>
          <div className="rp-stat-note">{stat.note}</div>
        </div>
      ))}
    </div>
  );
}

export function ChartBars({ rows }) {
  return <ChartSwitch title="渠道管道额" rows={rows} className="rp-chart-switch" />;
}

export function QuarterPage({ layout, tone, eyebrow, titleTop, titleAccent, body, meta }) {
  return (
    <ReportSlide layout={layout} tone={tone} className={`rp-${tone} rp-has-right-media`}>
      <div className="rp-page">
        <div className="rp-qsection">
          <div className="rp-qcopy">
            <TopBar eyebrow={eyebrow} />
            <div>
              <div className="rp-title xl">{titleTop}<br /><span>{titleAccent}</span></div>
              <p className="rp-body"><Lines lines={body} /></p>
            </div>
            <div className="rp-meta-row">
              {meta.map(([label, value]) => <div key={label}>{label} · <strong>{value}</strong></div>)}
            </div>
          </div>
          <MediaPlaceholder slotId={`${layout.toLowerCase()}-media`} className="rp-media-half" />
        </div>
      </div>
    </ReportSlide>
  );
}
