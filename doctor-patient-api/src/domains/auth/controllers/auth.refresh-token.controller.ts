import { Service } from "typedi";
import { RefreshTokenService } from "../services/auth.refresh-token.service";
import { Request, Response } from "express";

@Service()
export class RefreshTokenController {
  constructor(private refreshTokenService: RefreshTokenService) {}
  public refreshToken(req: Request, res: Response) {
    this.refreshTokenService.refreshAccessToken(req, res);
  }
}
