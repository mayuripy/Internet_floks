import { FieldValidationError, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";
import {  ParametricError } from "../errors";
import { IParametricError } from "../interfaces";
import { KeyMap } from "../types";
import { renameKeys } from "../utils";



const keyMap: KeyMap<FieldValidationError> = {
  msg: "message",
  path: "param",
};


/**
 * Middleware to validate the request body and handle validation errors.
 * @param {Request} req - The request object containing data to be validated.
 * @param {Response} res - The response object (not directly used in this middleware).
 * @param {NextFunction} next - The next middleware function in the chain.
 * @throws {ParametricError} - Throws a ParametricError if validation errors are found in the request.
 * @returns {void} - Proceeds to the next middleware if request is valid; otherwise, throws a ParametricError.
 * @description
 *   - Checks for validation errors using validationResult(req).
 *   - Filters out errors with the message "Invalid value".
 *   - Maps and renames keys of validation errors using keyMap.
 *   - Throws a ParametricError containing the mapped validation errors if any validation errors exist.
 */
export function validateRequest(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    let errorsArr = errors
      .array()
      .filter((err) => err.msg.toLowerCase() !== "invalid value")
      .map((err) => renameKeys(err, keyMap));
    throw new ParametricError(errorsArr as IParametricError[]);
  }
  next();
}
