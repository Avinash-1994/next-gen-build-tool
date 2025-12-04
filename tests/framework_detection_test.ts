import fs from 'fs/promises';
import path from 'path';
import { detectFramework } from '../src/core/framework-detector.js';
import { log } from '../src/utils/logger.js';

// Mock logger to avoid cluttering output
log.info = () => { };
log.warn = () => { };

async function runTests() {
    const testDir = path.join(process.cwd(), 'temp_test_frameworks');
    await fs.mkdir(testDir, { recursive: true });

    const tests = [
        {
            name: 'React Detection (package.json)',
            setup: async (dir: string) => {
                await fs.writeFile(path.join(dir, 'package.json'), JSON.stringify({
                    dependencies: { react: '^18.0.0' }
                }));
            },
            expected: 'react'
        },
        {
            name: 'Vue Detection (package.json)',
            setup: async (dir: string) => {
                await fs.writeFile(path.join(dir, 'package.json'), JSON.stringify({
                    devDependencies: { vue: '^3.0.0' }
                }));
            },
            expected: 'vue'
        },
        {
            name: 'Svelte Detection (package.json)',
            setup: async (dir: string) => {
                await fs.writeFile(path.join(dir, 'package.json'), JSON.stringify({
                    devDependencies: { svelte: '^4.0.0' }
                }));
            },
            expected: 'svelte'
        },
        {
            name: 'Angular Detection (package.json)',
            setup: async (dir: string) => {
                await fs.writeFile(path.join(dir, 'package.json'), JSON.stringify({
                    dependencies: { '@angular/core': '^16.0.0' }
                }));
            },
            expected: 'angular'
        },
        {
            name: 'Svelte Detection (file scan)',
            setup: async (dir: string) => {
                await fs.mkdir(path.join(dir, 'src'), { recursive: true });
                await fs.writeFile(path.join(dir, 'src', 'App.svelte'), '');
            },
            expected: 'svelte'
        },
        {
            name: 'Vue Detection (file scan)',
            setup: async (dir: string) => {
                await fs.mkdir(path.join(dir, 'src'), { recursive: true });
                await fs.writeFile(path.join(dir, 'src', 'App.vue'), '');
            },
            expected: 'vue'
        },
        {
            name: 'React Detection (file scan - tsx)',
            setup: async (dir: string) => {
                await fs.mkdir(path.join(dir, 'src'), { recursive: true });
                await fs.writeFile(path.join(dir, 'src', 'App.tsx'), '');
            },
            expected: 'react'
        },
        {
            name: 'Vanilla Detection (no indicators)',
            setup: async (dir: string) => {
                await fs.writeFile(path.join(dir, 'package.json'), JSON.stringify({
                    dependencies: { lodash: '1.0.0' }
                }));
            },
            expected: 'vanilla'
        }
    ];

    let passed = 0;
    let failed = 0;

    for (const test of tests) {
        const caseDir = path.join(testDir, test.name.replace(/[^a-z0-9]/gi, '_'));
        await fs.mkdir(caseDir, { recursive: true });
        await test.setup(caseDir);

        const result = await detectFramework(caseDir);

        if (result?.name === test.expected) {
            console.log(`✅ ${test.name} passed`);
            passed++;
        } else {
            console.error(`❌ ${test.name} failed. Expected ${test.expected}, got ${result?.name}`);
            failed++;
        }
    }

    // Cleanup
    await fs.rm(testDir, { recursive: true, force: true });

    console.log(`\nResults: ${passed} passed, ${failed} failed`);
    if (failed > 0) process.exit(1);
}

runTests().catch(console.error);
