import React, { useState } from "react";
import { Select, Box, Container, useDisclosure } from "@chakra-ui/react";
import Cookies from "universal-cookie";
import NavBar from "./NavBar";

const LandingPage = () => {
  const cookies = new Cookies();

  const storedJwt = cookies.get("token");
  const [jwt, setJwt] = useState(storedJwt || null);

  return (
    <Box>
      <NavBar />
    </Box>
  );
};

export default LandingPage;
