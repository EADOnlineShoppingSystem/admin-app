import React, { useEffect } from "react";
import { Table } from "antd";
import { CheckCircleFilled, CloseCircleFilled } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { getUsers } from "../features/customers/customerSlice";

const StatusIndicator = ({ isVerified }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      {isVerified ? (
        <>
          <CheckCircleFilled style={{ fontSize: '16px', color: '#52c41a' }} />
          <span style={{ color: '#52c41a' }}>Verified</span>
        </>
      ) : (
        <>
          <CloseCircleFilled style={{ fontSize: '16px', color: '#f5222d' }} />
          <span style={{ color: '#f5222d' }}>Unverified</span>
        </>
      )}
    </div>
  );
};

const columns = [
  {
    title: "SNo",
    dataIndex: "key",
  },
  {
    title: "Name",
    dataIndex: "name",
    defaultSortOrder: "descend",
    sorter: (a, b) => a.name.length - b.name.length,
  },
  {
    title: "Email",
    dataIndex: "email",
  },
  {
    title: "Status",
    dataIndex: "status",
    render: (isVerified) => <StatusIndicator isVerified={isVerified} />,
  },
];

const Customers = () => {
  const dispatch = useDispatch();
  
  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);

  const customerState = useSelector((state) => state.customer.customers);
  const data1 = [];
  
  for (let i = 0; i < customerState.length; i++) {
    if (customerState[i].role !== "admin") {
      data1.push({
        key: i + 1,
       // name: customerState[i].firstName + " " + customerState[i].lastName,
        name: customerState[i].username || '',
        email: customerState[i].email,
        status: customerState[i].isVerified,
      });
    }
  }

  return (
    <div>
      <h3 className="mb-4 title">Customers</h3>
      <div>
        <Table columns={columns} dataSource={data1} />
      </div>
    </div>
  );
};

export default Customers;
