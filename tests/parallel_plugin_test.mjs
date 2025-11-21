import { startDevServer } from '../dist/dev/devServer.js';
import http from 'http';
import assert from 'assert';
import fs from 'fs/promises';
import path from 'path';

const PORT = 6002;

async function test() {
    const root = process.cwd();
    const cfg = {
        root,
        entry: [],
        mode: 'development',
        outDir: 'dist',
        port: PORT
    };

    console.log('Starting dev server for Parallel Plugin test...');
    try {
        await startDevServer(cfg);
    } catch (e) {
        console.error('Failed to start server:', e);
        process.exit(1);
    }

    await new Promise(r => setTimeout(r, 2000)); // Wait for workers to spin up

    try {
        // Create a test file
        const tempFile = path.join(root, 'src', 'temp_parallel.ts');
        await fs.writeFile(tempFile, 'console.log("Hello Parallel World");');

        // Request the file
        const res = await fetch(`http://localhost:${PORT}/src/temp_parallel.ts`);
        assert.strictEqual(res.status, 200);
        const js = await res.text();

        console.log('Transformed JS:', js);

        // Check if samplePlugin transformed it (console.log -> console.debug)
        // And check if the comment added by samplePlugin is present
        assert.ok(js.includes('console.debug'), 'Should contain console.debug');
        assert.ok(js.includes('transformed by sample-plugin-esm'), 'Should contain plugin signature');

        console.log('PASS: Parallel plugin execution works');

        process.exit(0);
    } catch (e) {
        console.error('FAIL:', e);
        process.exit(1);
    } finally {
        await fs.unlink(path.join(root, 'src', 'temp_parallel.ts')).catch(() => { });
    }
}

test();
