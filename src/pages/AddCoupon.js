// import { React, useEffect } from "react";
// import CustomInput from "../components/CustomInput";
// import { useDispatch, useSelector } from "react-redux";
// import { useLocation, useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import * as Yup from "yup";
// import { useFormik } from "formik";
// import {
//   createCoupon,
//   getACoupon,
//   resetState,
//   updateACoupon,
// } from "../features/coupon/couponSlice";

// let schema = Yup.object().shape({
//   name: Yup.string().required("Coupon Name is Required."),
//   expiry: Yup.date().required("Expiry Date is Required."),
//   discount: Yup.number().required("Discount Percentage is Required."),
// });

// const AddCoupon = () => {
//   const dispatch = useDispatch();
//   const location = useLocation();
//   const navigate = useNavigate();
//   const getCouponId = location.pathname.split("/")[3];
//   const newCoupon = useSelector((state) => state.coupon);
//   const {
//     isSuccess,
//     isError,
//     isLoading,
//     createdCoupon,
//     couponName,
//     couponDiscount,
//     couponExpiry,
//     updatedCoupon,
//   } = newCoupon;

//   const changeDateTimeFormat = (dateTime) => {
//     if (!dateTime) return "";
//     const newDate = new Date(dateTime);
//     const year = newDate.getFullYear();
//     const month = String(newDate.getMonth() + 1).padStart(2, "0");
//     const day = String(newDate.getDate()).padStart(2, "0");
//     const hours = String(newDate.getHours()).padStart(2, "0");
//     const minutes = String(newDate.getMinutes()).padStart(2, "0");
//     return `${year}-${month}-${day}T${hours}:${minutes}`;
//   };

//   useEffect(() => {
//     if (getCouponId !== undefined) {
//       dispatch(getACoupon(getCouponId));
//     } else {
//       dispatch(resetState());
//     }
//   }, [getCouponId]);

//   useEffect(() => {
//     if (isSuccess && createdCoupon) {
//       toast.success("Coupon Added Successfully!");
//     }
//     if (isSuccess && updatedCoupon) {
//       toast.success("Coupon Updated Successfullly!");
//       navigate("/admin/coupon-list");
//     }
//     if (isError && couponName && couponDiscount && couponExpiry) {
//       toast.error("Something Went Wrong!");
//     }
//   }, [isSuccess, isError, isLoading]);

//   const formik = useFormik({
//     enableReinitialize: true,
//     initialValues: {
//       name: couponName || "",
//       expiry: changeDateTimeFormat(couponExpiry) || "",
//       discount: couponDiscount || "",
//     },

//     validationSchema: schema,
//     onSubmit: (values) => {
//       if (getCouponId !== undefined) {
//         const data = { id: getCouponId, couponData: values };
//         dispatch(updateACoupon(data));
//         dispatch(resetState());
//       } else {
//         dispatch(createCoupon(values));
//         formik.resetForm();
//         setTimeout(() => {
//           dispatch(resetState());
//         }, 300);
//       }
//     },
//   });

//   return (
//     <div>
//       <h3 className="mb-4 title">
//         {getCouponId !== undefined ? "Edit" : "Add"} Coupon
//       </h3>
//       <div>
//         <form action="" onSubmit={formik.handleSubmit}>
//           <CustomInput
//             type="text"
//             name="name"
//             label="Enter Product Coupon"
//             val={formik.values.name}
//             onChg={formik.handleChange("name")}
//             onBlr={formik.handleBlur("name")}
//             id="name"
//           />
//           <div className="error">
//             {formik.touched.name && formik.errors.name}
//           </div>
//           <CustomInput
//             type="datetime-local"
//             name="expiry"
//             label="Enter Expiry Date and Time"
//             val={formik.values.expiry}
//             onChg={formik.handleChange("expiry")}
//             onBlr={formik.handleBlur("expiry")}
//             id="expiry"
//           />
//           <div className="error">
//             {formik.touched.expiry && formik.errors.expiry}
//           </div>
//           <CustomInput
//             type="number"
//             name="discount"
//             label="Enter Discount"
//             val={formik.values.discount}
//             onChg={formik.handleChange("discount")}
//             onBlr={formik.handleBlur("discount")}
//             id="discount"
//           />
//           <div className="error">
//             {formik.touched.discount && formik.errors.discount}
//           </div>
//           <button
//             className="btn btn-success border-0 rounded-3 my-5"
//             type="submit"
//           >
//             {getCouponId !== undefined ? "Edit" : "Add"} Coupon
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default AddCoupon;
