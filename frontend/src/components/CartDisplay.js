import React, { useEffect, useState } from "react";
import { Box } from "@chakra-ui/react";
import Cookies from "universal-cookie";

const CartDisplay = () => {
  const cookies = new Cookies();

  const storedJwt = cookies.get("token");
  const [jwt, setJwt] = useState(storedJwt || null);
  return (
    <Box>
      <Box></Box>
    </Box>
  );
};

export default CartDisplay;
