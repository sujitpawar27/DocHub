import { Service } from "typedi";
import feedbackModel from "../../../common/models/feedback.model";

@Service()
export class FeedbackService {
  async createFeedback(appointmentId: string, review: string, rating: number) {
    try {
      const feedback = new feedbackModel({
        appointmentId,
        review,
        rating,
      });
      await feedback.save();
      return feedback;
    } catch (error) {
      throw error;
    }
  }
}
