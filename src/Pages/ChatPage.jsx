import React, { useEffect, useState } from "react";
import { ChatState } from "../Context/ChatProvider";
import SideDrawer from "../components/miscellaneous/SideDrawer";
import MyChats from "../components/MyChats";
import ChatBox from "../components/ChatBox";
import { Box } from "@chakra-ui/layout";

const ChatPage = () => {
  const [fetchAgain, setFetchAgain] = useState(false);
  const { user } = ChatState();

  return (
    <div style={{ width: '100%', backgroundColor: '#F8F8F8'}} >
      {user && <SideDrawer />}
      <Box d="flex" style={{ display: "flex"}} justifyContent="space-between" w="100%" h="91.5vh" p="10px">
      {user && <MyChats fetchAgain={fetchAgain} />}
        {user && (
          <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
      </Box>
    </div>
  );
};

export default ChatPage;
