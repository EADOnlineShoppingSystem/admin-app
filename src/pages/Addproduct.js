import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import CustomInput from "../components/CustomInput";
import { toast } from "react-toastify";
import { Select } from "antd";
import Dropzone from "react-dropzone";
import { SketchPicker } from "react-color";
import { CloseOutlined } from "@ant-design/icons";
import { useFormik } from "formik";
import * as Yup from "yup";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; 
import { useParams } from "react-router-dom"; 

const { Option } = Select;

const validationSchema = Yup.object({
  categoryName: Yup.string().required("Category is required"),
  productTitle: Yup.string()
    .required("Product title is required")
    .min(3, "Product title must be at least 3 characters"),
  productDescription: Yup.string()
    .required("Product description is required")
    .min(10, "Description must be at least 10 characters"),
  lowestPrice: Yup.number()
    .required("Lowest price is required")
    .positive("Price must be positive")
    .min(0, "Price cannot be negative"),
  largestPrice: Yup.number()
    .required("Largest price is required")
    .positive("Price must be positive")
    .min(
      Yup.ref("lowestPrice"),
      "Largest price must be greater than lowest price"
    ),
  quantity: Yup.number()
    .required("Quantity is required")
    .integer("Quantity must be a whole number")
    .min(0, "Quantity cannot be negative"),
  tag: Yup.string(),
  warranty: Yup.string(),
  storages: Yup.array().min(1, "At least one storage option is required"),
  colors: Yup.array().min(1, "At least one color is required"),
});

const AddProduct = () => {
  const { productId } = useParams();
  const [categories, setCategories] = useState([]);
  const [images, setImages] = useState([]);
  const [selectedColor, setSelectedColor] = useState("");
  const [colors, setColors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const quillRef = useRef();

  useEffect(() => {
    const fetchProductDetails = async () => {
      if (!productId) return;
      
      setIsLoading(true);
      try {
        const response = await axios.get(`http://localhost:6002/api/products/product/${productId}`);
        const product = response.data.product;
        
        // Set initial form values
        formik.setValues({
          categoryName: product.categoryName,
          productTitle: product.productTitle,
          productDescription: product.productDescription,
          lowestPrice: product.lowestPrice,
          largestPrice: product.largestPrice,
          quantity: product.quantity,
          tag: product.tag,
          warranty: product.warranty,
          storages: product.storages,
          colors: product.colors,
        });
        
        setColors(product.colors);
        // Handle existing images if needed
      } catch (error) {
        console.error("Error fetching product details:", error);
        toast.error("Failed to fetch product details!");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductDetails();
  }, [productId]);
  

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "http://localhost:6002/api/products/categories"
        );
        setCategories(response.data.categories || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("Failed to fetch categories!");
      }
    };

    fetchCategories();
  }, []);

  const formik = useFormik({
    initialValues: {
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
    },
    validationSchema,
    onSubmit: async (values) => {
      const form = new FormData();
      Object.keys(values).forEach((key) => {
        if (Array.isArray(values[key])) {
          form.append(key, JSON.stringify(values[key]));
        } else {
          form.append(key, values[key]);
        }
      });

      images.forEach((image) => form.append("images", image));

  //     try {
  //       const response = await axios.post(
  //         "http://localhost:6002/api/products/add-product",
  //         form,
  //         { headers: { "Content-Type": "multipart/form-data" } }
  //       );
  //       toast.success("Product added successfully!");
  //       formik.resetForm();
  //       setImages([]);
  //       setColors([]);
  //     } catch (error) {
  //       console.error("Error adding product:", error);
  //       toast.error("Failed to add product!");
  //     }
  //   },
  // });

  try {
    let response;
    if (productId) {
      // Update existing product
      response = await axios.put(
        `http://localhost:6002/api/products/update-product/${productId}`,
        form,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      toast.success("Product updated successfully!");
    } else {
      // Add new product
      response = await axios.post(
        "http://localhost:6002/api/products/add-product",
        form,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      toast.success("Product added successfully!");
      formik.resetForm();
      setImages([]);
      setColors([]);
    }
  } catch (error) {
    console.error("Error saving product:", error);
    toast.error(`Failed to ${productId ? "update" : "add"} product!`);
  }
},
});

  const handleSelectChange = (value, field) => {
    formik.setFieldValue(field, value);
  };

  const handleImageUpload = (acceptedFiles) => {
    setImages([...images, ...acceptedFiles]);
  };

  const handleAddColor = () => {
    if (selectedColor && !colors.includes(selectedColor)) {
      const newColors = [...colors, selectedColor];
      setColors(newColors);
      formik.setFieldValue("colors", newColors);
    }
  };

  const handleRemoveColor = (colorToRemove) => {
    const updatedColors = colors.filter((color) => color !== colorToRemove);
    setColors(updatedColors);
    formik.setFieldValue("colors", updatedColors);
  };

  const handleRemoveImage = (indexToRemove) => {
    const updatedImages = images.filter((_, index) => index !== indexToRemove);
    setImages(updatedImages);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
       <h3 className="mb-4 title">{productId ? "Edit" : "Add"} Product</h3>
      <form onSubmit={formik.handleSubmit} className="d-flex flex-column gap-3">
        <div className="form-group">
          <label>Product Category</label>
          <Select
            placeholder="Select a category"
            value={formik.values.categoryName}
            onChange={(value) => handleSelectChange(value, "categoryName")}
            style={{ width: "100%" }}
            status={
              formik.errors.categoryName && formik.touched.categoryName
                ? "error"
                : ""
            }
          >
            {categories.map((category) => (
              <Option key={category._id} value={category.name}>
                {category.name}
              </Option>
            ))}
          </Select>
          {formik.touched.categoryName && formik.errors.categoryName && (
            <div className="text-danger">{formik.errors.categoryName}</div>
          )}
        </div>

        <CustomInput
          type="text"
          label="Product Title"
          i_id="productTitle"
          name="productTitle"
          val={formik.values.productTitle}
          onChg={formik.handleChange}
          onBlr={formik.handleBlur}
          // i_class={
          //   formik.errors.productTitle && formik.touched.productTitle
          //     ? "is-invalid"
          //     : ""
          // }
        />
        {formik.touched.productTitle && formik.errors.productTitle
        //  && (
        //   <div className="text-danger">{formik.errors.productTitle}</div>)
        }

        {/* <div className="form-group">
          <label>Product Description</label>
          <textarea
            name="productDescription"
            value={formik.values.productDescription}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`form-control ${
              formik.errors.productDescription && formik.touched.productDescription ? "is-invalid" : ""
            }`}
            rows="3"
          />
          {formik.touched.productDescription && formik.errors.productDescription && (
            <div className="text-danger">{formik.errors.productDescription}</div>
          )}
        </div> */}

        <div className="form-group">
          <ReactQuill
            ref={quillRef}
            theme="snow"
            name="productDescription"
            placeholder="Enter Product Description"
            value={formik.values.productDescription}
            onChange={(value) =>
              formik.setFieldValue("productDescription", value)
            }
            style={{
              backgroundColor: "white" /* White background */,
              color: "black" /* Black text */,
            }}
          />
          <div className="error">
            {formik.touched.productDescription &&
              formik.errors.productDescription}
          </div>
        </div>

        <CustomInput
          type="number"
          label="Lowest Price"
          i_id="lowestPrice"
          name="lowestPrice"
          val={formik.values.lowestPrice}
          onChg={formik.handleChange}
          onBlr={formik.handleBlur}
          i_class={
            formik.errors.lowestPrice && formik.touched.lowestPrice
              ? "is-invalid"
              : ""
          }
        />
        {formik.touched.lowestPrice && formik.errors.lowestPrice && (
          <div className="text-danger">{formik.errors.lowestPrice}</div>
        )}

        <CustomInput
          type="number"
          label="Largest Price"
          i_id="largestPrice"
          name="largestPrice"
          val={formik.values.largestPrice}
          onChg={formik.handleChange}
          onBlr={formik.handleBlur}
          i_class={
            formik.errors.largestPrice && formik.touched.largestPrice
              ? "is-invalid"
              : ""
          }
        />
        {formik.touched.largestPrice && formik.errors.largestPrice && (
          <div className="text-danger">{formik.errors.largestPrice}</div>
        )}

        <CustomInput
          type="number"
          label="Quantity"
          i_id="quantity"
          name="quantity"
          val={formik.values.quantity}
          onChg={formik.handleChange}
          onBlr={formik.handleBlur}
          i_class={
            formik.errors.quantity && formik.touched.quantity
              ? "is-invalid"
              : ""
          }
        />
        {formik.touched.quantity && formik.errors.quantity && (
          <div className="text-danger">{formik.errors.quantity}</div>
        )}

        <CustomInput
          type="text"
          label="Tag"
          i_id="tag"
          name="tag"
          val={formik.values.tag}
          onChg={formik.handleChange}
          onBlr={formik.handleBlur}
          i_class={formik.errors.tag && formik.touched.tag ? "is-invalid" : ""}
        />

        {/* <select
          name="tag"
          value={formik.values.tag}
          onChange={formik.handleChange("tag")}
          onBlur={formik.handleBlur("tag")}
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
        <div className="error">{formik.touched.tag && formik.errors.tag}</div> */}

        <CustomInput
          type="text"
          label="Warranty"
          i_id="warranty"
          name="warranty"
          val={formik.values.warranty}
          onChg={formik.handleChange}
          onBlr={formik.handleBlur}
          i_class={
            formik.errors.warranty && formik.touched.warranty
              ? "is-invalid"
              : ""
          }
        />

{/* <select
            name="warranty"
            value={formik.values.warranty}
            onChange={formik.handleChange("warranty")}
            onBlur={formik.handleBlur("warranty")}
            className="form-control py-3 mb-3"
            id=""
          >
            <option value="" disabled>
              Select Warranty
            </option>
            <option value="1year">1 Year Apple Care Warranty</option>
            <option value="2year">2 Year Apple Care Warranty</option>
            <option value="3year">3 Year Apple Care Warranty</option>
          </select>
          <div className="error">
            {formik.touched.warranty && formik.errors.warranty}
          </div> */}

        {/* <div className="form-group">
          <label>Storages</label>
          <Select
            mode="multiple"
            allowClear
            placeholder="Select storages"
            onChange={(value) => handleSelectChange(value, "storages")}
            value={formik.values.storages}
            style={{ width: "100%" }}
            status={
              formik.errors.storages && formik.touched.storages ? "error" : ""
            }
          >
            {["64GB", "128GB", "256GB", "512GB", "1TB"].map((storage) => (
              <Option key={storage} value={storage}>
                {storage}
              </Option>
            ))}
          </Select>
          {formik.touched.storages && formik.errors.storages && (
            <div className="text-danger">{formik.errors.storages}</div>
          )}
        </div> */}

<div className="form-group">
  <label>Storages</label>
  <div className="d-flex flex-wrap gap-3 mt-2">
    {["None" ,"64GB", "128GB", "256GB", "512GB", "1TB"].map((storage) => (
      <div key={storage} className="form-check">
        <input
          type="checkbox"
          id={`storage-${storage}`}
          name="storages"
          className="form-check-input"
          value={storage}
          checked={formik.values.storages.includes(storage)}
          onChange={(e) => {
            const { checked, value } = e.target;
            let newStorages;
            if (checked) {
              newStorages = [...formik.values.storages, value];
            } else {
              newStorages = formik.values.storages.filter(
                (storage) => storage !== value
              );
            }
            formik.setFieldValue("storages", newStorages);
          }}
          onBlur={formik.handleBlur}
        />
        <label className="form-check-label" htmlFor={`storage-${storage}`}>
          {storage}
        </label>
      </div>
    ))}
  </div>
  {formik.touched.storages && formik.errors.storages && (
    <div className="text-danger mt-2">{formik.errors.storages}</div>
  )}
</div>

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
          {formik.touched.colors && formik.errors.colors && (
            <div className="text-danger">{formik.errors.colors}</div>
          )}
        </div>

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

        <button type="submit" className="btn btn-success border-0 rounded-3 my-5">
          {productId ? "Edit" : "Add"} Product
        </button>
      </form>
    </div>
  );
};

export default AddProduct;

// //this is zoysa's code
// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import CustomInput from "../components/CustomInput";
// import ReactQuill from "react-quill";
// import "react-quill/dist/quill.snow.css";
// import { toast } from "react-toastify";
// import { Select } from "antd";
// import Dropzone from "react-dropzone";
// import { SketchPicker } from "react-color";
// import { CloseOutlined } from "@ant-design/icons";

// const { Option } = Select;

// const AddProduct = () => {
//   const [formData, setFormData] = useState({
//     categoryName: "",
//     productTitle: "",
//     productDescription: "",
//     lowestPrice: "",
//     largestPrice: "",
//     quantity: "",
//     tag: "",
//     warranty: "",
//     storages: [],
//     colors: [],
//   });

//   const [categories, setCategories] = useState([]);
//   const [images, setImages] = useState([]);
//   const [selectedColor, setSelectedColor] = useState("");
//   const [colors, setColors] = useState([]);

//   // Fetch categories on component mount
//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const response = await axios.get("http://localhost:6002/api/products/categories");
//         setCategories(response.data.categories || []);
//       } catch (error) {
//         console.error("Error fetching categories:", error);
//         toast.error("Failed to fetch categories!");
//       }
//     };

//     fetchCategories();
//   }, []);

//   // Handle input changes
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }));
//   };

//   // Handle storages selection
//   const handleSelectChange = (value, field) => {
//     setFormData((prevData) => ({
//       ...prevData,
//       [field]: value,
//     }));
//   };

//   // Handle image upload using Dropzone
//   const handleImageUpload = (acceptedFiles) => {
//     setImages([...images, ...acceptedFiles]);
//   };

//   // Add selected color to colors list
//   const handleAddColor = () => {
//     if (selectedColor && !colors.includes(selectedColor)) {
//       setColors([...colors, selectedColor]);
//       setFormData((prevData) => ({
//         ...prevData,
//         colors: [...prevData.colors, selectedColor],
//       }));
//     }
//   };

//   // Remove a color from the list
//   const handleRemoveColor = (colorToRemove) => {
//     const updatedColors = colors.filter((color) => color !== colorToRemove);
//     setColors(updatedColors);
//     setFormData((prevData) => ({
//       ...prevData,
//       colors: updatedColors,
//     }));
//   };

//   // Remove an image
//   const handleRemoveImage = (indexToRemove) => {
//     const updatedImages = images.filter((_, index) => index !== indexToRemove);
//     setImages(updatedImages);
//   };

//   // Handle form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const form = new FormData();
//     form.append("categoryName", formData.categoryName);
//     form.append("productTitle", formData.productTitle);
//     form.append("productDescription", formData.productDescription);
//     form.append("lowestPrice", formData.lowestPrice);
//     form.append("largestPrice", formData.largestPrice);
//     form.append("quantity", formData.quantity);
//     form.append("tag", formData.tag);
//     form.append("warranty", formData.warranty);
//     form.append("storages", JSON.stringify(formData.storages));
//     form.append("colors", JSON.stringify(formData.colors));
//     images.forEach((image) => form.append("images", image));

//     try {
//       const response = await axios.post(
//         "http://localhost:6002/api/products/add-product",
//         form,
//         { headers: { "Content-Type": "multipart/form-data" } }
//       );
//       toast.success("Product added successfully!");
//       console.log("Response:", response.data);

//       // Reset form after successful submission
//       setFormData({
//         categoryName: "",
//         productTitle: "",
//         productDescription: "",
//         lowestPrice: "",
//         largestPrice: "",
//         quantity: "",
//         tag: "",
//         warranty: "",
//         storages: [],
//         colors: [],
//       });
//       setImages([]);
//       setColors([]);
//     } catch (error) {
//       console.error("Error adding product:", error);
//       toast.error("Failed to add product!");
//     }
//   };

//   return (
//     <div className="container">
//       <h3 className="mb-4">Add Product</h3>
//       <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
//         {/* Category Dropdown */}
//         <div className="form-group">
//           <label>Product Category</label>
//           <Select
//             placeholder="Select a category"
//             value={formData.categoryName}
//             onChange={(value) => handleSelectChange(value, "categoryName")}
//             style={{ width: "100%" }}
//           >
//             {categories.map((category) => (
//               <Option key={category._id} value={category.name}>
//                 {category.name}
//               </Option>
//             ))}
//           </Select>
//         </div>

//         {/* Other Inputs */}
//         <div className="form-group">
//           <label>Product Title</label>
//           <input
//             type="text"
//             name="productTitle"
//             value={formData.productTitle}
//             onChange={handleChange}
//             className="form-control"
//             required
//           />
//         </div>
//         <div className="form-group">
//           <label>Product Description</label>
//           <textarea
//             name="productDescription"
//             value={formData.productDescription}
//             onChange={handleChange}
//             className="form-control"
//             rows="3"
//             required
//           ></textarea>
//         </div>
//         <div className="form-group">
//           <label>Lowest Price</label>
//           <input
//             type="number"
//             name="lowestPrice"
//             value={formData.lowestPrice}
//             onChange={handleChange}
//             className="form-control"
//             required
//           />
//         </div>
//         <div className="form-group">
//           <label>Largest Price</label>
//           <input
//             type="number"
//             name="largestPrice"
//             value={formData.largestPrice}
//             onChange={handleChange}
//             className="form-control"
//             required
//           />
//         </div>
//         <div className="form-group">
//           <label>Quantity</label>
//           <input
//             type="number"
//             name="quantity"
//             value={formData.quantity}
//             onChange={handleChange}
//             className="form-control"
//             required
//           />
//         </div>
//         <div className="form-group">
//           <label>Tag</label>
//           <input
//             type="text"
//             name="tag"
//             value={formData.tag}
//             onChange={handleChange}
//             className="form-control"
//           />
//         </div>
//         <div className="form-group">
//           <label>Warranty</label>
//           <input
//             type="text"
//             name="warranty"
//             value={formData.warranty}
//             onChange={handleChange}
//             className="form-control"
//           />
//         </div>

//         {/* Storages */}
//         <div className="form-group">
//           <label>Storages</label>
//           <Select
//             mode="multiple"
//             allowClear
//             placeholder="Select storages"
//             onChange={(value) => handleSelectChange(value, "storages")}
//             value={formData.storages}
//             style={{ width: "100%" }}
//           >
//             {["64GB", "128GB", "256GB", "512GB", "1TB"].map((storage) => (
//               <Option key={storage} value={storage}>
//                 {storage}
//               </Option>
//             ))}
//           </Select>
//         </div>

//         {/* Colors with Color Picker */}
//         <div className="form-group">
//           <label>Select Colors</label>
//           <SketchPicker
//             color={selectedColor}
//             onChangeComplete={(color) => setSelectedColor(color.hex)}
//           />
//           <button
//             type="button"
//             onClick={handleAddColor}
//             className="btn btn-primary mt-2"
//           >
//             Add Color
//           </button>
//           <div className="mt-3">
//             {colors.map((color, index) => (
//               <div
//                 key={index}
//                 style={{
//                   display: "flex",
//                   alignItems: "center",
//                   marginBottom: "10px",
//                 }}
//               >
//                 <div
//                   style={{
//                     backgroundColor: color,
//                     width: "30px",
//                     height: "30px",
//                     marginRight: "10px",
//                   }}
//                 ></div>
//                 <span>{color}</span>
//                 <CloseOutlined
//                   onClick={() => handleRemoveColor(color)}
//                   style={{
//                     cursor: "pointer",
//                     color: "red",
//                     marginLeft: "10px",
//                   }}
//                 />
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Images */}
//         <div className="form-group">
//           <label>Product Images</label>
//           <Dropzone onDrop={handleImageUpload}>
//             {({ getRootProps, getInputProps }) => (
//               <div
//                 {...getRootProps()}
//                 style={{
//                   border: "1px dashed #ccc",
//                   padding: "20px",
//                   textAlign: "center",
//                   cursor: "pointer",
//                 }}
//               >
//                 <input {...getInputProps()} />
//                 <p>Drag 'n' drop images here, or click to select files</p>
//               </div>
//             )}
//           </Dropzone>
//           <div className="mt-3 d-flex flex-wrap gap-2">
//             {images.map((file, index) => (
//               <div
//                 key={index}
//                 style={{
//                   position: "relative",
//                   display: "inline-block",
//                 }}
//               >
//                 <img
//                   src={URL.createObjectURL(file)}
//                   alt="preview"
//                   style={{
//                     width: "100px",
//                     height: "100px",
//                     objectFit: "cover",
//                     borderRadius: "5px",
//                   }}
//                 />
//                 <CloseOutlined
//                   onClick={() => handleRemoveImage(index)}
//                   style={{
//                     position: "absolute",
//                     top: "-10px",
//                     right: "-10px",
//                     cursor: "pointer",
//                     backgroundColor: "white",
//                     borderRadius: "50%",
//                     padding: "2px",
//                     fontSize: "16px",
//                     color: "red",
//                   }}
//                 />
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Submit Button */}
//         <button type="submit" className="btn btn-primary mt-3">
//           Add Product
//         </button>
//       </form>
//     </div>
//   );
// };

// export default AddProduct;

// import React, { useEffect, useState, useRef } from "react";
// import CustomInput from "../components/CustomInput";
// import ReactQuill from "react-quill";
// import "react-quill/dist/quill.snow.css";
// import { toast } from "react-toastify";
// import { useFormik } from "formik";
// import * as Yup from "yup";
// import { useDispatch, useSelector } from "react-redux";
// //import { Select, Modal } from "antd";
// import { SketchPicker } from "react-color";
// import { CloseOutlined } from "@ant-design/icons";
// import "react-widgets/styles.css";
// import Dropzone from "react-dropzone";
// import {
//   createProducts,
//   getAProductById,
//   updateAProduct,
//   getAllCategories,
//   resetState,
// } from "../features/product/productSlice";
// import { useLocation, useNavigate } from "react-router-dom";

// let schema = Yup.object().shape({
//   productTitle: Yup.string().required("Title is required."),
//   productDescription: Yup.string().required("Description is required."),
//   lowestPrice: Yup.number().required("Price is required."),
//   largestPrice: Yup.number().required("Price is required."),
//   categoryName: Yup.string().required("Category is required."),
//   tag: Yup.string().required("Tag is required."),
//   storages: Yup.array()
//     .min(1, "Pick at least one size")
//     .required("Storage is required."),
//   colors: Yup.array()
//     .min(1, "Pick at least one color")
//     .required("Color is required."),
//   quantity: Yup.number().required("Quantity is Required"),
//   warranty: Yup.string().required("Warranty is required"),
//   images: Yup.array()
//     .min(1, "At least one image is required")
//     .required("Product images are required"),
// });

// const Addproduct = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [selectedColor, setSelectedColor] = useState("#000000");

//   // const [color, setColor] = useState([]);
//   // const [images, setImages] = useState([]);

//   const quillRef = useRef();

//   const getProductId = location.pathname.split("/")[3];
//   const categoryState = useSelector((state) => state.product.productCategories);
//   const newProduct = useSelector((state) => state.product);

//   const { isSuccess, isError, isLoading, createdProduct, updatedProduct } =
//     newProduct;

//   useEffect(() => {
//     dispatch(resetState());
//     dispatch(getAllCategories());
//   }, [dispatch]);

//   useEffect(() => {
//     if (getProductId !== undefined) {
//       dispatch(getAProductById(getProductId));
//     } else {
//       dispatch(resetState());
//     }
//   }, [getProductId, dispatch]);

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

//   const formik = useFormik({
//     enableReinitialize: true,
//     initialValues: {
//       productTitle: "",
//       productDescription: "",
//       lowestPrice: "",
//       largestPrice: "",
//       categoryName: "",
//       tag: "",
//       storages: [],
//       colors: [],
//       images: [],
//       warranty: "",
//       quantity: "",
//     },
//     validationSchema: schema,
//     onSubmit: (values) => {
//       const formData = new FormData();
//       Object.keys(values).forEach((key) => {
//         if (key === "images") {
//           values.images.forEach((file) => formData.append("images", file));
//         } else if (Array.isArray(values[key])) {
//           values[key].forEach((item) => formData.append(key, item));
//         } else {
//           formData.append(key, values[key]);
//         }
//       });
//       if (getProductId !== undefined) {
//         dispatch(
//           updateAProduct({ productId: getProductId, productData: formData })
//         );
//       } else {
//         dispatch(createProducts(formData));
//         formik.resetForm();
//         setTimeout(() => {
//           dispatch(resetState());
//         }, 300);
//       }
//     },
//   });

//   // Color handling
//   const handleAddColor = () => {
//     if (selectedColor && !formik.values.colors.includes(selectedColor)) {
//       const newColors = [...formik.values.colors, selectedColor];
//       formik.setFieldValue("colors", newColors);
//     }
//   };

//   const handleRemoveColor = (colorToRemove) => {
//     const newColors = formik.values.colors.filter(
//       (color) => color !== colorToRemove
//     );
//     formik.setFieldValue("colors", newColors);
//   };

//   // Image handling
//   const handleImageUpload = (acceptedFiles) => {
//     const newImages = [...formik.values.images, ...acceptedFiles];
//     formik.setFieldValue("images", newImages);
//   };

//   const handleRemoveImage = (indexToRemove) => {
//     const newImages = formik.values.images.filter(
//       (_, index) => index !== indexToRemove
//     );
//     formik.setFieldValue("images", newImages);
//   };

//   return (
//     <div>
      // <h3 className="mb-4 title">
      //   {getProductId !== undefined ? "Edit" : "Add"} Product
      // </h3>
//       <div>
//         <form
//           //action=""
//           onSubmit={formik.handleSubmit}
//           className="d-flex gap-3 flex-column"
//         >
//           <select
//             name="categoryName"
//             value={formik.values.categoryName}
//             onChange={formik.handleChange("categoryName")}
//             onBlur={formik.handleBlur("categoryName")}
//             className="form-control py-3 mb-3"
//             id=""
//           >
//             <option value="">Select Category</option>
//             {Array.isArray(categoryState) &&
//               categoryState.map((i, j) => (
//                 <option key={j} value={i.name}>
//                   {i.name}
//                 </option>
//               ))}
//           </select>
//           <div className="error">
//             {formik.touched.categoryName && formik.errors.categoryName}
//           </div>
//           <CustomInput
//             type="text"
//             label="Enter Product Title"
//             name="productTitle"
//             val={formik.values.productTitle}
//             onChg={formik.handleChange("productTitle")}
//             onBlr={formik.handleBlur("productTitle")}
//           />
//           <div className="error">
//             {formik.touched.productTitle && formik.errors.productTitle}
//           </div>
//           <div className="">
//             <ReactQuill
//               ref={quillRef}
//               theme="snow"
//               name="productDescription"
//               placeholder="Enter Product Description"
//               value={formik.values.productDescription}
//               onChange={(value) =>
//                 formik.setFieldValue("productDescription", value)
//               }
//               style={{
//                 backgroundColor: "white" /* White background */,
//                 color: "black" /* Black text */,
//               }}
//             />
//             <div className="error">
//               {formik.touched.productDescription &&
//                 formik.errors.productDescription}
//             </div>
//           </div>
//           <CustomInput
//             type="number"
//             label="Enter Product's Lowest Price"
//             name="lowestPrice"
//             val={formik.values.lowestPrice}
//             onChg={formik.handleChange("lowestPrice")}
//             onBlr={formik.handleBlur("lowestPrice")}
//           />
//           <div className="error">
//             {formik.touched.lowestPrice && formik.errors.lowestPrice}
//           </div>
//           <CustomInput
//             type="number"
//             label="Enter Product's Largest Price"
//             name="largestPrice"
//             val={formik.values.largestPrice}
//             onChg={formik.handleChange("largestPrice")}
//             onBlr={formik.handleBlur("largestPrice")}
//           />
//           <div className="error">
//             {formik.touched.largestPrice && formik.errors.largestPrice}
//           </div>

//           <select
//             name="tag"
//             value={formik.values.tag}
//             onChange={formik.handleChange("tag")}
//             onBlur={formik.handleBlur("tag")}
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
//           <div className="error">{formik.touched.tag && formik.errors.tag}</div>

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
//               {["64GB", "128GB", "256GB", "512GB", "1TB"].map((storages) => (
//                 <div
//                   key={storages}
//                   className="form-check me-3"
//                   style={{ paddingLeft: "50px" }}
//                 >
//                   <input
//                     className="form-check-input"
//                     type="checkbox"
//                     name="storages"
//                     value={storages}
//                     id={storages}
//                     checked={formik.values.storages.includes(storages)}
//                     onChange={(e) => {
//                       const selectedStorage = e.target.value;
//                       let newStorageArray = [...formik.values.storages];

//                       if (e.target.checked) {
//                         newStorageArray.push(selectedStorage); // Add selected size
//                       } else {
//                         newStorageArray = newStorageArray.filter(
//                           (s) => s !== selectedStorage
//                         ); // Remove unselected size
//                       }

//                       formik.setFieldValue("storages", newStorageArray);
//                     }}
//                     onBlur={formik.handleBlur("storages")}
//                     style={{ width: "17px", height: "17px" }}
//                   />
//                   <label
//                     className="form-check-label"
//                     htmlFor={storages}
//                     style={{ fontSize: "14px", marginLeft: "10px" }}
//                   >
//                     {storages}
//                   </label>
//                 </div>
//               ))}
//             </div>
//             <div className="error">
//               {formik.touched.storages && formik.errors.storages}
//             </div>
//           </div>

//           {/* Colors with Color Picker */}
//           <div className="form-group">
//             <label>Select Colors</label>
//             <SketchPicker
//               color={selectedColor}
//               onChangeComplete={(color) => setSelectedColor(color.hex)}
//             />
//             <button
//               type="button"
//               onClick={handleAddColor}
//               className="btn btn-primary mt-2"
//             >
//               Add Color
//             </button>
//             <div className="mt-3">
//               {formik.values.colors.map((color, index) => (
//                 <div
//                   key={index}
//                   style={{
//                     display: "flex",
//                     alignItems: "center",
//                     marginBottom: "10px",
//                   }}
//                 >
//                   <div
//                     style={{
//                       backgroundColor: color,
//                       width: "30px",
//                       height: "30px",
//                       marginRight: "10px",
//                     }}
//                   ></div>
//                   <span>{color}</span>
//                   <CloseOutlined
//                     onClick={() => handleRemoveColor(color)}
//                     style={{
//                       cursor: "pointer",
//                       color: "red",
//                       marginLeft: "10px",
//                     }}
//                   />
//                 </div>
//               ))}
//             </div>
//             <div className="error">
//               {formik.touched.colors && formik.errors.colors}
//             </div>
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
//             <option value="1year">1 Year Apple Care Warranty</option>
//             <option value="2year">2 Year Apple Care Warranty</option>
//             <option value="3year">3 Year Apple Care Warranty</option>
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

//           {/* Images */}
//           <div className="form-group">
//             <label>Product Images</label>
//             <Dropzone onDrop={handleImageUpload}>
//               {({ getRootProps, getInputProps }) => (
//                 <div
//                   {...getRootProps()}
//                   style={{
//                     border: "1px dashed #ccc",
//                     padding: "20px",
//                     textAlign: "center",
//                     cursor: "pointer",
//                   }}
//                 >
//                   <input {...getInputProps()} />
//                   <p>Drag 'n' drop images here, or click to select files</p>
//                 </div>
//               )}
//             </Dropzone>
//             <div className="mt-3 d-flex flex-wrap gap-2">
//               {formik.values.images.map((file, index) => (
//                 <div
//                   key={index}
//                   style={{
//                     position: "relative",
//                     display: "inline-block",
//                   }}
//                 >
//                   <img
//                     src={URL.createObjectURL(file)}
//                     alt="preview"
//                     style={{
//                       width: "100px",
//                       height: "100px",
//                       objectFit: "cover",
//                       borderRadius: "5px",
//                     }}
//                   />
//                   <CloseOutlined
//                     onClick={() => handleRemoveImage(index)}
//                     style={{
//                       position: "absolute",
//                       top: "-10px",
//                       right: "-10px",
//                       cursor: "pointer",
//                       backgroundColor: "white",
//                       borderRadius: "50%",
//                       padding: "2px",
//                       fontSize: "16px",
//                       color: "red",
//                     }}
//                   />
//                 </div>
//               ))}
//             </div>
//             <div className="error">
//               {formik.touched.images && formik.errors.images}
//             </div>
//           </div>

          // <button
          //   className="btn btn-success border-0 rounded-3 my-5"
          //   type="submit"
          // >
          //   {getProductId !== undefined ? "Edit" : "Add"} Product
          // </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Addproduct;
