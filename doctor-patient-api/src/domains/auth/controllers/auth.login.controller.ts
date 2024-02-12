import { Request, Response } from "express";
import { Service } from "typedi";
import AuthloginService from "../services/auth.login.service";
import logger from "../../../common/logger/logger.service";
import { INTERNAL_SERVER_ERROR } from "../../../common/constants/app.constants";

@Service()
class AuthloginController {
  constructor(private authloginService: AuthloginService) {}

  public login = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;
      const loginResult = await this.authloginService.login(email, password);

      if (loginResult.success) {
        // Successfully logged in
        res.status(200).json(loginResult);
      } else {
        // Failed to log in
        res.status(401).json(loginResult);
      }
    } catch (error) {
      logger.error("Error during login:", error);
      res.status(500).json({ success: false, message: INTERNAL_SERVER_ERROR });
    }
  };
}

export default AuthloginController;
