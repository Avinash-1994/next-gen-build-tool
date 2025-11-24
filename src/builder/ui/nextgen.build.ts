// Build configuration for the Visual Builder UI using esbuild-svelte
import esbuildSvelte from 'esbuild-svelte';
import sveltePreprocess from 'svelte-preprocess';
import path from 'path';

export default {
    root: '.',
    entry: ['main.ts'],
    outDir: '../../../public/builder',
    mode: 'production',
    // Cast plugins to any to satisfy TypeScript's type checking
    esbuildPlugins: [
        (esbuildSvelte as any)({
            preprocess: (sveltePreprocess as any)(),
            compilerOptions: { css: 'injected' }
        })
    ]
};
