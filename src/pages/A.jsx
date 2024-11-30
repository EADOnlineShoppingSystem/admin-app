
import React, { useEffect, useState, useRef } from "react";
import CustomInput from "../components/CustomInput";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
//import { Select, Modal } from "antd";
import { SketchPicker } from "react-color";
import { CloseOutlined } from "@ant-design/icons";
import "react-widgets/styles.css";
import Dropzone from "react-dropzone";
import {
  createProducts,
  getAProductById,
  updateAProduct,
  getAllCategories,
  resetState,
} from "../features/product/productSlice";
import { useLocation, useNavigate } from "react-router-dom";

let schema = Yup.object().shape({
  productTitle: Yup.string().required("Title is required."),
  productDescription: Yup.string().required("Description is required."),
  lowestPrice: Yup.number().required("Price is required."),
  largestPrice: Yup.number().required("Price is required."),
  categoryName: Yup.string().required("Category is required."),
  tag: Yup.string().required("Tag is required."),
  storages: Yup.array()
    .min(1, "Pick at least one size")
    .required("Storage is required."),
  colors: Yup.array()
    .min(1, "Pick at least one color")
    .required("Color is required."),
  quantity: Yup.number().required("Quantity is Required"),
  warranty: Yup.string().required("Warranty is required"),
  // images: Yup.array()
  //   .min(1, "At least one image is required")
  //   .required("Product images are required"),
});

const Addproduct = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedColor, setSelectedColor] = useState("#000000");

  // const [color, setColor] = useState([]);
  // const [images, setImages] = useState([]);

  const quillRef = useRef();

  const getProductId = location.pathname.split("/")[3];
  const categoryState = useSelector((state) => state.product.productCategories);
  const newProduct = useSelector((state) => state.product);

  const { isSuccess, isError, isLoading, createdProduct, updatedProduct } =
    newProduct;

  useEffect(() => {
    dispatch(resetState());
    dispatch(getAllCategories());
  }, [dispatch]);

  useEffect(() => {
    if (getProductId !== undefined) {
      dispatch(getAProductById(getProductId));
    } else {
      dispatch(resetState());
    }
  }, [getProductId, dispatch]);

  // Product success/error effect
  useEffect(() => {
    if (isSuccess && createdProduct) {
      toast.success("Product Added Successfully!");
      navigate("/admin/list-product");
    }
    if (isSuccess && updatedProduct) {
      toast.success("Product Updated Successfully!");
      navigate("/admin/list-product");
    }
    if (isError) {
      toast.error("Something Went Wrong!");
    }
  }, [isSuccess, isError, isLoading, createdProduct, updatedProduct, navigate]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      productTitle: "",
      productDescription: "",
      lowestPrice: "",
      largestPrice: "",
      categoryName: "",
      tag: "",
      storages: [],
      colors: [],
     // images: [],
      warranty: "",
      quantity: "",
    },
    validationSchema: schema,
    onSubmit: (values) => {
      const formData = new FormData();
      Object.keys(values).forEach((key) => {
        if (key === "images") {
          values.images.forEach((file) => formData.append("images", file));
        } else if (Array.isArray(values[key])) {
          values[key].forEach((item) => formData.append(key, item));
        } else {
          formData.append(key, values[key]);
        }
      });
      if (getProductId !== undefined) {
        dispatch(
          updateAProduct({ productId: getProductId, productData: formData })
        );
      } else {
        dispatch(createProducts(formData));
        formik.resetForm();
        setTimeout(() => {
          dispatch(resetState());
        }, 300);
      }
    },
  });

  // Color handling
  const handleAddColor = () => {
    if (selectedColor && !formik.values.colors.includes(selectedColor)) {
      const newColors = [...formik.values.colors, selectedColor];
      formik.setFieldValue("colors", newColors);
    }
  };

  const handleRemoveColor = (colorToRemove) => {
    const newColors = formik.values.colors.filter(
      (color) => color !== colorToRemove
    );
    formik.setFieldValue("colors", newColors);
  };

  // Image handling
  const handleImageUpload = (acceptedFiles) => {
    const newImages = [...formik.values.images, ...acceptedFiles];
    formik.setFieldValue("images", newImages);
  };

  const handleRemoveImage = (indexToRemove) => {
    const newImages = formik.values.images.filter(
      (_, index) => index !== indexToRemove
    );
    formik.setFieldValue("images", newImages);
  };

  return (
    <div>
      <h3 className="mb-4 title">
        {getProductId !== undefined ? "Edit" : "Add"} Product
      </h3>
      <div>
        <form
          //action=""
          onSubmit={formik.handleSubmit}
          className="d-flex gap-3 flex-column"
        >
          <select
            name="categoryName"
            value={formik.values.categoryName}
            onChange={formik.handleChange("categoryName")}
            onBlur={formik.handleBlur("categoryName")}
            className="form-control py-3 mb-3"
            id=""
          >
            <option value="">Select Category</option>
            {Array.isArray(categoryState) &&
              categoryState.map((i, j) => (
                <option key={j} value={i.name}>
                  {i.name}
                </option>
              ))}
          </select>
          <div className="error">
            {formik.touched.categoryName && formik.errors.categoryName}
          </div>
          <CustomInput
            type="text"
            label="Enter Product Title"
            name="productTitle"
            val={formik.values.productTitle}
            onChg={formik.handleChange("productTitle")}
            onBlr={formik.handleBlur("productTitle")}
          />
          <div className="error">
            {formik.touched.productTitle && formik.errors.productTitle}
          </div>
          <div className="">
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
            label="Enter Product's Lowest Price"
            name="lowestPrice"
            val={formik.values.lowestPrice}
            onChg={formik.handleChange("lowestPrice")}
            onBlr={formik.handleBlur("lowestPrice")}
          />
          <div className="error">
            {formik.touched.lowestPrice && formik.errors.lowestPrice}
          </div>
          <CustomInput
            type="number"
            label="Enter Product's Largest Price"
            name="largestPrice"
            val={formik.values.largestPrice}
            onChg={formik.handleChange("largestPrice")}
            onBlr={formik.handleBlur("largestPrice")}
          />
          <div className="error">
            {formik.touched.largestPrice && formik.errors.largestPrice}
          </div>

          <select
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
          <div className="error">{formik.touched.tag && formik.errors.tag}</div>

          <div className="form-group mb-3">
            <label
              style={{
                fontSize: "16px",
                marginBottom: "16px",
                color: "#403f3f",
              }}
            >
              Select Storages
            </label>
            <div className="d-flex flex-wrap">
              {["64GB", "128GB", "256GB", "512GB", "1TB"].map((storages) => (
                <div
                  key={storages}
                  className="form-check me-3"
                  style={{ paddingLeft: "50px" }}
                >
                  <input
                    className="form-check-input"
                    type="checkbox"
                    name="storages"
                    value={storages}
                    id={storages}
                    checked={formik.values.storages.includes(storages)}
                    onChange={(e) => {
                      const selectedStorage = e.target.value;
                      let newStorageArray = [...formik.values.storages];

                      if (e.target.checked) {
                        newStorageArray.push(selectedStorage); // Add selected size
                      } else {
                        newStorageArray = newStorageArray.filter(
                          (s) => s !== selectedStorage
                        ); // Remove unselected size
                      }

                      formik.setFieldValue("storages", newStorageArray);
                    }}
                    onBlur={formik.handleBlur("storages")}
                    style={{ width: "17px", height: "17px" }}
                  />
                  <label
                    className="form-check-label"
                    htmlFor={storages}
                    style={{ fontSize: "14px", marginLeft: "10px" }}
                  >
                    {storages}
                  </label>
                </div>
              ))}
            </div>
            <div className="error">
              {formik.touched.storages && formik.errors.storages}
            </div>
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
              {formik.values.colors.map((color, index) => (
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
            <div className="error">
              {formik.touched.colors && formik.errors.colors}
            </div>
          </div>

          <select
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
            {/* <div className="error">
              {formik.touched.images && formik.errors.images}
            </div> */}
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