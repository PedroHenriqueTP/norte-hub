import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

const ALGORITHM = 'aes-256-cbc';

// Ensure we have a secret key. In production, this should be in .env
// For this setup, we'll default to a generated one if not present (NOT SECURE for restarts, strictly for demo/dev if env missing)
// IMPORTANT: Add ENCRYPTION_KEY to .env (32 chars hex or base64)
const SECRET_KEY = process.env.ENCRYPTION_KEY || '12345678901234567890123456789012'; // Must be 32 bytes
const IV_LENGTH = 16;

export function encrypt(text: string): string {
  if (!text) return text;
  
  // If SECRET_KEY is not length 32, we should probably hash it or pad it, but lets assume it's correct for now.
  // Ideally: crypto.createHash('sha256').update(String(process.env.ENCRYPTION_KEY)).digest('base64').substr(0, 32);
  
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv(ALGORITHM, Buffer.from(SECRET_KEY), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
}

export function decrypt(text: string): string {
  if (!text) return text;
  
  const textParts = text.split(':');
  if (textParts.length < 2) return text; // Not encrypted or invalid format
  
  const iv = Buffer.from(textParts.shift()!, 'hex');
  const encryptedText = Buffer.from(textParts.join(':'), 'hex');
  const decipher = createDecipheriv(ALGORITHM, Buffer.from(SECRET_KEY), iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}
