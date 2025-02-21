import React, { useState, useEffect } from "react";
import { ChatState } from "../Context/ChatProvider";
import { Box, useToast, Button, Stack, Text, Avatar, AvatarBadge } from "@chakra-ui/react";
import axios from "axios";
import { AddIcon } from "@chakra-ui/icons";
import ChatLoading from "./ChatLoading";
import { BiCheckDouble } from "react-icons/bi";
import GroupChatModal from "./miscellaneous/GroupChatModal";

const MyChats = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState();
  const { user, setSelectedChat, selectedChat, chats, setChats } = ChatState();

  const toast = useToast();

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get("/api/chat", config);
      setChats(data);
    } catch (error) {
      toast({
        title: "Error Occurred!",
        description: "Failed to Load the chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("userInfo"));
    setLoggedUser(storedUser);
    fetchChats();
    // eslint-disable-next-line
  }, [fetchAgain, user]);

  const formatTimestampTo12Hour = (timestamp) => {
    const date = new Date(timestamp);
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    };
    return date.toLocaleString('en-US', options);
  };

  const timeAgo = (isoString) => {
    const date = new Date(isoString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    const units = [
      { label: "year", seconds: 31536000 },
      { label: "month", seconds: 2592000 },
      { label: "day", seconds: 86400 },
      { label: "hour", seconds: 3600 },
      { label: "minute", seconds: 60 },
      { label: "second", seconds: 1 },
    ];

    for (const unit of units) {
      const count = Math.floor(diffInSeconds / unit.seconds);
      if (count > 0) {
        return `${count} ${unit.label}${count > 1 ? 's' : ''} ago`;
      }
    }
    return "just now";
  };
  

  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={3}
      bg="#fff"
      w={{ base: "100%", md: "31%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "16px", md: "20px" }}
        display="flex"
        color="blue"
        fontWeight={'medium'}
        w="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        <Text color={"telegram.400"}>Messages</Text>
        <GroupChatModal>
          <Button
            d="flex"
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            rightIcon={<AddIcon />}
            borderRadius={'full'}
            bg={'blue.400'}
            colorScheme="facebook"
          >
            Create Group
          </Button>
        </GroupChatModal>
      </Box>

      <Box
        d="flex"
        flexDir="column"
        p={3}
        bg="#F8F8F8"
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden"
      >
        {chats ? (
          <Stack overflowY="scroll">
            {chats.map((chat) => (
              <Box
                onClick={() => setSelectedChat(chat)}
                cursor="pointer"
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                boxShadow='md'
                bg={selectedChat === chat ? "telegram.400" : "#fff"}
                color={selectedChat === chat ? "white" : "black"}
                px={3}
                py={3}
                borderRadius="lg"
                key={chat._id}
              >
                <Box display="flex" flexDirection="row">
                  {chat.latestMessage && (
                    <Avatar
                      name={chat.latestMessage.sender.name}
                      src={chat.latestMessage.sender.pic}
                    >
                      <AvatarBadge boxSize='1.25em' bg='whatsapp.400' />
                    </Avatar>
                  )}
                  <Box display="flex" flexDirection="column" ml=".5rem">
                    {chat.latestMessage && (
                      <Text fontSize="md" fontWeight="bold">
                        {chat.latestMessage.sender.name}
                      </Text>
                    )}
                    {chat.latestMessage && (
                      <Text fontSize="xs">
                        {chat.latestMessage.content.length > 50
                          ? chat.latestMessage.content.substring(0, 51) + "..."
                          : chat.latestMessage.content}
                      </Text>
                    )}
                  </Box>
                </Box>

                <Box textAlign="right">
                  {chat.updatedAt && (
                    <Text fontSize="sm" fontWeight="medium">
                      {formatTimestampTo12Hour(chat.updatedAt)}
                    </Text>
                  )}
                  {chat.updatedAt && (
                    <BiCheckDouble className="float-right" />
                  )}
                </Box>
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
};

export default MyChats;
