import { Preset } from './index.js';
import { BuildConfig } from '../config/index.js';

export const ssgPreset: Preset = {
    name: 'ssg',
    apply(config: Partial<BuildConfig>): Partial<BuildConfig> {
        return {
            ...config,
            // SSG might run a post-build script to render pages
        };
    }
};
