import api from "./api";

export const registerUser = async (name, email, password, role) => {
  const response = await api.post("/auth/register", {
    name,
    email,
    password,
    role,
  });
  return response.data;
};

export const loginUser = async (email, password) => {
  const response = await api.post("/auth/login", { email, password });
  return response.data;
};

export const fetchProfile = async () => {
  const response = await api.get("/auth/profile");
  return response.data;
};

export const updateProfile = async (profileData) => {
  const response = await api.put("/auth/profile", profileData);
  return response.data;
};
