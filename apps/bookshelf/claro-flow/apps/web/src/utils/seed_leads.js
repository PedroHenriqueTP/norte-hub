const fs = require('fs');
const path = require('path');

const LEADS_FILE_PATH = path.join(__dirname, '..', 'data', 'leads_fallback.json');

const EVENTOS = ['GP_F1_INTERLAGOS', 'BIENAL_DO_LIVRO', 'SP_OPEN_TENIS'];
const INTERESSES = [
  '5G_VELOCIDADE', 'CLARO_MIGRACAO', 'STREAMING_TV', 
  'BANDA_LARGA', 'LIVROS_SKEELO', 'TORNEIO_TENIS'
];
const DEVICE_TYPES = ['mobile', 'tablet', 'desktop'];
const BROWSERS = ['chrome', 'safari', 'firefox', 'edge'];
const STATUS_BRINDE = ['DISPONIVEL', 'RESGATADO', 'ESGOTADO'];
const MOTIVOS_TRANSBORDO = ['DUVIDA_BRINDE', 'SUPORTE_TECNICO', 'COMERCIAL'];
const SETORES = ['ARENA_5G', 'MOLDURA_FOTO', 'LOUNGE', 'BALCAO_BRINDES'];

const NOMES = [
  'Lucas Silva', 'Mariana Santos', 'Rodrigo Oliveira', 'Beatriz Costa',
  'Gustavo Lima', 'Aline Pereira', 'Thiago Rodrigues', 'Camila Almeida',
  'Bruno Carvalho', 'Larissa Ferreira', 'Felipe Gomes', 'Amanda Rocha',
  'Rafael Souza', 'Juliana Mendes', 'Daniel Alves', 'Sofia Martins',
  'Leonardo Barbosa', 'Isabela Ribeiro', 'Mateus Cardoso', 'Gabriela Nunes',
  'Vinicius Teixeira', 'Leticia Castro', 'Guilherme Silva', 'Fernanda Lima',
  'Alexandre Santos', 'Patricia Costa', 'Diego Ramos', 'Tatiana Araujo',
  'Eduardo Vieira', 'Vanessa Dias', 'Arthur Melo', 'Carolina Rocha'
];

const SOBRENOMES = [
  'Silva', 'Santos', 'Oliveira', 'Souza', 'Rodrigues', 'Ferreira',
  'Alves', 'Pereira', 'Lima', 'Gomes', 'Costa', 'Ribeiro', 'Martins',
  'Carvalho', 'Almeida', 'Lopes', 'Soares', 'Teixeira', 'Barbosa',
  'Vieira', 'Rocha', 'Nascimento', 'Moreira', 'Mendes', 'Cardoso'
];

function generateCPF() {
  let cpf = '';
  for (let i = 0; i < 11; i++) {
    cpf += Math.floor(Math.random() * 10);
  }
  return cpf;
}

function generatePhone() {
  let phone = '119';
  for (let i = 0; i < 8; i++) {
    phone += Math.floor(Math.random() * 10);
  }
  return phone;
}

function randomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateLeads() {
  const leads = [];
  
  // Keep the first legacy lead to preserve context
  const legacyLead = {
    id: "ot7bgl0rw-opglqreqe-5bsal1gx0",
    nome: "PEDRO HENRIQUE TOZZI PAZIN",
    email: "ehanorte@gmail.com",
    telefone: "11973874897",
    cpf: "55081372897",
    evento: "GP_F1_INTERLAGOS",
    interesses: ["5G_VELOCIDADE", "CLARO_MIGRACAO"],
    deviceType: "desktop",
    browser: "chrome",
    gameScore: 0,
    statusBrinde: "DISPONIVEL",
    chatbotStatus: null,
    setorEstande: null,
    motivoTransbordo: null,
    createdAt: "2026-05-26T02:44:26.342Z",
    updatedAt: "2026-05-26T02:44:26.343Z",
    codigoBrinde: "MXIMBB",
    gamePlayedAt: "2026-05-26T02:44:26.343Z"
  };
  leads.push(legacyLead);

  // Generate 150 leads (50 for each event type)
  for (let i = 0; i < 3; i++) {
    const event = EVENTOS[i];
    for (let j = 0; j < 50; j++) {
      const name = randomElement(NOMES).split(' ')[0] + ' ' + randomElement(SOBRENOMES);
      const email = name.toLowerCase().replace(/ /g, '.') + Math.floor(Math.random() * 99) + '@claro.com.br';
      
      const chatbotStatus = Math.random() > 0.4 ? (Math.random() > 0.3 ? 'CONCLUIDO' : 'TRANSBORDADO') : 'INICIADO';
      const isTransbordado = chatbotStatus === 'TRANSBORDADO';
      
      const score = Math.floor(Math.random() * 150);
      const brindeStatus = score >= 50 ? (Math.random() > 0.3 ? 'RESGATADO' : 'DISPONIVEL') : 'DISPONIVEL';

      leads.push({
        id: Math.random().toString(36).substring(2, 11) + '-' + Math.random().toString(36).substring(2, 11),
        nome: name.toUpperCase(),
        email: email,
        telefone: generatePhone(),
        cpf: generateCPF(),
        evento: event,
        interesses: [randomElement(INTERESSES), randomElement(INTERESSES)],
        deviceType: randomElement(DEVICE_TYPES),
        browser: randomElement(BROWSERS),
        gameScore: score,
        statusBrinde: brindeStatus,
        chatbotStatus: chatbotStatus,
        setorEstande: Math.random() > 0.3 ? randomElement(SETORES) : null,
        motivoTransbordo: isTransbordado ? randomElement(MOTIVOS_TRANSBORDO) : null,
        createdAt: new Date(Date.now() - Math.random() * 86400000 * 2).toISOString(),
        updatedAt: new Date().toISOString(),
        codigoBrinde: Math.random().toString(36).substring(2, 8).toUpperCase(),
        gamePlayedAt: new Date(Date.now() - Math.random() * 86400000).toISOString()
      });
    }
  }

  return leads;
}

function run() {
  console.log('[JARVIS-ANALYST] Seeding leads fallback database...');
  const data = generateLeads();
  const dir = path.dirname(LEADS_FILE_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(LEADS_FILE_PATH, JSON.stringify(data, null, 2), 'utf-8');
  console.log(`[JARVIS-ANALYST] Seeded ${data.length} leads to leads_fallback.json successfully.`);
}

run();
