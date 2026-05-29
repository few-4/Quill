import api from "../../../app/axios.api";

// Register a new user
export async function register({ username, email, fullname, password }) {
  const response = await api.post("auth/register", { username, email, fullname, password });
  return response.data;
}

// Verify email OTP after registration
export async function verifyOTP({ email, otp }) {
  const response = await api.post("auth/verify-otp", { email, otp });
  return response.data;
}

// Resend OTP to email
export async function resendOTP({ email }) {
  const response = await api.post("auth/resend-otp", { email });
  return response.data;
}

// Login with email and password
export async function login({ email, password }) {
  const response = await api.post("auth/login", { email, password });
  return response.data;
}

// Logout the current user (clears refresh token cookie on the server)
export async function logout() {
  const response = await api.post("auth/logout");
  return response.data;
}

// Get the current authenticated user's profile
export async function getMe() {
  const response = await api.get("auth/get-me");
  return response.data;
}

export async function forgotPassword({ email }) {
  const response = await api.post("auth/forgot-password", { email });
  return response.data;
}

export async function resetPassword({ email, otp, password }) {
  const response = await api.post("auth/reset-password", { email, otp, password });
  return response.data;
}