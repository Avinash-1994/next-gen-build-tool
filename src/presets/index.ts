import { BuildConfig } from '../config/index.js';

export interface Preset {
    name: string;
    apply(config: Partial<BuildConfig>): Partial<BuildConfig>;
}

export { spaPreset } from './spa.js';
export { ssrPreset } from './ssr.js';
export { ssgPreset } from './ssg.js';
