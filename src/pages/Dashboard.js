// import React, { useEffect } from 'react'
// import { BsArrowDownRight, BsArrowUpRight } from "react-icons/bs";
// import { Column } from "@ant-design/plots";
// import { Table } from 'antd';
// import { getAllOrders } from '../features/orders/orderSlice';
// import { useDispatch, useSelector } from "react-redux";

// const columns = [
//   {
//       title: 'OrderID',
//       dataIndex: 'key',
//   },
//   {
//       title: 'Name',
//       dataIndex: 'name',
//   },
//   {
//     title: 'Product',
//     dataIndex: 'product',
//   },
//   {
//     title: 'Amount',
//     dataIndex: 'amount',
//   },
// //   {
// //     title: 'Status',
// //     dataIndex: 'status',
// // },
// ];

// // const data1 = [];
// // for (let i = 0; i < 46; i++) {
// //   data1.push({
// //       key: i + 1,
// //       name: `Edward King ${i}`,
// //       product: 32,
// //       status: `London, Park Lane no. ${i}`,
// //   });
// // }

// const Dashboard = () => {
//   const dispatch = useDispatch();
//   useEffect(() => {
//     dispatch(getAllOrders());
//   }, [dispatch]);

//   const orderState = useSelector((state) => state?.order?.orders);
//   const isLoading = useSelector((state) => state.order.isLoading);

//   const data1 = [];
//   for (let i = 0; i < orderState?.length; i++) {
//     data1.push({
//       key: i + 1,
//       name: `${orderState[i]?.shippingInfo?.firstName} ${orderState[i]?.shippingInfo?.lastName}`,
//       product: orderState[i]?.productId,
//       amount: orderState[i]?.price,
//       date: new Date(orderState[i]?.createdAt).toLocaleString(),
//     //  status: orderState[i]?.orderStatus,
//     });
//   }

//   const data = [
//     {
//       type: "Jan",
//       sales: 38,
//     },
//     {
//       type: "Feb",
//       sales: 52,
//     },
//     {
//       type: "Mar",
//       sales: 120,
//     },
//     {
//       type: "Apr",
//       sales: 145,
//     },
//     {
//       type: "May",
//       sales: 160,
//     },
//     {
//       type: "Jun",
//       sales: 177,
//     },
//     {
//       type: "July",
//       sales: 163,
//     },
//     {
//       type: "Aug",
//       sales: 80,
//     },
//     {
//       type: "Sept",
//       sales: 100,
//     },
//     {
//       type: "Oct",
//       sales: 182,
//     },
//     {
//       type: "Nov",
//       sales: 130,
//     },
//     {
//       type: "Dec",
//       sales: 144,
//     },
//   ];

//   const config = {
//     data,
//     xField: "type",
//     yField: "sales",
//     color: ({ type }) => {
//       return "#2989FF";
//     },
//     label: {
//       position: "top",
//       // 'top', 'bottom', 'middle',
//       style: {
//         fill: "#FFFFFF",
//         opacity: 1,
//       },
//     },
//     xAxis: {
//       label: {
//         autoHide: true,
//         autoRotate: false,
//       },
//     },
//     meta: {
//       type: {
//         alias: "Months",
//       },
//       sales: {
//         alias: "Income",
//       },
//     },
//   };

//   return (
//     <div>
//       <h3 className="mb-4 title">Dashboard</h3>
//       <div className="d-flex justify-content-between align-items-center gap-3">
//         <div className="d-flex justify-content-between align-items-end flex-grow-1 bg-white p-3 rounded-3">
//           <div>
//             <p className="desc">Total</p>
//             <h4 className="mb-0 sub-title">LKR 4500.00</h4>
//           </div>
//           <div className="d-flex flex-column align-items-end">
//             <h6 className="green">
//               <BsArrowUpRight /> 32%
//             </h6>
//             <p className="mb-0 desc">Compared To October 2024</p>
//           </div>
//         </div>
//         <div className="d-flex justify-content-between align-items-end flex-grow-1 bg-white p-3 rounded-3">
//           <div>
//             <p className="desc">Total</p>
//             <h4 className="mb-0 sub-title">LKR 4500.00</h4>
//           </div>
//           <div className="d-flex flex-column align-items-end">
//             <h6 className="red">
//               <BsArrowDownRight />
//               32%
//             </h6>
//             <p className="mb-0 desc">Compared To October 2024</p>
//           </div>
//         </div>
//         <div className="d-flex justify-content-between align-items-end flex-grow-1 bg-white p-3 rounded-3">
//           <div>
//             <p className="desc">Total</p>
//             <h4 className="mb-0 sub-title">LKR 4500.00</h4>
//           </div>
//           <div className="d-flex flex-column align-items-end">
//             <h6 className="green">
//               <BsArrowUpRight />
//               32%
//             </h6>
//             <p className="mb-0 desc">Compared To October 2024</p>
//           </div>
//         </div>
//       </div>
//       <div className="d-flex gap-3 justify-content-between mt-4">
//       <div className="mt-4 flex-grow-1">
//         <h3 className="mb-5 title">Income Statics</h3>
//         <div>
//           <Column {...config} />
//         </div>
//       </div>
//       <div className="mt-4 flex-grow-1">
//         <h3 className="mb-5 title">Recent Orders</h3>
//         <div>
//           <Table
//              columns={columns}
//              dataSource={data1}
//           />
//         </div>
//       </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;

import React, { useEffect } from "react";
import { Column } from "@ant-design/plots";
import { Table } from "antd";
import {
  getAllOrders,
  getLast10DaysOrderCounts,
  getMonthlyAmountsAndCounts,
} from "../features/orders/orderSlice";
import { useDispatch, useSelector } from "react-redux";
import StatisticCard from "../components/statisticCard";

const columns = [
  {
    title: "OrderID",
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
];

const Dashboard = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllOrders());
    dispatch(getLast10DaysOrderCounts());
    dispatch(getMonthlyAmountsAndCounts());
  }, [dispatch]);

  // Selectors
  const orderState = useSelector((state) => state?.order?.orders);
  const last10DaysStats = useSelector((state) => state?.order?.last10DaysStats);
  const monthlyStats = useSelector((state) => state?.order?.monthlyStats);
  const isLoading = useSelector((state) => state.order.isLoading);

  // Get current and previous month stats
  const currentMonthStats = monthlyStats?.[monthlyStats?.length - 1];
  const previousMonthStats = monthlyStats?.[monthlyStats?.length - 2];

  // Format the comparison month
  const comparisonMonth = previousMonthStats
    ? new Date(previousMonthStats.month).toLocaleString("default", {
        month: "long",
        year: "numeric",
      })
    : "";

  // Transform orders data for table
  const data1 =
    orderState?.map((order, index) => ({
      key: index + 1,
      name: `${order?.shippingInfo?.firstName} ${order?.shippingInfo?.lastName}`,
      product: order?.productId,
      amount: order?.price,
      date: new Date(order?.createdAt).toLocaleString(),
    })) || [];

  // Transform last10DaysStats for the Column chart
  const chartData = last10DaysStats
    ? last10DaysStats.map((item) => ({
        type: new Date(item.date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        sales: item.orders,
      }))
    : [];

  const config = {
    data: chartData,
    xField: "type",
    yField: "sales",
    color: () => "#2989FF",
    label: {
      position: "top",
      style: {
        fill: "#FFFFFF",
        opacity: 1,
      },
    },
    xAxis: {
      label: {
        autoHide: true,
        autoRotate: false,
      },
    },
    meta: {
      type: {
        alias: "Date",
      },
      sales: {
        alias: "Orders",
      },
    },
  };

  return (
    <div className="p-4">
      <h3 className="text-2xl font-bold mb-6">Dashboard</h3>

      {/* Statistics Cards */}
      <div className="d-flex justify-content-between align-items-center gap-3">
        <div>
          <div className="d-flex justify-content-between align-items-end flex-grow-1 bg-white p-3 rounded-3">
            <StatisticCard
              title="Total Sales"
              currentAmount={currentMonthStats?.totalAmount || 0}
              previousAmount={previousMonthStats?.totalAmount || 0}
              comparisonMonth={comparisonMonth}
              isLoading={isLoading}
            />
          </div>
        </div>
        <div>
          <div className="d-flex justify-content-between align-items-end flex-grow-1 bg-white p-3 rounded-3">
            <StatisticCard
              title="Total Orders"
              currentAmount={currentMonthStats?.orderCount || 0}
              previousAmount={previousMonthStats?.orderCount || 0}
              comparisonMonth={comparisonMonth}
              isLoading={isLoading}
              prefix="#"
              showCurrency={false}
              decimalPlaces={0}
            />
          </div>
        </div>
        <div>
          <div className="d-flex justify-content-between align-items-end flex-grow-1 bg-white p-3 rounded-3">
            <StatisticCard
              title="Average Order Value"
              currentAmount={
                currentMonthStats?.orderCount
                  ? currentMonthStats?.totalAmount /
                    currentMonthStats?.orderCount
                  : 0
              }
              previousAmount={
                previousMonthStats?.orderCount
                  ? previousMonthStats?.totalAmount /
                    previousMonthStats?.orderCount
                  : 0
              }
              comparisonMonth={comparisonMonth}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>


      {/* Charts and Table Section */}
      <div className="d-flex gap-3 justify-content-between mt-4">
      <div className="mt-4 flex-grow-1">
      {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8"> */}
        {/* Order Statistics Chart */}
        {/* <div className="bg-white p-6 rounded-lg shadow"> */}
        <h3 className="mb-5 title">Income Statics</h3>
          {/* <h3 className="text-xl font-semibold mb-6">Order Statistics</h3> */}
          <div className="h-80" style={{ width: '560px' }}>
            <Column {...config} />
          </div>
        </div>

        {/* Recent Orders Table */}
        {/* <div className="bg-white p-6 rounded-lg shadow"> */}
        <div className="mt-4 flex-grow-1">
          <h3 className="text-xl font-semibold mb-6">Recent Orders</h3>
          <Table
            columns={columns}
            dataSource={data1}
            loading={isLoading}
            pagination={{
              pageSize: 5,
              total: data1.length,
              showSizeChanger: false,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

// import React, { useEffect } from "react";
// import { BsArrowDownRight, BsArrowUpRight } from "react-icons/bs";
// import { Column } from "@ant-design/plots";
// import { Table } from "antd";
// import {
//   getAllOrders,
//   getLast10DaysOrderCounts,
//   getMonthlyAmountsAndCounts,
// } from "../features/orders/orderSlice";
// import { useDispatch, useSelector } from "react-redux";

// const columns = [
//   {
//     title: "OrderID",
//     dataIndex: "key",
//   },
//   {
//     title: "Name",
//     dataIndex: "name",
//   },
//   {
//     title: "Product",
//     dataIndex: "product",
//   },
//   {
//     title: "Date",
//     dataIndex: "date",
//   },
//   {
//     title: "Amount",
//     dataIndex: "amount",
//   },
// ];

// const Dashboard = () => {
//   const dispatch = useDispatch();

//   useEffect(() => {
//     dispatch(getAllOrders());
//     dispatch(getLast10DaysOrderCounts());
//   }, [dispatch]);

//   const orderState = useSelector((state) => state?.order?.orders);
//   const last10DaysStats = useSelector((state) => state?.order?.last10DaysStats);
//   // const monthlyStats = useSelector((state) => state?.order?.monthlyStats);
//   const isLoading = useSelector((state) => state.order.isLoading);

//   const data1 = [];
//   for (let i = 0; i < orderState?.length; i++) {
//     data1.push({
//       key: i + 1,
//       name: `${orderState[i]?.shippingInfo?.firstName} ${orderState[i]?.shippingInfo?.lastName}`,
//       product: orderState[i]?.productId,
//       amount: orderState[i]?.price,
//       date: new Date(orderState[i]?.createdAt).toLocaleString(),
//     });
//   }

//   // Transform last10DaysStats for the Column chart
//   const chartData = last10DaysStats
//     ? last10DaysStats.map((item) => ({
//         type: new Date(item.date).toLocaleDateString("en-US", {
//           month: "short",
//           day: "numeric",
//         }),
//         sales: item.orders,
//       }))
//     : [];

//   const config = {
//     data: chartData,
//     xField: "type",
//     yField: "sales",
//     color: () => "#2989FF",
//     label: {
//       position: "top",
//       style: {
//         fill: "#FFFFFF",
//         opacity: 1,
//       },
//     },
//     xAxis: {
//       label: {
//         autoHide: true,
//         autoRotate: false,
//       },
//     },
//     meta: {
//       type: {
//         alias: "Date",
//       },
//       sales: {
//         alias: "Orders",
//       },
//     },
//   };

//   return (
//     <div>
//       <h3 className="mb-4 title">Dashboard</h3>
//       <div className="d-flex justify-content-between align-items-center gap-3">
//         <div className="d-flex justify-content-between align-items-end flex-grow-1 bg-white p-3 rounded-3">
//           <div>
//             <p className="desc">Total</p>
//             <h4 className="mb-0 sub-title">LKR 4500.00</h4>
//           </div>
//           <div className="d-flex flex-column align-items-end">
//             <h6 className="green">
//               <BsArrowUpRight /> 32%
//             </h6>
//             <p className="mb-0 desc">Compared To October 2024</p>
//           </div>
//         </div>
//         <div className="d-flex justify-content-between align-items-end flex-grow-1 bg-white p-3 rounded-3">
//           <div>
//             <p className="desc">Total</p>
//             <h4 className="mb-0 sub-title">LKR 4500.00</h4>
//           </div>
//           <div className="d-flex flex-column align-items-end">
//             <h6 className="red">
//               <BsArrowDownRight />
//               32%
//             </h6>
//             <p className="mb-0 desc">Compared To October 2024</p>
//           </div>
//         </div>
//         <div className="d-flex justify-content-between align-items-end flex-grow-1 bg-white p-3 rounded-3">
//           <div>
//             <p className="desc">Total</p>
//             <h4 className="mb-0 sub-title">LKR 4500.00</h4>
//           </div>
//           <div className="d-flex flex-column align-items-end">
//             <h6 className="green">
//               <BsArrowUpRight />
//               32%
//             </h6>
//             <p className="mb-0 desc">Compared To October 2024</p>
//           </div>
//         </div>
//       </div>
//       <div className="d-flex gap-3 justify-content-between mt-4">
//         <div className="mt-4 flex-grow-1">
//           <h3 className="mb-5 title">Order Statistics</h3>
//           <div>
//             <Column {...config} />
//           </div>
//         </div>
//         <div className="mt-4 flex-grow-1">
//           <h3 className="mb-5 title">Recent Orders</h3>
//           <div>
//             <Table columns={columns} dataSource={data1} />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;
