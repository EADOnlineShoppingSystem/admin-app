import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Select } from "antd";
import Dropzone from "react-dropzone";
import { SketchPicker } from "react-color";
import { CloseOutlined } from "@ant-design/icons"; // For the close icon

const { Option } = Select;

const AddProduct = () => {
  const [formData, setFormData] = useState({
    categoryName: "",
    productTitle: "",
    productDescription: "",
    lowestPrice: "",
    largestPrice: "",
    quantity: "",
    tag: "",
    warranty: "",
    storages: [],
    colors: [],
  });

  const [categories, setCategories] = useState([]);
  const [images, setImages] = useState([]);
  const [selectedColor, setSelectedColor] = useState("");
  const [colors, setColors] = useState([]);

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:6002/api/products/categories");
        setCategories(response.data.categories || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("Failed to fetch categories!");
      }
    };

    fetchCategories();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle storages selection
  const handleSelectChange = (value, field) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  // Handle image upload using Dropzone
  const handleImageUpload = (acceptedFiles) => {
    setImages([...images, ...acceptedFiles]);
  };

  // Add selected color to colors list
  const handleAddColor = () => {
    if (selectedColor && !colors.includes(selectedColor)) {
      setColors([...colors, selectedColor]);
      setFormData((prevData) => ({
        ...prevData,
        colors: [...prevData.colors, selectedColor],
      }));
    }
  };

  // Remove a color from the list
  const handleRemoveColor = (colorToRemove) => {
    const updatedColors = colors.filter((color) => color !== colorToRemove);
    setColors(updatedColors);
    setFormData((prevData) => ({
      ...prevData,
      colors: updatedColors,
    }));
  };

  // Remove an image
  const handleRemoveImage = (indexToRemove) => {
    const updatedImages = images.filter((_, index) => index !== indexToRemove);
    setImages(updatedImages);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = new FormData();
    form.append("categoryName", formData.categoryName);
    form.append("productTitle", formData.productTitle);
    form.append("productDescription", formData.productDescription);
    form.append("lowestPrice", formData.lowestPrice);
    form.append("largestPrice", formData.largestPrice);
    form.append("quantity", formData.quantity);
    form.append("tag", formData.tag);
    form.append("warranty", formData.warranty);
    form.append("storages", JSON.stringify(formData.storages));
    form.append("colors", JSON.stringify(formData.colors));
    images.forEach((image) => form.append("images", image));

    try {
      const response = await axios.post(
        "http://localhost:6002/api/products/add-product",
        form,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      toast.success("Product added successfully!");
      console.log("Response:", response.data);

      // Reset form after successful submission
      setFormData({
        categoryName: "",
        productTitle: "",
        productDescription: "",
        lowestPrice: "",
        largestPrice: "",
        quantity: "",
        tag: "",
        warranty: "",
        storages: [],
        colors: [],
      });
      setImages([]);
      setColors([]);
    } catch (error) {
      console.error("Error adding product:", error);
      toast.error("Failed to add product!");
    }
  };

  return (
    <div className="container">
      <h3 className="mb-4">Add Product</h3>
      <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
        {/* Category Dropdown */}
        <div className="form-group">
          <label>Product Category</label>
          <Select
            placeholder="Select a category"
            value={formData.categoryName}
            onChange={(value) => handleSelectChange(value, "categoryName")}
            style={{ width: "100%" }}
          >
            {categories.map((category) => (
              <Option key={category._id} value={category.name}>
                {category.name}
              </Option>
            ))}
          </Select>
        </div>

        {/* Other Inputs */}
        <div className="form-group">
          <label>Product Title</label>
          <input
            type="text"
            name="productTitle"
            value={formData.productTitle}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        <div className="form-group">
          <label>Product Description</label>
          <textarea
            name="productDescription"
            value={formData.productDescription}
            onChange={handleChange}
            className="form-control"
            rows="3"
            required
          ></textarea>
        </div>
        <div className="form-group">
          <label>Lowest Price</label>
          <input
            type="number"
            name="lowestPrice"
            value={formData.lowestPrice}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        <div className="form-group">
          <label>Largest Price</label>
          <input
            type="number"
            name="largestPrice"
            value={formData.largestPrice}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        <div className="form-group">
          <label>Quantity</label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        <div className="form-group">
          <label>Tag</label>
          <input
            type="text"
            name="tag"
            value={formData.tag}
            onChange={handleChange}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Warranty</label>
          <input
            type="text"
            name="warranty"
            value={formData.warranty}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        {/* Storages */}
        <div className="form-group">
          <label>Storages</label>
          <Select
            mode="multiple"
            allowClear
            placeholder="Select storages"
            onChange={(value) => handleSelectChange(value, "storages")}
            value={formData.storages}
            style={{ width: "100%" }}
          >
            {["64GB", "128GB", "256GB", "512GB", "1TB"].map((storage) => (
              <Option key={storage} value={storage}>
                {storage}
              </Option>
            ))}
          </Select>
        </div>

        {/* Colors with Color Picker */}
        <div className="form-group">
          <label>Select Colors</label>
          <SketchPicker
            color={selectedColor}
            onChangeComplete={(color) => setSelectedColor(color.hex)}
          />
          <button
            type="button"
            onClick={handleAddColor}
            className="btn btn-primary mt-2"
          >
            Add Color
          </button>
          <div className="mt-3">
            {colors.map((color, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "10px",
                }}
              >
                <div
                  style={{
                    backgroundColor: color,
                    width: "30px",
                    height: "30px",
                    marginRight: "10px",
                  }}
                ></div>
                <span>{color}</span>
                <CloseOutlined
                  onClick={() => handleRemoveColor(color)}
                  style={{
                    cursor: "pointer",
                    color: "red",
                    marginLeft: "10px",
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Images */}
        <div className="form-group">
          <label>Product Images</label>
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

        {/* Submit Button */}
        <button type="submit" className="btn btn-primary mt-3">
          Add Product
        </button>
      </form>
    </div>
  );
};

export default AddProduct;








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
//   resetState as resetColorState,
// } from "../features/color/colorSlice";
// import "react-widgets/styles.css";
// import Dropzone from "react-dropzone";
// import { delImg, uploadImg } from "../features/upload/uploadSlice";
// import {
//   createProducts,
//   getAProductById,
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
//   storage: Yup.array()
//     .min(1, "Pick at least one size")
//     .required("Storage is required."),
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
//   const [images, setImages] = useState([]);
//   const [isColorModalVisible, setIsColorModalVisible] = useState(false);
//   const [newColorTitle, setNewColorTitle] = useState("");

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
//     createdColor,
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
//       dispatch(getAProductById(getProductId));
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
//       setNewColorTitle("");
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
//               {["64GB", "128GB", "256GB", "512GB", "1TB"].map((storage) => (
//                 <div
//                   key={storage}
//                   className="form-check me-3"
//                   style={{ paddingLeft: "50px" }}
//                 >
//                   <input
//                     className="form-check-input"
//                     type="checkbox"
//                     name="storage"
//                     value={storage}
//                     id={storage}
//                     checked={formik.values.storage.includes(storage)}
//                     onChange={(e) => {
//                       const selectedStorage = e.target.value;
//                       let newStorageArray = [...formik.values.storage];

//                       if (e.target.checked) {
//                         newStorageArray.push(selectedStorage); // Add selected size
//                       } else {
//                         newStorageArray = newStorageArray.filter(
//                           (s) => s !== selectedStorage
//                         ); // Remove unselected size
//                       }

//                       formik.setFieldValue("storage", newStorageArray); // Update Formik's size field
//                     }}
//                     onBlur={formik.handleBlur("storage")}
//                     style={{ width: "17px", height: "17px" }}
//                   />
//                   <label
//                     className="form-check-label"
//                     htmlFor={storage}
//                     style={{ fontSize: "14px", marginLeft: "10px" }}
//                   >
//                     {storage}
//                   </label>
//                 </div>
//               ))}
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
//       </div>
//     </div>
//   );
// };

// export default Addproduct;
