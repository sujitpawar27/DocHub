import React from "react";
import RegisterForm from "./RegisterForm";
import Layout from "./Layout";

const Register = () => {
  return (
    <div>
      <Layout rightSideContent={<RegisterForm />} />
    </div>
  );
};

export default Register;
