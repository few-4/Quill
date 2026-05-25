import api from "../../../app/axios.api";

//Register Function
export async function register({ username, email, fullname, password }) {
  const response = await api.post("auth/register", {
    username,
    email,
    fullname,
    password
  });
  return response.data;
}

//Verify OTP Function
export async function verifyOTP({email, otp}) {
  const response = await api.post("auth/verify-otp", {
    email,
    otp
  });
  return response.data;
}

export async function login({email, password}) {
    const response = await api.post("auth/login", {
        email,
        password
    })
    return response.data;
}

export async function getMe() {
    const response = await api.get("auth/get-me");
    return response.data;
}