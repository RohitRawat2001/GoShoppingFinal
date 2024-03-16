import './App.css';
import { useState, useEffect } from 'react';
import React from "react";
import Header from './components/layout/Header/Header';
import Footer from './components/layout/footer/Footer';
import Home from './components/Home/Home';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import webFont from "webfontloader";
import ProductDetails from "./components/Product/ProductDetails.js";
import Products from "./components/Product/Products.js";
import Search from "./components/Product/Search.js";
import LoginSignUp from './components/User/LoginSignUp.js';
import store from "./store";
import { loadUser } from "./actions/userAction";
import UserOptions from "./components/layout/Header/UserOptions.js";
import { useSelector } from 'react-redux';
import Profile from "./components/User/Profile.js";
import ProtectedRoute from "./components/Route/ProtectedRoute.js";
import UpdateProfile from "./components/User/UpdateProfile.js";
import UpdatePassword from "./components/User/UpdatePassword.js";
import ForgotPassword from "./components/User/ForgotPassword.js";
import ResetPassword from "./components/User/ResetPassword.js";
import Cart from "./components/Cart/Cart.js";
import Shipping from "./components/Cart/Shipping.js";
import ConfirmOrder from "./components/Cart/ConfirmOrder.js";
import axios from "axios";
import Payment from "./components/Cart/Payment.js";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import OrderSuccess from "./components/Cart/OrderSuccess.js";
import MyOrders from "./components/Order/MyOrders.js";
import OrderDetails from "./components/Order/OrderDetails.js";
import Dashboard from "./components/Admin/Dashboard.js";
import ProductList from "./components/Admin/ProductList.js";
import NewProduct from './components/Admin/NewProduct.js';
import UpdateProduct from './components/Admin/UpdateProduct.js';
import OrderList from './components/Admin/OrderList.js';
import ProcessOrder from './components/Admin/ProcessOrder.js';
import UsersList from './components/Admin/UsersList.js';
import UpdateUser from './components/Admin/UpdateUser.js';
import ProductReviews from './components/Admin/ProductReviews.js';
import Contact from './components/layout/Contact/Contact.js';
import About from './components/layout/About/About.js';
//import NotFound from './components/layout/NotFound/NotFound.js';

function App() {

  const { isAuthenticated, user } = useSelector(state => state.user);

  const [stripeApiKey, setStripeApiKey] = useState("");

  async function getStripeApiKey() {
    const { data } = await axios.get("/api/v1/stripeapikey");

    setStripeApiKey(data.stripeApiKey);
  }

  useEffect(() => {
    webFont.load({
      google: {
        families: ["Roboto", "Droid sans serif", "Chilanka"],
      },
    });
    store.dispatch(loadUser());

    getStripeApiKey();
  }, []);

  window.addEventListener("contextmenu", (e) => e.preventDefault());
  return (
    <Router>
      <Header />
      {isAuthenticated && <UserOptions user={user} />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:keyword" element={<Products />} />
        <Route path="/login" element={<LoginSignUp />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />


        <Route path="/account" element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <Profile />
          </ProtectedRoute>} />

        <Route path="/me/update" element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <UpdateProfile />
          </ProtectedRoute>} />

        <Route path="/password/update" element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <UpdatePassword />
          </ProtectedRoute>} />

        <Route path="/password/forgot" element={<ForgotPassword />} />

        <Route path="/password/reset/:token" element={<ResetPassword />} />

        <Route path="/Cart" element={<Cart />} />

        <Route path="/login/shipping" element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <Shipping />
          </ProtectedRoute>} />
        <Route path="/order/confirm" element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <ConfirmOrder />
          </ProtectedRoute>} />

        {stripeApiKey && (
          <Route path="/process/payment" element={<ProtectedRoute isAuthenticated={isAuthenticated}><Elements stripe={loadStripe(stripeApiKey)}><Payment /></Elements></ProtectedRoute>} />
        )}
        <Route path="/success" element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <OrderSuccess />
          </ProtectedRoute>} />
        <Route path="/orders" element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <MyOrders />
          </ProtectedRoute>} />
        <Route path="/order/:id" element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <OrderDetails />
          </ProtectedRoute>} />
        <Route path="/admin/dashboard" element={
          <ProtectedRoute isAdmin={true} isAuthenticated={isAuthenticated}>
            <Dashboard />
          </ProtectedRoute>} />
        <Route path="/admin/products" element={
          <ProtectedRoute isAdmin={true} isAuthenticated={isAuthenticated}>
            <ProductList />
          </ProtectedRoute>} />
        <Route path="/admin/product" element={
          <ProtectedRoute isAdmin={true} isAuthenticated={isAuthenticated}>
            <NewProduct />
          </ProtectedRoute>} />
        <Route path="/admin/product/:id" element={
          <ProtectedRoute isAdmin={true} isAuthenticated={isAuthenticated}>
            <UpdateProduct />
          </ProtectedRoute>} />
        <Route path="/admin/orders" element={
          <ProtectedRoute isAdmin={true} isAuthenticated={isAuthenticated}>
            <OrderList />
          </ProtectedRoute>} />
        <Route path="/admin/order/:id" element={
          <ProtectedRoute isAdmin={true} isAuthenticated={isAuthenticated}>
            <ProcessOrder />
          </ProtectedRoute>} />
        <Route path="/admin/users" element={
          <ProtectedRoute isAdmin={true} isAuthenticated={isAuthenticated}>
            <UsersList />
          </ProtectedRoute>} />
        <Route path="/admin/user/:id" element={
          <ProtectedRoute isAdmin={true} isAuthenticated={isAuthenticated}>
            <UpdateUser />
          </ProtectedRoute>} />
        <Route path="/admin/reviews" element={
          <ProtectedRoute isAdmin={true} >
            <ProductReviews />
          </ProtectedRoute>} />



        <Route path="/search" element={<Search />} />

        {/* <Route path="*" element={<NotFound />} /> */}

      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
