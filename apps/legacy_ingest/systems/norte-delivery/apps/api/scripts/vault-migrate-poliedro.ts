import * as fs from 'fs';
import * as path from 'path';
import { EncryptionService } from './encryption.service';
import { PrismaClient } from '@prisma/client';

async function main() {
  const encryptionService = new EncryptionService();
  const prisma = new PrismaClient();

  const sourceDir = 'C:\\Users\\ACER\\Desktop\\NORTE_ECOSYSTEM\\archives\\Aulas Poliedro';
  const uploadDir = 'C:\\Users\\ACER\\Desktop\\NORTE_ECOSYSTEM\\systems\\norte-delivery\\apps\\api\\uploads\\archives\\Aulas_Poliedro';

  if (!fs.existsSync(sourceDir)) {
    console.error(`Source dir not found: ${sourceDir}`);
    return;
  }

  const files = fs.readdirSync(sourceDir);
  const pdfFiles = files.filter(f => f.endsWith('.pdf'));

  console.log(`[VAULT_SYSTEM]: Encontrados ${pdfFiles.length} PDFs para migração.`);

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  for (const file of pdfFiles) {
    const filePath = path.join(sourceDir, file);
    console.log(`[VAULT_SYSTEM]: Processando ${file}...`);
    
    const content = fs.readFileSync(filePath);
    const { iv, authTag, encryptedData } = encryptionService.encrypt(content);

    const encFilePath = path.join(uploadDir, `${file}.enc`);
    fs.writeFileSync(encFilePath, encryptedData);

    const node = await prisma.knowledgeNode.create({
      data: {
        title: file,
        content: `IV: ${iv} | Tag: ${authTag}`,
        category: 'Aulas Poliedro',
        tags: ['education', 'encrypted'],
      },
    });

    console.log(`[VAULT_SYSTEM]: ${file} criptografado e salvo (ID: ${node.id}).`);
  }

  await prisma.$disconnect();
}

main().catch(console.error);
