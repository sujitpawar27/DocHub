import { Service } from "typedi";
import { getDoctorDetailsService } from "../services/patient.getdoctordetails.service";
import { Request, Response } from "express";

@Service()
export class getDoctorDetailsController {
  constructor(private getDoctorDetailsService: getDoctorDetailsService) {}

  getDoctorDetails(req: Request, res: Response) {
    this.getDoctorDetailsService.getDoctorDetailsService(req, res);
  }
}
