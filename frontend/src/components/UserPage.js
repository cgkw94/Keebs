import React, { useEffect, useState } from "react";
import Cookies from "universal-cookie";

const UserPage = () => {
  const cookies = new Cookies();
  const storedJwt = cookies.get("token");

  const [jwt, setJwt] = useState(storedJwt || null);
  const [userDetails, setUserDetails] = useState({
    username: "",
    first_name: "",
    last_name: "",
    mobile_number: "",
    email: "",
  });

  const fetchUserDetails = async (url) => {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + jwt,
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    setUserDetails({
      username: data.username,
      first_name: data.first_name,
      last_name: data.last_name,
      mobile_number: data.mobile_number,
      email: data.email,
    });
  };

  console.log(userDetails);
  useEffect(() => {
    fetchUserDetails("http://localhost:5002/user/");
  }, []);

  return (
    <div>
      <h1> My Account</h1>
      <h4> Logout </h4>

      <h3>Account Details</h3>
    </div>
  );
};

export default UserPage;
