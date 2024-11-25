import axios from "axios";
//import { base_url } from "../../utils/base_url";

//const BASE_URL = 'http://localhost:5000/api/users';
const BASE_URL = 'http://localhost:3500/User/api/users';

const getUsers = async() => {
    const response = await axios.get(`${BASE_URL}/getAllUsers`);
    return response.data;
};

const customerService = {
    getUsers,
};

export default customerService;