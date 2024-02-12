import React from "react";
import { Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoute = ({ element, children, ...props }) => {
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);

  if (!isAuthenticated && props?.required) {
    return <Navigate to="/login" replace />;
  }
  if (isAuthenticated && !props?.required) {
    return <Navigate to="/dashboard" replace />;
  }
  return <>{children}</>;
};

export default PrivateRoute;
