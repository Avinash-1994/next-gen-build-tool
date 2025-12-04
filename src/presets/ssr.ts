import { Preset } from './index.js';
import { BuildConfig } from '../config/index.js';

export const ssrPreset: Preset = {
    name: 'ssr',
    apply(config: Partial<BuildConfig>): Partial<BuildConfig> {
        // SSR typically requires two builds: client and server.
        // This preset might configure the server build or adjust the client build.
        // For this prototype, we'll mark the platform as node for server builds or hybrid.

        return {
            ...config,
            platform: 'node', // Or 'neutral' depending on the target
            // Add SSR specific config
        };
    }
};
