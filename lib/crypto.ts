import crypto from 'crypto';

const envKey = process.env.ENCRYPTION_KEY;
if (!envKey) {
  throw new Error("ENCRYPTION_KEY environment variable is not defined");
}

const key = /^[0-9a-fA-F]{64}$/.test(envKey)
  ? Buffer.from(envKey, 'hex')
  : crypto.createHash('sha256').update(envKey).digest();

export function encrypt(text: string): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  const encrypted = Buffer.concat([cipher.update(text, 'utf-8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `${iv.toString('hex')}:${tag.toString('hex')}:${encrypted.toString('hex')}`;
}

export function decrypt(encrypted: string): string {
  const [ivHex, tagHex, dataHex] = encrypted.split(':');
  const iv = Buffer.from(ivHex, 'hex');
  const tag = Buffer.from(tagHex, 'hex');
  const data = Buffer.from(dataHex, 'hex');
  const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
  decipher.setAuthTag(tag);
  return decipher.update(data, undefined, 'utf-8') + decipher.final('utf-8');
}
