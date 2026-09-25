import crypto from 'node:crypto';
import { config } from '../../config';
const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12;
const TAG_LENGTH = 16;
export class EncryptionService {
    static getKey() {
        let key = config.HR_ENCRYPTION_KEY;
        if (key.length === 64) {
            return Buffer.from(key, 'hex');
        }
        // Hash to 32 bytes if not exact hex
        return crypto.createHash('sha256').update(key).digest();
    }
    static encrypt(plainText) {
        if (!plainText)
            return null;
        const key = this.getKey();
        const iv = crypto.randomBytes(IV_LENGTH);
        const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
        const encrypted = Buffer.concat([cipher.update(plainText, 'utf8'), cipher.final()]);
        const tag = cipher.getAuthTag();
        // Combined format: iv:tag:encrypted (hex)
        return `${iv.toString('hex')}:${tag.toString('hex')}:${encrypted.toString('hex')}`;
    }
    static decrypt(encryptedText) {
        if (!encryptedText)
            return null;
        try {
            const parts = encryptedText.split(':');
            if (parts.length !== 3)
                return null;
            const [ivHex, tagHex, contentHex] = parts;
            const key = this.getKey();
            const iv = Buffer.from(ivHex, 'hex');
            const tag = Buffer.from(tagHex, 'hex');
            const content = Buffer.from(contentHex, 'hex');
            const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
            decipher.setAuthTag(tag);
            const decrypted = Buffer.concat([decipher.update(content), decipher.final()]);
            return decrypted.toString('utf8');
        }
        catch {
            return null;
        }
    }
}
