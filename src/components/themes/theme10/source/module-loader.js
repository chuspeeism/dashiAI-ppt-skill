// module-loader.js — preview-only ESM bridge (NOT part of the template library).
//
// WHY THIS EXISTS
// Every file in slides/ and components/ (plus tweaks-panel.jsx and app.jsx) is a
// STANDARD ES module: `import React from 'react'` at the top, relative imports
// between files, `export { SlideX }` / `export const META` / `export default` at
// the bottom. That makes each file directly portable into any bundler project
// (vite / webpack / rollup) with ZERO edits — no window globals, no shims.
//
// The preview shell, however, has no build step: it runs in-browser Babel, and
// browsers can't natively import .jsx. This loader bridges the gap at runtime:
//   1. fetch a module's source,
//   2. transpile JSX with Babel.transform (ESM import/export kept as-is),
//   3. recursively load its relative imports the same way,
//   4. rewrite each import specifier to the dependency's blob: URL,
//   5. dynamic-import() the entry — the graph runs as REAL native ES modules.
// Bare specifiers ('react', 'react-dom', 'react-dom/client') resolve to tiny
// shim modules that re-export the UMD globals already on the page — mirroring
// exactly what a bundler would resolve from node_modules.
//
// MIGRATION: copy slides/ + components/ into your project and import them
// directly; delete this file (and the UMD <script> tags) — nothing in the
// component library references it. Circular imports are not supported (the
// template's import graph is a tree).
//
// Usage: <script src="module-loader.js" data-entry="app.jsx"></script>

(function () {
  'use strict';

  var ME = document.currentScript;
  var ENTRY = (ME && ME.getAttribute('data-entry')) || 'app.jsx';
  var cache = new Map(); // resolved url / bare name -> Promise<blobUrl>

  // node_modules stand-ins: re-export the UMD globals as ES modules.
  var BARE = {
    'react':
      'const R = window.React;\n' +
      'export default R;\n' +
      'export const { Children, Component, Fragment, PureComponent, StrictMode,\n' +
      '  cloneElement, createContext, createElement, createRef, forwardRef,\n' +
      '  isValidElement, lazy, memo, startTransition, useCallback, useContext,\n' +
      '  useDebugValue, useDeferredValue, useEffect, useId, useImperativeHandle,\n' +
      '  useInsertionEffect, useLayoutEffect, useMemo, useReducer, useRef,\n' +
      '  useState, useSyncExternalStore, useTransition } = R;\n',
    'react-dom':
      'const D = window.ReactDOM;\n' +
      'export default D;\n' +
      'export const createPortal = D.createPortal.bind(D);\n' +
      'export const flushSync = D.flushSync.bind(D);\n',
    'react-dom/client':
      'const D = window.ReactDOM;\n' +
      'export const createRoot = D.createRoot.bind(D);\n' +
      'export const hydrateRoot = D.hydrateRoot ? D.hydrateRoot.bind(D) : undefined;\n' +
      'export default { createRoot, hydrateRoot };\n',
  };

  function blobUrl(code) {
    return URL.createObjectURL(new Blob([code], { type: 'text/javascript' }));
  }

  function bare(name) {
    if (!cache.has(name)) {
      if (!BARE[name]) return Promise.reject(new Error('[module-loader] unknown bare import: ' + name));
      cache.set(name, Promise.resolve(blobUrl(BARE[name])));
    }
    return cache.get(name);
  }

  function load(url) {
    if (cache.has(url)) return cache.get(url);
    var p = fetch(url)
      .then(function (r) {
        if (!r.ok) throw new Error('[module-loader] HTTP ' + r.status + ' for ' + url);
        return r.text();
      })
      .then(function (src) {
        // One Babel pass: transpile JSX, keep ESM, collect import specifiers.
        var specs = [];
        var collector = function () {
          return {
            visitor: {
              ImportDeclaration: function (path) { specs.push(path.node.source.value); },
              ExportNamedDeclaration: function (path) { if (path.node.source) specs.push(path.node.source.value); },
              ExportAllDeclaration: function (path) { specs.push(path.node.source.value); },
            },
          };
        };
        var out = Babel.transform(src, {
          presets: [['react']],
          plugins: [collector],
          filename: url,
          sourceType: 'module',
        }).code;
        specs = Array.from(new Set(specs));
        return Promise.all(
          specs.map(function (s) {
            return (s.charAt(0) === '.' || s.charAt(0) === '/') ? load(new URL(s, url).href) : bare(s);
          })
        ).then(function (urls) {
          specs.forEach(function (s, i) {
            out = out.split("'" + s + "'").join("'" + urls[i] + "'");
            out = out.split('"' + s + '"').join('"' + urls[i] + '"');
          });
          return blobUrl(out + '\n//# sourceURL=' + url);
        });
      });
    cache.set(url, p);
    return p;
  }

  function start() {
    load(new URL(ENTRY, document.baseURI).href)
      .then(function (u) { return import(u); })
      .then(function () { window.dispatchEvent(new Event('deck-app-ready')); })
      .catch(function (e) { console.error(e); });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
