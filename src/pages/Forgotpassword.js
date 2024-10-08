import React from 'react'
//import { Input } from 'antd';
import CustomInput from '../components/CustomInput';


const Forgotpassword = () => {
  return (
    <div className="py-5" style={{ background: "#ffd333", minHeight: "100vh" }}>
        <br />
        <br />
        <br />
        <br />
        <br />
      <div className="login-input my-5  bg-white rounded-3 mx-auto p-4"> 
        <h3 className='text-center title'>Forgot Password</h3>
        <p className='text-center'>
           Please enter your registered email to get the reset password mail.
        </p>
         <form action="">
         <CustomInput type="text" label="Email Address" id="email" />
         <button 
             className="border-0 px-3 py-2 text-white fw-bold w-100 " 
             style={{ background: "#ffd333" }}
             type="submit"
         >Send Link</button>
         </form>
      </div>
    </div>
  )
}

export default Forgotpassword;