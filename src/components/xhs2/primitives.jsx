import React from 'react';
import { MediaPlaceholder } from '../blacktech/primitives.jsx';
import { SlideShell } from '../shell/index.jsx';

export function Xhs2Slide({ layout, tone = 'dark', accent = 'yellow', children, footer, className = '' }) {
  const chromeTone = tone === 'yellow' ? 'light' : 'dark';
  return (
    <SlideShell layout={layout} tone={chromeTone} animate="cascade" className={`xhs2-slide xhs2-${tone} xhs2-accent-${accent} ${className}`.trim()}>
      <div className="xhs2-frame">
        {children}
        {footer ? <Footer {...footer} /> : null}
      </div>
    </SlideShell>
  );
}

export function Top({ label, page, accent = 'yellow' }) {
  return (
    <div className="xhs2-top">
      <div className={`xhs2-eyebrow ${accent}`}>{label}</div>
      <div className="xhs2-page">{page}</div>
    </div>
  );
}

export function Footer({ left, page }) {
  return (
    <div className="xhs2-footer">
      <div>{left}</div>
      <div>{page}</div>
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

export function Card({ kicker, title, body, tone = '', children }) {
  return (
    <div className={`xhs2-card ${tone}`.trim()}>
      {kicker ? <div className="xhs2-kicker">{kicker}</div> : null}
      {title ? <h3><Lines lines={title} /></h3> : null}
      {body ? <p><Lines lines={body} /></p> : null}
      {children}
    </div>
  );
}

export function Placeholder({ label, ratio = '16/9', light = false }) {
  const slotLabel = Array.isArray(label) ? label.join('-') : label;
  const slotId = `xhs2-media-${String(slotLabel || ratio).replace(/\s+/g, '-').toLowerCase()}`;
  return <MediaPlaceholder className={`xhs2-ph xhs2-media-placeholder ${light ? 'light' : ''}`.trim()} slotId={slotId} style={{ aspectRatio: ratio }} />;
}

export function CardGrid({ items, columns = 3 }) {
  return (
    <div className={`xhs2-grid cols-${columns}`}>
      {items.map((item, index) => <Card key={`${item.title || item.kicker}-${index}`} {...item} />)}
    </div>
  );
}

export function Statement({ layout, label, page, title, body, tone = 'dark', accent = 'yellow', footerLeft }) {
  return (
    <Xhs2Slide layout={layout} tone={tone} accent={accent} footer={{ left: footerLeft, page }}>
      <Top label={label} page={page} accent={accent} />
      <div className="xhs2-statement">
        <h1><Lines lines={title} /></h1>
        {body ? <p><Lines lines={body} /></p> : null}
      </div>
    </Xhs2Slide>
  );
}

export function Split({ layout, label, page, title, body, side, tone = 'dark', accent = 'yellow', footerLeft }) {
  return (
    <Xhs2Slide layout={layout} tone={tone} accent={accent} footer={{ left: footerLeft, page }}>
      <Top label={label} page={page} accent={accent} />
      <div className="xhs2-split">
        <div>
          <h1 className="xhs2-title"><Lines lines={title} /></h1>
          {body ? <p className="xhs2-body"><Lines lines={body} /></p> : null}
        </div>
        <div className="xhs2-side">{side}</div>
      </div>
    </Xhs2Slide>
  );
}
