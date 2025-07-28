import axios from "axios";

const BASE_URI = process.env.NEXT_PUBLIC_API_URL + "/slots";

export const generateSlot = async (data) => {
    const token = localStorage.getItem("token");
  const res = await axios.post(`${BASE_URI}/generate`, data, {
    headers: { Authorization: `Bearer ${token}` },
});
  return res.data;
};


export async function getDoctorSlots(doctorId) {
  const token = localStorage.getItem("token");
  const res = await axios.get(`${BASE_URI}/getslotsbyid?doctorId=${doctorId}`, {
    headers: { Authorization: `Bearer ${token}` },
});
return res.data;
}

export async function getDoctorSlotsOnDemand({ doctorId, date, type = 'inperson', slotDuration = 30 }) {
  const token = localStorage.getItem("token");
  const res = await axios.get(`${BASE_URI}/ondemand`, {
    params: { doctorId, date, type, slotDuration },
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}