import { NextFunction, Request, Response } from "express";
import { Member, Role, User } from "../models";
import { Snowflake } from "@theinternetfolks/snowflake";
import { Op } from "@sequelize/core";
import { NonParametricError, ParametricError } from "../errors";

/**
 * Adds a new member to a community with the specified role.
 * @param {Request} req - The request object containing community, role, and user details.
 * @param {Response} res - The response object to send back the details of the added member.
 * @param {NextFunction} next - The next middleware function in the chain.
 * @returns {Promise<Response | undefined>} - Returns a JSON response with details of the added member.
 * @description
 *   - Retrieves community ID, role ID, and user ID from the request body.
 *   - Finds the role document in the database based on the provided role ID.
 *   - Throws a ParametricError if the role document is not found.
 *   - Finds the user document in the database based on the provided user ID.
 *   - Throws a ParametricError if the user document is not found.
 *   - Checks if the user is already a member of the community with the specified role.
 *   - Throws a NonParametricError if the user is already a member.
 *   - Creates a new member record in the database with a unique ID generated using Snowflake.
 *   - Returns a JSON response with details of the added member including community ID, user ID, role ID, and creation timestamp.
 *   - Catches any errors and passes them to the next middleware.
 */
export const addMember = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { community, role, user } = req.body;

    const roleDoc = await Role.findByPk(role);
    if (!roleDoc) {
      throw new ParametricError([
        {
          param: "role",
          message: "Role not found.",
          code: "RESOURCE_NOT_FOUND",
        },
      ]);
    }

    const userDoc = await User.findByPk(user);
    if (!userDoc) {
      throw new ParametricError([
        {
          param: "user",
          message: "User not found.",
          code: "RESOURCE_NOT_FOUND",
        },
      ]);
    }

    let isMember = await Member.findOne({
      where: {
        userId: user,
        communityId: community,
        roleId: role,
      },
    });

    if (isMember) {
      throw new NonParametricError([
        {
          message: "User is already added in the community.",
          code: "RESOURCE_EXISTS",
        },
      ]);
    }

    isMember = await Member.create({
      id: Snowflake.generate(),
      userId: user,
      communityId: community,
      roleId: role,
    });
    return res.status(200).json({
      status: true,
      content: {
        data: {
          id: isMember.id,
          community: isMember.communityId,
          user: isMember.userId,
          role: isMember.roleId,
          created_at: isMember.createdAt,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Removes a member from communities where the authenticated user has admin or moderator roles.
 * @param {Request} req - The request object containing the authenticated user's ID and the member ID to remove.
 * @param {Response} res - The response object to send back the status of the removal operation.
 * @param {NextFunction} next - The next middleware function in the chain.
 * @returns {Promise<Response | undefined>} - Returns a JSON response with status true upon successful removal.
 * @description
 *   - Retrieves the authenticated user's ID from the request.
 *   - Retrieves the member ID to remove from the request parameters.
 *   - Searches for roles such as "Community Admin" or "Community Moderator" in the database.
 *   - Retrieves communities where the authenticated user is an admin or moderator.
 *   - Finds member records associated with the specified member ID and communities.
 *   - Throws a NonParametricError if no member records are found for the specified member ID and communities.
 *   - Deletes all found member records from the database.
 *   - Returns a JSON response with status true indicating successful removal of the member.
 */
export const removeMember = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id: userId } = req.currentUser!;
    const id = req.params.id as string;

    const roles = await Role.findAll({
      where: {
        [Op.or]: [{ name: "Community Admin" }, { name: "Community Moderator" }],
      },
    });

    const communities = await Member.findAll({
      where: {
        userId: userId,
        roleId: {
          [Op.in]: roles.map((rl) => rl.id),
        },
      },
    });

    const member = await Member.findAll({
      where: {
        userId: id,
        communityId: {
          [Op.in]: communities.map((cm) => cm.communityId),
        },
      },
    });
    if (member.length === 0) {
      throw new NonParametricError([
        {
          message: "Member not found.",
          code: "RESOURCE_NOT_FOUND",
        },
      ]);
    }

    await Promise.all(member.map((mm) => mm.destroy()));
    return res.status(200).json({ status: true });
  } catch (error) {
    next(error);
  }
};
