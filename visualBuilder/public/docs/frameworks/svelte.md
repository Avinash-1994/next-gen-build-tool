# Svelte Integration Guide

Build blazing-fast Svelte applications with Next-Gen Build Tool.

## Why Svelte + Next-Gen?

- **Ultra-fast builds**: Rust-powered compilation
- **Tiny bundles**: Svelte compiles away, Next-Gen optimizes
- **Great DX**: Hot module replacement + visual builder

## Installation

```bash
npm install -D @nextgen/build-tool
npm install svelte
```

## Basic Configuration

Create `nextgen.build.ts`:

```typescript
import { defineConfig } from '@nextgen/build-tool'

export default defineConfig({
  pipeline: [
    {
      type: 'resolver',
      config: {
        baseUrl: './src',
        extensions: ['.svelte', '.js', '.ts'],
        alias: {
          $lib: './src/lib',
        },
      },
    },
    {
      type: 'transformer',
      config: {
        loader: 'esbuild',
        target: 'es2020',
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
      },
    },
    {
      type: 'plugin',
      config: {
        plugins: ['@nextgen/plugin-svelte'],
      },
    },
  ],

  output: {
    dir: 'public/build',
  },

  server: {
    port: 5000,
  },
})
```

## Svelte Plugin

```bash
npm install -D @nextgen/plugin-svelte
```

The plugin handles:
- `.svelte` component compilation
- Svelte preprocessors
- Automatic reactivity
- Scoped styles

## Project Structure

```
my-svelte-app/
├── src/
│   ├── lib/
│   │   └── Counter.svelte
│   ├── App.svelte
│   └── main.js
├── public/
│   ├── build/      # Generated
│   └── index.html
├── package.json
└── nextgen.build.ts
```

## Example Files

### main.js

```javascript
import App from './App.svelte'

const app = new App({
  target: document.getElementById('app'),
  props: {
    name: 'world'
  }
})

export default app
```

### App.svelte

```svelte
<script>
  import Counter from './lib/Counter.svelte'
  
  export let name
  let count = 0
  
  function handleClick() {
    count += 1
  }
</script>

<main>
  <h1>Hello {name}!</h1>
  <button on:click={handleClick}>
    Clicked {count} {count === 1 ? 'time' : 'times'}
  </button>
  
  <Counter />
</main>

<style>
  main {
    text-align: center;
    padding: 1em;
    max-width: 240px;
    margin: 0 auto;
  }

  h1 {
    color: #ff3e00;
    text-transform: uppercase;
    font-size: 4em;
    font-weight: 100;
  }

  button {
    font-size: 1.4em;
    padding: 0.5em 1em;
  }
</style>
```

### Counter.svelte

```svelte
<script>
  let count = 0
  
  $: doubled = count * 2
</script>

<div>
  <p>Count: {count}</p>
  <p>Doubled: {doubled}</p>
  <button on:click={() => count += 1}>+</button>
  <button on:click={() => count -= 1}>-</button>
</div>

<style>
  div {
    border: 1px solid #ccc;
    padding: 1rem;
    border-radius: 4px;
  }
</style>
```

## TypeScript Support

Install TypeScript:

```bash
npm install -D typescript svelte-check
```

Config:

```json
{
  "extends": "@tsconfig/svelte/tsconfig.json",
  "compilerOptions": {
    "target": "ES2020",
    "module": "ES2020",
    "paths": {
      "$lib/*": ["src/lib/*"]
    }
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
```

Use TypeScript in components:

```svelte
<script lang="ts">
  interface Props {
    name: string
    count?: number
  }
  
  let { name, count = 0 }: Props = $props()
</script>
```

## Stores

Create `src/stores.js`:

```javascript
import { writable, derived } from 'svelte/store'

export const count = writable(0)

export const doubled = derived(
  count,
  $count => $count * 2
)
```

Use in components:

```svelte
<script>
  import { count, doubled } from './stores'
</script>

<p>Count: {$count}</p>
<p>Doubled: {$doubled}</p>
<button on:click={() => $count += 1}>Increment</button>
```

## Routing

### Option 1: svelte-routing

```bash
npm install svelte-routing
```

```svelte
<script>
  import { Router, Link, Route } from 'svelte-routing'
  import Home from './routes/Home.svelte'
  import About from './routes/About.svelte'
</script>

<Router>
  <nav>
    <Link to="/">Home</Link>
    <Link to="/about">About</Link>
  </nav>
  
  <Route path="/" component={Home} />
  <Route path="/about" component={About} />
</Router>
```

### Option 2: SvelteKit

For full-stack apps, use SvelteKit (coming soon).

## Preprocessors

### SCSS

```bash
npm install -D svelte-preprocess sass
```

Update plugin config:

```javascript
{
  type: 'plugin',
  config: {
    plugins: [
      ['@nextgen/plugin-svelte', {
        preprocess: {
          scss: true
        }
      }]
    ],
  },
}
```

Use in components:

```svelte
<style lang="scss">
$primary: #ff3e00;

main {
  color: $primary;
  
  h1 {
    font-size: 2em;
  }
}
</style>
```

## Transitions & Animations

Svelte's built-in transitions work automatically:

```svelte
<script>
  import { fade, fly } from 'svelte/transition'
  let visible = true
</script>

{#if visible}
  <div transition:fade>Fades in and out</div>
{/if}

<button on:click={() => visible = !visible}>
  Toggle
</button>
```

## Performance Tips

### 1. Code Splitting

```svelte
<script>
  let Heavy
  
  async function loadHeavy() {
    const module = await import('./Heavy.svelte')
    Heavy = module.default
  }
</script>

<button on:click={loadHeavy}>Load Heavy Component</button>

{#if Heavy}
  <svelte:component this={Heavy} />
{/if}
```

### 2. Reactive Declarations

Use `$:` for computed values:

```svelte
<script>
  let width = 100
  let height = 100
  
  // Reactive - recalculated when width/height change
  $: area = width * height
</script>
```

### 3. Keyed Each Blocks

```svelte
{#each items as item (item.id)}
  <div>{item.name}</div>
{/each}
```

## Build for Production

```bash
npm run build
```

Output is highly optimized:
- Dead code elimination
- Scope hoisting
- Minification
- Component-level code splitting

Typical bundle sizes:
- **Todo App**: ~3KB gzipped
- **Blog**: ~8KB gzipped
- **Dashboard**: ~15KB gzipped

## Migration from Vite

1. Install Next-Gen Build Tool
2. Create `nextgen.build.ts`
3. Update scripts:

```json
{
  "scripts": {
    "dev": "nextgen dev",
    "build": "nextgen build",
    "preview": "nextgen preview"
  }
}
```

4. Remove `vite.config.js`

## Common Issues

### Components not compiling

Install Svelte plugin:

```bash
npm install -D @nextgen/plugin-svelte
```

### Stores not reactive

Make sure you're using the `$` prefix:

```svelte
<!-- Good -->
<p>{$count}</p>

<!-- Bad - not reactive -->
<p>{count}</p>
```

### CSS not scoped

Svelte automatically scopes styles. Remove manual scoping:

```svelte
<!-- Good -->
<style>
  p { color: red; }
</style>

<!-- Not needed -->
<style scoped>
  p { color: red; }
</style>
```

## Next Steps

- [Learn Svelte](https://svelte.dev/tutorial)
- [Explore examples](https://github.com/your-org/examples/svelte)
- [Build a full app](/docs/tutorials/first-pipeline)

---

**Made with Svelte?** Share your project in our [Discord](https://discord.gg/nextgen)!
