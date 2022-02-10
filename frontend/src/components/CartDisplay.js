import React, { useEffect, useState } from "react";
import { Box, Text, Button } from "@chakra-ui/react";
import Cookies from "universal-cookie";
import CartCard from "./CartCard";

const CartDisplay = () => {
  const cookies = new Cookies();

  const storedJwt = cookies.get("token");
  const [jwt, setJwt] = useState(storedJwt || null);
  const [cart, setCart] = useState([]);
  const [cartQty, setCartQty] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);
  const [qtyChangeInput, setQtyChangeInput] = useState("");

  const handleQtyChange = (input) => {
    setQtyChangeInput(input);
  };

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
    setCartQty(cartQty);
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

  useEffect(() => {
    fetchCart(`http://localhost:5002/cart`);
    fetchTotal(`http://localhost:5002/carttotal`);
  }, [qtyChangeInput]);

  const displayCart = cart.map((data) => {
    const total = parseInt(data.price) * data.quantity;
    return (
      <CartCard
        image={data.image_thumb}
        name={data.name}
        total={total}
        quantity={data.quantity}
        inven_quantity={data.inven_quantity}
        price={data.price}
        product_id={data.product_id}
        cart_id={data.cart_id}
        liftState={handleQtyChange}
      />
    );
  });

  return (
    <Box>
      <Box>{displayCart}</Box>
      <Text>Subtotal : ${cartTotal}</Text>
      <Button>CHECK OUT</Button>
    </Box>
  );
};

export default CartDisplay;
