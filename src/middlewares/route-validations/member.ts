import { ValidationChain, body, param } from "express-validator";
import { Request, Response, NextFunction } from "express";



/**
 * Validates request body parameters for adding a member to a community.
 * @param {Request} req - The request object containing member information.
 * @param {Response} res - The response object used to send validation errors.
 * @param {NextFunction} next - The next middleware function in the chain.
 * @returns {Promise<void>} - Resolves if validation succeeds, otherwise passes validation errors to the next middleware.
 * @description
 *   - Validates 'community', 'user', and 'role' fields in the request body for adding a member.
 *   - Ensures 'community' ID is provided and a string.
 *   - Ensures 'user' ID is provided and a string.
 *   - Ensures 'role' ID is provided and a string.
 *   - Passes control to the next middleware if validation succeeds.
 */
export const addMemberVal = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const validationRules: ValidationChain[] = [
    body("community")
      .exists({ values: "falsy" })
      .withMessage("Community ID must be provided.")
      .isString()
      .withMessage("Community ID must be a string."),

    body("user")
      .exists({ values: "falsy" })
      .withMessage("User ID must be provided.")
      .isString()
      .withMessage("User ID must be a string."),

    body("role")
      .exists({ values: "falsy" })
      .withMessage("Role ID must be provided.")
      .isString()
      .withMessage("Role ID must be a string."),
  ];

  Promise.all(validationRules.map((rule) => rule.run(req))).then(() => {
    next();
  });
};



/**
 * Validates request parameters for deleting a member from a community.
 * @param {Request} req - The request object containing member ID.
 * @param {Response} res - The response object used to send validation errors.
 * @param {NextFunction} next - The next middleware function in the chain.
 * @returns {Promise<void>} - Resolves if validation succeeds, otherwise passes validation errors to the next middleware.
 * @description
 *   - Validates 'id' parameter in the request for deleting a member from a community.
 *   - Ensures 'id' is provided and a string.
 *   - Passes control to the next middleware if validation succeeds.
 */
export const deleteMemberVal = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  
  const validationRules: ValidationChain[] = [
    param("id")
      .exists({ values: "falsy" })
      .withMessage("User ID must be provided.")
      .isString()
      .withMessage("User ID must be a string."),
  ];

  Promise.all(validationRules.map((rule) => rule.run(req))).then(() => {
    next();
  });
};
