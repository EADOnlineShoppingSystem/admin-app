import React, { useEffect, useState, useRef } from "react";
import CustomInput from "../components/CustomInput";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { getProductCategories } from "../features/pcategory/pcategorySlice";
import { Select } from "antd";
import { getColors } from "../features/color/colorSlice";
import "react-widgets/styles.css";
import Dropzone from "react-dropzone";
import { delImg, uploadImg } from "../features/upload/uploadSlice";
import {
  createProducts,
  getAProduct,
  updateAProduct,
  resetState,
} from "../features/product/productSlice";
import { useLocation, useNavigate } from "react-router-dom";

let schema = Yup.object().shape({
  title: Yup.string().required("Title is required."),
  description: Yup.string().required("Description is required."),
  price: Yup.number().required("Price is required."),
  category: Yup.string().required("Category is required."),
  sku: Yup.string().required("SKU is required."),
  price: Yup.number().required("Price is required."),
  color: Yup.array()
    .min(1, "Pick at least one color")
    .required("Color is required."),
  quantity: Yup.number().required("Quantity is Required"),
});

const Addproduct = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [color, setColor] = useState([]);
  const [images, setImages] = useState([]);

  const quillRef = useRef();

  const getProductId = location.pathname.split("/")[3];
  const imgState = useSelector((state) => state.upload.images);
  const catState = useSelector((state) => state.pcategory.pCategories);
  const colorState = useSelector((state) => state.color.colors);
  const newProduct = useSelector((state) => state.product);
  const {
    isSuccess,
    isError,
    isLoading,
    createdProduct,
    productName,
    productDesc,
    productPric,
    productCat,
    productTag,
    productSKU,
    productColor,
    productQuant,
    productImages,
    updatedProduct,
  } = newProduct;

  useEffect(() => {
    dispatch(resetState());
    dispatch(getProductCategories());
    dispatch(getColors());
   
  }, [dispatch]);

  useEffect(() => {
    if (getProductId !== undefined) {
      dispatch(getAProduct(getProductId));
     // img.push(productImages);
    } else {
      dispatch(resetState());
    }
  }, [getProductId, dispatch]);


  useEffect(() => {
    if (isSuccess && createdProduct) {
      toast.success("Product Added Successfully!");
      navigate("/admin/list-product");
    }
    if (isSuccess && updatedProduct) {
      toast.success("Product Updated Successfullly!");
      navigate("/admin/list-product");
    }
    if (isError) {
      toast.error("Something Went Wrong!");
    }
  }, [isSuccess, isError, isLoading, createdProduct, updatedProduct, navigate]);


  useEffect(() => {
    if (productColor && productColor.length > 0) {
      setColor(productColor.map(c => c._id));
    }
    if (productImages && productImages.length > 0) {
      setImages(productImages);
    }
  }, [productColor, productImages]);


  // const coloropt = [];
  // colorState.forEach((i) => {
  //   coloropt.push({
  //     label: i.title,
  //     value: i._id,
  //   });
  // });

  const coloropt = colorState.map((i) => ({
    label: i.title,
    value: i._id,
  }));

  const handleColors = (selectedColors) => {
    formik.setFieldValue("color", selectedColors);
  };

  // const img = [];
  // imgState.forEach((i) => {
  //   img.push({
  //     public_id: i.public_id,
  //     url: i.url,
  //   });
  // });

  // useEffect(() => {
  //   formik.values.color = color ? color : " ";
  //  // formik.values.color = productColor ? productColor : " ";
  //   formik.values.images = img;
  // }, [productColor, productImages]);



  // useEffect(() => {
  //   formik.values.color = color ? color : " ";
  //   formik.values.images = img;
  // }, [productColor, productImages]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: productName || "",
      description: productDesc || "",
      price: productPric || "",
      category: productCat || "",
      tags: productTag || "",
      sku: productSKU || "",
      color: productColor || [],
      quantity: productQuant || "",
      images: images,
    },
    validationSchema: schema,
    onSubmit: (values) => {
      if (getProductId !== undefined) {
        const data = { id: getProductId, productData: values };
        dispatch(updateAProduct(data));
      } else {
        dispatch(createProducts(values));
        formik.resetForm();
        setColor([]);
        setImages([]);
        setTimeout(() => {
          dispatch(resetState());
        }, 300);
      }
    },
  });

  // const handleColors = (e) => {
  //   setColor(e);
  //   console.log(color);
  // };

  
  
  const handleImages = (acceptedFiles) => {
    dispatch(uploadImg(acceptedFiles));
  };
  
  useEffect(() => {
    if (imgState.length > 0) {
      formik.setFieldValue("images", [...formik.values.images, ...imgState]);
    }
  }, [imgState]);
  
  const handleImageDelete = (public_id) => {
    dispatch(delImg(public_id));
    formik.setFieldValue(
      "images",
      formik.values.images.filter(img => img.public_id !== public_id)
    );
  };


  // const [desc, setDesc] = useState();
  // const handleDesc = (e) => {
  //   setDesc(e);
  // };
  return (
    <div>
      <h3 className="mb-4 title">
        {getProductId !== undefined ? "Edit" : "Add"} Product
      </h3>
      <div>
        <form
          action=""
          onSubmit={formik.handleSubmit}
          className="d-flex gap-3 flex-column"
        >
          <CustomInput
            type="text"
            label="Enter Product Title"
            name="title"
            val={formik.values.title}
            onChg={formik.handleChange("title")}
            onBlr={formik.handleBlur("title")}
          />
          <div className="error">
            {formik.touched.title && formik.errors.title}
          </div>
          <div className="">
            <ReactQuill
              ref={quillRef}
              theme="snow"
              name="description"
              placeholder="Enter Product Description"
              value={formik.values.description}
              onChange={formik.handleChange("description")}
              style={{
                backgroundColor: "white" /* White background */,
                color: "black" /* Black text */,
              }}
            />
            <div className="error">
              {formik.touched.description && formik.errors.description}
            </div>
          </div>
          <CustomInput
            type="number"
            label="Enter Product Price"
            name="price"
            val={formik.values.price}
            onChg={formik.handleChange("price")}
            onBlr={formik.handleBlur("price")}
          />
          <div className="error">
            {formik.touched.price && formik.errors.price}
          </div>
          <select
            name="category"
            value={formik.values.category}
            onChange={formik.handleChange("category")}
            onBlur={formik.handleBlur("category")}
            className="form-control py-3 mb-3"
            id=""
          >
            <option value="">Select Category</option>
            {catState.map((i, j) => {
              return (
                <option key={j} value={i.title}>
                  {i.title}
                </option>
              );
            })}
          </select>
          <div className="error">
            {formik.touched.category && formik.errors.category}
          </div>
          <select
            name="tags"
            value={formik.values.tags}
            onChange={formik.handleChange("tags")}
            onBlur={formik.handleBlur("tags")}
            className="form-control py-3 mb-3"
            id=""
          >
            <option value="" disabled>
              Select Tag
            </option>
            <option value="featured">Featured</option>
            <option value="popular">Popular</option>
            <option value="special">Special</option>
          </select>
          <div className="error">
            {formik.touched.tags && formik.errors.tags}
          </div>
          {/* <Select
            mode="multiple"
            allowClear
            className="w-100"
            placeholder="Select colors"
            defaultValue={color}
            onChange={(i) => handleColors(i)}
            options={coloropt}
          /> */}
          <CustomInput
            type="text"
            label="Stock-Keeping Unit (SKU)"
            name="sku"
            val={formik.values.sku}
            onChg={formik.handleChange("sku")}
            onBlr={formik.handleBlur("sku")}
          />
          <div className="error">
            {formik.touched.sku && formik.errors.sku}
          </div>
<Select
  mode="multiple"
  allowClear
  className="w-100"
  placeholder="Select colors"
  value={formik.values.color}
  onChange={handleColors}
  options={coloropt}
/>
          <div className="error">
            {formik.touched.color && formik.errors.color}
          </div>
          <CustomInput
            type="number"
            label="Enter Product Quantity"
            name="quantity"
            onChg={formik.handleChange("quantity")}
            onBlr={formik.handleBlur("quantity")}
            val={formik.values.quantity}
          />
          <div className="error">
            {formik.touched.quantity && formik.errors.quantity}
          </div>
          <div className="bg-white border-1 p-5 text-center">
            <Dropzone onDrop={handleImages}>
              {({ getRootProps, getInputProps }) => (
                <section>
                  <div {...getRootProps()}>
                    <input {...getInputProps()} />
                    <p style={{ cursor: "pointer" }}>
                      Drag 'n' drop some files here, or click to select files
                    </p>
                  </div>
                </section>
              )}
            </Dropzone>
          </div>
          <div className="showimages d-flex flex-wrap gap-3">
  {formik.values.images.map((i, j) => {
    return (
      <div className="position-relative" key={j}>
        <button
          type="button"
          onClick={() => handleImageDelete(i.public_id)}
          className="btn-close position-absolute"
          style={{ top: "10px", right: "10px" }}
        ></button>
        <img src={i.url} alt="" width={200} height={200} />
      </div>
    );
  })}
</div>
          <button
            className="btn btn-success border-0 rounded-3 my-5"
            type="submit"
          >
            {getProductId !== undefined ? "Edit" : "Add"} Product
          </button>
        </form>
      </div>
    </div>
  );
};

export default Addproduct;










// import React, { useEffect, useState, useRef } from "react";
// import CustomInput from "../components/CustomInput";
// import ReactQuill from "react-quill";
// import "react-quill/dist/quill.snow.css";
// import { toast } from "react-toastify";
// import { useFormik } from "formik";
// import * as Yup from "yup";
// import { useDispatch, useSelector } from "react-redux";
// import { getProductCategories } from "../features/pcategory/pcategorySlice";
// import { Select } from "antd";
// import { getColors } from "../features/color/colorSlice";
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
//   price: Yup.number().required("Price is required."),
//   category: Yup.string().required("Category is required."),
//   tags: Yup.string().required("Tags is required."),
//   color: Yup.array()
//     .min(1, "Pick at least one color")
//     .required("Color is required."),
//   quantity: Yup.number().required("Quantity is Required"),
// });

// const Addproduct = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [color, setColor] = useState([]);
//   //const [images, setImages] = useState([]);

//   const quillRef = useRef();

//   const catState = useSelector((state) => state.pcategory.pCategories);
//   const colorState = useSelector((state) => state.color.colors);
//   const imgState = useSelector((state) => state.upload.images);
//   const newProduct = useSelector((state) => state.product);
//   const {
//     isSuccess,
//     isError,
//     isLoading,
//     createdProduct,
//     productName,
//     productDesc,
//     productPric,
//     productCat,
//     productTag,
//     productColor,
//     productQuant,
//     productImages,
//     updatedProduct,
//   } = newProduct;

//   const getProductId = location.pathname.split("/")[3];

//   useEffect(() => {
//     if (getProductId !== undefined) {
//       dispatch(getAProduct(getProductId));
//       img.push(productImages);
//     } else {
//       dispatch(resetState());
//     }
//     dispatch(getProductCategories());
//     dispatch(getColors());
//   }, [dispatch, getProductId]);

//   useEffect(() => {
//     if (getProductId !== undefined && !isLoading && isSuccess) {
//       formik.setValues({
//         title: productName || "",
//         description: productDesc || "",
//         price: productPric || "",
//         category: productCat || "",
//         tags: productTag || "",
//         color: productColor || [],
//         quantity: productQuant || "",
//         images: productImages || [],
//       });
//       setColor(productColor || []);
//      // setImages(productImages || []);
//     }
//   }, [
//     productName,
//     productDesc,
//     productPric,
//     productCat,
//     productTag,
//     productColor,
//     productQuant,
//     productImages,
//     isLoading,
//     isSuccess,
//   ]);

//   useEffect(() => {
//     if (isSuccess && createdProduct) {
//       toast.success("Product Added Successfully!");
//     }
//     if (isSuccess && updatedProduct) {
//       toast.success("Product Updated Successfully!");
//       navigate("/admin/list-product");
//     }
//     if (isError) {
//       toast.error("Something Went Wrong!");
//     }
//   }, [isSuccess, isError, isLoading, createdProduct, updatedProduct]);
  
//   const coloropt = [];
//   colorState.forEach((i) => {
//     coloropt.push({
//       label: i.title,
//       value: i._id,
//     });
//   });
//   const img = [];
//   imgState.forEach((i) => {
//     img.push({
//       public_id: i.public_id,
//       url: i.url,
//     });
//   });
//   // useEffect(() => {
//   //   formik.values.color = color ? color : " ";
//   //   formik.values.images = img;
//   // }, [productColor ,productImages]);

  
//   useEffect(() => {
//     formik.setFieldValue('color', color);
//     formik.setFieldValue('images', img);
//   }, [color, img]);

  

//   // const handleColors = (e) => {
//   //   setColor(e);
//   //   formik.setFieldValue(
//   //     "color",
//   //     e.map((color) => color.value)
//   //   );
//   // };

//   const handleColors = (e) => {
//     setColor(e);
//     formik.setFieldValue('color', e);
//   };

//   const formik = useFormik({
//     initialValues: {
//       title: "",
//       description: "",
//       price: "",
//       category: "",
//       tags: "",
//       color: [],
//       quantity: "",
//       images: [],
//     },
//     validationSchema: schema,
//     onSubmit: (values) => {
//       const updatedValues = {
//         ...values,
//         color: color,
//         images: img,
//       };
//       if (getProductId !== undefined) {
//         const data = { id: getProductId, productData: updatedValues };
//         dispatch(updateAProduct(data));
//       } else {
//         dispatch(createProducts(updatedValues));
//       }
//       formik.resetForm();
//       //setColor([]);
//      // setImages([]);
//       setTimeout(() => {
//         dispatch(resetState());
//       }, 300);
//     },
//   });

//   return (
//     <div>
//       <h3 className="mb-4 title">
//         {getProductId !== undefined ? "Edit" : "Add"} Product
//       </h3>
//       <div>
//         <form
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
//                 backgroundColor: "white",
//                 color: "black",
//               }}
//             />
//             <div className="error">
//               {formik.touched.description && formik.errors.description}
//             </div>
//           </div>
//           <CustomInput
//             type="number"
//             label="Enter Product Price"
//             name="price"
//             val={formik.values.price}
//             onChg={formik.handleChange("price")}
//             onBlr={formik.handleBlur("price")}
//           />
//           <div className="error">
//             {formik.touched.price && formik.errors.price}
//           </div>
//           <select
//             name="category"
//             value={formik.values.category}
//             onChange={formik.handleChange("category")}
//             onBlur={formik.handleBlur("category")}
//             className="form-control py-3 mb-3"
//           >
//             <option value="">Select Category</option>
//             {catState.map((i, j) => (
//               <option key={j} value={i.title}>
//                 {i.title}
//               </option>
//             ))}
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
//           <Select
//             mode="multiple"
//             allowClear
//             className="w-100"
//             placeholder="Select colors"
//             value={color}
//             onChange={handleColors} 
//             options={coloropt}
//           />
//           <div className="error">
//             {formik.touched.color && formik.errors.color}
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
//             <Dropzone
//               onDrop={(acceptedFiles) => dispatch(uploadImg(acceptedFiles))}
//             >
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
//             {imgState?.map((i, j) => {
//               return (
//                 <div className=" position-relative" key={j}>
//                   <button
//                     type="button"
//                     onClick={() => dispatch(delImg(i.public_id))}
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
//       </div>
//     </div>
//   );
// };

// export default Addproduct;
