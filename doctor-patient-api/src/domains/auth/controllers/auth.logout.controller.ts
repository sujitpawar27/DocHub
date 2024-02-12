import { Request, Response } from "express";
import { Service } from "typedi";
import AuthlogoutService from "../services/auth.logout.service";
import logger from "../../../common/logger/logger.service";
import { INTERNAL_SERVER_ERROR } from "../../../common/constants/app.constants";

@Service()
class AuthlogoutController {
  constructor(private authlogoutService: AuthlogoutService) {}

  public logout = async (req: Request, res: Response): Promise<void> => {
    try {
      const email = req.body.userEmail;
      const logoutResult = await this.authlogoutService.logout(email);

      if (logoutResult.success) {
        // Successfully logged out
        res.status(200).json(logoutResult);
      } else {
        // Failed to log out
        res.status(401).json(logoutResult);
      }
    } catch (error) {
      logger.error("Error during logout:", error);
      res.status(500).json({ success: false, message: INTERNAL_SERVER_ERROR });
    }
  };
}

export default AuthlogoutController;
