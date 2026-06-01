import React from 'react';
import { MediaPlaceholder } from '../blacktech/primitives.jsx';
import { SlideShell } from '../shell/index.jsx';

export function XhsSlide({ layout, tone = 'dark', accent = 'lime', className = '', children, footer }) {
  const chromeTone = tone === 'lime' || tone === 'cream' ? 'light' : 'dark';
  return (
    <SlideShell layout={layout} tone={chromeTone} animate="cascade" className={`xhs-slide xhs-${tone} xhs-accent-${accent} ${className}`.trim()}>
      <div className="xhs-frame">
        {children}
        {footer ? <XhsFooter {...footer} /> : null}
      </div>
    </SlideShell>
  );
}

export function XhsTop({ eyebrow, page }) {
  return (
    <div className="xhs-top">
      <div className="xhs-eyebrow">{eyebrow}</div>
      <div className="xhs-page">{page}</div>
    </div>
  );
}

export function XhsFooter({ left, page }) {
  return (
    <div className="xhs-footer">
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

export function XhsCard({ kicker, title, body, tone = '', children }) {
  return (
    <div className={`xhs-card ${tone}`.trim()}>
      {kicker ? <div className="xhs-kicker">{kicker}</div> : null}
      {title ? <h3><Lines lines={title} /></h3> : null}
      {body ? <p><Lines lines={body} /></p> : null}
      {children}
    </div>
  );
}

export function Placeholder({ label, ratio = '16/10' }) {
  const slotLabel = Array.isArray(label) ? label.join('-') : label;
  const slotId = `xhs-media-${String(slotLabel || ratio).replace(/\s+/g, '-').toLowerCase()}`;
  return (
    <MediaPlaceholder className="xhs-placeholder xhs-media-placeholder" slotId={slotId} style={{ aspectRatio: ratio }} />
  );
}

export function CardGrid({ items, columns = 3, tone = '' }) {
  return (
    <div className={`xhs-card-grid cols-${columns}`.trim()}>
      {items.map((item, index) => (
        <XhsCard key={`${item.title}-${index}`} {...item} tone={item.tone || tone} />
      ))}
    </div>
  );
}

export function BigStatement({ eyebrow, title, body, page, tone = 'dark', accent = 'lime', footer }) {
  return (
    <XhsSlide layout={page.layout} tone={tone} accent={accent} footer={footer || { left: page.left, page: page.page }}>
      <XhsTop eyebrow={eyebrow} page={page.page} />
      <div className="xhs-center-statement">
        <h1><Lines lines={title} /></h1>
        {body ? <p><Lines lines={body} /></p> : null}
      </div>
    </XhsSlide>
  );
}

export function SplitStatement({ layout, tone = 'dark', accent = 'lime', eyebrow, title, body, side, footer }) {
  return (
    <XhsSlide layout={layout} tone={tone} accent={accent} footer={footer}>
      <XhsTop eyebrow={eyebrow} page={footer.page} />
      <div className="xhs-split">
        <div>
          <h1 className="xhs-title"><Lines lines={title} /></h1>
          {body ? <p className="xhs-body"><Lines lines={body} /></p> : null}
        </div>
        <div className="xhs-side-panel">{side}</div>
      </div>
    </XhsSlide>
  );
}
