import { Service } from "typedi";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { SECRET } from "../../../common/constants/app.constants";
dotenv.config({ path: ".env" });

@Service()
export class CreateRefreshToken {
  secretKey: string = process.env.REFRESHTOKENKEY || SECRET;
  constructor() {}
  createRefreshToken(email: any = "anymail", password: any = "secretpass") {
    const refreshToken = jwt.sign(
      { email: email, password: password },
      this.secretKey,
      {}
    );
    return refreshToken;
  }
}
