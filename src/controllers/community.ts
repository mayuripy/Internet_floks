import { NextFunction, Request, Response } from "express";
import { Community, Member, Role, User } from "../models";
import { Snowflake } from "@theinternetfolks/snowflake";
import { ParametricError } from "../errors";
import { Op } from "@sequelize/core";


/**
 * Creates a new community with the authenticated user as the owner.
 * @param {Request} req - The request object containing the authenticated user's ID and community details.
 * @param {Response} res - The response object to send back the newly created community details.
 * @param {NextFunction} next - The next middleware function in the chain.
 * @returns {Promise<Response | undefined>} - Returns a JSON response with the newly created community details.
 * @description
 *   - Retrieves the authenticated user's ID from the request.
 *   - Finds the user in the database based on the authenticated user's ID.
 *   - If the user is not found, throws a ParametricError.
 *   - Extracts the community name from the request body and generates a unique ID using Snowflake.
 *   - Creates a new community record in the database with the provided details.
 *   - Generates a slug for the community based on its name.
 *   - Checks if a "Community Admin" role exists; if not, creates it.
 *   - Adds the authenticated user as a member with "Community Admin" role to the newly created community.
 *   - Returns a JSON response with the newly created community's details.
 *   - Catches any errors and passes them to the next middleware.
 */
export const createCommunity = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id: userId } = req.currentUser!;
    const user = await User.findByPk(userId);
    if (!user) {
      throw new ParametricError([
        {
          param: "user",
          message: "User not found.",
          code: "RESOURCE_NOT_FOUND",
        },
      ]);
    }
    const { name } = req.body;
    const id = Snowflake.generate();
    const community = await Community.create({
      name,
      id,
      slug: name.toLowerCase().replace(/[\s\W-]+/g, "-"),
      ownerId: userId,
    });

    let role = await Role.findOne({
      where: {
        name: "Community Admin",
      },
    });

    if (!role) {
      role = await Role.create({
        name: "Community Admin",
        id: Snowflake.generate(),
      });
    }

    const member = await Member.create({
      id: Snowflake.generate(),
      communityId: community.id,
      userId: userId,
      roleId: role.id,
    });

    return res.status(200).json({
      status: true,
      content: {
        data: {
          id: community.id,
          name: community.name,
          slug: community.slug,
          owner: community.ownerId,
          created_at: community.createdAt,
          updated_at: community.updatedAt,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};



/**
 * Retrieves paginated list of all communities.
 * @param {Request} req - The request object containing optional pagination parameters.
 * @param {Response} res - The response object to send back the list of communities.
 * @param {NextFunction} next - The next middleware function in the chain.
 * @returns {Promise<Response | undefined>} - Returns a JSON response with paginated list of communities.
 * @description
 *   - Parses the 'page' query parameter from the request; defaults to page 1 if not provided.
 *   - Retrieves a paginated list of communities from the database, limited to 10 communities per page.
 *   - Calculates the total number of communities available.
 *   - Returns a JSON response with metadata including total number of communities, total pages, and current page.
 *   - Catches any errors and passes them to the next middleware.
 */
export const getAllCommunities = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | undefined> => {
  try {
    let page = Number(req.query.page);
    if (!page) {
      page = 1;
    }

    const roles = await Community.findAll({
      limit: 10,
      offset: Number(page) <= 1 ? 0 : (Number(page) - 1) * 10,
    });

    const total = await Community.count();
    return res.status(200).json({
      status: true,
      content: {
        meta: {
          total: total,
          pages: Math.ceil(total / 10),
          page: page <= 1 ? 1 : page,
        },
        data: [...roles],
      },
    });
  } catch (error) {
    next(error);
  }
};



/**
 * Retrieves paginated list of communities owned by the authenticated user.
 * @param {Request} req - The request object containing the authenticated user's ID and optional pagination parameters.
 * @param {Response} res - The response object to send back the list of owned communities.
 * @param {NextFunction} next - The next middleware function in the chain.
 * @returns {Promise<Response | undefined>} - Returns a JSON response with paginated list of owned communities.
 * @description
 *   - Retrieves the authenticated user's ID from the request.
 *   - Parses the 'page' query parameter from the request; defaults to page 1 if not provided.
 *   - Counts the total number of communities owned by the authenticated user.
 *   - Retrieves a paginated list of communities owned by the authenticated user from the database,
 *     limited to 10 communities per page.
 *   - Returns a JSON response with metadata including total number of owned communities, total pages, and current page.
 *   - Catches any errors and passes them to the next middleware.
 */
export const getMyOwnedCommunities = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | undefined> => {
  try {
    const { id: userId } = req.currentUser!;
    let page = Number(req.query.page);
    if (!page) {
      page = 1;
    }

    const total = await Community.count({ where: { ownerId: userId } });
    const myCommunities = await Community.findAll({
      where: {
        ownerId: userId,
      },
      limit: 10,
      offset: Number(page) <= 1 ? 0 : (Number(page) - 1) * 10,
    });

    return res.status(200).json({
      status: true,
      content: {
        meta: {
          total: total,
          pages: Math.ceil(total / 10),
          page: page <= 1 ? 1 : page,
        },
        data: [...myCommunities],
      },
    });
  } catch (error) {
    next(error);
  }
};




/**
 * Retrieves paginated list of communities joined by the authenticated user.
 * @param {Request} req - The request object containing the authenticated user's ID and optional pagination parameters.
 * @param {Response} res - The response object to send back the list of joined communities.
 * @param {NextFunction} next - The next middleware function in the chain.
 * @returns {Promise<Response | undefined>} - Returns a JSON response with paginated list of joined communities.
 * @description
 *   - Parses the 'page' query parameter from the request; defaults to page 1 if not provided.
 *   - Retrieves the authenticated user's ID from the request.
 *   - Searches for roles related to community membership (e.g., "Community Member", "Community Moderator").
 *   - Throws a ParametricError if the required roles are not found.
 *   - Retrieves IDs of roles found and filters members associated with those roles and the authenticated user.
 *   - Counts the total number of communities joined by the authenticated user.
 *   - Retrieves a paginated list of communities joined by the authenticated user from the database,
 *     limited to 10 communities per page.
 *   - Fetches additional details for each community, including its owner's information.
 *   - Returns a JSON response with metadata including total number of joined communities, total pages, and current page,
 *     along with detailed information about each joined community.
 *   - Catches any errors and passes them to the next middleware.
 */
export const getMyJoinedCommunities = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | undefined> => {
  try {
    let page = Number(req.query.page);
    if (!page) {
      page = 1;
    }
    const { id: userId } = req.currentUser!;

    let memberRole = await Role.findAll({
      where: {
        name: {
          [Op.in]: ["Community Member", "Community Moderator"],
        },
      },
    });
    if (memberRole.length === 0) {
      throw new ParametricError([
        {
          param: "role",
          message: "Community Member role not found.",
          code: "RESOURCE_NOT_FOUND",
        },
        {
          param: "role",
          message: "Community Admin role not found.",
          code: "RESOURCE_NOT_FOUND",
        },
      ]);
    }
    const roleId = memberRole!.map((mm) => mm.id);
    const myMembership = await Member.findAll({
      where: {
        userId: userId,
        roleId: {
          [Op.in]: roleId,
        },
      },
      limit: 10,
      offset: page <= 1 ? 0 : (Number(page) - 1) * 10,
    });

    const myMemberShipCount = await Member.count({
      where: {
        userId: userId,
        roleId: {
          [Op.in]: roleId,
        },
      },
    });

    const communitiesWithOwners = await Promise.all(
      myMembership.map(async (mem) => {
        const community = await mem.getCommunity();
        const owner = await community!.getOwner();

        return {
          id: community!.id,
          name: community!.name,
          slug: community!.slug,
          owner: owner
            ? {
                id: owner.id,
                name: owner.name,
              }
            : null,
          created_at: community!.createdAt,
          updated_at: community!.updatedAt,
        };
      })
    );

    return res.status(200).json({
      status: true,
      content: {
        meta: {
          total: myMemberShipCount,
          pages: Math.ceil(myMemberShipCount / 10),
          page: page <= 1 ? 1 : page,
        },
        data: [...communitiesWithOwners],
      },
    });
  } catch (error) {
    next(error);
  }
};




/**
 * Retrieves paginated list of members belonging to a specific community.
 * @param {Request} req - The request object containing the community ID and optional pagination parameters.
 * @param {Response} res - The response object to send back the list of community members.
 * @param {NextFunction} next - The next middleware function in the chain.
 * @returns {Promise<Response | undefined>} - Returns a JSON response with paginated list of community members.
 * @description
 *   - Retrieves the community ID from the request parameters.
 *   - Parses the 'page' query parameter from the request; defaults to page 1 if not provided.
 *   - Retrieves a paginated list of members associated with the specified community from the database,
 *     limited to 10 members per page.
 *   - Counts the total number of members belonging to the community.
 *   - Fetches extended details for each member, including their role and user information.
 *   - Returns a JSON response with metadata including total number of members, total pages, and current page,
 *     along with detailed information about each member.
 *   - Catches any errors and passes them to the next middleware.
 */
export const getAllMembers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | undefined> => {
  try {
    const id = req.params.id as string;
    let page = Number(req.query.page);
    if (!page) {
      page = 1;
    }

    const members = await Member.findAll({
      where: {
        communityId: id,
      },
      limit: 10,
      offset: page <= 1 ? 0 : (page - 1) * 10,
    });
    const totalMembers = await Member.count({
      where: {
        communityId: id,
      },
    });

    const membersExtended = await Promise.all(
      members.map(async (mem) => {
        const role = await mem.getRole();
        const user = await mem.getUser();

        return {
          id: mem.id,
          community: mem.communityId,
          user: {
            id: user!.id,
            name: user!.name,
          },
          role: {
            id: role!.id,
            name: role!.name,
          },
        };
      })
    );

    return res.status(200).json({
      status: true,
      content: {
        meta: {
          total: totalMembers,
          pages: Math.ceil(totalMembers / 10),
          page: page <= 1 ? 1 : page,
        },
        data: [...membersExtended],
      },
    });
  } catch (error) {
    next(error);
  }
};
