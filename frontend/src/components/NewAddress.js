import React, { useEffect, useState } from "react";
import Cookies from "universal-cookie";
import {
  Container,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  FormControl,
  FormErrorMessage,
  Input,
  Button,
  Stack,
  Radio,
  RadioGroup,
} from "@chakra-ui/react";

const NewAddress = () => {
  const cookies = new Cookies();
  const storedJwt = cookies.get("token");

  const [jwt, setJwt] = useState(storedJwt || null);
  const [error, setError] = useState("");
  const [newAddress, setNewAddress] = useState({
    customer_id: "",
    address_line1: "",
    address_line2: "",
    postal_code: "",
    country: "",
    address_type: "",
    name: "",
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

    setNewAddress((prevState) => {
      return { ...prevState, customer_id: data.customer_id };
    });
  };

  const addAddress = async (url) => {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + jwt,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newAddress),
    });
    const data = await res.json();

    setError(data);
    if (data === "Address added") {
      window.location.href = "/user/address";
    }
  };

  useEffect(() => {
    fetchUserDetails("http://localhost:5002/user/");
  }, []);

  const handleName = (e) => {
    setNewAddress((prevState) => {
      return { ...prevState, name: e.target.value };
    });
  };

  const handleAddress1 = (e) => {
    setNewAddress((prevState) => {
      return { ...prevState, address_line1: e.target.value };
    });
  };

  const handleAddress2 = (e) => {
    setNewAddress((prevState) => {
      return { ...prevState, address_line2: e.target.value };
    });
  };

  const handlePostalCode = (e) => {
    setNewAddress((prevState) => {
      return { ...prevState, postal_code: e.target.value };
    });
  };

  const handleCountry = (e) => {
    setNewAddress((prevState) => {
      return { ...prevState, country: e.target.value };
    });
  };

  const handleAddressType = (e) => {
    setNewAddress((prevState) => {
      return { ...prevState, address_type: e.target.value };
    });
  };

  const handleAddAddress = () => {
    addAddress("http://localhost:5002/user/address");
  };

  return (
    <>
      <Container w="75%" mt="10">
        <Tabs w="100%" isFitted variant="enclosed" colorScheme="blue">
          <TabList mb="1em">
            <Tab>Add Address</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Stack direction="column" spacing={2}>
                <Input pr="4.5rem" placeholder="Name" onChange={handleName} />
                <Input
                  pr="4.5rem"
                  placeholder="Address Line 1"
                  onChange={handleAddress1}
                />
                <Input
                  placeholder="Address Line 2"
                  size="md"
                  onChange={handleAddress2}
                />
                <Input
                  placeholder="Postal Code"
                  size="md"
                  onChange={handlePostalCode}
                />
                <Input
                  placeholder="Country"
                  size="md"
                  onChange={handleCountry}
                />
                <RadioGroup>
                  <Stack direction="row" onChange={handleAddressType}>
                    <Radio value="work">Work</Radio>
                    <Radio value="home">Home</Radio>
                  </Stack>
                </RadioGroup>
                <FormControl isInvalid={error}>
                  <FormErrorMessage>{error}</FormErrorMessage>
                </FormControl>
                <Button
                  colorScheme="blue"
                  variant="outline"
                  type="submit"
                  onClick={handleAddAddress}
                >
                  ADD
                </Button>
              </Stack>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Container>
    </>
  );
};

export default NewAddress;
