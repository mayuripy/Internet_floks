import { Request, Response, NextFunction } from "express";
import { CustomError } from "../errors";


/**
 * Global error handler middleware for handling custom and generic errors.
 * @param {Error} err - The error object thrown or passed to the middleware.
 * @param {Request} req - The request object associated with the error.
 * @param {Response} res - The response object used to send error responses.
 * @param {NextFunction} next - The next middleware function in the chain.
 * @returns {Response} - JSON response indicating the error status and details.
 * @description
 *   - Checks if the error is an instance of CustomError.
 *   - Logs the error to the console for debugging purposes.
 *   - If the error is a CustomError, responds with a 400 status code and serialized error details.
 *   - If the error is not a CustomError, responds with a 400 status code and the error message.
 */
export const globalErrorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof CustomError) {
    console.log(err);
    return res
      .status(400)
      .json({ status: false, errors: err.serializeErrors() });
  }
  return res.status(400).json({ status: false, message: err.message });
};
