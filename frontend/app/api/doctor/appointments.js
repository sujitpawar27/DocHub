import axios from "axios";
const BASE_URI = process.env.NEXT_PUBLIC_API_URL ;

export const getAppointments = async (tab) => {
  const token = localStorage.getItem("token");
  const res = await axios.get(`${BASE_URI}/appointment/appointments`, {
    params: tab ? { tab } : {},
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};


export const updateAppointmentStatus = async (appointmentId, status) => {
  const token = localStorage.getItem("token");

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