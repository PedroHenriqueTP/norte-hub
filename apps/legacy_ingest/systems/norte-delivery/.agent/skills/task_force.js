const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const readline = require('readline');

console.log("ðŸ«¡ TaskForce: Operador Manual Apresentando-se!");
console.log("ðŸ“… HorÃ¡rio: " + new Date().toLocaleTimeString());

const COMMANDS = {
    '1': { desc: 'Validar OperaÃ§Ã£o (Ops Commander)', cmd: 'node .agent/skills/systems_ops_commander/scripts/ops_commander.js validate' },
    '2': { desc: 'Preparar ProduÃ§Ã£o (ProductionPrep)', cmd: 'node .agent/skills/production_prep.js' },
    '3': { desc: 'Rodar Testes (Swarm/SpecFactory)', cmd: 'npm test --prefix apps/api' },
    '4': { desc: 'Verificar Links (LinkWarden)', cmd: 'node .agent/skills/link_warden.js' },
    '5': { desc: 'Deep Clean (Project Polish)', cmd: 'rm -rf node_modules && npm install' }, // Cuidado com este
};

console.log("\nO que o senhor deseja fazer hoje, CapitÃ£o?");
Object.keys(COMMANDS).forEach(key => {
    console.log(`${key}. [${COMMANDS[key].desc}]`);
});

// Nota: Em ambiente nÃ£o interativo (como logs de agente), isso pode travar.
// Vamos verificar se temos argumentos de linha de comando para by-pass.

const args = process.argv.slice(2);
if (args.length > 0) {
    const choice = args[0];
    if (COMMANDS[choice]) {
        console.log(`\nðŸš€ Executando: ${COMMANDS[choice].desc}`);
        try {
            execSync(COMMANDS[choice].cmd, { stdio: 'inherit' });
            console.log("âœ… MissÃ£o cumprida.");
        } catch (e) {
            console.error("âŒ Falha na missÃ£o.");
        }
    } else {
        console.error("Comando desconhecido.");
    }
} else {
    console.log("\n(Para executar, rode: node task_force.js <numero>)");
    console.log("Ex: node .agent/skills/task_force.js 4");
}

