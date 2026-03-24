import React, { useState, useEffect } from "react";
import { ChatState } from "../Context/ChatProvider";
import { useToast, Avatar, AvatarBadge } from "@chakra-ui/react";
import axios from "axios";
import { AddIcon } from "@chakra-ui/icons";
import ChatLoading from "./ChatLoading";
import GroupChatModal from "./miscellaneous/GroupChatModal";

// ── Smart timestamp ──────────────────────────────────────────────
const smartTime = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now - d;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr  = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr  / 24);

  if (diffMin < 1)  return "just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr  < 24) return `${diffHr}h ago`;
  if (diffDay === 1) return "Yesterday";
  if (diffDay < 7)  return d.toLocaleDateString("en-US", { weekday: "short" });
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

const getSenderName = (loggedUser, users) => {
  if (!users) return "";
  return users[0]?._id === loggedUser?._id ? users[1]?.name : users[0]?.name;
};
const getSenderPic = (loggedUser, users) => {
  if (!users) return "";
  return users[0]?._id === loggedUser?._id ? users[1]?.pic : users[0]?.pic;
};

const MyChats = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState();
  const { user, setSelectedChat, selectedChat, chats, setChats } = ChatState();
  const [search, setSearch] = useState("");
  const toast = useToast();

  const fetchChats = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/chat`, config);
      setChats(data);
    } catch {
      toast({ title: "Failed to load chats", status: "error", duration: 4000, isClosable: true, position: "bottom-left" });
    }
  };

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("userInfo"));
    setLoggedUser(storedUser);
    fetchChats();
    // eslint-disable-next-line
  }, [fetchAgain, user]);

  const filtered = chats?.filter((chat) => {
    const name = chat.isGroupChat ? chat.chatName : getSenderName(loggedUser, chat.users);
    return name?.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <aside
      className={`flex flex-col bg-[#f7f8fa] border-r border-gray-200 shrink-0 transition-all duration-300
        ${selectedChat ? "hidden md:flex" : "flex"}
        w-full md:w-[320px] lg:w-[360px] h-full`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100">
        <h2 className="text-base font-bold text-gray-800">Messages</h2>
        <GroupChatModal>
          <button className="flex items-center gap-1.5 text-xs font-semibold bg-blue-500 hover:bg-blue-600 active:scale-95 transition-all text-white rounded-full px-3 py-1.5 shadow-sm shadow-blue-200">
            <AddIcon boxSize={2.5} />
            New Group
          </button>
        </GroupChatModal>
      </div>

      {/* Search */}
      <div className="px-3 py-2.5 bg-white border-b border-gray-100">
        <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2 border border-gray-100">
          <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            className="flex-1 text-sm bg-transparent outline-none text-gray-700 placeholder-gray-400"
            placeholder="Search conversations…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button onClick={() => setSearch("")} className="text-gray-400 hover:text-gray-600 text-xs">✕</button>
          )}
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {!chats ? (
          <div className="p-3"><ChatLoading /></div>
        ) : filtered?.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-3 py-12 text-center px-6">
            <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center">
              <svg className="w-7 h-7 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <p className="text-sm text-gray-500 font-medium">
              {search ? `No results for "${search}"` : "No conversations yet"}
            </p>
            {!search && <p className="text-xs text-gray-400">Use the search in the top bar to find someone</p>}
          </div>
        ) : (
          filtered.map((chat) => {
            const isSelected = selectedChat?._id === chat._id;
            const isGroup = chat.isGroupChat;
            const name = isGroup ? chat.chatName : getSenderName(loggedUser, chat.users);
            const pic  = isGroup ? null : getSenderPic(loggedUser, chat.users);
            const preview = chat.latestMessage?.content;
            const isMine = chat.latestMessage?.sender?._id === loggedUser?._id;
            const senderLabel = chat.latestMessage
              ? (isMine ? "You" : chat.latestMessage.sender?.name?.split(" ")[0])
              : null;

            return (
              <div
                key={chat._id}
                onClick={() => setSelectedChat(chat)}
                className={`group flex items-center gap-3 px-4 py-3 cursor-pointer transition-all duration-150 relative
                  ${isSelected
                    ? "bg-blue-50"
                    : "hover:bg-gray-50"
                  }`}
              >
                {/* Active indicator */}
                {isSelected && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-8 bg-blue-500 rounded-r-full" />
                )}

                {/* Avatar */}
                <div className="relative shrink-0">
                  <Avatar name={name} src={pic || undefined} size="md" bg={isGroup ? "purple.400" : "blue.400"} color="white">
                    {!isGroup && <AvatarBadge boxSize="1em" bg="green.400" border="2px solid" borderColor={isSelected ? "blue.50" : "gray.50"} />}
                  </Avatar>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between gap-1">
                    <span className={`text-sm font-semibold truncate ${isSelected ? "text-blue-700" : "text-gray-800 group-hover:text-gray-900"}`}>
                      {name}
                    </span>
                    <span className={`text-[10px] shrink-0 tabular-nums ${isSelected ? "text-blue-400" : "text-gray-400"}`}>
                      {smartTime(chat.updatedAt)}
                    </span>
                  </div>
                  {preview ? (
                    <p className="text-xs text-gray-500 truncate mt-0.5">
                      {senderLabel && <span className="font-medium text-gray-600">{senderLabel}: </span>}
                      {preview.length > 40 ? preview.slice(0, 40) + "…" : preview}
                    </p>
                  ) : (
                    <p className="text-xs text-gray-400 italic truncate mt-0.5">No messages yet</p>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </aside>
  );
};

export default MyChats;
