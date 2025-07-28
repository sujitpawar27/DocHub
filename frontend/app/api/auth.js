const axios = require("axios");

const BASE_URI = "http://localhost:5000/api/auth";

// Register API
exports.register = async (userData) => {
  try {
    const response = await axios.post(`${BASE_URI}/register`, userData);
    return response.data;
  } catch (error) {
    console.error("Register error:", error.response?.data || error.message);
    throw error;
  }
};

// Login API
exports.login = async (credentials) => {
  try {
    const response = await axios.post(`${BASE_URI}/login`, credentials);
    return response.data;
  } catch (error) {
    console.error("Login error:", error.response?.data || error.message);
    throw error;
  }
};
