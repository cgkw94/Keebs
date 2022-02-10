import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Flex,
  Spacer,
  Container,
  Image,
  Text,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Stack,
  Input,
  FormControl,
  Select,
  RadioGroup,
  Radio,
  Button,
} from "@chakra-ui/react";
import Cookies from "universal-cookie";
import NavBar from "./NavBar";

const CheckoutPage = () => {
  const isInitialMount = useRef(true);
  const cookies = new Cookies();

  const storedJwt = cookies.get("token");

  const [jwt, setJwt] = useState(storedJwt || null);
  const [cart, setCart] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [addressArr, setAddressArr] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState({
    name: "",
    address_line1: "",
    address_line2: "",
    postal_code: "",
    country: "",
    address_type: "",
  });

  const fetchCart = async (url) => {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + jwt,
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    setCart(data);
  };

  const fetchTotal = async (url) => {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + jwt,
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();

    setCartTotal(data.total);
  };

  const fetchAddresses = async (url) => {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + jwt,
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    setAddressArr(data);
  };

  const checkOut = async (url) => {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + jwt,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(selectedAddress),
    });
    const data = await res.json();
  };

  useEffect(() => {
    fetchCart(`http://localhost:5002/cart`);
    fetchTotal(`http://localhost:5002/carttotal`);
    fetchAddresses("http://localhost:5002/user/address");
  }, []);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      const selectedAddress = addressArr.find(
        (data) => data.address_id === parseInt(selectedAddressId)
      );
      setSelectedAddress(selectedAddress);
    }
    return () => {
      setSelectedAddress({
        name: "",
        address_line1: "",
        address_line2: "",
        postal_code: "",
        country: "",
      });
    };
  }, [selectedAddressId]);

  const displayCheckoutItems = cart.map((data) => {
    const total = data.price * data.quantity;
    return (
      <Box>
        <Image
          borderRadius="lg"
          maxH="100"
          maxW="200"
          src={data.image_thumb}
          alt=""
        />
        <Text>
          {data.name} x{data.quantity}
        </Text>
        <Text>${total}</Text>
      </Box>
    );
  });

  const existingAddress = addressArr.map((data) => {
    return (
      <option value={data.address_id}>
        {data.address_line1},{data.address_line2},Singapore{data.postal_code},
        {data.country}({data.name})({data.address_type})
      </option>
    );
  });

  const handleSelectedAdd = (e) => {
    setSelectedAddressId(e.target.value);
  };

  const handleCheckout = () => {
    checkOut("http://localhost:5002/checkout");
  };

  const handleNameChange = (e) => {
    setSelectedAddress((prevState) => {
      return { ...prevState, name: e.target.value };
    });
  };

  const handleAdd1 = (e) => {
    setSelectedAddress((prevState) => {
      return { ...prevState, address_line1: e.target.value };
    });
  };

  const handleAdd2 = (e) => {
    setSelectedAddress((prevState) => {
      return { ...prevState, address_line2: e.target.value };
    });
  };

  const handlePostalCode = (e) => {
    setSelectedAddress((prevState) => {
      return { ...prevState, postal_code: e.target.value };
    });
  };

  const handleCountry = (e) => {
    setSelectedAddress((prevState) => {
      return { ...prevState, country: e.target.value };
    });
  };
  const handleAddressType = (e) => {
    setSelectedAddress((prevState) => {
      return { ...prevState, address_type: e.target.value };
    });
  };
  console.log(selectedAddress);
  return (
    <Box>
      <Box align="center">{displayCheckoutItems}</Box>
      <Box align="center" paddingTop="30px">
        <Text fontSize="48" fontWeight="bold">
          Subtotal: ${cartTotal}
        </Text>
      </Box>
      <Box>
        <Container w="75%" mt="10">
          <Tabs w="100%" isFitted variant="enclosed" colorScheme="blue">
            <TabList mb="1em">
              <Tab>Shipping</Tab>
            </TabList>
            <Select
              placeholder="Use Existing Address"
              onChange={handleSelectedAdd}
            >
              {existingAddress}
            </Select>
            <TabPanels>
              <TabPanel>
                <Stack direction="column" spacing={2}>
                  <Input
                    pr="4.5rem"
                    placeholder="Name"
                    value={selectedAddress.name}
                    onChange={handleNameChange}
                  />
                  <Input
                    pr="4.5rem"
                    placeholder="Address Line 1"
                    value={selectedAddress.address_line1}
                    onChange={handleAdd1}
                  />
                  <Input
                    placeholder="Address Line 2"
                    size="md"
                    value={selectedAddress.address_line2}
                    onChange={handleAdd2}
                  />
                  <Input
                    placeholder="Postal Code"
                    size="md"
                    value={selectedAddress.postal_code}
                    onChange={handlePostalCode}
                  />
                  <Input
                    placeholder="Country"
                    size="md"
                    value={selectedAddress.country}
                    onChange={handleCountry}
                  />
                  <RadioGroup>
                    <Stack direction="row" onChange={handleAddressType}>
                      <Radio value="work">Work</Radio>
                      <Radio value="home">Home</Radio>
                    </Stack>
                  </RadioGroup>
                  <Button
                    colorScheme="blue"
                    variant="outline"
                    type="submit"
                    onClick={handleCheckout}
                  >
                    CHECKOUT
                  </Button>
                </Stack>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Container>
      </Box>
    </Box>
  );
};

export default CheckoutPage;
