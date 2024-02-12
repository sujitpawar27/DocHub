import { Request, Response } from "express";
import { Service } from "typedi";
import { PrescriptionDetailsService } from "../services/patient.get-prescriotion-details.service";

@Service()
export class PrescriptionDetailsController {
  constructor(private presctiptionDetailsService: PrescriptionDetailsService) {}

  presctiptionDetails(req: Request, res: Response) {
    this.presctiptionDetailsService.getPrescriptionDetails(req, res);
  }
}
