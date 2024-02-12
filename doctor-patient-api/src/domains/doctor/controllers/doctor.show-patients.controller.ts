import { Service } from "typedi";
import { ShowPatientsService } from "../services/doctor.show-patients.service";
import { Request, Response } from "express";

@Service()
export class ShowPatientsController {
  constructor(private showPatientsService: ShowPatientsService) {}

  showPatients(req: Request, res: Response) {
    this.showPatientsService.showPatients(req, res);
  }
}
