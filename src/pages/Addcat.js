

// import { React, useEffect } from "react";
// import CustomInput from "../components/CustomInput";
// import { useDispatch, useSelector } from "react-redux";
// import { useLocation, useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import * as Yup from "yup";
// import { useFormik } from "formik";
// import {
//   createCategories,
//   getAProductCategory,
//   resetState,
//  // updateAProductCategory,
// } from "../features/product/productSlice";

// let schema = Yup.object().shape({
//   title: Yup.string().required("Category Name is Required."),
// });

// const Addcat = () => {
//   const dispatch = useDispatch();
//   const location = useLocation();
//   const getPCatId = location.pathname.split("/")[3];
//   const navigate = useNavigate();
//   const newCategory = useSelector((state) => state.product);
//   const {
//     isSuccess,
//     isError,
//     isLoading,
//     createdCategory,
//     //categoryName,
//     //updatedCategory,
//   } = newCategory;

//   // useEffect(() => {
//   //   if (getPCatId !== undefined) {
//   //     dispatch(getAProductCategory(getPCatId));
//   //   } else {
//   //     dispatch(resetState());
//   //   }
//   // }, [getPCatId]);

//   useEffect(() => {
//     if (isSuccess && createdCategory) {
//       toast.success("Category Added Successfully!");
//     }
//     // if (isSuccess && updatedCategory) {
//     //   toast.success("Category Updated Successfullly!");
//     //   navigate("/admin/list-category");
//     // }
//     if (isError) {
//       toast.error("Something Went Wrong!");
//     }
//   }, [isSuccess, isError, isLoading]);

//   const formik = useFormik({
//     enableReinitialize: true,
//     initialValues: {
//      // title: categoryName || "",
//     },
//     validationSchema: schema,
//     onSubmit: (values) => {
//       if (getPCatId !== undefined) {
//         const data = { id: getPCatId, pCatData: values };
//        // dispatch(updateAProductCategory(data));
//         dispatch(resetState());
//       } else {
//         dispatch(createCategories(values));
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
//         {getPCatId !== undefined ? "Edit" : "Add"} Category
//       </h3>
//       <div>
//         <form action="" onSubmit={formik.handleSubmit}>
//           <CustomInput
//             type="category"
//             label="Enter Product Category"
//             val={formik.values.categoryName}
//             onChg={formik.handleChange("categoryName")}
//             onBlr={formik.handleBlur("categoryName")}
//             id="category"
//           />
//           <div className="error">
//             {formik.touched.categoryName && formik.errors.categoryName}
//           </div>
//           <button
//             className="btn btn-success border-0 rounded-3 my-5"
//             type="submit"
//           >
//             {getPCatId !== undefined ? "Edit" : "Add"} Category
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Addcat;




import React, { useEffect } from "react";
import CustomInput from "../components/CustomInput";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useDropzone } from "react-dropzone";
import { createCategories, resetState } from "../features/product/productSlice";

const schema = Yup.object().shape({
  name: Yup.string().required("Category Name is Required"),
  image: Yup.mixed().required("Image is Required"),
});

const Addcat = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const newCategory = useSelector((state) => state.product);
  const { isSuccess, isError, createdCategory } = newCategory;

  const { getRootProps, getInputProps, isDragActive, acceptedFiles } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif']
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      formik.setFieldValue("image", acceptedFiles[0]);
    }
  });

  useEffect(() => {
    if (isSuccess && createdCategory) {
      toast.success("Category Added Successfully!");
      navigate("/admin/list-category");
    }
    if (isError) {
      console.error(newCategory.message);
      toast.error(newCategory.message || "Something Went Wrong!");
    }
  }, [isSuccess, isError, createdCategory, navigate, newCategory.message]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: "",
      image: null,
    },
    validationSchema: schema,
    onSubmit: (values) => {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("image", values.image);
      dispatch(createCategories(formData));
      formik.resetForm();
      setTimeout(() => {
        dispatch(resetState());
      }, 300);
    },
  });

  return (
    <div>
      <h3 className="mb-4 title">Add Category</h3>
      <div>
        <form onSubmit={formik.handleSubmit}>
          <CustomInput
            type="text"
            label="Enter Product Category"
            name="name"
            val={formik.values.name}
            onChg={formik.handleChange("name")}
            onBlr={formik.handleBlur("name")}
          />
          {formik.touched.name && formik.errors.name && (
            <div className="error">{formik.errors.name}</div>
          )}

          <div className="mb-3">
            <label className="form-label">Category Image</label>
            <div
              {...getRootProps()}
              className={`dropzone p-5 text-center border rounded ${
                isDragActive ? "border-primary" : "border-dashed"
              }`}
              style={{ cursor: "pointer" }}
            >
              <input {...getInputProps()} />
              {formik.values.image ? (
                <div>
                  <p>Selected file: {formik.values.image.name}</p>
                  <img
                    src={URL.createObjectURL(formik.values.image)}
                    alt="Preview"
                    style={{ maxWidth: "200px", marginTop: "10px" }}
                  />
                </div>
              ) : (
                <p>{isDragActive ? "Drop the file here" : "Drag & drop an image here, or click to select"}</p>
              )}
            </div>
             {formik.touched.image && formik.errors.image && (
              <div className="error">{formik.errors.image}</div>
            )} 
          </div>

          <button className="btn btn-success border-0 rounded-3 my-5" type="submit">
            Add Category
          </button>
        </form>
      </div>
    </div>
  );
};

export default Addcat;








// import React, { useEffect } from "react";
// import CustomInput from "../components/CustomInput";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import * as Yup from "yup";
// import { useFormik } from "formik";
// import {
//   createCategories,
//   resetState,
// } from "../features/product/productSlice";

// let schema = Yup.object().shape({
//   name: Yup.string().required("Category Name is Required"),
// });

// const Addcat = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const newCategory = useSelector((state) => state.product);
//   const {
//     isSuccess,
//     isError,
//     createdCategory,
//   } = newCategory;

//   useEffect(() => {
//     if (isSuccess && createdCategory) {
//       toast.success("Category Added Successfully!");
//       navigate("/admin/list-category");
//     }
//     if (isError) {
//       // Log the specific error message
//       console.error(newCategory.message);
//       toast.error(newCategory.message || "Something Went Wrong!");
//     }
//   }, [isSuccess, isError, createdCategory, navigate, newCategory.message]);

//   const formik = useFormik({
//     enableReinitialize: true,
//     initialValues: {
//       name: "",
//     },
//     validationSchema: schema,
//     onSubmit: (values) => {
//       dispatch(createCategories(values.name));
//       formik.resetForm();
//       setTimeout(() => {
//         dispatch(resetState());
//       }, 300);
//     },
//   });

//   return (
//     <div>
//       <h3 className="mb-4 title">Add Category</h3>
//       <div>
//         <form onSubmit={formik.handleSubmit}>
//           <CustomInput
//             type="text"
//             label="Enter Product Category"
//             val={formik.values.name}
//             onChg={formik.handleChange("name")}
//             onBlr={formik.handleBlur("name")}
//             id="name"
//           />
//           {formik.touched.name && formik.errors.name && (
//             <div className="error">
//               {formik.errors.name}
//             </div>
//           )}
//           <button
//             className="btn btn-success border-0 rounded-3 my-5"
//             type="submit"
//           >
//             Add Category
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Addcat;