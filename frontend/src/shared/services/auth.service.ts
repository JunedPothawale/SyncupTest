import API from "./axios.service";

export const loginUser = async (data: { email: string; password: string }) => {
  const res = await API.post("/auth/login", data);
  return res.data;
};

export const registerUser = async (data: any) => {
  const res = await API.post("/auth/register", data);
  return res.data;
};

export const getMe = async () => {
  try {
    const res = await fetch("/api/auth/me");
    return res.body;
  } catch {
    console.log(false)
    return false;
  }

};

export const checkAuth = async () => {
  try {
    const res = await fetch("/api/auth/me");
    return true;
  } catch {
    console.log(false)
    return false;
  }
};
export const logoutUser = async () => {
  try {
    await API.post("/auth/logout");
    return true;
  } catch {
    await API.post("/auth/logout");
    return false;
  }
};
