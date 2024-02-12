import { Service } from "typedi";
import AppointmentModel from "../../../common/models/appointment.model";
import logger from "../../../common/logger/logger.service";
import UserModel from "../../../common/models/user.model";

@Service()
class PatientDetailsService {
  public async getPatientDetails(appointmentId: string): Promise<any | null> {
    try {
      const appointment = await AppointmentModel.findById(appointmentId);

      if (appointment) {
        return appointment.patientDetails;
      } else {
        return null;
      }
    } catch (error) {
      logger.error("Error fetching patient details:", error);
      return null;
    }
  }
}

export default PatientDetailsService;
