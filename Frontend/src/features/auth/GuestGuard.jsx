import { useSelector } from "react-redux";
import { Navigate } from "react-router";

/**
 * GuestGuard — wraps public routes like sign-in and sign-up.
 * If the user already has an access token (still logged in),
 * automatically redirect them to /workspace instead of showing the login form.
 */
const GuestGuard = ({ children }) => {
  const accessToken = useSelector((state) => state.auth.accessToken);

  if (accessToken) {
    return <Navigate to="/workspace" replace />;
  }

  return children;
};

export default GuestGuard;
