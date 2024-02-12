import { Service } from "typedi";
import UserModel from "../../../common/models/user.model";
import { Request, Response } from "express";
import {
  DOCTOR_ID_NOT_FOUND,
  DOCTOR_NOT_FOUND,
  INTERNAL_SERVER_ERROR,
} from "../../../common/constants/app.constants";

@Service()
export class getDoctorDetailsService {
  constructor() {}

  async getDoctorDetailsService(req: Request, res: Response) {
    try {
      const doctorId = req.params.doctorId;
      if (!doctorId) {
        res.status(404).json({ error: DOCTOR_ID_NOT_FOUND });
      }
      // Perform any necessary business logic or data retrieval using the repository
      const doctorDetails = await UserModel.findOne({ _id: doctorId });

      // You can modify the response or perform additional actions based on your requirements
      if (doctorDetails) {
        res.status(200).json({ success: true, data: doctorDetails });
      } else {
        res.status(404).json({ success: false, error: DOCTOR_NOT_FOUND });
      }
    } catch (error) {
      // Handle errors appropriately
      res.status(500).json({ success: false, error: INTERNAL_SERVER_ERROR });
    }
  }
}
