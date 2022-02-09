import React, { useEffect, useState } from "react";
import { Box } from "@chakra-ui/react";
import Cookies from "universal-cookie";
import CartCard from "./CartCard";

const CartDisplay = () => {
  const cookies = new Cookies();

  const storedJwt = cookies.get("token");
  const [jwt, setJwt] = useState(storedJwt || null);
  const [cart, setCart] = useState([]);
  const [cartQty, setCartQty] = useState(0);
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

  useEffect(() => {
    fetchCart(`http://localhost:5002/cart`);
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
    </Box>
  );
};

export default CartDisplay;
