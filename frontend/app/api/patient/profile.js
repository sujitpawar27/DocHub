const axios = require("axios");

const BASE_URI = process.env.NEXT_PUBLIC_API_URL + "/patient";

exports.updateProfile = async (userData) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.put(`${BASE_URI}/me`, userData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Update profile error:",
      error.response?.data || error.message
    );
    throw error;
  }
};

exports.getProfile = async (id) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get(`${BASE_URI}/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Get profile error:", error.response?.data || error.message);
    throw error;
  }
};

exports.getRecentConsultedDoctors = async () => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get(`${BASE_URI}/recent-doctors`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Get recent doctors error:",
      error.response?.data || error.message
    );
    throw error;
  }
};
