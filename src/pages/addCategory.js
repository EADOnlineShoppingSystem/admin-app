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

import React, { useState, useEffect } from "react";
import CustomInput from "../components/customInput";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { useFormik } from "formik";
import Dropzone from "react-dropzone";
import { CloseOutlined } from "@ant-design/icons";
import { createCategories, resetState } from "../features/product/productSlice";

const schema = Yup.object().shape({
  name: Yup.string().required("Category Name is Required"),
});

const Addcat = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const newCategory = useSelector((state) => state.product);
  const { isSuccess, isError, createdCategory } = newCategory;

  const handleImageUpload = (acceptedFiles) => {
    setImages([...images, ...acceptedFiles]);
  };

  const handleRemoveImage = (indexToRemove) => {
    const updatedImages = images.filter((_, index) => index !== indexToRemove);
    setImages(updatedImages);
  };

  useEffect(() => {
    if (isError && newCategory.message) {
      toast.error(newCategory.message);
      return;
    }
    
    if (isSuccess && createdCategory) {
      toast.success("Category Added Successfully!");
      navigate("/admin/list-category");
      formik.resetForm();
      setImages([]);
      setTimeout(() => {
        dispatch(resetState());
      }, 300);
    }
  }, [isSuccess, isError, createdCategory, navigate, newCategory.message]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: "",
    },
    validationSchema: schema,
    onSubmit: (values) => {
      const formData = new FormData();
      formData.append("name", values.name);
      images.forEach(img => formData.append("image", img));
      dispatch(createCategories(formData));
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

          <div className="form-group mt-4">
            <label>Category Images</label>
            <Dropzone onDrop={handleImageUpload}>
              {({ getRootProps, getInputProps }) => (
                <div
                  {...getRootProps()}
                  style={{
                    border: "1px dashed #ccc",
                    padding: "20px",
                    textAlign: "center",
                    cursor: "pointer",
                  }}
                >
                  <input {...getInputProps()} />
                  <p>Drag 'n' drop images here, or click to select files</p>
                </div>
              )}
            </Dropzone>
            <div className="mt-3 d-flex flex-wrap gap-2">
              {images.map((file, index) => (
                <div
                  key={index}
                  style={{
                    position: "relative",
                    display: "inline-block",
                  }}
                >
                  <img
                    src={URL.createObjectURL(file)}
                    alt="preview"
                    style={{
                      width: "100px",
                      height: "100px",
                      objectFit: "cover",
                      borderRadius: "5px",
                    }}
                  />
                  <CloseOutlined
                    onClick={() => handleRemoveImage(index)}
                    style={{
                      position: "absolute",
                      top: "-10px",
                      right: "-10px",
                      cursor: "pointer",
                      backgroundColor: "white",
                      borderRadius: "50%",
                      padding: "2px",
                      fontSize: "16px",
                      color: "red",
                    }}
                  />
                </div>
              ))}
            </div>
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
