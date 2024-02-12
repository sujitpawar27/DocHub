import { Request, Response } from "express";
import { Service } from "typedi";
import AuthregisterService from "../services/auth.register.service"; // Provide the correct path to your AuthService
import logger from "../../../common/logger/logger.service";
import { INTERNAL_SERVER_ERROR } from "../../../common/constants/app.constants";

@Service()
class AuthregisterController {
  constructor(private readonly authregisterService: AuthregisterService) {}

  register = async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await this.authregisterService.register(req, res);

      if (result.success) {
        // Optionally, you can send a success response here
        res.status(201).json(result);
      } else {
        // Handle registration failure
        res.status(500).json(result);
      }
    } catch (error) {
      logger.error("Error in register controller:", error);
      res.status(500).json({ success: false, error: INTERNAL_SERVER_ERROR });
    }
  };
}

export default AuthregisterController;
