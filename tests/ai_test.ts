import { generateSuggestions, ProjectAnalysis } from '../src/ai/analyzer.js';
import assert from 'assert';

async function testAI() {
    console.log('Testing AI Analyzer...');

    const mockAnalysis: ProjectAnalysis = {
        framework: 'react',
        typescript: true,
        packageManager: 'npm',
        dependencies: ['react', 'typescript'],
        fileCount: 20,
        totalSize: 1000,
        entryPoints: ['src/main.tsx']
    };

    // Test 1: Basic Suggestions
    console.log('Test 1: Basic Suggestions');
    const basicSuggestions = await generateSuggestions(mockAnalysis);
    assert(basicSuggestions.some(s => s.title === 'React Fast Refresh'), 'Should suggest React Fast Refresh');
    assert(basicSuggestions.some(s => s.title === 'TypeScript Config'), 'Should suggest TypeScript Config');
    console.log('✓ Basic suggestions passed');

    // Test 2: Large Chunk Detection
    console.log('Test 2: Large Chunk Detection');
    const mockMetafile = {
        outputs: {
            'dist/large.js': { bytes: 600 * 1024 }, // 600KB
            'dist/small.js': { bytes: 10 * 1024 }
        }
    };
    const chunkSuggestions = await generateSuggestions(mockAnalysis, mockMetafile);
    assert(chunkSuggestions.some(s => s.title === 'Large Chunks Detected'), 'Should detect large chunks');
    console.log('✓ Large chunk detection passed');

    // Test 3: High Bundle Size
    console.log('Test 3: High Bundle Size');
    const mockHugeMetafile = {
        outputs: {
            'dist/huge.js': { bytes: 3 * 1024 * 1024 } // 3MB
        }
    };
    const sizeSuggestions = await generateSuggestions(mockAnalysis, mockHugeMetafile);
    assert(sizeSuggestions.some(s => s.title === 'High Bundle Size'), 'Should detect high bundle size');
    console.log('✓ High bundle size detection passed');

    console.log('All AI tests passed!');
}

testAI().catch(err => {
    console.error('Test failed:', err);
    process.exit(1);
});
