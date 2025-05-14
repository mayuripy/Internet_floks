import { NextFunction, Request, Response } from "express";
import { User } from "../models";
import { Snowflake } from "@theinternetfolks/snowflake";
import { UserPayloadForJwt } from "../interfaces";
import { comparePasswords, encryptSession } from "../utils";
import { NonParametricError, ParametricError } from "../errors";


/**
 * Handles user signup by creating a new user and generating a JWT token.
 * @param {Request} req - The request object containing user details.
 * @param {Response} res - The response object to send back the response.
 * @param {NextFunction} next - The next middleware function in the chain.
 * @returns {Promise<Response | undefined>} - Returns a JSON response with user details and JWT token.
 * @description
 *   - Extracts name, email, and password from the request body.
 *   - Generates a unique ID using Snowflake.
 *   - Checks if a user with the provided email already exists.
 *   - If the user exists, throws a ParametricError.
 *   - Creates a new user with the provided details.
 *   - Generates a JWT payload with the new user ID.
 *   - Encrypts the JWT and sets it in the session.
 *   - Returns a JSON response with user details and access token.
 *   - Catches any errors and passes them to the next middleware.
 */
export const signupUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | undefined> => {
  try {
    const { name, email, password } = req.body;
    const id = Snowflake.generate();

    const existingUser = await User.findOne({
      where: {
        email,
      },
    });
    if (existingUser) {
      throw new ParametricError([
        {
          param: "email",
          message: "User with this email address already exists.",
          code: "RESOURCE_EXISTS",
        },
      ]);
    }

    const user = await User.create({
      id,
      name,
      email,
      password,
    });

    const payload: UserPayloadForJwt = {
      id: user.id,
    };
    const encSession = encryptSession(payload);
    req.session = {
      jwt: encSession,
    };

    return res.status(200).json({
      status: true,
      content: {
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          created_at: user.createdAt,
        },
        meta: {
          access_token: encSession,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};



/**
 * Handles user signout by clearing the session.
 * @param {Request} req - The request object.
 * @param {Response} res - The response object to send back the response.
 * @param {NextFunction} next - The next middleware function in the chain.
 * @returns {Promise<Response | undefined>} - Returns a JSON response confirming signout.
 * @description
 *   - Checks if the session is populated.
 *   - If the session is not populated, throws a NonParametricError.
 *   - Clears the session.
 *   - Returns a JSON response confirming the user is logged out.
 *   - Catches any errors and passes them to the next middleware.
 */
export const signoutUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | undefined> => {
  try {
    if (!req.session?.isPopulated) {
      throw new NonParametricError([
        { message: "You need to sign in to proceed.", code: "NOT_SIGNEDIN" },
      ]);
    }
    req.session = null;

    return res
      .status(200)
      .json({ status: true, content: { message: "Logged out!" } });
  } catch (error) {
    next(error);
  }
};



/**
 * Handles user signin by verifying credentials and generating a JWT token.
 * @param {Request} req - The request object containing user email and password.
 * @param {Response} res - The response object to send back the response.
 * @param {NextFunction} next - The next middleware function in the chain.
 * @returns {Promise<Response | undefined>} - Returns a JSON response with user details and JWT token.
 * @description
 *   - Extracts email and password from the request body.
 *   - Searches for a user with the provided email.
 *   - If the user is not found, throws a ParametricError.
 *   - Compares the provided password with the stored hashed password.
 *   - If the passwords do not match, throws a ParametricError.
 *   - Generates a JWT payload with the user ID.
 *   - Encrypts the JWT and sets it in the session.
 *   - Returns a JSON response with user details and access token.
 *   - Catches any errors and passes them to the next middleware.
 */
export const signinUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | undefined> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      where: {
        email,
      },
    });
    if (!user) {
      throw new ParametricError([
        {
          param: "user",
          message: "User not found.",
          code: "RESOURCE_NOT_FOUND",
        },
      ]);
    }
    const isMatched = await comparePasswords(password, user.password);

    if (!isMatched) {
      throw new ParametricError([
        {
          param: "password",
          message: "The credentials you provided are invalid.",
          code: "INVALID_CREDENTIALS",
        },
      ]);
    }

    const payload: UserPayloadForJwt = {
      id: String(user.id),
    };
    const encSession = encryptSession(payload);
    req.session = {
      jwt: encSession,
    };

    return res.status(200).json({
      status: true,
      content: {
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          created_at: user.createdAt,
        },
        meta: {
          access_token: encSession,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};




/**
 * Retrieves the authenticated user's details.
 * @param {Request} req - The request object containing the authenticated user's ID.
 * @param {Response} res - The response object to send back the user details.
 * @param {NextFunction} next - The next middleware function in the chain.
 * @returns {Promise<Response | undefined>} - Returns a JSON response with user details.
 * @description
 *   - Checks if the current user ID is available in the request.
 *   - If not available, throws a NonParametricError indicating the user needs to sign in.
 *   - Retrieves the user details from the database based on the authenticated user's ID.
 *   - If the user is not found, throws a ParametricError.
 *   - Returns a JSON response with the authenticated user's details.
 *   - Catches any errors and passes them to the next middleware.
 */
export const getMe = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.currentUser?.id) {
      throw new NonParametricError([
        { message: "You need to sign in to proceed.", code: "NOT_SIGNEDIN" },
      ]);
    }

    const user = await User.findOne({
      where: {
        id: req.currentUser.id,
      },
    });

    if (!user) {
      throw new ParametricError([
        {
          param: "user",
          message: "User not found.",
          code: "RESOURCE_NOT_FOUND",
        },
      ]);
    }

    return res.status(200).json({
      status: true,
      content: {
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          created_at: user.createdAt,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};
