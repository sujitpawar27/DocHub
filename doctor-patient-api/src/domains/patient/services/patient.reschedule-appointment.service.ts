import { Request, Response } from "express";
import { Service } from "typedi";
import AppointmentModel from "../../../common/models/appointment.model";

@Service()
export class RescheduleAppointmentService {
  constructor() {}

  async rescheduleAppointment(req: Request, res: Response) {
    try {
      const { appointmentId, date, time } = req.body;
      //find the appointmetn session
      const appointments = await AppointmentModel.findById(appointmentId);
      if (!appointments) {
        return res.status(404).json({ message: "Appointment not found" });
      }
      //update time and date
      appointments.date = date;
      appointments.time = time;

      await appointments.save();
      return res
        .status(200)
        .json({ message: "Appointment rescheduled successfully" });
    } catch (error) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
}
