import React, { useEffect, useState } from "react";
import { Table } from "antd";
import { Link } from "react-router-dom";
import { FaRegEdit } from "react-icons/fa";
import { AiFillDelete } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllProducts,
  deleteAProduct,
  resetState,
} from "../features/product/productSlice";
import CustomModal from "../components/customModal";
import { toast } from "react-toastify";

const columns = [
  {
    title: "SNo",
    dataIndex: "key",
  },
  {
    title: "Title",
    dataIndex: "title",
    sorter: (a, b) => a.title.length - b.title.length,
  },
  {
    title: "Category",
    dataIndex: "category",
    sorter: (a, b) => (a.category?.length || 0) - (b.category?.length || 0),
  },
  {
    title: "Color",
    dataIndex: "color",
    render: (colors) => (
      <span>
        {Array.isArray(colors)
          ? colors.map((color) => color.title).join(", ")
          : "No color"}
      </span>
    ),
  },
  {
    title: "Price",
    dataIndex: "price",
    sorter: (a, b) => {
      const priceA = parseFloat(a.price.split(" - ")[0]);
      const priceB = parseFloat(b.price.split(" - ")[0]);
      return priceA - priceB;
    },
  },
  {
    title: "Action",
    dataIndex: "action",
  },
];

const Productlist = () => {
  const [open, setOpen] = useState(false);
  const [productId, setproductId] = useState("");
  const dispatch = useDispatch();
  const { isLoading, isError, isSuccess, message, products } = useSelector(
    (state) => state.product
  );

  useEffect(() => {
    dispatch(getAllProducts());
  }, [dispatch]);

  // Watch for success/error states
  useEffect(() => {
    if (isSuccess && message === "Product Deleted Successfully") {
      toast.success("Product deleted successfully!");
      dispatch(resetState());
    }
    if (isError) {
      toast.error("Something went wrong!");
    }
  }, [isSuccess, isError, message, dispatch]);

  const showModal = (id) => {
    setOpen(true);
    setproductId(id);
  };

  const hideModal = () => {
    setOpen(false);
  };

  const deleteProduct = async (id) => {
    try {
      await dispatch(deleteAProduct(id)).unwrap();
      setOpen(false);
      toast.success("Product Deleted Successfully!");
      dispatch(getAllProducts());
    } catch (error) {
      toast.error(error?.message || "Failed to delete product");
    }
  };

  const data1 =
    products?.map((product, index) => ({
      key: index + 1,
      title: product.productTitle,
      category: product.categoryName,
      color: product.colors,
      price: `${product.lowestPrice} - ${product.largestPrice}`,
      action: (
        <>
          <Link
            to={`/admin/product/${product._id}`}
            className="fs-3 text-danger"
          >
            <FaRegEdit />
          </Link>
          <button
            className="ms-3 fs-3 text-danger bg-transparent border-0"
            onClick={() => showModal(product._id)}
            disabled={isLoading}
          >
            <AiFillDelete />
          </button>
        </>
      ),
    })) || [];

  return (
    <div>
      <h3 className="mb-4 title">Products</h3>
      <div className="mb-4">
        <Link to="/admin/product" className="btn btn-success">
          Add New Product
        </Link>
      </div>
      <div>
        <Table
          columns={columns}
          dataSource={data1}
          loading={isLoading}
          pagination={{
            defaultPageSize: 10,
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "30"],
          }}
        />
      </div>
      <CustomModal
        hideModal={hideModal}
        open={open}
        performAction={() => {
          deleteProduct(productId);
        }}
        title="Are you sure you want to delete this product?"
      />
    </div>
  );
};

export default Productlist;
