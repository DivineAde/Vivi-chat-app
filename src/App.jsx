import { useState } from "react";
import { Button, ButtonGroup } from '@chakra-ui/react'
import "./App.css";
import { Route } from "react-router-dom";
import Homepage from "./Pages/Homepage";
import ChatPage from "./Pages/ChatPage";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="App h-screen text-white">
     <Route path="/" component={Homepage} exact />
     <Route path="/chats" component={ChatPage} />
    </div>
  );
}

export default App;
