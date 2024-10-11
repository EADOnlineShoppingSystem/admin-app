import React, { useEffect } from 'react'
import { Table } from 'antd';
import { Link } from "react-router-dom";
import { FaRegEdit } from "react-icons/fa";
import { AiFillDelete } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { getProductCategories } from '../features/pcategory/pcategorySlice';


const columns = [
    {
        title: 'SNo',
        dataIndex: 'key',
    },
    {
        title: 'Name',
        dataIndex: 'name',
        sorter: (a, b) => a.name.length - b.name.length,
    },
    {
      title: "Action",
      dataIndex: "action",
    },
  ];
  
const Categorylist = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getProductCategories());
  }, []);
  const categoryState = useSelector((state) => state.pcategory.pCategories);
  const data1 = [];
  for (let i = 0; i < categoryState.length; i++) {
    data1.push({
        key: i + 1,
        name: categoryState[i].title,
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
        <h3 className="mb-4 title">Product Categories</h3>
        <div>
        <Table
             columns={columns}
             dataSource={data1}
          /> 
        </div>
    </div>
  )
}

export default Categorylist;