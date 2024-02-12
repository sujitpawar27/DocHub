import { Request, Response } from "express";
import { Service } from "typedi";
import { INTERNAL_SERVER_ERROR } from "../../../common/constants/app.constants";
import PrescriptionsModel from "../../../common/models/prescriptions.model";
import logger from "../../../common/logger/logger.service";
import AppointmentModel from "../../../common/models/appointment.model";

@Service()
export class PrescriptionDetailsService {
  constructor() {}
  async getPrescriptionDetails(req: Request, res: Response) {
    const appointmentId = req.params.appointmentId;
    logger.info(`id -------------${appointmentId}`);

    try {
      const prescriptionsData = await PrescriptionsModel.findOne({
        appointmentId,
      });
      logger.info(`data ---------------${JSON.stringify(prescriptionsData)}`);

      if (!prescriptionsData) {
        return res.status(404).json({ message: "Items not found" });
      }
      try {
        const appointmentDetails = await AppointmentModel.findById(
          appointmentId
        );
        logger.info(
          `appointments are ---------------${JSON.stringify(
            appointmentDetails
          )}`
        );

        return res.status(200).json({
          items: prescriptionsData.items,
          patientDetails: appointmentDetails?.patientDetails,
        });
      } catch (error) {
        return res.status(400).json({ message: "Details not found" });
      }
    } catch (error) {
      return res.status(500).json({ message: INTERNAL_SERVER_ERROR });
    }
  }
}
