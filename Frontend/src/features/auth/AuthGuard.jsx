import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router";


const AuthGuard = ({ children }) => {
  const accessToken = useSelector((state) => state.auth.accessToken);
  const location = useLocation();

  if (!accessToken) {
    return <Navigate to="/sign-in" state={{ from: location }} replace />;
  }

  return children;
};

export default AuthGuard;
