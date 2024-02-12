import { Request, Response } from "express";
import { Service } from "typedi";
import AppointmentModel, {
  Appointment,
} from "../../../common/models/appointment.model";
import {
  APPOINTMENT_NOT_FOUND,
  INTERNAL_SERVER_ERROR,
} from "../../../common/constants/app.constants";
import UserModel, { User } from "../../../common/models/user.model";

@Service()
export class ShowPatientsService {
  constructor() {}

  async showPatients(req: Request, res: Response) {
    try {
      const { doctorId, status, page = 1, pageSize = 30 } = req.query;

      const totalPatients = await AppointmentModel.countDocuments({
        doctorId,
        status,
      });
      const totalPages = Math.ceil(totalPatients / Number(pageSize));

      const appointments = await AppointmentModel.find({ doctorId, status })
        .skip((Number(page) - 1) * Number(pageSize))
        .limit(Number(pageSize));

      if (!appointments) {
        return res.status(404).json({ message: APPOINTMENT_NOT_FOUND });
      }

      //add profiel pic url
      const patientIds = appointments.map(
        (appointment) => appointment.patientId
      );
      const patients: User[] = await UserModel.find({
        _id: { $in: patientIds },
      });

      const appointmentsWithProfiles = appointments.map(
        (appointment: Appointment) => {
          const patient = patients.find((patient) =>
            patient._id.equals(appointment.patientId)
          );
          return {
            ...appointment.toObject(),
            patientProfileUrl: patient?.profilePicUrl || null,
          };
        }
      );

      return res.status(200).json({
        success: true,
        data: {
          appointments: appointmentsWithProfiles,
          pageInfo: {
            page: Number(page),
            pageSize: Number(pageSize),
            totalPatients,
            totalPages,
          },
        },
      });
    } catch (error) {
      return res.status(500).json({ error: INTERNAL_SERVER_ERROR });
    }
  }
}
