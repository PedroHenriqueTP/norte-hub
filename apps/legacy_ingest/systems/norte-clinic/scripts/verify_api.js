/**
 * verify_api.js
 * Script rápido para verificar se os endpoints essenciais do MedCura estão respondendo.
 * 
 * Uso: node scripts/verify_api.js
 */

const http = require('http');

const BASE_URL = 'http://localhost:8000/api/v1'; // Ajuste conforme sua porta

async function checkEndpoint(name, path) {
    return new Promise((resolve) => {
        http.get(`${BASE_URL}${path}`, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                const statusIcon = res.statusCode >= 200 && res.statusCode < 300 ? '✅' : '❌';
                console.log(`${statusIcon} [${res.statusCode}] ${name} (${path})`);

                if (res.statusCode >= 400) {
                    console.error(`    Erro: ${data.substring(0, 100)}...`);
                }

                // Tenta fazer parse do JSON para garantir que é válido
                try {
                    const json = JSON.parse(data);
                    if (Array.isArray(json)) {
                        console.log(`    Resultados: ${json.length} itens encontrados.`);
                    } else if (typeof json === 'object') {
                        console.log(`    Resposta válida (Objeto).`);
                    }
                } catch (e) {
                    console.warn(`    ⚠️ Resposta não é JSON válido.`);
                }
                resolve(res.statusCode);
            });
        }).on('error', (err) => {
            console.error(`❌ Erro de conexão em ${name}: ${err.message}`);
            resolve(500);
        });
    });
}

async function runTests() {
    console.log("🏥 Iniciando Verificação Rápida da API MedCura...\n");

    // Lista de endpoints cruciais
    await checkEndpoint('Status do Sistema', '/');
    await checkEndpoint('Consultas', '/consultations');
    await checkEndpoint('Pacientes', '/patients');
    await checkEndpoint('Dashboard Stats', '/dashboard/stats');

    console.log("\n🏁 Verificação concluída.");
}

runTests();
