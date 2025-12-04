import { Plugin } from './index.js';
import fs from 'fs/promises';
import path from 'path';

export class WasmPlugin implements Plugin {
    name = 'wasm-plugin';

    setup(build: any) {
        // Resolve .wasm files
        build.onResolve({ filter: /\.wasm$/ }, (args: any) => {
            if (args.namespace === 'wasm-stub') {
                return {
                    path: args.path,
                    namespace: 'wasm-binary',
                };
            }

            return {
                path: path.resolve(args.resolveDir, args.path),
                namespace: 'wasm-stub',
            };
        });

        // Load .wasm files
        build.onLoad({ filter: /.*/, namespace: 'wasm-stub' }, async (args: any) => {
            return {
                contents: `
          import wasmUrl from ${JSON.stringify(args.path)};
          export default async (imports) => {
            const response = await fetch(wasmUrl);
            const bytes = await response.arrayBuffer();
            const { instance } = await WebAssembly.instantiate(bytes, imports);
            return instance.exports;
          };
        `,
                loader: 'js',
            };
        });

        // Handle the actual binary loading (using file loader to emit asset)
        build.onLoad({ filter: /.*/, namespace: 'wasm-binary' }, async (args: any) => {
            return {
                contents: await fs.readFile(args.path),
                loader: 'file', // Emit as asset
            };
        });
    }
}
