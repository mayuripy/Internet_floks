import { Request, Response, NextFunction } from "express";
import { NonParametricError, ParametricError } from "../errors";
import { Community, Member, Role, User } from "../models";


/**
 * Middleware to check if the current user is the administrator of the specified community.
 * @param {Request} req - The request object containing currentUser and community information.
 * @param {Response} res - The response object (not directly used in this middleware).
 * @param {NextFunction} next - The next middleware function in the chain.
 * @returns {void} - Proceeds to the next middleware if user is admin; otherwise, passes error to the next middleware.
 * @description
 *   - Retrieves the user ID from req.currentUser, it is embedded from previous miidelware.
 *   - Retrieves the community ID from req.body.
 *   - Fetches the user from the database using the retrieved ID.
 *   - Throws a NonParametricError if the user does not exist or is unauthorized.
 *   - Fetches the community from the database using the retrieved ID.
 *   - Throws a ParametricError if the community does not exist.
 *   - Retrieves the owner of the community from the database.
 *   - Throws a NonParametricError if the current user is not the owner of the community.
 */
export const isCommunityAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id: userId } = req.currentUser!;

    const { community } = req.body;

    const user = await User.findByPk(userId);
    if (!user) {
      throw new NonParametricError([
        {
          message: "You are not authorized to perform this action.",
          code: "NOT_ALLOWED_ACCESS",
        },
      ]);
    }

    const comm = await Community.findByPk(community);

    if (!comm) {
      throw new ParametricError([
        {
          param: "community",
          message: "Community not found.",
          code: "RESOURCE_NOT_FOUND",
        },
      ]);
    }

    const commOwner = await comm.getOwner();

    if (commOwner!.id !== userId) {
      throw new NonParametricError([
        {
          message: "You are not authorized to perform this action.",
          code: "NOT_ALLOWED_ACCESS",
        },
      ]);
    }
    next();
  } catch (error) {
    next(error);
  }
};
