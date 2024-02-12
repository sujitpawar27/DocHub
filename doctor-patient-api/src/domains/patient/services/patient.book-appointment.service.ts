import { Request, Response } from "express";
import { Service } from "typedi";
import AppointmentModel from "../../../common/models/appointment.model";
import { EmailService } from "../../../common/email/email.service";
import UserModel from "../../../common/models/user.model";
import {
  ALL_FIELDS_REQUIRED,
  APPOINTMENT_BOOKED,
  INTERNAL_SERVER_ERROR,
  USER_NOT_FOUND,
} from "../../../common/constants/app.constants";
import logger from "../../../common/logger/logger.service";
import NotificationModel from "../../../common/models/notification.model";
@Service()
export class BookAppointmentService {
  constructor(private readonly emailService: EmailService) {}
  async bookAppointmentService(req: Request, res: Response) {
    try {
      const {
        patientId,
        doctorId,
        date,
        time,
        patientDetails,
        fcmToken,
        appointmentId,
      } = req.body;
      if (!patientId || !doctorId || !date || !time) {
        return res.status(400).json({ message: ALL_FIELDS_REQUIRED });
      }
      if (appointmentId) {
        // If appointmentId is provided, update the existing appointment
        const existingAppointment = await AppointmentModel.findOne({
          _id: appointmentId,
        });
        if (!existingAppointment) {
          return res.status(404).json({ message: "Appointment not found" });
        }
        existingAppointment.set({
          patientId,
          doctorId,
          date,
          time,
          patientDetails,
        });
        await existingAppointment.save();
        return res
          .status(200)
          .json({ message: "Appointment updated successfully" });
      }
      // If appointmentId is not provided, create a new appointment
      const appointment = new AppointmentModel({
        patientId,
        doctorId,
        date,
        time,
        status: "pending",
        patientDetails,
      });
      const user = await UserModel.findOne({ _id: doctorId });
      if (!user) {
        return res.status(404).json({ message: USER_NOT_FOUND });
      }
      await appointment.save();
      this.emailService.sendDynamicEmail({
        template: "appointment",
        userEmail: user.email,
      });
      // Save the token to the db

      const existingNotification = await NotificationModel.findOne({
        patientId,
      });

      if (existingNotification) {
        existingNotification.set({
          email: user.email,
          fcmToken,
        });

        await existingNotification.save();
      } else {
        await NotificationModel.create({
          patientId,
          email: user.email,
          fcmToken,
        });
      }

      return res.status(201).json({ message: APPOINTMENT_BOOKED });
    } catch (error) {
      logger.error("Error booking/updating appointment:", error);
      res.status(500).json({ error: INTERNAL_SERVER_ERROR });
    }
  }
}
export default BookAppointmentService;
