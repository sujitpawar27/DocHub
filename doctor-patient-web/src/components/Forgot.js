import React from 'react'
import Layout from './Layout';
import ForgotForm from './Forgotform';
const Forgot = () => {
  return (
    <div>
       <Layout rightSideContent={<ForgotForm/>} />
    </div>
  )
}

export default Forgot
