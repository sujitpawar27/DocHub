import { Service } from "typedi";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { SECRET } from "../../../common/constants/app.constants";
dotenv.config({ path: ".env" });

@Service()
export class CreateAccessToken {
  secretKey: string = process.env.ACCESSTOKENKEY || SECRET;
  constructor() {}
  createAccessToken(userId: any) {
    const accessToken = jwt.sign({ userId }, this.secretKey, {
      expiresIn: "1d",
    });
    return accessToken;
  }
}
