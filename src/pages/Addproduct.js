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





