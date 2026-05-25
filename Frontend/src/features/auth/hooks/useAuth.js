import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { register as registerApi, verifyOTP as verifyOtpApi, login as loginApi } from "../services/auth.api";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { setUser, setAccessToken } from "../auth.slice";

// Custom Hook: User Registration
export function useRegister() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: registerApi,
    onSuccess: (data, variables) => {
      dispatch(setUser(
        {
            email: variables.email,
        }
      ));
      queryClient.setQueryData(["register-email"], variables.email);
      navigate("/verify-otp");
    },
    onError: (error) => {
      console.log(error);
    }
  });
}

// Custom Hook: OTP Verification
export function useVerifyOtp() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const dispatch = useDispatch()

  return useMutation({
    mutationFn: verifyOtpApi,
    onSuccess: (response) => {
      // The backend ApiResponse wraps payload inside .data ({ user, token })
      const { user, token } = response.data || {};
      
      console.log({
        id: user?._id,
        email: user?.email,
        username: user?.username
      });
      
      dispatch(setUser({
        id: user?._id,
        email: user?.email,
        username: user?.username
      }));
      
      dispatch(setAccessToken(token));      
      queryClient.removeQueries({ queryKey: ["register-email"] });
      navigate("/workspace");
    },
    onError: (error) => {
      console.log(error);
    }
  });
}

export function useLogin(){
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    return useMutation({
        mutationFn: loginApi,
        onSuccess: (response) => {
            const { user, token } = response.data || {};
            console.log(user);
            dispatch(setUser({
                id: user?._id,
                email: user?.email,
                username: user?.username
            }));
            dispatch(setAccessToken(token));
            navigate("/workspace");
        },
        onError: (error) => {
            console.log(error);
        }
    });
}