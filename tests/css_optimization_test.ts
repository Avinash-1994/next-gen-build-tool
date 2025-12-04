import {
    splitCSSBundle,
    purgeUnusedCSS,
    extractCriticalCSS,
    analyzeCSS
} from '../src/plugins/css/css-optimizer.js';

async function runTests() {
    const tests = [
        {
            name: 'CSS Bundle Splitting',
            verify: async () => {
                const css = '.a { color: red; } '.repeat(1000); // Large CSS
                const { critical, async } = await splitCSSBundle(css, { criticalThreshold: 1000 });
                return critical.length > 0 && critical.length <= 1100 && async.length > 0;
            }
        },
        {
            name: 'Framework-aware Purging (Tailwind)',
            verify: async () => {
                const css = '.btn { padding: 10px; } .hover\\:bg-blue { background: blue; } .unused { display: none; }';
                const usedClasses = new Set(['btn']);
                const purged = await purgeUnusedCSS(css, usedClasses, { framework: 'tailwind' });
                // Should keep .btn and .hover:bg-blue (Tailwind pattern), remove .unused
                return purged.includes('btn') && purged.includes('hover') && !purged.includes('unused');
            }
        },
        {
            name: 'Framework-aware Purging (Bootstrap)',
            verify: async () => {
                const css = '.btn-primary { color: white; } .nav-link { padding: 5px; } .custom { margin: 10px; }';
                const usedClasses = new Set(['btn-primary']);
                const purged = await purgeUnusedCSS(css, usedClasses, { framework: 'bootstrap' });
                // Should keep .btn-primary and .nav-link (Bootstrap pattern)
                return purged.includes('btn-primary') && purged.includes('nav-link');
            }
        },
        {
            name: 'Critical CSS Extraction',
            verify: async () => {
                const html = '<div class="header"><button class="btn">Click</button></div>';
                const css = '.header { padding: 20px; } .btn { color: blue; } .footer { margin: 10px; }';
                const critical = await extractCriticalCSS(html, css);
                return critical.includes('header') && critical.includes('btn') && !critical.includes('footer');
            }
        },
        {
            name: 'CSS Analysis',
            verify: async () => {
                const css = '.a { color: red; } .b { color: blue; } .c { color: green; }';
                const usedClasses = new Set(['a', 'b']);
                const analysis = await analyzeCSS(css, usedClasses);
                return analysis.ruleCount === 3 && analysis.unusedRules === 1;
            }
        }
    ];

    let passed = 0;
    let failed = 0;

    console.log('🧪 Running CSS Optimization Tests\n');

    for (const test of tests) {
        try {
            const result = await test.verify();
            if (result) {
                console.log(`✅ ${test.name} passed`);
                passed++;
            } else {
                console.error(`❌ ${test.name} failed`);
                failed++;
            }
        } catch (error: any) {
            console.error(`❌ ${test.name} failed with error:`, error.message);
            failed++;
        }
    }

    console.log(`\nResults: ${passed} passed, ${failed} failed`);
    if (failed > 0) process.exit(1);
}

runTests().catch(console.error);
