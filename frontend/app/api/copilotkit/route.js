// Example CopilotKit API integration for frontend
import axios from "axios";

export async function getCopilotTasksAndContext(userId) {
  // Call backend CopilotKit API to get available tasks and user context
  const res = await axios.post("/api/copilotKit", { userId });
  return res.data;
}
