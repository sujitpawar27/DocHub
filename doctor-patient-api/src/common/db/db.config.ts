import mongoose from "mongoose";
import dotenv from "dotenv";
import { Service } from "typedi";
import logger from "../logger/logger.service";
import { DATABASE_CONNECTED } from "../constants/app.constants";
dotenv.config({ path: ".env" });

const MONGO_URI: any = process.env.MONGO_URI;

@Service()
export class Database {
  constructor() {}

  private async connectDb() {
    try {
      await mongoose.connect(MONGO_URI).then(() => {
        logger.info(DATABASE_CONNECTED);
      });
    } catch (err) {
      logger.error(`Error while connecting to the database ${err}`);
      process.exit(1);
    }
  }

  getConnection() {
    this.connectDb();
  }
}
