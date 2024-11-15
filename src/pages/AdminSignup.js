// // src/pages/AdminRegister.js
// import React, { useState } from 'react';
// import { useFormik } from 'formik';
// import * as Yup from 'yup';
// import { useDispatch } from 'react-redux';
// import { registerAdmin } from '../features/auth/authSlice';
// import CustomInput from "../components/CustomInput";

// const adminSignUpSchema = Yup.object({
//     firstName: Yup.string().required("First Name is Required."),
//     lastName: Yup.string().required("Last Name is Required."),
//     email: Yup
//       .string()
//       .required("Email Address is Required.")
//       .email("Email Should be valid"),
//     mobile: Yup.string().required("Mobile No is Required."),
//     password: Yup.string().required("Password is Required."),
//   });

// const AdminRegister = () => {
//   const dispatch = useDispatch();

//   const formik = useFormik({
//     initialValues: {
//       firstname: '',
//       lastname: '',
//       email: '',
//       mobile: '',
//       password: '',
//     },
//     validationSchema: adminSignUpSchema,
//     onSubmit: (values) => {
//       dispatch(registerAdmin(values));
//     },
//   });

//   return (
//     <div>
//       <h2>Register as Admin</h2>
//       <form
//                 action=""
//                 onSubmit={formik.handleSubmit}
//                 className="d-flex flex-column gap-15"
//               >
//                 <CustomInput
//                   type="text"
//                   name="firstName"
//                   placeholder="First Name"
//                   val={formik.values.firstName}
//                   onChg={formik.handleChange("firstName")}
//                   onBlr={formik.handleBlur("firstName")}
//                 />
//                 <div className="error-message">
//                   {formik.touched.firstName && formik.errors.firstName}
//                 </div>
//                 <CustomInput
//                   type="text"
//                   name="lastName"
//                   placeholder="Last Name"
//                   val={formik.values.lastName}
//                   onChg={formik.handleChange("lastName")}
//                   onBlr={formik.handleBlur("lastName")}
//                 />
//                 <div className="error-message">
//                   {formik.touched.lastName && formik.errors.lastName}
//                 </div>
//                 <CustomInput
//                   type="email"
//                   name="email"
//                   placeholder="Email"
//                   val={formik.values.email}
//                   onChg={formik.handleChange("email")}
//                   onBlr={formik.handleBlur("email")}
//                 />
//                 <div className="error-message">
//                   {formik.touched.email && formik.errors.email}
//                 </div>
//                 <CustomInput
//                   type="tel"
//                   name="mobile"
//                   placeholder="Mobile Number"
//                   val={formik.values.mobile}
//                   onChg={formik.handleChange("mobile")}
//                   onBlr={formik.handleBlur("mobile")}
//                 />
//                 <div className="error-message">
//                   {formik.touched.mobile && formik.errors.mobile}
//                 </div>
//                 <CustomInput
//                   type="password"
//                   name="password"
//                   placeholder="Password"
//                   val={formik.values.password}
//                   onChg={formik.handleChange("password")}
//                   onBlr={formik.handleBlur("password")}
//                 />
//                 <div className="error-message">
//                   {formik.touched.password && formik.errors.password}
//                 </div>
//                 <div>
//                   <div className="mt-3 d-flex justify-content-center gap-15 align-items-center">
//                     {/* <button className="button1 border-0">Sign Up</button> */}
//                     <button className="button1 border-0">Sign Up</button>
//                   </div>
//                 </div>
//                 </form> 
// </div>
//   );
// };

// export default AdminRegister;