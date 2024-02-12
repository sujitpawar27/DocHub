import { Service } from "typedi";
import { v4 as uuidv4 } from "uuid";
import logger from "../../../common/logger/logger.service";
import UserModel from "../../../common/models/user.model";
import { EmailService } from "../../../common/email/email.service";
import {
  INTERNAL_SERVER_ERROR,
  RESET_TOKEN_SENT,
  USER_NOT_FOUND,
} from "../../../common/constants/app.constants";

interface ForgotPasswordResult {
  success: boolean;
  message?: string;
  resetToken?: string;
}

@Service()
export class AuthForgotPasswordService {
  constructor(private readonly emailService: EmailService) {}

  public forgetPassword = async (
    email: string
  ): Promise<ForgotPasswordResult> => {
    try {
      const user = await UserModel.findOne({ email });

      if (!user) {
        return { success: false, message: USER_NOT_FOUND };
      }

      // Generate reset token and save it to the user's record
      const resetToken = uuidv4();
      user.resetToken = resetToken;
      await user.save();

      // Send email with the reset token
      this.emailService.sendDynamicEmail({
        template: "forgotPassword",
        userEmail: email,
        resetToken: resetToken,
      });

      return { success: true, message: RESET_TOKEN_SENT };
    } catch (error) {
      logger.error("Error during forget password:", error);
      return { success: false, message: INTERNAL_SERVER_ERROR };
    }
  };
}
