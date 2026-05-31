const fs = require('fs');
const path = require('path');

// --- CONFIGURAÃ‡ÃƒO DOS CAMINHOS ---
// Ajuste os caminhos baseados na raiz do seu monorepo
const CONTROLLER_PATH = path.join('apps', 'api', 'src', 'modules', 'finance', 'finance.controller.ts');
const COMMANDER_PATH = path.join('.agent', 'skills', 'systems_ops_commander', 'scripts', 'ops_commander.js');

console.log("âš¡ Iniciando Protocolo Antigravity Fixer...");

// --- SKILL 1: CORREÃ‡ÃƒO DE SINTAXE (Fechamento de Chaves) ---
function fixControllerSyntax() {
    if (!fs.existsSync(CONTROLLER_PATH)) {
        console.error(`âŒ Arquivo nÃ£o encontrado: ${CONTROLLER_PATH}`);
        return;
    }

    let content = fs.readFileSync(CONTROLLER_PATH, 'utf8');
    const lines = content.split('\n');
    let modified = false;

    // Procura a linha onde comeÃ§a o createInvoice
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes('async createInvoice') && !lines[i - 1].trim().endsWith('}')) {
            // Se a linha anterior nÃ£o termina com '}', e nÃ£o Ã© um decorador (@), provavelmente falta a chave
            // Verifica se a linha anterior nÃ£o Ã© um decorador ou vazia
            const prevLine = lines[i - 1].trim();
            if (prevLine !== '' && !prevLine.startsWith('@') && !prevLine.includes('}')) {
                console.log(`ðŸ”§ Detectada falta de fechamento de escopo antes da linha ${i + 1}`);
                // Insere a chave de fechamento antes do createInvoice
                lines.splice(i, 0, '  }');
                modified = true;
                break; // Corrige a primeira ocorrÃªncia crÃ­tica
            }
        }
    }

    if (modified) {
        fs.writeFileSync(CONTROLLER_PATH, lines.join('\n'));
        console.log(`âœ… [CodeHealer] Syntax Error corrigido em: finance.controller.ts`);
    } else {
        console.log(`â„¹ï¸ [CodeHealer] Nenhuma correÃ§Ã£o Ã³bvia necessÃ¡ria ou padrÃ£o nÃ£o reconhecido em finance.controller.ts`);
    }
}

// --- SKILL 2: CORREÃ‡ÃƒO DE PAYLOAD (ValidaÃ§Ã£o do Tenant) ---
function fixCommanderPayload() {
    if (!fs.existsSync(COMMANDER_PATH)) {
        console.warn(`âš ï¸ Script OpsCommander nÃ£o encontrado no caminho padrÃ£o. Pulando.`);
        return;
    }

    let content = fs.readFileSync(COMMANDER_PATH, 'utf8');

    // Procura por um padrÃ£o comum de erro onde 'name' Ã© usado em vez de 'organizationName'
    // Regex procura: chave 'name' seguida de valor string, num contexto de criaÃ§Ã£o
    // Adaptado para achar TENANT = { name: ... }
    // O regex original do prompt pode ser muito restritivo se o formato for ligeiramente diferente
    // Mas vamos tentar usar uma substituiÃ§Ã£o mais direta no objeto TENANT

    let modified = false;

    // CorreÃ§Ã£o especÃ­fica para a constante TENANT definida no arquivo
    if (content.includes('const TENANT = { name:')) {
        content = content.replace('const TENANT = { name:', 'const TENANT = { organizationName:');
        modified = true;
    } else if (content.includes('name: TENANT.name')) {
        // Fallback: se estiver desestruturado ou em outro lugar
        content = content.replace('name: TENANT.name', 'organizationName: TENANT.name');
        modified = true;
    }

    if (modified) {
        // Atualizar tambÃ©m o registro se necessÃ¡rio
        // OpsCommander usa { ...TENANT } no register. Se mudamos a const, mudamos o spread.
        fs.writeFileSync(COMMANDER_PATH, content);
        console.log(`âœ… [PayloadDoctor] ParÃ¢metro 'name' corrigido para 'organizationName' em ops_commander.js`);
    } else {
        console.log(`â„¹ï¸ [PayloadDoctor] PadrÃ£o 'const TENANT = { name:' nÃ£o encontrado. Verifique se jÃ¡ foi corrigido.`);
    }
}

// --- EXECUÃ‡ÃƒO ---
try {
    fixControllerSyntax();
    fixCommanderPayload();
    console.log("ðŸ Protocolo Antigravity finalizado.");
} catch (error) {
    console.error("ðŸ”¥ Erro crÃ­tico na execuÃ§Ã£o da Skill:", error);
}

