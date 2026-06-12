import React from 'react';
import { flushSync } from 'react-dom';
import { createRoot } from 'react-dom/client';
import { ImageSlotActions as theme01ImageSlotActions } from './theme01/source/slides/SlideKit.jsx';
import { runtimePages as theme01Pages } from './theme01/runtime.jsx';
import { runtimePages as theme02Pages } from './theme02/runtime.jsx';
import { runtimePages as theme03Pages } from './theme03/runtime.jsx';
import { runtimePages as theme04Pages } from './theme04/runtime.jsx';
import { runtimePages as theme05Pages } from './theme05/runtime.jsx';
import { runtimePages as theme06Pages } from './theme06/runtime.jsx';
import { runtimePages as theme07Pages } from './theme07/runtime.jsx';
import { runtimePages as theme08Pages } from './theme08/runtime.jsx';
import { runtimePages as theme09Pages } from './theme09/runtime.jsx';
import { runtimePages as theme10Pages } from './theme10/runtime.jsx';
import { runtimePages as theme11Pages } from './theme11/runtime.jsx';
import { runtimePages as theme12Pages } from './theme12/runtime.jsx';

const mountedRoots = new WeakMap();
const rootMediaApis = new WeakMap();
const runtimePages = [
  ...theme01Pages,
  ...theme02Pages,
  ...theme03Pages,
  ...theme04Pages,
  ...theme05Pages,
  ...theme06Pages,
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

function toArray(value) {
  return Array.isArray(value) ? [...value] : [];
}

function stripRuntimeProps(props) {
  const next = {};
  for (const [key, value] of Object.entries(props || {})) {
    if (typeof value !== 'function') next[key] = value;
  }
  return next;
}

function readImageFile(file) {
  return new Promise(resolve => {
    if (!file || !file.type?.startsWith?.('image/')) {
      resolve(null);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const src = reader.result;
      const img = new Image();
      img.onload = () => resolve({ src, ratio: img.naturalWidth / img.naturalHeight });
      img.onerror = () => resolve({ src, ratio: null });
      img.src = src;
    };
    reader.onerror = () => resolve(null);
    reader.readAsDataURL(file);
  });
}

function createMediaApi(slide, baseProps) {
  function updateList(key, index, value) {
    const nextList = toArray(baseProps[key]);
    nextList[index] = value || null;
    const nextProps = stripRuntimeProps({ ...baseProps, [key]: nextList });
    window.__deckViewModel?.setProps?.(slide.dataset.vmSlideId, nextProps);
    renderImportedThemeSlide(slide, nextProps);
    window.__initEditableText?.(slide);
    window.__syncActiveEffects?.(slide);
  }

  async function acceptFile(key, index, file) {
    const data = await readImageFile(file);
    if (data?.src) updateList(key, index, data.src);
  }

  function pick(key, index) {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.style.display = 'none';
    input.addEventListener('change', () => {
      acceptFile(key, index, input.files && input.files[0]).finally(() => input.remove());
    }, { once: true });
    document.body.appendChild(input);
    input.click();
  }

  return {
    get: (key, index) => toArray(baseProps[key])[index] || null,
    set: updateList,
    acceptFile,
    pick,
  };
}

function HostImageSlot({ mediaApi, index, options = {} }) {
  const [over, setOver] = React.useState(false);
  const value = mediaApi.get('images', index);
  const aspectRatio = options.ratioAR || (options.ratio ? String(options.ratio) : undefined);
  const drop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setOver(false);
    mediaApi.acceptFile('images', index, event.dataTransfer.files && event.dataTransfer.files[0]);
  };

  return (
    <div
      data-dashi-host-image-slot="true"
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        minHeight: 0,
        aspectRatio,
        overflow: 'hidden',
        cursor: 'pointer',
        background: value
          ? 'transparent'
          : 'repeating-linear-gradient(135deg, rgba(0,0,0,.08) 0 12px, rgba(0,0,0,.03) 12px 24px)',
        outline: over ? '3px solid rgba(143,227,39,.85)' : '1px dashed rgba(0,0,0,.25)',
        outlineOffset: over ? -3 : -1,
      }}
      onClick={(event) => {
        event.stopPropagation();
        mediaApi.pick('images', index);
      }}
      onDragOver={(event) => {
        event.preventDefault();
        setOver(true);
      }}
      onDragLeave={() => setOver(false)}
      onDrop={drop}
    >
      {value ? (
        <>
          <img src={value} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          <button
            type="button"
            aria-label="Clear image"
            onClick={(event) => {
              event.stopPropagation();
              mediaApi.set('images', index, null);
            }}
            style={{
              position: 'absolute',
              top: 10,
              right: 10,
              width: 34,
              height: 34,
              border: 0,
              borderRadius: '50%',
              background: 'rgba(0,0,0,.55)',
              color: '#fff',
              cursor: 'pointer',
              fontSize: 20,
              lineHeight: '34px',
            }}
          >×</button>
        </>
      ) : (
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'grid',
          placeItems: 'center',
          fontFamily: 'monospace',
          fontSize: 22,
          letterSpacing: '.08em',
          color: 'rgba(0,0,0,.48)',
          textAlign: 'center',
          padding: 18,
        }}>
          DROP IMAGE
        </div>
      )}
    </div>
  );
}

function withMediaHostProps(slide, baseProps) {
  const mediaApi = createMediaApi(slide, baseProps);
  return {
    ...baseProps,
    images: toArray(baseProps.images),
    media: toArray(baseProps.media),
    onSlotActivate: index => mediaApi.pick('images', index),
    onSlotClear: index => mediaApi.set('images', index, null),
    onActivate: index => mediaApi.pick('images', index),
    onClear: index => mediaApi.set('images', index, null),
    onMediaChange: (index, src) => mediaApi.set('media', index, src),
    renderSlot: (index, options) => (
      <HostImageSlot mediaApi={mediaApi} index={index} options={options} />
    ),
    __mediaApi: mediaApi,
  };
}

function withImageProviders(element, mediaApi) {
  return React.createElement(theme01ImageSlotActions.Provider, {
    value: {
      pick: index => mediaApi.pick('images', index),
      clear: index => mediaApi.set('images', index, null),
      drop: (index, file) => mediaApi.acceptFile('images', index, file),
    },
  }, element);
}

function getGxnSlotIndex(root, slot) {
  const slots = [...root.querySelectorAll('.gxn-slot')];
  const index = slots.indexOf(slot);
  return index < 0 ? 0 : index;
}

function bindRenderedImageSlots(root, mediaApi) {
  rootMediaApis.set(root, mediaApi);
  if (root.dataset.mediaSlotsBound === 'true') return;
  root.dataset.mediaSlotsBound = 'true';

  root.addEventListener('dragover', event => {
    const slot = event.target.closest?.('.gxn-slot');
    if (!slot || !root.contains(slot)) return;
    event.preventDefault();
    slot.classList.add('is-dashi-drag-over');
  });

  root.addEventListener('dragleave', event => {
    const slot = event.target.closest?.('.gxn-slot');
    if (slot && root.contains(slot)) slot.classList.remove('is-dashi-drag-over');
  });

  root.addEventListener('drop', event => {
    const slot = event.target.closest?.('.gxn-slot');
    if (!slot || !root.contains(slot)) return;
    event.preventDefault();
    slot.classList.remove('is-dashi-drag-over');
    const file = event.dataTransfer?.files?.[0];
    rootMediaApis.get(root)?.acceptFile('images', getGxnSlotIndex(root, slot), file);
  });
}

function renderImportedThemeSlide(slide, values = {}) {
  const root = slide?.querySelector?.('.imported-theme-root');
  if (!root) return false;
  const entry = entriesByKey.get(root.dataset.pageKey);
  if (!entry?.Component) return false;
  const defaults = readJson(root.dataset.propDefaults, {});
  const baseProps = {
    ...(entry.defaultProps || {}),
    ...defaults,
    ...(values || {}),
  };
  const componentProps = withMediaHostProps(slide, stripRuntimeProps(baseProps));
  flushSync(() => {
    getRootApi(root).render(withImageProviders(
      React.createElement(entry.Component, componentProps),
      componentProps.__mediaApi,
    ));
  });
  bindRenderedImageSlots(root, componentProps.__mediaApi);
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
