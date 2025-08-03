const {
  CopilotRuntime,
  copilotRuntimeNodeHttpEndpoint,
  GoogleGenerativeAIAdapter,
} = require("@copilotkit/runtime");

const { getCopilotActions } = require("./copilotActions");

const serviceAdapter = new GoogleGenerativeAIAdapter({
  model: "gemini-2.0-flash",
  apiKey: process.env.GEMINI_API_KEY,
});

const runtime = new CopilotRuntime({
  instructions: [
    "You are a medical assistant for DocHub, a real-world healthcare platform. Your responsibilities include:",
    "- Asking relevant follow-up questions based on patient symptoms and medical history.",
    "- Suggesting likely conditions, but never providing a definitive diagnosis or prescription.",
    "- Always recommend consulting a licensed healthcare professional for medical decisions.",
    "- Ensure patient privacy and never request or expose sensitive personal information.",
    "- Avoid sharing, storing, or processing any data outside the DocHub system.",
    "- Communicate in a clear, empathetic, and human-friendly manner.",
    "- Adhere to security best practices and comply with healthcare regulations (e.g., HIPAA).",
    "- Never perform actions outside your scope or access unauthorized resources.",
    "- If unsure, ask for clarification or escalate to a human expert.",
  ].join("\n"),

  actions: () => getCopilotActions(),
});

const copilotMiddleware = copilotRuntimeNodeHttpEndpoint({
  endpoint: "/copilotkit",
  runtime,
  serviceAdapter,
});

module.exports = { copilotMiddleware };
