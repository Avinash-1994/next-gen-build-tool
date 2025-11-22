# Troubleshooting Guide

Common issues and solutions for NextGen Build Tool.

---

## Installation Issues

### ❌ "Command not found: nextgen"

**Problem:** Shell cannot find the `nextgen` command.

**Causes:**
- npm global directory not in PATH
- NextGen not installed globally
- Wrong terminal session

**Solutions:**

**1. Check if installed:**
```bash
npm list -g @nextgen/build-tool
```

**2. Find npm global directory:**
```bash
npm config get prefix
```

**3. Add to PATH (Linux/Mac):**
```bash
echo 'export PATH="$(npm config get prefix)/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc
```

**4. Add to PATH (Windows):**
1. System Properties → Environment Variables
2. Edit `Path`
3. Add: `C:\Users\<username>\AppData\Roaming\npm`
4. Restart terminal

**5. Reinstall globally:**
```bash
npm install -g @nextgen/build-tool
```

---

### ❌ "EACCES: permission denied"

**Problem:** Permission error during installation.

**Solutions:**

**Option 1: Use home directory (recommended):**
```bash
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
npm install -g @nextgen/build-tool
```

**Option 2: Fix permissions:**
```bash
sudo chown -R $(whoami) ~/.npm
sudo chown -R $(whoami) /usr/local/lib/node_modules
```

**Option 3: Use sudo (not recommended):**
```bash
sudo npm install -g @nextgen/build-tool
```

---

### ❌ "Node version too old"

**Problem:** Node.js version below 18.0.0.

**Check version:**
```bash
node --version
# Should be v18.0.0 or higher
```

**Solutions:**

**Using nvm:**
```bash
nvm install 20
nvm use 20
nvm alias default 20
```

**Direct download:**
Visit [nodejs.org](https://nodejs.org/) and install LTS version.

**Verify:**
```bash
node --version  # v20.x.x
npm --version   # 9.x.x or higher
```

---

## Development Server Issues

### ❌ "Port 3000 already in use"

**Problem:** Another process is using port 3000.

**Solutions:**

**1. Use different port:**
```bash
nextgen dev --port 8080
```

**2. Find and kill process:**
```bash
# Linux/Mac
lsof -ti:3000 | xargs kill -9

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

**3. Set default port in config:**
```javascript
// nextgen.config.js
export default {
  server: {
    port: 8080
  }
}
```

---

### ❌ "Cannot GET /"

**Problem:** Dev server not serving files.

**Causes:**
- Wrong directory
- No index.html
- Incorrect config

**Solutions:**

**1. Check for index.html:**
```bash
ls public/index.html
# OR
ls index.html
```

**2. Verify config:**
```javascript
// nextgen.config.js
export default {
  publicDir: 'public',  // Directory with index.html
  root: process.cwd()
}
```

**3. Create index.html:**
```html
<!DOCTYPE html>
<html>
<head>
  <title>My App</title>
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/src/main.js"></script>
</body>
</html>
```

---

### ❌ "Hot reload not working"

**Problem:** Changes don't reflect in browser.

**Solutions:**

**1. Check dev server logs:**
```
[HMR] Waiting for update signal...
[HMR] File changed: src/App.tsx
[HMR] UpdateReload completed
```

**2. Hard refresh browser:**
- Press `Ctrl+Shift+R` (or `Cmd+Shift+R` on Mac)

**3. Clear browser cache:**
- Open DevTools → Network → Disable cache

**4. Restart dev server:**
```bash
# Stop with Ctrl+C, then:
nextgen dev
```

**5. Check file watcher:**
```bash
# Increase file watchers (Linux)
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

---

## Build Issues

### ❌ "Build failed with exit code 1"

**Problem:** Build error during production build.

**Debugging Steps:**

**1. Check error message:**
```bash
nextgen build --debug
```

**2. Common errors:**

**Missing dependency:**
```
Error: Cannot find module 'some-package'
```
**Fix:**
```bash
npm install some-package
```

**Syntax error:**
```
Error: Unexpected token in src/App.tsx:25
```
**Fix:** Check the file and line number, fix syntax error.

**Type error (TypeScript):**
```
Error: Property 'x' does not exist on type 'Y'
```
**Fix:** Fix TypeScript errors or disable strict mode.

**3. Clean build:**
```bash
nextgen clean all
nextgen build
```

**4. Check node connections:**
- Open Visual Builder
- Verify all nodes are connected
- Check for circular dependencies

---

### ❌ "Out of memory"

**Problem:** Build crashes with out of memory error.

**Error:**
```
FATAL ERROR: Reached heap limit Allocation failed - JavaScript heap out of memory
```

**Solutions:**

**1. Increase Node memory:**
```bash
export NODE_OPTIONS="--max-old-space-size=4096"
nextgen build
```

**2. Update package.json scripts:**
```json
{
  "scripts": {
    "build": "NODE_OPTIONS='--max-old-space-size=4096' nextgen build"
  }
}
```

**3. Optimize build:**
- Enable tree-shaking
- Reduce bundle size
- Split code into chunks
- Remove unused dependencies

---

### ❌ "Module not found"

**Problem:** Cannot resolve module import.

**Error:**
```
Error: Module not found: Can't resolve './Component'
```

**Causes:**
- Wrong file path
- Missing file extension
- Case sensitivity
- Missing alias configuration

**Solutions:**

**1. Check file exists:**
```bash
ls src/Component.tsx
```

**2. Check import path:**
```typescript
// Wrong
import Component from './Component'

// Correct (with extension)
import Component from './Component.tsx'
```

**3. Configure Resolver node:**
```json
{
  "baseUrl": "./src",
  "extensions": [".tsx", ".ts", ".jsx", ".js"]
}
```

**4. Check alias:**
```typescript
// Using alias
import Component from '@/components/Component'

// Alias config in Resolver:
{
  "alias": {
    "@": "./src"
  }
}
```

---

## Visual Builder Issues

### ❌ "Visual Builder won't load"

**Problem:** Builder shows white screen or errors.

**Solutions:**

**1. Check dev server:**
```bash
# Should see:
➜  UI: http://localhost:3000/__nextgen
```

**2. Correct URL:**
```
http://localhost:3000/__nextgen
# NOT: http://localhost:3000/nextgen
```

**3. Check browser console:**
- Press `F12`
- Look for JavaScript errors
- Report errors to support

**4. Clear browser storage:**
```javascript
// In console:
localStorage.clear()
indexedDB.deleteDatabase('nextgen-builder')
// Then reload
```

**5. Try different browser:**
- Chrome (recommended)
- Firefox
- Edge

---

### ❌ "Cannot connect nodes"

**Problem:** Connection line won't attach.

**Causes:**
- Wrong port direction
- Invalid connection
- Node already connected

**Solutions:**

**1. Check port direction:**
- Output (right side) → Input (left side)
- NOT: Input → Output

**2. Delete existing connection:**
- Click connection line
- Press `Delete`
- Try again

**3. Check node compatibility:**
- Some nodes can only connect certain ways
- Check documentation for node order

---

### ❌ "Pipeline not saving"

**Problem:** Changes don't persist after refresh.

**Solutions:**

**1. Manual save:**
```
Click "Save As..." button
OR press Ctrl+S
```

**2. Check browser storage:**
```javascript
// In console:
navigator.storage.estimate().then(console.log)
// If quota is full, clear storage
```

**3. Check auto-save status:**
- Look for indicator in top-right
- 🟢 Saved - OK
- 🔴 Error - Check console

**4. Export as backup:**
```
Click "Export" → Save pipeline.json
```

---

## Configuration Issues

### ❌ "Invalid configuration"

**Problem:** Config file has errors.

**Error:**
```
Error: Invalid configuration in nextgen.config.js
```

**Solutions:**

**1. Validate JSON syntax:**
```javascript
// Wrong (trailing comma)
{
  "entry": "./src/index.js",
  "output": "./dist",  // ← Remove comma
}

// Correct
{
  "entry": "./src/index.js",
  "output": "./dist"
}
```

**2. Check export:**
```javascript
// ES modules (correct)
export default {
  entry: './src/index.js'
}

// CommonJS (also correct)
module.exports = {
  entry: './src/index.js'
}
```

**3. Inspect resolved config:**
```bash
nextgen inspect config
```

---

### ❌ "Config not loading"

**Problem:** Custom config file not recognized.

**Solutions:**

**1. Check filename:**
```
nextgen.config.js  ✓ Correct
nextgen.config.ts  ✓ Correct (with ts-node)
config.js          ✗ Wrong
```

**2. Check location:**
```
project/
  ├── nextgen.config.js  ✓ Project root
  ├── src/
  │   └── nextgen.config.js  ✗ Wrong location
```

**3. Specify custom config:**
```bash
nextgen dev --config ./custom.config.js
```

---

## Performance Issues

### ❌ "Slow build times"

**Problem:** Builds take too long.

**Benchmarks:**
- Small project (<100 files): < 1s
- Medium project (100-500 files): 1-5s
- Large project (500+ files): 5-15s

If slower, optimize:

**1. Enable caching:**
```javascript
export default {
  build: {
    cache: true
  }
}
```

**2. Use faster transformer:**
```json
// In Transformer node:
{
  "loader": "esbuild"  // Fastest
}
```

**3. Parallel processing:**
```javascript
export default {
  build: {
    workers: true,
    maxWorkers: 4
  }
}
```

**4. Reduce transformations:**
- Only transform what's needed
- Skip source maps in dev
- Use fewer plugins

**5. Run AI optimization:**
```bash
nextgen optimize --level high
```

---

### ❌ "Large bundle size"

**Problem:** Output files are too large.

**Solutions:**

**1. Check bundle analysis:**
```bash
nextgen build --analyze
```

**2. Enable optimization:**
```json
// In Optimizer node:
{
  "minify": true,
  "treeShaking": true,
  "compression": "brotli"
}
```

**3. Code splitting:**
```json
// In Bundler node:
{
  "splitting": true,
  "chunkSize": 500  // KB
}
```

**4. External dependencies:**
```json
// In Resolver/Bundler:
{
  "external": ["react", "react-dom"]
}
```

**5. Remove unused dependencies:**
```bash
npm uninstall unused-package
```

---

## Runtime Issues

### ❌ "React is not defined"

**Problem:** React import error.

**Solutions:**

**1. Check Transformer JSX config:**
```json
{
  "jsx": "automatic"  // React 17+
}
```

**2. For React < 17:**
```typescript
import React from 'react'
```

**3. Or configure:**
```json
{
  "jsx": "classic",
  "jsxFactory": "React.createElement"
}
```

---

### ❌ "Module format mismatch"

**Problem:** Cannot use import/require together.

**Error:**
```
require is not defined
OR
Cannot use import statement outside a module
```

**Solutions:**

**1. Check Bundler format:**
```json
{
  "format": "esm"  // For browsers
}
```

**2. For Node.js:**
```json
{
  "format": "cjs"
}
```

**3. In package.json:**
```json
{
  "type": "module"  // For ESM
}
```

---

## Getting More Help

### Debug Mode

Enable verbose logging:

```bash
DEBUG=nextgen:* nextgen dev --debug
```

### Collect Info

When reporting issues, include:

1. **Version:**
```bash
nextgen --version
node --version
npm --version
```

2. **Error logs:**
```bash
nextgen build 2>&1 | tee build.log
```

3. **Configuration:**
```bash
nextgen inspect config > config.txt
```

4. **Pipeline export:**
```
Export pipeline as JSON from Visual Builder
```

### Community Support

- 💬 [Discord](https://discord.gg/nextgen) - Live chat
- 🐛 [GitHub Issues](https://github.com/nextgen/issues) - Bug reports
- 📖 [Documentation](https://nextgen-build.dev/docs) - Full docs
- 📧 [Email](mailto:support@nextgen-build.dev) - Direct support

---

## See Also

- [FAQ](../faq.md) - Frequently asked questions
- [CLI Reference](../api/cli-reference.md) - All CLI commands
- [Configuration API](../api/configuration.md) - Full config options

---

**Still stuck?** Join our [Discord](https://discord.gg/nextgen) and our community will help!
