import { Avatar } from "@chakra-ui/avatar";
import { Tooltip } from "@chakra-ui/tooltip";
import ScrollableFeed from "react-scrollable-feed";
import { Box, Text } from "@chakra-ui/react";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../config/ChatLogics";
import { ChatState } from "../Context/ChatProvider";
import { FaCheck } from "react-icons/fa6";

const formatDateAndTime = (timestamp) => {
  const date = new Date(timestamp);
  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  };
  return date.toLocaleString('en-US', options);
};

const formatTimestampTo12Hour = (timestamp) => {
  const date = new Date(timestamp);
  const options = {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  };
  return date.toLocaleString('en-US', options);
};

const ScrollableChat = ({ messages }) => {
  const { user } = ChatState();

  // Get the timestamp of the first message
  const firstMessageTimestamp = messages && messages.length > 0 ? messages[0].createdAt : null;
  const formattedDateAndTime = firstMessageTimestamp ? formatDateAndTime(firstMessageTimestamp) : '';

  return (
    <ScrollableFeed>
      {firstMessageTimestamp && (
        <Box textAlign="center" mb={3}>
          <Text fontSize="sm" color="gray.500">
            {formattedDateAndTime}
          </Text>
        </Box>
      )}
      {messages &&
        messages.map((m, i) => (
          <div
            style={{ display: "flex", justifyContent: "flex-start", paddingBottom: '5px' }}
            key={m._id}
          >
            {(isSameSender(messages, m, i, user._id) ||
              isLastMessage(messages, i, user._id)) && (
              <Box>
                <Tooltip
                  label={m.sender.name}
                  placement="bottom-start"
                  hasArrow
                >
                  <Avatar
                    mt="7px"
                    mr={1}
                    size="sm"
                    cursor="pointer"
                    name={m.sender.name}
                    src={m.sender.pic}
                  />
                </Tooltip>
              </Box>
            )}
            <div
              style={{
                backgroundColor: m.sender._id === user._id ? "#0088cc" : "#fff",
                color: m.sender._id === user._id ? "#fff" : "#000",
                marginLeft: isSameSenderMargin(messages, m, i, user._id),
                marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
                boxShadow: "2px 4px 6px -1px rgb(0 0 0 / 0.2), 2px 2px 4px -2px rgb(0 0 0 / 0.2)",
                borderRadius:
                  m.sender._id === user._id
                    ? "10px 10px 0px 10px"
                    : "10px 10px 10px 0px",
                position: "relative",
                padding: "5px 15px",
                maxWidth: "75%",
              }}
            >
              <span className="text-base">{m.content}</span>
              <span className="flex items-center justify-end text-[10px] mt-1">
                {formatTimestampTo12Hour(m.createdAt)}
                <FaCheck className="ml-1" />
              </span>
            </div>
          </div>
        ))}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
