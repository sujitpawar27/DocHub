import { Request, Response } from "express";
import { Service } from "typedi";
import logger from "../../../common/logger/logger.service";
import SessionModel from "../../../common/models/session.model";
import {
  INTERNAL_SERVER_ERROR,
  SESSION_NOT_FOUND,
  USER_LOGGED_OUT,
} from "../../../common/constants/app.constants";

interface LogoutResult {
  success: boolean;
  message?: string;
}

@Service()
class AuthlogoutService {
  public logout = async (email: string): Promise<LogoutResult> => {
    try {
      // Check if a session exists for the given email
      const existingSession = await SessionModel.findOne({ email });

      if (existingSession) {
        // Delete the session
        await SessionModel.findOneAndDelete({ email });
        logger.info("Logout successful");
        return { success: true, message: USER_LOGGED_OUT };
      } else {
        logger.error("Session not found in session table");
        return { success: false, message: SESSION_NOT_FOUND };
      }
    } catch (error) {
      logger.error("Error during logout:", error);
      return { success: false, message: INTERNAL_SERVER_ERROR };
    }
  };
}

export default AuthlogoutService;
