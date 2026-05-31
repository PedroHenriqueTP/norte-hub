import fs from 'fs';
import path from 'path';

// Diretórios a serem exportados para o Context-Map
const TARGET_DIRS = [
  'src/services',
  'src/actions',
  'src/components/shared',
  'prisma'
];

function buildDirectoryTree(dirPath) {
  const stats = fs.statSync(dirPath);
  if (!stats.isDirectory()) {
    return path.basename(dirPath);
  }

  const children = fs.readdirSync(dirPath)
    .filter(file => !file.startsWith('.') && file !== 'node_modules')
    .map(child => buildDirectoryTree(path.join(dirPath, child)));

  return {
    name: path.basename(dirPath),
    children
  };
}

console.log("🧠 [DEV-SYNC] Extraindo contexto do Polvo Norte...");

const contextMap = {
  version: "1.0.0",
  timestamp: new Date().toISOString(),
  architecture: "Multi-Tenant Nível 2 (Simbionte)",
  coreRules: [
    "Soberania de Dados: Todas as queries no Prisma DEVEM conter o tenantId.",
    "Design Emocional: Use cores com propósito (Emeralda para Finanças, Violeta para I.A., Laranja para Gastro).",
    "Micro-Interações: Utilize Framer Motion para feedback visual instantâneo.",
    "Automação Preditiva: The Architect (Córtex Neural) deve ser consultado antes de decisões críticas."
  ],
  directoryTree: TARGET_DIRS.map(dir => buildDirectoryTree(path.resolve(process.cwd(), dir))),
  prismaModels: [
    "User", "Tenant", "SocialEvent", "DigitalWallet", "TransactionLedger", "UserProject", "AIContext"
  ] // Resumo dos modelos principais para o Cursor/Claude Code
};

const outputPath = path.resolve(process.cwd(), 'context-map.json');
fs.writeFileSync(outputPath, JSON.stringify(contextMap, null, 2));

console.log(`✅ [DEV-SYNC] Context-Map gerado com sucesso em: ${outputPath}`);
console.log(`🤖 Cursor e Claude Code agora estão sincronizados com a medula da aplicação.`);
