import { Box, Text } from "@chakra-ui/layout";
import {
  Avatar,
  AvatarBadge,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Tooltip,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { BellIcon, ChevronDownIcon, PhoneIcon } from "@chakra-ui/icons";
import { CiSearch } from "react-icons/ci";
import { ChatState } from "../../Context/ChatProvider";
import ProfileModal from "./ProfileModal";
import { useHistory } from "react-router-dom";
import { useDisclosure } from "@chakra-ui/hooks";
import { FaMessage } from "react-icons/fa6";
import axios from "axios";

const SideDrawer = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);
  const { user, setSelectedChat, chats, setChats } = ChatState();
  const [loggedUser, setLoggedUser] = useState();
  const history = useHistory();
  const [show, setShow] = React.useState(false);
  const handleClick = () => setShow(!show);

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    setLoggedUser(null);
    setChats([]); // Clear the chats
    setSelectedChat(null);
    history.push("/"); // For React Router v5
  };

  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);

  const toast = useToast();

  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "Please Enter something in search",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`/api/user?search=${search}`, config);

      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  const accessChat = async (userId) => {
    console.log(userId);

    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(`/api/chat`, { userId }, config);

      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setSelectedChat(data);
      setLoadingChat(false);
      onClose();
    } catch (error) {
      toast({
        title: "Error fetching the chat",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };
  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="white"
        w="100%"
        p="5px 10px 5px 10px"
        borderWidth="1px"
      >
        <Box display={"flex"} alignItems={"center"}>
          <Text color={"telegram.400"} fontSize={"md"} mr={"2"}></Text>
          <FaMessage size={22} color="#0088cc" />
        </Box>

        <Box display={"flex"} alignItems={"center"}>
          <InputGroup display={{ base: "none", md: "block" }}>
            <InputLeftElement pointerEvents="none">
              <CiSearch size={20} color="#000" />
            </InputLeftElement>
            <Input
              onClick={onOpen}
              type="search"
              placeholder="Search"
              rounded={"full"}
            />
          </InputGroup>
          <button onClick={onOpen} className="block md:hidden">
            <CiSearch color="#978484" size={22} />
          </button>
          <Menu>
            <MenuButton p={1}>
              <BellIcon color="black" fontSize="2xl" m={1} />
            </MenuButton>
          </Menu>
          <Menu>
            <MenuButton as={Button} bg="white" rightIcon={<ChevronDownIcon />}>
              <Avatar
                size="sm"
                cursor="pointer"
                name={user.name}
                src={user.pic}
              >
                <AvatarBadge boxSize="1.25em" bg="green.500" />
              </Avatar>
            </MenuButton>
            <MenuList>
              <ProfileModal user={user}>
                <MenuItem color="black">My Profile</MenuItem>
              </ProfileModal>
              <MenuDivider />
              <MenuItem onClick={logoutHandler} color="black">
                Logout
              </MenuItem>
            </MenuList>
          </Menu>
        </Box>
      </Box>

      <Modal
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        size={"xl"}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Find user</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel></FormLabel>
              <Input ref={initialRef} placeholder="Search..." />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3}>
              Search
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/*
      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Find a User</DrawerHeader>

          <DrawerBody>
            <Box display="flex" pb={2}>
              <Input
                placeholder="Search by name or email"
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={handleSearch}>Go </Button>
            </Box>

            {loading ? (
              <ChatLoading />
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
              ))
            )}

            {loadingChat && <Spinner ml="auto" display="flex" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
          */}
    </>
  );
};

export default SideDrawer;
