import { Service } from "typedi";
import AppointmentModel from "../../../common/models/appointment.model";
import UserModel, { User } from "../../../common/models/user.model";

@Service()
export class GetAllAppointmentsService {
  async getAllAppointments(patientId: any): Promise<{ doctors: User[] }> {
    try {
      const appointments = await AppointmentModel.find({ patientId });

      const doctorIds = appointments.map((appointment) => appointment.doctorId);

      const doctors = await UserModel.find({ _id: { $in: doctorIds } }).select(
        "-password"
      );

      return { doctors };
    } catch (error) {
      throw error;
    }
  }
}
