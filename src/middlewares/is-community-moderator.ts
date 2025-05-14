import { Request, Response, NextFunction } from "express";
import { Community, Member, Role, User } from "../models";
import { NonParametricError } from "../errors";


/**
 * Middleware to check if the current user is a moderator of the specified community.
 * @param {Request} req - The request object containing currentUser and community information.
 * @param {Response} res - The response object (not directly used in this middleware).
 * @param {NextFunction} next - The next middleware function in the chain.
 * @returns {void} - Proceeds to the next middleware if user is a moderator; otherwise, passes error to the next middleware.
 * @description
 *   - Retrieves the user ID from req.currentUser, it is embedded from previous miidelware.
 *   - Retrieves the community ID from req.body.
 *   - Fetches the user from the database using the retrieved ID.
 *   - Throws a NonParametricError if the user does not exist.
 *   - Fetches the community from the database using the retrieved ID.
 *   - Throws a NonParametricError if the community does not exist.
 *   - Retrieves the owner of the community from the database.
 *   - Fetches the role "Community Moderator" from the database.
 *   - Fetches the membership of the user in the community with the role "Community Moderator".
 *   - Throws a NonParametricError if the current user is neither the owner of the community nor a moderator.
 */
export const isCommunityModerator = async (
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
        throw new NonParametricError([
          {
            message: "You are not authorized to perform this action.",
            code: "NOT_ALLOWED_ACCESS",
          },
        ]);
      }
  
      const commOwner = await comm.getOwner();
  
      const role = await Role.findOne({
        where: {
          name: "Community Moderator",
        },
      });
  
      const membership = await Member.findOne({
        where: {
          userId: user.id,
          communityId: community.id,
          roleId: role!.id,
        },
      });
  
      if (commOwner!.id !== userId && !membership) {
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