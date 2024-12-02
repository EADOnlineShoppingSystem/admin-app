import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/dashboard';
import Login from "./pages/loginPage";
import Resetpassword from './pages/resetPassword';
import Forgotpassword from './pages/forgotPassword';
import MainLayout from './components/mainLayout';
import Enquiries from './pages/enquiries';
import Orders from './pages/orderList';
import Customers from './pages/customerList';
// import Colorlist from './pages/Colorlist';
import Categorylist from './pages/categoryList';
import Productlist from './pages/productList';
import Addcat from './pages/addCategory';
import Addproduct from './pages/addProduct';
import ViewEnq from './pages/viewEnquiry';
import ViewOrder from './pages/viewOrder';
//import AdminSignup from './pages/AdminSignup';
import ProtectedRoute from './routing/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/reset-password" element={<Resetpassword />} />
        <Route path="/forgot-password" element={<Forgotpassword />} />
        {/* <Route path="/admin" element={<MainLayout />}> */}

        <Route path="/admin" element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }>

          <Route index element={<Dashboard />} />
          <Route path='enquiries' element={<Enquiries />} />
          <Route path="enquiries/:id" element={<ViewEnq />} />
          <Route path='orders' element={<Orders />} />
          <Route path='order/:id' element={<ViewOrder />} />
          <Route path='customers' element={<Customers />} />
          <Route path='list-category' element={<Categorylist />} />
          <Route path='category' element={<Addcat />} />
          <Route path="category/:id" element={<Addcat />} />
          <Route path='list-product' element={<Productlist />} />
          <Route path='product' element={<Addproduct />} />
          <Route path="product/:productId" element={<Addproduct />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
