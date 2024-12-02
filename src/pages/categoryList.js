import React, { useEffect, useState } from "react";
import { Table } from "antd";
import { Link } from "react-router-dom";
import { FaRegEdit } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllCategories,
  resetState,
  deleteCategory,
} from "../features/product/productSlice";
import CustomModal from "../components/customModal";
import { AiFillDelete } from "react-icons/ai";

const columns = [
  {
    title: "SNo",
    dataIndex: "key",
  },
  {
    title: "Name",
    dataIndex: "name",
    sorter: (a, b) => a.name.length - b.name.length,
  },
  {
    title: "Action",
    dataIndex: "action",
  },
];

const Categorylist = () => {
  const [open, setOpen] = useState(false);
  const [pCatId, setpCatId] = useState("");

  const dispatch = useDispatch();

  const showModal = (e) => {
    setOpen(true);
    setpCatId(e);
  };

  const hideModal = () => {
    setOpen(false);
  };

  const handleDeleteCategory = (categoryId) => {
    dispatch(deleteCategory(categoryId)).then(() => {
      hideModal();
      dispatch(getAllCategories()); // Refresh the list after deletion
    });
  };

  useEffect(() => {
    dispatch(resetState());
    dispatch(getAllCategories());
  }, [dispatch]);

  const categoryState =
    useSelector((state) => state?.product?.productCategories) || [];
  const isLoading = useSelector((state) => state?.product?.isLoading);

  const data1 = categoryState.map((category, index) => ({
    key: index + 1,
    name: category.name,
    action: (
      <>
        {/* <Link
          to={`/admin/category/${category._id}`}
          className="fs-3 text-danger"
        >
          <FaRegEdit />
        </Link> */}
        <button
          className="ms-3 fs-3 text-danger bg-transparent border-0"
          onClick={() => showModal(category._id)}
          disabled={isLoading}
        >
          <AiFillDelete />
        </button>
      </>
    ),
  }));

  return (
    <div>
      <h3 className="mb-4 title">Product Categories</h3>
      <div>
        <Table columns={columns} dataSource={data1} loading={isLoading} />
      </div>
      <CustomModal
        hideModal={hideModal}
        open={open}
        performAction={() => handleDeleteCategory(pCatId)}
        title="Are you sure you want to delete this Product Category?"
      />
    </div>
  );
};

export default Categorylist;