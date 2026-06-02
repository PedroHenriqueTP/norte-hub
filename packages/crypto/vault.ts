import * as crypto from 'crypto';

export interface EncryptedPayload {
  encryptedKey: string;
  iv: string;
}

export class VaultCrypto {
  private static readonly ALGORITHM = 'aes-256-gcm';
  private static readonly IV_LENGTH = 12;
  private static readonly AUTH_TAG_LENGTH = 16;

  private static readonly WEAK_FALLBACKS = new Set([
    'global-system-fallback-secret',
    '12345678901234567890123456789012',
    '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef'
  ]);

  private static getValidatedSecret(secret?: string): string {
    const activeSecret = secret || process.env.ENCRYPTION_KEY;

    if (!activeSecret) {
      throw new Error(
        'VaultCrypto Error: Encryption secret is not provided and process.env.ENCRYPTION_KEY is not defined.'
      );
    }

    if (this.WEAK_FALLBACKS.has(activeSecret)) {
      throw new Error(
        'VaultCrypto Error: Insecure fallback or weak hardcoded key is not allowed for cryptographic operations.'
      );
    }

    if (activeSecret.length < 32) {
      throw new Error(
        `VaultCrypto Error: Encryption secret must be at least 32 characters long. Provided secret length: ${activeSecret.length}`
      );
    }

    return activeSecret;
  }

  private static deriveKey(secret: string): Buffer {
    return crypto.createHash('sha256').update(secret).digest();
  }

  public static encrypt(text: string, secret?: string): EncryptedPayload {
    const activeSecret = this.getValidatedSecret(secret);
    const iv = crypto.randomBytes(this.IV_LENGTH);
    const key = this.deriveKey(activeSecret);
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

  public static decrypt(encryptedKey: string, iv: string, secret?: string): string {
    const activeSecret = this.getValidatedSecret(secret);
    const key = this.deriveKey(activeSecret);
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
