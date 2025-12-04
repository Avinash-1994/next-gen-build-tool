import { detectCSSFramework } from '../core/css-framework-detector.js';
import { log } from '../utils/logger.js';

export async function detectCSSCommand(cwd: string) {
    log.info('🔍 Detecting CSS frameworks...\n');

    const detected = await detectCSSFramework(cwd);

    if (detected.name === 'none') {
        log.warn('No CSS framework detected');
        console.log('\nTo add a CSS framework:');
        console.log('  nextgen css add tailwind');
        console.log('  nextgen css add bootstrap');
        console.log('  nextgen css add bulma');
        console.log('  nextgen css add material');
        return;
    }

    console.log(`\n✅ Detected: ${detected.name.toUpperCase()}`);
    if (detected.version) {
        console.log(`   Version: ${detected.version}`);
    }
    console.log(`   Source: ${detected.source}`);

    console.log('\n📊 CSS Framework Stack:');
    console.log(`   Framework: ${detected.name}`);
    console.log(`   Detection Method: ${detected.source}`);
}

export async function listCSSCommand(cwd: string) {
    log.info('📋 Active CSS stack:\n');

    const detected = await detectCSSFramework(cwd);

    console.log('CSS Frameworks:');
    if (detected.name !== 'none') {
        console.log(`  ✓ ${detected.name} ${detected.version || ''}`);
    } else {
        console.log('  (none detected)');
    }

    // TODO: Add preprocessor detection
    console.log('\nPreprocessors:');
    console.log('  (detection coming soon)');
}

export async function addCSSCommand(framework: string, cwd: string) {
    log.info(`Adding ${framework}...`);

    // TODO: Implement framework installation
    console.log(`\nTo manually add ${framework}:`);

    switch (framework) {
        case 'tailwind':
            console.log('  npm install -D tailwindcss postcss autoprefixer');
            console.log('  npx tailwindcss init');
            break;
        case 'bootstrap':
            console.log('  npm install bootstrap');
            break;
        case 'bulma':
            console.log('  npm install bulma');
            break;
        case 'material':
        case 'mui':
            console.log('  npm install @mui/material @emotion/react @emotion/styled');
            break;
        default:
            log.error(`Unknown framework: ${framework}`);
    }
}

export async function purgeCSSCommand(cwd: string) {
    log.info('🧹 Analyzing CSS for unused styles...');

    // TODO: Implement CSS purging
    console.log('\nCSS Purge Analysis:');
    console.log('  (coming soon)');
}
