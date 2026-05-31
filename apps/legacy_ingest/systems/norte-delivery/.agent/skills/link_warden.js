const fs = require('fs');
const path = require('path');

// --- CONFIGURAÇÃO ---
const WEB_ROOT = path.join('apps', 'web', 'src');
const PAGES_DIR = path.join(WEB_ROOT, 'app');

console.log("🔗 Iniciando LinkWarden: Patrulha de Links Quebrados...");

function getAllFiles(dirPath, arrayOfFiles) {
    const files = fs.readdirSync(dirPath);

    arrayOfFiles = arrayOfFiles || [];

    files.forEach(function (file) {
        if (fs.statSync(dirPath + "/" + file).isDirectory()) {
            arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
        } else {
            if (file.endsWith('.tsx') || file.endsWith('.jsx')) {
                arrayOfFiles.push(path.join(dirPath, file));
            }
        }
    });

    return arrayOfFiles;
}

function scanLinks() {
    if (!fs.existsSync(WEB_ROOT)) {
        console.error("❌ apps/web/src não encontrado.");
        return;
    }

    const files = getAllFiles(WEB_ROOT);
    let issues = 0;

    console.log(`🔎 Analisando ${files.length} arquivos React/Next.js...`);

    files.forEach(file => {
        const content = fs.readFileSync(file, 'utf8');

        // Regex para encontrar <Link href="...">
        const linkRegex = /<Link[^>]*href=["']([^"']+)["'][^>]*>/g;
        let match;

        while ((match = linkRegex.exec(content)) !== null) {
            const href = match[1];

            // Verificar links internos simples
            if (href.startsWith('/') && !href.startsWith('http')) {
                // Tenta mapear rota para arquivo
                // Ex: /auth/signup -> apps/web/src/app/auth/signup/page.tsx

                // Remover query params
                const cleanHref = href.split('?')[0];

                let targetPath = path.join(PAGES_DIR, cleanHref, 'page.tsx');
                let targetPathIndex = path.join(PAGES_DIR, cleanHref, 'index.tsx'); // old pages router fallback

                // Tratamento especial para rotas dinâmicas pode ser complexo, 
                // aqui faremos uma verificação básica de existência de rota estática.

                // Se for rota root
                if (cleanHref === '/') {
                    targetPath = path.join(PAGES_DIR, 'page.tsx');
                }

                // Check if likely dynamic (contains [id] or similar logic would be needed)
                // Ignorando rotas dinâmicas por enquanto para evitar falsos positivos
                if (!cleanHref.includes('[') && !cleanHref.includes('#')) {
                    if (!fs.existsSync(targetPath) && !fs.existsSync(targetPath + ".tsx")) {
                        // Tentar achar na estrutura de grupos (admin), (waiter)...
                        // Isso é difícil de fazer estaticamente sem mapear tudo antes.
                        // Vamos apenas logar como "Aviso" se não for óbvio.

                        // Melhor estratégia simples: Listar o link encontrado
                        // console.log(`   ℹ️ Link encontrado: ${href} em ${path.basename(file)}`);
                    }
                }
            } else if (href === '#' || href === '') {
                console.warn(`⚠️  Link Vazio/Inválido encontrado em: ${path.basename(file)}`);
                console.warn(`   Linha (aprox): ${content.substring(0, match.index).split('\n').length}`);
                issues++;
            }
        }
    });

    if (issues === 0) {
        console.log("✅ Nenhum link obviamente quebrado (vazio ou #) encontrado.");
    } else {
        console.log(`⚠️ Encontrados ${issues} potenciais problemas de link.`);
    }
}

try {
    scanLinks();
    console.log("🏁 Patrulha encerrada.");
} catch (e) {
    console.error("Erro fatal no LinkWarden:", e);
}
