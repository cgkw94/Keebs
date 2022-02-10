import React, { useEffect, useState } from "react";
import { Box, Flex, Spacer, Container } from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import Cookies from "universal-cookie";
import ProductCard from "./ProductCard";
import NavBar from "./NavBar";

const CategoryDisplay = () => {
  const params = useParams();
  const cookies = new Cookies();

  const storedJwt = cookies.get("token");
  const [jwt, setJwt] = useState(storedJwt || null);
  const [productArr, setProductArr] = useState([]);

  const fetchProducts = async (url) => {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    setProductArr(data);
  };

  useEffect(() => {
    fetchProducts(`http://localhost:5002/products/${params.category}`);
  }, []);

  const displayProducts = productArr.map((data) => {
    return (
      <>
        <ProductCard
          name={data.name}
          price={data.price}
          product_id={data.product_id}
          image={data.image_thumb}
        />
      </>
    );
  });

  return (
    <>
      <NavBar />
      <Flex paddingTop="90" paddingLeft="90" alignItems="equal">
        {displayProducts}
      </Flex>
    </>
  );
};

export default CategoryDisplay;
