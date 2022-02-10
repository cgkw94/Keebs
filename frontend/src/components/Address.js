import React, { useEffect, useState } from "react";
import Cookies from "universal-cookie";
import { Container, Text, Button, Box } from "@chakra-ui/react";
import AddressCard from "./AddressCard";
import NavBar from "./NavBar";

const Address = () => {
  const cookies = new Cookies();
  const storedJwt = cookies.get("token");

  const [jwt, setJwt] = useState(storedJwt || null);
  const [addressData, setAddressData] = useState([]);

  const fetchAddresses = async (url) => {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + jwt,
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    setAddressData(data);
  };

  useEffect(() => {
    fetchAddresses("http://localhost:5002/user/address");
  }, []);

  const handleAddressButton = () => {
    window.location.href = "/user/address/add";
  };

  const displayAddress = addressData.map((data) => {
    return (
      <AddressCard
        addressId={data.address_id}
        name={data.name}
        address1={data.address_line1}
        address2={data.address_line2}
        postal_code={data.postal_code}
        country={data.country}
        address_type={data.address_type}
      />
    );
  });

  return (
    <>
      <NavBar />
      <Box>
        <Text align="center">My Account</Text>
        <Text align="center">Logout</Text>
        <Text align="center">Account Details</Text>
        <Box>
          <Button align="center" onClick={handleAddressButton}>
            ADD NEW ADDRESS
          </Button>
        </Box>
        <Text>Your Addresses</Text>
        {displayAddress}
      </Box>
    </>
  );
};

export default Address;
