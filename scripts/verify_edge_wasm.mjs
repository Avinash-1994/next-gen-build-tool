import { build } from '../dist/build/bundler.js';
import path from 'path';
import fs from 'fs/promises';
import assert from 'assert';

async function testEdgeAndWasm() {
    console.log('Running Edge & WASM Verification...');
    const cwd = process.cwd();
    const testDir = path.join(cwd, 'test_edge_wasm_verify');

    try {
        await fs.mkdir(path.join(testDir, 'src'), { recursive: true });

        // --- Test 1: Edge Build ---
        console.log('Test 1: Edge Build');
        await fs.writeFile(path.join(testDir, 'src', 'edge.js'), `
      import path from 'path';
      export default {
        runtime: process.env.NEXT_RUNTIME,
        path: path
      };
    `);

        const edgeConfig = {
            root: testDir,
            entry: ['src/edge.js'],
            mode: 'production',
            outDir: 'dist_edge',
            platform: 'edge',
            port: 3000
        };

        await build(edgeConfig);

        const edgeDist = path.join(testDir, 'dist_edge');
        const edgeFiles = await fs.readdir(edgeDist);
        const edgeBundle = edgeFiles.find(f => f.endsWith('.js'));
        assert(edgeBundle, 'Edge bundle should exist');

        const edgeContent = await fs.readFile(path.join(edgeDist, edgeBundle), 'utf-8');
        // Check if process.env.NEXT_RUNTIME is replaced
        assert(!edgeContent.includes('process.env.NEXT_RUNTIME'), 'process.env.NEXT_RUNTIME should be replaced');
        // Check if path module is mocked (empty object export)
        // The mock returns export default {}; so checking for that pattern might be tricky in minified code
        // But we can check that it DOESN'T require 'path'
        assert(!edgeContent.includes('require("path")'), 'Should not require "path" module');

        console.log('✓ Edge Build Passed');

        // --- Test 2: WASM Build ---
        console.log('Test 2: WASM Build');

        // Create a dummy WASM file (just a few bytes, not valid WASM but enough to test loader)
        const wasmContent = Buffer.from([0x00, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00]);
        await fs.writeFile(path.join(testDir, 'src', 'module.wasm'), wasmContent);

        await fs.writeFile(path.join(testDir, 'src', 'wasm_entry.js'), `
      import wasm from './module.wasm';
      export default wasm;
    `);

        const wasmConfig = {
            root: testDir,
            entry: ['src/wasm_entry.js'],
            mode: 'development',
            outDir: 'dist_wasm',
            platform: 'browser',
            port: 3000
        };

        await build(wasmConfig);

        const wasmDist = path.join(testDir, 'dist_wasm');
        const wasmFiles = await fs.readdir(wasmDist);

        // Check if .wasm file is emitted
        const emittedWasm = wasmFiles.find(f => f.endsWith('.wasm'));
        assert(emittedWasm, 'WASM file should be emitted');

        // Check bundle content
        const wasmBundle = wasmFiles.find(f => f.endsWith('.js'));
        const wasmBundleContent = await fs.readFile(path.join(wasmDist, wasmBundle), 'utf-8');

        assert(wasmBundleContent.includes('WebAssembly.instantiate'), 'Bundle should contain WASM instantiation logic');
        assert(wasmBundleContent.includes(emittedWasm), 'Bundle should reference emitted WASM file');

        console.log('✓ WASM Build Passed');

        console.log('Edge & WASM Verification Passed!');

    } catch (error) {
        console.error('Edge & WASM Verification Failed:', error);
        process.exit(1);
    } finally {
        await fs.rm(testDir, { recursive: true, force: true });
    }
}

testEdgeAndWasm();
