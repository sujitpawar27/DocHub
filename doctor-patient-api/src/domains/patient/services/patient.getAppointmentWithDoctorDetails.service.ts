import { Service } from 'typedi';
import AppointmentModel from '../../../common/models/appointment.model';

@Service()
class AppointmentService {
  async getAppointmentsWithDoctorDetails(patientId: string): Promise<any> {
    try {
      const appointments = await AppointmentModel.find({ patientId })
        .populate({
          path: 'doctorId',
          model: 'User',
          select: 'firstName lastName email role address profilePicUrl',
        })
        .exec();

      return { appointments };
    } catch (error) {
      console.error(error);
      throw new Error('Error fetching appointments with doctor details');
    }
  }
}

export default AppointmentService;