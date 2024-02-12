import { Request, Response } from "express";
import { Container } from "typedi";
import AuthUpdatePasswordService from "../services/auth.update-password.service";
import { Service } from "typedi";
import {
  INTERNAL_SERVER_ERROR,
  PASSWORD_UPDATED,
} from "../../../common/constants/app.constants";
import logger from "../../../common/logger/logger.service";

@Service()
class AuthUpdatePasswordController {
  private authUpdatePasswordService: AuthUpdatePasswordService;

  constructor() {
    this.authUpdatePasswordService = Container.get(AuthUpdatePasswordService);
  }

  updatePassword = async (req: Request, res: Response): Promise<void> => {
    const { email, newPassword } = req.body;

    try {
      const result = await this.authUpdatePasswordService.updatePassword(
        email,
        newPassword
      );

      if (result.success) {
        res.json({ success: true, message: PASSWORD_UPDATED });
      } else {
        res.status(400).json({ success: false, message: result.message });
      }
    } catch (error) {
      logger.error("Error in update password controller:", error);
      res.status(500).json({ success: false, message: INTERNAL_SERVER_ERROR });
    }
  };
}

export default AuthUpdatePasswordController;
