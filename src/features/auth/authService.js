import axios from "axios";
// import { base_url } from "../../utils/base_url";
// import { config } from "../../utils/axiosconfig";

const BASE_URL = 'http://localhost:5000/api/users';
//const BASE_URL = 'http://localhost:3500/User/api/users';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle token expiration
      localStorage.removeItem('userToken');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

const login = async (userData) => {
  try {
  const response = await axios.post(`${BASE_URL}/login`, userData);
  if (response.data.token) {
    localStorage.setItem("userToken", response.data.token);
    localStorage.setItem("user", JSON.stringify(response.data)); // Store user data
  }
  return response.data;
} catch (error) {
  throw error.response?.data || { message: 'An error occurred during login' };
}
};


const getOrders = async () => {
  const response = await axios.get(`${BASE_URL}user/getallorders` //, config

  );
  return response.data;
};
const getOrder = async (id) => {
  const response = await axios.post(
    `${BASE_URL}user/getorderbyuser/${id}`,
    ""
   // ,config
  );
  return response.data;
};

// const getOrder = async () => {
//   const response = await axios.post(
//     `${base_url}user/getmyorders`,
//     "",
//     config
//   );
//   return response.data;
// };

  // Logout user
  const logout = () => {
    localStorage.removeItem('userToken');
  };

  // Get current auth token
  const getCurrentToken = () => {
    return localStorage.getItem('userToken');
    localStorage.removeItem('user');
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    const token = localStorage.getItem('userToken');
    return !!token;
  };



const authService = {
  login,
  getOrders,
  getOrder,
  logout,
  getCurrentToken,
  isAuthenticated,
};

export default authService;
