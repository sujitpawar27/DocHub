import { Service } from "typedi";
import { Request, Response } from "express";
import SinglePrescriptionItemModel from "../../../common/models/single-prescription-item.model";
import {
  INTERNAL_SERVER_ERROR,
  PRESCRIPTION_ADDED_SUCCESSFULLY,
} from "../../../common/constants/app.constants";
import PrescriptionsModel from "../../../common/models/prescriptions.model";
import logger from "../../../common/logger/logger.service";
import AppointmentModel from "../../../common/models/appointment.model";
import UserModel from "../../../common/models/user.model"; // Import the User model
import sendMail from "../../../common/email/prescription-email"; // Adjust the path accordingly
@Service()
export class AddPrescriptionService {
  constructor() {}
  async addPrescription(req: Request, res: Response) {
    try {
      const { appointmentId, items } = req.body;
      const prescriptionItems = [];
      for (const item of items) {
        const singlePrescriptionItem = await SinglePrescriptionItemModel.create(
          item
        );
        prescriptionItems.push(singlePrescriptionItem);
      }
      const prescription = await PrescriptionsModel.create({
        appointmentId,
        items: prescriptionItems,
      });
      await AppointmentModel.findOneAndUpdate(
        { _id: appointmentId },
        { status: "completed" },
        { new: true }
      );
      // Fetch patient details using the appointmentId
      const appointment = await AppointmentModel.findById(appointmentId);
      const patientId = appointment?.patientId;
      if (patientId) {
        // Fetch user details using the patientId
        const user = await UserModel.findById(patientId);
        if (user) {
          // Send email to the patient
          await sendMail(user, items);
        } else {
          logger.error("Patient not found");
        }
      } else {
        logger.error("Patient ID not found in the appointment");
      }
      return res.status(201).json({
        message: PRESCRIPTION_ADDED_SUCCESSFULLY,
        prescription,
      });
    } catch (error) {
      logger.error("Error adding prescription:", error);
      return res.status(500).json({ error: INTERNAL_SERVER_ERROR });
    }
  }
}
