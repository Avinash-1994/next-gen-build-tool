import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import { Plugin } from './index.js';

export class FederationPlugin implements Plugin {
    name = 'federation-plugin';
    private config: any;

    constructor(config: any) {
        this.config = config;
    }

    setup(build: any) {
        const { name, filename, exposes, remotes, shared } = this.config;

        // 1. Handle Remotes: Resolve remote imports to runtime loader
        if (remotes) {
            const remoteKeys = Object.keys(remotes);
            const filter = new RegExp(`^(${remoteKeys.join('|')})(/.*)?$`);

            build.onResolve({ filter }, (args: any) => {
                return {
                    path: args.path,
                    namespace: 'federation-remote'
                };
            });

            build.onLoad({ filter: /.*/, namespace: 'federation-remote' }, (args: any) => {
                const [remoteName, ...rest] = args.path.split('/');
                const modulePath = rest.join('/');
                const url = remotes[remoteName];

                // Return code that loads the remote module at runtime
                return {
                    contents: `
            import { loadRemote } from '__federation_runtime';
            export default await loadRemote('${url}', '${remoteName}', './${modulePath || ''}');
          `,
                    loader: 'js'
                };
            });
        }

        // 2. Handle Exposes: Mark exposed modules as entry points (virtual)
        // In a real implementation, we would need to generate a separate bundle for each exposed module
        // or use code splitting to ensure they are available.
        // For this prototype, we'll generate the remoteEntry.js at the end.

        // 3. Inject Runtime
        build.onResolve({ filter: /^__federation_runtime$/ }, (args: any) => {
            const __dirname = path.dirname(fileURLToPath(import.meta.url));
            return {
                path: path.resolve(__dirname, '../runtime/federation_runtime.js'),
                namespace: 'federation-runtime'
            };
        });

        build.onLoad({ filter: /.*/, namespace: 'federation-runtime' }, async (args: any) => {
            const runtimePath = path.resolve(process.cwd(), 'src/runtime/federation_runtime.js');
            // If runtime file doesn't exist yet (we haven't created it), provide inline content
            // But we plan to create it. For now, let's inline a simple runtime.

            return {
                contents: `
          const moduleMap = {};
          
          export async function loadRemote(url, scope, module) {
            if (!window[scope]) {
              await import(url); // Load remoteEntry.js
            }
            const container = window[scope];
            await container.init(__webpack_share_scopes__.default);
            const factory = await container.get(module);
            return factory();
          }
        `,
                loader: 'js'
            };
        });

        // 4. Generate remoteEntry.js on build end
        build.onEnd(async (result: any) => {
            if (exposes) {
                const manifest = {
                    name,
                    exposes,
                    remotes,
                    shared
                };

                const outDir = build.initialOptions.outdir;

                if (outDir) {
                    const filePath = path.join(outDir, filename || 'remoteEntry.js');
                    await fs.writeFile(
                        filePath,
                        `window['${name}'] = ${JSON.stringify(manifest, null, 2)};`
                    );
                }
            }
        });
    }
}
