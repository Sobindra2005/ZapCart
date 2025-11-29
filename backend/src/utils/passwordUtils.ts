import bcrypt from 'bcryptjs';

/**
 * Number of salt rounds for bcrypt hashing
 */
const SALT_ROUNDS = 12;

/**
 * Hash a plain text password
 * @param password - Plain text password
 * @returns Hashed password
 */
export const hashPassword = async (password: string): Promise<string> => {
    return await bcrypt.hash(password, SALT_ROUNDS);
};

/**
 * Compare a plain text password with a hashed password
 * @param plainPassword - Plain text password
 * @param hashedPassword - Hashed password from database
 * @returns True if passwords match, false otherwise
 */
export const comparePassword = async (
    plainPassword: string,
    hashedPassword: string
): Promise<boolean> => {
    return await bcrypt.compare(plainPassword, hashedPassword);
};
