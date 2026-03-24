import { useEffect, useRef, useState } from "react";
import axios from "axios";
import io from "socket.io-client";
import { Avatar, Spinner, useToast } from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import Lottie from "lottie-react";
import { ChatState } from "../Context/ChatProvider";
import { getSender, getSenderFull } from "../config/ChatLogics";
import ProfileModal from "./miscellaneous/ProfileModal";
import UpdateGroupChatModal from "./miscellaneous/UpadateGroupChatModal";
import ScrollableChat from "./ScrollableChat";
import animationData from "../animations/typing.json";
import "./styles.css";

const ENDPOINT = import.meta.env.VITE_API_URL;
var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);
  const toast = useToast();
  const inputRef = useRef(null);

  const { selectedChat, setSelectedChat, user, notification, setNotification } = ChatState();

  const fetchMessages = async () => {
    if (!selectedChat) return;
    try {
      setLoading(true);
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/message/${selectedChat._id}`,
        config
      );
      setMessages(data);
      setLoading(false);
      socket.emit("join chat", selectedChat._id);
    } catch {
      toast({ title: "Failed to load messages", status: "error", duration: 4000, isClosable: true, position: "bottom" });
    }
  };

  const sendMessage = async (event) => {
    if ((event.key === "Enter" || event.type === "click") && newMessage.trim()) {
      socket.emit("stop typing", selectedChat._id);
      try {
        const config = { headers: { "Content-type": "application/json", Authorization: `Bearer ${user.token}` } };
        const msgText = newMessage;
        setNewMessage("");
        const { data } = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/message`,
          { content: msgText, chatId: selectedChat },
          config
        );
        socket.emit("new message", data);
        setMessages((prev) => [...prev, data]);
      } catch {
        toast({ title: "Failed to send message", status: "error", duration: 4000, isClosable: true, position: "bottom" });
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
    const lastTypingTime = new Date().getTime();
    setTimeout(() => {
      const timeDiff = new Date().getTime() - lastTypingTime;
      if (timeDiff >= 3000 && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, 3000);
  };

  // Auto-focus input whenever selected chat changes
  useEffect(() => {
    if (selectedChat && inputRef.current) inputRef.current.focus();
  }, [selectedChat]);

  // Notification sound helper (Web Audio API — no file needed)
  const playPing = () => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 880;
      osc.type = "sine";
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.35);
    } catch (_) { /* ignore if blocked */ }
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
    socket.on("message recieved", (newMsg) => {
      if (!selectedChatCompare || selectedChatCompare._id !== newMsg.chat._id) {
        if (!notification.includes(newMsg)) {
          playPing();
          setNotification([newMsg, ...notification]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        // Message in active chat — also play a softer sound
        playPing();
        setMessages((prev) => [...prev, newMsg]);
      }
    });
  });

  const isGroup = selectedChat?.isGroupChat;

  return (
    <div className="flex flex-col h-full w-full">
      {selectedChat ? (
        <>
          {/* ── Chat Header ── */}
          <div className="flex items-center gap-3 px-4 py-2.5 bg-white border-b border-gray-200 shadow-sm shrink-0">
            {/* Back button (mobile) */}
            <button
              className="md:hidden p-1.5 rounded-full hover:bg-gray-100 text-gray-600"
              onClick={() => setSelectedChat("")}
            >
              <ArrowBackIcon boxSize={5} />
            </button>

            {/* Avatar + name */}
            <div className="flex items-center gap-3 flex-1 min-w-0">
              {!isGroup ? (
                <>
                  <Avatar
                    size="sm"
                    name={getSender(user, selectedChat.users)}
                    src={getSenderFull(user, selectedChat.users)?.pic}
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">
                      {getSender(user, selectedChat.users)}
                    </p>
                    {istyping && (
                      <p className="text-xs text-blue-500 animate-pulse">typing…</p>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                    {selectedChat.chatName.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">
                      {selectedChat.chatName}
                    </p>
                    <p className="text-xs text-gray-400">
                      {selectedChat.users.length} members
                    </p>
                  </div>
                </>
              )}
            </div>

            {/* Action icons */}
            <div className="shrink-0">
              {!isGroup ? (
                <ProfileModal user={getSenderFull(user, selectedChat.users)} />
              ) : (
                <UpdateGroupChatModal
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                  fetchMessages={fetchMessages}
                />
              )}
            </div>
          </div>

          {/* ── Messages Area ── */}
          <div className="flex-1 overflow-hidden message-bg flex flex-col">
            {loading ? (
              <div className="flex-1 flex items-center justify-center">
                <Spinner size="xl" color="blue.400" thickness="3px" />
              </div>
            ) : (
              <div className="messages flex-1">
                <ScrollableChat messages={messages} />
              </div>
            )}

            {/* Typing indicator */}
            {istyping && (
              <div className="px-4 pb-1 flex items-center gap-1.5">
                <div className="bg-white rounded-2xl rounded-bl-none px-3 py-2 shadow-sm flex items-center gap-1">
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                </div>
              </div>
            )}

            {/* ── Input Bar ── */}
            <div className="px-4 py-3 bg-[#f0f2f5] border-t border-gray-200 shrink-0">
              <div className="flex items-center gap-2 bg-white rounded-2xl shadow-sm px-4 py-2 border border-gray-200">
                <input
                  ref={inputRef}
                  className="flex-1 text-sm text-gray-800 outline-none placeholder-gray-400 bg-transparent"
                  placeholder="Type a message…"
                  value={newMessage}
                  onChange={typingHandler}
                  onKeyDown={sendMessage}
                />
                <button
                  onClick={sendMessage}
                  disabled={!newMessage.trim()}
                  className="shrink-0 w-9 h-9 rounded-full bg-blue-500 hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center justify-center shadow-sm"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M9.04071 6.959L6.54227 9.45744M6.89902 10.0724L7.03391 10.3054C8.31034 12.5102 8.94855 13.6125 9.80584 13.5252C10.6631 13.4379 11.0659 12.2295 11.8715 9.81261L13.0272 6.34566C13.7631 4.13794 14.1311 3.03408 13.5484 2.45139C12.9657 1.8687 11.8618 2.23666 9.65409 2.97257L6.18714 4.12822C3.77029 4.93383 2.56187 5.33664 2.47454 6.19392C2.38721 7.0512 3.48957 7.68941 5.69431 8.96584L5.92731 9.10074C6.23326 9.27786 6.38623 9.36643 6.50978 9.48998C6.63333 9.61352 6.72189 9.7665 6.89902 10.0724Z" stroke="white" strokeWidth="1.6" strokeLinecap="round" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </>
      ) : (
        /* ── Empty state ── */
        <div className="flex-1 message-bg flex flex-col items-center justify-center gap-4 select-none">
          <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center">
            <svg className="w-10 h-10 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <div className="text-center">
            <p className="text-gray-600 font-semibold text-lg">Select a conversation</p>
            <p className="text-gray-400 text-sm mt-1">Pick a chat from the left to start messaging</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SingleChat;
