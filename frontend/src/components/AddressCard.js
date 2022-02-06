import React from "react";
import { Container, Text, Button, Box } from "@chakra-ui/react";

const AddressCard = (props) => {
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
        <Button>Delete</Button>
      </Box>
    </Container>
  );
};

export default AddressCard;
