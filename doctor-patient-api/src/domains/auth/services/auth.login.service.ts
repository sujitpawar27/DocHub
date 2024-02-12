import { Service } from "typedi";
import bcrypt from "bcrypt";
import { validationResult, body } from "express-validator";
import logger from "../../../common/logger/logger.service";
import UserModel from "../../../common/models/user.model";
import SessionModel from "../../../common/models/session.model";
import { CreateAccessToken } from "../../common/middleware/create-access-token";
import { CreateRefreshToken } from "../../common/middleware/create-refresh-token";
import {
  INTERNAL_SERVER_ERROR,
  PASSWORD_NOT_MATCHED,
  USER_LOGGED_IN,
  USER_NOT_FOUND,
  VALIDATION_ERROR,
} from "../../../common/constants/app.constants";

interface LoginResult {
  success: boolean;
  message?: string;
  token?: string;
  user?: any;
  id?: string;
}

@Service()
export class AuthloginService {
  constructor(
    private createAccessToken: CreateAccessToken,
    private createRefreshToken: CreateRefreshToken
  ) {}
  public login = async (
    email: string,
    password: string
  ): Promise<LoginResult> => {
    let checkPassword = password;
    try {
      await Promise.all([
        body("email")
          .isEmail()
          .withMessage("Invalid email")
          .run({ body: { email } }),

        body("password")
          .notEmpty()
          .withMessage("Password is required")
          .run({ body: { password } }),
      ]);

      const errors = validationResult({ body: { email, password } });
      if (!errors.isEmpty()) {
        logger.error(VALIDATION_ERROR, errors.array());
        return { success: false, message: errors.array()[0].msg };
      }

      const userData = await UserModel.findOne({ email });

      if (userData) {
        const matchPassword = await bcrypt.compare(
          checkPassword,
          userData.password
        );

        if (!matchPassword) {
          logger.error(PASSWORD_NOT_MATCHED);
          return {
            success: false,
            message: PASSWORD_NOT_MATCHED,
          };
        }

        logger.info(USER_LOGGED_IN, userData.email);
        const accesstoken = this.createAccessToken.createAccessToken(
          userData.id
        );
        const refreshtoken = this.createRefreshToken.createRefreshToken(
          userData.email,
          userData.password
        );

        await SessionModel.findOneAndDelete({ email: userData.email });
        await SessionModel.create({
          email: userData.email,
          accesstoken,
          refreshtoken,
          role: userData.role,
        });

        logger.info(USER_LOGGED_IN, email);

        const { password, ...userWithoutPaaword } = userData.toObject();

        const responseData = {
          success: true,
          accesstoken,
          refreshtoken,
          user: userWithoutPaaword,
          id: userData.id,
        };
        return responseData;
      }

      logger.error(USER_NOT_FOUND);
      return { success: false, message: USER_NOT_FOUND };
    } catch (error) {
      logger.error("error during login", error);
      return { success: false, message: INTERNAL_SERVER_ERROR };
    }
  };
}

export default AuthloginService;
