import React from "react";
import Layout from "./Layout";
import LoginForm from "./LoginForm";

const Login = () => {
  return (
    <div>
      <Layout rightSideContent={<LoginForm />} />
    </div>
  );
};

export default Login;
