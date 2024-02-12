import "reflect-metadata";
import Container, { Service } from "typedi";
import express, { Request, Response, Application, NextFunction } from "express";
import { Database } from "./common/db/db.config";
import logger, { httpLoggerMiddleware } from "./common/logger/logger.service";
import cors from "cors";
import AuthRoutes from "./domains/auth/routes/auth.routes";
import UserRoutes from "./domains/patient/routes/patient.routes";
import { DoctorRoutes } from "./domains/doctor/routes/doctor.routes";
import {
  BASE_ENDPOINT_FOR_AUTH,
  PAGE_NOT_FOUND,
} from "../src/common/constants/app.constants";
import { BASE_ENDPOINT_FOR_USER } from "../src/common/constants/app.constants";
import { initializeApp, applicationDefault } from "firebase-admin/app";
process.env.GOOGLE_APPLICATION_CREDENTIALS;

@Service()
export class Main {
  app: Application = express();
  port: any = process.env.PORT;
  db = Container.get(Database);

  constructor(
    private authRoutes: AuthRoutes,
    private userRoutes: UserRoutes,
    private doctorRoutes: DoctorRoutes
  ) {
    this.middlewares();
    this.addAllRoutes();
    this.globalApiHandler();
    this.initializeFirebase();
  }

  middlewares() {
    this.app.use(express.json());
    this.app.use(cors());
    this.app.use(httpLoggerMiddleware);
  }

  private addAllRoutes() {
    this.app.use(BASE_ENDPOINT_FOR_AUTH, this.authRoutes.getRouter());
    this.app.use(BASE_ENDPOINT_FOR_USER, this.userRoutes.getRouter());
    this.app.use(BASE_ENDPOINT_FOR_USER, this.doctorRoutes.getRouter());
  }

  private globalApiHandler() {
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      res.status(404).json({ error: { message: PAGE_NOT_FOUND } });
    });
  }

  private initializeFirebase() {
    initializeApp({
      credential: applicationDefault(),
    });
  }

  startServer() {
    this.db.getConnection();
    this.app.listen(this.port, () => {
      logger.info(`Server started at PORT ${this.port}`);
    });
  }
}

Container.get(Main).startServer();
