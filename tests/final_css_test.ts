import fs from 'fs/promises';
import path from 'path';

// Import all test modules
import { detectCSSFramework } from '../src/core/css-framework-detector.js';
import { detectBootstrapUsage, injectBootstrapCDN } from '../src/plugins/css/bootstrap.js';
import { detectBulmaUsage, injectBulmaCDN } from '../src/plugins/css/bulma.js';
import { detectMaterialUsage, injectMaterialCDN } from '../src/plugins/css/material.js';
import { detectStyledComponents } from '../src/plugins/css/styled-components.js';
import { detectEmotion } from '../src/plugins/css/emotion.js';
import { detectCSSModules } from '../src/plugins/css/css-modules.js';
import { SassPlugin } from '../src/plugins/css/sass.js';
import { LessPlugin } from '../src/plugins/css/less.js';
import { StylusPlugin } from '../src/plugins/css/stylus.js';

interface TestResult {
    category: string;
    name: string;
    passed: boolean;
    error?: string;
}

const results: TestResult[] = [];

async function runTest(category: string, name: string, testFn: () => Promise<boolean>) {
    try {
        const passed = await testFn();
        results.push({ category, name, passed });
        console.log(passed ? `✅ ${category}: ${name}` : `❌ ${category}: ${name}`);
    } catch (error: any) {
        results.push({ category, name, passed: false, error: error.message });
        console.log(`❌ ${category}: ${name} - ${error.message}`);
    }
}

async function runAllTests() {
    const testDir = path.join(process.cwd(), 'temp_final_css_tests');
    await fs.mkdir(testDir, { recursive: true });

    console.log('🧪 Running Comprehensive CSS Framework Tests\n');

    // === CSS Framework Detection ===
    console.log('📊 CSS Framework Detection:');

    await runTest('Detection', 'Tailwind (package.json)', async () => {
        const dir = path.join(testDir, 'tailwind_pkg');
        await fs.mkdir(dir, { recursive: true });
        await fs.writeFile(path.join(dir, 'package.json'), JSON.stringify({
            devDependencies: { tailwindcss: '^3.4.0' }
        }));
        const result = await detectCSSFramework(dir);
        return result.name === 'tailwind';
    });

    await runTest('Detection', 'Bootstrap (package.json)', async () => {
        const dir = path.join(testDir, 'bootstrap_pkg');
        await fs.mkdir(dir, { recursive: true });
        await fs.writeFile(path.join(dir, 'package.json'), JSON.stringify({
            dependencies: { bootstrap: '^5.3.0' }
        }));
        const result = await detectCSSFramework(dir);
        return result.name === 'bootstrap';
    });

    await runTest('Detection', 'Bulma (package.json)', async () => {
        const dir = path.join(testDir, 'bulma_pkg');
        await fs.mkdir(dir, { recursive: true });
        await fs.writeFile(path.join(dir, 'package.json'), JSON.stringify({
            dependencies: { bulma: '^0.9.4' }
        }));
        const result = await detectCSSFramework(dir);
        return result.name === 'bulma';
    });

    await runTest('Detection', 'Material UI (package.json)', async () => {
        const dir = path.join(testDir, 'material_pkg');
        await fs.mkdir(dir, { recursive: true });
        await fs.writeFile(path.join(dir, 'package.json'), JSON.stringify({
            dependencies: { '@mui/material': '^5.14.0' }
        }));
        const result = await detectCSSFramework(dir);
        return result.name === 'material';
    });

    // === Framework Plugins ===
    console.log('\n🔌 Framework Plugins:');

    await runTest('Bootstrap', 'Detection', async () => {
        const dir = path.join(testDir, 'bootstrap_detect');
        await fs.mkdir(dir, { recursive: true });
        await fs.writeFile(path.join(dir, 'package.json'), JSON.stringify({
            dependencies: { bootstrap: '^5.3.0' }
        }));
        return await detectBootstrapUsage(dir);
    });

    await runTest('Bootstrap', 'CDN Injection', async () => {
        const html = '<html><head></head><body></body></html>';
        const result = injectBootstrapCDN(html);
        return result.includes('bootstrap.min.css') && result.includes('bootstrap.bundle.min.js');
    });

    await runTest('Bulma', 'Detection', async () => {
        const dir = path.join(testDir, 'bulma_detect');
        await fs.mkdir(dir, { recursive: true });
        await fs.writeFile(path.join(dir, 'package.json'), JSON.stringify({
            dependencies: { bulma: '^0.9.4' }
        }));
        return await detectBulmaUsage(dir);
    });

    await runTest('Bulma', 'CDN Injection', async () => {
        const html = '<html><head></head><body></body></html>';
        const result = injectBulmaCDN(html);
        return result.includes('bulma.min.css');
    });

    await runTest('Material', 'Detection', async () => {
        const dir = path.join(testDir, 'material_detect');
        await fs.mkdir(dir, { recursive: true });
        await fs.writeFile(path.join(dir, 'package.json'), JSON.stringify({
            dependencies: { '@mui/material': '^5.14.0' }
        }));
        return await detectMaterialUsage(dir);
    });

    await runTest('Material', 'CDN Injection', async () => {
        const html = '<html><head></head><body></body></html>';
        const result = injectMaterialCDN(html);
        return result.includes('Material+Icons') && result.includes('Roboto');
    });

    // === CSS-in-JS ===
    console.log('\n💅 CSS-in-JS:');

    await runTest('CSS-in-JS', 'styled-components Detection', async () => {
        const dir = path.join(testDir, 'styled_detect');
        await fs.mkdir(dir, { recursive: true });
        await fs.writeFile(path.join(dir, 'package.json'), JSON.stringify({
            dependencies: { 'styled-components': '^6.1.0' }
        }));
        return await detectStyledComponents(dir);
    });

    await runTest('CSS-in-JS', 'Emotion Detection', async () => {
        const dir = path.join(testDir, 'emotion_detect');
        await fs.mkdir(dir, { recursive: true });
        await fs.writeFile(path.join(dir, 'package.json'), JSON.stringify({
            dependencies: { '@emotion/react': '^11.11.0' }
        }));
        return await detectEmotion(dir);
    });

    await runTest('CSS-in-JS', 'CSS Modules Detection', async () => {
        const dir = path.join(testDir, 'modules_detect');
        await fs.mkdir(dir, { recursive: true });
        await fs.mkdir(path.join(dir, 'src'), { recursive: true });
        await fs.writeFile(path.join(dir, 'src', 'App.module.css'), '.button { color: blue; }');
        return await detectCSSModules(dir);
    });

    // === Preprocessors ===
    console.log('\n🎨 Preprocessors:');

    await runTest('Preprocessors', 'Sass Plugin Exists', async () => {
        const plugin = new SassPlugin();
        return plugin.name === 'sass-plugin';
    });

    await runTest('Preprocessors', 'Less Plugin Exists', async () => {
        const plugin = new LessPlugin();
        return plugin.name === 'less-plugin';
    });

    await runTest('Preprocessors', 'Stylus Plugin Exists', async () => {
        const plugin = new StylusPlugin();
        return plugin.name === 'stylus-plugin';
    });

    // Cleanup
    await fs.rm(testDir, { recursive: true, force: true });

    // Summary
    console.log('\n' + '='.repeat(50));
    console.log('📊 Test Summary:');
    console.log('='.repeat(50));

    const categories = [...new Set(results.map(r => r.category))];
    for (const category of categories) {
        const categoryResults = results.filter(r => r.category === category);
        const passed = categoryResults.filter(r => r.passed).length;
        const total = categoryResults.length;
        console.log(`${category}: ${passed}/${total} passed`);
    }

    const totalPassed = results.filter(r => r.passed).length;
    const totalTests = results.length;

    console.log('='.repeat(50));
    console.log(`\n✅ Total: ${totalPassed}/${totalTests} tests passed`);

    if (totalPassed === totalTests) {
        console.log('\n🎉 All CSS Framework Perfection features verified!');
    } else {
        console.log(`\n⚠️  ${totalTests - totalPassed} tests failed`);
        process.exit(1);
    }
}

runAllTests().catch(console.error);
