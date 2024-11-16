import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

interface PrivateRouteProps {
  children: JSX.Element;
  role: "student" | "therapist";
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, role }) => {
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user?.role === role) {
      // Ensure the role matches before rendering the component
    }
  }, [user, isAuthenticated, role]);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (user?.role !== role) {
    return <Navigate to="/" />;
  }

  return children;
};

export default PrivateRoute;
