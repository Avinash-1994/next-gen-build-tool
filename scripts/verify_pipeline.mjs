import { build } from '../dist/build/bundler.js';
import path from 'path';
import fs from 'fs/promises';

async function testPipeline() {
    console.log('Running Pipeline Verification...');
    const cwd = process.cwd();
    const testDir = path.join(cwd, 'test_pipeline_verify');

    try {
        await fs.mkdir(path.join(testDir, 'src'), { recursive: true });
        await fs.writeFile(path.join(testDir, 'src', 'main.js'), "console.log('Pipeline Test');");

        const config = {
            root: testDir,
            entry: ['src/main.js'],
            mode: 'development',
            outDir: 'dist',
            port: 3000
        };

        await build(config);
        console.log('Pipeline Verification Passed!');
    } catch (error) {
        console.error('Pipeline Verification Failed:', error);
        process.exit(1);
    } finally {
        await fs.rm(testDir, { recursive: true, force: true });
    }
}

testPipeline();
