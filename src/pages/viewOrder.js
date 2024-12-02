import React, { useEffect } from "react";
import { Table } from "antd";
import { FaRegEdit } from "react-icons/fa";
import { AiFillDelete } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { getOrdersByUserId } from "../features/orders/orderSlice";
import { Link, useLocation } from "react-router-dom";

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
    title: "Category",
    dataIndex: "category",
  },
  {
    title: "Count",
    dataIndex: "quantity",
  },
  {
    title: "Color",
    dataIndex: "color",
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

const ViewOrder = () => {
  const location = useLocation();
  const userId = location.pathname.split("/")[3];
  console.log("URL userId:", location.pathname.split("/")[3]);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getOrdersByUserId(userId));
  }, []);

  const orderState = useSelector(
    (state) => state?.order?.orderbyuser?.[0]?.products || []
  );

  console.log(orderState);
  const data1 = [];
  for (let i = 0; i < orderState.length; i++) {
    data1.push({
      key: i + 1,
      name: orderState[i]?.productDetails?.product.productTitle,
      category: orderState[i].productDetails?.categoryName,
      count: orderState[i].count,
      amount: orderState[i].product.price,
      color: orderState[i].product.colors,
      date: orderState[i].product.createdAt,
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
      <h3 className="mb-4 title">View Order</h3>
      <div>
        <Table columns={columns} dataSource={data1} />
      </div>
    </div>
  );
};

export default ViewOrder;
