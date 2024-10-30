import React, { useEffect } from "react";
import { Table } from "antd";
import { FaRegEdit } from "react-icons/fa";
import { AiFillDelete } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { getOrderByUser, getOrders } from "../features/auth/authSlice";
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
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getOrderByUser(userId));
  }, []);

  
  const orderState = useSelector((state) => state?.auth?.orderbyuser?.[0]?.products || []);

  console.log(orderState);
  const data1 = [];
  for (let i = 0; i < orderState.length; i++) {
    data1.push({
      key: i + 1,
      name: orderState[i]?.product?.title,
      category: orderState[i].product.category,
      count: orderState[i].count,
      amount: orderState[i].product.price,
      color: orderState[i].product.color,
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



// import React, { useEffect } from "react";
// import { Table } from "antd";
// import { useDispatch, useSelector } from "react-redux";
// import { BiEdit } from "react-icons/bi";
// import { AiFillDelete } from "react-icons/ai";
// import { Link, useLocation } from "react-router-dom";
// import { getOrderByUser, getOrders } from "../features/auth/authSlice";
// const columns = [
//   {
//     title: "SNo",
//     dataIndex: "key",
//   },
//   {
//     title: "Product Name",
//     dataIndex: "name",
//   },
//   {
//     title: "Brand",
//     dataIndex: "brand",
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
//   const orderState = useSelector((state) => state?.auth?.orderbyuser?.[0]?.products || []);
//   console.log(orderState);
//   const data1 = [];
//   for (let i = 0; i < orderState.length; i++) {
//     data1.push({
//       key: i + 1,
//       name: orderState[i].product.title,
//       brand: orderState[i].product.brand,
//       count: orderState[i].count,
//       amount: orderState[i].product.price,
//       color: orderState[i].product.color,
//       date: orderState[i].product.createdAt,
//       action: (
//         <>
//           <Link to="/" className=" fs-3 text-danger">
//             <BiEdit />
//           </Link>
//           <Link className="ms-3 fs-3 text-danger" to="/">
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





// import React, { useEffect } from "react";
// import { Table } from "antd";
// import { FaRegEdit } from "react-icons/fa";
// import { AiFillDelete } from "react-icons/ai";
// import { useDispatch, useSelector } from "react-redux";
// import { getOrderByUser } from "../features/auth/authSlice";
// import { Link, useLocation } from "react-router-dom";

// const columns = [
//   {
//     title: "SNo",
//     dataIndex: "key",
//   },
//   {
//     title: "Product Name",
//     dataIndex: "name",
//   },
//   {
//     title: "Size",
//     dataIndex: "size",
//   },
//   {
//     title: "Quantity",
//     dataIndex: "quantity",
//   },
//   {
//     title: "Color",
//     dataIndex: "color",
//   },
//   {
//     title: "Amount",
//     dataIndex: "price",
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
//     console.log('Dispatching with userId:', userId);
//     dispatch(getOrderByUser(userId));
//   }, [dispatch, userId]);

//   const orderState = useSelector((state) => state.auth.orderbyuser);
//   const isLoading = useSelector((state) => state.auth.isLoading);
//   const isError = useSelector((state) => state.auth.isError);

//   if (isLoading) return <div>Loading...</div>;
//   if (isError) return <div>Error occurred while fetching the order.</div>;
//   if (!orderState || !Array.isArray(orderState) || orderState.length === 0) {
//     return <div>No order data available.</div>;
//   }

//   const data1 = orderState.flatMap((order) =>
//     order.orderItems.map((item, index) => ({
//       key: index + 1,
//       name: item?.product?.title || 'N/A',
//       size: item?.size || 'N/A',
//       quantity: item?.quantity || 0,
//       color: item?.color?.title || 'N/A',
//       price: item?.price || 0,
//       date: new Date(order.createdAt).toLocaleString(),
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
//     }))
//   );

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