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
  const [productDetails, setProductDetails] = useState({
    name: "",
    price: "",
    description: "",
    image: "",
    quantity: "",
    list: {},
  });

  const fetchProducts = async (url) => {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    setProductDetails({
      name: data.name,
      price: data.price,
      description: data.description,
      image: data.image_thumb,
      quantity: data.quantity,
      list: {
        spring: data.spring,
        stem: data.stem,
        top: data.top,
        bottom: data.bottom,
        pin: data.pin,
      },
    });
  };

  useEffect(() => {
    fetchProducts(`http://localhost:5002/products/details/${params.product}`);
  }, []);

  console.log(productDetails);
  return (
    <Container display="flex" maxW="container.lg">
      <HStack>
        <Box boxSize="2xl" m={[8, 3]}>
          <Image src={productDetails.image} />
        </Box>
        <ProductDetails
          name={productDetails.name}
          price={productDetails.price}
          description={productDetails.description}
          list={productDetails.list}
          quantity={productDetails.quantity}
        />
      </HStack>
    </Container>
  );
};

export default ProductDisplay;
