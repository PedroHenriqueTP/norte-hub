const fs = require('fs');
const path = require('path');

// --- CONFIGURAÇÃO ---
const ROOT_DIRS = ['apps/api/src', 'apps/web/src/app'];
const MAX_LINES_WARNING = 300;

console.log("🏗️  Iniciando SystemArchitect: Análise Estrutural e Backlog...");

function getAllFiles(dirPath, arrayOfFiles) {
    if (!fs.existsSync(dirPath)) return arrayOfFiles || [];

    const files = fs.readdirSync(dirPath);
    arrayOfFiles = arrayOfFiles || [];

    files.forEach(function (file) {
        if (fs.statSync(dirPath + "/" + file).isDirectory()) {
            arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
        } else {
            if (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.js')) {
                arrayOfFiles.push(path.join(dirPath, file));
            }
        }
    });

    return arrayOfFiles;
}

function analyzeArchitecture() {
    let report = "";
    let totalFiles = 0;
    let totalLines = 0;
    let todos = [];
    let largeFiles = [];

    ROOT_DIRS.forEach(dir => {
        const fullDir = path.join(process.cwd(), dir);
        const files = getAllFiles(fullDir);

        files.forEach(file => {
            const content = fs.readFileSync(file, 'utf8');
            const lines = content.split('\n');
            const relativePath = path.relative(process.cwd(), file);

            totalFiles++;
            totalLines += lines.length;

            // Check Complexity
            if (lines.length > MAX_LINES_WARNING) {
                largeFiles.push({ file: relativePath, lines: lines.length });
            }

            // Collect TODOs
            lines.forEach((line, index) => {
                if (line.includes('TODO') || line.includes('FIXME')) {
                    todos.push({ file: relativePath, line: index + 1, text: line.trim() });
                }
            });
        });
    });

    console.log(`\n📊 ESTATÍSTICAS GERAIS:`);
    console.log(`   - Arquivos analisados: ${totalFiles}`);
    console.log(`   - Total de linhas de código: ${totalLines}`);

    console.log(`\n🏢 ARQUIVOS COMPLEXOS (> ${MAX_LINES_WARNING} linhas):`);
    if (largeFiles.length === 0) {
        console.log("   ✅ Nenhum arquivo excessivamente grande detectado.");
    } else {
        largeFiles.sort((a, b) => b.lines - a.lines).forEach(f => {
            console.log(`   ⚠️  ${f.file} (${f.lines} linhas)`);
        });
    }

    console.log(`\n📝 BACKLOG TÉCNICO (TODOs/FIXMEs):`);
    if (todos.length === 0) {
        console.log("   ✅ Nenhum TODO encontrado. Código limpo!");
    } else {
        todos.forEach(t => {
            console.log(`   📌 [${t.file}:${t.line}] ${t.text}`);
        });
    }

    console.log("\n🧪 MENSAGEM DO ARQUITETO:");
    if (largeFiles.length > 5) {
        console.log("   > Recomendação: O sistema está crescendo. Considere quebrar os arquivos maiores em módulos menores.");
    } else if (todos.length > 10) {
        console.log("   > Recomendação: Temos muitos TODOs pendentes. Sugiro um 'TaskForce' focado em limpeza técnica.");
    } else {
        console.log("   > O sistema está saudável e bem estruturado. Bom trabalho.");
    }
}

try {
    analyzeArchitecture();
    console.log("\n🏁 Análise concluída.");
} catch (e) {
    console.error("Erro fatal no SystemArchitect:", e);
}
