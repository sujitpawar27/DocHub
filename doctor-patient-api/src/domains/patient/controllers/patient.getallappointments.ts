import { Service } from "typedi";
import { Request, Response } from "express";
import { GetAllAppointmentsService } from "../services/patient.getallappointments.service";
import logger from "../../../common/logger/logger.service";
import { INTERNAL_SERVER_ERROR } from "../../../common/constants/app.constants";

@Service()
export class GetAllAppointmentsController {
  constructor(private getAllAppointmentsService: GetAllAppointmentsService) {}

  async getAllAppointments(req: Request, res: Response) {
    try {
      // Assuming patientId is stored in the user object during authentication
      const { patientId } = req.params;
      logger.info("Fetching appointments for patientId:", patientId);

      const appointments =
        await this.getAllAppointmentsService.getAllAppointments(patientId);

      res.status(200).json({ success: true, data: appointments });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: INTERNAL_SERVER_ERROR });
    }
  }
}
