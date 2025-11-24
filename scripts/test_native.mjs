import { RustNativeWorker, helloRust, isNativeAvailable } from '../dist/native/index.js';

console.log('Checking native availability...');
if (isNativeAvailable()) {
    console.log('✅ Native worker is available');
} else {
    console.error('❌ Native worker is NOT available');
    process.exit(1);
}

console.log('\nTesting helloRust()...');
console.log('Result:', helloRust());

console.log('\nTesting RustNativeWorker...');
const worker = new RustNativeWorker(4);
console.log('Pool size:', worker.poolSize);

const code = 'const x = 1;';
console.log('\nTransforming sync:', worker.transformSync(code, 'test.js'));

console.log('\nTransforming async...');
worker.transform(code, 'test.js').then(result => {
    console.log('Result:', result);
    console.log('\n✅ All tests passed!');
});
