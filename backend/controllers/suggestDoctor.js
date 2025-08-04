// suggestDoctor.js
const axios = require("axios");
const User = require("../models/User");

// --- Configuration (Could be moved to a separate file, e.g., config.json) ---
const SPECIALIZATIONS = [
  "Psychiatrist",
  "Gynecologist",
  "Dermatologist",
  "Orthopaedics",
  "General Physician",
];
const SIMILARITY_THRESHOLD = 0.7; // Minimum score to be considered a confident match

// --- In-memory cache for specialization embeddings ---
let specializationEmbeddingsCache = {};

// --- Helper Functions ---

function cosineSimilarity(a, b) {
  const dot = a.reduce((sum, v, i) => sum + v * b[i], 0);
  const magA = Math.sqrt(a.reduce((sum, v) => sum + v * v, 0));
  const magB = Math.sqrt(b.reduce((sum, v) => sum + v * v, 0));
  if (magA === 0 || magB === 0) return 0; // Avoid division by zero
  return dot / (magA * magB);
}

async function getGeminiEmbedding(text) {
  // CORRECTED: Define modelName within the function's scope
  const modelName = "embedding-001";
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable not set.");
  }

  // CORRECTED: Use the correct API endpoint for embedContent
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:embedContent?key=${apiKey}`;

  try {
    const response = await axios.post(url, {
      content: {
        parts: [{ text: text }],
      },
    });
    // Assuming the response structure is correct
    return response.data.embedding.values;
  } catch (err) {
    console.error("Gemini API error:", err.response?.data || err.message);
    throw new Error("Failed to get embedding from Gemini API");
  }
}

// --- Initialization Function ---
// This function should be called once when your server starts up.
async function initializeSpecializations() {
  console.log("Initializing and caching specialization embeddings...");
  const tempCache = {};
  for (const spec of SPECIALIZATIONS) {
    try {
      // Line 65: getGeminiEmbedding(spec) is called here
      const embedding = await getGeminiEmbedding(spec);
      tempCache[spec] = embedding;
      console.log(`- Cached embedding for: ${spec}`);
    } catch (error) {
      // The error is logged here
      console.error(`Failed to create embedding for ${spec}. Skipping.`, error);
    }
  }
  specializationEmbeddingsCache = tempCache;
  console.log("Initialization complete.");
}

// --- Main Handler ---
async function suggestDoctor({ condition }) {
  try {
    if (Object.keys(specializationEmbeddingsCache).length === 0) {
      throw new Error(
        "Specialization embeddings are not initialized. Please run initializeSpecializations() on server start."
      );
    }

    const userEmbedding = await getGeminiEmbedding(condition);

    let bestSpecialization = null;
    let bestScore = -Infinity;

    for (const [spec, emb] of Object.entries(specializationEmbeddingsCache)) {
      const score = cosineSimilarity(userEmbedding, emb);
      console.log(`Similarity with ${spec}:`, score);
      if (score > bestScore) {
        bestScore = score;
        bestSpecialization = spec;
      }
    }

    // 3. Apply threshold logic
    let matchedSpecialization = bestSpecialization;
    if (bestScore < SIMILARITY_THRESHOLD) {
      console.log(
        `Best score ${bestScore} is below threshold ${SIMILARITY_THRESHOLD}. Defaulting to General Physician.`
      );
      matchedSpecialization = "General Physician";
    }

    console.log("Best match:", matchedSpecialization, "Score:", bestScore);

    // 4. Query doctors
    const doctors = await User.find({
      role: "doctor",
      specialization: matchedSpecialization,
    })
      .select("fullName specialization")
      .limit(5); // Increased limit slightly

    if (!doctors.length) {
      return {
        message: `We recommend a ${matchedSpecialization}, but no doctors were found in our system for this specialty.`,
        specialization: matchedSpecialization,
        doctors: [],
      };
    }

    return { specialization: matchedSpecialization, doctors };
  } catch (err) {
    console.error("suggestDoctor error:", err);
    return {
      message: "Error suggesting a doctor. Please try again later.",
      error: err.message,
    };
  }
}

module.exports = {
  suggestDoctor,
  initializeSpecializations, // Export this to be called at server startup
};
