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
import CustomModal from "../components/CustomModal";
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
          ? colors.map(colors => colors.title).join(", ")
          : "No color"}
      </span>
    ),
  },
  {
    title: "Price",
    dataIndex: "price",
    sorter: (a, b) => a.price - b.price,
  },
  {
    title: "Action",
    dataIndex: "action",
  },
];

const Productlist = () => {
  const [open, setOpen] = useState(false);
  const [productId, setproductId] = useState("");
  const showModal = (e) => {
    setOpen(true);
    setproductId(e);
  };

  const hideModal = () => {
    setOpen(false);
  };
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(resetState());
    dispatch(getAllProducts());
  }, [dispatch]);
  const productState = useSelector((state) => state.product.products);

  const data1 = productState.map((product, index) => ({
    key: index + 1,
    title: product.productTitle,
    category: product.categoryName,
    color: product.colors, // This will now contain the populated color objects
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
        >
          <AiFillDelete />
        </button>
      </>
    ),
  }));

  const deleteProduct = (e) => {
    dispatch(deleteAProduct(e));
    setOpen(false);
    setTimeout(() => {
      dispatch(getAllProducts());
      toast.success("Product deleted successfully!");
    }, 100);
  };
  return (
    <div>
      <h3 className="mb-4 title">Products</h3>
      <div>
        <Table columns={columns} dataSource={data1} />
      </div>
      <CustomModal
        hideModal={hideModal}
        open={open}
        performAction={() => {
          deleteProduct(productId);
        }}
        title="Are you sure you want to delete this blog?"
      />
    </div>
  );
};

export default Productlist;