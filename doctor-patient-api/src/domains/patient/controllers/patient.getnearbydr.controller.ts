import { Service } from "typedi";
import { Request, Response } from "express";
import UserService from "../services/patient.getnearbydr.service";

@Service()
class UserController {
  constructor(private userService: UserService) {}

  async findNearbyUsers(req: Request, res: Response): Promise<void> {
    try {
      const { latitude, longitude } = req.query;
      const result = await this.userService.findNearbyUsers(latitude as string, longitude as string);
      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

export default UserController;
