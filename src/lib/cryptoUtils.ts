import crypto from 'crypto';

// Ensure these values are correct hexadecimal strings
const ENCRYPTION_KEY = Buffer.from(process.env.ENCRYPTION_KEY as string, 'hex');
const ENCRYPTION_IV = Buffer.from(process.env.ENCRYPTION_IV as string, 'hex');

if (ENCRYPTION_KEY.length !== 32) {
  throw new Error('ENCRYPTION_KEY must be 32 bytes (64 hex characters)');
}
if (ENCRYPTION_IV.length !== 16) {
  throw new Error('ENCRYPTION_IV must be 16 bytes (32 hex characters)');
}

export function encrypt(text: string): string {
  try {
    const cipher = crypto.createCipheriv('aes-256-cbc', ENCRYPTION_KEY, ENCRYPTION_IV);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
  } catch (error) {
    console.error('Error in encryption:', error);
    throw error;
  }
}

export function decrypt(encryptedText: string): string {
  try {
    const decipher = crypto.createDecipheriv('aes-256-cbc', ENCRYPTION_KEY, ENCRYPTION_IV);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (error) {
    console.error('Error in decryption:', error);
    throw error;
  }
}
