 import api from "./api";

export const updateProfile = async (profileData) => {
  const { data } = await api.put("/settings/profile", profileData);
  return data;
};

export const updatePassword = async (passwordData) => {
  const { data } = await api.put("/settings/password", passwordData);
  return data;
};