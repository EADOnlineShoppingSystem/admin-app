// import React, { useEffect, useState, useRef } from "react";
// import CustomInput from "../components/CustomInput";
// import ReactQuill from "react-quill";
// import "react-quill/dist/quill.snow.css";
// import { toast } from "react-toastify";
// import { useFormik } from "formik";
// import * as Yup from "yup";
// import { useDispatch, useSelector } from "react-redux";
// import { getProductCategories } from "../features/pcategory/pcategorySlice";
// import { Select, Modal } from "antd";
// import { 
//   getColors, 
//   createColor,
//   resetState as resetColorState 
// } from "../features/color/colorSlice";
// import "react-widgets/styles.css";
// import Dropzone from "react-dropzone";
// import { delImg, uploadImg } from "../features/upload/uploadSlice";
// import {
//   createProducts,
//   getAProduct,
//   updateAProduct,
//   resetState,
// } from "../features/product/productSlice";
// import { useLocation, useNavigate } from "react-router-dom";

// let schema = Yup.object().shape({
//   title: Yup.string().required("Title is required."),
//   description: Yup.string().required("Description is required."),
//   price1: Yup.number().required("Price is required."),
//   price2: Yup.number().required("Price is required."),
//   category: Yup.string().required("Category is required."),
//   storage: Yup.string().required("SKU is required."),
//   warranty: Yup.number().required("Warranty is required."),
//   color: Yup.array()
//     .min(1, "Pick at least one color")
//     .required("Color is required."),
//   size: Yup.array()
//     .min(1, "Pick at least one size")
//     .required("Size is required."),
//   quantity: Yup.number().required("Quantity is Required"),
// });

// const Addproduct = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [color, setColor] = useState([]);
//   const [images, setImages] = useState([]);
//   const [isColorModalVisible, setIsColorModalVisible] = useState(false);
//   const [newColorTitle, setNewColorTitle] = useState('');

//   const quillRef = useRef();

//   const getProductId = location.pathname.split("/")[3];
//   const imgState = useSelector((state) => state.upload.images);
//   const catState = useSelector((state) => state.pcategory.pCategories);
//   const colorState = useSelector((state) => state.color.colors);
//   const newColor = useSelector((state) => state.color);
//   const newProduct = useSelector((state) => state.product);
//   const { 
//     isSuccess: isColorSuccess, 
//     isError: isColorError, 
//     createdColor 
//   } = newColor;

//   const {
//     isSuccess,
//     isError,
//     isLoading,
//     createdProduct,
//     productName,
//     productDesc,
//     productPric1,
//     productPric2,
//     productCat,
//     productTag,
//     productColor,
//     productStg,
//     productWarranty,
//     productQuant,
//     productImages,
//     updatedProduct,
//   } = newProduct;

//   useEffect(() => {
//     dispatch(resetState());
//     dispatch(getProductCategories());
//     dispatch(getColors());
//   }, [dispatch]);

//   useEffect(() => {
//     if (getProductId !== undefined) {
//       dispatch(getAProduct(getProductId));
//     } else {
//       dispatch(resetState());
//     }
//   }, [getProductId, dispatch]);

//   // Color creation effect
//   useEffect(() => {
//     if (isColorSuccess && createdColor) {
//       toast.success("Color Added Successfully!");
//       dispatch(getColors());
//       setIsColorModalVisible(false);
//       setNewColorTitle('');
//     }
//     if (isColorError) {
//       toast.error("Failed to add color!");
//     }
//   }, [isColorSuccess, isColorError, createdColor]);

//   // Product success/error effect
//   useEffect(() => {
//     if (isSuccess && createdProduct) {
//       toast.success("Product Added Successfully!");
//       navigate("/admin/list-product");
//     }
//     if (isSuccess && updatedProduct) {
//       toast.success("Product Updated Successfully!");
//       navigate("/admin/list-product");
//     }
//     if (isError) {
//       toast.error("Something Went Wrong!");
//     }
//   }, [isSuccess, isError, isLoading, createdProduct, updatedProduct, navigate]);

//   useEffect(() => {
//     if (productColor && productColor.length > 0) {
//       setColor(productColor.map((c) => c._id));
//     }
//     if (productImages && productImages.length > 0) {
//       setImages(productImages);
//     }
//   }, [productColor, productImages]);

//   const coloropt = colorState.map((i) => ({
//     label: i.title,
//     value: i._id,
//   }));

//   const handleColors = (selectedColors) => {
//     formik.setFieldValue("color", selectedColors);
//   };

//   // New method to handle color creation
//   const handleAddColor = () => {
//     if (newColorTitle.trim()) {
//       dispatch(createColor({ title: newColorTitle }));
//     }
//   };

//   const formik = useFormik({
//     enableReinitialize: true,
//     initialValues: {
//       title: productName || "",
//       description: productDesc || "",
//       price1: productPric1 || "",
//       price2: productPric2 || "",
//       category: productCat || "",
//       tags: productTag || "",
//       storage: productStg || [],
//       color: productColor || [],
//       warranty: productWarranty || "",
//       quantity: productQuant || "",
//       images: images,
//     },
//     validationSchema: schema,
//     onSubmit: (values) => {
//       if (getProductId !== undefined) {
//         const data = { id: getProductId, productData: values };
//         dispatch(updateAProduct(data));
//       } else {
//         dispatch(createProducts(values));
//         formik.resetForm();
//         setColor([]);
//         setImages([]);
//         setTimeout(() => {
//           dispatch(resetState());
//         }, 300);
//       }
//     },
//   });

//   const handleImages = (acceptedFiles) => {
//     dispatch(uploadImg(acceptedFiles));
//   };

//   useEffect(() => {
//     if (imgState.length > 0) {
//       formik.setFieldValue("images", [...formik.values.images, ...imgState]);
//     }
//   }, [imgState]);

//   const handleImageDelete = (public_id) => {
//     dispatch(delImg(public_id));
//     formik.setFieldValue(
//       "images",
//       formik.values.images.filter((img) => img.public_id !== public_id)
//     );
//   };

//   return (
//     <div>
//       <h3 className="mb-4 title">
//         {getProductId !== undefined ? "Edit" : "Add"} Product
//       </h3>
//       <div>
//         <form
//           action=""
//           onSubmit={formik.handleSubmit}
//           className="d-flex gap-3 flex-column"
//         >
//           <CustomInput
//             type="text"
//             label="Enter Product Title"
//             name="title"
//             val={formik.values.title}
//             onChg={formik.handleChange("title")}
//             onBlr={formik.handleBlur("title")}
//           />
//           <div className="error">
//             {formik.touched.title && formik.errors.title}
//           </div>
//           <div className="">
//             <ReactQuill
//               ref={quillRef}
//               theme="snow"
//               name="description"
//               placeholder="Enter Product Description"
//               value={formik.values.description}
//               onChange={formik.handleChange("description")}
//               style={{
//                 backgroundColor: "white" /* White background */,
//                 color: "black" /* Black text */,
//               }}
//             />
//             <div className="error">
//               {formik.touched.description && formik.errors.description}
//             </div>
//           </div>
//           <CustomInput
//             type="number"
//             label="Enter Product's Lowest Price"
//             name="price1"
//             val={formik.values.price1}
//             onChg={formik.handleChange("price1")}
//             onBlr={formik.handleBlur("price1")}
//           />
//           <div className="error">
//             {formik.touched.price1 && formik.errors.price1}
//           </div>
//           <CustomInput
//             type="number"
//             label="Enter Product's Largest Price"
//             name="price2"
//             val={formik.values.price2}
//             onChg={formik.handleChange("price2")}
//             onBlr={formik.handleBlur("price2")}
//           />
//           <div className="error">
//             {formik.touched.price2 && formik.errors.price2}
//           </div>
//           <select
//             name="category"
//             value={formik.values.category}
//             onChange={formik.handleChange("category")}
//             onBlur={formik.handleBlur("category")}
//             className="form-control py-3 mb-3"
//             id=""
//           >
//             <option value="">Select Category</option>
//             {catState.map((i, j) => {
//               return (
//                 <option key={j} value={i.title}>
//                   {i.title}
//                 </option>
//               );
//             })}
//           </select>
//           <div className="error">
//             {formik.touched.category && formik.errors.category}
//           </div>
//           <select
//             name="tags"
//             value={formik.values.tags}
//             onChange={formik.handleChange("tags")}
//             onBlur={formik.handleBlur("tags")}
//             className="form-control py-3 mb-3"
//             id=""
//           >
//             <option value="" disabled>
//               Select Tag
//             </option>
//             <option value="featured">Featured</option>
//             <option value="popular">Popular</option>
//             <option value="special">Special</option>
//           </select>
//           <div className="error">
//             {formik.touched.tags && formik.errors.tags}
//           </div>

//           <div className="form-group mb-3">
//             <label
//               style={{
//                 fontSize: "16px",
//                 marginBottom: "16px",
//                 color: "#403f3f",
//               }}
//             >
//               Select Storages
//             </label>
//             <div className="d-flex flex-wrap">
//               {["64GB", "128GB", "256GB", "512GB", "1TB"].map(
//                 (storage) => (
//                   <div
//                     key={storage}
//                     className="form-check me-3"
//                     style={{ paddingLeft: "50px" }}
//                   >
//                     <input
//                       className="form-check-input"
//                       type="checkbox"
//                       name="storage"
//                       value={storage}
//                       id={storage}
//                       checked={formik.values.storage.includes(storage)}
//                       onChange={(e) => {
//                         const selectedStorage = e.target.value;
//                         let newStorageArray = [...formik.values.storage];

//                         if (e.target.checked) {
//                           newStorageArray.push(selectedStorage); // Add selected size
//                         } else {
//                           newStorageArray = newStorageArray.filter(
//                             (s) => s !== selectedStorage
//                           ); // Remove unselected size
//                         }

//                         formik.setFieldValue("storage", newStorageArray); // Update Formik's size field
//                       }}
//                       onBlur={formik.handleBlur("storage")}
//                       style={{ width: "17px", height: "17px" }}
//                     />
//                     <label
//                       className="form-check-label"
//                       htmlFor={storage}
//                       style={{ fontSize: "14px", marginLeft: "10px" }}
//                     >
//                       {storage}
//                     </label>
//                   </div>
//                 )
//               )}
//             </div>
//             <div className="error">
//               {formik.touched.storage && formik.errors.storage}
//             </div>
//           </div>

//           <div className="d-flex align-items-center gap-3">
//             <Select
//               mode="multiple"
//               allowClear
//               className="w-100"
//               placeholder="Select colors"
//               value={formik.values.color}
//               onChange={handleColors}
//               options={coloropt}
//             />
//             <button 
//               type="button" 
//               className="btn btn-primary"
//               onClick={() => setIsColorModalVisible(true)}
//             >
//               Add New Color
//             </button>
//           </div>
//           <div className="error">
//             {formik.touched.color && formik.errors.color}
//           </div>

//           {/* Color Creation Modal */}
//           <Modal
//             title="Add New Color"
//             visible={isColorModalVisible}
//             onOk={handleAddColor}
//             onCancel={() => setIsColorModalVisible(false)}
//           >
//             <input 
//               type="color"
//               value={newColorTitle}
//               onChange={(e) => setNewColorTitle(e.target.value)}
//               className="form-control mb-3"
//             />
//             <CustomInput
//               type="text"
//               label="Color Name"
//               val={newColorTitle}
//               onChg={(e) => setNewColorTitle(e.target.value)}
//               placeholder="Enter color name"
//             />
//           </Modal>

//           <Select
//             mode="multiple"
//             allowClear
//             className="w-100"
//             placeholder="Select colors"
//             value={formik.values.color}
//             onChange={handleColors}
//             options={coloropt}
//           />
//           <div className="error">
//             {formik.touched.color && formik.errors.color}
//           </div>

//           <select
//             name="warranty"
//             value={formik.values.warranty}
//             onChange={formik.handleChange("warranty")}
//             onBlur={formik.handleBlur("warranty")}
//             className="form-control py-3 mb-3"
//             id=""
//           >
//             <option value="" disabled>
//               Select Warranty
//             </option>
//             <option value="featured">1 Year Apple Care Warranty</option>
//             <option value="popular">2 Year Apple Care Warranty</option>
//             <option value="special">3 Year Apple Care Warranty</option>
//           </select>
//           <div className="error">
//             {formik.touched.warranty && formik.errors.warranty}
//           </div>

//           <CustomInput
//             type="number"
//             label="Enter Product Quantity"
//             name="quantity"
//             onChg={formik.handleChange("quantity")}
//             onBlr={formik.handleBlur("quantity")}
//             val={formik.values.quantity}
//           />
//           <div className="error">
//             {formik.touched.quantity && formik.errors.quantity}
//           </div>
//           <div className="bg-white border-1 p-5 text-center">
//             <Dropzone onDrop={handleImages}>
//               {({ getRootProps, getInputProps }) => (
//                 <section>
//                   <div {...getRootProps()}>
//                     <input {...getInputProps()} />
//                     <p style={{ cursor: "pointer" }}>
//                       Drag 'n' drop some files here, or click to select files
//                     </p>
//                   </div>
//                 </section>
//               )}
//             </Dropzone>
//           </div>
//           <div className="showimages d-flex flex-wrap gap-3">
//             {formik.values.images.map((i, j) => {
//               return (
//                 <div className="position-relative" key={j}>
//                   <button
//                     type="button"
//                     onClick={() => handleImageDelete(i.public_id)}
//                     className="btn-close position-absolute"
//                     style={{ top: "10px", right: "10px" }}
//                   ></button>
//                   <img src={i.url} alt="" width={200} height={200} />
//                 </div>
//               );
//             })}
//           </div>
//           <button
//             className="btn btn-success border-0 rounded-3 my-5"
//             type="submit"
//           >
//             {getProductId !== undefined ? "Edit" : "Add"} Product
//           </button>
//         </form>
//         </div>
//     </div>
//   );
// };

// export default Addproduct;