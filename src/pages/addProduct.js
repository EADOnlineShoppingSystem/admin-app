import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import CustomInput from "../components/customInput";
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
        const response = await axios.get(
          `http://localhost:6002/api/products/product/${productId}`
        );
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
        />
        {formik.touched.productTitle && formik.errors.productTitle}

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

        <div className="form-group">
          <label>Storages</label>
          <div className="d-flex flex-wrap gap-3 mt-2">
            {["None", "64GB", "128GB", "256GB", "512GB", "1TB"].map(
              (storage) => (
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
                  <label
                    className="form-check-label"
                    htmlFor={`storage-${storage}`}
                  >
                    {storage}
                  </label>
                </div>
              )
            )}
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

        <button
          type="submit"
          className="btn btn-success border-0 rounded-3 my-5"
        >
          {productId ? "Edit" : "Add"} Product
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
