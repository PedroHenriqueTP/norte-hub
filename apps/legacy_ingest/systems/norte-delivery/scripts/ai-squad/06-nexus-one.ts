import { execSync } from 'child_process';
import { Logger } from './utils/logger';

const AGENT_NAME = 'NexusOne';

export async function runNexusOne() {
    Logger.section(AGENT_NAME);
    Logger.info(AGENT_NAME, 'Consolidating Daily Report...');

    const startTime = Date.now();
    const playback = [];

    // Protocol: Run all critical agents sequentially and capture output/status
    const agents = [
        { name: 'SpecFactory', script: '01-spec-factory.ts' },
        { name: 'LinkWarden', script: '02-link-warden.ts' },
        // TaskForce is interactive, skipped in daily report automation
        { name: 'SystemArchitect', script: '04-system-architect.ts' },
        { name: 'NeuroGrowth', script: '05-neuro-growth.ts' }
    ];

    for (const agent of agents) {
        try {
            Logger.info(AGENT_NAME, `Activating ${agent.name}...`);
            execSync(`ts-node scripts/ai-squad/${agent.script}`, { stdio: 'inherit' });
            playback.push({ agent: agent.name, status: '✅ Success' });
        } catch (e) {
            Logger.error(AGENT_NAME, `${agent.name} failed execution.`);
            playback.push({ agent: agent.name, status: '❌ Failed' });
        }
    }

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);

    Logger.section('DAILY SQUAD REPORT');
    Logger.info(AGENT_NAME, `Execution Time: ${duration}s`);

    playback.forEach(p => {
        console.log(`   - ${p.agent.padEnd(20)}: ${p.status}`);
    });

    Logger.info(AGENT_NAME, 'System is operational. Have a productive day.');
}

if (require.main === module) {
    runNexusOne();
}
