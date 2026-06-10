import { normalizeRuntimePages } from '../runtime-helpers.jsx';
import { swSlides as rawPages } from './source/src/index.js';

export const runtimePages = normalizeRuntimePages(rawPages, { themeKey: 'theme12', layoutPrefix: 'THEME12' });
