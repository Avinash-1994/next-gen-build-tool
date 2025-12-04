import fs from 'fs/promises';
import path from 'path';
import { log } from '../../utils/logger.js';

export interface CSSOptimizationConfig {
    splitCritical?: boolean;
    criticalThreshold?: number; // bytes
    purgeUnused?: boolean;
    framework?: 'tailwind' | 'bootstrap' | 'bulma' | 'material' | 'none';
}

/**
 * Split CSS into critical (above-fold) and async (below-fold)
 */
export async function splitCSSBundle(
    css: string,
    config: CSSOptimizationConfig = {}
): Promise<{ critical: string; async: string }> {
    const { criticalThreshold = 14000 } = config; // 14KB default

    // Simple heuristic: first N bytes are critical
    if (css.length <= criticalThreshold) {
        return { critical: css, async: '' };
    }

    // Split at a rule boundary
    const rules = css.split('}');
    let critical = '';
    let async = '';
    let currentSize = 0;

    for (const rule of rules) {
        const ruleWithBrace = rule + '}';
        if (currentSize + ruleWithBrace.length <= criticalThreshold) {
            critical += ruleWithBrace;
            currentSize += ruleWithBrace.length;
        } else {
            async += ruleWithBrace;
        }
    }

    return { critical, async };
}

/**
 * Framework-aware CSS purging
 * Removes unused CSS classes based on framework patterns
 */
export async function purgeUnusedCSS(
    css: string,
    usedClasses: Set<string>,
    config: CSSOptimizationConfig = {}
): Promise<string> {
    const { framework = 'none' } = config;

    // Framework-specific class patterns to preserve
    const preservePatterns: Record<string, RegExp[]> = {
        tailwind: [
            /^(hover|focus|active|disabled|group-hover|peer-|dark):/,
            /^(sm|md|lg|xl|2xl):/,
        ],
        bootstrap: [
            /^(btn|nav|card|modal|dropdown|collapse|accordion)-/,
            /^(show|active|disabled|fade|collapse)/,
        ],
        bulma: [
            /^(is|has)-/,
            /^(button|hero|section|column|box)/,
        ],
        material: [
            /^(mdc|mat)-/,
            /^(ripple|elevation|theme)/,
        ],
        none: [],
    };

    const patterns = preservePatterns[framework] || [];

    // Parse CSS and remove unused rules
    const rules = css.split('}').filter(rule => rule.trim());
    const purgedRules: string[] = [];

    for (const rule of rules) {
        // Extract class name, handling escaped characters
        const classMatch = rule.match(/\.([a-zA-Z0-9_\\:-]+)/);
        if (!classMatch) {
            purgedRules.push(rule + '}');
            continue;
        }

        const className = classMatch[1];
        // Remove escape characters for comparison
        const normalizedClass = className.replace(/\\/g, '');

        // Keep if used or matches preserve pattern
        const shouldKeep =
            usedClasses.has(className) ||
            usedClasses.has(normalizedClass) ||
            patterns.some(pattern => pattern.test(normalizedClass));

        if (shouldKeep) {
            purgedRules.push(rule + '}');
        }
    }

    const purgedCSS = purgedRules.join('\n');
    const originalSize = css.length;
    const purgedSize = purgedCSS.length;
    const reduction = ((1 - purgedSize / originalSize) * 100).toFixed(1);

    log.success(`CSS purged: ${originalSize}B → ${purgedSize}B (${reduction}% reduction)`);

    return purgedCSS;
}

/**
 * Compose source maps across preprocessors
 */
export interface SourceMapComposition {
    version: number;
    sources: string[];
    mappings: string;
    names: string[];
}

export async function composeSourceMaps(
    maps: SourceMapComposition[]
): Promise<SourceMapComposition> {
    // Simple source map composition
    // In production, use a library like 'source-map' for proper composition

    const composed: SourceMapComposition = {
        version: 3,
        sources: [],
        mappings: '',
        names: [],
    };

    for (const map of maps) {
        composed.sources.push(...map.sources);
        composed.names.push(...map.names);
        // Simplified: just concatenate mappings
        composed.mappings += map.mappings;
    }

    return composed;
}

/**
 * Extract critical CSS for above-the-fold content
 */
export async function extractCriticalCSS(
    html: string,
    css: string
): Promise<string> {
    // Extract classes used in HTML
    const classRegex = /class="([^"]+)"/g;
    const usedClasses = new Set<string>();

    let match;
    while ((match = classRegex.exec(html)) !== null) {
        const classes = match[1].split(/\s+/);
        classes.forEach(cls => usedClasses.add(cls));
    }

    // Filter CSS to only include used classes
    const rules = css.split('}').filter(rule => rule.trim());
    const criticalRules: string[] = [];

    for (const rule of rules) {
        const classMatch = rule.match(/\.([a-zA-Z0-9_-]+)/);
        if (classMatch && usedClasses.has(classMatch[1])) {
            criticalRules.push(rule + '}');
        }
    }

    return criticalRules.join('\n');
}

/**
 * Analyze CSS bundle and provide optimization suggestions
 */
export interface CSSAnalysis {
    totalSize: number;
    ruleCount: number;
    unusedRules: number;
    duplicateRules: number;
    suggestions: string[];
}

export async function analyzeCSS(
    css: string,
    usedClasses: Set<string>
): Promise<CSSAnalysis> {
    const rules = css.split('}').filter(rule => rule.trim());
    const ruleMap = new Map<string, number>();
    let unusedCount = 0;

    for (const rule of rules) {
        const classMatch = rule.match(/\.([a-zA-Z0-9_-]+)/);
        if (classMatch) {
            const className = classMatch[1];
            ruleMap.set(rule, (ruleMap.get(rule) || 0) + 1);

            if (!usedClasses.has(className)) {
                unusedCount++;
            }
        }
    }

    const duplicateCount = Array.from(ruleMap.values()).filter(count => count > 1).length;
    const suggestions: string[] = [];

    if (unusedCount > 0) {
        suggestions.push(`Remove ${unusedCount} unused CSS rules`);
    }
    if (duplicateCount > 0) {
        suggestions.push(`Deduplicate ${duplicateCount} duplicate rules`);
    }
    if (css.length > 100000) {
        suggestions.push('Consider code splitting for large CSS bundle');
    }

    return {
        totalSize: css.length,
        ruleCount: rules.length,
        unusedRules: unusedCount,
        duplicateRules: duplicateCount,
        suggestions,
    };
}
