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
    specs: {
      pin: "",
      top: "",
      stem: "",
      bottom: "",
      spring: "",
    },
  });

  const fetchProducts = async (url) => {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    console.log(data);
    setProductDetails(data);
  };

  console.log(productDetails);
  useEffect(() => {
    fetchProducts(`http://localhost:5002/products/details/${params.product}`);
  }, []);

  return (
    <Container display="flex" maxW="container.lg">
      <HStack>
        <Box boxSize="2xl" m={[8, 3]}>
          <Image src={productDetails.image_thumb} />
        </Box>
        <ProductDetails
          name={productDetails.name}
          price={productDetails.price}
          description={productDetails.description}
          specs={productDetails.specs}
          quantity={productDetails.quantity}
        />
      </HStack>
    </Container>
  );
};

export default ProductDisplay;
