import {
  ValidationChain,
  body,
  param,
} from "express-validator";
import { Request, Response, NextFunction } from "express";


/**
 * Validates request body parameters for creating a new community.
 * @param {Request} req - The request object containing community information.
 * @param {Response} res - The response object used to send validation errors.
 * @param {NextFunction} next - The next middleware function in the chain.
 * @returns {Promise<void>} - Resolves if validation succeeds, otherwise passes validation errors to the next middleware.
 * @description
 *   - Validates 'name' field in the request body.
 *   - Ensures 'name' is a string of at least 2 characters.
 *   - Passes control to the next middleware if validation succeeds.
 */
export const createCommunityVal = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const validationRules: ValidationChain[] = [
    body("name")
      .exists()
      .isString()
      .isLength({ min: 2 })
      .withMessage("Name must be at least 2 characters long."),
  ];
  await Promise.all(validationRules.map((rule) => rule.run(req)));
  next();
};



/**
 * Validates request parameters for retrieving members of a community.
 * @param {Request} req - The request object containing community ID.
 * @param {Response} res - The response object used to send validation errors.
 * @param {NextFunction} next - The next middleware function in the chain.
 * @returns {Promise<void>} - Resolves if validation succeeds, otherwise passes validation errors to the next middleware.
 * @description
 *   - Validates 'id' parameter in the request for retrieving members of a community.
 *   - Ensures 'id' is a non-falsy string value.
 *   - Passes control to the next middleware if validation succeeds.
 */
export const getAllMembersVal = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const validationRules: ValidationChain[] = [
    param("id")
      .exists({ values: "falsy" })
      .isString()
      .withMessage("Please specify community id."),
  ];
  Promise.all(validationRules.map((rule) => rule.run(req))).then(() => {
    next();
  });
};
