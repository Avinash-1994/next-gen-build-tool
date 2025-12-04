# React Integration Guide

Learn how to integrate Next-Gen Build Tool with your React applications.

## Supported React Setups

Next-Gen Build Tool works seamlessly with:

- **Create React App** (CRA)
- **Vite + React**
- **Next.js** (coming soon)
- **Custom Webpack setups**

## Installation

First, install the build tool:

\`\`\`bash
npm install -D @nextgen/build-tool
# or
yarn add -D @nextgen/build-tool
\`\`\`

## Basic Configuration

Create a `nextgen.build.ts` file in your project root:

\`\`\`typescript
import { defineConfig } from '@nextgen/build-tool'

export default define Config({
  pipeline: [
    {
      type: 'resolver',
      config: {
        baseUrl: './src',
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
        alias: {
          '@': './src',
          '@components': './src/components',
        },
      },
    },
    {
      type: 'transformer',
      config: {
        loader: 'esbuild',
        target: 'es2020',
        jsx: 'automatic', // React 17+ automatic JSX
      },
    },
    {
      type: 'bundler',
      config: {
        format: 'esm',
        splitting: true, // Code splitting
        external: [], // Don't bundle these
      },
    },
    {
      type: 'optimizer',
      config: {
        minify: true,
        sourcemap: true,
        treeShaking: true,
      },
    },
  ],

  // Output configuration
  output: {
    dir: 'dist',
    clean: true,
  },

  // Development server
  server: {
    port: 3000,
    open: true,
    hmr: true, // Hot Module Replacement
  },
})
\`\`\`

## Using the Visual Builder

Instead of writing configuration by hand, use the visual builder:

1. Run `npm run builder` to start the visual interface
2. Navigate to http://localhost:3030/builder
3. Drag nodes onto the canvas
4. Configure each node in the property panel
5. Export your configuration

> [!TIP]
> The visual builder generates type-safe TypeScript configuration!

## Common Patterns

### TypeScript Support

\`\`\`typescript
{
  type: 'transformer',
  config: {
    loader: 'esbuild',
    target: 'es2020',
    jsx: 'automatic',
    // TypeScript is automatically detected
  },
}
\`\`\`

### CSS Modules

\`\`\`typescript
{
  type: 'plugin',
  config: {
    plugins: ['@nextgen/plugin-css-modules'],
  },
}
\`\`\`

### Environment Variables

\`\`\`typescript
{
  type: 'plugin',
  config: {
    plugins: [
      ['@nextgen/plugin-env', {
        prefix: 'REACT_APP_',
      }],
    ],
  },
}
\`\`\`

## Build Scripts

Add these scripts to your `package.json`:

\`\`\`json
{
  "scripts": {
    "dev": "nextgen dev",
    "build": "nextgen build",
    "preview": "nextgen preview",
    "builder": "nextgen builder"
  }
}
\`\`\`

## Migration from CRA

If you're migrating from Create React App:

1. Install Next-Gen Build Tool
2. Create `nextgen.build.ts` (use config above)
3. Update package.json scripts
4. Remove `react-scripts` dependency
5. Test your build

> [!WARNING]
> Some CRA features like `public/index.html` injection work differently. See [Migration Guide](/docs/tutorials/migrating-from-cra).

## Performance Tips

### 1. Enable Code Splitting

\`\`\`typescript
{
  type: 'bundler',
  config: {
    splitting: true, // Automatic code splitting
  },
}
\`\`\`

### 2. Use Tree Shaking

\`\`\`typescript
{
  type: 'optimizer',
  config: {
    treeShaking: true, // Remove unused code
  },
}
\`\`\`

### 3. Optimize Dependencies

\`\`\`typescript
{
  type: 'optimizer',
  config: {
    external: ['react', 'react-dom'], // Don't bundle large deps
  },
}
\`\`\`

## Troubleshooting

### Build Fails with JSX Error

Make sure `jsx: 'automatic'` is set in your transformer config.

### Slow Builds

Enable caching:

\`\`\`typescript
{
  cache: {
    enabled: true,
    directory: 'node_modules/.nextgen-cache',
  },
}
\`\`\`

### Module Not Found

Check your resolver alias configuration:

\`\`\`typescript
{
  type: 'resolver',
  config: {
    alias: {
      '@': './src', // Make sure paths are correct
    },
  },
}
\`\`\`

## Next Steps

- [Build your first React app](/docs/tutorials/first-pipeline)
- [Explore plugins](/docs/core-concepts/plugins)
- [API Reference](/docs/api/configuration)

---

**Questions?** Join our [Discord community](https://discord.gg/nextgen) or [open an issue](https://github.com/your-org/next-gen-build-tool/issues).
