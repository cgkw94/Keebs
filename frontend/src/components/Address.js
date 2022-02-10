import React, { useEffect, useState } from "react";
import Cookies from "universal-cookie";
import {
  Container,
  Text,
  Button,
  Box,
  Heading,
  Flex,
  IconButton,
} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
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

  const handleBackButton = () => {
    window.location.href = "/user";
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

  const handleLogout = (e) => {
    cookies.remove("username");
    cookies.remove("token");
    cookies.remove("admin");
    cookies.remove("loggedIn");
    window.location.href = "/";
  };

  return (
    <>
      <NavBar />
      <Box align="center">
        <Heading align="center" paddingTop="50px">
          My Account
        </Heading>
        <Text
          as="u"
          align="center"
          onClick={handleLogout}
          _hover={{
            background: "white",
            color: "teal.500",
          }}
        >
          Logout
        </Text>
      </Box>
      <IconButton
        aria-label="Back"
        icon={<ArrowBackIcon />}
        onClick={handleBackButton}
      />
      <Box>
        <Button align="center" onClick={handleAddressButton}>
          ADD NEW ADDRESS
        </Button>
      </Box>
      <Box align="center">
        <Text>Your Addresses</Text>
        <Flex paddingTop="50px" align="center">
          {displayAddress}
        </Flex>
      </Box>
    </>
  );
};

export default Address;
