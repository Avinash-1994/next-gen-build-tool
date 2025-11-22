# Node Types Reference

NextGen Build Tool uses **7 specialized node types**, each optimized for a specific stage of the build process. This guide covers all node types, their configurations, and best practices.

---

## Overview

| Node | Icon | Purpose | Common Use |
|------|------|---------|------------|
| **Resolver** | 🔍 | Resolve module paths | Entry point for builds |
| **Transformer** | ⚙️ | Transform/transpile code | JSX, TypeScript, Babel |
| **Bundler** | 📦 | Bundle modules | Create output files |
| **Optimizer** | ⚡ | Optimize output | Minify, tree-shake |
| **Plugin** | 🔌 | Custom middleware | Extend functionality |
| **Micro Frontend** | 🏗️ | Module federation | Micro frontend apps |
| **AI Assistant** | 🤖 | AI optimization | Auto-fix, optimize |

---

## 1. Resolver Node 🔍

**Purpose:** Resolves module paths and dependencies. This is typically the **first node** in your pipeline.

### What It Does

- Finds and resolves import statements
- Handles path aliases (`@/components`)
- Resolves file extensions
- Manages node_modules lookups
- Creates dependency graph

### Configuration

```json
{
  "baseUrl": "./src",
  "extensions": [".tsx", ".ts", ".jsx", ".js", ".json"],
  "alias": {
    "@": "./src",
    "@components": "./src/components",
    "@utils": "./src/utils"
  },
  "external": ["react", "react-dom"],
  "mainFields": ["browser", "module", "main"],
  "preferRelative": false
}
```

### Options Reference

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `baseUrl` | `string` | `"./"` | Base directory for module resolution |
| `extensions` | `string[]` | `[".js", ".json"]` | File extensions to resolve |
| `alias` | `object` | `{}` | Path aliases mapping |
| `external` | `string[]` | `[]` | External dependencies (not bundled) |
| `mainFields` | `string[]` | `["module", "main"]` | Package.json fields to check |
| `preferRelative` | `boolean` | `false` | Prefer relative paths over node_modules |

### Use Cases

**1. TypeScript Project:**
```json
{
  "baseUrl": "./src",
  "extensions": [".tsx", ".ts", ".jsx", ".js"],
  "alias": {
    "@": "./src"
  }
}
```

**2. Monorepo with Workspaces:**
```json
{
  "baseUrl": "./",
  "alias": {
    "@shared": "./packages/shared/src",
    "@utils": "./packages/utils/src",
    "@ui": "./packages/ui/src"
  }
}
```

**3. External Dependencies (CDN):**
```json
{
  "external": ["react", "react-dom", "lodash"],
  "preferRelative": false
}
```

### Best Practices

✅ **DO:**
- Use path aliases for cleaner imports
- List all file extensions you use
- Keep external deps to minimum for smaller bundles

❌ **DON'T:**
- Make baseUrl too deep (keeps imports short)
- Alias everything (only common paths)
- Forget to add extensions for TypeScript

---

## 2. Transformer Node ⚙️

**Purpose:** Transforms and transpiles source code. Connects **after Resolver**, before Bundler.

### What It Does

- Transpiles TypeScript to JavaScript
- Compiles JSX/TSX to JS
- Applies Babel transforms
- Handles CSS modules
- Processes assets

### Configuration

```json
{
  "loader": "esbuild",
  "target": "es2020",
  "jsx": "automatic",
  "jsxFactory": "React.createElement",
  "sourceMaps": true,
  "define": {
    "process.env.NODE_ENV": "\"production\""
  },
  "plugins": []
}
```

### Options Reference

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `loader` | `"babel"` \| `"esbuild"` \| `"swc"` | `"esbuild"` | Transpiler to use |
| `target` | `string` | `"es2020"` | JavaScript target (es2015, es2020, esnext) |
| `jsx` | `"automatic"` \| `"classic"` | `"automatic"` | JSX runtime mode |
| `jsxFactory` | `string` | `"React.createElement"` | JSX factory function |
| `sourceMaps` | `boolean` | `true` | Generate source maps |
| `define` | `object` | `{}` | Global replacements |
| `plugins` | `string[]` | `[]` | Babel/transform plugins |

### Loader Comparison

| Loader | Speed | Features | Best For |
|--------|-------|----------|----------|
| **esbuild** | ⚡⚡⚡ | TypeScript, JSX | Most projects |
| **swc** | ⚡⚡ | TypeScript, JSX, decorators | Advanced TS |
| **babel** | ⚡ | Full ecosystem, plugins | Complex transforms |

### Use Cases

**1. React + TypeScript (esbuild):**
```json
{
  "loader": "esbuild",
  "target": "es2020",
  "jsx": "automatic",
  "sourceMaps": true
}
```

**2. Legacy Browser Support (Babel):**
```json
{
  "loader": "babel",
  "target": "es2015",
  "plugins": [
    "@babel/plugin-transform-runtime",
    "@babel/plugin-proposal-class-properties"
  ]
}
```

**3. Vue 3 with SWC:**
```json
{
  "loader": "swc",
  "target": "es2020",
  "jsx": "automatic",
  "define": {
    "__VUE_OPTIONS_API__": "true",
    "__VUE_PROD_DEVTOOLS__": "false"
  }
}
```

### Best Practices

✅ **DO:**
- Use esbuild for speed (10-100x faster than Babel)
- Enable source maps in development
- Target es2020 for modern browsers

❌ **DON'T:**
- Use Babel unless you need specific plugins
- Target too old (es5) unless necessary
- Disable source maps (hard to debug)

---

## 3. Bundler Node 📦

**Purpose:** Bundles modules into output files. Connects **after Transformer**.

### What It Does

- Combines modules into bundles
- Creates chunks (code splitting)
- Handles dynamic imports
- Generates output files
- Optimizes bundle structure

### Configuration

```json
{
  "format": "esm",
  "splitting": true,
  "chunkSize": 500,
  "entryNames": "[name].[hash]",
  "chunkNames": "[name]-[hash]",
  "external": [],
  "globals": {},
  "platform": "browser"
}
```

### Options Reference

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `format` | `"esm"` \| `"cjs"` \| `"iife"` \| `"umd"` | `"esm"` | Output module format |
| `splitting` | `boolean` | `true` | Enable code splitting |
| `chunkSize` | `number` | `500` | Target chunk size (KB) |
| `entryNames` | `string` | `"[name]"` | Entry file naming pattern |
| `chunkNames` | `string` | `"[name]-[hash]"` | Chunk file naming pattern |
| `external` | `string[]` | `[]` | External dependencies |
| `globals` | `object` | `{}` | Global variable names (UMD) |
| `platform` | `"browser"` \| `"node"` | `"browser"` | Target platform |

### Format Comparison

| Format | Use Case | Example |
|--------|----------|---------|
| **esm** | Modern browsers, ES modules | `import { x } from './module'` |
| **cjs** | Node.js, CommonJS | `const x = require('./module')` |
| **iife** | Standalone script tag | `<script src="bundle.js">` |
| **umd** | Universal (browser + Node) | Works everywhere |

### Use Cases

**1. Modern Web App (ESM + Splitting):**
```json
{
  "format": "esm",
  "splitting": true,
  "entryNames": "[name].[hash].js",
  "chunkNames": "chunks/[name]-[hash].js"
}
```

**2. Node.js Library (CommonJS):**
```json
{
  "format": "cjs",
  "splitting": false,
  "platform": "node",
  "external": ["fs", "path", "http"]
}
```

**3. Browser Library (UMD):**
```json
{
  "format": "umd",
  "splitting": false,
  "globals": {
    "react": "React",
    "react-dom": "ReactDOM"
  }
}
```

### Best Practices

✅ **DO:**
- Use ESM for modern apps
- Enable splitting for better performance
- Use hashed filenames for caching

❌ **DON'T:**
- Mix module formats in same project
- Disable splitting (slower page loads)
- Use UMD unless targeting old browsers

---

## 4. Optimizer Node ⚡

**Purpose:** Optimizes and minifies output. Typically the **last node** in your pipeline.

### What It Does

- Minifies JavaScript & CSS
- Tree-shakes dead code
- Compresses with Gzip/Brotli
- Removes comments
- Optimizes bundle size

### Configuration

```json
{
  "minify": true,
  "sourcemap": true,
  "treeShaking": true,
  "compression": "brotli",
  "target": "es2020",
  "mangleProps": false,
  "keepNames": false,
  "pure": [],
  "drop": ["console", "debugger"]
}
```

### Options Reference

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `minify` | `boolean` | `true` | Enable minification |
| `sourcemap` | `boolean` | `true` | Generate source maps |
| `treeShaking` | `boolean` | `true` | Remove unused code |
| `compression` | `"none"` \| `"gzip"` \| `"brotli"` | `"brotli"` | Compression algorithm |
| `target` | `string` | `"es2020"` | Target JS version |
| `mangleProps` | `boolean` | `false` | Mangle property names |
| `keepNames` | `boolean` | `false` | Preserve function names |
| `pure` | `string[]` | `[]` | Pure function annotations |
| `drop` | `string[]` | `[]` | Drop specific statements |

### Use Cases

**1. Production Build (Maximum Optimization):**
```json
{
  "minify": true,
  "treeShaking": true,
  "compression": "brotli",
  "drop": ["console", "debugger"]
}
```

**2. Development (Readable Output):**
```json
{
  "minify": false,
  "sourcemap": true,
  "treeShaking": false,
  "keepNames": true
}
```

**3. Library (Preserve Names):**
```json
{
  "minify": true,
  "keepNames": true,
  "mangleProps": false,
  "treeShaking": true
}
```

### Optimization Results

**Typical size reductions:**
- Minify: **-40%** size
- Tree-shaking: **-20%** size
- Gzip: **-70%** size
- Brotli: **-75%** size

**Example:**
- Original: 1.2 MB
- After minify: 720 KB (-40%)
- After tree-shake: 576 KB (-20%)
- After brotli: 144 KB (-75%)

### Best Practices

✅ **DO:**
- Always minify for production
- Use Brotli compression (better than Gzip)
- Enable tree-shaking
- Drop console logs in production

❌ **DON'T:**
- Mangle props (breaks external APIs)
- Disable sourcemaps (can't debug)
- Over-optimize (can break code)

---

## 5. Plugin Node 🔌

**Purpose:** Adds custom functionality via plugins. Can connect **anywhere** in your pipeline.

### What It Does

- Runs custom plugins
- Intercepts build process
- Transforms specific files
- Adds build hooks
- Extends functionality

### Configuration

```json
{
  "plugins": [
    "plugin-name",
    ["plugin-with-options", { "option": "value" }]
  ],
  "order": "normal",
  "enabled": true
}
```

### Options Reference

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `plugins` | `array` | `[]` | List of plugins to load |
| `order` | `"pre"` \| `"normal"` \| `"post"` | `"normal"` | Execution order |
| `enabled` | `boolean` | `true` | Enable/disable plugins |

### Use Cases

**1. Image Optimization:**
```json
{
  "plugins": [
    ["imagemin", {
      "quality": 80,
      "format": ["webp", "avif"]
    }]
  ]
}
```

**2. Environment Variables:**
```json
{
  "plugins": [
    ["env", {
      "prefix": "VITE_",
      "files": [".env", ".env.local"]
    }]
  ]
}
```

**3. SVG to React Components:**
```json
{
  "plugins": [
    ["svgr", {
      "typescript": true,
      "memo": true
    }]
  ]
}
```

### Plugin Execution Order

```
pre plugins
    ↓
normal plugins (default)
    ↓
post plugins
```

### Best Practices

✅ **DO:**
- Use well-maintained plugins
- Configure plugins carefully
- Test plugins in isolation

❌ **DON'T:**
- Install too many plugins (slow builds)
- Use outdated plugins
- Skip plugin configuration

---

## 6. Micro Frontend Node 🏗️

**Purpose:** Sets up module federation for micro frontend architectures.

### What It Does

- Enables module federation (Webpack Module Federation)
- Shares dependencies between apps
- Exposes/consumes modules
- Handles remote loading
- Optimizes shared chunks

### Configuration

```json
{
  "name": "my-app",
  "filename": "remoteEntry.js",
  "exposes": {
    "./Button": "./src/components/Button",
    "./Header": "./src/components/Header"
  },
  "remotes": {
    "host": "host@http://localhost:3000/remoteEntry.js"
  },
  "shared": {
    "react": { "singleton": true },
    "react-dom": { "singleton": true }
  }
}
```

### Options Reference

| Option | Type | Description |
|--------|------|-------------|
| `name` | `string` | Unique app name |
| `filename` | `string` | Remote entry file name |
| `exposes` | `object` | Modules to expose |
| `remotes` | `object` | Remote apps to consume |
| `shared` | `object` | Shared dependencies |

### Use Cases

**1. Host Application:**
```json
{
  "name": "host",
  "remotes": {
    "app1": "app1@http://localhost:3001/remoteEntry.js",
    "app2": "app2@http://localhost:3002/remoteEntry.js"
  },
  "shared": {
    "react": { "singleton": true, "requiredVersion": "^18.0.0" },
    "react-dom": { "singleton": true }
  }
}
```

**2. Remote Application:**
```json
{
  "name": "app1",
  "filename": "remoteEntry.js",
  "exposes": {
    "./App": "./src/App",
    "./utils": "./src/utils"
  },
  "shared": {
    "react": { "singleton": true },
    "react-dom": { "singleton": true }
  }
}
```

### Best Practices

✅ **DO:**
- Share React/React-DOM as singletons
- Version your shared dependencies
- Use semantic versioning

❌ **DON'T:**
- Share too many dependencies (larger bundles)
- Forget singleton for React
- Expose internal implementation details

---

## 7. AI Assistant Node 🤖

**Purpose:** AI-powered optimization and error fixing.

### What It Does

- Analyzes your build
- Suggests optimizations
- Auto-fixes common errors
- Recommends best practices
- Performance tuning

### Configuration

```json
{
  "model": "gpt-4",
  "optimization": "medium",
  "autoFix": false,
  "suggestions": true,
  "analyze": {
    "bundleSize": true,
    "performance": true,
    "bestPractices": true
  }
}
```

### Options Reference

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `model` | `string` | `"gpt-4"` | AI model (gpt-4, claude-3, gemini) |
| `optimization` | `"low"` \| `"medium"` \| `"high"` | `"medium"` | Optimization level |
| `autoFix` | `boolean` | `false` | Auto-fix errors |
| `suggestions` | `boolean` | `true` | Show suggestions |
| `analyze` | `object` | All true | What to analyze |

### What It Analyzes

1. **Bundle Size**
   - Finds large dependencies
   - Suggests tree-shaking opportunities
   - Recommends code splitting

2. **Performance**
   - Detects slow builds
   - Suggests parallelization
   - Recommends caching

3. **Best Practices**
   - Checks configuration
   - Validates node order
   - Suggests improvements

### Best Practices

✅ **DO:**
- Review suggestions before applying
- Start with medium optimization
- Test after AI changes

❌ **DON'T:**
- Auto-fix without review
- Use high optimization blindly
- Ignore all suggestions

---

## Common Pipeline Patterns

### Basic Web App
```
Resolver → Transformer → Bundler → Optimizer
```

### Advanced with Plugins
```
Resolver → Plugin (Env) → Transformer → Bundler → Plugin (Image) → Optimizer
```

### Micro Frontend
```
Resolver → Transformer → Bundler → Micro Frontend → Optimizer
```

### AI-Optimized
```
Resolver → Transformer → Bundler → Optimizer → AI Assistant
```

---

## Next Steps

- [Visual Builder Guide](./visual-builder.md) - Learn the UI
- [Configuration API](../api/configuration.md) - Full config reference
- [Tutorials](../tutorials/first-pipeline.md) - Step-by-step guides

---

**Need help?** Check our [Troubleshooting Guide](../troubleshooting/common-issues.md) or ask in [Discord](https://discord.gg/nextgen).
