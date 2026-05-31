import sharp from 'sharp';
import fs from 'fs';

async function extractStyleMetadata(imagePath: string) {
  const metadata = await sharp(imagePath).metadata();
  const dominant = await sharp(imagePath).stats();
  
  const styleDNA = {
    resolution: `${metadata.width}x${metadata.height}`,
    dominantColor: dominant.channels[0].mean, // Simplificado para fins de exemplo
    timestamp: new Date().toISOString()
  };

  fs.mkdirSync('.ai_governance', { recursive: true });
  fs.writeFileSync('.ai_governance/last_kv_style.json', JSON.stringify(styleDNA, null, 2));
  console.log('Metadados de design extraídos e salvos.');
}

// Uso: ts-node extract-style.ts path/to/kv.jpg
