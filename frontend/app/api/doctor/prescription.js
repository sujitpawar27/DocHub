import axios from "axios";

const BASE_URI = process.env.NEXT_PUBLIC_API_URL + "/doctor";

export const createPrescription = async (data) => {
  const token = localStorage.getItem("token");
  const res = await axios.post(`${BASE_URI}/prescription`, data,{
      headers: { Authorization: `Bearer ${token}` },
    });
  return res.data;
}; 

export const getPrescriptions = async (id) => {
  const token = localStorage.getItem("token");  
  const res = await axios.get(`${BASE_URI}/prescription/${id}`,{
      headers: { Authorization: `Bearer ${token}` },
    });
  return res.data;
}; 

export const updatePrescription = async (data) => {
  const token = localStorage.getItem("token");
  const res = await axios.put(`${BASE_URI}/prescription/${id}`, data,{
      headers: { Authorization: `Bearer ${token}` },
    });
  return res.data;
}; 
