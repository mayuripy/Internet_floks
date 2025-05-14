import jwt, { JwtPayload } from "jsonwebtoken";
import { UserPayloadForJwt } from "../interfaces";
import { JWT_SECRET } from "../config";
import { ParametricError } from "../errors";


/**
 * Encrypts a session payload into a JWT token using the JWT_SECRET.
 * @param {UserPayloadForJwt} payload - The payload to encrypt into the JWT token.
 * @returns {string} - The encrypted JWT token.
 */
export const encryptSession = (payload: UserPayloadForJwt): string => {
	const jwtToken = jwt.sign(payload, JWT_SECRET);
	return jwtToken;
};


/**
 * Decrypts a JWT token into the original user ID using the JWT_SECRET.
 * @param {string} jwtToken - The JWT token to decrypt.
 * @returns {string} - The decrypted user ID extracted from the JWT token.
 * @throws {ParametricError} - Throws a ParametricError if the JWT token is invalid or expired.
 */
export const decryptSession = (jwtToken: string): string => {
	try {
		const { id } = jwt.verify(jwtToken, JWT_SECRET) as JwtPayload;
		return id;	
	} catch (error) {
		throw new ParametricError([{message: "User not found.", param: "user", code: "RESOURCE_NOT_FOUND"}])
	}
};
