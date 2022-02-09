import React, { useState } from "react";
import {
  Select,
  Box,
  Container,
  Button,
  useDisclosure,
  MenuItem,
  Menu,
  MenuButton,
  MenuList,
} from "@chakra-ui/react";
import { FiShoppingCart, FiShoppingBag } from "react-icons/fi";
import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import Cookies from "universal-cookie";

const NavBar = () => {
  const cookies = new Cookies();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const storedJwt = cookies.get("token");
  const [jwt, setJwt] = useState(storedJwt || null);

  const handleSwitches = (e) => {
    console.log(e.target.value);
    window.location.href = `/products/${e.target.value}`;
  };

  const handleCart = () => {
    window.location.href = "/cart";
  };

  return (
    <Menu isOpen={isOpen}>
      <MenuButton
        variant="ghost"
        mx={1}
        py={[1, 2, 2]}
        px={4}
        borderRadius={5}
        _hover={{ bg: "gray.100" }}
        aria-label="Courses"
        fontWeight="normal"
        onMouseEnter={onOpen}
        onMouseLeave={onClose}
      >
        Shop {isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
      </MenuButton>
      <MenuList onMouseEnter={onOpen} onMouseLeave={onClose}>
        <MenuItem value="1" onClick={handleSwitches}>
          Switches
        </MenuItem>
        <MenuItem>Stabilisers</MenuItem>
        <MenuItem>Keycaps</MenuItem>
      </MenuList>
      <Button
        my="5px"
        colorScheme="green"
        variant="ghost"
        leftIcon={<FiShoppingBag size="24px" />}
        size="lg"
        p={2}
        className="snipcart-checkout"
        onClick={handleCart}
      >
        View Cart
      </Button>
    </Menu>
  );
};

export default NavBar;
