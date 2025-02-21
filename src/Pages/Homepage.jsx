import {
  Box,
  Container,
  Text,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import Login from "../components/Authentication/Login";
import Signup from "../components/Authentication/Signup";
import { useHistory } from "react-router-dom";
import LoginPage from "../components/Authentication/LoginPage";
import SignupPage from "../components/Authentication/SignupPage";

const Homepage = () => {
  const history = useHistory();
  const [activeComponent, setActiveComponent] = useState("login");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));

    if (user) history.push("/chats");
  }, [history]);

  const handleSwitch = (component) => {
    setActiveComponent(component);
  };
  
  return (
    <div className="">
      {activeComponent === "login" && (
        <LoginPage onSwitch={() => handleSwitch("signup")} />
      )}
      {activeComponent === "signup" && (
        <SignupPage onSwitch={() => handleSwitch("login")} />
      )}
    </div>
  );
};

export default Homepage;
