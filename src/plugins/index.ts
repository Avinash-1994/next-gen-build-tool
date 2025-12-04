import { PluginSandbox } from '../core/sandbox.js';
import { PermissionManager, PermissionSet } from '../core/permissions.js';

export type PluginHook = 'resolve' | 'load' | 'transform' | 'buildStart' | 'buildEnd';

export class PluginManager {
  plugins: Plugin[] = [];

  register(p: Plugin) {
    this.plugins.push(p);
  }

  async transform(code: string, id: string): Promise<string> {
    let result = code;
    for (const p of this.plugins) {
      if (p.transform) {
        const res = await p.transform(result, id);
        if (res) result = res;
      }
    }
    return result;
  }

  loadSandboxedPlugin(code: string, permissions: PermissionSet = {}): Plugin {
    const pm = new PermissionManager(permissions);
    const sandbox = new PluginSandbox(pm);
    const exports = sandbox.run(code);

    // Assuming the plugin exports a default object or named export 'plugin'
    const plugin = exports.default || exports.plugin || exports;

    if (!plugin.name) {
      throw new Error('Sandboxed plugin must export a "name" property.');
    }

    return plugin as Plugin;
  }
}

export interface Plugin {
  name: string;
  setup?: (api: any) => void;
  transform?: (code: string, id: string) => Promise<string | void> | string | void;
  permissions?: PermissionSet;
}


export const marketplace = {
  async list() {
    return [{ name: 'vite-like-react-refresh', description: 'React HMR helper' }];
  },
  async install(name: string) {
    // Mock installation
    console.log(`[Marketplace] Installing plugin: ${name}`);
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log(`[Marketplace] Successfully installed ${name}`);
    return true;
  }
};
