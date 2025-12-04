import { Plugin } from './index.js';
import fs from 'fs/promises';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export class BuildReporterPlugin implements Plugin {
    name = 'build-reporter';

    setup(build: any) {
        let startTime: number;

        build.onStart(() => {
            startTime = Date.now();
        });

        build.onEnd(async (result: any) => {
            const duration = Date.now() - startTime;
            const outDir = build.initialOptions.outdir || 'dist';

            // 1. Generate Build Metrics
            const metrics = {
                timestamp: new Date().toISOString(),
                duration,
                errors: result.errors.length,
                warnings: result.warnings.length,
                assets: Object.keys(result.metafile?.outputs || {}).length
            };

            try {
                await fs.writeFile(
                    path.join(outDir, 'build-report.json'),
                    JSON.stringify(metrics, null, 2)
                );
            } catch (e: any) {
                console.error('[reporter] Failed to write build report:', e.message);
            }

            // 2. Generate Changelog (if git is available)
            try {
                // Get commits since last tag or last 5 commits
                const { stdout } = await execAsync('git log -n 5 --pretty=format:"- %s (%h)"');
                if (stdout) {
                    const changelog = `# Changelog\n\nGenerated at ${new Date().toLocaleString()}\n\n${stdout}`;
                    await fs.writeFile(
                        path.join(outDir, 'changelog.md'),
                        changelog
                    );
                }
            } catch (e: any) {
                // Git not available or error - silent fail is acceptable but let's log debug
                // console.debug('[reporter] Git changelog generation skipped');
            }
        });
    }
}
