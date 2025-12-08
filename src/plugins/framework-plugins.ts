import { FrameworkInfo } from '../core/framework-detector.js';
import { BuildConfig } from '../config/index.js';

export function getFrameworkConfig(framework: FrameworkInfo): Partial<BuildConfig> {
    const baseConfig: Partial<BuildConfig> = {
        platform: 'browser',
    };

    switch (framework.name) {
        case 'react':
            return {
                ...baseConfig,
                esbuildPlugins: [], // In a real implementation, we would add the react plugin here if needed, or handle it in the build pipeline
                // For now, our build pipeline might already handle basics, but we can add specific presets here.
            };
        case 'vue':
            return {
                ...baseConfig,
                // Add Vue specific config
            };
        case 'svelte':
            return {
                ...baseConfig,
                // Add Svelte specific config
            };
        case 'preact':
            return {
                ...baseConfig,
                // Add Preact specific config
            };
        case 'solid':
            return {
                ...baseConfig,
                // Add Solid specific config
            };
        case 'angular':
            return {
                ...baseConfig,
                // Add Angular specific config
            };
        default:
            return baseConfig;
    }
}
