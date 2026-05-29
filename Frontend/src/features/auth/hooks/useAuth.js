import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  register as registerApi,
  verifyOTP as verifyOtpApi,
  login as loginApi,
  logout as logoutApi,
  getMe,
  forgotPassword as forgotPasswordApi,
  resetPassword as resetPasswordApi,
} from "../services/auth.api";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { setUser, setAccessToken, setLoggedOut } from "../auth.slice";

export const useAuth = () => {

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  const handleRegister = () => useMutation({
    mutationFn: registerApi,
    onSuccess: (data, variables) => {
      dispatch(setUser({ email: variables.email }));
      queryClient.setQueryData(["register-email"], variables.email);
      navigate("/verify-otp");
    },
    onError: (error) => {
      console.error("Register error:", error?.response?.data?.message || error.message);
    },
  });

  const handleLogin = () => useMutation({
    mutationFn: loginApi,
    onSuccess: (response) => {
      const { user, token } = response.data || {};
      dispatch(setUser({
        id: user?._id,
        email: user?.email,
        username: user?.username,
        fullname: user?.fullname,
      }));
      dispatch(setAccessToken(token));
      navigate("/workspace");
    },
    onError: (error) => {
      console.error("Login error:", error?.response?.data?.message || error.message);
    },
  });

  const handleVerifyOTP = () => useMutation({
    mutationFn: verifyOtpApi,
    onSuccess: (response) => {
      const { user, token } = response.data || {};
      dispatch(setUser({
        id: user?._id,
        email: user?.email,
        username: user?.username,
        fullname: user?.fullname,
      }));
      dispatch(setAccessToken(token));
      queryClient.removeQueries({ queryKey: ["register-email"] });
      navigate("/workspace");
    },
    onError: (error) => {
      console.error("OTP error:", error?.response?.data?.message || error.message);
    },
  });

  const handleGetMe = () => useQuery({
    queryKey: ["getMe"],
    queryFn: async () => {
      const response = await getMe();
      const user = response.data;
      dispatch(setUser({
        id: user?.userId,
        email: user?.email,
        username: user?.username,
        fullname: user?.fullname,
      }));
      return response;
    },
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  const handleLogout = () => useMutation({
    mutationFn: logoutApi,
    onSuccess: () => {
      dispatch(setLoggedOut());
      queryClient.clear();
      navigate("/sign-in");
    },
    onError: () => {
      dispatch(setLoggedOut());
      queryClient.clear();
      navigate("/sign-in");
    },
  });

  const handleForgotPassword = () => useMutation({
    mutationFn: forgotPasswordApi,
    onError: (error) => {
      console.error("Forgot password error:", error?.response?.data?.message || error.message);
    },
  });

  const handleResetPassword = () => useMutation({
    mutationFn: resetPasswordApi,
    onError: (error) => {
      console.error("Reset password error:", error?.response?.data?.message || error.message);
    },
  });

  return { handleRegister, handleLogin, handleVerifyOTP, handleGetMe, handleLogout, handleForgotPassword, handleResetPassword };
};