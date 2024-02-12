import { Request, Response } from "express";
import { Container, Service } from "typedi";
import PatientDetailsService from "../services/doctor.patient-details.service";
import {
  INTERNAL_SERVER_ERROR,
  PATIENT_DETAILS_NOT_FOUND,
} from "../../../common/constants/app.constants";
import logger from "../../../common/logger/logger.service";

@Service()
class PatientDetailsController {
  constructor(private patientDetailsService: PatientDetailsService) {}

  public getPatientDetails = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const appointmentId = req.params.id;
      console.log(`appintment id is  ${appointmentId}`);
      const patientDetails = await this.patientDetailsService.getPatientDetails(
        appointmentId
      );

      if (patientDetails) {
        res.status(200).json(patientDetails);
      } else {
        res
          .status(404)
          .json({ success: false, message: PATIENT_DETAILS_NOT_FOUND });
      }
    } catch (error) {
      logger.error("Error getting patient details:", error);
      res.status(500).json({ success: false, message: INTERNAL_SERVER_ERROR });
    }
  };
}

export default PatientDetailsController;
