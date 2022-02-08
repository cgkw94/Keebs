import React from "react";
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

const ProductDetails = (props) => {
  return (
    <Box>
      <Box maxW="100%">
        <Heading>{props.name}</Heading>
      </Box>
      <Box>
        <Text>${props.price}</Text>
      </Box>
      <Box borderRadius="full" maxW="xl">
        <Text>
          Quantity{" "}
          <NumberInput
            size="lg"
            maxW={90}
            defaultValue={1}
            min={1}
            max={props.quantity}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </Text>
      </Box>
      <Box>
        <Button>ADD TO CART</Button>
      </Box>
      <Box>
        <Text>PRODUCT INFORMATION</Text>
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
