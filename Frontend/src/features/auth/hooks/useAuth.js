import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  register as registerApi,
  login as loginApi,
  logout as logoutApi,
  getMe,
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
    onError: () => {},
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
    onError: () => {},
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

  return { handleRegister, handleLogin, handleGetMe, handleLogout };
};