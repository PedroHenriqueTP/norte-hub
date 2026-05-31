import * as crypto from 'crypto';

export interface EncryptedPayload {
  encryptedKey: string;
  iv: string;
}

export class VaultCrypto {
  private static readonly ALGORITHM = 'aes-256-gcm';
  private static readonly IV_LENGTH = 12;
  private static readonly AUTH_TAG_LENGTH = 16;

  private static deriveKey(secret: string): Buffer {
    return crypto.createHash('sha256').update(secret).digest();
  }

  public static encrypt(text: string, secret: string): EncryptedPayload {
    const iv = crypto.randomBytes(this.IV_LENGTH);
    const key = this.deriveKey(secret);
    const cipher = crypto.createCipheriv(this.ALGORITHM, key, iv);

    const encrypted = Buffer.concat([
      cipher.update(text, 'utf8'),
      cipher.final()
    ]);

    const authTag = cipher.getAuthTag();

    return {
      encryptedKey: Buffer.concat([encrypted, authTag]).toString('hex'),
      iv: iv.toString('hex'),
    };
  }

  public static decrypt(encryptedKey: string, iv: string, secret: string): string {
    const key = this.deriveKey(secret);
    const ivBuffer = Buffer.from(iv, 'hex');
    const dataBuffer = Buffer.from(encryptedKey, 'hex');

    const encryptedData = dataBuffer.subarray(0, dataBuffer.length - this.AUTH_TAG_LENGTH);
    const authTag = dataBuffer.subarray(dataBuffer.length - this.AUTH_TAG_LENGTH);

    const decipher = crypto.createDecipheriv(this.ALGORITHM, key, ivBuffer);
    decipher.setAuthTag(authTag);

    const decrypted = Buffer.concat([
      decipher.update(encryptedData),
      decipher.final()
    ]);

    return decrypted.toString('utf8');
  }
}
