# Visual Pipeline Builder Guide

The Visual Pipeline Builder is NextGens powerful drag-and-drop interface for creating build pipelines. This guide covers everything you need to master it.

---

## Opening the Builder

### From Dev Server

When running `npm run dev`, the builder is available at:

```
http://localhost:3000/__nextgen
```

### From UI Button

Click the **"Pipeline Builder"** button in the app header.

### Via CLI

```bash
nextgen ui
```

---

## Interface Overview

The builder has 4 main panels:

![Builder Interface](../images/builder-overview.png)

### 1. Node Library (Left)
- **Purpose**: Contains all available node types
- **Features**:
  - Search nodes
  - Filter by category
  - Drag to canvas
  - Quick-add button

### 2. Canvas (Center)
- **Purpose**: Your build pipeline workspace
- **Features**:
  - Drag-and-drop nodes
  - Connect nodes
  - Pan with mouse/trackpad
  - Zoom with scroll wheel
  - Mini-map for navigation

### 3. Property Panel (Right)
- **Purpose**: Configure selected nodes
- **Features**:
  - Type-specific fields
  - Live configuration
  - Custom config fields
  - Position display

### 4. Build Console (Bottom)
- **Purpose**: Build output and logs
- **Features**:
  - Real-time logs
  - WebSocket live updates
  - Build triggers
  - Status indicators

---

## Creating Your First Pipeline

### Step 1: Add Nodes

**Method 1: Drag and Drop**
1. Find a node in the library
2. Click and hold
3. Drag onto canvas
4. Release to place

**Method 2: Quick Add**
1. Hover over a node
2. Click the `+` button
3. Node appears on canvas

**Method 3: Keyboard**
1. Click canvas
2. Press `A` (Add node)
3. Select node type

###  Step 2: Position Nodes

**Move a Node:**
- Click and drag the node

**Align Nodes:**
- Hold `Shift` while dragging to snap to grid
- Use arrow keys for precise positioning

**Auto-Layout:**
- Right-click canvas → "Auto Layout"
- Nodes arrange in optimal flow

### Step 3: Connect Nodes

**Create Connection:**
1. Click the **output** port (right side of node)
2. Drag to **input** port (left side of target node)
3. Release to connect

**Delete Connection:**
- Click the connection line
- Press `Delete` or `Backspace`

**Connection Rules:**
- ✅ Can connect output → input
- ✅ Can connect in any order
- ❌ Cannot connect output → output
- ❌ Cannot connect input → input

### Step 4: Configure Nodes

**Select a Node:**
- Click the node

**Configure:**
1. Property panel opens on right
2. Edit configuration fields
3. Changes apply immediately

**Quick Config:**
- Double-click node → Opens inline editor

---

## Node Library Features

### Search

**Quick Search:**
1. Click search box (or press `/`)
2. Type node name
3. Results filter in real-time

**Search Examples:**
- "trans" → finds Transformer
- "bundle" → finds Bundler
- "opt" → finds Optimizer

### Categories

**Filter by Category:**
- Click category button
- Shows only matching nodes

**Available Categories:**
- Input
- Transform
- Build
- Extension
- Architecture
- Advanced

### Node Details

**Hover for Info:**
- Hover over any node
- See description and category
- Shows typical use case

---

## Canvas Features

### Navigation

**Pan Canvas:**
- Click and drag background
- OR: Hold `Space` + drag

**Zoom:**
- Scroll wheel up/down
- OR: `Ctrl` + `+`/`-`
- OR: Pinch on trackpad

**Reset View:**
- Press `0` (zero)
- OR: Click "Fit to Screen" button

### Mini-Map

**Location:**
- Bottom-right corner of canvas

**Features:**
- Shows entire pipeline
- Click to jump to area
- Drag viewport to pan
- Toggle with `M` key

### Selection

**Select Node:**
- Click node

**Select Multiple:**
- Hold `Shift` + click nodes
- OR: Click and drag to box-select

**Deselect:**
- Click canvas background
- OR: Press `Esc`

### Clipboard

**Copy:**
- Select node(s)
- Press `Ctrl+C`

**Paste:**
- Press `Ctrl+V`
- Nodes paste at cursor

**Duplicate:**
- Select node(s)
- Press `Ctrl+D`

### Deletion

**Delete Node:**
- Select node
- Press `Delete` or `Backspace`

**Delete Multiple:**
- Select multiple nodes
- Press `Delete`

**Undo Delete:**
- Press `Ctrl+Z`

---

## Property Panel Features

### Node Label

**Change Label:**
1. Select node
2. Edit "Node Label" field
3. Press Enter

**Best Practice:**
- Use descriptive names
- Example: "React Transformer" instead of "Transformer"

### Configuration Fields

**Field Types:**

**Text Input:**
```
Base URL: ./src
```

**Dropdown/Select:**
```
Loader: [esbuild | babel | swc]
```

**Checkbox:**
```
☑ Enable Minify
```

**Textarea:**
```
Alias (JSON):
{
  "@": "./src"
}
```

### Custom Configuration

**Add Custom Field:**
1. Click "+ Add Custom Config"
2. Enter field name
3. Enter value
4. Field appears in config

**Delete Custom Field:**
- Click `X` next to field

### Live Updates

**Auto-Apply:**
- Changes apply immediately
- No need to save manually
- Watch console for effects

---

## Build Console Features

### Starting a Build

**Method 1: UI Button**
- Click "Start Build" button

**Method 2: Keyboard**
- Press `Ctrl+B`

**Method 3: CLI**
```bash
npm run build
```

### Build Output

**Real-Time Logs:**
```
[12:34:56] Building...
[12:34:56] ✓ Resolved 127 modules
[12:34:57] ✓ Transformed 127 files
[12:34:58] ✓ Bundled to dist/main.js
[12:34:58] ✓ Build completed in 1.2s
```

**Color Coding:**
- 🟢 **Green** - Success
- 🟡 **Yellow** - Warnings
- 🔴 **Red** - Errors
- ⚪ **Gray** - Info

### Build Actions

**Stop Build:**
- Click "Stop" button (appears during build)
- OR: Press `Ctrl+C` in CLI

**Clear Logs:**
- Click trash icon
- Logs clear

**Auto-Scroll:**
- Enabled by default
- Follows latest log

---

## Toolbar Features

### Top Toolbar

**Left Side:**
- **Pipeline Name** - Shows current pipeline
- **Node Count** - Number of nodes in pipeline

**Right Side:**
- Undo/Redo buttons
- Analytics button
- Config editor button
- Save/Load buttons
- Export/Import
- Clear pipeline
- Theme toggle

### Undo/Redo

**Undo:**
- Click undo button
- OR: Press `Ctrl+Z`
- Reverts last 50 actions

**Redo:**
- Click redo button
- OR: Press `Ctrl+Y`
- Re-applies undone action

**What's Tracked:**
- Add/remove nodes
- Connect/disconnect
- Configuration changes  
- Position changes

### Save & Load

**Save Pipeline:**
1. Click "Save As..."
2. Enter name
3. Add description (optional)
4. Click Save

**AutoSave:**
- Runs every 5 seconds automatically
- See status in top-right:
  - 🟢 Saved
  - 🟡 Saving...
  - 🔴 Error

**Load Pipeline:**
1. Click "Open"
2. Browse saved pipelines
3. Search by name
4. Click to load

**Delete Pipeline:**
1. Click "Open"
2. Find pipeline
3. Click trash icon
4. Confirm deletion

### Export/Import

**Export:**
```bash
# Click Export button
# Downloads pipeline.json

{
  "name": "My Pipeline",
  "nodes": [...],
  "edges": [...]
}
```

**Import:**
1. Click "Import"
2. Select JSON file
3. Pipeline loads

**Formats:**
- JSON (recommended)
- JavaScript module
- TypeScript module

---

## Advanced Features

### Configuration Editor

**Open Editor:**
- Click "Show Config" button
- OR: Press `Ctrl+E`

**Features:**
- Monaco editor (VS Code engine)
- Syntax highlighting
- Auto-completion
- Error detection
- Live preview

**Editing:**
1. Edit JSON/TypeScript
2. Changes apply on save
3. Updates pipeline automatically

### Analytics Dashboard

**Open Analytics:**
- Click "Show Analytics" button
- OR: Press `Ctrl+A`

**Metrics:**
- Bundle size breakdown
- Dependency graph
- Build time history
- Performance insights
- Optimization suggestions

**Charts:**
- Pie chart: Bundle composition
- Line chart: Build time trends
- Tree map: Module sizes
- Network graph: Dependencies

### State Inspector

**Open Inspector:**
- Press `Ctrl+Shift+D`

**Features:**
- View complete state
- Time-travel debugging
- Export/import state
- History visualization

**Use Cases:**
- Debug state issues
- Replay actions
- Share pipeline state
- Test scenarios

---

## Keyboard Shortcuts

### Essential

| Shortcut | Action |
|----------|--------|
| `Ctrl+Z` | Undo |
| `Ctrl+Y` | Redo |
| `Ctrl+S` | Save pipeline |
| `Ctrl+C` | Copy node |
| `Ctrl+V` | Paste node |
| `Ctrl+D` | Duplicate node |
| `Delete` | Delete selected |
| `Esc` | Deselect |

### Navigation

| Shortcut | Action |
|----------|--------|
| `Space` + Drag | Pan canvas |
| `Ctrl` + `+` | Zoom in |
| `Ctrl` + `-` | Zoom out |
| `Ctrl` + `0` | Reset zoom |
| `M` | Toggle mini-map |
| `0` | Fit to screen |

### Build

| Shortcut | Action |
|----------|--------|
| `Ctrl+B` | Start build |
| `Ctrl+E` | Open config editor |
| `Ctrl+A` | Open analytics |
| `Ctrl+Shift+D` | Open state inspector |

### Search

| Shortcut | Action |
|----------|--------|
| `/` | Focus node search |
| `Ctrl+K` | Search docs |

---

## Tips & Best Practices

### Organization

✅ **DO:**
- Name nodes descriptively
- Group related nodes
- Use consistent spacing
- Keep pipelines simple

❌ **DON'T:**
- Create circular connections
- Overcomplicate pipelines
- Skip node configuration
- Forget to save

### Performance

**Fast Builds:**
1. Enable caching
2. Use parallel processing
3. Limit transformations
4. Optimize dependencies

**Slow Builds?**
- Check Analytics for bottlenecks
- Reduce node count
- Enable watch mode
- Use AI optimization

### Debugging

**Pipeline Not Working?**
1. Check node connections
2. Verify configurations
3. Review build console
4. Use State Inspector

**Common Issues:**
- Missing connections
- Wrong node order
- Invalid configuration
- Circular dependencies

---

## Common Patterns

### Basic Web App
```
Resolver → Transformer → Bundler → Optimizer
```

### React + TypeScript
```
Resolver (TS files)
    ↓
Transformer (esbuild)
    ↓
Bundler (ESM)
    ↓
Optimizer (minify)
```

### Micro Frontend
```
Resolver
    ↓
Transformer
    ↓
Bundler
    ↓
Micro Frontend (Module Federation)
    ↓
Optimizer
```

### Plugin-Heavy
```
Resolver
    ↓
Plugin (Env vars)
    ↓
Transformer
    ↓
Plugin (Image optimization)
    ↓
Bundler
    ↓
Optimizer
```

---

## Troubleshooting

### Visual Builder Won't Load

**Check:**
1. Dev server running?
2. Correct URL (`/__nextgen`)?
3. Browser console for errors?
4. Try hard refresh (`Ctrl+Shift+R`)

### Nodes Won't Connect

**Reasons:**
- Connecting wrong ports
- Invalid connection
- Node already connected

**Fix:**
- Check port direction (output→input)
- Delete existing connection first

### Configuration Not Saving

**Check:**
1. Auto-save enabled?
2. Valid JSON format?
3. Browser storage not full?

**Fix:**
- Manually save (`Ctrl+S`)
- Check console for errors
- Clear browser storage

### Build Fails

**Steps:**
1. Check build console
2. Verify all nodes configured
3. Check connections
4. Review error messages

---

## Next Steps

- [Node Types Reference](./node-types.md) - Learn all nodes
- [Keyboard Shortcuts](./keyboard-shortcuts.md) - All shortcuts
- [Tutorials](../tutorials/first-pipeline.md) - Step-by-step guides
- [Troubleshooting](../troubleshooting/common-issues.md) - Common issues

---

**Need help?** Join our [Discord community](https://discord.gg/nextgen) or check the [FAQ](../faq.md).
