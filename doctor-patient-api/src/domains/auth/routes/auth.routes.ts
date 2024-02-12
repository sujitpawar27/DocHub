import { Router } from "express";
import { Service } from "typedi";
import AuthregisterController from "../controllers/auth.register.controller";
import AuthloginController from "../controllers/auth.login.controller";
import AuthlogoutController from "../controllers/auth.logout.controller";
import { RefreshTokenController } from "../controllers/auth.refresh-token.controller";
import { VerifyRefreshToken } from "../../common/middleware/verify-refresh-token";
import { AuthForgetPasswordController } from "../controllers/auth.forgot-password.controller";
import AuthUpdatePasswordController from "../controllers/auth.update-password.controller";
import {
  FORGOT_PASSWORD,
  LOGIN,
  LOGOUT,
  REFRESH_TOKEN,
  REGISTER,
  UPDATE_PASSWORD,
} from "../../../common/constants/app.constants";
import { ResetTokenController } from "../controllers/auth.reset-token-validation.controller";

@Service()
class AuthRoutes {
  private readonly router: Router;
  constructor(
    private readonly authregisterController: AuthregisterController,
    private readonly authloginController: AuthloginController,
    private readonly authlogoutController: AuthlogoutController,
    private readonly authrefreshTokenController: RefreshTokenController,
    private readonly verifyRefreshToken: VerifyRefreshToken,
    private readonly authForgotPasswordController: AuthForgetPasswordController,
    private readonly authUpdatePasswordController: AuthUpdatePasswordController,
    private readonly authResetTokenValidationController: ResetTokenController
  ) {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    // Register route
    this.router.post(
      REGISTER,
      this.authregisterController.register.bind(this.authregisterController)
    );

    // Login route
    this.router.post(
      LOGIN,
      this.authloginController.login.bind(this.authloginController)
    );

    //refreshtoken
    this.router.post(
      REFRESH_TOKEN,
      this.verifyRefreshToken.verifyRefreshToken,
      this.authrefreshTokenController.refreshToken.bind(
        this.authrefreshTokenController
      )
    );

    //forgot password
    this.router.post(
      FORGOT_PASSWORD,
      this.authForgotPasswordController.forgetPassword.bind(
        this.authForgotPasswordController
      )
    );

    //update password
    this.router.post(
      UPDATE_PASSWORD,
      this.authUpdatePasswordController.updatePassword.bind(
        this.authUpdatePasswordController
      )
    );

    //logout route
    this.router.post(
      LOGOUT,
      this.authlogoutController.logout.bind(this.authlogoutController)
    );

    //reset-token
    this.router.post(
      "/validate-resetToken",
      this.authResetTokenValidationController.validateResetToken.bind(
        this.authResetTokenValidationController
      )
    );
  }

  public getRouter(): Router {
    return this.router;
  }
}

export default AuthRoutes;
