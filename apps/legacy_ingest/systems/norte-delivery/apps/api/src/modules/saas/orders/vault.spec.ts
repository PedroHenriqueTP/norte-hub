import { VaultCrypto } from '../../../../../../../../../../packages/crypto/vault';

describe('VaultCrypto Security Audit Tests', () => {
  const originalEnvKey = process.env.ENCRYPTION_KEY;
  const validSecret = 'a-secure-and-long-encryption-key-for-testing-purposes-only-32'; // 61 chars

  beforeEach(() => {
    // Reset process.env before each test to ensure a clean state
    delete process.env.ENCRYPTION_KEY;
  });

  afterAll(() => {
    // Restore original key
    process.env.ENCRYPTION_KEY = originalEnvKey;
  });

  describe('Success Cases', () => {
    it('should successfully encrypt and decrypt with a valid secret passed as argument', () => {
      const plaintext = 'SaaS Enterprise Credential 2026';
      const payload = VaultCrypto.encrypt(plaintext, validSecret);

      expect(payload.encryptedKey).toBeDefined();
      expect(payload.iv).toBeDefined();
      expect(typeof payload.encryptedKey).toBe('string');
      expect(typeof payload.iv).toBe('string');

      const decrypted = VaultCrypto.decrypt(payload.encryptedKey, payload.iv, validSecret);
      expect(decrypted).toBe(plaintext);
    });

    it('should successfully encrypt and decrypt using process.env.ENCRYPTION_KEY fallback', () => {
      process.env.ENCRYPTION_KEY = validSecret;
      const plaintext = 'Secret database connection string';
      const payload = VaultCrypto.encrypt(plaintext);

      const decrypted = VaultCrypto.decrypt(payload.encryptedKey, payload.iv);
      expect(decrypted).toBe(plaintext);
    });

    it('should generate a unique IV for each encryption operation', () => {
      const plaintext = 'Identical input text';
      const payload1 = VaultCrypto.encrypt(plaintext, validSecret);
      const payload2 = VaultCrypto.encrypt(plaintext, validSecret);

      expect(payload1.iv).not.toBe(payload2.iv);
      expect(payload1.encryptedKey).not.toBe(payload2.encryptedKey);
    });
  });

  describe('Failure and Validation Cases', () => {
    it('should throw an error if no secret is provided and env variable is missing', () => {
      expect(() => {
        VaultCrypto.encrypt('secret text');
      }).toThrow('VaultCrypto Error: Encryption secret is not provided and process.env.ENCRYPTION_KEY is not defined.');

      expect(() => {
        VaultCrypto.decrypt('encryptedKey', 'iv');
      }).toThrow('VaultCrypto Error: Encryption secret is not provided and process.env.ENCRYPTION_KEY is not defined.');
    });

    it('should throw an error if the secret key is too short', () => {
      const shortSecret = 'short-secret-key-123'; // 20 chars

      expect(() => {
        VaultCrypto.encrypt('secret text', shortSecret);
      }).toThrow('VaultCrypto Error: Encryption secret must be at least 32 characters long.');

      expect(() => {
        VaultCrypto.decrypt('encryptedKey', 'iv', shortSecret);
      }).toThrow('VaultCrypto Error: Encryption secret must be at least 32 characters long.');
    });

    it('should throw an error if the secret key is a known weak fallback', () => {
      const weakFallback = 'global-system-fallback-secret';

      expect(() => {
        VaultCrypto.encrypt('secret text', weakFallback);
      }).toThrow('VaultCrypto Error: Insecure fallback or weak hardcoded key is not allowed for cryptographic operations.');

      expect(() => {
        VaultCrypto.decrypt('encryptedKey', 'iv', weakFallback);
      }).toThrow('VaultCrypto Error: Insecure fallback or weak hardcoded key is not allowed for cryptographic operations.');
    });
  });
});
