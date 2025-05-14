import { ValidationChain, body, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

/**
 * Validates request body parameters for signing up a new user.
 * @param {Request} req - The request object containing user information.
 * @param {Response} res - The response object used to send validation errors.
 * @param {NextFunction} next - The next middleware function in the chain.
 * @returns {Promise<void>} - Resolves if validation succeeds, otherwise passes validation errors to the next middleware.
 * @description
 *   - Validates 'name', 'email', and 'password' fields in the request body.
 *   - Ensures 'name' is a string of at least 2 characters.
 *   - Ensures 'email' is a valid email address.
 *   - Ensures 'password' is a string of at least 2 characters.
 *   - Passes control to the next middleware if validation succeeds.
 */
export const signupUserVal = (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const validationRules: ValidationChain[] = [
    body("name")
      .exists()
      .isString()
      .isLength({ min: 2 })
      .withMessage("Name must be at least 2 characters long."),

    body("email")
      .exists()
      .isEmail()
      .withMessage("Please provide a valid email address."),

    body("password")
      .exists()
      .isString()
      .isLength({ min: 2 })
      // .isLength({ min: 8 }) //Commented out the real strong password validation to comply with provided rule book on documenter.postman.com
      // .matches(/[A-Z]/)
      // .matches(/\d/)
      // .matches(/[@#$&]/)
      .withMessage("Password should be at least 2 characters."),
  ];

  return Promise.all(validationRules.map((rule) => rule.run(req))).then(() => {
    next();
  });
};

/**
 * Validates request body parameters for signing in a user.
 * @param {Request} req - The request object containing user credentials.
 * @param {Response} res - The response object used to send validation errors.
 * @param {NextFunction} next - The next middleware function in the chain.
 * @returns {Promise<void>} - Resolves if validation succeeds, otherwise passes validation errors to the next middleware.
 * @description
 *   - Validates 'email' and 'password' fields in the request body for signing in.
 *   - Ensures 'email' is a valid email address.
 *   - Ensures 'password' is a string of at least 2 characters.
 *   - Passes control to the next middleware if validation succeeds.
 */
export const signinUserVal = (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const validationRules: ValidationChain[] = [
    body("email")
      .exists()
      .isEmail()
      .withMessage("Please provide a valid email address."),

    body("password")
      .exists()
      .isString()
      .isLength({ min: 2 })
      // .isLength({ min: 8 }) //Commented out the real strong password validation to comply with provided rule book on documenter.postman.com
      // .matches(/[A-Z]/)
      // .matches(/\d/)
      // .matches(/[@#$&]/)
      .withMessage("Password should be at least 2 characters."),
  ];

  return Promise.all(validationRules.map((rule) => rule.run(req))).then(() => {
    next();
  });
};
