const fs = require('fs');
const path = require('path');

// --- CONFIGURAÇÃO ---
const API_ROOT = path.join('apps', 'api', 'src');

console.log("🏭 Iniciando SpecFactory: Gerador de Testes Unitários...");

// Função para converter "FinanceController" -> "finance"
function toKebabCase(str) {
    return str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();
}

function generateSpecContent(controllerName, serviceName, importPath) {
    // Ajuste do caminho de importação para ser relativo a partir do arquivo .spec.ts (que está na mesma pasta)
    const baseName = path.basename(importPath, '.ts');
    const serviceBaseName = baseName.replace('.controller', '.service');

    return `import { Test, TestingModule } from '@nestjs/testing';
import { ${controllerName} } from './${baseName}';
import { ${serviceName} } from './${serviceBaseName}';

describe('${controllerName}', () => {
  let controller: ${controllerName};
  let service: ${serviceName};

  const mock${serviceName} = {
    create: jest.fn().mockResolvedValue({ id: 'mock_id', status: 'success' }),
    findAll: jest.fn().mockResolvedValue([{ id: 'mock_id', name: 'Test Item' }]),
    findOne: jest.fn().mockResolvedValue({ id: 'mock_id', name: 'Test Item' }),
    update: jest.fn().mockResolvedValue({ id: 'mock_id', updated: true }),
    remove: jest.fn().mockResolvedValue({ deleted: true }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [${controllerName}],
      providers: [
        {
          provide: ${serviceName},
          useValue: mock${serviceName},
        },
      ],
    }).compile();

    controller = module.get<${controllerName}>(${controllerName});
    service = module.get<${serviceName}>(${serviceName});
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // Teste Básico de Criação (Gerado pelo SpecFactory)
  describe('create', () => {
    it('should call service.create', async () => {
      const dto = { name: 'Test Data', value: 100 }; // Seed genérico
      await controller.create(dto as any); // Cast para any apenas para o scaffold
      expect(service.create).toHaveBeenCalled();
    });
  });

  // Teste Básico de Leitura
  describe('findAll', () => {
    it('should return an array', async () => {
      const result = await controller.findAll();
      expect(result).toEqual([{ id: 'mock_id', name: 'Test Item' }]);
      expect(service.findAll).toHaveBeenCalled();
    });
  });
});
`;
}

function walkAndGenerate(dir) {
    const files = fs.readdirSync(dir);

    for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            walkAndGenerate(filePath);
        } else if (file.endsWith('.controller.ts')) {
            // Verifica se já existe o .spec.ts
            const specPath = filePath.replace('.controller.ts', '.controller.spec.ts');

            if (!fs.existsSync(specPath)) {
                console.log(`✨ Criando teste para: ${file}`);

                const content = fs.readFileSync(filePath, 'utf8');

                // Extrai nome da Classe (Ex: class FinanceController)
                const classMatch = content.match(/export class (\w+)/);
                if (classMatch) {
                    const controllerName = classMatch[1];
                    // Tenta adivinhar o Service (Ex: FinanceController -> FinanceService)
                    const serviceName = controllerName.replace('Controller', 'Service');

                    const specContent = generateSpecContent(controllerName, serviceName, filePath);

                    // Escreve o arquivo
                    try {
                        fs.writeFileSync(specPath, specContent);
                        console.log(`   ✅ Arquivo gerado: ${path.basename(specPath)}`);
                    } catch (e) {
                        console.error(`   ❌ Erro ao escrever spec: ${e.message}`);
                    }
                }
            } else {
                // console.log(`⏭️  Teste já existe para: ${file}`);
            }
        }
    }
}

// Execução
try {
    if (fs.existsSync(API_ROOT)) {
        walkAndGenerate(API_ROOT);
        console.log("\n🏁 SpecFactory finalizado! Todos os controllers agora têm parcerias de teste.");
    } else {
        console.error("❌ Diretório apps/api/src não encontrado.");
    }
} catch (error) {
    console.error("🔥 Erro fatal:", error);
}
