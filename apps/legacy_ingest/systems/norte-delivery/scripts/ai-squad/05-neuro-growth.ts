import * as fs from 'fs';
import * as path from 'path';
import { Logger } from './utils/logger';

const AGENT_NAME = 'NeuroGrowth';
const LANDING_PAGE = path.join('apps', 'web', 'src', 'app', 'page.tsx');

export async function runNeuroGrowth() {
    Logger.section(AGENT_NAME);
    Logger.info(AGENT_NAME, 'Auditing Marketing Copy & Conversion Elements...');

    if (!fs.existsSync(LANDING_PAGE)) {
        Logger.error(AGENT_NAME, `Landing page not found at ${LANDING_PAGE}`);
        return;
    }

    const content = fs.readFileSync(LANDING_PAGE, 'utf8');
    const WEAK_WORDS = ['submeter', 'clique aqui', 'enviar', 'botão'];
    const POWER_WORDS = ['acelerar', 'agora', 'grátis', 'começar', 'garantir'];

    let weakCount = 0;
    let powerCount = 0;

    WEAK_WORDS.forEach(word => {
        const regex = new RegExp(word, 'gi');
        const match = content.match(regex);
        if (match) {
            Logger.warn(AGENT_NAME, `Weak copy detected: "${word}" (Found ${match.length} times)`);
            weakCount += match.length;
        }
    });

    POWER_WORDS.forEach(word => {
        const regex = new RegExp(word, 'gi');
        const match = content.match(regex);
        if (match) {
            powerCount += match.length;
        }
    });

    Logger.info(AGENT_NAME, `Power Word Score: ${powerCount} (Goal: > 5)`);
    Logger.info(AGENT_NAME, `Weak Word Penalty: ${weakCount} (Goal: 0)`);

    if (powerCount > 5 && weakCount === 0) {
        Logger.success(AGENT_NAME, 'Copywriting Audit Passed. High conversion potential.');
    } else {
        Logger.warn(AGENT_NAME, 'Copywriting Audit Failed. Needs optimization.');
    }
}

if (require.main === module) {
    runNeuroGrowth();
}
