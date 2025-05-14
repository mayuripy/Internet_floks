import { Request, Response, NextFunction } from "express";
import { decryptSession } from "../utils";

interface UserPayload {
  id: string;
}

declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload;
    }
  }
}

/**
 * Middleware to set the current user payload from decrypted session JWT.
 * @param {Request} req - The request object potentially containing session JWT.
 * @param {Response} res - The response object (not used in this middleware).
 * @param {NextFunction} next - The next middleware function in the chain.
 * @returns {void} - Sets `req.currentUser` if session JWT is valid; otherwise proceeds to the next middleware.
 * @description
 *   - Checks if `req.session.jwt` exists to determine if there is a session.
 *   - Decrypts `req.session.jwt` to obtain user payload if session JWT exists.
 *   - Sets `req.currentUser` with the decrypted user payload.
 *   - If an error occurs during decryption or if `req.session.jwt` does not exist, proceeds to the next middleware.
 */
export const currentUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.session?.jwt) {
    return next();
  }

  try {
    const payload = decryptSession(req.session.jwt);
    req.currentUser = {
      id: payload,
    };
  } catch (err) {}

  next();
};
