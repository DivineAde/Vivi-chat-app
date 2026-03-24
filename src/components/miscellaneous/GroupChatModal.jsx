import React, { useState } from "react";
import {
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter,
  ModalBody, ModalCloseButton, useDisclosure, Button, useToast,
  Input, Spinner,
} from "@chakra-ui/react";
import { ChatState } from "../../Context/ChatProvider";
import axios from "axios";
import UserListItem from "../userAvatar/UserListItem";
import UserBadgeItem from "../userAvatar/UserBadgeItem";

const GroupChatModal = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const { user, chats, setChats } = ChatState();

  const handleGroup = (userToAdd) => {
    if (selectedUsers.find((u) => u._id === userToAdd._id)) {
      toast({ title: "User already added", status: "warning", duration: 3000, isClosable: true, position: "top" });
      return;
    }
    setSelectedUsers([...selectedUsers, userToAdd]);
  };

  const handleDelete = (delUser) => {
    setSelectedUsers(selectedUsers.filter((u) => u._id !== delUser._id));
  };

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
      toast({ title: "Failed to search users", status: "error", duration: 3000, isClosable: true, position: "bottom-left" });
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!groupChatName || selectedUsers.length < 2) {
      toast({ title: "Please fill all fields & add at least 2 users", status: "warning", duration: 3000, isClosable: true, position: "top" });
      return;
    }
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/api/chat/group`, {
        name: groupChatName,
        users: JSON.stringify(selectedUsers.map((u) => u._id)),
      }, config);
      setChats([data, ...chats]);
      onClose();
      toast({ title: "Group created!", status: "success", duration: 3000, isClosable: true, position: "top" });
    } catch (error) {
      toast({ title: "Failed to create group", description: error.response?.data, status: "error", duration: 4000, isClosable: true, position: "bottom" });
    }
  };

  return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal isOpen={isOpen} onClose={onClose} isCentered size="md">
        <ModalOverlay backdropFilter="blur(4px)" bg="blackAlpha.400" />
        <ModalContent rounded="2xl" shadow="2xl" border="none" mx={4}>
          <ModalHeader fontSize="lg" fontWeight="600">Create Group Chat</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={4}>
            <div className="space-y-3">
              <Input
                placeholder="Group name…"
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
                rounded="xl"
                bg="gray.50"
                border="1.5px solid"
                borderColor="gray.200"
                _focus={{ borderColor: "blue.400", bg: "white" }}
              />
              <Input
                placeholder="Add people (search by name)…"
                onChange={(e) => handleSearch(e.target.value)}
                rounded="xl"
                bg="gray.50"
                border="1.5px solid"
                borderColor="gray.200"
                _focus={{ borderColor: "blue.400", bg: "white" }}
              />

              {/* Selected badges */}
              {selectedUsers.length > 0 && (
                <div className="flex flex-wrap gap-1 pt-1">
                  {selectedUsers.map((u) => (
                    <UserBadgeItem key={u._id} user={u} handleFunction={() => handleDelete(u)} />
                  ))}
                </div>
              )}

              {/* Search results */}
              <div className="max-h-48 overflow-y-auto space-y-1">
                {loading ? (
                  <div className="flex justify-center py-4"><Spinner color="blue.400" /></div>
                ) : (
                  searchResult.slice(0, 6).map((u) => (
                    <UserListItem key={u._id} user={u} handleFunction={() => handleGroup(u)} />
                  ))
                )}
              </div>
            </div>
          </ModalBody>
          <ModalFooter pt={0}>
            <Button onClick={handleSubmit} colorScheme="blue" rounded="xl" w="full">
              Create Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupChatModal;
