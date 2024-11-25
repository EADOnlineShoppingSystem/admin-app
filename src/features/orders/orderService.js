import axios from "axios";

const BASE_URL = 'http://localhost:3500/order/api/orders';

const getOrders = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/allOrders`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  };

const getOrder = async (userId) => {
    try {
      const response = await axios.get(`${BASE_URL}/getOdersByUserId/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  };

  const orderService = {
    getOrders,
    getOrder,
  };
  
  export default orderService;

