import { Service } from "typedi";
import bcrypt from "bcrypt";
import { validationResult, body } from "express-validator";
import logger from "../../../common/logger/logger.service";
import UserModel from "../../../common/models/user.model";
import {
  INTERNAL_SERVER_ERROR,
  PASSWORD_UPDATED,
  USER_NOT_FOUND,
} from "../../../common/constants/app.constants";

interface UpdatePasswordResult {
  success: boolean;
  message?: string;
}

@Service()
export class AuthUpdatePasswordService {
  public updatePassword = async (
    email: string,
    newPassword: string
  ): Promise<UpdatePasswordResult> => {
    try {
      await Promise.all([
        body("email")
          .isEmail()
          .withMessage("Invalid email")
          .run({ body: { email } }),

        body("newPassword")
          .notEmpty()
          .withMessage("New password is required")
          .isLength({ min: 6 })
          .withMessage("Password must be at least 6 characters long")
          .run({ body: { newPassword } }),
      ]);

      const errors = validationResult({ body: { email, newPassword } });
      if (!errors.isEmpty()) {
        logger.error("Validation error during password update", errors.array());
        return { success: false, message: errors.array()[0].msg };
      }

      const user = await UserModel.findOne({ email });

      if (user) {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();
        user.resetToken = undefined;
        await user.save();

        logger.info(PASSWORD_UPDATED, user.email);

        return { success: true, message: PASSWORD_UPDATED };
      }

      logger.error("User not found during password update");
      return { success: false, message: USER_NOT_FOUND };
    } catch (error) {
      logger.error("Error during password update", error);
      return { success: false, message: INTERNAL_SERVER_ERROR };
    }
  };
}
export default AuthUpdatePasswordService;
