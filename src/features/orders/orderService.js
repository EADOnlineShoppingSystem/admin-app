import axios from "axios";

const BASE_URL = 'http://localhost:5001/api/orders';
//const BASE_URL = 'http://localhost:3500/order/api/orders';

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

  const getMonthlyAmountsAndCounts = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/getAmountLastMonth`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  };
  
  const getLast10DaysOrderCounts = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/getOdersCountLast10Days`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  };
  
 
  const orderService = {
    getOrders,
    getOrder,
    getMonthlyAmountsAndCounts,
    getLast10DaysOrderCounts,
  };
  
  export default orderService;

