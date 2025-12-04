import { build } from '../dist/build/bundler.js';
import path from 'path';
import fs from 'fs/promises';
import assert from 'assert';

async function testFederation() {
    console.log('Running Module Federation Verification...');
    const cwd = process.cwd();
    const testDir = path.join(cwd, 'test_federation_verify');
    const remoteDir = path.join(testDir, 'remote');
    const hostDir = path.join(testDir, 'host');

    try {
        // --- 1. Setup Remote ---
        await fs.mkdir(path.join(remoteDir, 'src'), { recursive: true });
        await fs.writeFile(path.join(remoteDir, 'src', 'Button.js'), "export default () => 'Remote Button';");
        await fs.writeFile(path.join(remoteDir, 'src', 'main.js'), `console.log('Remote App ${Date.now() + 2}');`);

        const remoteConfig = {
            root: remoteDir,
            entry: ['src/main.js'],
            mode: 'development',
            outDir: 'dist',
            federation: {
                name: 'remote_app',
                filename: 'remoteEntry.js',
                exposes: {
                    './Button': './src/Button.js'
                }
            }
        };

        // --- 2. Setup Host ---
        await fs.mkdir(path.join(hostDir, 'src'), { recursive: true });
        await fs.writeFile(path.join(hostDir, 'src', 'main.js'), `
      import Button from 'remote_app/Button';
      console.log('Host App using', Button());
    `);

        const hostConfig = {
            root: hostDir,
            entry: ['src/main.js'],
            mode: 'development',
            outDir: 'dist',
            federation: {
                name: 'host_app',
                remotes: {
                    'remote_app': 'http://localhost:3001/remoteEntry.js'
                }
            }
        };

        // --- 3. Build Remote ---
        console.log('Building Remote...');
        await build(remoteConfig);

        // Check for remoteEntry.js
        const remoteEntryPath = path.join(remoteDir, 'dist', 'remoteEntry.js');
        const remoteEntryExists = await fs.access(remoteEntryPath).then(() => true).catch(() => false);
        assert(remoteEntryExists, 'remoteEntry.js should exist in remote build');

        const remoteEntryContent = await fs.readFile(remoteEntryPath, 'utf-8');
        assert(remoteEntryContent.includes('window[\'remote_app\']'), 'remoteEntry.js should expose global variable');
        assert(remoteEntryContent.includes('./Button'), 'remoteEntry.js should expose Button module');

        // --- 4. Build Host ---
        console.log('Building Host...');
        await build(hostConfig);

        // Check Host bundle for runtime injection
        const hostDistDir = path.join(hostDir, 'dist');
        const hostFiles = await fs.readdir(hostDistDir);
        const hostBundle = hostFiles.find(f => f.endsWith('.js') && !f.includes('remoteEntry'));

        assert(hostBundle, 'Host bundle should exist');
        const hostBundleContent = await fs.readFile(path.join(hostDistDir, hostBundle), 'utf-8');

        // Check for runtime loader usage
        // The plugin injects: import { loadRemote } from '__federation_runtime';
        // esbuild will bundle the runtime, so we check for the runtime logic
        assert(hostBundleContent.includes('loadRemote'), 'Host bundle should include loadRemote logic');
        assert(hostBundleContent.includes('http://localhost:3001/remoteEntry.js'), 'Host bundle should contain remote URL');

        console.log('Module Federation Verification Passed!');

    } catch (error) {
        console.error('Module Federation Verification Failed:', error);
        process.exit(1);
    } finally {
        await fs.rm(testDir, { recursive: true, force: true });
    }
}

testFederation();
