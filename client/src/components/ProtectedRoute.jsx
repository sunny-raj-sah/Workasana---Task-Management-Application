import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { state } = useAuth();

  if (state.loading) {
    return (
      <div className="vh-100 d-flex justify-content-center align-items-center">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3"></div>
          <div>Loading...</div>
        </div>
      </div>
    );
  }

  return state.isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;