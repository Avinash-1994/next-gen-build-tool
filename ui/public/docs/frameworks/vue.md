# Vue Integration Guide

Learn how to use Next-Gen Build Tool with Vue 3 applications.

## Supported Setups

- **Vue CLI** (v4+)
- **Vite + Vue** (recommended)
- **Custom Webpack**
- **Nuxt** (coming soon)

## Installation

```bash
npm install -D @nextgen/build-tool
npm install vue@^3
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
        extensions: ['.vue', '.js', '.ts'],
        alias: {
          '@': './src',
          '~': './src',
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
        treeShaking: true,
      },
    },
    {
      type: 'plugin',
      config: {
        plugins: ['@nextgen/plugin-vue'],
      },
    },
  ],

  output: {
    dir: 'dist',
  },

  server: {
    port: 5173,
    open: true,
  },
})
```

## Vue Plugin

Install the Vue plugin:

```bash
npm install -D @nextgen/plugin-vue
```

This plugin handles:
- `.vue` file compilation
- SFC (Single File Component) parsing
- Template compilation
- Hot Module Replacement for Vue

## Project Structure

```
my-vue-app/
├── src/
│   ├── components/
│   │   └── HelloWorld.vue
│   ├── App.vue
│   └── main.js
├── public/
│   └── index.html
├── package.json
└── nextgen.build.ts
```

## Example Files

### main.js

```javascript
import { createApp } from 'vue'
import App from './App.vue'

createApp(App).mount('#app')
```

### App.vue

```vue
<template>
  <div id="app">
    <h1>{{ message }}</h1>
    <HelloWorld msg="Welcome to Vue + Next-Gen Build Tool" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import HelloWorld from './components/HelloWorld.vue'

const message = ref('Hello Vue 3!')
</script>

<style scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
```

### HelloWorld.vue

```vue
<template>
  <div class="hello">
    <p>{{ msg }}</p>
  </div>
</template>

<script setup>
defineProps({
  msg: String
})
</script>

<style scoped>
.hello {
  padding: 20px;
  background: #f0f0f0;
  border-radius: 8px;
}
</style>
```

## TypeScript Support

Install TypeScript:

```bash
npm install -D typescript @vue/tsconfig
```

Create `tsconfig.json`:

```json
{
  "extends": "@vue/tsconfig/tsconfig.dom.json",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src/**/*.ts", "src/**/*.vue"],
  "exclude": ["node_modules"]
}
```

Use `.vue` with TypeScript:

```vue
<script setup lang="ts">
interface Props {
  msg: string
  count?: number
}

const props = defineProps<Props>()
</script>
```

## Vue Router

Install Vue Router:

```bash
npm install vue-router@4
```

Create `src/router/index.js`:

```javascript
import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('../views/About.vue') // Lazy loading
  }
]

export default createRouter({
  history: createWebHistory(),
  routes
})
```

Update `main.js`:

```javascript
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

createApp(App)
  .use(router)
  .mount('#app')
```

## Pinia (State Management)

Install Pinia:

```bash
npm install pinia
```

Create store `src/stores/counter.js`:

```javascript
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', {
  state: () => ({
    count: 0
  }),
  actions: {
    increment() {
      this.count++
    }
  }
})
```

Add to `main.js`:

```javascript
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

const app = createApp(App)
app.use(createPinia())
app.mount('#app')
```

## CSS Preprocessors

### SCSS/SASS

```bash
npm install -D sass
```

Use in components:

```vue
<style lang="scss" scoped>
$primary-color: #42b983;

.component {
  color: $primary-color;
  
  &:hover {
    opacity: 0.8;
  }
}
</style>
```

### Less

```bash
npm install -D less
```

```vue
<style lang="less" scoped>
@primary: #42b983;

.component {
  color: @primary;
}
</style>
```

## Performance Tips

### 1. Code Splitting

Configure code splitting for routes:

```javascript
{
  type: 'bundler',
  config: {
    splitting: true,
    chunkSizeWarningLimit: 500, // KB
  },
}
```

### 2. Lazy Loading Components

```vue
<script setup>
import { defineAsyncComponent } from 'vue'

const HeavyComponent = defineAsyncComponent(() =>
  import('./components/HeavyComponent.vue')
)
</script>
```

### 3. Tree Shaking

Ensure imports are specific:

```javascript
// Good
import { ref, computed } from 'vue'

// Bad - imports entire library
import * as Vue from 'vue'
```

## Migration from Vue CLI

1. Install Next-Gen Build Tool
2. Create `nextgen.build.ts` with config above
3. Update `package.json` scripts:

```json
{
  "scripts": {
    "dev": "nextgen dev",
    "build": "nextgen build",
    "preview": "nextgen preview"
  }
}
```

4. Remove `vue.config.js`
5. Uninstall `@vue/cli-service`

## Common Issues

### Template compilation errors

Make sure Vue plugin is installed and configured:

```bash
npm install -D @nextgen/plugin-vue
```

### HMR not working

Check dev server config:

```javascript
{
  server: {
    hmr: true,
    port: 5173,
  },
}
```

### Import aliases not resolving

Update resolver config:

```javascript
{
  type: 'resolver',
  config: {
    alias: {
      '@': './src',
      '~': './src',
    },
  },
}
```

## Next Steps

- [Build your first pipeline](/docs/tutorials/first-pipeline)
- [Explore plugins](/docs/core-concepts/plugins)
- [Optimize for production](/docs/tutorials/optimization)

---

**Questions?** Join our [Discord](https://discord.gg/nextgen) or check the [FAQ](/docs/faq).
