# CLI Reference

Complete command-line reference for NextGen Build Tool.

## Installation

```bash
npm install -g @nextgen/build-tool
```

---

## Global Commands

### `nextgen --help`

Display help information for all commands.

```bash
nextgen --help
nextgen -h
```

### `nextgen --version`

Show the installed version of NextGen.

```bash
nextgen --version
nextgen -v
```

**Output:**
```
NextGen Build Tool v1.0.0
Node.js: v20.10.0
Platform: darwin-arm64
```

---

## Project Commands

### `nextgen init`

Initialize a new NextGen project in the current directory.

**Syntax:**
```bash
nextgen init [options]
```

**Options:**

| Option | Alias | Description | Default |
|--------|-------|-------------|---------|
| `--template <name>` | `-t` | Use a project template | `react` |
| `--typescript` | `-ts` | Enable TypeScript | `false` |
| `--git` | | Initialize git repository | `true` |
| `--install` | |Install dependencies | `true` |
| `--package-manager <pm>` | `-pm` | npm, pnpm, or yarn | Auto-detect |
| `--force` | `-f` | Overwrite existing files | `false` |

**Examples:**

```bash
# Interactive wizard
nextgen init

# React with TypeScript
nextgen init --template react --typescript

# Vue without git
nextgen init --template vue --no-git

# Skip installation
nextgen init --no-install

# Force overwrite
nextgen init --force

# Use pnpm
nextgen init --package-manager pnpm
```

**Available Templates:**
- `react` - React with JavaScript
- `react-ts` - React with TypeScript
- `vue` - Vue 3 with JavaScript
- `vue-ts` - Vue 3 with TypeScript
- `svelte` - Svelte with JavaScript
- `svelte-ts` - Svelte with TypeScript
- `angular` - Angular with TypeScript
- `vanilla` - Vanilla JavaScript
- `vanilla-ts` - Vanilla TypeScript

---

### `nextgen dev`

Start the development server with hot module replacement.

**Syntax:**
```bash
nextgen dev [options]
```

**Options:**

| Option | Alias | Description | Default |
|--------|-------|-------------|---------|
| `--port <number>` | `-p` | Port number | `3000` |
| `--host <string>` | `-h` | Host address | `localhost` |
| `--open [path]` | `-o` | Open browser automatically | `false` |
| `--https` | | Use HTTPS | `false` |
| `--cors` | | Enable CORS | `false` |
| `--config <path>` | `-c` | Custom config file | `nextgen.config.js` |
| `--mode <mode>` | `-m` | Environment mode | `development` |
| `--force` | | Force rebuild (skip cache) | `false` |
| `--debug` | `-d` | Enable debug logging | `false` |

**Examples:**

```bash
# Default dev server
nextgen dev

# Custom port
nextgen dev --port 8080

# Open browser automatically
nextgen dev --open

# Open specific path
nextgen dev --open /dashboard

# HTTPS with custom config
nextgen dev --https --config ./dev.config.js

# Expose to network
nextgen dev --host 0.0.0.0

# Enable CORS
nextgen dev --cors

# Debug mode
nextgen dev --debug
```

**Environment Variables:**

```bash
# Port
PORT=8080 nextgen dev

# Host
HOST=0.0.0.0 nextgen dev

# Multiple vars
PORT=8080 HOST=0.0.0.0 nextgen dev
```

**Output:**
```
NextGen Build Tool v1.0.0

  ➜  Local:   http://localhost:3000
  ➜  Network: http://192.168.1.5:3000
  ➜  UI:      http://localhost:3000/__nextgen

  ready in 156ms
  
🔥 Hot Module Replacement enabled
📦 Building...
✓ Build completed in 234ms
```

---

### `nextgen build`

Build the project for production.

**Syntax:**
```bash
nextgen build [options]
```

**Options:**

| Option | Alias | Description | Default |
|--------|-------|-------------|---------|
| `--outDir <path>` | `-o` | Output directory | `dist` |
| `--watch` | `-w` | Watch mode (rebuild on changes) | `false` |
| `--minify [boolean]` | | Minify output | `true` |
| `--sourcemap [boolean]` | | Generate sourcemaps | `true` |
| `--clean` | | Clean output directory first | `true` |
| `--analyze` | | Generate bundle analysis | `false` |
| `--mode <mode>` | `-m` | Environment mode | `production` |
| `--config <path>` | `-c` | Custom config file | `nextgen.config.js` |
| `--ssr` | | Build for server-side rendering | `false` |
| `--target <target>` | | Build target (es2015, es2020, esnext) | `es2020` |

**Examples:**

```bash
# Production build
nextgen build

# Watch mode
nextgen build --watch

# Custom output directory
nextgen build --outDir ./build

# No minification
nextgen build --minify=false

# No sourcemaps
nextgen build --sourcemap=false

# Clean + analyze
nextgen build --clean --analyze

# SSR build
nextgen build --ssr

# Specific target
nextgen build --target es2015

# Custom config
nextgen build --config prod.config.js
```

**Output:**
```
NextGen Build Tool v1.0.0

Building for production...

✓ Resolving modules... (127 modules)
✓ Transforming... (127 files)
✓ Bundling... (3 chunks)
✓ Optimizing... (minified + tree-shaken)
✓ Compressing... (gzip + brotli)

Build completed in 1.2s

dist/index.html        2.3 KB  │ gzip: 1.2 KB
dist/main.js         245.2 KB  │ gzip: 78.4 KB
dist/vendor.js       156.8 KB  │ gzip: 51.2 KB
dist/main.css         12.4 KB  │ gzip: 3.1 KB

Total: 414.4 KB │ gzip: 132.7 KB
```

---

### `nextgen preview`

Preview the production build locally.

**Syntax:**
```bash
nextgen preview [options]
```

**Options:**

| Option | Alias | Description | Default |
|--------|-------|-------------|---------|
| `--port <number>` | `-p` | Port number | `4173` |
| `--host <string>` | `-h` | Host address | `localhost` |
| `--open` | `-o` | Open browser | `false` |
| `--outDir <path>` | | Directory to serve | `dist` |
| `--https` | | Use HTTPS | `false` |

**Examples:**

```bash
# Preview build
nextgen preview

# Custom port
nextgen preview --port 5000

# Auto-open browser
nextgen preview --open

# Serve custom directory
nextgen preview --outDir ./build

# HTTPS
nextgen preview --https
```

---

### `nextgen inspect`

Inspect build configuration and pipeline.

**Syntax:**
```bash
nextgen inspect [what] [options]
```

**What to inspect:**
- `config` - Show resolved configuration
- `pipeline` - Show build pipeline
- `deps` - Show dependencies
- `stats` - Show build statistics

**Options:**

| Option | Description | Default |
|--------|-------------|---------|
| `--json` | Output as JSON | `false` |
| `--debug` | Include debug info | `false` |

**Examples:**

```bash
# Inspect configuration
nextgen inspect config

# Pipeline visualization
nextgen inspect pipeline

# Dependencies
nextgen inspect deps

# Build stats
nextgen inspect stats

# JSON output
nextgen inspect config --json

# Debug info
nextgen inspect --debug
```

**Output (config):**
```javascript
Resolved Configuration:

{
  entry: './src/index.tsx',
  output: './dist',
  server: {
    port: 3000,
    host: 'localhost',
    https: false
  },
  build: {
    minify: true,
    sourcemap: true,
    target: 'es2020'
  },
  // ... more config
}
```

---

### `nextgen optimize`

Run AI-powered optimization on your project.

**Syntax:**
```bash
nextgen optimize [options]
```

**Options:**

| Option | Alias | Description | Default |
|--------|-------|-------------|---------|
| `--level <level>` | `-l` | low, medium, high | `medium` |
| `--auto-fix` | `-f` | Auto-fix detected issues | `false` |
| `--report` | `-r` | Generate report | `true` |
| `--dry-run` | | Show changes without applying | `false` |

**Examples:**

```bash
# Medium optimization
nextgen optimize

# High-level optimization
nextgen optimize --level high

# Auto-fix issues
nextgen optimize --auto-fix

# Dry run (preview changes)
nextgen optimize --dry-run

# High + auto-fix
nextgen optimize --level high --auto-fix
```

**Output:**
```
NextGen AI Optimizer v1.0.0

Analyzing project...
✓ Scanned 127 files
✓ Detected 3 optimization opportunities

Recommendations:
  1. Bundle size reduction (estimated: -45 KB)
     - Remove unused dependencies: lodash, moment
     - Use tree-shaking friendly imports
  
  2. Build performance (estimated: -300ms)
     - Enable parallel processing
     - Add aggressive caching
  
  3. Runtime performance (estimated: +15% faster)
     - Enable code splitting
     - Lazy load heavy components

Apply optimizations? (y/n) 
```

---

### `nextgen clean`

Clean build artifacts and caches.

**Syntax:**
```bash
nextgen clean [what]
```

**What to clean:**
- `dist` - Output directory (default)
- `cache` - Build cache
- `all` - Everything

**Examples:**

```bash
# Clean dist
nextgen clean
nextgen clean dist

# Clean cache
nextgen clean cache

# Clean everything
nextgen clean all
```

---

### `nextgen lint`

Lint your code and configuration.

**Syntax:**
```bash
nextgen lint [options]
```

**Options:**

| Option | Description | Default |
|--------|-------------|---------|
| `--fix` | Auto-fix issues | `false` |
| `--config` | Lint config files only | `false` |

**Examples:**

```bash
# Lint project
nextgen lint

# Auto-fix
nextgen lint --fix

# Lint config only
nextgen lint --config
```

---

### `nextgen export`

Export your pipeline configuration.

**Syntax:**
```bash
nextgen export [format] [options]
```

**Formats:**
- `json` - JSON format (default)
- `js` - JavaScript module
- `ts` - TypeScript module
- `yaml` - YAML format

**Options:**

| Option | Description | Default |
|--------|-------------|---------|
| `--output <file>` | Output file | stdout |
| `--minify` | Minify output | `false` |

**Examples:**

```bash
# Export to JSON
nextgen export json > pipeline.json

# Export to file
nextgen export js --output nextgen.config.js

# TypeScript
nextgen export ts --output nextgen.config.ts

# Minified YAML
nextgen export yaml --minify --output pipeline.yml
```

---

## Package Scripts

Add these to your `package.json`:

```json
{
  "scripts": {
    "dev": "nextgen dev",
    "build": "nextgen build",
    "preview": "nextgen preview",
    "clean": "nextgen clean",
    "lint": "nextgen lint",
    "optimize": "nextgen optimize"
  }
}
```

Then use:
```bash
npm run dev
npm run build
npm run preview
```

---

## Environment Variables

### Server

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Dev server port | `3000` |
| `HOST` | Dev server host | `localhost` |
| `HTTPS` | Enable HTTPS | `false` |

### Build

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `development` |
| `NEXTGEN_OUTDIR` | Output directory | `dist` |
| `NEXTGEN_MINIFY` | Enable minification | `true` |
| `NEXTGEN_SOURCEMAP` | Enable sourcemaps | `true` |

### Debug

| Variable | Description | Default |
|----------|-------------|---------|
| `DEBUG` | Enable debug logs | `false` |
| `NEXTGEN_LOG_LEVEL` | Log level (info, debug, trace) | `info` |

**Usage:**

```bash
# Single variable
PORT=8080 nextgen dev

# Multiple variables
PORT=8080 HOST=0.0.0.0 nextgen dev

# Debug mode
DEBUG=nextgen:* nextgen build

# Custom log level
NEXTGEN_LOG_LEVEL=debug nextgen dev
```

---

## Exit Codes

| Code | Meaning |
|------|---------|
| `0` | Success |
| `1` | Build error |
| `2` | Configuration error |
| `3` | Runtime error |
| `4` | Network error |
| `5` | Permission error |

**Usage in scripts:**

```bash
#!/bin/bash
nextgen build
if [ $? -eq 0 ]; then
  echo "Build succeeded!"
  nextgen preview
else
  echo "Build failed with code $?"
  exit 1
fi
```

---

## Debugging

### Verbose Logging

```bash
DEBUG=nextgen:* nextgen dev
```

**Output:**
```
nextgen:config Loading configuration from nextgen.config.js
nextgen:server Starting dev server on port 3000
nextgen:build Resolving modules...
nextgen:build Found 127 modules
nextgen:transform Transforming src/App.tsx
nextgen:bundle Creating bundle...
```

### Log Levels

```bash
# Info (default)
nextgen dev

# Debug
NEXTGEN_LOG_LEVEL=debug nextgen dev

# Trace (very verbose)
NEXTGEN_LOG_LEVEL=trace nextgen dev
```

### Save Logs to File

```bash
nextgen build 2>&1 | tee build.log
```

---

## Configuration File

Most CLI options can be set in `nextgen.config.js`:

```javascript
export default {
  // Server
  server: {
    port: 3000,
    host: 'localhost',
    https: false,
    open: true
  },
  
  // Build
  build: {
    outDir: 'dist',
    minify: true,
    sourcemap: true,
    target: 'es2020',
    clean: true
  },
  
  // Optimization
  optimize: {
    level: 'medium',
    autoFix: false
  }
}
```

**CLI overrides config:**
```bash
# Config says port 3000, this uses 8080
nextgen dev --port 8080
```

---

## Tips & Tricks

### Quick Dev Server on Different Port

```bash
nextgen dev -p 8080 -o
```

### Build + Preview

```bash
nextgen build && nextgen preview
```

### Clean Build

```bash
nextgen clean all && nextgen build
```

### Watch + Open

```bash
nextgen build --watch & nextgen preview --open
```

### Debug Build Issues

```bash
DEBUG=nextgen:* nextgen build --debug
```

### Export Current Pipeline

```bash
nextgen export json > my-pipeline.json
```

---

## See Also

- [Configuration API](./configuration.md) - Full config reference
- [Quick Start](../getting-started/quick-start.md) - Get started quickly
- [Troubleshooting](../troubleshooting/common-issues.md) - Common issues

---

**Need help?** Run `nextgen --help` or join our [Discord](https://discord.gg/nextgen).
