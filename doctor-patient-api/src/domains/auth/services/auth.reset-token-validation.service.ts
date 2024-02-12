import { Service } from "typedi";
import UserModel from "../../../common/models/user.model";
import {
  INTERNAL_SERVER_ERROR,
  USER_NOT_FOUND,
} from "../../../common/constants/app.constants";

interface ValidateResetTokenResult {
  success: boolean;
  message?: string;
}

@Service()
export class ResetTokenService {
  public async validateResetToken(
    email: string,
    resetToken: string
  ): Promise<ValidateResetTokenResult> {
    try {
      const user = await UserModel.findOne({ email });

      if (!user || !user.resetToken || user.resetToken !== resetToken) {
        return { success: false, message: USER_NOT_FOUND };
      }

      return { success: true };
    } catch (error) {
      console.error("Error validating reset token:", error);
      return { success: false, message: INTERNAL_SERVER_ERROR };
    }
  }
}
