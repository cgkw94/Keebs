import React, { useEffect, useState } from "react";
import Cookies from "universal-cookie";
import { Container, Text, Button, Box } from "@chakra-ui/react";

const AddressCard = (props) => {
  const cookies = new Cookies();
  const storedJwt = cookies.get("token");

  const [jwt, setJwt] = useState(storedJwt || null);

  const deleteAddress = async (url) => {
    const res = await fetch(url, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + jwt,
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    console.log(data);
  };

  const handleDelete = () => {
    deleteAddress(
      `http://localhost:5002/user/address/delete/${props.addressId}`
    );
    window.location.href = "/user/address";
  };

  return (
    <Container>
      <Box>
        <Text>{props.name}</Text>
        <Text>{props.address1}</Text>
        <Text>{props.address2}</Text>
        <Text>{props.postal_code}</Text>
        <Text>{props.country}</Text>
        <Text>{props.address_type}</Text>
        <Button>Edit</Button>
        <Button onClick={handleDelete}>Delete</Button>
      </Box>
    </Container>
  );
};

export default AddressCard;
