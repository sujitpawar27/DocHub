import { NextFunction, Request, Response, Router } from "express";
import { Service } from "typedi";
import { ShowPatientsController } from "../controllers/doctor.show-patients.controller";
import { VerifyAccessToken } from "../../common/middleware/verify-access-token";
import { CheckUserRole } from "../../common/middleware/check-user-role";
import { AddPrescriptionController } from "../controllers/doctor.add-prescription.controller";
import AppointmentController from "../controllers/doctor.accept-decline.controller";
import PatientDetailsController from "../controllers/doctors.patient-details.controller";
import {
  ACCEPT_APPOINTMENT,
  ADD_PRESCRIPTION,
  DECLINE_APPOINTMENT,
  GET_PATIENT_DETAILS,
  SHOW_PATIENTS,
} from "../../../common/constants/app.constants";

@Service()
export class DoctorRoutes {
  private router: Router;
  constructor(
    private showPatientsController: ShowPatientsController,
    private addPrescriptionController: AddPrescriptionController,
    private appointmentController: AppointmentController,
    private patientDetailsController: PatientDetailsController,
    private verifyAccessToken: VerifyAccessToken,
    private checkUserRole: CheckUserRole
  ) {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    //show patients
    this.router.get(
      SHOW_PATIENTS,
      this.verifyAccessToken.verifyAccessToken,
      async (req, res, next) => {
        await this.checkUserRole.checkUserRole(req, res, next, "doctor");
      },
      this.showPatientsController.showPatients.bind(this.showPatientsController)
    );

    //add prescription
    this.router.post(
      ADD_PRESCRIPTION,
      this.verifyAccessToken.verifyAccessToken,
      async (req, res, next) => {
        await this.checkUserRole.checkUserRole(req, res, next, "doctor");
      },
      this.addPrescriptionController.addPrescription.bind(
        this.addPrescriptionController
      )
    );

    this.router.put(
      ACCEPT_APPOINTMENT,
      this.verifyAccessToken.verifyAccessToken,
      async (req, res, next) => {
        await this.checkUserRole.checkUserRole(req, res, next, "doctor");
      },
      this.appointmentController.acceptAppointment.bind(
        this.appointmentController
      )
    );

    // Decline appointment route
    this.router.put(
      DECLINE_APPOINTMENT,
      this.verifyAccessToken.verifyAccessToken,
      // async (req, res, next) => {
      //   await this.checkUserRole.checkUserRole(req, res, next, "doctor");
      // },
      this.appointmentController.declineAppointment.bind(
        this.appointmentController
      )
    );

    // Patient details route
    this.router.get(
      GET_PATIENT_DETAILS,
      this.verifyAccessToken.verifyAccessToken,
      async (req, res, next) => {
        await this.checkUserRole.checkUserRole(req, res, next, "doctor");
      },
      this.patientDetailsController.getPatientDetails.bind(
        this.patientDetailsController
      )
    );
  }

  public getRouter(): Router {
    return this.router;
  }
}
