import * as fs from 'fs';
import * as path from 'path';
import { EncryptionService } from './encryption.service';
import { PrismaClient } from '@prisma/client';

async function main() {
  const encryptionService = new EncryptionService();
  const prisma = new PrismaClient();

  const filePath = 'C:\\Users\\ACER\\Desktop\\NORTE_ECOSYSTEM\\archives\\test_secret.txt';
  const uploadDir = 'C:\\Users\\ACER\\Desktop\\NORTE_ECOSYSTEM\\systems\\norte-delivery\\apps\\api\\uploads\\archives\\PERSONAL_CORE';

  console.log(`[VAULT_SYSTEM]: Gerando IV para test_secret.txt...`);
  
  const content = fs.readFileSync(filePath);
  const { iv, authTag, encryptedData } = encryptionService.encrypt(content);

  console.log(`[VAULT_SYSTEM]: Criptografia AES-256-GCM aplicada.`);

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const encFilePath = path.join(uploadDir, 'test_secret.enc');
  fs.writeFileSync(encFilePath, encryptedData);

  console.log(`[VAULT_SYSTEM]: Arquivo movido para /uploads/archives/PERSONAL_CORE/`);

  const node = await prisma.knowledgeNode.create({
    data: {
      title: 'test_secret.txt',
      content: `IV: ${iv} | Tag: ${authTag}`,
      category: 'Archives',
      tags: ['test', 'encrypted'],
    },
  });

  console.log(`[VAULT_SYSTEM]: Registro criado no banco de dados (ID: ${node.id}).`);
  
  await prisma.$disconnect();
}

main().catch(console.error);
