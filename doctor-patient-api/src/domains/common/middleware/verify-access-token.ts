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
export class VerifyAccessToken {
  secretKey: string = process.env.ACCESSTOKENKEY || "secret";

  verifyAccessToken(req: Request, res: Response, next: NextFunction) {
    const accessToken = req.header("Authorization")?.replace("Bearer ", "");

    if (!accessToken) {
      return res.status(401).json({ error: ACCESS_DENIED_401 });
    }

    jwt.verify(accessToken, "secret", (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: INVALID_TOKEN });
      }

      next();
    });
  }
}
