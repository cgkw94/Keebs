import React, { useEffect, useState } from "react";
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
} from "@chakra-ui/react";
import Cookies from "universal-cookie";
import NavBar from "./NavBar";

const CheckoutPage = () => {
  const cookies = new Cookies();

  const storedJwt = cookies.get("token");

  const [jwt, setJwt] = useState(storedJwt || null);
  const [cart, setCart] = useState([]);

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

  useEffect(() => {
    fetchCart(`http://localhost:5002/cart`);
  }, []);

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

  return (
    <Box>
      <Box align="center">{displayCheckoutItems}</Box>
      <Box align="center" paddingTop="30px">
        <Text fontSize="48" fontWeight="bold">
          Subtotal: ${cart[0].total}
        </Text>
      </Box>
      <Box>
        <Container w="75%" mt="10">
          <Tabs w="100%" isFitted variant="enclosed" colorScheme="blue">
            <TabList mb="1em">
              <Tab>Address</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <Stack direction="column" spacing={2}>
                  <Input pr="4.5rem" placeholder="Name" />
                  <Input pr="4.5rem" placeholder="Address Line 1" />
                  <Input placeholder="Address Line 2" size="md" />
                  <Input placeholder="Postal Code" size="md" />
                  <Input placeholder="Country" size="md" />>
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
