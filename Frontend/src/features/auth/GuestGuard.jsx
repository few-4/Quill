import { useSelector } from "react-redux";
import { Navigate } from "react-router";


const GuestGuard = ({ children }) => {
  const accessToken = useSelector((state) => state.auth.accessToken);

  if (accessToken) {
    return <Navigate to="/workspace" replace />;
  }

  return children;
};

export default GuestGuard;
