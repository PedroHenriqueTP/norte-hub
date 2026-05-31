const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// --- CONFIGURAÇÃO ---
const API_ROOT = path.join('apps', 'api');
const ENV_PATH = path.join(API_ROOT, '.env');
const MAIN_FILE = path.join(API_ROOT, 'src', 'main.ts');
const DOCKER_FILE = path.join(API_ROOT, 'Dockerfile');

console.log("🚀 Iniciando Protocolo ProductionPrep: Validando Prontidão para Hospedagem...");

// 1. Auditoria de Variáveis de Ambiente (Credenciais)
function auditEnv() {
    console.log("\n🔐 [1/4] Auditando Credenciais (.env)...");

    if (!fs.existsSync(ENV_PATH)) {
        console.error("❌ CRÍTICO: Arquivo .env não encontrado em apps/api!");
        return false;
    }

    const envContent = fs.readFileSync(ENV_PATH, 'utf8');
    const requiredVars = [
        'NODE_ENV',
        'DATABASE_URL',
        'JWT_SECRET',
        'PORT',
        'GOOGLE_CLIENT_ID' // Exemplo de var adicionada na skill anterior
    ];

    let missing = [];
    requiredVars.forEach(v => {
        if (!envContent.includes(`${v}=`)) {
            missing.push(v);
        }
    });

    if (missing.length > 0) {
        console.warn(`⚠️ ALERTA: Variáveis críticas ausentes ou não detectadas: ${missing.join(', ')}`);
        console.warn(`   Certifique-se de configurar estas variáveis no painel da sua hospedagem (Vercel, Render, AWS).`);
    } else {
        console.log("✅ Todas as variáveis críticas parecem estar definidas.");
    }
    return true;
}

// 2. Auditoria de Segurança no Código (main.ts)
function auditCodeSecurity() {
    console.log("\n🛡️ [2/4] Auditando Configurações de Segurança (main.ts)...");

    if (!fs.existsSync(MAIN_FILE)) {
        console.error("❌ main.ts não encontrado.");
        return;
    }

    const content = fs.readFileSync(MAIN_FILE, 'utf8');

    // Check CORS
    if (content.includes('enableCors')) {
        console.log("✅ CORS habilitado.");
    } else {
        console.warn("⚠️ ALERTA: 'app.enableCors()' não encontrado. Sua API pode rejeitar conexões do Frontend.");
    }

    // Check ValidationPipe
    if (content.includes('ValidationPipe')) {
        console.log("✅ ValidationPipe global detectado.");
    } else {
        console.warn("⚠️ ALERTA: ValidationPipe não encontrado. Dados de entrada podem não estar sendo filtrados.");
    }

    // Check Logger
    if (content.includes('LoggerFactory') || content.includes('logger:')) {
        console.log("✅ Configuração de Logger detectada.");
    } else {
        console.log("ℹ️ Sugestão: Configure um Logger customizado (Winston/Pino) para produção.");
    }
}

// 3. Teste de Build (A prova de fogo)
function runBuildTest() {
    console.log("\n🏗️ [3/4] Testando Build de Produção...");
    console.log("   (Isso pode levar alguns segundos...)");

    try {
        execSync(`cd ${API_ROOT} && npm run build`, { stdio: 'pipe' });
        console.log("✅ Build: SUCESSO. O código é compilável e a pasta /dist foi gerada.");
    } catch (error) {
        console.error("❌ Build: FALHOU.");
        console.error("   O comando 'npm run build' retornou erro. Não faça deploy antes de corrigir isso.");
        // Opcional: mostrar erro, mas pode ser muito grande
    }
}

// 4. Gerar Dockerfile (Se não existir)
function generateDocker() {
    console.log("\n🐳 [4/4] Verificando Containerização (Docker)...");

    if (fs.existsSync(DOCKER_FILE)) {
        console.log("✅ Dockerfile já existe.");
        return;
    }

    console.log("✨ Dockerfile não encontrado. Gerando arquivo otimizado para NestJS...");

    const dockerContent = `
# Stage 1: Build
FROM node:18-alpine AS builder

WORKDIR /usr/src/app

COPY package*.json ./
COPY tsconfig*.json ./
COPY src ./src

# Instala dependências e faz o build
RUN npm install
RUN npm run build

# Stage 2: Production Run
FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install --only=production

COPY --from=builder /usr/src/app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/main"]
`;

    try {
        fs.writeFileSync(DOCKER_FILE, dockerContent);
        console.log("✅ Dockerfile gerado em apps/api/Dockerfile");
    } catch (e) {
        console.error("❌ Erro ao criar Dockerfile:", e);
    }
}

// Execução
try {
    auditEnv();
    auditCodeSecurity();
    generateDocker(); // Gera o Docker antes do build para garantir que está lá
    runBuildTest();

    console.log("\n🏁 Relatório de Prontidão Finalizado.");
    console.log("👉 Se tudo estiver verde, você está pronto para: git push && deploy.");
} catch (error) {
    console.error("🔥 Erro fatal na Skill:", error);
}
