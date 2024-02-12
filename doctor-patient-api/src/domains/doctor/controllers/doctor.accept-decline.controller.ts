import { Request, Response } from "express";
import { Service } from "typedi";
import AppointmentService from "../services/doctor.accept-decline.service";
import logger from "../../../common/logger/logger.service";
import { EmailService } from "../../../common/email/email.service";
import { INTERNAL_SERVER_ERROR } from "../../../common/constants/app.constants";
import NotificationModel from "../../../common/models/notification.model";
import AppointmentModel from "../../../common/models/appointment.model";
import { getMessaging } from "firebase-admin/messaging";
import userModel from "../../../common/models/user.model";
@Service()
class AppointmentController {
  constructor(
    private appointmentService: AppointmentService,
    private readonly emailService: EmailService
  ) {}

  public acceptAppointment = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const appointmentId = req.params.id;

      const updatedAppointment = await this.appointmentService.updateStatus(
        appointmentId,
        "confirmed"
      );

      const appointment = await AppointmentModel.findById(appointmentId);

      if (!appointment) {
        res.status(404).json({ message: "Appointment not found" });
      }

      const patientId = appointment?.patientId;
      const patientDetails = await userModel.findById(patientId);
      const patientEmail: any = patientDetails?.email;

      // Find the notification by patientId to get fcmToken
      const notificationModel = await NotificationModel.findOne({
        patientId: patientId,
      });

      if (!notificationModel) {
        res.status(404).json({ message: "Notification not found" });
      }

      const fcmToken = notificationModel?.fcmToken;
      logger.info(`fcm token is ---------------${fcmToken}`);
      logger.info(`email is ${patientEmail}`);

      const messageData: any = {
        notification: {
          title: "Appointment booked successfully",
          body: `Be ready at ${appointment?.date.getDate()}-${appointment?.date.getMonth()}-${appointment?.date.getFullYear()} on ${
            appointment?.time
          }`,
        },
        token: fcmToken,
      };
      await getMessaging().send(messageData);
      logger.info(`notification send --------------------------  `);

      if (updatedAppointment.success) {
        // Send confirmation email to patient

        this.emailService.sendDynamicEmail({
          template: "appointment-accepted",
          userEmail: patientEmail,
        });

        res.status(200).json(updatedAppointment);
      } else {
        res
          .status(500)
          .json({ success: false, message: INTERNAL_SERVER_ERROR });
      }
    } catch (error) {
      logger.error("Error accepting appointment:", error);
      res.status(500).json({ success: false, message: INTERNAL_SERVER_ERROR });
    }
  };

  //decline appointment
  public declineAppointment = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const appointmentId = req.params.id;

      const updatedAppointment = await this.appointmentService.updateStatus(
        appointmentId,
        "cancelled"
      );

      if (updatedAppointment.success) {
        // Send cancellation email to patient
        const patientEmail =
          updatedAppointment.updatedAppointment.patientDetails.email;
        this.emailService.sendDynamicEmail({
          template: "appointment-cancelled",
          userEmail: patientEmail,
        });

        res.status(200).json(updatedAppointment);
      } else {
        res
          .status(500)
          .json({ success: false, message: INTERNAL_SERVER_ERROR });
      }
    } catch (error) {
      logger.error("Error declining appointment:", error);
      res.status(500).json({ success: false, message: INTERNAL_SERVER_ERROR });
    }
  };
}

export default AppointmentController;
