import TutorialLayout from './TutorialLayout'
import CodeBlock from '../components/CodeBlock'

const steps = [
    {
        title: 'Introduction',
        content: (
            <div>
                <p>
                    Learn how to create custom plugins for Next-Gen Build Tool to extend its functionality and
                    integrate with your unique build requirements.
                </p>
                <p className="mt-4">
                    <strong>What you'll build:</strong> A custom plugin that processes SVG files and optimizes them for web use.
                </p>
                <p className="mt-4">
                    <strong>Time needed:</strong> ~20 minutes
                </p>
                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
                    <strong>Prerequisites:</strong>
                    <ul className="mt-2 space-y-1 text-sm">
                        <li>✅ Completed "First Pipeline" tutorial</li>
                        <li>✅ Basic understanding of JavaScript/TypeScript</li>
                        <li>✅ Familiarity with Node.js ecosystem</li>
                    </ul>
                </div>
            </div>
        ),
    },
    {
        title: 'Plugin Architecture',
        content: (
            <div>
                <p>Understanding how plugins work in Next-Gen Build Tool.</p>

                <h4 className="text-lg font-semibold mt-6 mb-3">Plugin Lifecycle</h4>
                <div className="space-y-4 mt-4">
                    <div className="border-l-4 border-blue-500 pl-4">
                        <h5 className="font-semibold">1. Setup Phase</h5>
                        <p className="text-sm text-muted-foreground">Plugin is initialized with user options</p>
                    </div>
                    <div className="border-l-4 border-purple-500 pl-4">
                        <h5 className="font-semibold">2. Build Hooks</h5>
                        <p className="text-sm text-muted-foreground">Plugin registers hooks for different build stages</p>
                    </div>
                    <div className="border-l-4 border-green-500 pl-4">
                        <h5 className="font-semibold">3. Execution</h5>
                        <p className="text-sm text-muted-foreground">Hooks are called during the build process</p>
                    </div>
                </div>

                <h4 className="text-lg font-semibold mt-6 mb-3">Available Hooks</h4>
                <ul className="list-disc ml-6 space-y-2 text-sm">
                    <li><code>onResolve</code> - Intercept module resolution</li>
                    <li><code>onLoad</code> - Load and transform files</li>
                    <li><code>onTransform</code> - Transform code after loading</li>
                    <li><code>onBundleStart</code> - Before bundling begins</li>
                    <li><code>onBundleEnd</code> - After bundling completes</li>
                </ul>
            </div>
        ),
    },
    {
        title: 'Create Plugin Structure',
        content: (
            <div>
                <p>Let's create our SVG optimization plugin.</p>

                <h4 className="text-lg font-semibold mt-6 mb-3">Create Plugin File</h4>
                <CodeBlock
                    language="typescript"
                    filename="plugins/svg-optimizer.js"
                    code={`/**
 * SVG Optimizer Plugin for Next-Gen Build Tool
 * Optimizes SVG files during build
 */

export default function svgOptimizerPlugin(options = {}) {
  // Default options
  const config = {
    minify: true,
    removeComments: true,
    removeDimensions: false,
    ...options
  }

  return {
    name: 'svg-optimizer',
    
    // Setup hook - called once during initialization
    setup(build) {
      console.log('SVG Optimizer Plugin loaded')
      
      // We'll add hooks here in next steps
    }
  }
}`}
                />

                <p className="mt-4">
                    This creates the basic plugin structure with a setup function that receives build hooks.
                </p>
            </div>
        ),
    },
    {
        title: 'Implement File Loading',
        content: (
            <div>
                <p>Add the <code>onLoad</code> hook to process SVG files.</p>

                <CodeBlock
                    language="typescript"
                    filename="plugins/svg-optimizer.js"
                    code={`import { readFile } from 'fs/promises'
import { optimize } from 'svgo' // npm install svgo

export default function svgOptimizerPlugin(options = {}) {
  const config = {
    minify: true,
    removeComments: true,
    removeDimensions: false,
    ...options
  }

  return {
    name: 'svg-optimizer',
    
    setup(build) {
      // Intercept .svg files
      build.onLoad({ filter: /\\.svg$/ }, async (args) => {
        // Read the SVG file
        const svg = await readFile(args.path, 'utf8')
        
        // Optimize using SVGO
        const result = optimize(svg, {
          plugins: [
            { name: 'removeComments', active: config.removeComments },
            { name: 'removeDimensions', active: config.removeDimensions }
          ]
        })
        
        // Return optimized SVG
        return {
          contents: result.data,
          loader: 'text' // Treat as text content
        }
      })
    }
  }
}`}
                />

                <p className="mt-4">
                    Now the plugin will intercept all <code>.svg</code> files and optimize them!
                </p>
            </div>
        ),
    },
    {
        title: 'Add TypeScript Support',
        content: (
            <div>
                <p>Make the plugin type-safe with TypeScript interfaces.</p>

                <CodeBlock
                    language="typescript"
                    filename="plugins/svg-optimizer.ts"
                    code={`import { readFile } from 'fs/promises'
import { optimize, Config as SVGOConfig } from 'svgo'
import { Plugin,BuildContext } from '@nextgen/build-tool'

interface SVGOptimizerOptions {
  minify?: boolean
  removeComments?: boolean
  removeDimensions?: boolean
  svgoConfig?: SVGOConfig
}

export default function svgOptimizerPlugin(
  options: SVGOptimizerOptions = {}
): Plugin {
  const config = {
    minify: true,
    removeComments: true,
    removeDimensions: false,
    ...options
  }

  return {
    name: 'svg-optimizer',
    
    setup(build: BuildContext) {
      build.onLoad({ filter: /\\.svg$/ }, async (args) => {
        const svg = await readFile(args.path, 'utf8')
        
        const result = optimize(svg, {
          plugins: [
            { name: 'removeComments', active: config.removeComments },
            { name: 'removeDimensions', active: config.removeDimensions }
          ],
          ...config.svgoConfig
        })
        
        return {
          contents: result.data,
          loader: 'text'
        }
      })
    }
  }
}`}
                />
            </div>
        ),
    },
    {
        title: 'Use Plugin in Build',
        content: (
            <div>
                <p>Add your custom plugin to the build configuration.</p>

                <h4 className="text-lg font-semibold mt-6 mb-3">Option 1: Visual Builder</h4>
                <ol className="list-decimal ml-6 space-y-2">
                    <li>Open the Visual Builder</li>
                    <li>Add a <strong>Plugin Manager</strong> node</li>
                    <li>In the config, add your plugin path</li>
                    <li>Configure options in the property panel</li>
                </ol>

                <h4 className="text-lg font-semibold mt-6 mb-3">Option 2: Code Configuration</h4>
                <CodeBlock
                    language="typescript"
                    filename="nextgen.build.ts"
                    code={`import { defineConfig } from '@nextgen/build-tool'
import svgOptimizer from './plugins/svg-optimizer'

export default defineConfig({
  pipeline: [
    {
      type: 'resolver',
      config: {
        baseUrl: './src',
        extensions: ['.js', '.ts', '.svg']
      }
    },
    {
      type: 'plugin',
      config: {
        plugins: [
          svgOptimizer({
            minify: true,
            removeComments: true,
            removeDimensions: false
          })
        ]
      }
    },
    // ... other nodes
  ]
})`}
                />
            </div>
        ),
    },
    {
        title: 'Test the Plugin',
        content: (
            <div>
                <p>Let's test our plugin with a real SVG file.</p>

                <h4 className="text-lg font-semibold mt-6 mb-3">Create Test SVG</h4>
                <CodeBlock
                    language="xml"
                    filename="src/assets/icon.svg"
                    code={`<!-- Unoptimized SVG with comments and unnecessary attributes -->
<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
  <!-- This is a circle -->
  <circle cx="50" cy="50" r="40" fill="#ff3e00"/>
</svg>`}
                />

                <h4 className="text-lg font-semibold mt-6 mb-3">Import in Code</h4>
                <CodeBlock
                    language="typescript"
                    filename="src/App.tsx"
                    code={`import iconSvg from './assets/icon.svg'

function App() {
  return (
    <div>
      <h1>SVG Plugin Test</h1>
      <div dangerouslySetInnerHTML={{ __html: iconSvg }} />
    </div>
  )
}`}
                />

                <h4 className="text-lg font-semibold mt-6 mb-3">Run Build</h4>
                <CodeBlock
                    language="bash"
                    code="npm run build"
                />

                <p className="mt-4">
                    Check the output - comments should be removed and the SVG optimized!
                </p>
            </div>
        ),
    },
    {
        title: 'Advanced Features',
        content: (
            <div>
                <p>Add more advanced features to your plugin.</p>

                <h4 className="text-lg font-semibold mt-6 mb-3">Caching</h4>
                <CodeBlock
                    language="typescript"
                    code={`const cache = new Map()

build.onLoad({ filter: /\\.svg$/ }, async (args) => {
  // Check cache first
  if (cache.has(args.path)) {
    return cache.get(args.path)
  }
  
  const svg = await readFile(args.path, 'utf8')
  const result = optimize(svg, config)
  
  const output = {
    contents: result.data,
    loader: 'text'
  }
  
  // Store in cache
  cache.set(args.path, output)
  return output
})`}
                />

                <h4 className="text-lg font-semibold mt-6 mb-3">Error Handling</h4>
                <CodeBlock
                    language="typescript"
                    code={`build.onLoad({ filter: /\\.svg$/ }, async (args) => {
  try {
    const svg = await readFile(args.path, 'utf8')
    const result = optimize(svg, config)
    
    return {
      contents: result.data,
      loader: 'text'
    }
  } catch (error) {
    // Return error with helpful message
    return {
      errors: [{
        text: \`Failed to optimize SVG: \${error.message}\`,
        location: { file: args.path }
      }]
    }
  }
})`}
                />

                <h4 className="text-lg font-semibold mt-6 mb-3">Build Metrics</h4>
                <CodeBlock
                    language="typescript"
                    code={`let filesProcessed = 0
let bytesSaved = 0

build.onLoad({ filter: /\\.svg$/ }, async (args) => {
  const original = await readFile(args.path, 'utf8')
  const result = optimize(original, config)
  
  filesProcessed++
  bytesSaved += original.length - result.data.length
  
  return { contents: result.data, loader: 'text' }
})

build.onBundleEnd(() => {
  console.log(\`SVG Optimizer: \${filesProcessed} files, \${bytesSaved} bytes saved\`)
})`}
                />
            </div>
        ),
    },
    {
        title: 'Publish Your Plugin',
        content: (
            <div>
                <p>Share your plugin with the community!</p>

                <h4 className="text-lg font-semibold mt-6 mb-3">Package Structure</h4>
                <CodeBlock
                    language="text"
                    code={`nextgen-plugin-svg-optimizer/
├── src/
│   └── index.ts
├── dist/
│   ├── index.js
│   └── index.d.ts
├── package.json
├── README.md
└── tsconfig.json`}
                />

                <h4 className="text-lg font-semibold mt-6 mb-3">package.json</h4>
                <CodeBlock
                    language="json"
                    filename="package.json"
                    code={`{
  "name": "@nextgen/plugin-svg-optimizer",
  "version": "1.0.0",
  "description": "SVG optimization plugin for Next-Gen Build Tool",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "keywords": ["nextgen", "plugin", "svg", "optimizer"],
  "peerDependencies": {
    "@nextgen/build-tool": "^1.0.0"
  },
  "dependencies": {
    "svgo": "^3.0.0"
  }
}`}
                />

                <h4 className="text-lg font-semibold mt-6 mb-3">Publish to npm</h4>
                <CodeBlock
                    language="bash"
                    code={`npm run build
npm publish --access public`}
                />

                <p className="mt-4">
                    Now others can install your plugin:
                </p>
                <CodeBlock
                    language="bash"
                    code="npm install @nextgen/plugin-svg-optimizer"
                />
            </div>
        ),
    },
    {
        title: 'Next Steps',
        content: (
            <div>
                <p className="text-lg">
                    🎉 Congratulations! You've created a custom plugin for Next-Gen Build Tool.
                </p>

                <h4 className="text-lg font-semibold mt-8 mb-4">Plugin Ideas</h4>
                <div className="grid gap-4">
                    <div className="p-4 border rounded-lg hover:bg-accent transition-colors">
                        <h5 className="font-semibold">Image Optimization</h5>
                        <p className="text-sm text-muted-foreground mt-1">
                            Compress PNG, JPEG, WebP during build
                        </p>
                    </div>

                    <div className="p-4 border rounded-lg hover:bg-accent transition-colors">
                        <h5 className="font-semibold">i18n Integration</h5>
                        <p className="text-sm text-muted-foreground mt-1">
                            Replace translation keys with actual text
                        </p>
                    </div>

                    <div className="p-4 border rounded-lg hover:bg-accent transition-colors">
                        <h5 className="font-semibold">Bundle Analyzer</h5>
                        <p className="text-sm text-muted-foreground mt-1">
                            Generate interactive bundle size reports
                        </p>
                    </div>

                    <div className="p-4 border rounded-lg hover:bg-accent transition-colors">
                        <h5 className="font-semibold">Custom Loaders</h5>
                        <p className="text-sm text-muted-foreground mt-1">
                            Support .mdx, .yaml, .graphql files
                        </p>
                    </div>
                </div>

                <div className="mt-8 p-6 bg-primary/10 rounded-lg">
                    <h5 className="font-semibold mb-2">📚 Resources</h5>
                    <ul className="space-y-2 text-sm">
                        <li>• <a href="/docs/api/plugins" className="text-primary hover:underline">Plugin API Documentation</a></li>
                        <li>• <a href="https://github.com/your-org/plugins" className="text-primary hover:underline">Official Plugin Examples</a></li>
                        <li>• <a href="https://discord.gg/nextgen" className="text-primary hover:underline">Join Discord Community</a></li>
                        <li>• <a href="/docs/tutorials/micro-frontends" className="text-primary hover:underline">Try Micro Frontends Tutorial</a></li>
                    </ul>
                </div>
            </div>
        ),
    },
]

export default function CustomPlugins() {
    const handleComplete = () => {
        console.log('Custom Plugins tutorial completed!')
    }

    return (
        <TutorialLayout
            title="Create Custom Plugins"
            description="Learn how to extend Next-Gen Build Tool by creating custom plugins for your unique build requirements."
            steps={steps}
            onComplete={handleComplete}
        />
    )
}
