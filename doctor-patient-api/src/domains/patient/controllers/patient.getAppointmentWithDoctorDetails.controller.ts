import { Service } from 'typedi';
import { Request, Response } from 'express';
import AppointmentService from '../services/patient.getAppointmentWithDoctorDetails.service';

@Service()
class AppointmentController {
  constructor(private appointmentService: AppointmentService) {}

  async getAppointmentsWithDoctorDetails(req: Request, res: Response): Promise<void> {
    try {
      const { patientId } = req.params;
      const appointments = await this.appointmentService.getAppointmentsWithDoctorDetails(patientId);
      res.json(appointments);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

export default AppointmentController;