import React from 'react'
//import { Input } from 'antd';
import CustomInput from '../components/customInput';

const Resetpassword = () => {
  return (
    <div className="py-5" style={{ background: "#ffd333", minHeight: "100vh" }}>
        <br />
        <br />
        <br />
        <br />
        <br />
      <div className="login-input my-5  bg-white rounded-3 mx-auto p-4"> 
        <h3 className='text-center title'>Reset Password</h3>
        <p className='text-center'>
           Please enter your new password.
        </p>
         <form action="">
         <CustomInput type="password" label="New Password" id="pass" />
         <CustomInput type="password" label="Confirm Password" id="confirmpass" />
         <button 
             className="border-0 px-3 py-2 text-white fw-bold w-100" 
             style={{ background: "#ffd333" }}
             type="submit"
         >Reset Password</button>
         </form>
      </div>
    </div>
  )
}

export default Resetpassword;