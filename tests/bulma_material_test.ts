import fs from 'fs/promises';
import path from 'path';
import { detectBulmaUsage, getBulmaConfig, injectBulmaCDN } from '../src/plugins/css/bulma.js';
import { detectMaterialUsage, getMaterialConfig, injectMaterialCDN } from '../src/plugins/css/material.js';

async function runTests() {
    const testDir = path.join(process.cwd(), 'temp_bulma_material_tests');
    await fs.mkdir(testDir, { recursive: true });

    const tests = [
        {
            name: 'Detect Bulma in package.json',
            setup: async (dir: string) => {
                await fs.writeFile(path.join(dir, 'package.json'), JSON.stringify({
                    dependencies: { bulma: '^0.9.4' }
                }));
            },
            verify: async (dir: string) => {
                return await detectBulmaUsage(dir);
            }
        },
        {
            name: 'Get Bulma config (CDN fallback)',
            setup: async (dir: string) => {
                await fs.writeFile(path.join(dir, 'package.json'), JSON.stringify({}));
            },
            verify: async (dir: string) => {
                const config = await getBulmaConfig(dir);
                return config.useCDN === true;
            }
        },
        {
            name: 'Inject Bulma CDN into HTML',
            setup: async () => { },
            verify: async () => {
                const html = '<html><head></head><body></body></html>';
                const result = injectBulmaCDN(html);
                return result.includes('bulma.min.css');
            }
        },
        {
            name: 'Detect Material UI in package.json',
            setup: async (dir: string) => {
                await fs.writeFile(path.join(dir, 'package.json'), JSON.stringify({
                    dependencies: { '@mui/material': '^5.14.0' }
                }));
            },
            verify: async (dir: string) => {
                return await detectMaterialUsage(dir);
            }
        },
        {
            name: 'Get Material config with Emotion',
            setup: async (dir: string) => {
                await fs.writeFile(path.join(dir, 'package.json'), JSON.stringify({
                    dependencies: {
                        '@mui/material': '^5.14.0',
                        '@emotion/react': '^11.11.0'
                    }
                }));
            },
            verify: async (dir: string) => {
                const config = await getMaterialConfig(dir);
                return config.styledEngine === 'emotion';
            }
        },
        {
            name: 'Inject Material CDN into HTML',
            setup: async () => { },
            verify: async () => {
                const html = '<html><head></head><body></body></html>';
                const result = injectMaterialCDN(html);
                return result.includes('Material+Icons') && result.includes('Roboto');
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
