// import React, { useEffect, useState } from "react";
// import { Table } from "antd";
// import { Link } from "react-router-dom";
// import { FaRegEdit } from "react-icons/fa";
// //import { AiFillDelete } from "react-icons/ai";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   getAllCategories,
//   resetState,
// } from "../features/product/productSlice";
// import CustomModal from "../components/CustomModal";
// import { toast } from "react-toastify";

// const columns = [
//   {
//     title: "SNo",
//     dataIndex: "key",
//   },
//   {
//     title: "Name",
//     dataIndex: "name",
//     sorter: (a, b) => a.name.length - b.name.length,
//   },
//   {
//     title: "Action",
//     dataIndex: "action",
//   },
// ];

// const Categorylist = () => {
//   const [open, setOpen] = useState(false);
//   const [pCatId, setpCatId] = useState("");
//   const showModal = (e) => {
//     setOpen(true);
//     setpCatId(e);
//   };

//   const hideModal = () => {
//     setOpen(false);
//   };
//   const dispatch = useDispatch();
//   useEffect(() => {
//     dispatch(resetState());
//     dispatch(getAllCategories());
//   }, []);
//   const categoryState = useSelector((state) => state?.product?.productCategories);
//   const data1 = [];
//   for (let i = 0; i < categoryState.length; i++) {
//     data1.push({
//       key: i + 1,
//       name: categoryState[i].name,
//       action: (
//         <>
//           <Link
//             to={`/admin/category/${categoryState[i]._id}`}
//             className=" fs-3 text-danger"
//           >
//             <FaRegEdit />
//           </Link>
//           {/* <button
//             className="ms-3 fs-3 text-danger bg-transparent border-0"
//             onClick={() => showModal(categoryState[i]._id)}
//           >
//             <AiFillDelete />
//           </button> */}
//         </>
//       ),
//     });
//   }
//   // const deleteCategory = (e) => {
//   //   dispatch(deleteAProductCategory(e));
//   //   setOpen(false);
//   //   setTimeout(() => {
//   //     dispatch(getProductCategories());
//   //     toast.success("Category deleted successfully!");
//   //   }, 100);
//   // };

//   return (
//     <div>
//       <h3 className="mb-4 title">Product Categories</h3>
//       <div>
//         <Table columns={columns} dataSource={data1} />
//       </div>
//       <CustomModal
//         hideModal={hideModal}
//         open={open}
//         performAction={() => {
//         //  deleteCategory(pCatId);
//         }}
//         title="Are you sure you want to delete this Product Category?"
//       />
//     </div>
//   );
// };

// export default Categorylist;




import React, { useEffect, useState } from "react";
import { Table } from "antd";
import { Link } from "react-router-dom";
import { FaRegEdit } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllCategories,
  resetState,
} from "../features/product/productSlice";
import CustomModal from "../components/CustomModal";

const columns = [
  {
    title: "SNo",
    dataIndex: "key",
  },
  {
    title: "Name",
    dataIndex: "name",
    sorter: (a, b) => a.name.length - b.name.length,
  },
  {
    title: "Action",
    dataIndex: "action",
  },
];

const Categorylist = () => {
  const [open, setOpen] = useState(false);
  const [pCatId, setpCatId] = useState("");
  
  const showModal = (e) => {
    setOpen(true);
    setpCatId(e);
  };

  const hideModal = () => {
    setOpen(false);
  };
  
  const dispatch = useDispatch();
  
  useEffect(() => {
    dispatch(resetState());
    dispatch(getAllCategories());
  }, [dispatch]);
  
  const categoryState = useSelector((state) => state?.product?.productCategories) || [];
  
  const data1 = categoryState.map((category, index) => ({
    key: index + 1,
    name: category.name,
    action: (
      <>
        <Link
          to={`/admin/category/${category._id}`}
          className="fs-3 text-danger"
        >
          <FaRegEdit />
        </Link>
      </>
    ),
  }));

  return (
    <div>
      <h3 className="mb-4 title">Product Categories</h3>
      <div>
        <Table columns={columns} dataSource={data1} />
      </div>
      <CustomModal
        hideModal={hideModal}
        open={open}
        performAction={() => {
          // deleteCategory(pCatId);
        }}
        title="Are you sure you want to delete this Product Category?"
      />
    </div>
  );
};

export default Categorylist;