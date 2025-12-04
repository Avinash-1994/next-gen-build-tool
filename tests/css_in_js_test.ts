import fs from 'fs/promises';
import path from 'path';
import { detectStyledComponents, getStyledComponentsConfig } from '../src/plugins/css/styled-components.js';
import { detectEmotion, getEmotionConfig } from '../src/plugins/css/emotion.js';
import { detectCSSModules, getCSSModulesConfig } from '../src/plugins/css/css-modules.js';

async function runTests() {
    const testDir = path.join(process.cwd(), 'temp_css_in_js_tests');
    await fs.mkdir(testDir, { recursive: true });

    const tests = [
        {
            name: 'Detect styled-components',
            setup: async (dir: string) => {
                await fs.writeFile(path.join(dir, 'package.json'), JSON.stringify({
                    dependencies: { 'styled-components': '^6.1.0' }
                }));
            },
            verify: async (dir: string) => {
                return await detectStyledComponents(dir);
            }
        },
        {
            name: 'Get styled-components config (SSR)',
            setup: async (dir: string) => {
                await fs.writeFile(path.join(dir, 'package.json'), JSON.stringify({
                    dependencies: {
                        'styled-components': '^6.1.0',
                        'next': '^14.0.0'
                    }
                }));
            },
            verify: async (dir: string) => {
                const config = await getStyledComponentsConfig(dir);
                return config.ssr === true;
            }
        },
        {
            name: 'Detect Emotion',
            setup: async (dir: string) => {
                await fs.writeFile(path.join(dir, 'package.json'), JSON.stringify({
                    dependencies: { '@emotion/react': '^11.11.0' }
                }));
            },
            verify: async (dir: string) => {
                return await detectEmotion(dir);
            }
        },
        {
            name: 'Get Emotion config (SSR)',
            setup: async (dir: string) => {
                await fs.writeFile(path.join(dir, 'package.json'), JSON.stringify({
                    dependencies: {
                        '@emotion/react': '^11.11.0',
                        'next': '^14.0.0'
                    }
                }));
            },
            verify: async (dir: string) => {
                const config = await getEmotionConfig(dir);
                return config.ssr === true && config.cssProp === true;
            }
        },
        {
            name: 'Detect CSS Modules',
            setup: async (dir: string) => {
                await fs.mkdir(path.join(dir, 'src'), { recursive: true });
                await fs.writeFile(path.join(dir, 'src', 'App.module.css'), '.button { color: blue; }');
            },
            verify: async (dir: string) => {
                return await detectCSSModules(dir);
            }
        },
        {
            name: 'Get CSS Modules config',
            setup: async (dir: string) => {
                await fs.mkdir(path.join(dir, 'src'), { recursive: true });
                await fs.writeFile(path.join(dir, 'src', 'styles.module.css'), '.container { padding: 20px; }');
            },
            verify: async (dir: string) => {
                const config = await getCSSModulesConfig(dir);
                return config.generateTypings === true;
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
