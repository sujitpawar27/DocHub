const {
  CopilotRuntime,
  copilotRuntimeNodeHttpEndpoint,
  GoogleGenerativeAIAdapter,
} = require("@copilotkit/runtime");

const serviceAdapter = new GoogleGenerativeAIAdapter({
  model: "gemini-2.0-flash",
  apiKey: process.env.GEMINI_API_KEY,
});

const runtime = new CopilotRuntime();

const copilotMiddleware = copilotRuntimeNodeHttpEndpoint({
  endpoint: "/copilotkit",
  runtime,
  serviceAdapter,
});

module.exports = { copilotMiddleware };
