# Frequently Asked Questions

Common questions about Next-Gen Build Tool.

## General

### What is Next-Gen Build Tool?

Next-Gen Build Tool is a modern, high-performance build system that combines Rust-powered native workers with an intuitive visual pipeline builder. It's designed to be faster than traditional JavaScript-based build tools while providing better developer experience.

### How is it different from Vite, Webpack, or Rollup?

**Key Differences:**

- **Performance**: Uses Rust native workers for parallelization
- **Visual Builder**: Drag-and-drop pipeline configuration
- **Integrated Analytics**: Built-in bundle analysis
- **Framework Agnostic**: Works with React, Vue, Angular, Svelte out of the box

### Is it production-ready?

Yes! Version 1.0.0 is stable and battle-tested in production environments.

### What's the license?

MIT License - free for commercial and personal use.

## Installation & Setup

### What Node.js version do I need?

Node.js 18.0.0 or higher is required.

### Can I use it with existing projects?

Yes! You can migrate from Vite, Webpack, or other build tools. See our [migration guides](/docs/getting-started/quick-start#migration).

### Do I need to install Rust?

No! Pre-built binaries are included for all major platforms (Windows, macOS, Linux).

## Performance

### How fast is it?

Benchmarks on a typical React app:

| Tool | Cold Start | Hot Reload | Production Build |
|------|-----------|-----------|------------------|
| Next-Gen | 800ms | 50ms | 3.2s |
| Vite | 1.2s | 150ms | 4.5s |
| Webpack | 3.5s | 800ms | 12s |

### Why is it faster?

1. **Rust Workers**: CPU-intensive tasks run in native code
2. **Parallel Processing**: Multi-core utilization
3. **Smart Caching**: Incremental builds
4. **Native Performance**: No JavaScript overhead

### Can I make it even faster?

Yes! Enable these optimizations:

```typescript
{
  cache: {
    enabled: true  // Enable persistent caching
  },
  build: {
    workers: 4  // Adjust worker count
  }
}
```

## Configuration

### Do I have to use the visual builder?

No! You can write configuration files directly  (`nextgen.build.ts`). The visual builder is optional but recommended for beginners.

### Can I use JavaScript config instead of TypeScript?

Yes! Both `.js` and `.ts` config files are supported:

```javascript
// nextgen.build.js
export default {
  pipeline: [...]
}
```

### How do I share config across projects?

Create a shared config package:

```typescript
// @my-company/nextgen-config
export const baseConfig = {
  pipeline: [...]
}

// Your project
import { baseConfig } from '@my-company/nextgen-config'

export default {
  ...baseConfig,
  // Project-specific overrides
}
```

## Framework Support

### Which frameworks are supported?

- ✅ React (18+)
- ✅ Vue (3+)
- ✅ Angular (14+)
- ✅ Svelte (4+)
- ✅ Vanilla JavaScript/TypeScript
- 🔜 Solid.js (coming soon)
- 🔜 Qwik (coming soon)

### Does it work with Next.js?

Not yet. Next.js integration is planned for v1.2.0.

### Can I use it with monorepos?

Yes! It works great with monorepos (Turbo repo, Nx, Lerna):

```typescript
// apps/app1/nextgen.build.ts
export default {
  pipeline: [...]
}

// apps/app2/nextgen.build.ts
export default {
  pipeline: [...]
}
```

## Features

### Does it support TypeScript?

Yes! TypeScript is fully supported with zero configuration required.

### What about CSS preprocessors?

Supported via plugins:
- SCSS/SASS: `@nextgen/plugin-sass`
- Less: `@nextgen/plugin-less`
- PostCSS: `@nextgen/plugin-postcss`
- CSS Modules: Built-in

### Can I use environment variables?

Yes:

```typescript
// nextgen.build.ts
export default {
  env: {
    API_URL: process.env.API_URL
  }
}

// In code
console.log(import.meta.env.API_URL)
```

### Does it have Hot Module Replacement?

Yes! HMR is enabled by default in dev mode.

## Plugins

### How do I create a plugin?

See the [Plugin API documentation](/docs/api/plugins):

```typescript
export default function myPlugin(options) {
  return {
    name: 'my-plugin',
    setup(build) {
      build.onResolve({ filter: /\.txt$/ }, args => ({
        path: args.path,
        namespace: 'text'
      }))
    }
  }
}
```

### Where can I find plugins?

- [Official Plugins](https://github.com/your-org/plugins)
- npm search: `npm search nextgen-plugin`
- Community plugins on GitHub

### Can I use esbuild/rollup plugins?

Some esbuild plugins work directly. For others, use adapters:

```typescript
import esbuildPlugin from 'some-esbuild-plugin'
import { adaptEsbuildPlugin } from '@nextgen/plugin-utils'

{
  type: 'plugin',
  config: {
    plugins: [adaptEsbuildPlugin(esbuildPlugin)]
  }
}
```

## Troubleshooting

### Build fails with "out of memory"

Increase Node.js memory:

```bash
NODE_OPTIONS=--max-old-space-size=4096 nextgen build
```

### Module resolution errors

Check your resolver config:

```typescript
{
  type: 'resolver',
  config: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],  // Add all extensions
    alias: {
      '@': './src'  // Verify paths are correct
    }
  }
}
```

### Dev server not reloading

1. Check HMR is enabled: `server: { hmr: true }`
2. Clear cache: `rm -rf node_modules/.nextgen-cache`
3. Restart dev server

### Production build is large

Enable optimizations:

```typescript
{
  type: 'optimizer',
  config: {
    minify: true,
    treeShaking: true,
    compression: 'gzip'
  }
}
```

## Migration

### How do I migrate from Webpack?

1. Install Next-Gen Build Tool
2. Create `nextgen.build.ts` based on your webpack config
3. Update package.json scripts
4. Test thoroughly
5. Remove webpack and loaders

See detailed [Webpack migration guide](/docs/tutorials/webpack-migration).

### How do I migrate from Vite?

Very easy! Config is similar:

```typescript
// vite.config.js → nextgen.build.ts
import { defineConfig } from '@nextgen/build-tool'

export default defineConfig({
  // Most Vite options translate directly
  server: { port: 3000 },
  build: { target: 'es2020' }
})
```

## Community & Support

### Where can I get help?

- [Discord Community](https://discord.gg/nextgen)
- [GitHub Discussions](https://github.com/your-org/next-gen-build-tool/discussions)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/nextgen-build-tool)

### How do I report bugs?

Open an issue on [GitHub](https://github.com/your-org/next-gen-build-tool/issues) with:
- Steps to reproduce
- Expected vs actual behavior
- Config file
- Build logs

### Can I contribute?

Yes! We welcome contributions:
- Code contributions
- Documentation improvements
- Plugin development
- Bug reports

See [Contributing Guide](https://github.com/your-org/next-gen-build-tool/blob/main/CONTRIBUTING.md).

## Pricing & Licensing

### Is it free?

Yes! MIT licensed and completely free for commercial and personal use.

### Are there paid features?

No. All features are free and open source.

### Enterprise support?

Enterprise support plans available. Contact: enterprise@nextgen-build.com

---

**Didn't find your answer?** Ask in [Discord](https://discord.gg/nextgen) or [open a discussion](https://github.com/discussions).
