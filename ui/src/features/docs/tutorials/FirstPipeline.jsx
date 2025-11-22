import TutorialLayout from './TutorialLayout'
import CodeBlock from '../components/CodeBlock'

const steps = [
    {
        title: 'Introduction',
        content: (
            <div>
                <p>
                    Welcome to your first pipeline! In this tutorial, you'll learn how to create a complete build pipeline
                    using both the Visual Builder and code configuration.
                </p>
                <p className="mt-4">
                    <strong>What you'll build:</strong> A simple web app with TypeScript, React, and optimized production output.
                </p>
                <p className="mt-4">
                    <strong>Time needed:</strong> ~15 minutes
                </p>
                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
                    <strong>Prerequisites:</strong>
                    <ul className="mt-2 space-y-1 text-sm">
                        <li>✅ Node.js 18+ installed</li>
                        <li>✅ Next-Gen Build Tool installed</li>
                        <li>✅ Text editor (VS Code recommended)</li>
                    </ul>
                </div>
            </div>
        ),
    },
    {
        title: 'Setup Project',
        content: (
            <div>
                <p>Let's start by creating a new project directory and initializing it.</p>

                <h4 className="text-lg font-semibold mt-6 mb-3">Create directory</h4>
                <CodeBlock
                    language="bash"
                    code={`mkdir my-first-pipeline
cd my-first-pipeline
npm init -y`}
                />

                <h4 className="text-lg font-semibold mt-6 mb-3">Install dependencies</h4>
                <CodeBlock
                    language="bash"
                    code={`npm install -D @nextgen/build-tool
npm install react react-dom
npm install -D @types/react @types/react-dom typescript`}
                />

                <p className="mt-4">
                    This installs the build tool, React, and TypeScript support.
                </p>
            </div>
        ),
    },
    {
        title: 'Create Source Files',
        content: (
            <div>
                <p>Create your application source files.</p>

                <h4 className="text-lg font-semibold mt-6 mb-3">src/index.tsx</h4>
                <CodeBlock
                    language="typescript"
                    filename="src/index.tsx"
                    code={`import { createRoot } from 'react-dom/client'
import { App } from './App'

const root = createRoot(document.getElementById('root')!)
root.render(<App />)`}
                />

                <h4 className="text-lg font-semibold mt-6 mb-3">src/App.tsx</h4>
                <CodeBlock
                    language="typescript"
                    filename="src/App.tsx"
                    code={`import { useState } from 'react'

export function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <h1>My First Pipeline</h1>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  )
}`}
                />

                <h4 className="text-lg font-semibold mt-6 mb-3">index.html</h4>
                <CodeBlock
                    language="html"
                    filename="index.html"
                    code={`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>My First Pipeline</title>
</head>
<body>
  <div id="root"></div>
  <script type="module" src="./dist/index.js"></script>
</body>
</html>`}
                />
            </div>
        ),
    },
    {
        title: 'Configure Pipeline (Visual)',
        content: (
            <div>
                <p>Now let's build the pipeline using the Visual Builder!</p>

                <h4 className="text-lg font-semibold mt-6 mb-3">Step 1: Start Visual Builder</h4>
                <CodeBlock
                    language="bash"
                    code="npx nextgen builder"
                />

                <h4 className="text-lg font-semibold mt-6 mb-3">Step 2: Add Nodes</h4>
                <p>In the Visual Builder (http://localhost:3030/builder), add these nodes:</p>
                <ol className="list-decimal ml-6 mt-3 space-y-2">
                    <li><strong>Resolver</strong> - Configure baseUrl: <code>./src</code>, extensions: <code>.ts,.tsx</code></li>
                    <li><strong>Transformer</strong> - Set loader: <code>esbuild</code>, target: <code>es2020</code>, jsx: <code>automatic</code></li>
                    <li><strong>Bundler</strong> - Set format: <code>esm</code>, splitting: <code>true</code></li>
                    <li><strong>Optimizer</strong> - Enable minify, sourcemap, and treeShaking</li>
                </ol>

                <h4 className="text-lg font-semibold mt-6 mb-3">Step 3: Connect Nodes</h4>
                <p>Connect them in order: Resolver → Transformer → Bundler → Optimizer</p>

                <h4 className="text-lg font-semibold mt-6 mb-3">Step 4: Export Configuration</h4>
                <p>Click <strong>Export</strong> button to save as <code>nextgen.build.json</code></p>
            </div>
        ),
    },
    {
        title: 'Configure Pipeline (Code)',
        content: (
            <div>
                <p>Alternatively, create the configuration manually:</p>

                <CodeBlock
                    language="typescript"
                    filename="nextgen.build.ts"
                    code={`import { defineConfig } from '@nextgen/build-tool'

export default defineConfig({
  pipeline: [
    {
      type: 'resolver',
      config: {
        baseUrl: './src',
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
        alias: {
          '@': './src'
        }
      }
    },
    {
      type: 'transformer',
      config: {
        loader: 'esbuild',
        target: 'es2020',
        jsx: 'automatic'
      }
    },
    {
      type: 'bundler',
      config: {
        format: 'esm',
        splitting: true
      }
    },
    {
      type: 'optimizer',
      config: {
        minify: true,
        sourcemap: true,
        treeShaking: true
      }
    }
  ],
  
  output: {
    dir: 'dist',
    clean: true
  },
  
  server: {
    port: 3000,
    open: true
  }
})`}
                />
            </div>
        ),
    },
    {
        title: 'Run Development Server',
        content: (
            <div>
                <p>Let's test your pipeline in development mode!</p>

                <h4 className="text-lg font-semibold mt-6 mb-3">Add Scripts</h4>
                <p>Update <code>package.json</code>:</p>
                <CodeBlock
                    language="json"
                    filename="package.json"
                    code={`{
  "scripts": {
    "dev": "nextgen dev",
    "build": "nextgen build",
    "preview": "nextgen preview"
  }
}`}
                />

                <h4 className="text-lg font-semibold mt-6 mb-3">Start Dev Server</h4>
                <CodeBlock
                    language="bash"
                    code="npm run dev"
                />

                <p className="mt-4">
                    Open <a href="http://localhost:3000" className="text-primary hover:underline">http://localhost:3000</a> in your browser.
                    You should see your React app with the counter!
                </p>

                <div className="mt-6 p-4 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-800">
                    <strong>✓ Success!</strong>
                    <p className="mt-2 text-sm">
                        Try clicking the button - Hot Module Replacement will update instantly without refresh!
                    </p>
                </div>
            </div>
        ),
    },
    {
        title: 'Build for Production',
        content: (
            <div>
                <p>Now let's create an optimized production build.</p>

                <h4 className="text-lg font-semibold mt-6 mb-3">Run Build</h4>
                <CodeBlock
                    language="bash"
                    code="npm run build"
                />

                <p className="mt-4">You should see output like:</p>
                <CodeBlock
                    language="text"
                    code={`✓ Build completed in 1.2s

dist/index.js        12.5 KB  │  gzip: 4.2 KB
dist/index.js.map    45.3 KB

Total size:  12.5 KB
Gzipped:      4.2 KB`}
                />

                <h4 className="text-lg font-semibold mt-6 mb-3">Preview Build</h4>
                <CodeBlock
                    language="bash"
                    code="npm run preview"
                />

                <p className="mt-4">
                    Your production build is now running! Notice how small the bundle is thanks to tree shaking and minification.
                </p>
            </div>
        ),
    },
    {
        title: 'Understanding the Pipeline',
        content: (
            <div>
                <p>Let's understand what each node does in your pipeline:</p>

                <div className="space-y-6 mt-6">
                    <div className="border-l-4 border-blue-500 pl-4">
                        <h4 className="font-semibold">1. Resolver</h4>
                        <p className="text-sm mt-1">
                            Finds your source files and resolves import statements. The <code>alias</code> lets you use <code>@/components</code> instead of <code>../../components</code>.
                        </p>
                    </div>

                    <div className="border-l-4 border-purple-500 pl-4">
                        <h4 className="font-semibold">2. Transformer</h4>
                        <p className="text-sm mt-1">
                            Converts TypeScript to JavaScript and JSX to React.createElement calls (or automatic runtime).
                            esbuild does this incredibly fast!
                        </p>
                    </div>

                    <div className="border-l-4 border-green-500 pl-4">
                        <h4 className="font-semibold">3. Bundler</h4>
                        <p className="text-sm mt-1">
                            Combines all modules into a single file (or multiple chunks with code splitting).
                            ESM format means modern, fast-loading JavaScript.
                        </p>
                    </div>

                    <div className="border-l-4 border-yellow-500 pl-4">
                        <h4 className="font-semibold">4. Optimizer</h4>
                        <p className="text-sm mt-1">
                            Minifies code, removes unused exports (tree shaking), and generates source maps for debugging.
                            This is why your bundle is so small!
                        </p>
                    </div>
                </div>
            </div>
        ),
    },
    {
        title: 'Next Steps',
        content: (
            <div>
                <p className="text-lg">
                    🎉 Congratulations! You've built your first pipeline and deployed a production-ready React app.
                </p>

                <h4 className="text-lg font-semibold mt-8 mb-4">What's Next?</h4>
                <div className="grid gap-4">
                    <div className="p-4 border rounded-lg hover:bg-accent transition-colors">
                        <h5 className="font-semibold">Add CSS</h5>
                        <p className="text-sm text-muted-foreground mt-1">
                            Install <code>@nextgen/plugin-css</code> to handle stylesheets
                        </p>
                    </div>

                    <div className="p-4 border rounded-lg hover:bg-accent transition-colors">
                        <h5 className="font-semibold">Custom Plugins Tutorial</h5>
                        <p className="text-sm text-muted-foreground mt-1">
                            Learn how to create your own build plugins
                        </p>
                    </div>

                    <div className="p-4 border rounded-lg hover:bg-accent transition-colors">
                        <h5 className="font-semibold">Micro Frontends</h5>
                        <p className="text-sm text-muted-foreground mt-1">
                            Build a micro-frontend architecture
                        </p>
                    </div>
                </div>

                <div className="mt-8 p-6 bg-primary/10 rounded-lg">
                    <h5 className="font-semibold mb-2">💡 Pro Tips</h5>
                    <ul className="space-y-2 text-sm">
                        <li>• Use the Visual Builder to experiment with different configurations</li>
                        <li>• Check the Analytics dashboard to see bundle size breakdowns</li>
                        <li>• Enable caching for faster subsequent builds</li>
                        <li>• Explore other framework integrations (Vue, Angular, Svelte)</li>
                    </ul>
                </div>
            </div>
        ),
    },
]

export default function FirstPipeline() {
    const handleComplete = () => {
        console.log('Tutorial completed!')
        // Could navigate to next tutorial or show completion modal
    }

    return (
        <TutorialLayout
            title="Build Your First Pipeline"
            description="Learn how to create a complete build pipeline from scratch using the Visual Builder and code configuration."
            steps={steps}
            onComplete={handleComplete}
        />
    )
}
