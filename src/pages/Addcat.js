import { React, useEffect, useState } from "react";
import CustomInput from "../components/CustomInput";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { useFormik } from "formik";
import Dropzone from "react-dropzone";
import {
  createCategory,
  getAProductCategory,
  resetState,
  updateAProductCategory,
} from "../features/pcategory/pcategorySlice";

let schema = Yup.object().shape({
  title: Yup.string().required("Category Name is Required."),
});

const Addcat = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const getPCatId = location.pathname.split("/")[3];
  const navigate = useNavigate();
  const newCategory = useSelector((state) => state.pcategory);
  const {
    isSuccess,
    isError,
    isLoading,
    createdCategory,
    categoryName,
    updatedCategory,
  } = newCategory;

  const [image, setImage] = useState(null); // State to handle image

  useEffect(() => {
    if (getPCatId !== undefined) {
      dispatch(getAProductCategory(getPCatId));
    } else {
      dispatch(resetState());
    }
  }, [getPCatId]);

  useEffect(() => {
    if (isSuccess && createdCategory) {
      toast.success("Category Added Successfully!");
    }
    if (isSuccess && updatedCategory) {
      toast.success("Category Updated Successfully!");
      navigate("/admin/list-category");
    }
    if (isError) {
      toast.error("Something Went Wrong!");
    }
  }, [isSuccess, isError, isLoading]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: categoryName || "",
    },
    validationSchema: schema,
    onSubmit: async (values) => {
      const formData = new FormData();
      formData.append("title", values.title);
      if (image) {
        formData.append("image", image); // Add image to formData
      }

      if (getPCatId !== undefined) {
        const data = { id: getPCatId, pCatData: formData };
        dispatch(updateAProductCategory(data));
        dispatch(resetState());
      } else {
        dispatch(createCategory(formData));
        formik.resetForm();
        setImage(null); // Reset image
        setTimeout(() => {
          dispatch(resetState());
        }, 300);
      }
    },
  });

  return (
    <div>
      <h3 className="mb-4 title">
        {getPCatId !== undefined ? "Edit" : "Add"} Category
      </h3>
      <div>
        <form action="" onSubmit={formik.handleSubmit}>
          <CustomInput
            type="category"
            label="Enter Product Category"
            val={formik.values.title}
            onChg={formik.handleChange("title")}
            onBlr={formik.handleBlur("title")}
            id="category"
          />
          <div className="error">
            {formik.touched.title && formik.errors.title}
          </div>

          {/* Image Upload Section */}
          <div className="form-group">
            <label>Upload Category Image</label>
            <Dropzone
              onDrop={(acceptedFiles) => {
                if (acceptedFiles.length > 0) {
                  setImage(acceptedFiles[0]);
                }
              }}
            >
              {({ getRootProps, getInputProps }) => (
                <div
                  {...getRootProps()}
                  style={{
                    border: "1px dashed #ccc",
                    padding: "10px",
                    textAlign: "center",
                    cursor: "pointer",
                  }}
                >
                  <input {...getInputProps()} />
                  <p>Drag 'n' drop an image here, or click to select one</p>
                </div>
              )}
            </Dropzone>
            {image && (
              <div className="mt-3">
                <img
                  src={URL.createObjectURL(image)}
                  alt="Preview"
                  style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "cover",
                    borderRadius: "5px",
                  }}
                />
                <button
                  type="button"
                  onClick={() => setImage(null)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "red",
                    cursor: "pointer",
                  }}
                >
                  Remove
                </button>
              </div>
            )}
          </div>

          <button
            className="btn btn-success border-0 rounded-3 my-5"
            type="submit"
          >
            {getPCatId !== undefined ? "Edit" : "Add"} Category
          </button>
        </form>
      </div>
    </div>
  );
};

export default Addcat;
