import React, { useState } from "react";
import Cookies from "universal-cookie";

const LandingPage = () => {
  const cookies = new Cookies();

  const [username, setUsername] = useState(cookies.get("username"));
  const [token, setToken] = useState(cookies.get("token"));
  const [admin, setAdmin] = useState(cookies.get("admin"));

  console.log(cookies.get("username"));

  return (
    <div>
      <p>blahs</p>
    </div>
  );
};

export default LandingPage;
