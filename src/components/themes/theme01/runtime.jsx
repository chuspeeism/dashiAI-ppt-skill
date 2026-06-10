import { normalizeRuntimePages } from '../runtime-helpers.jsx';
import { slides as rawPages } from './source/slides/index.jsx';

export const runtimePages = normalizeRuntimePages(rawPages, { themeKey: 'theme01', layoutPrefix: 'THEME01' });
