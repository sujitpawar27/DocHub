import { Router } from "express";
import { Service } from "typedi";
import UserService from "../services/patient.getnearbydr.service";
import UserController from "../controllers/patient.getnearbydr.controller";
import { VerifyAccessToken } from "../../common/middleware/verify-access-token";
import { CheckUserRole } from "../../common/middleware/check-user-role";
import { BookAppointmentController } from "../controllers/patient.book-appointment.controller";
import { getDoctorDetailsController } from "../controllers/patient.getdoctordetails.controller";
import { FeedbackController } from "../controllers/patient.submitfeedback.controller";
import { GetAllAppointmentsController } from "../controllers/patient.getallappointments";
import AppointmentController from "../controllers/patient.getAppointmentWithDoctorDetails.controller";
import {
  BOOK_APPOINTMENT,
  GET_ALL_APPOINTMENTS,
  GET_APPOINTMENT_BY_PATIENTID,
  GET_DOCTOR_DETAILS,
  GET_PRESCRIPTION_DETAILS,
  NEARBY_DOCTORS,
  SUBMIT_FEEDBACK,
} from "../../../common/constants/app.constants";
import { PrescriptionDetailsController } from "../controllers/patient.get-prescription.controller";
import { RescheduleAppointmentController } from "../controllers/patient.reschedule-appointment.controller";

@Service()
export class UserRoutes {
  private readonly router: Router;

  constructor(
    private readonly userService: UserService,
    private readonly userController: UserController,
    private readonly verifyAccessToken: VerifyAccessToken,
    private checkUserRole: CheckUserRole,
    private readonly bookAppointmentController: BookAppointmentController,
    private getDoctorDetailsController: getDoctorDetailsController,
    private feedbackController: FeedbackController,
    private getAllAppoinmentsController: GetAllAppointmentsController,
    private readonly appointmentController: AppointmentController,
    private readonly prescriptionController: PrescriptionDetailsController,
    private rescheduleAppointmentController: RescheduleAppointmentController
  ) {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    // Find nearby users route
    this.router.post(
      NEARBY_DOCTORS,
      this.verifyAccessToken.verifyAccessToken,
      async (req, res, next) => {
        await this.checkUserRole.checkUserRole(req, res, next, "patient");
      },
      this.userController.findNearbyUsers.bind(this.userController)
    );

    //get dr details
    this.router.get(
      GET_DOCTOR_DETAILS,
      this.verifyAccessToken.verifyAccessToken,
      async (req, res, next) => {
        await this.checkUserRole.checkUserRole(req, res, next, "patient");
      },
      this.getDoctorDetailsController.getDoctorDetails.bind(
        this.getDoctorDetailsController
      )
    );

    //submit feedback
    this.router.post(
      SUBMIT_FEEDBACK,
      this.verifyAccessToken.verifyAccessToken,
      async (req, res, next) => {
        await this.checkUserRole.checkUserRole(req, res, next, "patient");
      },
      this.feedbackController.createFeedback.bind(this.feedbackController)
    );

    //get all appointments
    this.router.get(
      GET_ALL_APPOINTMENTS,
      this.verifyAccessToken.verifyAccessToken,
      async (req, res, next) => {
        await this.checkUserRole.checkUserRole(req, res, next, "patient");
      },
      this.getAllAppoinmentsController.getAllAppointments.bind(
        this.getAllAppoinmentsController
      )
    );

    //book an appointment
    this.router.post(
      BOOK_APPOINTMENT,
      this.verifyAccessToken.verifyAccessToken,
      async (req, res, next) => {
        await this.checkUserRole.checkUserRole(req, res, next, "patient");
      },
      this.bookAppointmentController.bookAppointment.bind(
        this.bookAppointmentController
      )
    );
    //get appointment by patient id
    this.router.get(
      GET_APPOINTMENT_BY_PATIENTID,
      this.verifyAccessToken.verifyAccessToken,
      async (req, res, next) => {
        await this.checkUserRole.checkUserRole(req, res, next, "patient");
      },
      this.appointmentController.getAppointmentsWithDoctorDetails.bind(
        this.appointmentController
      )
    );

    //get prescription details
    this.router.get(
      GET_PRESCRIPTION_DETAILS,
      this.verifyAccessToken.verifyAccessToken,
      async (req, res, next) => {
        await this.checkUserRole.checkUserRole(req, res, next, "patient");
      },
      this.prescriptionController.presctiptionDetails.bind(
        this.prescriptionController
      )
    );
    //reschedule
    this.router.post(
      "/reschedule-appointment",
      this.verifyAccessToken.verifyAccessToken,
      async (req, res, next) => {
        await this.checkUserRole.checkUserRole(req, res, next, "patient");
      },
      this.rescheduleAppointmentController.rescheduleAppointment.bind(
        this.rescheduleAppointmentController
      )
    );
  }

  public getRouter(): Router {
    return this.router;
  }
}

export default UserRoutes;
