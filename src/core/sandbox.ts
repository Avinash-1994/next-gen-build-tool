import vm from 'vm';
import fs from 'fs';
import path from 'path';
import { PermissionManager } from './permissions.js';

export class PluginSandbox {
    private context: vm.Context;
    private permissionManager: PermissionManager;

    constructor(permissionManager: PermissionManager) {
        this.permissionManager = permissionManager;
        this.context = this.createContext();
    }

    private createContext(): vm.Context {
        const sandbox = {
            console: {
                log: (...args: any[]) => console.log('[Plugin]', ...args),
                error: (...args: any[]) => console.error('[Plugin Error]', ...args),
                warn: (...args: any[]) => console.warn('[Plugin Warn]', ...args),
                info: (...args: any[]) => console.info('[Plugin Info]', ...args),
            },
            process: {
                env: new Proxy({}, {
                    get: (target, prop) => {
                        const key = String(prop);
                        if (this.permissionManager.canAccessEnv(key)) {
                            return process.env[key];
                        }
                        return undefined;
                    }
                }),
                cwd: () => process.cwd(),
            },
            require: (moduleName: string) => {
                if (moduleName === 'fs') {
                    return this.createFsProxy();
                }
                if (moduleName === 'path') {
                    return path;
                }
                // Block other modules for now
                throw new Error(`Access to module '${moduleName}' is denied.`);
            },
            module: { exports: {} },
            exports: {},
        };

        return vm.createContext(sandbox);
    }

    private createFsProxy() {
        return {
            readFileSync: (filePath: string, ...args: any[]) => {
                if (!this.permissionManager.canRead(filePath)) {
                    throw new Error(`Read access denied: ${filePath}`);
                }
                // @ts-ignore
                return fs.readFileSync(filePath, ...args);
            },
            writeFileSync: (filePath: string, ...args: any[]) => {
                if (!this.permissionManager.canWrite(filePath)) {
                    throw new Error(`Write access denied: ${filePath}`);
                }
                // @ts-ignore
                return fs.writeFileSync(filePath, ...args);
            },
            // Add other fs methods as needed
        };
    }

    run(code: string, filename: string = 'plugin.js'): any {
        const script = new vm.Script(code, { filename });
        script.runInContext(this.context);
        return this.context.module.exports;
    }
}
