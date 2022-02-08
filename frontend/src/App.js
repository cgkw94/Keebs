import React, { useState } from "react";
import { Route } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import Cookies from "universal-cookie";

import Login from "./components/Login";
import UserDetails from "./components/UserDetails";
import UserPage from "./components/UserPage";
import Address from "./components/Address";
import NewAddress from "./components/NewAddress";
import CategoryDisplay from "./components/CategoryDisplay";
import ProductDisplay from "./components/ProductDisplay";
import CartDisplay from "./components/CartDisplay";

function App() {
  const cookies = new Cookies();

  const [username, setUsername] = useState(cookies.get("username"));
  const [token, setToken] = useState(cookies.get("token"));
  const [admin, setAdmin] = useState(cookies.get("admin"));

  return (
    <>
      <Route exact path="/">
        <LandingPage />
      </Route>
      <Route exact path="/login">
        <Login />
      </Route>
      <Route exact path="/user">
        <UserPage />
      </Route>
      <Route exact path="/user/edit">
        <UserDetails />
      </Route>
      <Route exact path="/user/address">
        <Address />
      </Route>
      <Route exact path="/user/address/add">
        <NewAddress />
      </Route>
      <Route exact path="/products/:category">
        <CategoryDisplay />
      </Route>
      <Route exact path="/products/details/:product">
        <ProductDisplay />
      </Route>
      <Route exact path="/cart">
        <CartDisplay />
      </Route>
    </>
  );
}

export default App;
