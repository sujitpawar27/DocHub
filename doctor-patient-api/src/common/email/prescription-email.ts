import puppeteer from "puppeteer";
import nodemailer from "nodemailer";
import { user } from "firebase-functions/v1/auth";
import userModel from "../models/user.model";
import AppointmentModel from "../models/appointment.model";

interface PrescriptionItem {
  medicineName: string;
  medicineType: string;
  numberOfTablets: string;
  frequency: {
    daily: boolean;
    weekly: boolean;
    monthly: boolean;
  };
  dose: {
    breakfast: boolean;
    lunch: boolean;
    dinner: boolean;
  };
  timing: {
    afterFood: boolean;
    beforeFood: boolean;
  };
  notes: string;
}

interface User {
  email: string;
}

async function generatePDF(htmlContent: string): Promise<Buffer> {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(htmlContent);
  const pdfBuffer = await page.pdf();
  await browser.close();
  return pdfBuffer;
}

async function sendMail(user: User, items: PrescriptionItem[]) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "sujitpawar074@gmail.com",
      pass: "jyju itae gnla nhdc",
    },
  });

  const htmlContent = generateEmailContent(items);
  const pdfBuffer = await generatePDF(htmlContent);

  const mailOptions = {
    from: "sujitpawar074@gmail.com",
    to: user.email,
    subject: "Prescription Details",
    text: "Please find the prescription details attached.",
    attachments: [
      {
        filename: "prescription.pdf",
        content: pdfBuffer,
        encoding: "base64",
      },
    ],
  };
  const userDetails = await userModel.findOne({ email: user.email });

  // Check if user details are found
  if (userDetails) {
    // Extract user name and age
    const userName = userDetails.firstName;
    const userId = userDetails._id;
  }

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
  }
}

function generateEmailContent(items: PrescriptionItem[]): string {
  const itemsList = items
    .map(
      (item, index) => `
        <div style="border: 1px solid #ccc; padding: 10px; margin-bottom: 20px;">
          <h3 style="color: #007BFF;">Prescription ${index + 1}</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="border: 1px solid #ccc; padding: 8px;"><strong>Medicine Name:</strong></td>
              <td style="border: 1px solid #ccc; padding: 8px;">${
                item.medicineName
              }</td>
            </tr>
            <tr>
              <td style="border: 1px solid #ccc; padding: 8px;"><strong>Medicine Type:</strong></td>
              <td style="border: 1px solid #ccc; padding: 8px;">${
                item.medicineType
              }</td>
            </tr>
            <tr>
              <td style="border: 1px solid #ccc; padding: 8px;"><strong>Number of Tablets:</strong></td>
              <td style="border: 1px solid #ccc; padding: 8px;">${
                item.numberOfTablets
              }</td>
            </tr>
            <tr>
              <td style="border: 1px solid #ccc; padding: 8px;"><strong>Frequency:</strong></td>
              <td style="border: 1px solid #ccc; padding: 8px;">
                Daily - ${item.frequency.daily ? "Yes" : "No"}, 
                Weekly - ${item.frequency.weekly ? "Yes" : "No"}, 
                Monthly - ${item.frequency.monthly ? "Yes" : "No"}
              </td>
            </tr>
            <tr>
              <td style="border: 1px solid #ccc; padding: 8px;"><strong>Dose:</strong></td>
              <td style="border: 1px solid #ccc; padding: 8px;">
                Breakfast - ${item.dose.breakfast ? "Yes" : "No"}, 
                Lunch - ${item.dose.lunch ? "Yes" : "No"}, 
                Dinner - ${item.dose.dinner ? "Yes" : "No"}
              </td>
            </tr>
            <tr>
              <td style="border: 1px solid #ccc; padding: 8px;"><strong>Timing:</strong></td>
              <td style="border: 1px solid #ccc; padding: 8px;">
                After Food - ${item.timing.afterFood ? "Yes" : "No"}, 
                Before Food - ${item.timing.beforeFood ? "Yes" : "No"}
              </td>
            </tr>
            <tr>
              <td style="border: 1px solid #ccc; padding: 8px;"><strong>Doctor Note:</strong></td>
              <td style="border: 1px solid #ccc; padding: 8px;">${
                item.notes
              }</td>
            </tr>
          </table>
        </div>
      `
    )
    .join("");

  return `
    <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #007BFF; color: #fff; text-align: center; padding: 20px;">
        <h2 style="margin: 0;">MBDocHub Prescription Details</h2>
      </div>
      ${itemsList}
    </div>
  `;
}

export default sendMail;
