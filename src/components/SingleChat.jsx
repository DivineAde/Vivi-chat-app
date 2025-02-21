import { Box, Text } from "@chakra-ui/layout";
import "./styles.css";
import {
  IconButton,
  Spinner,
  useToast,
  FormControl,
  Input,
  Avatar,
  InputRightElement,
  InputGroup,
  Button,
  AvatarGroup,
  InputLeftElement,
  SkeletonCircle,
  SkeletonText,
} from "@chakra-ui/react";
import { getSender, getSenderFull } from "../config/ChatLogics";
import { useEffect, useState } from "react";
import axios from "axios";
import { ArrowBackIcon, PhoneIcon } from "@chakra-ui/icons";
import { ChatState } from "../Context/ChatProvider";
import ProfileModal from "./miscellaneous/ProfileModal";
import UpdateGroupChatModal from "./miscellaneous/UpadateGroupChatModal";
import ScrollableChat from "./ScrollableChat";
import animationData from "../animations/typing.json";
import { CgAttachment } from "react-icons/cg";
import Lottie from "lottie-react";
import { FaRegCircleUser } from "react-icons/fa6";

import io from "socket.io-client";
import { IoSend } from "react-icons/io5";
import { IoIosSend } from "react-icons/io";
const ENDPOINT = "http://localhost:5000";
var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);
  const toast = useToast();

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const { selectedChat, setSelectedChat, user, notification, setNotification } =
    ChatState();

  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage) {
      socket.emit("stop typing", selectedChat._id);
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        setNewMessage("");
        const { data } = await axios.post(
          "/api/message",
          {
            content: newMessage,
            chatId: selectedChat,
          },
          config
        );
        socket.emit("new message", data);
        setMessages([...messages, data]);
      } catch (error) {
        toast({
          title: "Error Occured!",
          description: "Failed to send the Message",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  };

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      setLoading(true);

      const { data } = await axios.get(
        `/api/message/${selectedChat._id}`,
        config
      );
      console.log(messages);
      setMessages(data);
      setLoading(false);
      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Messages",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  useEffect(() => {
    socket = io(ENDPOINT);

    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    fetchMessages();

    selectedChatCompare = selectedChat;
    // eslint-disable-next-line
  }, [selectedChat]);

  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      if (
        !selectedChatCompare || // if chat is not selected or doesn't match current chat
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        if (!notification.includes(newMessageRecieved)) {
          setNotification([newMessageRecieved, ...notification]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages([...messages, newMessageRecieved]);
      }
    });
  });

  console.log(messages);

  console.log(selectedChat);

  return (
    <>
      {selectedChat ? (
        <>
          <Box
            //fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="Inter"
            color="black"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />
            {!selectedChat.isGroupChat ? (
              <Box display={"flex"} alignItems={"center"}>
                <Avatar
                  mr={"2"}
                  name={selectedChat.latestMessage.sender.name}
                  src={selectedChat.latestMessage.sender.pic}
                />
                <Box display={"flex"} flexDirection={"column"}>
                  <Text>{getSender(user, selectedChat.users)}</Text>
                  {istyping ? <Text fontSize={"xs"}>typing...</Text> : <></>}
                </Box>
              </Box>
            ) : (
              <AvatarGroup size="md" max={1}>
                {selectedChat.users.map((image, index) => (
                  <Avatar key={index} src={image.pic} name={image.name} />
                ))}
              </AvatarGroup>
            )}
            {!selectedChat.isGroupChat ? (
              <Box>
                <ProfileModal user={getSenderFull(user, selectedChat.users)} />
              </Box>
            ) : (
              <>
                <Text>{selectedChat.chatName.toUpperCase()}</Text>
                <UpdateGroupChatModal
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                  fetchMessages={fetchMessages}
                />
              </>
            )}
          </Box>

          <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="whitesmoke"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
          >
            {loading ? (
              <Box padding="6" boxShadow="lg" bg="white">
                <SkeletonCircle size="10" />
                <SkeletonText
                  mt="4"
                  noOfLines={4}
                  spacing="4"
                  skeletonHeight="2"
                />
              </Box>
            ) : (
              <div className="messages">
                <ScrollableChat messages={messages} />
              </div>
            )}

            <FormControl
              onKeyDown={sendMessage}
              id="first-name"
              isRequired
              mt={3}
            >
              {istyping ? <div></div> : <></>}
              <InputGroup borderColor="#E0E1E7">
                <InputLeftElement>
                  <FaRegCircleUser size={22} color="blue" />
                </InputLeftElement>
                <Input
                  ariant="filled"
                  bg="#fff"
                  placeholder="Enter a message.."
                  borderRadius={"full"}
                  color="black"
                  value={newMessage}
                  onChange={typingHandler}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      sendMessage(e);
                    }
                  }}
                />
                <InputRightElement width={"24"}>
                  <button
                    onClick={(e) => {
                      e.preventDefault();  
                      sendMessage({ key: "Enter" }); 
                    }}
                    className="items-center flex px-3 py-2 bg-indigo-600 rounded-full shadow "
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                    >
                      <g id="Send 01">
                        <path
                          id="icon"
                          d="M9.04071 6.959L6.54227 9.45744M6.89902 10.0724L7.03391 10.3054C8.31034 12.5102 8.94855 13.6125 9.80584 13.5252C10.6631 13.4379 11.0659 12.2295 11.8715 9.81261L13.0272 6.34566C13.7631 4.13794 14.1311 3.03408 13.5484 2.45139C12.9657 1.8687 11.8618 2.23666 9.65409 2.97257L6.18714 4.12822C3.77029 4.93383 2.56187 5.33664 2.47454 6.19392C2.38721 7.0512 3.48957 7.68941 5.69431 8.96584L5.92731 9.10074C6.23326 9.27786 6.38623 9.36643 6.50978 9.48998C6.63333 9.61352 6.72189 9.7665 6.89902 10.0724Z"
                          stroke="white"
                          stroke-width="1.6"
                          stroke-linecap="round"
                        />
                      </g>
                    </svg>
                    <h3 className="text-white text-xs font-semibold leading-4 px-2">
                      Send
                    </h3>
                  </button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
          </Box>
        </>
      ) : (
        // to get socket.io on same page
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          h="100%"
        >
          <Text fontSize="3xl" pb={3} color="black">
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
