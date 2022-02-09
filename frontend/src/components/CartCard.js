import React, { useState, useEffect } from "react";
import {
  Box,
  Text,
  WrapItem,
  Image,
  Button,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from "@chakra-ui/react";
import Cookies from "universal-cookie";

const CartCard = (props) => {
  const cookies = new Cookies();

  const storedJwt = cookies.get("token");

  const [jwt, setJwt] = useState(storedJwt || null);

  const [userInputCart, setUserInputCart] = useState({
    cart_id: props.cart_id,
    product_id: props.product_id,
    price: parseInt(props.price),
    quantity: props.quantity,
  });

  const handleChange = (e) => {
    setUserInputCart((prevState) => {
      return { ...prevState, quantity: parseInt(e) };
    });
  };

  const updateCart = async (url) => {
    const res = await fetch(url, {
      method: "PATCH",
      headers: {
        Authorization: "Bearer " + jwt,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userInputCart),
    });
    const data = await res.json();
  };

  const handleNewCart = () => {
    updateCart("http://localhost:5002/updatecart");
    props.liftState(userInputCart.quantity);
  };

  return (
    <WrapItem>
      <Box borderRadius="lg" overflow="hidden">
        <Text>{props.name}</Text>
        <Image
          borderRadius="lg"
          maxH="100"
          maxW="200"
          src={props.image}
          alt=""
        ></Image>
        <Box>
          <NumberInput
            size="lg"
            maxW={90}
            defaultValue={userInputCart.quantity}
            min={1}
            max={props.inven_quantity}
            value={userInputCart.quantity}
            align="center"
            onChange={handleChange}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper onClick={handleNewCart} />
              <NumberDecrementStepper onClick={handleNewCart} />
            </NumberInputStepper>
          </NumberInput>
        </Box>
        <Text>${props.total}</Text>
      </Box>
    </WrapItem>
  );
};

export default CartCard;
