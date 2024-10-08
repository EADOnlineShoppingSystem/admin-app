import React from "react";
import { BsArrowDownRight, BsArrowUpRight } from "react-icons/bs";
import { Column } from "@ant-design/plots";
import { Table } from 'antd';

const columns = [
  {
      title: 'SNo',
      dataIndex: 'key',
  },
  {
      title: 'Name',
      dataIndex: 'name',
  },
  {
      title: 'Product',
      dataIndex: 'product',
  },
  {
    title: 'Status',
    dataIndex: 'status',
},
];

const data1 = [];
for (let i = 0; i < 46; i++) {
  data1.push({
      key: i,
      name: `Edward King ${i}`,
      product: 32,
      status: `London, Park Lane no. ${i}`,
  });
}

const Dashboard = () => {
  const data = [
    {
      type: "Jan",
      sales: 38,
    },
    {
      type: "Feb",
      sales: 52,
    },
    {
      type: "Mar",
      sales: 120,
    },
    {
      type: "Apr",
      sales: 145,
    },
    {
      type: "May",
      sales: 160,
    },
    {
      type: "Jun",
      sales: 177,
    },
    {
      type: "July",
      sales: 163,
    },
    {
      type: "Aug",
      sales: 80,
    },
    {
      type: "Sept",
      sales: 100,
    },
    {
      type: "Oct",
      sales: 182,
    },
    {
      type: "Nov",
      sales: 130,
    },
    {
      type: "Dec",
      sales: 144,
    },
  ];

  const config = {
    data,
    xField: "type",
    yField: "sales",
    color: ({ type }) => {
      return "#2989FF";
    },
    label: {
      position: "top",
      // 'top', 'bottom', 'middle',
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
        alias: "Months",
      },
      sales: {
        alias: "Income",
      },
    },
  };

  return (
    <div>
      <h3 className="mb-4 title">Dashboard</h3>
      <div className="d-flex justify-content-between align-items-center gap-3">
        <div className="d-flex justify-content-between align-items-end flex-grow-1 bg-white p-3 rounded-3">
          <div>
            <p className="desc">Total</p>
            <h4 className="mb-0 sub-title">LKR 4500.00</h4>
          </div>
          <div className="d-flex flex-column align-items-end">
            <h6 className="green">
              <BsArrowUpRight /> 32%
            </h6>
            <p className="mb-0 desc">Compared To October 2024</p>
          </div>
        </div>
        <div className="d-flex justify-content-between align-items-end flex-grow-1 bg-white p-3 rounded-3">
          <div>
            <p className="desc">Total</p>
            <h4 className="mb-0 sub-title">LKR 4500.00</h4>
          </div>
          <div className="d-flex flex-column align-items-end">
            <h6 className="red">
              <BsArrowDownRight />
              32%
            </h6>
            <p className="mb-0 desc">Compared To October 2024</p>
          </div>
        </div>
        <div className="d-flex justify-content-between align-items-end flex-grow-1 bg-white p-3 rounded-3">
          <div>
            <p className="desc">Total</p>
            <h4 className="mb-0 sub-title">LKR 4500.00</h4>
          </div>
          <div className="d-flex flex-column align-items-end">
            <h6 className="green">
              <BsArrowUpRight />
              32%
            </h6>
            <p className="mb-0 desc">Compared To October 2024</p>
          </div>
        </div>
      </div>
      <div className="d-flex gap-3 justify-content-between mt-4">
      <div className="mt-4 flex-grow-1">
        <h3 className="mb-5 title">Income Statics</h3>
        <div>
          <Column {...config} />
        </div>
      </div>
      <div className="mt-4 flex-grow-1">
        <h3 className="mb-5 title">Recent Orders</h3>
        <div>
          <Table
             columns={columns}
             dataSource={data1}
          />   
        </div>
      </div>
      </div>
    </div>
  );
};

export default Dashboard;