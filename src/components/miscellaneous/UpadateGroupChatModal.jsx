import {
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter,
  ModalBody, ModalCloseButton, Button, useDisclosure, Input, Spinner, useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import { ChatState } from "../../Context/ChatProvider";
import UserBadgeItem from "../userAvatar/UserBadgeItem";
import UserListItem from "../userAvatar/UserListItem";
import { PiDotsThreeOutlineVerticalLight, PiPhoneLight } from "react-icons/pi";
import { CiVideoOn } from "react-icons/ci";

const UpdateGroupChatModal = ({ fetchMessages, fetchAgain, setFetchAgain }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState("");
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameloading, setRenameLoading] = useState(false);
  const toast = useToast();
  const { selectedChat, setSelectedChat, user } = ChatState();

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) return;
    try {
      setLoading(true);
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/user?search=${query}`, config);
      setLoading(false);
      setSearchResult(data);
    } catch {
      toast({ title: "Failed to search", status: "error", duration: 3000, isClosable: true, position: "bottom-left" });
      setLoading(false);
    }
  };

  const handleRename = async () => {
    if (!groupChatName) return;
    try {
      setRenameLoading(true);
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.put(`${import.meta.env.VITE_API_URL}/api/chat/rename`, {
        chatId: selectedChat._id, chatName: groupChatName,
      }, config);
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setRenameLoading(false);
      setGroupChatName("");
    } catch (error) {
      toast({ title: "Rename failed", description: error.response?.data?.message, status: "error", duration: 4000, isClosable: true, position: "bottom" });
      setRenameLoading(false);
    }
  };

  const handleAddUser = async (user1) => {
    if (selectedChat.users.find((u) => u._id === user1._id)) {
      toast({ title: "User already in group", status: "warning", duration: 3000, isClosable: true, position: "bottom" });
      return;
    }
    if (selectedChat.groupAdmin._id !== user._id) {
      toast({ title: "Only admins can add members", status: "error", duration: 3000, isClosable: true, position: "bottom" });
      return;
    }
    try {
      setLoading(true);
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.put(`${import.meta.env.VITE_API_URL}/api/chat/groupadd`, {
        chatId: selectedChat._id, userId: user1._id,
      }, config);
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setLoading(false);
    } catch (error) {
      toast({ title: "Failed to add user", description: error.response?.data?.message, status: "error", duration: 4000, isClosable: true, position: "bottom" });
      setLoading(false);
    }
  };

  const handleRemove = async (user1) => {
    if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
      toast({ title: "Only admins can remove members", status: "error", duration: 3000, isClosable: true, position: "bottom" });
      return;
    }
    try {
      setLoading(true);
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.put(`${import.meta.env.VITE_API_URL}/api/chat/groupremove`, {
        chatId: selectedChat._id, userId: user1._id,
      }, config);
      user1._id === user._id ? setSelectedChat() : setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      fetchMessages();
      setLoading(false);
    } catch (error) {
      toast({ title: "Failed to remove user", description: error.response?.data?.message, status: "error", duration: 4000, isClosable: true, position: "bottom" });
      setLoading(false);
    }
  };

  return (
    <>
      {/* Trigger icons (shown in chat header) */}
      <div className="flex items-center gap-1.5 text-gray-500">
        <button className="p-1.5 rounded-full hover:bg-gray-100 transition-colors">
          <CiVideoOn size={20} />
        </button>
        <button className="p-1.5 rounded-full hover:bg-gray-100 transition-colors">
          <PiPhoneLight size={20} />
        </button>
        <button className="p-1.5 rounded-full hover:bg-gray-100 transition-colors" onClick={onOpen}>
          <PiDotsThreeOutlineVerticalLight size={20} />
        </button>
      </div>

      <Modal onClose={onClose} isOpen={isOpen} isCentered size="md">
        <ModalOverlay backdropFilter="blur(4px)" bg="blackAlpha.400" />
        <ModalContent rounded="2xl" shadow="2xl" border="none" mx={4}>
          <ModalHeader fontSize="lg" fontWeight="600">{selectedChat.chatName}</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={4}>
            {/* Member badges */}
            <div className="flex flex-wrap mb-3">
              {selectedChat.users.map((u) => (
                <UserBadgeItem
                  key={u._id}
                  user={u}
                  admin={selectedChat.groupAdmin}
                  handleFunction={() => handleRemove(u)}
                />
              ))}
            </div>

            {/* Rename */}
            <div className="flex gap-2 mb-3">
              <Input
                placeholder="Rename group…"
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
                rounded="xl"
                bg="gray.50"
                border="1.5px solid"
                borderColor="gray.200"
                _focus={{ borderColor: "blue.400", bg: "white" }}
                size="sm"
              />
              <Button
                onClick={handleRename}
                isLoading={renameloading}
                colorScheme="teal"
                rounded="xl"
                size="sm"
                px={4}
              >
                Rename
              </Button>
            </div>

            {/* Add people */}
            <Input
              placeholder="Add people to group…"
              onChange={(e) => handleSearch(e.target.value)}
              rounded="xl"
              bg="gray.50"
              border="1.5px solid"
              borderColor="gray.200"
              _focus={{ borderColor: "blue.400", bg: "white" }}
              size="sm"
              mb={2}
            />

            <div className="max-h-40 overflow-y-auto space-y-1">
              {loading ? (
                <div className="flex justify-center py-4"><Spinner color="blue.400" /></div>
              ) : (
                searchResult.map((u) => (
                  <UserListItem key={u._id} user={u} handleFunction={() => handleAddUser(u)} />
                ))
              )}
            </div>
          </ModalBody>
          <ModalFooter pt={0}>
            <Button onClick={() => handleRemove(user)} colorScheme="red" rounded="xl" size="sm" w="full">
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateGroupChatModal;
