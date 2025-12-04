import { build } from '../src/build/bundler.js';
import path from 'path';

async function testPipeline() {
    console.log('Running Pipeline Test...');

    const cwd = process.cwd();
    const config = {
        root: cwd,
        entry: ['src/main.tsx'],
        mode: 'development' as const,
        outDir: 'dist',
        port: 3000,
        platform: 'browser' as const
    };

    try {
        await build(config);
        console.log('Pipeline Test Passed!');
    } catch (error) {
        console.error('Pipeline Test Failed:', error);
        process.exit(1);
    }
}

testPipeline();
