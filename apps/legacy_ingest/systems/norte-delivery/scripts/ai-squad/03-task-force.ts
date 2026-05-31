import * as inquirer from 'inquirer';
import { execSync } from 'child_process';
import { Logger } from './utils/logger';

const AGENT_NAME = 'TaskForce';

export async function runTaskForce() {
    Logger.section(AGENT_NAME);
    Logger.info(AGENT_NAME, 'Reporting for duty. Awaiting orders.');

    const answers = await inquirer.prompt([
        {
            type: 'list',
            name: 'mission',
            message: 'Select a mission profile:',
            choices: [
                'Run All Agents (Daily Squad)',
                'Run SpecFactory (Tests)',
                'Run LinkWarden (UI Check)',
                'Run Production Prep',
                'Clean Install (Deep Clean)',
                'Exit'
            ]
        }
    ]);

    try {
        switch (answers.mission) {
            case 'Run All Agents (Daily Squad)':
                execSync('npm run squad:daily', { stdio: 'inherit' });
                break;
            case 'Run SpecFactory (Tests)':
                execSync('ts-node scripts/ai-squad/01-spec-factory.ts', { stdio: 'inherit' });
                break;
            case 'Run LinkWarden (UI Check)':
                execSync('ts-node scripts/ai-squad/02-link-warden.ts', { stdio: 'inherit' });
                break;
            case 'Run Production Prep':
                execSync('node .agent/skills/production_prep.js', { stdio: 'inherit' });
                break;
            case 'Clean Install (Deep Clean)':
                Logger.warn(AGENT_NAME, 'Executing Deep Clean...');
                execSync('rm -rf node_modules package-lock.json && npm install', { stdio: 'inherit' });
                break;
            case 'Exit':
                Logger.info(AGENT_NAME, 'Standing down.');
                return;
        }
        Logger.success(AGENT_NAME, 'Mission Accomplished.');
    } catch (e: any) {
        Logger.error(AGENT_NAME, 'Mission Failed.', e.message);
    }
}

if (require.main === module) {
    runTaskForce();
}
