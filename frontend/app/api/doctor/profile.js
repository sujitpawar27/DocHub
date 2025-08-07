import axios from "axios";

const BASE_URI = process.env.NEXT_PUBLIC_API_URL + "/doctor";

export const getProfile = async (id) => {
  const token = localStorage.getItem("token");
  const res = await axios.get(`${BASE_URI}/me/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const updateProfile = async (profileData) => {
  const token = localStorage.getItem("token");
  console.log("profileData", profileData);

  const res = await axios.put(`${BASE_URI}/me`, profileData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const uploadAvatar = async (formData) => {
  const token = localStorage.getItem("token");
  const res = await axios.post(`${BASE_URI}/me/avatar`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const updateAvailability = async (doctorId, isAvailable) => {
  const token = localStorage.getItem("token");
  const res = await axios.put(
    `${BASE_URI}/${doctorId}/availability`,
    { isAvailable },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return res.data;
};

export const getStats = async () => {
  const token = localStorage.getItem("token");
  const res = await axios.get(`${BASE_URI}/stats`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const fetchdoctoravailability = async (doctorId) => {
  const token = localStorage.getItem("token");
  const res = await axios.get(`${BASE_URI}/${doctorId}/availability`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
