import { Request, Response } from "express";
import { Service } from "typedi";
import bcrypt from "bcrypt";
import { validationResult, body } from "express-validator";
import jwt from "jsonwebtoken";
import logger from "../../../common/logger/logger.service";
import UserModel from "../../../common/models/user.model";
import SessionModel from "../../../common/models/session.model";
import { EmailService } from "../../../common/email/email.service";
import { CreateAccessToken } from "../../common/middleware/create-access-token";
import { CreateRefreshToken } from "../../common/middleware/create-refresh-token";
import {
  USER_ALREADY_EXISTS,
  USER_REGISTERATION_ERROR,
  USER_REGISTERED_SUCCESSFULLY,
  VALIDATION_ERROR,
} from "../../../common/constants/app.constants";
const SECRET_KEY = "ADMIN";

interface RegisterResult {
  success: boolean;
  message?: string;
  user?: any;
  accessToken?: any;
  refreshToken?: any;
}

@Service()
class AuthregisterService {
  constructor(
    private readonly emailService: EmailService,
    private createAccessToken: CreateAccessToken,
    private createRefreshToken: CreateRefreshToken
  ) {}

  public register = async (
    req: Request,
    res: Response
  ): Promise<RegisterResult> => {
    try {
      await Promise.all([
        body("firstName")
          .notEmpty()
          .withMessage("First Name is required")
          .run(req),
        body("lastName")
          .notEmpty()
          .withMessage("Last Name is required")
          .run(req),
        body("email").isEmail().withMessage("Invalid email").run(req),
        body("password")
          .isLength({ min: 6 })
          .withMessage("Password must be at least 6 characters")
          .run(req),
        body("role").notEmpty().withMessage("Role is required").run(req),
      ]);

      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        logger.error(VALIDATION_ERROR, errors.array());
        return {
          success: false,
          message: VALIDATION_ERROR,
        };
      }

      // Extract fields from request body
      const {
        firstName,
        lastName,
        email,
        password,
        role,
        resetToken,
        specialization,
        experience,
        mobileNumber,
        address,
        profilePicUrl,
      } = req.body;

      // Check if user already exists
      const existingUser = await UserModel.findOne({ email });

      if (existingUser) {
        logger.info(USER_ALREADY_EXISTS, existingUser);
        return { success: false, message: USER_ALREADY_EXISTS };
      } else {
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = new UserModel({
          firstName,
          lastName,
          email,
          password: hashedPassword,
          role,
          resetToken,
          specialization,
          experience,
          mobileNumber,
          address,
          profilePicUrl,
        });

        // Save the user
        const savedUser = await newUser.save();

        logger.info(USER_REGISTERED_SUCCESSFULLY, savedUser);

        // Send welcome email
        const userEmail = newUser.email; // Use the correct user email
        // this.emailService.sendWelcomeEmail(userEmail);
        this.emailService.sendDynamicEmail({
          template: "welcome",
          userEmail: userEmail,
        });

        //create accesstoken and refreshtoken
        const accesstoken = this.createAccessToken.createAccessToken(
          savedUser.id
        );
        const refreshtoken = this.createRefreshToken.createRefreshToken(
          savedUser.email,
          savedUser.password
        );

        await SessionModel.findOneAndDelete({ email: savedUser.email });
        await SessionModel.create({
          email: savedUser.email,
          accesstoken,
          refreshtoken,
          role: savedUser.role,
        });

        // Create a response data object without the password
        const responseData: RegisterResult = {
          success: true,
          user: {
            // Include all user properties except the password
            userId: savedUser._id,
            firstName: savedUser.firstName,
            lastName: savedUser.lastName,
            name: savedUser.name,
            email: savedUser.email,
            role: savedUser.role,
            resetToken: savedUser.resetToken,
            specialization: savedUser.specialization,
            experience: savedUser.experience,
            mobileNumber: savedUser.mobileNumber,
            address: savedUser.address,
            profilePicUrl: savedUser.profilePicUrl,
          },
          accessToken: accesstoken,
          refreshToken: refreshtoken,
        };

        return responseData;
      }
    } catch (error) {
      logger.error(USER_REGISTERATION_ERROR, error);
      return { success: false };
    }
  };
}

export default AuthregisterService;
