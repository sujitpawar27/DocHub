import { Service } from "typedi";
import { BookAppointmentService } from "../services/patient.book-appointment.service";
import { Request, Response } from "express";

@Service()
export class BookAppointmentController {
  constructor(private bookAppointmentService: BookAppointmentService) {}

  bookAppointment(req: Request, res: Response) {
    this.bookAppointmentService.bookAppointmentService(req, res);
  }
}
