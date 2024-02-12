import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { Service } from "typedi";
import dotenv from "dotenv";
import {
  ACCESS_DENIED_401,
  INVALID_TOKEN,
  SECRET,
} from "../../../common/constants/app.constants";
dotenv.config({ path: ".env" });

@Service()
export class VerifyRefreshToken {
  secretKey: string = process.env.REFRESHTOKENKEY || SECRET;

  verifyRefreshToken(req: Request, res: Response, next: NextFunction) {
    const refreshToken = req.header("Authorization")?.replace("Bearer ", "");

    if (!refreshToken) {
      return res.status(401).json({ error: ACCESS_DENIED_401 });
    }

    jwt.verify(refreshToken, "secret", async (err) => {
      if (err) {
        return res.status(401).json({ error: INVALID_TOKEN });
      }

      next();
    });
  }
}
