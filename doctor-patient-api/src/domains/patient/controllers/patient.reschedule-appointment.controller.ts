import { Request, Response } from "express";
import { Service } from "typedi";
import { RescheduleAppointmentService } from "../services/patient.reschedule-appointment.service";

@Service()
export class RescheduleAppointmentController {
  constructor(
    private rescheduleAppointmentService: RescheduleAppointmentService
  ) {}

  rescheduleAppointment(req: Request, res: Response) {
    this.rescheduleAppointmentService.rescheduleAppointment(req, res);
  }
}
