// src/core/sandbox.ts
import vm from "vm";
import fs from "fs";
import path from "path";
var PluginSandbox = class {
  constructor(permissionManager) {
    this.permissionManager = permissionManager;
    this.context = this.createContext();
  }
  createContext() {
    const sandbox = {
      console: {
        log: (...args) => console.log("[Plugin]", ...args),
        error: (...args) => console.error("[Plugin Error]", ...args),
        warn: (...args) => console.warn("[Plugin Warn]", ...args),
        info: (...args) => console.info("[Plugin Info]", ...args)
      },
      process: {
        env: new Proxy({}, {
          get: (target, prop) => {
            const key = String(prop);
            if (this.permissionManager.canAccessEnv(key)) {
              return process.env[key];
            }
            return void 0;
          }
        }),
        cwd: () => process.cwd()
      },
      require: (moduleName) => {
        if (moduleName === "fs") {
          return this.createFsProxy();
        }
        if (moduleName === "path") {
          return path;
        }
        throw new Error(`Access to module '${moduleName}' is denied.`);
      },
      module: { exports: {} },
      exports: {}
    };
    return vm.createContext(sandbox);
  }
  createFsProxy() {
    return {
      readFileSync: (filePath, ...args) => {
        if (!this.permissionManager.canRead(filePath)) {
          throw new Error(`Read access denied: ${filePath}`);
        }
        return fs.readFileSync(filePath, ...args);
      },
      writeFileSync: (filePath, ...args) => {
        if (!this.permissionManager.canWrite(filePath)) {
          throw new Error(`Write access denied: ${filePath}`);
        }
        return fs.writeFileSync(filePath, ...args);
      }
      // Add other fs methods as needed
    };
  }
  run(code, filename = "plugin.js") {
    const script = new vm.Script(code, { filename });
    script.runInContext(this.context);
    return this.context.module.exports;
  }
};

// src/core/permissions.ts
import path2 from "path";
var PermissionManager = class {
  constructor(permissions = {}, rootDir = process.cwd()) {
    this.permissions = permissions;
    this.rootDir = path2.resolve(rootDir);
  }
  canRead(filePath) {
    if (!this.permissions.read)
      return false;
    if (this.permissions.read.includes("*"))
      return true;
    const resolvedPath = path2.resolve(this.rootDir, filePath);
    return this.permissions.read.some((p) => {
      const allowedPath = path2.resolve(this.rootDir, p);
      return resolvedPath.startsWith(allowedPath);
    });
  }
  canWrite(filePath) {
    if (!this.permissions.write)
      return false;
    if (this.permissions.write.includes("*"))
      return true;
    const resolvedPath = path2.resolve(this.rootDir, filePath);
    return this.permissions.write.some((p) => {
      const allowedPath = path2.resolve(this.rootDir, p);
      return resolvedPath.startsWith(allowedPath);
    });
  }
  canAccessNetwork(host) {
    if (!this.permissions.network)
      return false;
    if (this.permissions.network.includes("*"))
      return true;
    return this.permissions.network.includes(host);
  }
  canAccessEnv(key) {
    if (!this.permissions.env)
      return false;
    if (this.permissions.env.includes("*"))
      return true;
    return this.permissions.env.includes(key);
  }
};

// src/plugins/index.ts
var PluginManager = class {
  constructor() {
    this.plugins = [];
  }
  register(p) {
    this.plugins.push(p);
  }
  async transform(code, id) {
    let result = code;
    for (const p of this.plugins) {
      if (p.transform) {
        const res = await p.transform(result, id);
        if (res)
          result = res;
      }
    }
    return result;
  }
  loadSandboxedPlugin(code, permissions = {}) {
    const pm = new PermissionManager(permissions);
    const sandbox = new PluginSandbox(pm);
    const exports = sandbox.run(code);
    const plugin = exports.default || exports.plugin || exports;
    if (!plugin.name) {
      throw new Error('Sandboxed plugin must export a "name" property.');
    }
    return plugin;
  }
};

// tests/sandbox_test.ts
import fs2 from "fs/promises";
import path3 from "path";
import assert from "assert";
async function testSandbox() {
  console.log("Running Sandbox Verification...");
  const cwd = process.cwd();
  const testDir = path3.join(cwd, "test_sandbox_verify");
  const pluginManager = new PluginManager();
  try {
    await fs2.mkdir(testDir, { recursive: true });
    const testFile = path3.join(testDir, "test.txt");
    console.log("Test 1: Plugin with write permission");
    const allowedPluginCode = `
      module.exports = {
        name: 'allowed-plugin',
        transform: (code) => {
          const fs = require('fs');
          fs.writeFileSync('${testFile}', 'Allowed Write');
          return code;
        }
      };
    `;
    const allowedPlugin = pluginManager.loadSandboxedPlugin(allowedPluginCode, {
      write: [testDir]
    });
    if (allowedPlugin.transform) {
      await allowedPlugin.transform("code", "id");
    }
    const content = await fs2.readFile(testFile, "utf-8");
    assert.strictEqual(content, "Allowed Write", "File should be written by allowed plugin");
    console.log("\u2713 Passed");
    console.log("Test 2: Plugin without write permission");
    const deniedPluginCode = `
      module.exports = {
        name: 'denied-plugin',
        transform: (code) => {
          const fs = require('fs');
          fs.writeFileSync('${testFile}', 'Denied Write');
          return code;
        }
      };
    `;
    const deniedPlugin = pluginManager.loadSandboxedPlugin(deniedPluginCode, {
      write: []
      // No write permissions
    });
    try {
      if (deniedPlugin.transform) {
        await deniedPlugin.transform("code", "id");
      }
      assert.fail("Should have thrown error");
    } catch (e) {
      assert.ok(e.message.includes("Write access denied"), "Error should be about write access");
      console.log("\u2713 Passed");
    }
    console.log("Test 3: Accessing restricted globals");
    const globalPluginCode = `
      module.exports = {
        name: 'global-plugin',
        transform: (code) => {
          if (typeof process.exit === 'function') {
            throw new Error('Can access process.exit');
          }
          return code;
        }
      };
    `;
    const globalPlugin = pluginManager.loadSandboxedPlugin(globalPluginCode);
    if (globalPlugin.transform) {
      await globalPlugin.transform("code", "id");
    }
    console.log("\u2713 Passed");
    console.log("Sandbox Verification Passed!");
  } catch (error) {
    console.error("Sandbox Verification Failed:", error);
    process.exit(1);
  } finally {
    await fs2.rm(testDir, { recursive: true, force: true });
  }
}
testSandbox();
