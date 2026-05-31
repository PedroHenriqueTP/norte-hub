const fs = require('fs');
const path = require('path');

// Configuração
const APPS_DIR = path.join(__dirname, '../../../../apps/api/src/modules');
const DOCS_DIR = path.join(__dirname, '../../../../docs');
const API_GUIDE_PATH = path.join(DOCS_DIR, 'API_GUIDE.md');

// Função para escanear Controllers recursivamente
function scanControllers(dir, fileList = []) {
    const files = fs.readdirSync(dir);

    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            scanControllers(filePath, fileList);
        } else if (file.endsWith('.controller.ts')) {
            fileList.push(filePath);
        }
    });

    return fileList;
}

// Função para extrair rotas de um arquivo Controller
function extractRoutes(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const routes = [];

    // Regex simplificado para pegar @Controller('rota')
    const controllerMatch = content.match(/@Controller\(['"](.+)['"]\)/);
    const basePath = controllerMatch ? controllerMatch[1] : '';

    // Regex para pegar métodos HTTP e caminhos
    const methodRegex = /@(Get|Post|Put|Delete|Patch)\(['"]?([^'"]*)['"]?\)/g;
    let match;

    while ((match = methodRegex.exec(content)) !== null) {
        const httpMethod = match[1].toUpperCase();
        const subPath = match[2];
        const fullPath = `/${basePath}${subPath ? '/' + subPath : ''}`.replace(/\/+/g, '/');

        routes.push({
            method: httpMethod,
            path: fullPath,
            file: path.basename(filePath)
        });
    }

    return routes;
}

// Função Principal
async function main() {
    console.log('🔍 DocReviewer: Iniciando varredura de API...');

    if (!fs.existsSync(APPS_DIR)) {
        console.error(`❌ Diretório de módulos não encontrado: ${APPS_DIR}`);
        return;
    }

    if (!fs.existsSync(DOCS_DIR)) {
        fs.mkdirSync(DOCS_DIR, { recursive: true });
    }

    const controllers = scanControllers(APPS_DIR);
    let allRoutes = [];

    controllers.forEach(ctrl => {
        const routes = extractRoutes(ctrl);
        allRoutes = allRoutes.concat(routes);
    });

    console.log(`✅ ${allRoutes.length} rotas encontradas em ${controllers.length} controllers.`);

    // Gerar Relatório Markdown
    let markdownContent = '# Guia de Referência da API (Auto-Generated)\n\n';
    markdownContent += `Atualizado em: ${new Date().toLocaleString()}\n\n`;
    markdownContent += '| Método | Rota | Controller |\n';
    markdownContent += '|---|---|---|\n';

    allRoutes.forEach(route => {
        markdownContent += `| **${route.method}** | \`${route.path}\` | ${route.file} |\n`;
    });

    fs.writeFileSync(API_GUIDE_PATH, markdownContent);
    console.log(`📄 Documentação atualizada em: ${API_GUIDE_PATH}`);
}

main();
