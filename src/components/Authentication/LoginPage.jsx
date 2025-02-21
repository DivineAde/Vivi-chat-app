import React, { useState } from "react";
import axios from "axios";
import {
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputLeftElement,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useHistory } from "react-router-dom";
import PropTypes from "prop-types";
import { ChatState } from "../../Context/ChatProvider";
import { MdOutlineEmail } from "react-icons/md";
import { CiLock, CiMail } from "react-icons/ci";

const LoginPage = ({ onSwitch }) => {
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);
  const toast = useToast();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [loading, setLoading] = useState(false);

  const history = useHistory();
  const { setUser } = ChatState();

  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle login logic here
  };

  const submitHandler = async () => {
    setLoading(true);
    if (!email || !password) {
      toast({
        title: "Please Fill all the Fields",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const { data } = await axios.post(
        "/api/user/login",
        { email, password },
        config
      );

      toast({
        title: "Login Successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      setUser(data);
      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      history.push("/chats");
    } catch (error) {
      toast({
        title: "Error Occurred!",
        description: error.response?.data?.message || error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 text-[#333] md:h-screen">
      <div className="grid md:grid-cols-2 items-center gap-8 h-full">
        <div className="max-md:order-1 p-4">
          <img
            src="src/assets/Sign up-cuate.png"
            className="lg:max-w-[80%] w-full h-full object-contain block mx-auto"
            alt="login-image"
          />
        </div>
        <div className="flex items-center md:p-8 p-6 bg-white h-full">
          <form onSubmit={handleSubmit} className="max-w-lg w-full mx-auto">
            <div className="mb-12">
              <h3 className="text-4xl font-extrabold">Sign in</h3>
              <p className="whitespace-nowrap">
                Don't have an account?
                <button
                  onClick={onSwitch}
                  className="font-semibold underline ml-1"
                >
                  Register here.
                </button>
              </p>
            </div>

            <VStack spacing={"5px"}>
              <FormControl id="email" isRequired>
                <FormLabel>Email</FormLabel>
                <InputGroup borderColor="#E0E1E7">
                  <InputLeftElement
                    pointerEvents="none"
                    children={<CiMail size={22} color="gray.800" />}
                  />
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email"
                    name="email"
                    size="md"
                  />
                </InputGroup>
              </FormControl>

              <FormControl id="password" isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup borderColor="#E0E1E7">
                  <InputLeftElement
                    pointerEvents="none"
                    children={<CiLock size={22} color="gray.800" />}
                  />
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    name="password"
                    size="md"
                  />
                </InputGroup>
              </FormControl>
            </VStack>
            <div className="flex items-center justify-between gap-2 mt-5">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 shrink-0 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-3 block text-sm">
                  Remember me
                </label>
              </div>
              <div>
                <a
                  href="javascript:void(0);"
                  className="text-blue-600 font-semibold text-sm hover:underline"
                >
                  Forgot Password?
                </a>
              </div>
            </div>
            <div className="mt-12 space-y-2">
              <button
                onClick={submitHandler}
                disabled={loading}
                type="button"
                className="w-full shadow-xl py-2.5 px-4 text-sm font-semibold rounded-full text-white bg-[#333] hover:bg-[#222] focus:outline-none"
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>
              <button
                onClick={() => {
                  setEmail("guest@example.com");
                  setPassword("123456");
                }}
                disabled={loading}
                type="button"
                className="w-full shadow-xl py-2.5 px-4 text-sm font-semibold rounded-full text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
              >
                Get Guest User Credentials
              </button>
            </div>
            <p className="my-8 text-sm text-gray-400 text-center">
              or continue with
            </p>
            <div className="space-x-8 flex justify-center">
              <button type="button" className="border-none outline-none">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="30px"
                  className="inline"
                  viewBox="0 0 512 512"
                >
                  <path
                    fill="#fbbd00"
                    d="M120 256c0-25.367 6.989-49.13 19.131-69.477v-86.308H52.823C18.568 144.703 0 198.922 0 256s18.568 111.297 52.823 155.785h86.308v-86.308C126.989 305.13 120 281.367 120 256z"
                    data-original="#fbbd00"
                  />
                  <path
                    fill="#0f9d58"
                    d="m256 392-60 60 60 60c57.079 0 111.297-18.568 155.785-52.823v-86.216h-86.216C305.044 385.147 281.181 392 256 392z"
                    data-original="#0f9d58"
                  />
                  <path
                    fill="#31aa52"
                    d="m139.131 325.477-86.308 86.308a260.085 260.085 0 0 0 22.158 25.235C123.333 485.371 187.62 512 256 512V392c-49.624 0-93.117-26.72-116.869-66.523z"
                    data-original="#31aa52"
                  />
                  <path
                    fill="#3c79e6"
                    d="M512 256a258.24 258.24 0 0 0-4.192-46.377l-2.251-12.299H256v120h121.452a135.385 135.385 0 0 1-51.884 55.638l86.216 86.216a260.085 260.085 0 0 0 25.235-22.158C485.371 388.667 512 324.38 512 256z"
                    data-original="#3c79e6"
                  />
                  <path
                    fill="#cf2d48"
                    d="m352.167 159.833 10.606 10.606 84.853-84.852-10.606-10.606C388.668 26.629 324.381 0 256 0l-60 60 60 60c36.326 0 70.479 14.146 96.167 39.833z"
                    data-original="#cf2d48"
                  />
                  <path
                    fill="#eb4132"
                    d="M256 120V0C187.62 0 123.333 26.629 74.98 74.98a259.849 259.849 0 0 0-22.158 25.235l86.308 86.308C162.883 146.72 206.376 120 256 120z"
                    data-original="#eb4132"
                  />
                </svg>
              </button>
              <button type="button" className="border-none outline-none">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="30px"
                  fill="#000"
                  viewBox="0 0 22.773 22.773"
                >
                  <path
                    d="M15.769 0h.162c.13 1.606-.483 2.806-1.228 3.675-.731.863-1.732 1.7-3.351 1.573-.108-1.583.506-2.694 1.25-3.561C13.292.879 14.557.16 15.769 0zm4.901 16.716v.045c-.455 1.378-1.104 2.559-1.896 3.655-.723.995-1.609 2.334-3.191 2.334-1.367 0-2.275-.879-3.676-.903-1.482-.024-2.297.735-3.652.926h-.462c-.995-.144-1.798-.932-2.383-1.642-1.725-2.098-3.058-4.808-3.306-8.276v-1.019c.105-2.482 1.311-4.5 2.914-5.478.846-.52 2.009-.963 3.304-.765.555.086 1.122.276 1.619.464.471.181 1.06.502 1.618.485.378-.011.754-.208 1.135-.347 1.116-.403 2.21-.865 3.652-.648 1.733.262 2.963 1.032 3.723 2.22-1.466.933-2.625 2.339-2.427 4.74.176 2.181 1.444 3.457 3.028 4.209z"
                    data-original="#000000"
                  ></path>
                </svg>
              </button>
              <button type="button" className="border-none outline-none">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="30px"
                  fill="#007bff"
                  viewBox="0 0 167.657 167.657"
                >
                  <path
                    d="M83.829.349C37.532.349 0 37.881 0 84.178c0 41.523 30.222 75.911 69.848 82.57v-65.081H49.626v-23.42h20.222V60.978c0-20.037 12.238-30.956 30.115-30.956 8.562 0 15.92.638 18.056.919v20.944l-12.399.006c-9.72 0-11.594 4.618-11.594 11.397v14.947h23.193l-3.025 23.42H94.026v65.653c41.476-5.048 73.631-40.312 73.631-83.154 0-46.273-37.532-83.805-83.828-83.805z"
                    data-original="#010002"
                  ></path>
                </svg>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

LoginPage.propTypes = {
  onSwitch: PropTypes.func.isRequired,
};

export default LoginPage;
