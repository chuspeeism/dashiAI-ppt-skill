import React from 'react';
import { flushSync } from 'react-dom';
import { createRoot } from 'react-dom/client';
import { runtimePages as theme01Pages } from './theme01/runtime.jsx';
import { runtimePages as theme02Pages } from './theme02/runtime.jsx';
import { runtimePages as theme03Pages } from './theme03/runtime.jsx';
import { runtimePages as theme04Pages } from './theme04/runtime.jsx';
import { runtimePages as theme07Pages } from './theme07/runtime.jsx';
import { runtimePages as theme08Pages } from './theme08/runtime.jsx';
import { runtimePages as theme09Pages } from './theme09/runtime.jsx';
import { runtimePages as theme10Pages } from './theme10/runtime.jsx';
import { runtimePages as theme11Pages } from './theme11/runtime.jsx';
import { runtimePages as theme12Pages } from './theme12/runtime.jsx';

const mountedRoots = new WeakMap();
const runtimePages = [
  ...theme01Pages,
  ...theme02Pages,
  ...theme03Pages,
  ...theme04Pages,
  ...theme07Pages,
  ...theme08Pages,
  ...theme09Pages,
  ...theme10Pages,
  ...theme11Pages,
  ...theme12Pages,
];
const entriesByKey = new Map(runtimePages.map(page => [page.key, page]));

function readJson(value, fallback) {
  try {
    return JSON.parse(value || '') || fallback;
  } catch {
    return fallback;
  }
}

function getRootApi(root) {
  let api = mountedRoots.get(root);
  if (!api) {
    api = createRoot(root);
    mountedRoots.set(root, api);
  }
  return api;
}

function renderImportedThemeSlide(slide, values = {}) {
  const root = slide?.querySelector?.('.imported-theme-root');
  if (!root) return false;
  const entry = entriesByKey.get(root.dataset.pageKey);
  if (!entry?.Component) return false;
  const defaults = readJson(root.dataset.propDefaults, {});
  const componentProps = {
    ...(entry.defaultProps || {}),
    ...defaults,
    ...(values || {}),
  };
  flushSync(() => {
    getRootApi(root).render(React.createElement(entry.Component, componentProps));
  });
  root.dataset.importedThemeRuntime = 'true';
  return true;
}

function renderImportedThemeSlides(scope = document) {
  scope.querySelectorAll?.('.slide.imported-theme-slide').forEach(slide => {
    renderImportedThemeSlide(slide);
  });
}

function renderRuntimeSlide(slide, values = {}) {
  return renderImportedThemeSlide(slide, values);
}

function renderRuntimeSlides(scope = document) {
  renderImportedThemeSlides(scope);
}

window.__renderImportedThemeSlide = renderImportedThemeSlide;
window.__renderImportedThemeSlides = renderImportedThemeSlides;
window.__renderRuntimeSlide = renderRuntimeSlide;
window.__renderRuntimeSlides = renderRuntimeSlides;
