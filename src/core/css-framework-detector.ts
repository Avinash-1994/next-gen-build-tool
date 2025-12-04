import fs from 'fs/promises';
import path from 'path';
import { log } from '../utils/logger.js';

export type CSSFramework = 'tailwind' | 'bootstrap' | 'bulma' | 'material' | 'none';

export interface DetectedCSSFramework {
    name: CSSFramework;
    version?: string;
    source: 'package.json' | 'file-pattern' | 'class-scan';
}

/**
 * Check if a package exists in package.json dependencies
 */
async function hasPackage(root: string, packageName: string): Promise<string | null> {
    try {
        const pkgPath = path.join(root, 'package.json');
        const content = await fs.readFile(pkgPath, 'utf-8');
        const pkg = JSON.parse(content);
        const deps = { ...pkg.dependencies, ...pkg.devDependencies };
        return deps[packageName] || null;
    } catch {
        return null;
    }
}

/**
 * Check if a file or directory exists
 */
async function hasFile(root: string, filePath: string): Promise<boolean> {
    try {
        await fs.access(path.join(root, filePath));
        return true;
    } catch {
        return false;
    }
}

/**
 * Scan source files for class name patterns
 */
async function hasClassPattern(root: string, patterns: string[]): Promise<boolean> {
    try {
        const srcPath = path.join(root, 'src');
        const srcExists = await fs.access(srcPath).then(() => true).catch(() => false);

        if (!srcExists) return false;

        // Read first few files to check for class patterns
        const files = await fs.readdir(srcPath);
        const jsFiles = files.filter(f =>
            f.endsWith('.js') || f.endsWith('.jsx') ||
            f.endsWith('.ts') || f.endsWith('.tsx') ||
            f.endsWith('.vue') || f.endsWith('.svelte')
        ).slice(0, 5); // Check first 5 files

        for (const file of jsFiles) {
            const content = await fs.readFile(path.join(srcPath, file), 'utf-8');
            // Check if any pattern exists in the content
            for (const pattern of patterns) {
                if (content.includes(`"${pattern}"`) ||
                    content.includes(`'${pattern}'`) ||
                    content.includes(`className="${pattern}`) ||
                    content.includes(`class="${pattern}`)) {
                    return true;
                }
            }
        }
        return false;
    } catch {
        return false;
    }
}

/**
 * Detect Tailwind CSS
 */
async function detectTailwind(root: string): Promise<DetectedCSSFramework | null> {
    // Check package.json
    const version = await hasPackage(root, 'tailwindcss');
    if (version) {
        return { name: 'tailwind', version, source: 'package.json' };
    }

    // Check for tailwind.config.js
    if (await hasFile(root, 'tailwind.config.js') || await hasFile(root, 'tailwind.config.ts')) {
        return { name: 'tailwind', source: 'file-pattern' };
    }

    // Check for Tailwind class patterns
    if (await hasClassPattern(root, ['flex', 'grid', 'bg-', 'text-', 'p-', 'm-'])) {
        return { name: 'tailwind', source: 'class-scan' };
    }

    return null;
}

/**
 * Detect Bootstrap
 */
async function detectBootstrap(root: string): Promise<DetectedCSSFramework | null> {
    // Check package.json
    const version = await hasPackage(root, 'bootstrap');
    if (version) {
        return { name: 'bootstrap', version, source: 'package.json' };
    }

    // Check for Bootstrap in node_modules
    if (await hasFile(root, 'node_modules/bootstrap')) {
        return { name: 'bootstrap', source: 'file-pattern' };
    }

    // Check for Bootstrap class patterns
    if (await hasClassPattern(root, ['btn', 'container', 'row', 'col-', 'navbar'])) {
        return { name: 'bootstrap', source: 'class-scan' };
    }

    return null;
}

/**
 * Detect Bulma
 */
async function detectBulma(root: string): Promise<DetectedCSSFramework | null> {
    // Check package.json
    const version = await hasPackage(root, 'bulma');
    if (version) {
        return { name: 'bulma', version, source: 'package.json' };
    }

    // Check for Bulma in node_modules
    if (await hasFile(root, 'node_modules/bulma')) {
        return { name: 'bulma', source: 'file-pattern' };
    }

    // Check for Bulma class patterns
    if (await hasClassPattern(root, ['button', 'hero', 'section', 'column', 'box'])) {
        return { name: 'bulma', source: 'class-scan' };
    }

    return null;
}

/**
 * Detect Material UI / Material Design
 */
async function detectMaterial(root: string): Promise<DetectedCSSFramework | null> {
    // Check package.json for MUI
    const muiVersion = await hasPackage(root, '@mui/material');
    if (muiVersion) {
        return { name: 'material', version: muiVersion, source: 'package.json' };
    }

    // Check for Material Design Lite
    const mdlVersion = await hasPackage(root, 'material-design-lite');
    if (mdlVersion) {
        return { name: 'material', version: mdlVersion, source: 'package.json' };
    }

    // Check for Material Components Web
    const mcwVersion = await hasPackage(root, '@material/web');
    if (mcwVersion) {
        return { name: 'material', version: mcwVersion, source: 'package.json' };
    }

    return null;
}

/**
 * Main CSS framework detection function
 */
export async function detectCSSFramework(root: string): Promise<DetectedCSSFramework> {
    log.info('Detecting CSS framework...');

    // Try each detector in priority order
    const tailwind = await detectTailwind(root);
    if (tailwind) {
        log.success(`Detected Tailwind CSS ${tailwind.version || ''} (${tailwind.source})`);
        return tailwind;
    }

    const bootstrap = await detectBootstrap(root);
    if (bootstrap) {
        log.success(`Detected Bootstrap ${bootstrap.version || ''} (${bootstrap.source})`);
        return bootstrap;
    }

    const material = await detectMaterial(root);
    if (material) {
        log.success(`Detected Material UI ${material.version || ''} (${material.source})`);
        return material;
    }

    const bulma = await detectBulma(root);
    if (bulma) {
        log.success(`Detected Bulma ${bulma.version || ''} (${bulma.source})`);
        return bulma;
    }

    log.info('No CSS framework detected');
    return { name: 'none', source: 'package.json' };
}
