import React, { useState } from "react";
import Cookies from "universal-cookie";

const LandingPage = () => {
  const cookies = new Cookies();

  const storedJwt = cookies.get("token");
  const storedUsername = cookies.get("username");
  const storedAdmin = cookies.get("admin");
  const storedLogged = cookies.get("loggedIn");

  const [jwt, setJwt] = useState(storedJwt || null);
  const [username, setUsername] = useState(storedUsername || null);
  const [admin, setAdmin] = useState(storedAdmin || null);
  const [isLogged, setIsLogged] = storedLogged || null;

  return (
    <div>
      <p>{jwt}</p>
    </div>
  );
};

export default LandingPage;
