import React, { useState } from "react";
import Cookies from "universal-cookie";
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

const Login2 = () => {
  const [error, setError] = useState("");
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [rpassword, setRpassword] = useState("");
  const [newUser, setNewUser] = useState({
    username: "",
    password: "",
    first_name: "",
    last_name: "",
    mobile_number: "",
    email: "",
  });

  const [show, setShow] = React.useState(false);
  const handleClick = () => setShow(!show);

  const cookies = new Cookies();

  const fetchLogin = async () => {
    const res = await fetch("http://localhost:5002/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: usernameInput,
        password: passwordInput,
      }),
    });

    const data = await res.json();

    if (data.accessToken) {
      setError("Logging in");

      cookies.set("token", data.accessToken, {
        path: "/",
        maxAge: 2 * 60 * 60,
      });
      cookies.set("username", data.username, {
        path: "/",
        maxAge: 2 * 60 * 60,
      });
      cookies.set("admin", data.admin, {
        path: "/",
        maxAge: 2 * 60 * 60,
      });
      cookies.set("loggedIn", data.loggedIn, {
        path: "/",
        maxAge: 2 * 60 * 60,
      });
    } else {
      setError(data);
    }
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    fetchLogin();
  };

  const handleLoginUsername = (e) => {
    setUsernameInput(e.target.value);
  };

  const handleLoginPassword = (e) => {
    setPasswordInput(e.target.value);
  };

  const handleUsername = (e) => {
    setNewUser((prevState) => {
      return { ...prevState, username: e.target.value };
    });
  };

  const handlePassword = (e) => {
    setNewUser((prevState) => {
      return { ...prevState, password: e.target.value };
    });
  };

  const handleRPassword = (e) => {
    setRpassword(e.target.value);
  };

  const handleEmail = (e) => {
    setNewUser((prevState) => {
      return { ...prevState, email: e.target.value };
    });
  };

  const handleFirstName = (e) => {
    setNewUser((prevState) => {
      return { ...prevState, first_name: e.target.value };
    });
  };

  const handleLastName = (e) => {
    setNewUser((prevState) => {
      return { ...prevState, last_name: e.target.value };
    });
  };

  const handleMobileNum = (e) => {
    setNewUser((prevState) => {
      return { ...prevState, mobile_number: e.target.value };
    });
  };

  const handleNew = (e) => {
    e.preventDefault();
    if (
      newUser.username.length === 0 ||
      newUser.password.length === 0 ||
      newUser.email.length === 0 ||
      newUser.first_name.length === 0 ||
      newUser.last_name.length === 0 ||
      newUser.mobile_number.length === 0
    ) {
      setError("All fields are required.");
    } else if (newUser.password !== rpassword) {
      setError("Passwords do not match.");
    } else if (newUser.email.includes("@") === false) {
      setError("Invalid Email address.");
    } else {
      createUser();
    }
  };

  const createUser = async () => {
    const res = await fetch("http://localhost:5002/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      mode: "cors",
      body: JSON.stringify(newUser),
    });
    const data = await res.json();
  };

  return (
    <>
      <Container w="75%" mt="10">
        <Tabs w="100%" isFitted variant="enclosed" colorScheme="blue">
          <TabList mb="1em">
            <Tab>Login</Tab>
            <Tab>Sign Up</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Stack direction="column" spacing={2}>
                <Input
                  placeholder="Enter username"
                  size="md"
                  onChange={handleLoginUsername}
                />

                <InputGroup size="md">
                  <Input
                    pr="4.5rem"
                    type={show ? "text" : "password"}
                    placeholder="Enter password"
                    onChange={handleLoginPassword}
                  />
                  <InputRightElement width="4.5rem">
                    <Button h="1.75rem" size="sm" onClick={handleClick}>
                      {show ? "Hide" : "Show"}
                    </Button>
                  </InputRightElement>
                </InputGroup>
                <FormControl isInvalid={error}>
                  <FormErrorMessage>{error}</FormErrorMessage>
                </FormControl>
                <Button
                  colorScheme="blue"
                  variant="outline"
                  type="submit"
                  onClick={handleLoginSubmit}
                >
                  Submit
                </Button>
              </Stack>
            </TabPanel>
            <TabPanel>
              <Stack direction="column" spacing={2}>
                <Input
                  placeholder="Enter username"
                  size="md"
                  onChange={handleUsername}
                />

                <InputGroup size="md">
                  <Input
                    pr="4.5rem"
                    type={show ? "text" : "password"}
                    placeholder="Enter password"
                    onChange={handlePassword}
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
                    placeholder="Retype password"
                    onChange={handleRPassword}
                  />
                  <InputRightElement width="4.5rem">
                    <Button h="1.75rem" size="sm">
                      {show ? "Hide" : "Show"}
                    </Button>
                  </InputRightElement>
                </InputGroup>
                <Input
                  placeholder="Enter first name"
                  size="md"
                  onChange={handleFirstName}
                />
                <Input
                  placeholder="Enter last name"
                  size="md"
                  onChange={handleLastName}
                />
                <Input
                  placeholder="Enter mobile number"
                  size="md"
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
                  onClick={handleNew}
                >
                  Submit
                </Button>
              </Stack>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Container>
    </>
  );
};

export default Login2;
