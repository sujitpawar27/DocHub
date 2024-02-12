import { Request, Response } from "express";
import { Container } from "typedi";
import { AuthForgotPasswordService } from "../services/auth.forgot-password.service";
import { Service } from "typedi";
import { INTERNAL_SERVER_ERROR } from "../../../common/constants/app.constants";

@Service()
export class AuthForgetPasswordController {
  private readonly authForgotPasswordService: AuthForgotPasswordService;

  constructor() {
    this.authForgotPasswordService = Container.get(AuthForgotPasswordService);
  }

  public forgetPassword = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { email } = req.body;
      const result = await this.authForgotPasswordService.forgetPassword(email);
      res.status(result.success ? 200 : 404).json(result);
    } catch (error) {
      res.status(500).json({ success: false, message: INTERNAL_SERVER_ERROR });
    }
  };
}
