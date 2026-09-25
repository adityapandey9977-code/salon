import bcrypt from 'bcryptjs';
export class PasswordService {
    static SALT_ROUNDS = 12;
    static async hash(password) {
        return bcrypt.hash(password, PasswordService.SALT_ROUNDS);
    }
    static async verify(password, hash) {
        return bcrypt.compare(password, hash);
    }
}
