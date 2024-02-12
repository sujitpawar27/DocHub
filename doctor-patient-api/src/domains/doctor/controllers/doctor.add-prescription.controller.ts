import { Service } from "typedi";
import { AddPrescriptionService } from "../services/doctor.add-prescription.service";
import { Request, Response } from "express";

@Service()
export class AddPrescriptionController {
  constructor(private addPrescriptionService: AddPrescriptionService) {}

  addPrescription(req: Request, res: Response) {
    this.addPrescriptionService.addPrescription(req, res);
  }
}
