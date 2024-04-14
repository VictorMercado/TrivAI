import crypto from 'crypto';

export const decrypt = (encryptedData: string, key: string) => {
  const iv = Buffer.from(encryptedData.slice(0, 32), 'hex'); // Extract IV from encrypted data
  const ciphertext = encryptedData.slice(32); // Extract ciphertext
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key, 'hex'), iv);
  let decrypted = decipher.update(ciphertext, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}