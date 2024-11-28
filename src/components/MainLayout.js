import React, { useState } from 'react';
import { MdDashboard } from "react-icons/md";
import { BsCart3 } from "react-icons/bs";
import { GrCatalog } from "react-icons/gr";
import { HiUsers } from "react-icons/hi2";
import { RiCoupon5Line } from "react-icons/ri";
import { BiCategoryAlt } from "react-icons/bi";
import { MdOutlineFormatColorFill } from "react-icons/md";
import { FaClipboardList } from "react-icons/fa";
import { IoIosNotifications } from "react-icons/io";
import { ToastContainer } from "react-toastify";
import { HiClipboardDocumentList } from "react-icons/hi2";
import { FaEnvelopeOpenText } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";

import { Link, Outlet } from 'react-router-dom';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import { Button, Layout, Menu, theme } from 'antd';
import { useNavigate } from 'react-router-dom';
const { Header, Sider, Content } = Layout;
const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const navigate = useNavigate();
  return (
    <Layout>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="demo-logo-vertical">
          <h2 className='text-white fs-5 text-center py-4 mb-0'>
            <span className='sm-logo'>NGD</span>
            <span className='lg-logo'>NextGen Dresses</span>
          </h2>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['']}
          onClick={({ key }) => {
            if (key === "signout") {

            }else{
              navigate(key);
            }
          }}
          items={[
            {
              key: '',
              icon: <MdDashboard className='fs-4' />,
              label: 'Dashboard',
            },
            {
              key: 'customers',
              icon: <HiUsers className='fs-4' />,
              label: 'Customers',
            },
            {
              key: 'catalog',
              icon: <GrCatalog className='fs-4' />,
              label: 'Catalog',
              children: [
                {
                  key: 'product',
                  icon: <BsCart3 className='fs-4' />,
                  label: 'Add Product',
                },
                {
                  key: 'list-product',
                  icon: <BsCart3 className='fs-4' />,
                  label: 'Product List',
                },
                {
                  key: 'category',
                  icon: <BiCategoryAlt className='fs-4' />,
                  label: 'Category',
                },
                {
                  key: 'list-category',
                  icon: <BiCategoryAlt className='fs-4' />,
                  label: 'Category List',
                },
                // {
                //   key: 'color',
                //   icon: <MdOutlineFormatColorFill className='fs-4' />,
                //   label: 'Color',
                // },
                {
                  key: 'list-color',
                  icon: <MdOutlineFormatColorFill className='fs-4' />,
                  label: 'Color List',
                },
              ]
            },
            {
              key: 'orders',
              icon: <HiClipboardDocumentList className='fs-4' />,
              label: 'Orders',
            },
            // {
            //   key: 'marketing',
            //   icon: <RiCoupon5Line className='fs-4' />,
            //   label: 'Marketing',
            //   children: [
            //     {
            //       key: 'coupon',
            //       icon: <FaEnvelopeOpenText className='fs-4' />,
            //       label: 'Add Coupon',
            //     },
            //     {
            //       key: 'coupon-list',
            //       icon: <RiCoupon5Line className='fs-4' />,
            //       label: 'Coupon List',
            //     },
            //   ]
            // },
            {
              key: 'enquiries',
              icon: <FaClipboardList className='fs-4' />,
              label: 'Enquiries',
            },
          ]}
        />
      </Sider>
      <Layout>
        <Header
          className='d-flex justify-content-between ps-2 pe-5'
          style={{
            padding: 0,
            background: colorBgContainer,
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />
          <div className='d-flex gap-4 align-items-center'>
             <div className='position-relative'>
               <IoIosNotifications className='fs-4' />
               <span className="badge bg-warning rounded-circle p-1 position-absolute">3</span>
             </div>
             <div className='d-flex gap-3 align-items-center dropdown'>
               <div>
                 <img
                   width={40}
                   height={40}
                   src="https://t4.ftcdn.net/jpg/03/64/21/11/360_F_364211147_1qgLVxv1Tcq0Ohz3FawUfrtONzz8nq3e.jpg" alt="" />
               </div>
               <div
                  role='button'
                  id='dropdownMenuLink'
                  data-bs-toggle='dropdown'
                  aria-expanded='false'
                >
                 <h5 className='mb-0'>Supun</h5>
                 <p className='mb-0'>supun20000207@gmail.com</p>
               </div>
               <div 
                 className='dropdown-menu'
                 aria-labelledby='dropdownMenuLink'
               >
                  <li>
                    <Link 
                     to="/" 
                     className='dropdown-item py-1 mb-1'
                     style={{ height: "auto", lineHeight: "20px" }}
                    >
                      View Profile
                    </Link>
                  </li>
                  <li>
                    <Link 
                     to="/" 
                     className='dropdown-item py-1 mb-1'
                     style={{ height: "auto", lineHeight: "20px" }}
                    >
                      Signout
                    </Link>
                  </li>
               </div>
             </div>
          </div>
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <ToastContainer 
          position="top-right"
          autoClose={250}
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          theme="light"
          />
          <Outlet/>
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;