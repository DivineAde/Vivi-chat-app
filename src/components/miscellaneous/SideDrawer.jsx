import React, { useState } from "react";
import {
  Avatar,
  AvatarBadge,
  Button,
  Input,
  InputGroup,
  InputLeftElement,
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
  Spinner,
  useToast,
  Badge,
} from "@chakra-ui/react";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { CiSearch } from "react-icons/ci";
import { ChatState } from "../../Context/ChatProvider";
import ProfileModal from "./ProfileModal";
import { useHistory } from "react-router-dom";
import { useDisclosure } from "@chakra-ui/hooks";
import { FaMessage } from "react-icons/fa6";
import axios from "axios";
import ChatLoading from "../ChatLoading";
import UserListItem from "../userAvatar/UserListItem";

const SideDrawer = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user, setSelectedChat, chats, setChats, notification, setNotification } = ChatState();
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const history = useHistory();
  const toast = useToast();

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    setChats([]);
    setSelectedChat(null);
    history.push("/");
  };

  const handleSearch = async () => {
    if (!search) {
      toast({ title: "Please enter something to search", status: "warning", duration: 3000, isClosable: true, position: "top" });
      return;
    }
    try {
      setLoading(true);
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/user?search=${search}`, config);
      setLoading(false);
      setSearchResult(data);
    } catch {
      toast({ title: "Error fetching users", status: "error", duration: 3000, isClosable: true, position: "bottom-left" });
      setLoading(false);
    }
  };

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const config = { headers: { "Content-type": "application/json", Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/api/chat`, { userId }, config);
      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setSelectedChat(data);
      setLoadingChat(false);
      onClose();
    } catch (error) {
      toast({ title: "Error fetching chat", description: error.message, status: "error", duration: 3000, isClosable: true, position: "bottom-left" });
    }
  };

  return (
    <>
      {/* ── Top App Bar ── */}
     <header className="flex items-center justify-between px-4 py-2 bg-white border-b border-gray-200 shadow-sm z-10 shrink-0">
      {/* Left: Brand / Logo */}
      <div className="flex items-center gap-3">
        <img 
          src="/favicon.ico" 
          alt="logo" 
          className="w-10 h-10 object-contain" 
        />
      </div>

      {/* Center: Search Trigger (Desktop) */}
      <button
        onClick={onOpen}
        className="hidden md:flex items-center gap-2 bg-gray-100 hover:bg-gray-200 transition-colors rounded-full px-4 py-1.5 text-sm text-gray-500 border border-transparent focus:outline-none focus:ring-2 focus:ring-blue-100"
      >
        <CiSearch size={18} className="text-gray-400" />
        <span>Search people…</span>
      </button>

      {/* Right: Actions */}
      <div className="flex items-center gap-1">
        {/* Search Icon (Mobile) */}
        <button 
          onClick={onOpen} 
          className="md:hidden p-2 rounded-full hover:bg-gray-100 text-gray-600 transition-colors"
        >
          <CiSearch size={22} />
        </button>

        {/* Notifications Menu */}
        <Menu>
          <MenuButton 
            as="div" 
            className="relative p-2 rounded-full hover:bg-gray-100 cursor-pointer transition-colors"
          >
            <BellIcon color="gray.600" fontSize="22px" />
            {notification.length > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-[9px] text-white flex items-center justify-center font-bold border-2 border-white">
                {notification.length}
              </span>
            )}
          </MenuButton>
          <MenuList 
            bg="white" 
            border="1px solid" 
            borderColor="gray.200" 
            shadow="xl" 
            rounded="xl" 
            py={2} 
            minW="240px"
          >
            {!notification.length ? (
              <MenuItem fontSize="sm" color="gray.500" cursor="default" _hover={{ bg: "transparent" }}>
                No new messages
              </MenuItem>
            ) : (
              notification.map((n) => (
                <MenuItem
                  key={n._id}
                  fontSize="sm"
                  color="gray.700"
                  _hover={{ bg: "gray.50" }}
                  onClick={() => {
                    setSelectedChat(n.chat);
                    setNotification(notification.filter((x) => x !== n));
                  }}
                >
                  {n.chat.isGroupChat 
                    ? `Group: ${n.chat.chatName}` 
                    : `New message from ${n.sender?.name || "Someone"}`}
                </MenuItem>
              ))
            )}
          </MenuList>
        </Menu>

        {/* Profile Menu */}
        <Menu>
          <MenuButton 
            as={Button} 
            variant="ghost" 
            _hover={{ bg: "gray.100" }} 
            _active={{ bg: "gray.200" }} 
            px={2} 
            rightIcon={<ChevronDownIcon color="gray.500" />}
          >
            <Avatar size="sm" name={user.name} src={user.pic}>
              <AvatarBadge boxSize="1.1em" bg="green.400" border="2px solid white" />
            </Avatar>
          </MenuButton>
          <MenuList 
            bg="white" 
            border="1px solid" 
            borderColor="gray.200" 
            shadow="xl" 
            rounded="xl" 
            py={2} 
            minW="180px"
          >
            {/* Replace with your ProfileModal component */}
            <MenuItem fontSize="sm" color="gray.700" _hover={{ bg: "gray.50" }}>
              My Profile
            </MenuItem>
            <MenuDivider my={1} borderColor="gray.100" />
            <MenuItem 
              fontSize="sm" 
              color="red.500" 
              _hover={{ bg: "red.50" }} 
              onClick={logoutHandler}
            >
              Sign Out
            </MenuItem>
          </MenuList>
        </Menu>
      </div>
    </header>

      {/* ── Search Modal ── */}
      <Modal isOpen={isOpen} onClose={onClose} size="md" isCentered>
        <ModalOverlay backdropFilter="blur(4px)" bg="blackAlpha.500" />
        <ModalContent rounded="2xl" shadow="2xl" border="none" mx={4}>
          <ModalHeader fontSize="lg" fontWeight="600" pb={0}>Find a person</ModalHeader>
          <ModalCloseButton />
          <ModalBody pt={3} pb={4}>
            <div className="flex gap-2">
              <Input
                placeholder="Search by name or email…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                rounded="xl"
                bg="gray.50"
                border="1.5px solid"
                borderColor="gray.200"
                _focus={{ borderColor: "blue.400", bg: "white" }}
              />
              <Button onClick={handleSearch} colorScheme="blue" rounded="xl" px={5} isLoading={loading}>
                Search
              </Button>
            </div>
            <div className="mt-3 space-y-1 max-h-64 overflow-y-auto">
              {loading ? (
                <ChatLoading />
              ) : (
                searchResult.map((u) => (
                  <UserListItem key={u._id} user={u} handleFunction={() => accessChat(u._id)} />
                ))
              )}
              {loadingChat && <Spinner display="flex" mx="auto" mt={3} color="blue.400" />}
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default SideDrawer;
