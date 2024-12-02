import React, { useEffect } from "react";
import { Table } from "antd";
import { FaRegEdit } from "react-icons/fa";
import { AiFillDelete } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrders } from "../features/orders/orderSlice";
import { Link } from "react-router-dom";

const columns = [
  {
    title: "SNo",
    dataIndex: "key",
  },
  {
    title: "Name",
    dataIndex: "name",
  },
  {
    title: "Product",
    dataIndex: "product",
  },
  {
    title: "Amount",
    dataIndex: "amount",
  },
  {
    title: "Date",
    dataIndex: "date",
  },
  {
    title: "Action",
    dataIndex: "action",
  },
];

const Orders = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getAllOrders());
  }, [dispatch]);

  const orderState = useSelector((state) => state?.order?.orders);
  const isLoading = useSelector((state) => state.order.isLoading);

  const data1 = [];
  for (let i = 0; i < orderState?.length; i++) {
    data1.push({
      key: i + 1,
      name: orderState[i]?.userDetails?.user?.username || "N/A",
      // product: (
      //   <Link to={`/admin/order/${orderState[i]?._id}`}>View Orders</Link>
      // ),
      product: orderState[i]?.productDetails?.product.productTitle,
      amount: orderState[i]?.price,
      date: new Date(orderState[i]?.createdAt).toLocaleString(),
      // status: orderState[i]?.orderStatus,
      action: (
        <>
          <Link to="/" className="fs-3 text-danger">
            <FaRegEdit />
          </Link>
          <Link to="/" className="ms-3 fs-3 text-danger">
            <AiFillDelete />
          </Link>
        </>
      ),
    });
  }

  return (
    <div>
      <h3 className="mb-4 title">Orders</h3>
      <div>{<Table columns={columns} dataSource={data1} />}</div>
    </div>
  );
};

export default Orders;
