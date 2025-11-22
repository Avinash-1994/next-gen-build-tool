# Installation

Get NextGen Build Tool installed and running in minutes.

## Prerequisites

Before installing NextGen, make sure you have:

- **Node.js** version 18.0 or higher (20.x recommended)
- **npm** 9+, **pnpm** 8+, or **yarn** 1.22+
- A modern web browser (Chrome, Firefox, Safari, or Edge)

### Check Your Version

```bash
node --version
# Should output: v18.0.0 or higher

npm --version  
# Should output: 9.0.0 or higher
```

If you need to upgrade Node.js:

**Using nvm (recommended):**
```bash
# Install/update to Node 20
nvm install 20
nvm use 20
```

**Direct download:**
Visit [nodejs.org](https://nodejs.org/) and download the LTS version.

---

## Quick Install

### Global Installation

Install NextGen globally to use the `nextgen` command anywhere:

```bash
npm install -g @nextgen/build-tool
```

**Verify installation:**
```bash
nextgen --version
# Output: NextGen Build Tool v1.0.0
```

### Project Installation

Install as a dev dependency in your project:

```bash
# Using npm
npm install --save-dev @nextgen/build-tool

# Using pnpm (faster)
pnpm add -D @nextgen/build-tool

# Using yarn
yarn add --dev @nextgen/build-tool
```

---

## Create New Project

The fastest way to get started is using the project scaffolding tool:

###  Interactive Wizard

```bash
npm create @nextgen/app
```

This will prompt you to:
1. Choose a project name
2. Select a framework (React, Vue, Svelte, etc.)
3. Choose TypeScript or JavaScript
4. Select additional features

**Example session:**
```
? Project name: › my-app
? Select a framework: › 
  ❯ React
    Vue
    Svelte
    Angular
    Vanilla
? Use TypeScript? › Yes / No
? Add ESLint? › Yes / No
? Add Prettier? › Yes / No

✓ Created project at ./my-app
✓ Installed dependencies (122 packages in 15s)
✓ Initialized git repository

Done! Now run:
  cd my-app
  npm run dev
```

### With Template

Skip the wizard and use a template directly:

```bash
# React + TypeScript
npm create @nextgen/app my-app --template react-ts

# Vue 3 + TypeScript
npm create @nextgen/app my-app --template vue-ts

# Svelte + TypeScript
npm create @nextgen/app my-app --template svelte-ts

# Vanilla JavaScript
npm create @nextgen/app my-app --template vanilla
```

**Available templates:**
- `react` - React with JavaScript
- `react-ts` - React with TypeScript
- `vue` - Vue 3 with JavaScript
- `vue-ts` - Vue 3 with TypeScript
- `svelte` - Svelte with JavaScript
- `svelte-ts` - Svelte with TypeScript
- `angular` - Angular with TypeScript
- `vanilla` - Vanilla JavaScript
- `vanilla-ts` - Vanilla TypeScript

### Advanced Options

```bash
# Skip dependency installation
npm create @nextgen/app my-app --skip-install

# Use specific package manager
npm create @nextgen/app my-app --package-manager pnpm

# No git initialization
npm create @nextgen/app my-app --no-git

# All together
npm create @nextgen/app my-app --template react-ts --skip-install --no-git
```

---

## Manual Setup

If you prefer to set up your project manually:

### 1. Create Project Directory

```bash
mkdir my-project
cd my-project
```

### 2. Initialize package.json

```bash
npm init -y
```

### 3. Install NextGen

```bash
npm install --save-dev @nextgen/build-tool
```

### 4. Create Configuration

Create `nextgen.config.js` in your project root:

```javascript
export default {
  // Entry point
  entry: './src/index.js',
  
  // Output directory
  output: './dist',
  
  // Development server
  server: {
    port: 3000,
    open: true
  },
  
  // Build options
  build: {
    minify: true,
    sourcemap: true
  }
}
```

### 5. Add Scripts

Update `package.json`:

```json
{
  "scripts": {
    "dev": "nextgen dev",
    "build": "nextgen build",
    "preview": "nextgen preview"
  }
}
```

### 6. Create Source Files

```bash
mkdir src
echo 'console.log("Hello NextGen!")' > src/index.js
```

### 7. Start Development

```bash
npm run dev
```

---

## IDE Extensions

Enhance your development experience with IDE extensions:

### Visual Studio Code

Install the **NextGen Build Tool** extension:

```bash
code --install-extension nextgen.nextgen-vscode
```

**Features:**
- ✅ Syntax highlighting for config files
- ✅ IntelliSense and autocomplete
- ✅ Integrated visual pipeline editor
- ✅ Error detection and linting
- ✅ Code snippets

**Install from VS Code:**
1. Open VS Code
2. Press `Ctrl+P` (or `Cmd+P` on Mac)
3. Type: `ext install nextgen.nextgen-vscode`
4. Press Enter

### WebStorm / IntelliJ IDEA

Install from JetBrains Marketplace:

1. Go to `Settings/Preferences` → `Plugins`
2. Search for "NextGen Build Tool"
3. Click `Install`
4. Restart IDE

### Sublime Text

Install via Package Control:

```
1. Ctrl+Shift+P (Cmd+Shift+P on Mac)
2. Type "Package Control: Install Package"
3. Search "NextGen Build Tool"
4. Press Enter
```

---

## Docker Setup

Run NextGen in a Docker container:

### Dockerfile

```dockerfile
FROM node:20-alpine

# Install NextGen globally
RUN npm install -g @nextgen/build-tool

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy project files
COPY . .

# Expose ports
EXPOSE 3000

# Start dev server
CMD ["npm", "run", "dev"]
```

### Docker Compose

```yaml
version: '3.8'

services:
  nextgen:
    build: .
    ports:
      - "3000:3000"
      - "3000:3000/__nextgen"  # Visual builder
    volumes:
      - .:/app
      - /app/node_modules
    environment:
      - NODE_ENV=development
```

**Run:**
```bash
docker-compose up
```

---

## Platform-Specific Instructions

### Windows

**Using PowerShell:**
```powershell
# Install nvm-windows first
iwr https://github.com/coreybutler/nvm-windows/releases/latest/download/nvm-setup.exe -OutFile nvm-setup.exe
.\nvm-setup.exe

# Install Node.js
nvm install 20
nvm use 20

# Install NextGen
npm install -g @nextgen/build-tool
```

**Using WSL2 (recommended):**
```bash
# Inside WSL2 Ubuntu
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 20
npm install -g @nextgen/build-tool
```

### macOS

**Using Homebrew:**
```bash
# Install Node.js
brew install node@20

# Install NextGen
npm install -g @nextgen/build-tool
```

**Using nvm:**
```bash
# Install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Install Node.js
nvm install 20
nvm use 20

# Install NextGen
npm install -g @nextgen/build-tool
```

### Linux

**Ubuntu/Debian:**
```bash
# Update packages
sudo apt update

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install NextGen
sudo npm install -g @nextgen/build-tool
```

**Fedora/RHEL:**
```bash
# Install Node.js
sudo dnf install nodejs

# Install NextGen  
sudo npm install -g @nextgen/build-tool
```

---

## Troubleshooting

### Common Issues

#### ❌ "Permission denied" error

**Linux/macOS:**
```bash
# Option 1: Use sudo (not recommended)
sudo npm install -g @nextgen/build-tool

# Option 2: Configure npm to use home directory (recommended)
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
npm install -g @nextgen/build-tool
```

**Windows:**
Run PowerShell as Administrator.

#### ❌ "Command not found: nextgen"

Your PATH might not include npm's global directory.

**Fix:**
```bash
# Find npm global directory
npm config get prefix

# Add to PATH (Linux/Mac)
echo 'export PATH="$(npm config get prefix)/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc

# Add to PATH (Windows)
# Add C:\Users\<username>\AppData\Roaming\npm to System PATH
```

#### ❌ "EACCES" errors on Linux

Fix npm permissions:
```bash
sudo chown -R $(whoami) ~/.npm
sudo chown -R $(whoami) /usr/local/lib/node_modules
```

#### ❌ "Node version too old"

Upgrade Node.js:
```bash
# Using nvm
nvm install 20
nvm use 20

# Verify
node --version  # Should be v20.x.x
```

#### ❌ Behind corporate proxy

Configure npm proxy:
```bash
npm config set proxy http://proxy.company.com:8080
npm config set https-proxy http://proxy.company.com:8080

# With authentication
npm config set proxy http://username:password@proxy.company.com:8080
```

#### ❌ Slow installation in China

Use a mirror:
```bash
npm config set registry https://registry.npmmirror.com
npm install -g @nextgen/build-tool
```

#### ❌ Port 3000 already in use

Change the port:
```bash
# Using environment variable
PORT=8080 npm run dev

# Or in nextgen.config.js
export default {
  server: {
    port: 8080
  }
}
```

---

## Verify Installation

After installation, verify everything works:

```bash
# Check NextGen version
nextgen --version

# Check Node version
node --version

# Check npm version
npm --version

# Create test project
npm create @nextgen/app test-app --template vanilla
cd test-app
npm run dev
```

You should see:
```
NextGen Build Tool v1.0.0

  ➜  Local:   http://localhost:3000
  ➜  Network: http://192.168.1.5:3000
  ➜  UI:      http://localhost:3000/__nextgen

  ready in 156ms
```

---

## Update NextGen

### Global Installation

```bash
npm update -g @nextgen/build-tool
```

### Project Installation

```bash
npm update @nextgen/build-tool
```

### Check for Updates

```bash
npm outdated @nextgen/build-tool
```

---

## Uninstall

### Global

```bash
npm uninstall -g @nextgen/build-tool
```

### Project

```bash
npm uninstall @nextgen/build-tool
```

---

## Next Steps

✅ NextGen is now installed!

Continue with:

1. **[Quick Start](./quick-start.md)** - Build your first project in 5 minutes
2. **[CLI Reference](../api/cli-reference.md)** - Learn all CLI commands
3. **[Visual Builder Guide](../guide/visual-builder.md)** - Master the visual interface
4. **[Framework Guides](../frameworks/react.md)** - Framework-specific setup

Need help? Check our [Troubleshooting Guide](../troubleshooting/common-issues.md) or join our [Discord community](https://discord.gg/nextgen).
