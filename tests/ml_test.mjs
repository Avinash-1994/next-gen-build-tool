// src/ai/analyzer.ts
function predictBuildTime(analysis) {
  let perFile = 10;
  if (analysis.framework !== "vanilla")
    perFile = 30;
  if (analysis.typescript)
    perFile += 20;
  const predicted = 500 + analysis.fileCount * perFile;
  return predicted;
}
function optimizeConfig(analysis, currentConfig) {
  const optimized = { ...currentConfig };
  if (analysis.framework === "react" || analysis.framework === "vue" || analysis.framework === "svelte") {
    if (!optimized.dev)
      optimized.dev = {};
    optimized.dev.hmr = true;
  }
  if (analysis.totalSize > 1024 * 1024) {
    if (!optimized.build)
      optimized.build = {};
    optimized.build.minify = true;
  }
  return optimized;
}

// tests/ml_test.ts
import assert from "assert";
async function testML() {
  console.log("Testing ML & Optimization...");
  const mockAnalysis = {
    framework: "react",
    typescript: true,
    packageManager: "npm",
    dependencies: [],
    fileCount: 100,
    totalSize: 2 * 1024 * 1024,
    // 2MB
    entryPoints: []
  };
  console.log("Test 1: Build Time Prediction");
  const predictedTime = predictBuildTime(mockAnalysis);
  console.log(`Predicted build time: ${predictedTime}ms`);
  assert(predictedTime > 500, "Prediction should be greater than base overhead");
  assert(predictedTime === 5500, "Prediction calculation mismatch");
  console.log("\u2713 Prediction passed");
  console.log("Test 2: Config Optimization");
  const initialConfig = { dev: { port: 3e3 }, build: {} };
  const optimized = optimizeConfig(mockAnalysis, initialConfig);
  assert(optimized.dev.hmr === true, "Should enable HMR for React");
  assert(optimized.build.minify === true, "Should enable minification for large project");
  console.log("\u2713 Optimization passed");
  console.log("All ML tests passed!");
}
testML().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
