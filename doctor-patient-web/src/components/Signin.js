// App.jsx or index.jsx
import React from 'react';
import Layout from './Layout'; // Import the Layout component
import SigninForm from './SigninForm'; // Import the SigninForm component

const Signin = () => {
  return (
    <Layout rightSideContent={<SigninForm />} />

  );
};

export default Signin;
