import axios from "axios";

const BASE_URI = process.env.NEXT_PUBLIC_API_URL + "/doctor";

export const getPatients = async (params = {}) => {
  const res = await axios.get(`${BASE_URI}/patients`, { params });
  return res.data;
};

export const getPatientHistory = async (patientId) => {
  const token = localStorage.getItem("token");
  const res = await axios.get(`${BASE_URI}/patients/${patientId}/history`,
    {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const getAttendedPatients = async () => {
  const token = localStorage.getItem("token");
  const BASE_URI = process.env.NEXT_PUBLIC_API_URL + "/appointment";
  const res = await axios.get(`${BASE_URI}/appointments/attended-patients`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}; 