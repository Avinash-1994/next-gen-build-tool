import fs from 'fs/promises';
import path from 'path';
import { log } from '../../utils/logger.js';

export class LessPlugin {
    name = 'less-plugin';
    private root: string = process.cwd();

    constructor(root?: string) {
        if (root) this.root = root;
    }

    async transform(code: string, id: string): Promise<string | void> {
        if (!id.endsWith('.less')) return;

        try {
            const { createRequire } = await import('module');
            const require = createRequire(path.resolve(this.root, 'package.json'));

            const less = require('less');

            const result = await less.render(code, {
                filename: id,
                paths: [path.dirname(id), path.join(this.root, 'node_modules')]
            });

            return result.css;
        } catch (e: any) {
            if (e.code === 'MODULE_NOT_FOUND') {
                log.info('Less not installed, skipping transformation');
            } else {
                log.error(`[LessPlugin] Compilation failed for ${id}:`, e.message);
            }
            return code;
        }
    }
}
