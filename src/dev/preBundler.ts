import path from 'path';
import fs from 'fs/promises';
import { build } from 'esbuild';
import { createHash } from 'crypto';
import { createRequire } from 'module';
import { log } from '../utils/logger.js';

const require = createRequire(import.meta.url);

/**
 * Dependency Pre-Bundler
 * Pre-bundles node_modules dependencies into ESM format
 * Similar to Vite's dependency optimization
 */
export class DependencyPreBundler {
    constructor(private root: string, private cacheDir: string = 'node_modules/.urja') { }

    async preBundleDependencies(deps: string[]): Promise<Map<string, string>> {
        const bundledDeps = new Map<string, string>();
        const cacheDir = path.join(this.root, this.cacheDir);

        // Ensure cache directory exists
        await fs.mkdir(cacheDir, { recursive: true });

        // Generate hash of package.json for cache invalidation
        const pkgJsonPath = path.join(this.root, 'package.json');
        const pkgJson = await fs.readFile(pkgJsonPath, 'utf-8');
        const hash = createHash('md5').update(pkgJson).digest('hex').slice(0, 8);
        const metaPath = path.join(cacheDir, '_metadata.json');

        // Check if cache is valid
        let cachedMeta: any = {};
        try {
            cachedMeta = JSON.parse(await fs.readFile(metaPath, 'utf-8'));
            if (cachedMeta.hash === hash) {
                log.info('Using cached pre-bundled dependencies');
                // Load from cache
                for (const dep of deps) {
                    const cachedPath = path.join(cacheDir, `${dep.replace(/\//g, '_')}.js`);
                    try {
                        await fs.access(cachedPath);
                        bundledDeps.set(dep, `/@urja-deps/${dep.replace(/\//g, '_')}.js`);
                    } catch {
                        // Dep not in cache, need to bundle
                    }
                }
                if (bundledDeps.size === deps.length) {
                    return bundledDeps;
                }
            }
        } catch {
            // No cache or invalid, proceed with bundling
        }

        log.info('Pre-bundling dependencies...', { count: deps.length });

        // Bundle each dependency
        for (const dep of deps) {
            try {
                const outfile = path.join(cacheDir, `${dep.replace(/\//g, '_')}.js`);

                // Dynamic require to find exports for CJS modules
                let proxyContent = '';
                try {
                    const pkgPath = require.resolve(dep, { paths: [this.root] });
                    const pkg = require(pkgPath);
                    const keys = Object.keys(pkg).filter(key =>
                        /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key) && key !== 'default'
                    );

                    // Generate ESM shim
                    // We use absolute path for import to ensure we get the real module
                    proxyContent = `
                        import module from '${pkgPath.replace(/\\/g, '/')}';
                        export default module;
                        ${keys.map(key => `export const ${key} = module.${key};`).join('\n')}
                    `;

                    log.info(`[PreBundler] Generated proxy for ${dep} with ${keys.length} exports`);
                } catch (e: any) {
                    log.warn(`[PreBundler] Failed to analyze exports for ${dep}: ${e.message}`);
                    // Fallback to direct import
                    proxyContent = `export * from '${dep}'; import module from '${dep}'; export default module;`;
                }

                await build({
                    stdin: {
                        contents: proxyContent,
                        resolveDir: this.root,
                        sourcefile: `${dep}.js`,
                        loader: 'js'
                    },
                    bundle: true,
                    format: 'esm',
                    platform: 'browser',
                    outfile,
                    splitting: false,
                    minify: false,
                    sourcemap: true,
                    define: {
                        'process.env.NODE_ENV': '"development"',
                        'global': 'globalThis'
                    },
                    // Don't bundle peer dependencies
                    external: [],
                    logLevel: 'warning'
                });

                bundledDeps.set(dep, `/@urja-deps/${dep.replace(/\//g, '_')}.js`);
                log.info(`✓ Pre-bundled: ${dep}`);
            } catch (error: any) {
                log.error(`Failed to pre-bundle ${dep}:`, error.message);
            }
        }

        // Save metadata
        await fs.writeFile(metaPath, JSON.stringify({
            hash,
            deps: Array.from(bundledDeps.keys()),
            timestamp: Date.now()
        }));

        return bundledDeps;
    }

    async scanDependencies(entryFile: string): Promise<string[]> {
        const content = await fs.readFile(entryFile, 'utf-8');
        const deps = new Set<string>();

        // Simple regex-based scan for imports
        // In production, use a proper AST parser
        const importRegex = /from\s+['"]([^.\/][^'"]+)['"]/g;
        let match;
        while ((match = importRegex.exec(content)) !== null) {
            const dep = match[1];
            // Extract package name (handle scoped packages)
            const pkgName = dep.startsWith('@')
                ? dep.split('/').slice(0, 2).join('/')
                : dep.split('/')[0];
            deps.add(pkgName);

            // Also add sub-paths
            if (dep.includes('/')) {
                deps.add(dep);
            }
        }

        return Array.from(deps);
    }
}
