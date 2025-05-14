import { NextFunction, Request, Response } from "express";
import { Role } from "../models";
import { Snowflake } from "@theinternetfolks/snowflake";

export const createRole = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | undefined> => {
  try {
    const { name } = req.body;
    const role = await Role.create({
      id: Snowflake.generate(),
      name,
    });
    return res.status(200).json({
      status: true,
      content: {
        data: {
          id: role.id,
          name: role.name,
          created_at: role.createdAt,
          updated_at: role.updatedAt,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getAllRole = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | undefined> => {
  try {
    let page = Number(req.body.page);

    if (!page) {
      page = 1;
    }

    const roles = await Role.findAll({
      limit: 10,
      offset: Number(page) <= 1 ? 0 : (Number(page) - 1) * 10,
    });

    const total = await Role.count();
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
