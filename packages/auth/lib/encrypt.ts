import crypto from 'crypto';

// Encrypt data using AES-256-CBC
export const encrypt = (data: string, key: string) => {
  const iv = crypto.randomBytes(16); // Generate a random IV
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key, 'hex'), iv);
  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + encrypted; // Prepend IV to ciphertext
}