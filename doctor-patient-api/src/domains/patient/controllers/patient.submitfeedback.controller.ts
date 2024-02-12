import { Service } from "typedi";
import { Request, Response } from "express";
import { FeedbackService } from "../services/patient.submitfeedback.service";
import { INTERNAL_SERVER_ERROR } from "../../../common/constants/app.constants";

@Service()
export class FeedbackController {
  constructor(private feedbackService: FeedbackService) {}

  async createFeedback(req: Request, res: Response) {
    try {
      const { appointmentId, review, rating } = req.body;
      const feedback = await this.feedbackService.createFeedback(
        appointmentId,
        review,
        rating
      );
      res.status(201).json({ success: true, data: feedback });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: INTERNAL_SERVER_ERROR });
    }
  }
}
