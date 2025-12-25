import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./AuthProvider";
import Loading from "../../Pages/Loading";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <Loading />;

  if (user) return children;

  return <Navigate to="/auth/login" />;
};

export default PrivateRoute;