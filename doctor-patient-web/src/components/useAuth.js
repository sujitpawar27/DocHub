// Create a new file for the custom hook, e.g., useAuth.js
import { useSelector } from "react-redux";
import { Navigate, Route } from "react-router-dom";

const useAuth = (Component) => {
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);

  return isAuthenticated ? Component : <Navigate to="/login" />;
};

export default useAuth;
