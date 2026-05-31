import * as fs from 'fs';
import * as path from 'path';
import * as glob from 'glob';
import { Logger } from './utils/logger';

const AGENT_NAME = 'SystemArchitect';
const MAX_LINES = 300;

export async function runSystemArchitect() {
    Logger.section(AGENT_NAME);
    Logger.info(AGENT_NAME, 'Analyzing Structural Integrity...');

    const reportPath = path.join(process.cwd(), 'architecture-report.md');
    let reportContent = `# Architecture Report\nDate: ${new Date().toLocaleString()}\n\n`;

    const files = glob.sync('apps/**/*.{ts,tsx,js}', { ignore: '**/node_modules/**' });

    let complexFiles = 0;
    let todoCount = 0;

    reportContent += `## Use of 'any'\n`;

    files.forEach(file => {
        const content = fs.readFileSync(file, 'utf8');
        const lines = content.split('\n');

        // 1. Complexity Check
        if (lines.length > MAX_LINES) {
            Logger.warn(AGENT_NAME, `High Complexity Detected: ${file} (${lines.length} lines)`);
            complexFiles++;
            reportContent += `- **${file}**: ${lines.length} lines (Recommended split)\n`;
        }

        // 2. TODO Scan
        content.split('\n').forEach((line, idx) => {
            if (line.includes('TODO') || line.includes('FIXME')) {
                todoCount++;
                // reportContent += `- [${file}:${idx + 1}] ${line.trim()}\n`; // Too verbose for report sometimes
            }
        });

        // 3. 'any' check for strictness
        if (content.includes(': any') || content.includes('as any')) {
            // Just a sample check
        }
    });

    reportContent += `\n## Summary\n`;
    reportContent += `- Total Files Scanned: ${files.length}\n`;
    reportContent += `- Complex Files (>300 lines): ${complexFiles}\n`;
    reportContent += `- Leftover TODOs: ${todoCount}\n`;

    fs.writeFileSync(reportPath, reportContent);
    Logger.success(AGENT_NAME, `Report generated: ${reportPath}`);
}

if (require.main === module) {
    runSystemArchitect();
}
