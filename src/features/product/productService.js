import axios from "axios";
const BASE_URL = "http://localhost:6002/api/products";
//const BASE_URL = 'http://localhost:3500/Product/api/products';

// Create a new category
const createCategory = async (formData) => {
  try {
    const response = await axios.post(`${BASE_URL}/add-category`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Server error" };
  }
};

// Get all categories
const getCategories = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/categories`);
    return response.data.categories;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Server error");
  }
};

const updateCategory = async (categoryId, formData) => {
  try {
    const response = await axios.put(
      `${BASE_URL}/update-category/${categoryId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data.category;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Server error");
  }
};

// Create a new product
const createProduct = async (product) => {
  try {
    console.log("product aaa",product)
    const response = await axios.post(`${BASE_URL}/add-product`, product, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Server error");
  }
};

// Get all products
const getProducts = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/all-products`);
    return response.data.products;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Server error");
  }
};

// Update product
const updateProduct = async (productId, productData) => {
  try {
    const response = await axios.put(
      `${BASE_URL}/update-product/${productId}`,
      productData
    );
    return response.data.product;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Server error");
  }
};

// Get single product by ID
const getAProduct = async (productId) => {
  try {
    const response = await axios.get(`${BASE_URL}/product/${productId}`);
    return response.data.product;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Server error");
  }
};

const deleteProduct = async (id) => {
  try {
    const response = await axios.delete(`${BASE_URL}/product/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || new Error("Server error");
  }
};

const productService = {
  createCategory,
  updateCategory,
  getProducts,
  createProduct,
  updateProduct,
  getAProduct,
  deleteProduct,
  getCategories,

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
