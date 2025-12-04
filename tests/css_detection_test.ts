import fs from 'fs/promises';
import path from 'path';
import { detectCSSFramework } from '../src/core/css-framework-detector.js';
import { log } from '../src/utils/logger.js';

// Mock logger
log.info = () => { };
log.warn = () => { };
log.success = () => { };

async function runTests() {
    const testDir = path.join(process.cwd(), 'temp_css_detection_tests');
    await fs.mkdir(testDir, { recursive: true });

    const tests = [
        {
            name: 'Tailwind Detection (package.json)',
            setup: async (dir: string) => {
                await fs.writeFile(path.join(dir, 'package.json'), JSON.stringify({
                    devDependencies: { tailwindcss: '^3.4.0' }
                }));
            },
            expected: 'tailwind'
        },
        {
            name: 'Bootstrap Detection (package.json)',
            setup: async (dir: string) => {
                await fs.writeFile(path.join(dir, 'package.json'), JSON.stringify({
                    dependencies: { bootstrap: '^5.3.0' }
                }));
            },
            expected: 'bootstrap'
        },
        {
            name: 'Bulma Detection (package.json)',
            setup: async (dir: string) => {
                await fs.writeFile(path.join(dir, 'package.json'), JSON.stringify({
                    dependencies: { bulma: '^0.9.4' }
                }));
            },
            expected: 'bulma'
        },
        {
            name: 'Material UI Detection (package.json)',
            setup: async (dir: string) => {
                await fs.writeFile(path.join(dir, 'package.json'), JSON.stringify({
                    dependencies: { '@mui/material': '^5.14.0' }
                }));
            },
            expected: 'material'
        },
        {
            name: 'Tailwind Detection (config file)',
            setup: async (dir: string) => {
                await fs.writeFile(path.join(dir, 'package.json'), JSON.stringify({}));
                await fs.writeFile(path.join(dir, 'tailwind.config.js'), 'module.exports = {}');
            },
            expected: 'tailwind'
        },
        {
            name: 'Bootstrap Detection (class scan)',
            setup: async (dir: string) => {
                await fs.writeFile(path.join(dir, 'package.json'), JSON.stringify({}));
                await fs.mkdir(path.join(dir, 'src'), { recursive: true });
                await fs.writeFile(path.join(dir, 'src', 'App.tsx'), `
          export function App() {
            return <div className="container"><button className="btn btn-primary">Click</button></div>;
          }
        `);
            },
            expected: 'bootstrap'
        },
        {
            name: 'Tailwind Detection (class scan)',
            setup: async (dir: string) => {
                await fs.writeFile(path.join(dir, 'package.json'), JSON.stringify({}));
                await fs.mkdir(path.join(dir, 'src'), { recursive: true });
                await fs.writeFile(path.join(dir, 'src', 'App.tsx'), `
          export function App() {
            return <div className="flex bg-blue-500 text-white p-4">Hello</div>;
          }
        `);
            },
            expected: 'tailwind'
        },
        {
            name: 'No Framework Detection',
            setup: async (dir: string) => {
                await fs.writeFile(path.join(dir, 'package.json'), JSON.stringify({
                    dependencies: { lodash: '1.0.0' }
                }));
            },
            expected: 'none'
        }
    ];

    let passed = 0;
    let failed = 0;

    for (const test of tests) {
        const caseDir = path.join(testDir, test.name.replace(/[^a-z0-9]/gi, '_'));
        await fs.mkdir(caseDir, { recursive: true });
        await test.setup(caseDir);

        const result = await detectCSSFramework(caseDir);

        if (result.name === test.expected) {
            console.log(`✅ ${test.name} passed`);
            passed++;
        } else {
            console.error(`❌ ${test.name} failed. Expected ${test.expected}, got ${result.name}`);
            failed++;
        }
    }

    // Cleanup
    await fs.rm(testDir, { recursive: true, force: true });

    console.log(`\nResults: ${passed} passed, ${failed} failed`);
    if (failed > 0) process.exit(1);
}

runTests().catch(console.error);
