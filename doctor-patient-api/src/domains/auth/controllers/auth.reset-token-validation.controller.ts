import { Request, Response } from "express";
import { INTERNAL_SERVER_ERROR } from "../../../common/constants/app.constants";
import { Service } from "typedi";
import { ResetTokenService } from "../services/auth.reset-token-validation.service";

@Service()
export class ResetTokenController {
  constructor(private readonly resetTokenService: ResetTokenService) {}

  public async validateResetToken(req: Request, res: Response): Promise<void> {
    try {
      const { email, resetToken } = req.body;

      const result = await this.resetTokenService.validateResetToken(
        email,
        resetToken
      );

      if (result.success) {
        res.json({ success: true });
      } else {
        res.status(404).json(result);
      }
    } catch (error) {
      console.error("Error in ResetTokenController:", error);
      res.status(500).json({ success: false, message: INTERNAL_SERVER_ERROR });
    }
  }
}
