import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class EncryptionService {
  private readonly algorithm = 'aes-256-gcm';
  private readonly key = Buffer.from(process.env.ENCRYPTION_KEY || '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef', 'hex');

  encrypt(buffer: Buffer): { iv: string; authTag: string; encryptedData: Buffer } {
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv(this.algorithm, this.key, iv);
    
    const encryptedData = Buffer.concat([cipher.update(buffer), cipher.final()]);
    const authTag = cipher.getAuthTag().toString('hex');
    
    return {
      iv: iv.toString('hex'),
      authTag,
      encryptedData,
    };
  }

  decrypt(encryptedData: Buffer, iv: string, authTag: string): Buffer {
    const decipher = crypto.createDecipheriv(this.algorithm, this.key, Buffer.from(iv, 'hex'));
    decipher.setAuthTag(Buffer.from(authTag, 'hex'));
    
    const decrypted = Buffer.concat([decipher.update(encryptedData), decipher.final()]);
    return decrypted;
  }

  decryptStream(encryptedStream: NodeJS.ReadableStream, iv: string, authTag: string): NodeJS.ReadableStream {
    const decipher = crypto.createDecipheriv(this.algorithm, this.key, Buffer.from(iv, 'hex'));
    decipher.setAuthTag(Buffer.from(authTag, 'hex'));
    
    return encryptedStream.pipe(decipher);
  }
}
