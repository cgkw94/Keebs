import React, { useState } from "react";
import {
  Flex,
  Select,
  Box,
  Container,
  Button,
  useDisclosure,
  MenuItem,
  Menu,
  MenuButton,
  MenuList,
  Popover,
  PopoverTrigger,
  PopoverContent,
  useColorModeValue,
  useBreakpointValue,
  IconButton,
  Text,
  Stack,
} from "@chakra-ui/react";
import { FiShoppingCart, FiShoppingBag } from "react-icons/fi";
import {
  HamburgerIcon,
  CloseIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  ChevronUpIcon,
} from "@chakra-ui/icons";
import Cookies from "universal-cookie";

const NavBar = () => {
  const cookies = new Cookies();
  const { isOpen, onToggle, onClose, onOpen } = useDisclosure();

  const storedJwt = cookies.get("token");
  const storedUsername = cookies.get("username");
  const storedLoggedIn = cookies.get("loggedIn");

  const [jwt, setJwt] = useState(storedJwt || null);
  const [username, setUsername] = useState(storedUsername || null);
  const [isLoggedIn, setIsLoggedIn] = useState(storedLoggedIn || null);

  const handleCategory = (e) => {
    window.location.href = `/products/${e.target.value}`;
  };

  const handleCart = () => {
    if (isLoggedIn) {
      window.location.href = "/cart";
    } else {
      window.location.href = "/login";
    }
  };
  const handleHome = () => {
    window.location.href = "/";
  };
  const handleUserButton = () => {
    if (isLoggedIn) {
      window.location.href = "/user";
    } else {
      window.location.href = "/login";
    }
  };

  return (
    <Box>
      <Flex
        bg={useColorModeValue("white", "gray.800")}
        color={useColorModeValue("gray.600", "white")}
        minH={"60px"}
        py={{ base: 2 }}
        px={{ base: 4 }}
        borderBottom={1}
        borderStyle={"solid"}
        borderColor={useColorModeValue("gray.200", "gray.900")}
        align={"center"}
      >
        <Flex
          flex={{ base: 1, md: "auto" }}
          ml={{ base: -2 }}
          display={{ base: "flex", md: "none" }}
        >
          <IconButton
            onClick={onToggle}
            icon={
              isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />
            }
            variant={"ghost"}
            aria-label={"Toggle Navigation"}
          />
        </Flex>
        <Flex flex={{ base: 1 }} justify={{ base: "center", md: "start" }}>
          <Menu isOpen={isOpen} align={useBreakpointValue({ base: "center" })}>
            <MenuButton
              variant="ghost"
              mx={15}
              py={[2, 2, 2]}
              px={50}
              borderRadius={30}
              _hover={{ bg: "gray.100" }}
              aria-label="Home"
              fontWeight="Bold"
              onClick={handleHome}
            >
              HOME
            </MenuButton>
            <MenuButton
              variant="ghost"
              mx={15}
              py={[2, 2, 2]}
              px={50}
              borderRadius={30}
              _hover={{ bg: "gray.100" }}
              aria-label="Shop"
              fontWeight="Bold"
              onMouseEnter={onOpen}
              onMouseLeave={onClose}
            >
              Shop {isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
            </MenuButton>
            <MenuList onMouseEnter={onOpen} onMouseLeave={onClose}>
              <MenuItem value="1" onClick={handleCategory}>
                Switches
              </MenuItem>
              <MenuItem value="3" onClick={handleCategory}>
                Stabilisers
              </MenuItem>
              <MenuItem value="2" onClick={handleCategory}>
                Keycaps
              </MenuItem>
            </MenuList>
          </Menu>
        </Flex>

        <Stack
          flex={{ base: 1, md: 0 }}
          justify={"flex-end"}
          direction={"row"}
          spacing={6}
        >
          <Button
            display={{ base: "none", md: "inline-flex" }}
            fontSize={"sm"}
            fontWeight={600}
            color={"white"}
            bg={"pink.400"}
            href={"#"}
            _hover={{
              bg: "pink.300",
            }}
            onClick={handleUserButton}
          >
            {isLoggedIn ? username : "Login | Sign Up"}
          </Button>
          <Button
            display={{ base: "none", md: "inline-flex" }}
            fontSize={"sm"}
            fontWeight={600}
            color={"white"}
            bg={"green.400"}
            href={"#"}
            _hover={{
              bg: "green.300",
            }}
            leftIcon={<FiShoppingBag size="24px" />}
            onClick={handleCart}
          >
            View Cart
          </Button>
        </Stack>
      </Flex>
    </Box>
  );
};

export default NavBar;
