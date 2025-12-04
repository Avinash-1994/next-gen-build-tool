import { predictBuildTime, optimizeConfig, ProjectAnalysis } from '../src/ai/analyzer.js';
import assert from 'assert';

async function testML() {
    console.log('Testing ML & Optimization...');

    const mockAnalysis: ProjectAnalysis = {
        framework: 'react',
        typescript: true,
        packageManager: 'npm',
        dependencies: [],
        fileCount: 100,
        totalSize: 2 * 1024 * 1024, // 2MB
        entryPoints: []
    };

    // Test 1: Build Time Prediction
    console.log('Test 1: Build Time Prediction');
    const predictedTime = predictBuildTime(mockAnalysis);
    console.log(`Predicted build time: ${predictedTime}ms`);
    assert(predictedTime > 500, 'Prediction should be greater than base overhead');
    // Base 500 + 100 files * (30 + 20) = 5500
    assert(predictedTime === 5500, 'Prediction calculation mismatch');
    console.log('✓ Prediction passed');

    // Test 2: Config Optimization
    console.log('Test 2: Config Optimization');
    const initialConfig = { dev: { port: 3000 }, build: {} };
    const optimized = optimizeConfig(mockAnalysis, initialConfig);

    assert(optimized.dev.hmr === true, 'Should enable HMR for React');
    assert(optimized.build.minify === true, 'Should enable minification for large project');
    console.log('✓ Optimization passed');

    console.log('All ML tests passed!');
}

testML().catch(err => {
    console.error('Test failed:', err);
    process.exit(1);
});
