import { Request, Response, NextFunction } from "express";
import { NonParametricError } from "../errors";


/**
 * Middleware to check if a user is logged in.
 * @param {Request} req - The request object containing currentUser information.
 * @param {Response} res - The response object (not directly used in this middleware).
 * @param {NextFunction} next - The next middleware function in the chain.
 * @returns {void} - Proceeds to the next middleware if user is logged in; otherwise, passes error to the next middleware.
 * @description
 *   - Throws a NonParametricError if req.currentUser is falsy, indicating the user is not logged in.
 */
export const isLoggedIn = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
        if(!req.currentUser){
            throw new NonParametricError([{message: "You are not authorized to perform this action.", code: "NOT_ALLOWED_ACCESS"}]);
        }
        next();
    } catch (error) {
        next(error);
    }
}