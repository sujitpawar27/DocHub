import { Request, Response } from "express";
import * as nodemailer from "nodemailer";
import { Service } from "typedi";
import logger from "../logger/logger.service";

interface EmailServiceOptions {
  template:
    | "welcome"
    | "forgotPassword"
    | "appointment"
    | "appointment-accepted"
    | "appointment-cancelled";
  userEmail: string;
  resetToken?: string;
}

@Service()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "sujitpawar074@gmail.com",
        pass: "jyju itae gnla nhdc", // Replace with your email password
      },
    });
  }

  private sendEmail(
    options: { subject: string; html: string },
    userEmail: string
  ): void {
    const mailOptions: nodemailer.SendMailOptions = {
      from: "sujitpawar074@gmail.com",
      to: userEmail,
      subject: options.subject,
      html: options.html,
    };

    this.transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        logger.error(
          `Error sending email - Subject: ${options.subject}`,
          error
        );
      } else {
        logger.info(
          `Email sent successfully - Subject: ${options.subject}`,
          info.response
        );
      }
    });
  }

  public sendDynamicEmail(options: EmailServiceOptions): void {
    if (options.template === "welcome") {
      this.sendEmail(
        {
          subject: "Welcome",
          html: ` <div class="container">
        <h2>Dear User,</h2>
        <p> <strong>Thank You for Registering with MBDocHub!</strong></p>
        <p>We are thrilled to welcome you to our community. Your registration is now complete, and you are all set to explore the world of MBDocHub.</p>
        <p><strong>MBDocHub - Your Health, Your Way</strong></p>
        <p>Here's to a healthier and happier journey ahead. If you have any questions or need assistance, feel free to reach out to our support team.</p>
        <p>Thank you once again for choosing MBDocHub!</p>
        <p class="thank-you">Best Regards,<br>Team MBDocHub </p>
      </div>`,
        },
        options.userEmail
      );
    } else if (options.template === "forgotPassword") {
      const resetLink = `http://localhost:3000/reset-password/${options.resetToken}/${options.userEmail}`;
      this.sendEmail(
        {
          subject: "Reset Your Password",
          html: `<div class="container">
          <h2>Password Reset</h2>
          <p>Dear User,</p>
          <p>You have requested to reset your password. Click the link below to reset it:</p>
          <a class="reset-link" href="${resetLink}">Reset Password</a>
          <p>If you did not request this, please ignore this email.</p>
          <p>This link is only valid for 10 minutes </p>
          <p>Best regards,<br>Team MBDocHub</p>
        </div>
        `,
        },
        options.userEmail
      );
    } else if (options.template === "appointment") {
      this.sendEmail(
        {
          subject: "You have an appointment",
          html: `<p>You have an scheduled appointment </p>`,
        },
        options.userEmail
      );
    } else if (options.template === "appointment-accepted") {
      this.sendEmail(
        {
          subject: "Appointment Confirmed",
          html: ` <p>Dear User,</p>
          <p>Your appointment has been confirmed.</p>
          <p class="confirmation-message">Thank you for choosing us! We look forward to seeing you.</p>
          <p>If you have any questions or need to reschedule, please contact us.</p>
          <p>Best regards,<br>MBDochHub Team</p>`,
        },
        options.userEmail
      );
    } else if (options.template === "appointment-cancelled") {
      this.sendEmail(
        {
          subject: "Appointment Cancelled",
          html: `<p>Your scheduled appointment has been cancelled.</p>
          <p>If you have any questions, please contact us.</p>
          <p>Best regards,<br>MBDochHub Team</p>
          <p>We look forward to seeing you again</p>`,
        },
        options.userEmail
      );
    } else {
      logger.error("Invalid email template.");
    }
  }
}
