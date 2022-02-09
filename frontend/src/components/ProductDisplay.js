import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  HStack,
  Image,
  Text,
  Heading,
  Button,
} from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import Cookies from "universal-cookie";
import ProductDetails from "./ProductDetails.js";

const ProductDisplay = () => {
  const params = useParams();
  const cookies = new Cookies();

  const storedJwt = cookies.get("token");

  const [jwt, setJwt] = useState(storedJwt || null);
  const [userInputCart, setUserInputCart] = useState({
    product_id: "",
    price: "",
    quantity: 1,
  });
  const [error, setError] = useState("");
  const [productDetails, setProductDetails] = useState({
    specs: {
      pin: "",
      top: "",
      stem: "",
      bottom: "",
      spring: "",
    },
  });

  const handleQtyChange = (input) => {
    setUserInputCart((prevState) => {
      return { ...prevState, quantity: input };
    });
  };

  const fetchProducts = async (url) => {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    setProductDetails(data);
    setUserInputCart((prevState) => {
      return { ...prevState, product_id: data.product_id };
    });
    setUserInputCart((prevState) => {
      return { ...prevState, price: parseInt(data.price) };
    });
  };

  useEffect(() => {
    fetchProducts(`http://localhost:5002/products/details/${params.product}`);
  }, []);

  const addToCart = async (url) => {
    const res = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + jwt,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userInputCart),
    });
    const data = await res.json();
    console.log(data);
  };

  const handleAddCart = () => {
    addToCart("http://localhost:5002/addtocart");
    window.location.href = "/cart";
  };

  return (
    <Container display="flex" maxW="container.lg">
      <HStack>
        <ProductDetails
          image={productDetails.image_thumb}
          name={productDetails.name}
          price={productDetails.price}
          description={productDetails.description}
          specs={productDetails.specs}
          quantity={productDetails.quantity}
          liftState={handleQtyChange}
          onClick={handleAddCart}
        />
      </HStack>
    </Container>
  );
};

export default ProductDisplay;
