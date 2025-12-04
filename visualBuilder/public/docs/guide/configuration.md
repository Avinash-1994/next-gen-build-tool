# Configuration API Reference

Complete reference for Next-Gen Build Tool configuration.

## Overview

Configuration can be defined in:
- `nextgen.build.js` (JavaScript)
- `nextgen.build.ts` (TypeScript, recommended)
- `nextgen.build.json` (JSON)

## defineConfig

Helper function for type-safe configuration:

```typescript
import { defineConfig } from '@nextgen/build-tool'

export default defineConfig({
  // your config
})
```

## Pipeline Configuration

### pipeline

Type: `PipelineNode[]`

Array of pipeline nodes that define your build process.

```typescript
{
  pipeline: [
    { type: 'resolver', config: {...} },
    { type: 'transformer', config: {...} },
    { type: 'bundler', config: {...} },
  ]
}
```

## Node Types

### Resolver

Resolves module paths and dependencies.

```typescript
{
  type: 'resolver',
  config: {
    baseUrl: string          // Base directory for resolution
    extensions: string[]     // File extensions to resolve
    alias: Record<string, string>  // Path aliases
    external: string[]       // External modules (don't bundle)
    mainFields: string[]     // package.json fields to check
  }
}
```

**Example:**

```typescript
{
  type: 'resolver',
  config: {
    baseUrl: './src',
    extensions: ['.js', '.ts', '.jsx', '.tsx'],
    alias: {
      '@': './src',
      '@components': './src/components'
    }
  }
}
```

### Transformer

Transforms source code (transpilation, etc).

```typescript
{
  type: 'transformer',
  config: {
    loader: 'esbuild' | 'babel' | 'swc'  // Transformation engine
    target: string                         // ES target version
    jsx: 'automatic' | 'classic'          // JSX transform
    minify: boolean                        // Minify during transform
    sourcemap: boolean                     // Generate source maps
  }
}
```

**Example:**

```typescript
{
  type: 'transformer',
  config: {
    loader: 'esbuild',
    target: 'es2020',
    jsx: 'automatic'
  }
}
```

### Bundler

Bundles modules together.

```typescript
{
  type: 'bundler',
  config: {
    format: 'esm' | 'cjs' | 'iife' | 'umd'  // Output format
    splitting: boolean                       // Code splitting
    chunks: 'auto' | 'manual'               // Chunking strategy
    external: string[]                       // Don't bundle these
    globals: Record<string, string>          // Global variable names
  }
}
```

**Example:**

```typescript
{
  type: 'bundler',
  config: {
    format: 'esm',
    splitting: true,
    external: ['react', 'react-dom']
  }
}
```

### Optimizer

Optimizes output for production.

```typescript
{
  type: 'optimizer',
  config: {
    minify: boolean                    // Minify code
    sourcemap: boolean | 'inline'      // Source maps
    treeShaking: boolean               // Remove unused code
    compression: 'none' | 'gzip' | 'brotli'  // Compression
    mangling: boolean                  // Mangle variable names
  }
}
```

**Example:**

```typescript
{
  type: 'optimizer',
  config: {
    minify: true,
    sourcemap: true,
    treeShaking: true,
    compression: 'gzip'
  }
}
```

### Plugin Manager

Loads and executes plugins.

```typescript
{
  type: 'plugin',
  config: {
    plugins: Array<string | [string, any]>  // Plugin names/configs
    pluginOrder: 'pre' | 'normal' | 'post'  // Execution order
  }
}
```

**Example:**

```typescript
{
  type: 'plugin',
  config: {
    plugins: [
      '@nextgen/plugin-vue',
      ['@nextgen/plugin-env', { prefix: 'VITE_' }]
    ]
  }
}
```

## Output Configuration

### output

Type: `OutputConfig`

Configure build output.

```typescript
{
  output: {
    dir: string              // Output directory
    clean: boolean           // Clean before build
    publicPath: string       // Public path for assets
    assetFileNames: string   // Asset filename pattern
    chunkFileNames: string   // Chunk filename pattern
    entryFileNames: string   // Entry filename pattern
  }
}
```

**Example:**

```typescript
{
  output: {
    dir: 'dist',
    clean: true,
    publicPath: '/assets/',
    assetFileNames: 'assets/[name]-[hash][extname]',
    chunkFileNames: 'chunks/[name]-[hash].js'
  }
}
```

## Server Configuration

### server

Type: `ServerConfig`

Dev server configuration.

```typescript
{
  server: {
    port: number             // Port number
    host: string             // Host address
    open: boolean            // Open browser
    https: boolean |  SSLOptions  // HTTPS config
    proxy: Record<string, ProxyConfig>  // Proxy rules
    hmr: boolean             // Hot Module Replacement
    cors: boolean            // Enable CORS
  }
}
```

**Example:**

```typescript
{
  server: {
    port: 3000,
    host: 'localhost',
    open: true,
    hmr: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true
      }
    }
  }
}
```

## Build Configuration

### build

Type: `BuildConfig`

Production build settings.

```typescript
{
  build: {
    target: string[]         // Browser targets
    outDir: string           // Output directory
    assetsDir: string        // Assets subdirectory
    sourcemap: boolean       // Generate source maps
    minify: boolean          // Minify output
    manifest: boolean        // Generate manifest
    ssrManifest: boolean     // SSR manifest
    reportCompressedSize: boolean  // Report sizes
  }
}
```

**Example:**

```typescript
{
  build: {
    target: ['es2020', 'edge88', 'firefox78', 'chrome87'],
    outDir: 'dist',
    sourcemap: true,
    minify: true,
    manifest: true
  }
}
```

## Environment Variables

### env

Type: `Record<string, string>`

Define environment variables.

```typescript
{
  env: {
    API_URL: process.env.API_URL || 'http://localhost:3000',
    APP_VERSION: '1.0.0'
  }
}
```

Access in code:

```javascript
console.log(import.meta.env.API_URL)
```

## Caching

### cache

Type: `CacheConfig`

Configure build caching.

```typescript
{
  cache: {
    enabled: boolean         // Enable caching
    directory: string        // Cache directory
    buildDependencies: string[]  // Invalidate when these change
    version: string          // Cache version
  }
}
```

**Example:**

```typescript
{
  cache: {
    enabled: true,
    directory: 'node_modules/.nextgen-cache',
    buildDependencies: ['package.json', 'nextgen.build.ts']
  }
}
```

## Full Example

```typescript
import { defineConfig } from '@nextgen/build-tool'

export default defineConfig({
  pipeline: [
    {
      type: 'resolver',
      config: {
        baseUrl: './src',
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
        alias: {
          '@': './src',
        },
      },
    },
    {
      type: 'transformer',
      config: {
        loader: 'esbuild',
        target: 'es2020',
        jsx: 'automatic',
      },
    },
    {
      type: 'bundler',
      config: {
        format: 'esm',
        splitting: true,
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

  output: {
    dir: 'dist',
    clean: true,
  },

  server: {
    port: 3000,
    open: true,
    hmr: true,
  },

  build: {
    target: ['es2020'],
    sourcemap: true,
    minify: true,
  },

  cache: {
    enabled: true,
  },
})
```

## Type Definitions

Full type definitions available in:
- `@nextgen/build-tool/types`
- IDE autocomplete (with TypeScript)

---

**See also:**
- [Plugin API](/docs/api/plugins)
- [CLI Reference](/docs/api/cli)
- [Examples](https://github.com/your-org/examples)
