import fs from 'fs/promises';
import path from 'path';
import { detectFramework, registerFrameworkDetector } from '../src/core/framework-detector.js';
import { loadConfig } from '../src/config/index.js';
import { log } from '../src/utils/logger.js';

// Mock logger
log.info = () => { };
log.warn = () => { };
log.error = () => { };

async function runTests() {
    const testDir = path.join(process.cwd(), 'temp_integration_tests');
    await fs.mkdir(testDir, { recursive: true });

    const tests = [
        {
            name: 'Custom Framework Detector Registration',
            setup: async (dir: string) => {
                // Register a custom detector for a fictional framework
                registerFrameworkDetector(async (root: string) => {
                    const pkgPath = path.join(root, 'package.json');
                    try {
                        const content = await fs.readFile(pkgPath, 'utf-8');
                        const pkg = JSON.parse(content);
                        if (pkg.dependencies?.['my-custom-framework']) {
                            return { name: 'my-custom-framework', version: pkg.dependencies['my-custom-framework'] };
                        }
                    } catch { }
                    return null;
                });

                await fs.writeFile(path.join(dir, 'package.json'), JSON.stringify({
                    dependencies: { 'my-custom-framework': '^1.0.0' }
                }));
            },
            verify: async (dir: string) => {
                const detected = await detectFramework(dir);
                return detected?.name === 'my-custom-framework';
            }
        },
        {
            name: 'SPA Preset Application',
            setup: async (dir: string) => {
                await fs.writeFile(path.join(dir, 'nextgen.build.json'), JSON.stringify({
                    preset: 'spa',
                    entry: ['src/index.tsx']
                }));
            },
            verify: async (dir: string) => {
                const config = await loadConfig(dir);
                return config.preset === 'spa' && config.platform === 'browser';
            }
        },
        {
            name: 'SSR Preset Application',
            setup: async (dir: string) => {
                await fs.writeFile(path.join(dir, 'nextgen.build.json'), JSON.stringify({
                    preset: 'ssr',
                    entry: ['src/entry-server.tsx']
                }));
            },
            verify: async (dir: string) => {
                const config = await loadConfig(dir);
                return config.preset === 'ssr' && config.platform === 'node';
            }
        },
        {
            name: 'Auto-Detection with Default SPA Preset',
            setup: async (dir: string) => {
                await fs.writeFile(path.join(dir, 'package.json'), JSON.stringify({
                    dependencies: { react: '^18.0.0' }
                }));
            },
            verify: async (dir: string) => {
                const config = await loadConfig(dir);
                return config.preset === 'spa';
            }
        }
    ];

    let passed = 0;
    let failed = 0;

    for (const test of tests) {
        const caseDir = path.join(testDir, test.name.replace(/[^a-z0-9]/gi, '_'));
        await fs.mkdir(caseDir, { recursive: true });
        await test.setup(caseDir);

        try {
            const result = await test.verify(caseDir);
            if (result) {
                console.log(`✅ ${test.name} passed`);
                passed++;
            } else {
                console.error(`❌ ${test.name} failed`);
                failed++;
            }
        } catch (error) {
            console.error(`❌ ${test.name} failed with error:`, error);
            failed++;
        }
    }

    // Cleanup
    await fs.rm(testDir, { recursive: true, force: true });

    console.log(`\nResults: ${passed} passed, ${failed} failed`);
    if (failed > 0) process.exit(1);
}

runTests().catch(console.error);
