// import React, { useEffect } from "react";
// import { Table } from "antd";
// import { Link } from "react-router-dom";
// import { FaRegEdit } from "react-icons/fa";
// import { AiFillDelete } from "react-icons/ai";
// import { useDispatch, useSelector } from "react-redux";
// import { getProducts } from "../features/product/productSlice";

// const columns = [
//   {
//     title: "SNo",
//     dataIndex: "key",
//   },
//   {
//     title: "Title",
//     dataIndex: "title",
//     sorter: (a, b) => a.title.length - b.title.length,
//   },
//   {
//     title: "Category",
//     dataIndex: "category",
//     sorter: (a, b) => (a.category?.length || 0) - (b.category?.length || 0),
//     //sorter: (a, b) => a.category.length - b.category.length,
//   },
//   // {
//   //   title: "Color",
//   //   dataIndex: "color",
//   // },

//   {
//     title: "Color",
//     dataIndex: "color",
//     render: (colors) => {
//       // Handle cases where colors might be an array of objects or strings
//       if (Array.isArray(colors)) {
//         return colors.map(color => {
//           // If color is an object with label property
//           if (typeof color === 'object' && color.label) {
//             return color.label;
//           }
//           // If color is a simple string
//           return color;
//         }).join(', ');
//       }
//       return colors || '-';
//     }
//   },



//   {
//     title: "Price",
//     dataIndex: "price",
//     sorter: (a, b) => a.price - b.price,
//   },
//   {
//     title: "Action",
//     dataIndex: "action",
//   },
// ];

// const Productlist = () => {
//   const dispatch = useDispatch();
//   useEffect(() => {
//     dispatch(getProducts());
//   }, []);
//   const productState = useSelector((state) => state.product.products);
//   const data1 = [];
//   for (let i = 0; i < productState.length; i++) {
//     data1.push({
//       key: i + 1,
//       title: productState[i].title,
//       category: productState[i].category,
//       color: productState[i].color,

//     //  color: Array.isArray(productState[i].color)
//     //  ? productState[i].color.map(c => c.label).join(", ") // If color is an array, join labels with a comma
//     //  : productState[i].color?.label || "N/A",

//       price: `${productState[i].price}`,
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
//       <h3 className="mb-4 title">Products</h3>
//       <div>
//         <Table columns={columns} dataSource={data1} />
//       </div>
//     </div>
//   );
// };

// export default Productlist;



import React, { useEffect } from "react";
import { Table } from "antd";
import { Link } from "react-router-dom";
import { FaRegEdit } from "react-icons/fa";
import { AiFillDelete } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { getProducts } from "../features/product/productSlice";
import { getColors } from "../features/color/colorSlice";

const columns = [
  {
    title: "SNo",
    dataIndex: "key",
  },
  {
    title: "Title",
    dataIndex: "title",
    sorter: (a, b) => a.title.length - b.title.length,
  },
  {
    title: "Category",
    dataIndex: "category",
    sorter: (a, b) => (a.category?.length || 0) - (b.category?.length || 0),
  },
  {
    title: "Color",
    dataIndex: "color",
    render: (colorIds, { colorNames }) => {
      return colorNames || "-"; // Display the color names if available
    },
  },
  {
    title: "Price",
    dataIndex: "price",
    sorter: (a, b) => a.price - b.price,
  },
  {
    title: "Action",
    dataIndex: "action",
  },
];

const Productlist = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getProducts());
    dispatch(getColors());
  }, [dispatch]);

  const productState = useSelector((state) => state.product.products);
  const colorState = useSelector((state) => state.color.colors);

  // Create a map for color ID to color name
  const colorMap = {};
  colorState.forEach(color => {
    colorMap[color._id] = color.title; // Assuming 'title' is the name of the color
  });

  const data1 = [];
  for (let i = 0; i < productState.length; i++) {
    // Get the color names based on the color IDs
    const colorNames = productState[i].color
      .map(colorId => colorMap[colorId] || colorId) // Fallback to ID if name not found
      .join(", ");

    data1.push({
      key: i + 1,
      title: productState[i].title,
      category: productState[i].category,
      color: productState[i].color, // Keep original color IDs for rendering
      colorNames, // Add color names for rendering in the column
      price: `${productState[i].price}`,
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
      <h3 className="mb-4 title">Products</h3>
      <div>
        <Table columns={columns} dataSource={data1} />
      </div>
    </div>
  );
};

export default Productlist;
