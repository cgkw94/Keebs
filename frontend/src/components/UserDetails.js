import React, { useEffect, useState } from "react";
import {
  Container,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  FormControl,
  FormErrorMessage,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Button,
  Stack,
} from "@chakra-ui/react";
import { EmailIcon } from "@chakra-ui/icons";
import Cookies from "universal-cookie";

const UserDetails = () => {
  const cookies = new Cookies();
  const storedJwt = cookies.get("token");

  const [jwt, setJwt] = useState(storedJwt || null);
  const [username, setUsername] = useState("");
  const [userDetails, setUserDetails] = useState({
    customer_id: "",
    oldPassword: "",
    newPassword: "",
    first_name: "",
    last_name: "",
    mobile_number: "",
    email: "",
  });
  const [error, setError] = useState("");
  const [show, setShow] = useState(false);

  const handleClick = () => setShow(!show);

  const fetchUserDetails = async (url) => {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + jwt,
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    setUsername(data.username);
    setUserDetails({
      customer_id: data.customer_id,
      oldPassword: "",
      newPassword: "",
      first_name: data.first_name,
      last_name: data.last_name,
      mobile_number: data.mobile_number,
      email: data.email,
    });
  };

  useEffect(() => {
    fetchUserDetails("http://localhost:5002/user/");
  }, []);

  const handleOldPassword = (e) => {
    setUserDetails((prevState) => {
      return { ...prevState, oldPassword: e.target.value };
    });
  };

  const handleNewPassword = (e) => {
    setUserDetails((prevState) => {
      return { ...prevState, newPassword: e.target.value };
    });
  };

  const handleFirstName = (e) => {
    setUserDetails((prevState) => {
      return { ...prevState, first_name: e.target.value };
    });
  };

  const handleLastName = (e) => {
    setUserDetails((prevState) => {
      return { ...prevState, last_name: e.target.value };
    });
  };

  const handleMobileNum = (e) => {
    setUserDetails((prevState) => {
      return { ...prevState, mobile_number: e.target.value };
    });
  };

  const handleEmail = (e) => {
    setUserDetails((prevState) => {
      return { ...prevState, email: e.target.value };
    });
  };

  const updateDetails = async (userDetails) => {
    const res = await fetch("http://localhost:5002/user/update", {
      method: "PATCH",
      headers: {
        Authorization: "Bearer " + jwt,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userDetails }),
    });
    const data = await res.json();
    setError(data);

    if (data === "Update successful") {
      window.location.href = "/user";
    }
  };

  const handleNewDetails = (e) => {
    e.preventDefault();

    updateDetails(userDetails);
  };

  return (
    <>
      <Container w="75%" mt="10">
        <Tabs w="100%" isFitted variant="enclosed" colorScheme="blue">
          <TabList mb="1em">
            <Tab>Edit Details</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Stack direction="column" spacing={2}>
                <Input
                  placeholder="Username"
                  size="md"
                  value={username}
                  isDisabled="true"
                />

                <InputGroup size="md">
                  <Input
                    pr="4.5rem"
                    type={show ? "text" : "password"}
                    placeholder="Old password"
                    onChange={handleOldPassword}
                  />
                  <InputRightElement width="4.5rem">
                    <Button h="1.75rem" size="sm" onClick={handleClick}>
                      {show ? "Hide" : "Show"}
                    </Button>
                  </InputRightElement>
                </InputGroup>
                <InputGroup size="md">
                  <Input
                    pr="4.5rem"
                    type={show ? "text" : "password"}
                    placeholder="New password"
                    onChange={handleNewPassword}
                  />
                  <InputRightElement width="4.5rem">
                    <Button h="1.75rem" size="sm">
                      {show ? "Hide" : "Show"}
                    </Button>
                  </InputRightElement>
                </InputGroup>
                <Input
                  placeholder="First name"
                  size="md"
                  value={userDetails.first_name}
                  onChange={handleFirstName}
                />
                <Input
                  placeholder="Last name"
                  size="md"
                  value={userDetails.last_name}
                  onChange={handleLastName}
                />
                <Input
                  placeholder="Mobile number"
                  size="md"
                  value={userDetails.mobile_number}
                  onChange={handleMobileNum}
                />
                <InputGroup>
                  <InputLeftElement
                    pointerEvents="none"
                    children={<EmailIcon color="gray.300" />}
                  />
                  <Input
                    type="email"
                    placeholder="Email address"
                    value={userDetails.email}
                    onChange={handleEmail}
                  />
                </InputGroup>
                <FormControl isInvalid={error}>
                  <FormErrorMessage>{error}</FormErrorMessage>
                </FormControl>
                <Button
                  colorScheme="blue"
                  variant="outline"
                  type="submit"
                  onClick={handleNewDetails}
                >
                  Submit New Details
                </Button>
              </Stack>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Container>
    </>
  );
};

export default UserDetails;
