const axios = require("axios");

const BASE_URI = process.env.NEXT_PUBLIC_API_URL ;

exports.getAllDoctors = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(`${BASE_URI}/patient/doctors`, {
          headers: { Authorization: `Bearer ${token}` },
      });
      console.log("response",response);
      
      return response.data;
    } catch (error) {
          console.error("Update profile error:", error.response?.data || error.message);
      throw error;
    }
  };

  exports.bookAppointment = async (payload) => {
    const token = localStorage.getItem("token");
    console.log("payload",payload);
    try {
  const res = await axios.post(`${BASE_URI}/appointment/appointment`, payload,{
    headers: { Authorization: `Bearer ${token}` },
  });
 return res.data;
} catch (error) {
    console.error("Update profile error:", error.response?.data || error.message);
  throw error;
}
};

exports.getPatientAppointments = async (tab) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get(`${BASE_URI}/appointment/appointments/patient${tab ? `?tab=${tab}` : ''}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Fetch patient appointments error:", error.response?.data || error.message);
    throw error;
  }
};

exports.getHealthHistory = async () => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get(`${BASE_URI}/patient/health-history`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Fetch health history error:", error.response?.data || error.message);
    throw error;
  }
};

exports.getPrescriptionById = async (id) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get(`${BASE_URI}/patient/prescription/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Fetch prescription by id error:", error.response?.data || error.message);
    throw error;
  }
};


exports.updateAppointmentStatus = async (appointmentId, status) => {
  const token = localStorage.getItem("token");
  console.log("appointmentId",appointmentId);
  
  const res = await axios.put(
    `${BASE_URI}/appointment/appointments/${appointmentId}/status`,
    { status },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};