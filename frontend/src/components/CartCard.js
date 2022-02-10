import React, { useState } from "react";
import {
  Box,
  Text,
  WrapItem,
  Image,
  IconButton,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from "@chakra-ui/react";
import Cookies from "universal-cookie";
import { DeleteIcon } from "@chakra-ui/icons";

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

  const deleteCart = async (url) => {
    const res = await fetch(url, {
      method: "DELETE",
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

  const handleDeleteCart = () => {
    deleteCart("http://localhost:5002/deletecart");
    window.location.reload(false);
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
        <IconButton
          aria-label="Delete Cart"
          icon={<DeleteIcon />}
          onClick={handleDeleteCart}
        />
      </Box>
    </WrapItem>
  );
};

export default CartCard;
