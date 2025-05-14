import { ValidationChain, body } from "express-validator";
import { Request, Response, NextFunction } from "express";


/**
 * Validates request body parameters for creating a new role.
 * @param {Request} req - The request object containing role information.
 * @param {Response} res - The response object used to send validation errors.
 * @param {NextFunction} next - The next middleware function in the chain.
 * @returns {Promise<void>} - Resolves if validation succeeds, otherwise passes validation errors to the next middleware.
 * @description
 *   - Validates 'name' field in the request body for creating a role.
 *   - Ensures 'name' is a string of at least 2 characters.
 *   - Passes control to the next middleware if validation succeeds.
 */
export const createRoleVal = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const validationRules: ValidationChain[] = [
    body("name")
      .exists()
      .isString()
      .isLength({ min: 2 })
      .withMessage("Name should be at least 2 characters."),
  ];
  Promise.all(validationRules.map((rule) => rule.run(req))).then(() => {
    next();
  });
};
