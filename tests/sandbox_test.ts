import { PluginManager } from '../src/plugins/index.js';
import fs from 'fs/promises';
import path from 'path';
import assert from 'assert';

async function testSandbox() {
    console.log('Running Sandbox Verification...');
    const cwd = process.cwd();
    const testDir = path.join(cwd, 'test_sandbox_verify');
    const pluginManager = new PluginManager();

    try {
        await fs.mkdir(testDir, { recursive: true });
        const testFile = path.join(testDir, 'test.txt');

        // Test 1: Plugin with write permission
        console.log('Test 1: Plugin with write permission');
        const allowedPluginCode = `
      module.exports = {
        name: 'allowed-plugin',
        transform: (code) => {
          const fs = require('fs');
          fs.writeFileSync('${testFile}', 'Allowed Write');
          return code;
        }
      };
    `;

        const allowedPlugin = pluginManager.loadSandboxedPlugin(allowedPluginCode, {
            write: [testDir]
        });

        if (allowedPlugin.transform) {
            await allowedPlugin.transform('code', 'id');
        }

        const content = await fs.readFile(testFile, 'utf-8');
        assert.strictEqual(content, 'Allowed Write', 'File should be written by allowed plugin');
        console.log('✓ Passed');

        // Test 2: Plugin without write permission
        console.log('Test 2: Plugin without write permission');
        const deniedPluginCode = `
      module.exports = {
        name: 'denied-plugin',
        transform: (code) => {
          const fs = require('fs');
          fs.writeFileSync('${testFile}', 'Denied Write');
          return code;
        }
      };
    `;

        const deniedPlugin = pluginManager.loadSandboxedPlugin(deniedPluginCode, {
            write: [] // No write permissions
        });

        try {
            if (deniedPlugin.transform) {
                await deniedPlugin.transform('code', 'id');
            }
            assert.fail('Should have thrown error');
        } catch (e: any) {
            assert.ok(e.message.includes('Write access denied'), 'Error should be about write access');
            console.log('✓ Passed');
        }

        // Test 3: Accessing restricted globals
        console.log('Test 3: Accessing restricted globals');
        const globalPluginCode = `
      module.exports = {
        name: 'global-plugin',
        transform: (code) => {
          if (typeof process.exit === 'function') {
            throw new Error('Can access process.exit');
          }
          return code;
        }
      };
    `;

        const globalPlugin = pluginManager.loadSandboxedPlugin(globalPluginCode);
        if (globalPlugin.transform) {
            await globalPlugin.transform('code', 'id');
        }
        console.log('✓ Passed');

        console.log('Sandbox Verification Passed!');

    } catch (error) {
        console.error('Sandbox Verification Failed:', error);
        process.exit(1);
    } finally {
        await fs.rm(testDir, { recursive: true, force: true });
    }
}

testSandbox();
