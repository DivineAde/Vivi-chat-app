import SingleChat from "./SingleChat";
import { ChatState } from "../Context/ChatProvider";
import "./styles.css";

const ChatBox = ({ fetchAgain, setFetchAgain }) => {
  const { selectedChat } = ChatState();

  return (
    <main
      className={`flex flex-col flex-1 h-full overflow-hidden
        ${selectedChat ? "flex" : "hidden md:flex"}`}
    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </main>
  );
};

export default ChatBox;