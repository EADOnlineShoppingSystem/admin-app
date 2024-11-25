import axios from "axios";
// import { base_url } from "../../utils/base_url";
// import { config } from "../../utils/axiosconfig";

//const BASE_URL = 'http://localhost:6000/api/products';
const BASE_URL = 'http://localhost:3500/Product/api/products';


const createCategory = async(category) => {
  const response = await axios.post(`${BASE_URL}/add-category`, category);
  return response.data;
};

const getCategories = async () => {
  const response = await axios.get(`${BASE_URL}/categories`);
  return response.data;
};

const createProduct = async(product) => {
  const response = await axios.post(`${BASE_URL}/add-product`, product);
  return response.data;
};

//no routes yet
const getProducts = async() => {
    const response = await axios.get(`${BASE_URL}/product/`);
    return response.data;
};

const getProductsByCategory = async (categoryName) => {
  const response = await axios.get(`${BASE_URL}/getProducts/${categoryName}`);
  return response.data;
};

//no routes yet
const updateProduct = async (product) => {
    const response = await axios.put(
      `${BASE_URL}product/${product.id}`,
      {
        title: product.productData.title,
        description: product.productData.description,
        price1: product.productData.price1,
        price2: product.productData.price2,
        category: product.productData.category,
        tags: product.productData.tags,
        storage: product.productData.storage,
        color: product.productData.color,
        warranty: product.productData.warranty,
        quantity: product.productData.quantity,
        images: product.productData.images,
        
      },
    );
    return response.data;
};

const getProduct = async (id) => {
    const response = await axios.get(`${BASE_URL}/product/${id}`);
  
    return response.data;
  };
  
  const deleteProduct = async (id) => {
    const response = await axios.delete(`${BASE_URL}/product/${id}`);
  
    return response.data;
  };

const productService = {
  createCategory,
    getProducts,
    createProduct,
    updateProduct,
    getProduct,
    deleteProduct,
    getCategories,
    getProductsByCategory

};

export default productService;



// import axios from "axios";
// import { base_url } from "../../utils/base_url";
// import { config } from "../../utils/axiosconfig";

// const getProducts = async() => {
//     const response = await axios.get(`${base_url}product/`);
//     return response.data;
// };

// const createProduct = async(product) => {
//     const response = await axios.post(`${base_url}product/`, product, config);
//     return response.data;
// };

// const updateProduct = async (product) => {
//     const response = await axios.put(
//       `${base_url}product/${product.id}`,
//       {
//         title: product.productData.title,
//         description: product.productData.description,
//         price1: product.productData.price1,
//         price2: product.productData.price2,
//         category: product.productData.category,
//         tags: product.productData.tags,
//         storage: product.productData.storage,
//         color: product.productData.color,
//         warranty: product.productData.warranty,
//         quantity: product.productData.quantity,
//         images: product.productData.images,
        
//       },
//       config
//     );
//     return response.data;
// };

// const getProduct = async (id) => {
//     const response = await axios.get(`${base_url}product/${id}`, config);
  
//     return response.data;
//   };
  
//   const deleteProduct = async (id) => {
//     const response = await axios.delete(`${base_url}product/${id}`, config);
  
//     return response.data;
//   };

// const productService = {
//     getProducts,
//     createProduct,
//     updateProduct,
//     getProduct,
//     deleteProduct,

// };

// export default productService;