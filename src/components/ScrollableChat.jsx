import { Avatar } from "@chakra-ui/avatar";
import { Tooltip } from "@chakra-ui/tooltip";
import ScrollableFeed from "react-scrollable-feed";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../config/ChatLogics";
import { ChatState } from "../Context/ChatProvider";

const formatTime = (ts) => {
  const d = new Date(ts);
  return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
};

const formatDayHeader = (ts) => {
  const d = new Date(ts);
  const today = new Date();
  const diff = Math.floor((today - d) / 86400000);
  if (diff === 0) return "Today";
  if (diff === 1) return "Yesterday";
  return d.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" });
};

const ScrollableChat = ({ messages }) => {
  const { user } = ChatState();

  // Group messages by day for date separators
  const days = [];
  let lastDay = null;
  (messages || []).forEach((m) => {
    const day = new Date(m.createdAt).toDateString();
    if (day !== lastDay) {
      days.push({ type: "separator", label: formatDayHeader(m.createdAt), key: `sep-${day}` });
      lastDay = day;
    }
    days.push({ type: "message", data: m, key: m._id });
  });

  return (
    <ScrollableFeed>
      {days.map((item, idx) => {
        if (item.type === "separator") {
          return (
            <div key={item.key} className="flex items-center gap-3 my-3 px-4">
              <div className="flex-1 h-px bg-black/10" />
              <span className="text-[11px] text-gray-500 font-medium bg-white/70 rounded-full px-3 py-0.5 shadow-sm">
                {item.label}
              </span>
              <div className="flex-1 h-px bg-black/10" />
            </div>
          );
        }

        const m = item.data;
        const mi = messages.indexOf(m);
        const isMine = m.sender._id === user._id;
        const showAvatar =
          !isMine &&
          (isSameSender(messages, m, mi, user._id) || isLastMessage(messages, mi, user._id));
        const marginLeft = isSameSenderMargin(messages, m, mi, user._id);
        const marginTop = isSameUser(messages, m, mi, user._id) ? 2 : 10;

        return (
          <div
            key={item.key}
            className={`flex items-end px-4 fade-in ${isMine ? "justify-end" : "justify-start"}`}
            style={{ marginTop }}
          >
            {/* Other person's avatar */}
            {showAvatar ? (
              <Tooltip label={m.sender.name} placement="bottom-start" hasArrow>
                <Avatar
                  size="xs"
                  name={m.sender.name}
                  src={m.sender.pic}
                  mr={1}
                  mb="2px"
                  cursor="pointer"
                />
              </Tooltip>
            ) : (
              !isMine && <div style={{ width: 26, marginRight: 4, flexShrink: 0 }} />
            )}

            {/* Bubble */}
            <div
              className={`relative max-w-[70%] shadow-sm px-3 pt-2 pb-1
                ${isMine
                  ? "bg-[#2a8cd4] text-white rounded-2xl rounded-br-sm"
                  : "bg-white text-gray-800 rounded-2xl rounded-bl-sm"}`}
              style={{ marginLeft: isMine ? 0 : marginLeft }}
            >
              {/* Sender name in group chats */}
              {!isMine && m.chat?.isGroupChat && (
                <p className="text-[10px] font-semibold text-blue-500 mb-0.5">{m.sender.name}</p>
              )}
              <p className="text-sm leading-relaxed break-words">{m.content}</p>
              <div className={`flex items-center justify-end gap-1 mt-0.5 ${isMine ? "text-blue-100" : "text-gray-400"}`}>
                <span className="text-[10px]">{formatTime(m.createdAt)}</span>
                {isMine && (
                  <svg className="w-3 h-3" viewBox="0 0 16 11" fill="none">
                    <path d="M1 5.5L5.5 10L15 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
