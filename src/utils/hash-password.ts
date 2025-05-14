import bcrypt from "bcrypt";
import { ParametricError } from "../errors";


/**
 * Hashes a plaintext password using bcrypt hashing algorithm.
 * @param {string} password - The plaintext password to hash.
 * @returns {Promise<string>} - A promise that resolves to the hashed password.
 * @throws {Error} - Throws a ParametricError if an error occurs during hashing.
 */
export const hashPassword = async (password: string): Promise<string> => {
	const saltRounds = 10;
	const hashedPassword = await bcrypt.hash(password, saltRounds);
	return hashedPassword;
};



/**
 * Compares an input password with a hashed password using bcrypt.
 * @param {string} inputPassword - The plaintext password to compare.
 * @param {string} hashedPassword - The hashed password to compare against.
 * @returns {Promise<boolean>} - A promise that resolves to true if passwords match, false otherwise.
 * @throws {ParametricError} - Throws a ParametricError if an error occurs during comparison.
 */
export const comparePasswords = async (
	inputPassword: string,
	hashedPassword: string
): Promise<boolean> => {
	try {
		const match = await bcrypt.compare(inputPassword, hashedPassword);
		return match;
	} catch (error) {
		throw new ParametricError([{param: "password", message: "Password does not match.", code: "INVALID_INPUT"}])
	}
};