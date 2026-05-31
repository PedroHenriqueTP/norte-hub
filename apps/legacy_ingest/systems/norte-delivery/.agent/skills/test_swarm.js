const fs = require('fs');
const path = require('path');
const { execSync, spawn } = require('child_process');

// --- CONFIGURAÇÃO ---
const API_ROOT = path.join('apps', 'api');
const SRC_DIR = path.join(API_ROOT, 'src');
const REPORT_FILE = path.join(process.cwd(), 'TEST_REPORT.md');

console.log("🐝 Iniciando TestSwarm: Protocolo de Teste Autônomo...");

// --- FASE 1: RECONHECIMENTO (Scan Architecture) ---
function scanArchitecture() {
    console.log("📡 Escaneando arquitetura do sistema...");
    const controllers = [];

    function walkDir(dir) {
        const files = fs.readdirSync(dir);
        for (const file of files) {
            const filePath = path.join(dir, file);
            const stat = fs.statSync(filePath);
            if (stat.isDirectory()) {
                walkDir(filePath);
            } else if (file.endsWith('.controller.ts')) {
                const content = fs.readFileSync(filePath, 'utf8');
                // Regex simples para pegar o prefixo da rota
                const routeMatch = content.match(/@Controller\(['"](.+?)['"]\)/);
                if (routeMatch) {
                    controllers.push({
                        file: file,
                        route: routeMatch[1],
                        path: filePath
                    });
                }
            }
        }
    }

    if (fs.existsSync(SRC_DIR)) {
        walkDir(SRC_DIR);
    }
    console.log(`✅ Arquitetura Mapeada: ${controllers.length} Controladores encontrados.`);
    return controllers;
}

// --- FASE 2: GERAÇÃO DE SEEDS (Inteligência de Dados) ---
function generateSeed(controllerRoute) {
    // Lógica heurística para gerar dados baseados no nome da rota
    const seed = {};

    if (controllerRoute.includes('users') || controllerRoute.includes('auth')) {
        seed.email = `test_user_${Date.now()}@example.com`;
        seed.password = "SenhaForte123!";
        seed.name = "Usuario Teste Autonomo";
    }

    if (controllerRoute.includes('orders')) {
        seed.items = [{ productId: "prod_123", quantity: 2 }];
        seed.total = 50.00;
        seed.address = "Rua dos Bobos, 0";
    }

    if (controllerRoute.includes('finance')) {
        seed.amount = 100.50;
        seed.type = "CREDIT";
        seed.description = "Teste Financeiro Automatizado";
    }

    return seed;
}

// --- FASE 3: EXECUÇÃO E MONITORAMENTO ---
async function runDiagnostics(controllers) {
    let reportContent = `# 🕵️ Relatório de Inteligência de Testes (TestSwarm)\nData: ${new Date().toLocaleString()}\n\n`;

    console.log("🔥 Iniciando baterias de teste...");

    // 1. Verificar integridade básica (Compilação)
    try {
        console.log("   - Verificando integridade do build...");
        execSync(`cd ${API_ROOT} && npx tsc --noEmit`, { stdio: 'pipe' });
        reportContent += `## ✅ Integridade Estrutural\nO código compila sem erros de sintaxe.\n\n`;
    } catch (error) {
        reportContent += `## ❌ Falha Crítica de Estrutura\nO código não está compilando. Erros detectados no TypeScript.\nTrace:\n\`\`\`\n${error.message.slice(0, 300)}...\n\`\`\`\n\n`;
    }

    // 2. Análise de Cobertura de Fluxos
    reportContent += `## 🌊 Análise de Fluxos (Controllers)\n`;

    for (const ctrl of controllers) {
        const seed = generateSeed(ctrl.route);
        const seedJson = JSON.stringify(seed, null, 2);

        reportContent += `### Rota: /${ctrl.route}\n`;
        reportContent += `- **Arquivo Fonte:** ${ctrl.file}\n`;
        reportContent += `- **Seed Gerado:** \n\`\`\`json\n${seedJson}\n\`\`\`\n`;

        // Simulação de sugestão de teste (Mock)
        if (ctrl.route === 'auth') {
            reportContent += `- **Status:** ⚠️ Crítico. Rota de autenticação requer testes de segurança (Brute Force/JWT).\n`;
        } else {
            reportContent += `- **Status:** 🟢 Mapeado para testes funcionais.\n`;
        }

        // Sugestão de Refatoração baseada em padrões comuns
        const content = fs.readFileSync(ctrl.path, 'utf8');
        if (content.includes('any')) {
            reportContent += `> **🚨 Sugestão de Refatoração:** O uso de 'any' foi detectado neste controller. Tipar estritamente com DTOs para evitar injeção de dados inválidos.\n`;
        }
        if (!content.includes('try') && !content.includes('catch')) {
            reportContent += `> **💡 Sugestão de Melhoria:** Nenhum bloco try/catch explícito encontrado. Certifique-se de que está usando um Exception Filter global.\n`;
        }

        reportContent += `\n---\n`;
    }

    return reportContent;
}

// --- EXECUÇÃO PRINCIPAL ---
(async () => {
    try {
        const controllers = scanArchitecture();
        const report = await runDiagnostics(controllers);

        fs.writeFileSync(REPORT_FILE, report);
        console.log(`\n🏁 Relatório gerado com sucesso: ${REPORT_FILE}`);
        console.log("👉 Abra o arquivo TEST_REPORT.md para ver as sugestões de refatoração.");

    } catch (e) {
        console.error("Erro fatal no TestSwarm:", e);
    }
})();
