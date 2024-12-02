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
      name: order?.userDetails.user.username,
      product: order?.productDetails.product.productTitle,
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
          <h3 className="mb-5 title">Income Statics</h3>
          <div className="h-80" style={{ width: "560px" }}>
            <Column {...config} />
          </div>
        </div>

        {/* Recent Orders Table */}
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
