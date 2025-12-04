import fs from 'fs/promises';
import path from 'path';
import { log } from '../../utils/logger.js';

export class SassPlugin {
    name = 'sass-plugin';
    private root: string = process.cwd();

    constructor(root?: string) {
        if (root) this.root = root;
    }

    async transform(code: string, id: string): Promise<string | void> {
        if (!id.endsWith('.scss') && !id.endsWith('.sass')) return;

        try {
            // Dynamic import to avoid bundling issues
            const { createRequire } = await import('module');
            const require = createRequire(path.resolve(this.root, 'package.json'));

            const sass = require('sass');

            const result = sass.compileString(code, {
                url: new URL(`file://${id}`),
                syntax: id.endsWith('.sass') ? 'indented' : 'scss',
                loadPaths: [path.dirname(id), path.join(this.root, 'node_modules')]
            });

            return result.css;
        } catch (e: any) {
            // If sass is not installed or compilation fails
            if (e.code === 'MODULE_NOT_FOUND') {
                log.info('Sass not installed, skipping transformation');
            } else {
                log.error(`[SassPlugin] Compilation failed for ${id}:`, e.message);
            }
            return code;
        }
    }
}
