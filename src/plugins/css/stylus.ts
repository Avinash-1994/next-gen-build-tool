import fs from 'fs/promises';
import path from 'path';
import { log } from '../../utils/logger.js';

export class StylusPlugin {
    name = 'stylus-plugin';
    private root: string = process.cwd();

    constructor(root?: string) {
        if (root) this.root = root;
    }

    async transform(code: string, id: string): Promise<string | void> {
        if (!id.endsWith('.styl')) return;

        try {
            const { createRequire } = await import('module');
            const require = createRequire(path.resolve(this.root, 'package.json'));

            const stylus = require('stylus');

            // Stylus render is callback-based, so we wrap it in a promise
            const css = await new Promise<string>((resolve, reject) => {
                stylus(code)
                    .set('filename', id)
                    .set('paths', [path.dirname(id), path.join(this.root, 'node_modules')])
                    .render((err: any, css: string) => {
                        if (err) reject(err);
                        else resolve(css);
                    });
            });

            return css;
        } catch (e: any) {
            if (e.code === 'MODULE_NOT_FOUND') {
                log.info('Stylus not installed, skipping transformation');
            } else {
                log.error(`[StylusPlugin] Compilation failed for ${id}:`, e.message);
            }
            return code;
        }
    }
}
