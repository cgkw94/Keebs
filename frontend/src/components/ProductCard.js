import React from "react";
import { Link } from "react-router-dom";
import { Box, Text, WrapItem, Image } from "@chakra-ui/react";

const ProductCard = (props) => {
  const onClick = () => {
    window.location.href = `/products/details/${props.product_id}`;
  };
  return (
    <WrapItem>
      <Box
        maxW="sm"
        m="10px"
        borderRadius="lg"
        overflow="hidden"
        onClick={onClick}
        paddingLeft="20px"
      >
        <Image
          borderRadius="lg"
          h="260"
          w="300"
          src={props.image}
          alt=""
        ></Image>
        <Text
          mt="1"
          fontWeight="semibold"
          fontSize="xl"
          lineHeight="tight"
          isTruncated
          id={props.product_id}
          align="center"
          paddingTop="12px"
        >
          {props.name} - ${props.price}
        </Text>
      </Box>
    </WrapItem>
  );
};

export default ProductCard;
