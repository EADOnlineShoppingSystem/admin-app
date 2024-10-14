// import React, { useEffect } from "react";
// import { Table } from "antd";
// import { FaRegEdit } from "react-icons/fa";
// import { AiFillDelete } from "react-icons/ai";
// import { useDispatch, useSelector } from "react-redux";
// import { getOrderByUser, getOrders } from "../features/auth/authSlice";
// import { Link, useLocation } from "react-router-dom";
// const columns = [
//   {
//     title: "SNo",
//     dataIndex: "key",
//   },
//   {
//     title: "Name",
//     dataIndex: "name",
//   },
//   {
//     title: "Category",
//     dataIndex: "category",
//   },
//   {
//     title: "Count",
//     dataIndex: "count",
//   },
//   {
//     title: "Color",
//     dataIndex: "color",
//   },
//   {
//     title: "Amount",
//     dataIndex: "amount",
//   },
//   {
//     title: "Date",
//     dataIndex: "date",
//   },
//   {
//     title: "Action",
//     dataIndex: "action",
//   },
// ];

// const ViewOrder = () => {
//   const location = useLocation();
//   const userId = location.pathname.split("/")[3];
//   const dispatch = useDispatch();
//   useEffect(() => {
//     dispatch(getOrderByUser(userId));
//   }, []);
//   const orderState = useSelector((state) => state.auth.orderbyuser[0].products);
//   console.log(orderState);
//   const data1 = [];
//   for (let i = 0; i < orderState.length; i++) {
//     data1.push({
//       key: i + 1,
//       name: orderState[i].product.title,
//       category: orderState[i].product.category,
//       count: orderState[i].count,
//       amount: orderState[i].product.price,
//       color: orderState[i].product.color,
//       date: orderState[i].product.createdAt,
//       action: (
//         <>
//           <Link to="/" className="fs-3 text-danger">
//             <FaRegEdit />
//           </Link>
//           <Link to="/" className="ms-3 fs-3 text-danger">
//             <AiFillDelete />
//           </Link>
//         </>
//       ),
//     });
//   }
//   return (
//     <div>
//       <h3 className="mb-4 title">View Order</h3>
//       <div>
//         <Table columns={columns} dataSource={data1} />
//       </div>
//     </div>
//   );
// };

// export default ViewOrder;





import React, { useEffect } from "react";
import { Table } from "antd";
import { FaRegEdit } from "react-icons/fa";
import { AiFillDelete } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { getOrderByUser } from "../features/auth/authSlice";
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
    dataIndex: "count",
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
  const dispatch = useDispatch();
  
  useEffect(() => {
    dispatch(getOrderByUser(userId));
  }, [dispatch, userId]);

  const orderState = useSelector((state) => state.auth.orderbyuser);
  const isLoading = useSelector((state) => state.auth.isLoading);
  const isError = useSelector((state) => state.auth.isError);

  console.log("Order State:", orderState);
  console.log("Is Loading:", isLoading);
  console.log("Is Error:", isError);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error occurred while fetching the order.</div>;
  }

  if (!orderState || (Array.isArray(orderState) && orderState.length === 0)) {
    return <div>No order data available.</div>;
  }

  const orderProducts = Array.isArray(orderState) ? orderState[0]?.products : orderState?.products;

  if (!orderProducts || orderProducts.length === 0) {
    return <div>No products found in this order.</div>;
  }

  const data1 = orderProducts.map((item, index) => ({
    key: index + 1,
    name: item.product?.title || item.title || 'N/A',
    category: item.product?.category || item.category || 'N/A',
    count: item.count || item.quantity || 0,
    amount: item.product?.price || item.price || 0,
    color: item.product?.color || item.color || 'N/A',
    date: item.product?.createdAt || item.createdAt 
      ? new Date(item.product?.createdAt || item.createdAt).toLocaleString() 
      : 'N/A',
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
  }));

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