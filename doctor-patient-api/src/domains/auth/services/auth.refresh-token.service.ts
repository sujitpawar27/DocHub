import { Service } from "typedi";
import { Request, Response } from "express";
import { VerifyRefreshToken } from "../../common/middleware/verify-refresh-token";
import SessionModel from "../../../common/models/session.model";
import UserModel from "../../../common/models/user.model";
import { CreateAccessToken } from "../../common/middleware/create-access-token";
import { CreateRefreshToken } from "../../common/middleware/create-refresh-token";
import {
  ACCESS_DENIED_401,
  INTERNAL_SERVER_ERROR,
  UNAUTHORISED,
  USER_NOT_FOUND,
} from "../../../common/constants/app.constants";

@Service()
export class RefreshTokenService {
  constructor(
    private createAccessToken: CreateAccessToken,
    private createRefreshToken: CreateRefreshToken
  ) {}

  async refreshAccessToken(req: Request, res: Response): Promise<void> {
    try {
      const refreshToken = req.header("Authorization")?.replace("Bearer ", "");
      const email = req.body;
      const session = await SessionModel.findOne(email);

      if (session?.refreshtoken !== refreshToken) {
        res.status(401).json({ error: ACCESS_DENIED_401 });
        return;
      }

      if (!session) {
        res.status(401).json({ error: UNAUTHORISED });
        return;
      }

      const user = await UserModel.findOne({ role: session.role });

      if (!user) {
        res.status(401).json({ error: USER_NOT_FOUND });
        return;
      }

      const newAccessToken = this.createAccessToken.createAccessToken(user._id);
      const newRefresToken = this.createRefreshToken.createRefreshToken(
        user.email
      );

      session.accesstoken = newAccessToken;
      session.refreshtoken = newRefresToken;
      await session.save();

      res.json({
        accessToken: newAccessToken,
        refreshToken: newRefresToken,
      });
    } catch (error) {
      res.status(500).json({ error: INTERNAL_SERVER_ERROR });
    }
  }
}
