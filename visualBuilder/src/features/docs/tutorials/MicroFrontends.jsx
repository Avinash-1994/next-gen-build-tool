import TutorialLayout from './TutorialLayout'
import CodeBlock from '../components/CodeBlock'

const steps = [
    {
        title: 'Introduction',
        content: (
            <div>
                <p>
                    Learn how to build micro-frontend applications using Next-Gen Build Tool's module federation capabilities.
                </p>
                <p className="mt-4">
                    <strong>What you'll build:</strong> Two independent apps that share components and can be deployed separately.
                </p>
                <p className="mt-4">
                    <strong>Time needed:</strong> ~25 minutes
                </p>
                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
                    <strong>What is Micro Frontend?</strong>
                    <p className="mt-2 text-sm">
                        Micro frontends extend the microservices concept to frontend development. Different teams can develop,
                        test, and deploy independently, then compose them into a single application.
                    </p>
                </div>
                <div className="mt-4 p-4 bg-purple-50 dark:bg-purple-950/30 rounded-lg border border-purple-200 dark:border-purple-800">
                    <strong>Prerequisites:</strong>
                    <ul className="mt-2 space-y-1 text-sm">
                        <li>✅ Completed "First Pipeline" tutorial</li>
                        <li>✅ Understanding of React</li>
                        <li>✅ Basic module concepts</li>
                    </ul>
                </div>
            </div>
        ),
    },
    {
        title: 'Architecture Overview',
        content: (
            <div>
                <p>Understanding the micro-frontend architecture we'll build.</p>

                <h4 className="text-lg font-semibold mt-6 mb-3">Project Structure</h4>
                <CodeBlock
                    language="text"
                    code={`micro-frontends/
├── shell/          # Container app (host)
│   ├── src/
│   ├── package.json
│   └── nextgen.build.ts
├── product-app/    # Product listing
│   ├── src/
│   ├── package.json
│   └── nextgen.build.ts
└── cart-app/       # Shopping cart
    ├── src/
    ├── package.json
    └── nextgen.build.ts`}
                />

                <h4 className="text-lg font-semibold mt-6 mb-3">Communication Flow</h4>
                <div className="space-y-4 mt-4">
                    <div className="border-l-4 border-blue-500 pl-4">
                        <h5 className="font-semibold">1. Shell (Host)</h5>
                        <p className="text-sm text-muted-foreground">
                            Main application that loads and orchestrates other apps
                        </p>
                    </div>
                    <div className="border-l-4 border-green-500 pl-4">
                        <h5 className="font-semibold">2. Product App (Remote)</h5>
                        <p className="text-sm text-muted-foreground">
                            Exposes product listing components
                        </p>
                    </div>
                    <div className="border-l-4 border-purple-500 pl-4">
                        <h5 className="font-semibold">3. Cart App (Remote)</h5>
                        <p className="text-sm text-muted-foreground">
                            Exposes shopping cart components
                        </p>
                    </div>
                </div>
            </div>
        ),
    },
    {
        title: 'Setup Shell Application',
        content: (
            <div>
                <p>Create the host application that will load micro-frontends.</p>

                <h4 className="text-lg font-semibold mt-6 mb-3">Initialize Project</h4>
                <CodeBlock
                    language="bash"
                    code={`mkdir shell && cd shell
npm init -y
npm install react react-dom
npm install -D @nextgen/build-tool`}
                />

                <h4 className="text-lg font-semibold mt-6 mb-3">Shell Configuration</h4>
                <CodeBlock
                    language="typescript"
                    filename="shell/nextgen.build.ts"
                    code={`import { defineConfig } from '@nextgen/build-tool'

export default defineConfig({
  pipeline: [
    {
      type: 'resolver',
      config: {
        baseUrl: './src',
        extensions: ['.js', '.jsx', '.ts', '.tsx']
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
      type: 'microfrontend',
      config: {
        name: 'shell',
        // Consume remote modules
        remotes: {
          productApp: 'productApp@http://localhost:3001/remoteEntry.js',
          cartApp: 'cartApp@http://localhost:3002/remoteEntry.js'
        },
        // Share dependencies to avoid duplication
        shared: {
          react: { singleton: true, requiredVersion: '^18.0.0' },
          'react-dom': { singleton: true, requiredVersion: '^18.0.0' }
        }
      }
    },
    {
      type: 'bundler',
      config: {
        format: 'esm'
      }
    }
  ],
  
  output: {
    dir: 'dist'
  },
  
  server: {
    port: 3000
  }
})`}
                />
            </div>
        ),
    },
    {
        title: 'Setup Product App',
        content: (
            <div>
                <p>Create the product listing micro-frontend.</p>

                <h4 className="text-lg font-semibold mt-6 mb-3">Initialize</h4>
                <CodeBlock
                    language="bash"
                    code={`cd .. && mkdir product-app && cd product-app
npm init -y
npm install react react-dom
npm install -D @nextgen/build-tool`}
                />

                <h4 className="text-lg font-semibold mt-6 mb-3">Product App Config</h4>
                <CodeBlock
                    language="typescript"
                    filename="product-app/nextgen.build.ts"
                    code={`import { defineConfig } from '@nextgen/build-tool'

export default defineConfig({
  pipeline: [
    {
      type: 'resolver',
      config: {
        baseUrl: './src',
        extensions: ['.js', '.jsx', '.ts', '.tsx']
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
      type: 'microfrontend',
      config: {
        name: 'productApp',
        filename: 'remoteEntry.js',
        // Expose components to other apps
        exposes: {
          './ProductList': './src/ProductList',
          './ProductCard': './src/ProductCard'
        },
        // Share React to avoid loading it twice
        shared: {
          react: { singleton: true },
          'react-dom': { singleton: true }
        }
      }
    },
    {
      type: 'bundler',
      config: {
        format: 'esm'
      }
    }
  ],
  
  output: {
    dir: 'dist'
  },
  
  server: {
    port: 3001
  }
})`}
                />
            </div>
        ),
    },
    {
        title: 'Create Product Components',
        content: (
            <div>
                <p>Build the components that will be shared across apps.</p>

                <h4 className="text-lg font-semibold mt-6 mb-3">ProductList Component</h4>
                <CodeBlock
                    language="typescript"
                    filename="product-app/src/ProductList.tsx"
                    code={`import { useState } from 'react'
import ProductCard from './ProductCard'

const products = [
  { id: 1, name: 'Product A', price: 29.99 },
  { id: 2, name: 'Product B', price: 39.99 },
  { id: 3, name: 'Product C', price: 49.99 }
]

export default function ProductList({ onAddToCart }) {
  return (
    <div className="product-list">
      <h2>Our Products</h2>
      <div className="grid grid-cols-3 gap-4">
        {products.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={onAddToCart}
          />
        ))}
      </div>
    </div>
  )
}`}
                />

                <h4 className="text-lg font-semibold mt-6 mb-3">ProductCard Component</h4>
                <CodeBlock
                    language="typescript"
                    filename="product-app/src/ProductCard.tsx"
                    code={`export default function ProductCard({ product, onAddToCart }) {
  return (
    <div className="border rounded-lg p-4">
      <h3 className="font-bold">{product.name}</h3>
      <p className="text-lg">\${product.price}</p>
      <button
        onClick={() => onAddToCart(product)}
        className="mt-2 px-4 py-2 bg-blue-600 text-white rounded"
      >
        Add to Cart
      </button>
    </div>
  )
}`}
                />
            </div>
        ),
    },
    {
        title: 'Setup Cart App',
        content: (
            <div>
                <p>Create the shopping cart micro-frontend.</p>

                <h4 className="text-lg font-semibold mt-6 mb-3">Cart App Config</h4>
                <CodeBlock
                    language="typescript"
                    filename="cart-app/nextgen.build.ts"
                    code={`import { defineConfig } from '@nextgen/build-tool'

export default defineConfig({
  pipeline: [
    {
      type: 'resolver',
      config: {
        baseUrl: './src',
        extensions: ['.js', '.jsx', '.ts', '.tsx']
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
      type: 'microfrontend',
      config: {
        name: 'cartApp',
        filename: 'remoteEntry.js',
        exposes: {
          './Cart': './src/Cart'
        },
        shared: {
          react: { singleton: true },
          'react-dom': { singleton: true }
        }
      }
    },
    {
      type: 'bundler',
      config: {
        format: 'esm'
      }
    }
  ],
  
  server: {
    port: 3002
  }
})`}
                />

                <h4 className="text-lg font-semibold mt-6 mb-3">Cart Component</h4>
                <CodeBlock
                    language="typescript"
                    filename="cart-app/src/Cart.tsx"
                    code={`export default function Cart({ items, onRemove }) {
  const total = items.reduce((sum, item) => sum + item.price, 0)
  
  return (
    <div className="cart border rounded-lg p-4">
      <h2 className="text-xl font-bold mb-4">Shopping Cart</h2>
      {items.length === 0 ? (
        <p className="text-gray-500">Cart is empty</p>
      ) : (
        <>
          {items.map((item, index) => (
            <div key={index} className="flex justify-between items-center mb-2">
              <span>{item.name}</span>
              <span>\${item.price}</span>
              <button
                onClick={() => onRemove(index)}
                className="text-red-600"
              >
                Remove
              </button>
            </div>
          ))}
          <div className="border-t mt-4 pt-4">
            <strong>Total: \${total.toFixed(2)}</strong>
          </div>
        </>
      )}
    </div>
  )
}`}
                />
            </div>
        ),
    },
    {
        title: 'Connect in Shell App',
        content: (
            <div>
                <p>Import and use the remote components in the shell application.</p>

                <CodeBlock
                    language="typescript"
                    filename="shell/src/App.tsx"
                    code={`import { useState } from 'react'
// Import from remote apps using dynamic imports
import { lazy, Suspense } from 'react'

// Lazy load remote components
const ProductList = lazy(() => import('productApp/ProductList'))
const Cart = lazy(() => import('cartApp/Cart'))

export default function App() {
  const [cartItems, setCartItems] = useState([])

  const handleAddToCart = (product) => {
    setCartItems([...cartItems, product])
  }

  const handleRemoveFromCart = (index) => {
    setCartItems(cartItems.filter((_, i) => i !== index))
  }

  return (
    <div className="app">
      <header className="bg-blue-600 text-white p-4">
        <h1>Micro Frontend E-Commerce</h1>
      </header>
      
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-3 gap-8">
          <div className="col-span-2">
            <Suspense fallback={<div>Loading products...</div>}>
              <ProductList onAddToCart={handleAddToCart} />
            </Suspense>
          </div>
          
          <div>
            <Suspense fallback={<div>Loading cart...</div>}>
              <Cart
                items={cartItems}
                onRemove={handleRemoveFromCart}
              />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  )
}`}
                />

                <p className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-950/30 rounded-lg border border-yellow-200 dark:border-yellow-800">
                    <strong>Note:</strong> The imports like <code>productApp/ProductList</code> work because of the
                    module federation configuration in <code>nextgen.build.ts</code>!
                </p>
            </div>
        ),
    },
    {
        title: 'Run All Applications',
        content: (
            <div>
                <p>Start all three applications to see the micro-frontends in action.</p>

                <h4 className="text-lg font-semibold mt-6 mb-3">Terminal 1: Product App</h4>
                <CodeBlock
                    language="bash"
                    code={`cd product-app
npm run dev
# Running on http://localhost:3001`}
                />

                <h4 className="text-lg font-semibold mt-6 mb-3">Terminal 2: Cart App</h4>
                <CodeBlock
                    language="bash"
                    code={`cd cart-app
npm run dev
# Running on http://localhost:3002`}
                />

                <h4 className="text-lg font-semibold mt-6 mb-3">Terminal 3: Shell App</h4>
                <CodeBlock
                    language="bash"
                    code={`cd shell
npm run dev
# Running on http://localhost:3000`}
                />

                <div className="mt-6 p-4 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-800">
                    <strong>✓ Success!</strong>
                    <p className="mt-2 text-sm">
                        Open <a href="http://localhost:3000" className="text-primary hover:underline">http://localhost:3000</a> to see
                        the complete application with all micro-frontends working together!
                    </p>
                </div>

                <p className="mt-4 text-sm text-muted-foreground">
                    Try adding products to cart - components from different apps communicate seamlessly!
                </p>
            </div>
        ),
    },
    {
        title: 'Deployment Strategy',
        content: (
            <div>
                <p>Learn how to deploy micro-frontends independently.</p>

                <h4 className="text-lg font-semibold mt-6 mb-3">Build for Production</h4>
                <CodeBlock
                    language="bash"
                    code={`# Build each app
cd product-app && npm run build
cd ../cart-app && npm run build
cd ../shell && npm run build`}
                />

                <h4 className="text-lg font-semibold mt-6 mb-3">Deployment Options</h4>

                <div className="space-y-4 mt-4">
                    <div className="border rounded-lg p-4">
                        <h5 className="font-semibold">Option 1: Same Domain</h5>
                        <CodeBlock
                            language="text"
                            code={`example.com/          → Shell App
example.com/products/ → Product App
example.com/cart/     → Cart App`}
                        />
                    </div>

                    <div className="border rounded-lg p-4">
                        <h5 className="font-semibold">Option 2: Multiple Domains</h5>
                        <CodeBlock
                            language="text"
                            code={`app.example.com        → Shell App
products.example.com   → Product App  
cart.example.com       → Cart App`}
                        />
                    </div>

                    <div className="border rounded-lg p-4">
                        <h5 className="font-semibold">Option 3: CDN</h5>
                        <CodeBlock
                            language="typescript"
                            code={`// Update remotes URLs to CDN
remotes: {
  productApp: 'productApp@https://cdn.example.com/products/remoteEntry.js',
  cartApp: 'cartApp@https://cdn.example.com/cart/remoteEntry.js'
}`}
                        />
                    </div>
                </div>

                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                    <strong>💡 Best Practices:</strong>
                    <ul className="mt-2 space-y-1 text-sm">
                        <li>• Use versioning for remote entry files</li>
                        <li>• Implement health checks for each app</li>
                        <li>• Set up proper CORS headers</li>
                        <li>• Use CDN for better performance</li>
                    </ul>
                </div>
            </div>
        ),
    },
    {
        title: 'Next Steps',
        content: (
            <div>
                <p className="text-lg">
                    🎉 Congratulations! You've built a full micro-frontend application with independent deployments.
                </p>

                <h4 className="text-lg font-semibold mt-8 mb-4">Advanced Topics</h4>
                <div className="grid gap-4">
                    <div className="p-4 border rounded-lg hover:bg-accent transition-colors">
                        <h5 className="font-semibold">Shared State</h5>
                        <p className="text-sm text-muted-foreground mt-1">
                            Use Zustand or Redux across micro-frontends
                        </p>
                    </div>

                    <div className="p-4 border rounded-lg hover:bg-accent transition-colors">
                        <h5 className="font-semibold">Authentication</h5>
                        <p className="text-sm text-muted-foreground mt-1">
                            Share authentication state between apps
                        </p>
                    </div>

                    <div className="p-4 border rounded-lg hover:bg-accent transition-colors">
                        <h5 className="font-semibold">Error Boundaries</h5>
                        <p className="text-sm text-muted-foreground mt-1">
                            Isolate failures to specific micro-frontends
                        </p>
                    </div>

                    <div className="p-4 border rounded-lg hover:bg-accent transition-colors">
                        <h5 className="font-semibold">Performance</h5>
                        <p className="text-sm text-muted-foreground mt-1">
                            Optimize loading and caching strategies
                        </p>
                    </div>
                </div>

                <div className="mt-8 p-6 bg-primary/10 rounded-lg">
                    <h5 className="font-semibold mb-2">🚀 Production Checklist</h5>
                    <ul className="space-y-2 text-sm">
                        <li>✅ All apps build successfully</li>
                        <li>✅ Shared dependencies configured correctly</li>
                        <li>✅ Remote URLs point to production</li>
                        <li>✅ Error boundaries implemented</li>
                        <li>✅ Loading states handled</li>
                        <li>✅ Cross-app communication tested</li>
                        <li>✅ Independent deployment verified</li>
                    </ul>
                </div>
            </div>
        ),
    },
]

export default function MicroFrontends() {
    const handleComplete = () => {
        console.log('Micro Frontends tutorial completed!')
    }

    return (
        <TutorialLayout
            title="Build Micro Frontends"
            description="Learn how to create independently deployable micro-frontend applications that work together seamlessly."
            steps={steps}
            onComplete={handleComplete}
        />
    )
}
