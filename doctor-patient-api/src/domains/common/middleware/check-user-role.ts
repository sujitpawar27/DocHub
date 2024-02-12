import { Service } from "typedi";
import { Request, Response, NextFunction } from "express";
import SessionModel from "../../../common/models/session.model";
import logger from "../../../common/logger/logger.service";
import {
  FORBIDDEN,
  INTERNAL_SERVER_ERROR,
  SESSION_NOT_FOUND,
} from "../../../common/constants/app.constants";

@Service()
export class CheckUserRole {
  constructor() {}

  public async checkUserRole(
    req: Request,
    res: Response,
    next: NextFunction,
    requiredRole: string
  ) {
    try {
      const accessToken = req.header("Authorization")?.replace("Bearer ", "");
      const session = await SessionModel.findOne({ accesstoken: accessToken });
      if (!session) {
        return res.status(401).json({ error: SESSION_NOT_FOUND });
      }

      const userRole = session.role;

      if (userRole !== requiredRole) {
        return res.status(403).json({ error: FORBIDDEN });
      }

      next();
    } catch (error) {
      return res.status(500).json({ error: INTERNAL_SERVER_ERROR });
    }
  }
}
