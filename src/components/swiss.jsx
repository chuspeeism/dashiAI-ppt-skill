import React from 'react';

const ON_ACCENT = 'var(--accent-on)';
const ON_ACCENT_22 = 'color-mix(in srgb, var(--accent-on) 22%, transparent)';
const ON_ACCENT_60 = 'color-mix(in srgb, var(--accent-on) 60%, transparent)';
const ON_ACCENT_62 = 'color-mix(in srgb, var(--accent-on) 62%, transparent)';
const ON_ACCENT_78 = 'color-mix(in srgb, var(--accent-on) 78%, transparent)';
const ON_ACCENT_82 = 'color-mix(in srgb, var(--accent-on) 82%, transparent)';
const ON_ACCENT_86 = 'color-mix(in srgb, var(--accent-on) 86%, transparent)';

export function Icon({ name }) {
  return <i data-lucide={name} />;
}

export function SwissSlide({ layout, animate = 'cascade', className = '', children }) {
  return (
    <section className={`slide ${className}`.trim()} data-layout={layout} data-animate={animate}>
      {children}
    </section>
  );
}

export function CanvasCard({ children }) {
  return <div className="canvas-card">{children}</div>;
}

export function Chrome({ left, right }) {
  return (
    <div className="chrome-min">
      <div className="l">{left}</div>
      <div className="r">{right}</div>
    </div>
  );
}

export function SwissCover({ title, kicker, lead, meta = '', issue = '01 / NN' }) {
  return (
    <SwissSlide layout="SWISS-COVER-ASCII" animate="hero" className="accent">
      <CanvasCard>
        <canvas className="ascii-bg" aria-hidden="true" />
        <Chrome left={meta || title} right={issue} />
        <div style={{ flex: 1, padding: 0, display: 'grid', gridTemplateRows: 'auto 1fr auto', gap: '2.6vh' }}>
          <div data-anim="kicker" className="t-meta" style={{ color: ON_ACCENT_78, letterSpacing: '.22em' }}>{kicker}</div>
          <h1 data-anim="title" style={{ alignSelf: 'center', fontFamily: 'var(--sans),var(--sans-zh)', fontWeight: 200, fontSize: 'min(10.6vw,18vh)', lineHeight: .94, letterSpacing: '-.025em', color: ON_ACCENT }}>{title}</h1>
          <div data-anim="bottom" style={{ display: 'grid', gridTemplateRows: 'auto auto', gap: '1.6vh', borderTop: `1px solid ${ON_ACCENT_22}`, paddingTop: '2vh' }}>
            <div className="lead" style={{ maxWidth: '52ch', color: ON_ACCENT_86 }}>{lead}</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end' }}>
              <div className="t-meta" style={{ color: ON_ACCENT_60 }}>{meta}</div>
              <div className="t-meta" style={{ color: ON_ACCENT_60 }}>→ swipe / arrow keys</div>
            </div>
          </div>
        </div>
      </CanvasCard>
    </SwissSlide>
  );
}

export function SwissSixCellsSlide({ page = '02', title, kicker, cells }) {
  return (
    <SwissSlide layout="S04" animate="grid-reveal">
      <CanvasCard>
        <Chrome left={`${page} · SIX CELLS`} right="S04" />
        <div style={{ flex: 1, display: 'grid', gridTemplateRows: 'auto 1fr', gap: '5vh' }}>
          <div data-anim="line" style={{ display: 'flex', flexDirection: 'column', gap: '1.4vh' }}>
            <div className="t-meta">{kicker}</div>
            <h2 className="h-xl-zh" style={{ fontSize: 'min(6.2vw,11vh)' }}>{title}</h2>
          </div>
          <div className="grid-12">
            {cells.map((cell, index) => (
              <div key={cell.title} className={`span-4 ${cell.accent ? 'card-accent' : 'card-fill'}`} data-anim="card" style={{ minHeight: '21vh', padding: '2.2vh 1.5vw', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div className="t-meta">{String(index + 1).padStart(2, '0')}</div>
                <div>
                  {cell.icon ? <Icon name={cell.icon} /> : null}
                  <h3 style={{ fontFamily: 'var(--sans),var(--sans-zh)', fontWeight: 400, fontSize: 'max(18px,1.8vw)', lineHeight: 1.15, marginTop: '1vh' }}>{cell.title}</h3>
                  <p className="body-sm" style={{ marginTop: '1.2vh' }}>{cell.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CanvasCard>
    </SwissSlide>
  );
}

export function SwissTimelineSlide({ page = '03', title, kicker, nodes, metrics = [] }) {
  return (
    <SwissSlide layout="S02" animate="progression">
      <CanvasCard>
        <Chrome left={`${page} · YEAR TRAJECTORY`} right="S02" />
        <div style={{ flex: 1, display: 'grid', gridTemplateRows: 'auto 1fr auto', gap: '4vh' }}>
          <div data-anim="line" style={{ display: 'flex', flexDirection: 'column', gap: '1.4vh' }}>
            <div className="t-meta">{kicker}</div>
            <h2 className="h-xl-zh" style={{ fontSize: 'min(6.2vw,11vh)' }}>{title}</h2>
          </div>
          <div className="timeline-v">
            {nodes.map((node) => (
              <div key={node.label} className={`tl-node ${node.accent ? 'accent' : ''}`}>
                <div className="dot" />
                <div className="yr">{node.label}</div>
                <div className="multi">{node.value}</div>
                <div className="desc">{node.body}</div>
              </div>
            ))}
          </div>
          {metrics.length ? <MetricRow metrics={metrics} /> : null}
        </div>
      </CanvasCard>
    </SwissSlide>
  );
}

export function MetricRow({ metrics }) {
  return (
    <div className="kpi-row-4">
      {metrics.map((metric) => (
        <div key={metric.label} className="kpi-cell">
          <div className="lbl">{metric.label}</div>
          <div className="nb">{metric.value}</div>
          <p className="note">{metric.note}</p>
        </div>
      ))}
    </div>
  );
}

export function SwissKpiTowerSlide({ page = '04', title, kicker, lead, towers }) {
  return (
    <SwissSlide layout="S06" animate="measure-up">
      <CanvasCard>
        <Chrome left={`${page} · OPERATING SCORECARD`} right="S06" />
        <div style={{ flex: 1, display: 'grid', gridTemplateRows: 'auto 1fr', gap: '6vh' }}>
          <div data-anim="line" style={{ display: 'grid', gridTemplateColumns: '1fr 34ch', gap: '4vw', alignItems: 'end' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.4vh' }}>
              <div className="t-meta">{kicker}</div>
              <h2 className="h-xl-zh" style={{ fontSize: 'min(6.2vw,11vh)' }}>{title}</h2>
            </div>
            <p className="lead" style={{ fontSize: 'max(18px,1.45vw)', lineHeight: 1.55, color: 'var(--text-secondary)', fontWeight: 400 }}>{lead}</p>
          </div>
          <div className="bar-towers">
            {towers.map((tower) => (
              <div key={tower.label} className="bar-tower">
                <div className="cap">{tower.icon ? <Icon name={tower.icon} /> : null}</div>
                <div className={`body-block h-${tower.height ?? 2} ${tower.accent ? 'b-accent' : ''}`}>
                  <div className="lbl">{tower.label}</div>
                  <div className="nb">{tower.value}</div>
                  <p className="sub">{tower.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CanvasCard>
    </SwissSlide>
  );
}

export function SwissHBarSlide({ page = '05', title, kicker, label, rows }) {
  return (
    <SwissSlide layout="S07" animate="bar-grow">
      <CanvasCard>
        <Chrome left={`${page} · RANKING`} right="S07" />
        <div style={{ flex: 1, display: 'grid', gridTemplateRows: 'auto auto 1fr', gap: '4vh' }}>
          <div data-anim="line" style={{ display: 'flex', flexDirection: 'column', gap: '1.4vh' }}>
            <div className="t-meta">{kicker}</div>
            <h2 className="h-xl-zh" style={{ fontSize: 'min(6.2vw,11vh)' }}>{title}</h2>
          </div>
          <div data-anim="up" style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '2vw', alignItems: 'center' }}>
            <div className="t-cat">{label}</div>
            <div style={{ height: 1, background: 'var(--border-subtle)' }} />
          </div>
          <div className="h-bar-chart">
            {rows.map((row) => (
              <React.Fragment key={row.label}>
                <div className="row-lbl">{row.label}</div>
                <div className="row-track"><div className={`row-fill ${row.accent ? 'accent' : ''}`} style={{ width: row.width }} /></div>
                <div className="row-val">{row.value}</div>
              </React.Fragment>
            ))}
          </div>
        </div>
      </CanvasCard>
    </SwissSlide>
  );
}

export function SwissImageHeroSlide({ page = '06', title, kicker, image = 'images/placeholder-21x9.svg', stats = [] }) {
  return (
    <SwissSlide layout="S22" animate="image-hero">
      <CanvasCard>
        <Chrome left={`${page} · IMAGE HERO`} right="S22" />
        <div style={{ flex: 1, display: 'grid', gridTemplateRows: 'auto auto 1fr', gap: '3vh' }}>
          <div data-anim="line" style={{ display: 'flex', flexDirection: 'column', gap: '1.2vh' }}>
            <div className="t-meta">{kicker}</div>
            <h2 className="h-xl-zh" style={{ fontSize: 'min(5.8vw,10.2vh)' }}>{title}</h2>
          </div>
          <div className="frame-img r-21x9 pos-face" data-anim="image">
            <img src={image} data-image-slot="s22-hero-21x9" alt="" />
          </div>
          <MetricRow metrics={stats.slice(0, 4)} />
        </div>
      </CanvasCard>
    </SwissSlide>
  );
}

export function SwissClosing({ title, note, takeaways, author = '', date = '' }) {
  return (
    <SwissSlide layout="SWISS-CLOSING-ASCII" animate="split-statement" className="split">
      <CanvasCard>
        <div className="split-half">
          <div className="half b-accent" style={{ padding: '5.6vh 3.6vw 4.4vh', justifyContent: 'space-between', position: 'relative', overflow: 'hidden' }}>
            <canvas className="ascii-bg" aria-hidden="true" />
            <Chrome left="NN / NN" right="CLOSING" />
            <div data-anim="manifesto" style={{ display: 'flex', flexDirection: 'column', gap: '2vh', position: 'relative', zIndex: 1 }}>
              <div className="t-meta" style={{ color: ON_ACCENT_78, letterSpacing: '.22em', marginBottom: '1.6vh' }}>MANIFESTO</div>
              <h2 style={{ fontFamily: 'var(--sans),var(--sans-zh)', fontSize: 'min(8vw,14vh)', lineHeight: .94, letterSpacing: '-.025em', fontWeight: 200, color: ON_ACCENT }}>{title}</h2>
              <div style={{ fontFamily: 'var(--sans),var(--sans-zh)', fontSize: 'max(14px,1vw)', lineHeight: 1.6, color: ON_ACCENT_82, fontWeight: 400, maxWidth: '36ch', marginTop: '1.4vh' }}>{note}</div>
            </div>
            <div data-anim="signature" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', borderTop: `1px solid ${ON_ACCENT_22}`, paddingTop: '2vh', position: 'relative', zIndex: 1 }}>
              <div className="t-meta" style={{ color: ON_ACCENT_62 }}>{author}</div>
              <div className="t-meta" style={{ color: ON_ACCENT_62 }}>{date}</div>
            </div>
          </div>
          <div className="half" style={{ padding: '5.6vh 3.6vw 4.4vh', justifyContent: 'space-between' }}>
            <Chrome left="TAKEAWAYS" right={`${takeaways.length} RULES`} />
            <div data-anim="rules" style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {takeaways.map((item, index) => (
                <div key={item.title} style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '2vw', alignItems: 'start', padding: '2.6vh 0', borderTop: '1px solid var(--border-subtle)', borderBottom: index === takeaways.length - 1 ? '2px solid var(--accent)' : undefined }}>
                  <div style={{ fontFamily: 'var(--sans)', fontWeight: 200, fontSize: 'min(4.4vw,7.8vh)', lineHeight: .9, color: index === takeaways.length - 1 ? 'var(--accent)' : 'var(--text-primary)' }}>{String(index + 1).padStart(2, '0')}</div>
                  <div>
                    <h3 style={{ fontFamily: 'var(--sans),var(--sans-zh)', fontWeight: 400, fontSize: 'max(18px,1.8vw)', lineHeight: 1.2, letterSpacing: '-.015em', color: index === takeaways.length - 1 ? 'var(--accent)' : 'var(--text-primary)', marginBottom: '1vh' }}>{item.title}</h3>
                    <p style={{ fontFamily: 'var(--sans),var(--sans-zh)', fontSize: 'max(16px,.94vw)', lineHeight: 1.6, color: 'var(--text-secondary)', fontWeight: 400 }}>{item.body}</p>
                  </div>
                </div>
              ))}
            </div>
            <div data-anim="foot" className="t-meta" style={{ color: 'var(--text-helper)', textAlign: 'right' }}>→ END</div>
          </div>
        </div>
      </CanvasCard>
    </SwissSlide>
  );
}
