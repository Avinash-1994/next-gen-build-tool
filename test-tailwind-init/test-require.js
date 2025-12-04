import { createRequire } from 'module';
import path from 'path';

const require = createRequire(path.resolve(process.cwd(), 'package.json'));

try {
    console.log('Resolving @tailwindcss/postcss...');
    const pkg = require('@tailwindcss/postcss');
    console.log('Success:', typeof pkg);
} catch (e) {
    console.error('Failed:', e);
}
