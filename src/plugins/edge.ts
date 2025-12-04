import { Plugin } from './index.js';

export class EdgePlugin implements Plugin {
    name = 'edge-plugin';
    private config: any;

    constructor(config: any = {}) {
        this.config = config;
    }

    setup(build: any) {
        const options = build.initialOptions;

        // Configure for Edge Runtime
        if (this.config.platform === 'edge' || options.platform === 'neutral' || options.define?.['process.env.NEXT_RUNTIME'] === '"edge"') {
            options.target = 'esnext';
            options.platform = 'neutral';

            // Polyfills for Node.js built-ins often needed in Edge
            options.inject = [
                ...(options.inject || []),
                // We might need to inject a buffer polyfill or similar if the user code relies on it
                // For now, we'll just ensure the environment is set up correctly
            ];

            options.define = {
                ...options.define,
                'process.env.NODE_ENV': '"production"',
                'process.env.NEXT_RUNTIME': '"edge"',
            };

            // Resolve some Node.js modules to empty or browser equivalents
            build.onResolve({ filter: /^(path|fs|os|util)$/ }, (args: any) => {
                return {
                    path: args.path,
                    namespace: 'edge-mock'
                };
            });

            build.onLoad({ filter: /.*/, namespace: 'edge-mock' }, (args: any) => {
                return {
                    contents: 'export default {};',
                    loader: 'js'
                };
            });
        }
    }
}
