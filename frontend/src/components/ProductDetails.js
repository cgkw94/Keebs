import React, { useState } from "react";
import {
  Box,
  Container,
  HStack,
  Image,
  Text,
  Heading,
  Button,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  List,
  ListItem,
  ListIcon,
  OrderedList,
  UnorderedList,
} from "@chakra-ui/react";
import { FiShoppingCart } from "react-icons/fi";

const ProductDetails = (props) => {
  const [qtyChange, setQtyChange] = useState(1);

  const handleChange = (e) => {
    setQtyChange(parseInt(e));
    props.liftState(qtyChange);
  };

  return (
    <Box maxW="70%" alignItems="center">
      <Box align="center">
        <Image maxW="500" src={props.image} />
      </Box>
      <Box maxW="100%">
        <Heading textAlign="center">{props.name}</Heading>
        <Heading textAlign="center">${props.price}</Heading>
        <Text fontSize="xl" textAlign="center">
          Quantity{" "}
        </Text>
      </Box>
      <Box borderRadius="full" maxW="xl" align="center">
        <Box>
          <NumberInput
            size="lg"
            maxW={90}
            defaultValue={1}
            min={1}
            max={props.quantity}
            align="center"
            value={qtyChange}
            onChange={handleChange}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </Box>
      </Box>
      <Box>
        <Button
          leftIcon={<FiShoppingCart size="24px" />}
          size="lg"
          mt={4}
          isFullWidth
          colorScheme="blue"
          variant="outline"
          alignSelf={"center"}
          onClick={props.onClick}
        >
          Add to Cart
        </Button>
      </Box>
      <Box>
        <Text fontSize="2xl" textAlign="center">
          PRODUCT INFORMATION
        </Text>
        <Text>{props.description}</Text>
        <UnorderedList>
          <ListItem>{props.specs.spring}</ListItem>
          <ListItem>{props.specs.stem}</ListItem>
          <ListItem>{props.specs.top}</ListItem>
          <ListItem>{props.specs.bottom}</ListItem>
          <ListItem>{props.specs.pin}</ListItem>
        </UnorderedList>
        <Text>These switches are sold in packs of 10.</Text>
        <Text>Quantity 1 = 10 switches</Text>
      </Box>
    </Box>
  );
};

export default ProductDetails;
