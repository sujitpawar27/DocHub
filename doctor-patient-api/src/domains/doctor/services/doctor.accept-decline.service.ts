import { Service } from "typedi";
import { validationResult, body } from "express-validator";
import logger from "../../../common/logger/logger.service";
import AppointmentModel from "../../../common/models/appointment.model";
import { EmailService } from "../../../common/email/email.service";
import {
  APPOINTMENT_NOT_FOUND,
  CANNOT_APPOINTMENT_NOW,
  INTERNAL_SERVER_ERROR,
} from "../../../common/constants/app.constants";

interface UpdateStatusResult {
  success: boolean;
  message?: string;
  updatedAppointment?: any;
}

@Service()
export class AppointmentService {
  constructor(private readonly emailService: EmailService) {}

  public async updateStatus(
    appointmentId: string,
    newStatus: string
  ): Promise<UpdateStatusResult> {
    try {
      const errors = validationResult({ body: { appointmentId, newStatus } });
      if (!errors.isEmpty()) {
        logger.error("Validation error during updateStatus", errors.array());
        return { success: false, message: errors.array()[0].msg };
      }

      const checkAppointment = await AppointmentModel.findOne({
        _id: appointmentId,
      });

      if (
        checkAppointment?.status === "confirmed" ||
        checkAppointment?.status === "cancelled"
      ) {
        return { success: false, message: CANNOT_APPOINTMENT_NOW };
      }
      const updatedAppointment = await AppointmentModel.findByIdAndUpdate(
        appointmentId,
        { status: newStatus },
        { new: true }
      ).populate("patientId", "email");

      if (updatedAppointment) {
        return { success: true, updatedAppointment };
      } else {
        logger.error("Appointment not found");
        return { success: false, message: APPOINTMENT_NOT_FOUND };
      }
    } catch (error) {
      logger.error("Error during updateStatus:", error);
      return { success: false, message: INTERNAL_SERVER_ERROR };
    }
  }
}

export default AppointmentService;
