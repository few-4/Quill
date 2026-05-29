import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router";

/**
 * AuthGuard — wraps protected routes.
 * If the user has no access token, redirect to the sign-in page,
 * preserving where they were trying to go so we can redirect back after login.
 */
const AuthGuard = ({ children }) => {
  const accessToken = useSelector((state) => state.auth.accessToken);
  const location = useLocation();

  if (!accessToken) {
    return <Navigate to="/sign-in" state={{ from: location }} replace />;
  }

  return children;
};

export default AuthGuard;
