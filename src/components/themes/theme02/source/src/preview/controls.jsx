/**
 * controls.jsx — PREVIEW-ONLY. Maps a slide's `controls` schema onto the
 * Tweaks panel control components. This is the demo control surface; the
 * slide components themselves never import or depend on it.
 *
 * The Tweak* components come from tweaks-panel.jsx (loaded as a sibling
 * script onto window) — this is the one place the preview leans on them.
 */
import React from 'react';

// 0-based focusIndex props read more naturally as 1-based in the UI.
const toUi = (c, v) => (c.oneBased ? (v || 0) + 1 : v);
const fromUi = (c, v) => (c.oneBased ? v - 1 : v);

export function renderControls(controls, values, onChange) {
  const W = window;
  return controls
    .filter((c) => !c.visibleWhen || c.visibleWhen(values))
    .map((c) => {
      const v = values[c.key];
      if (c.type === 'toggle') {
        return <W.TweakToggle key={c.key} label={c.label} value={!!v}
                              onChange={(x) => onChange(c.key, x)} />;
      }
      if (c.type === 'enum') {
        return <W.TweakRadio key={c.key} label={c.label} value={v}
                             options={c.options}
                             onChange={(x) => onChange(c.key, x)} />;
      }
      if (c.type === 'number') {
        const max = typeof c.maxFrom === 'function' ? c.maxFrom(values) : c.max;
        return <W.TweakSlider key={c.key} label={c.label}
                              value={toUi(c, v)} min={toUi(c, c.min ?? 0)} max={toUi(c, max ?? 10)}
                              step={c.step ?? 1}
                              onChange={(x) => onChange(c.key, fromUi(c, x))} />;
      }
      return null;
    });
}
