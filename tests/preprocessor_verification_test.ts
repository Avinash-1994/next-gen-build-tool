import fs from 'fs/promises';
import path from 'path';
import { SassPlugin } from '../src/plugins/css/sass.js';
import { LessPlugin } from '../src/plugins/css/less.js';
import { StylusPlugin } from '../src/plugins/css/stylus.js';

async function runTests() {
    const testDir = path.join(process.cwd(), 'temp_preprocessor_tests');
    await fs.mkdir(testDir, { recursive: true });

    const tests = [
        {
            name: 'Sass: Variables',
            setup: async (dir: string) => {
                const scssFile = path.join(dir, 'test.scss');
                await fs.writeFile(scssFile, `
          $primary-color: #3498db;
          .button { color: $primary-color; }
        `);
                return scssFile;
            },
            verify: async (file: string) => {
                const plugin = new SassPlugin();
                const code = await fs.readFile(file, 'utf-8');
                const result = await plugin.transform(code, file);
                return result && result.includes('#3498db');
            }
        },
        {
            name: 'Sass: Nesting',
            setup: async (dir: string) => {
                const scssFile = path.join(dir, 'nesting.scss');
                await fs.writeFile(scssFile, `
          .container {
            .button { padding: 10px; }
          }
        `);
                return scssFile;
            },
            verify: async (file: string) => {
                const plugin = new SassPlugin();
                const code = await fs.readFile(file, 'utf-8');
                const result = await plugin.transform(code, file);
                return result && result.includes('.container .button');
            }
        },
        {
            name: 'Sass: Mixins',
            setup: async (dir: string) => {
                const scssFile = path.join(dir, 'mixins.scss');
                await fs.writeFile(scssFile, `
          @mixin border-radius($radius) {
            border-radius: $radius;
          }
          .box { @include border-radius(5px); }
        `);
                return scssFile;
            },
            verify: async (file: string) => {
                const plugin = new SassPlugin();
                const code = await fs.readFile(file, 'utf-8');
                const result = await plugin.transform(code, file);
                return result && result.includes('border-radius: 5px');
            }
        },
        {
            name: 'Less: Variables',
            setup: async (dir: string) => {
                const lessFile = path.join(dir, 'test.less');
                await fs.writeFile(lessFile, `
          @primary-color: #e74c3c;
          .button { color: @primary-color; }
        `);
                return lessFile;
            },
            verify: async (file: string) => {
                const plugin = new LessPlugin();
                const code = await fs.readFile(file, 'utf-8');
                const result = await plugin.transform(code, file);
                return result && result.includes('#e74c3c');
            }
        },
        {
            name: 'Less: Nesting',
            setup: async (dir: string) => {
                const lessFile = path.join(dir, 'nesting.less');
                await fs.writeFile(lessFile, `
          .header {
            .nav { display: flex; }
          }
        `);
                return lessFile;
            },
            verify: async (file: string) => {
                const plugin = new LessPlugin();
                const code = await fs.readFile(file, 'utf-8');
                const result = await plugin.transform(code, file);
                return result && result.includes('.header .nav');
            }
        },
        {
            name: 'Less: Mixins',
            setup: async (dir: string) => {
                const lessFile = path.join(dir, 'mixins.less');
                await fs.writeFile(lessFile, `
          .rounded(@radius: 5px) {
            border-radius: @radius;
          }
          .card { .rounded(10px); }
        `);
                return lessFile;
            },
            verify: async (file: string) => {
                const plugin = new LessPlugin();
                const code = await fs.readFile(file, 'utf-8');
                const result = await plugin.transform(code, file);
                return result && result.includes('border-radius: 10px');
            }
        },
        {
            name: 'Stylus: Variables',
            setup: async (dir: string) => {
                const stylFile = path.join(dir, 'test.styl');
                await fs.writeFile(stylFile, `
          primary-color = #2ecc71
          .button
            color primary-color
        `);
                return stylFile;
            },
            verify: async (file: string) => {
                const plugin = new StylusPlugin();
                const code = await fs.readFile(file, 'utf-8');
                const result = await plugin.transform(code, file);
                return result && result.includes('#2ecc71');
            }
        },
        {
            name: 'Stylus: Nesting',
            setup: async (dir: string) => {
                const stylFile = path.join(dir, 'nesting.styl');
                await fs.writeFile(stylFile, `
          .sidebar
            .menu
              padding 20px
        `);
                return stylFile;
            },
            verify: async (file: string) => {
                const plugin = new StylusPlugin();
                const code = await fs.readFile(file, 'utf-8');
                const result = await plugin.transform(code, file);
                return result && result.includes('.sidebar .menu');
            }
        },
        {
            name: 'Stylus: Mixins',
            setup: async (dir: string) => {
                const stylFile = path.join(dir, 'mixins.styl');
                await fs.writeFile(stylFile, `
          border-radius(n)
            border-radius n
          .element
            border-radius(8px)
        `);
                return stylFile;
            },
            verify: async (file: string) => {
                const plugin = new StylusPlugin();
                const code = await fs.readFile(file, 'utf-8');
                const result = await plugin.transform(code, file);
                return result && result.includes('border-radius: 8px');
            }
        }
    ];

    let passed = 0;
    let failed = 0;

    for (const test of tests) {
        const caseDir = path.join(testDir, test.name.replace(/[^a-z0-9]/gi, '_'));
        await fs.mkdir(caseDir, { recursive: true });

        try {
            const file = await test.setup(caseDir);
            const result = await test.verify(file);

            if (result) {
                console.log(`✅ ${test.name} passed`);
                passed++;
            } else {
                console.error(`❌ ${test.name} failed`);
                failed++;
            }
        } catch (error: any) {
            // Skip if preprocessor not installed
            if (error.code === 'MODULE_NOT_FOUND' || error.message?.includes('not installed')) {
                console.log(`⚠️  ${test.name} skipped (preprocessor not installed)`);
            } else {
                console.error(`❌ ${test.name} failed with error:`, error.message);
                failed++;
            }
        }
    }

    // Cleanup
    await fs.rm(testDir, { recursive: true, force: true });

    console.log(`\nResults: ${passed} passed, ${failed} failed`);
    if (failed > 0) process.exit(1);
}

runTests().catch(console.error);
