import path from 'path';

export type PermissionType = 'read' | 'write' | 'network' | 'env';

export interface PermissionSet {
    read?: string[];   // List of allowed paths
    write?: string[];  // List of allowed paths
    network?: string[]; // List of allowed hosts
    env?: string[];    // List of allowed env vars
}

export class PermissionManager {
    private permissions: PermissionSet;
    private rootDir: string;

    constructor(permissions: PermissionSet = {}, rootDir: string = process.cwd()) {
        this.permissions = permissions;
        this.rootDir = path.resolve(rootDir);
    }

    canRead(filePath: string): boolean {
        if (!this.permissions.read) return false; // Default deny
        if (this.permissions.read.includes('*')) return true;

        const resolvedPath = path.resolve(this.rootDir, filePath);
        return this.permissions.read.some(p => {
            const allowedPath = path.resolve(this.rootDir, p);
            return resolvedPath.startsWith(allowedPath);
        });
    }

    canWrite(filePath: string): boolean {
        if (!this.permissions.write) return false; // Default deny
        if (this.permissions.write.includes('*')) return true;

        const resolvedPath = path.resolve(this.rootDir, filePath);
        return this.permissions.write.some(p => {
            const allowedPath = path.resolve(this.rootDir, p);
            return resolvedPath.startsWith(allowedPath);
        });
    }

    canAccessNetwork(host: string): boolean {
        if (!this.permissions.network) return false;
        if (this.permissions.network.includes('*')) return true;
        return this.permissions.network.includes(host);
    }

    canAccessEnv(key: string): boolean {
        if (!this.permissions.env) return false;
        if (this.permissions.env.includes('*')) return true;
        return this.permissions.env.includes(key);
    }
}
