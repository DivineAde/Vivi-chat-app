import { useToast } from "@chakra-ui/toast";
import axios from "axios";
import { useState } from "react";
import { useHistory } from "react-router";
import { FaEye, FaUser, FaEyeSlash, FaCloudUploadAlt } from "react-icons/fa";
import { IoMail } from "react-icons/io5";

const SignupPage = ({ onSwitch }) => {
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);
  const toast = useToast();
  const history = useHistory();

  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [confirmpassword, setConfirmpassword] = useState();
  const [password, setPassword] = useState();
  const [pic, setPic] = useState();
  const [picLoading, setPicLoading] = useState(false);

  const submitHandler = async () => {
    setPicLoading(true);
    if (!name || !email || !password || !confirmpassword) {
      toast({
        title: "Please Fill all the Feilds",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setPicLoading(false);
      return;
    }
    if (password !== confirmpassword) {
      toast({
        title: "Passwords Do Not Match",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    console.log(name, email, password, pic);
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const { data } = await axios.post(
        "/api/user",
        {
          name,
          email,
          password,
          pic,
        },
        config
      );
      console.log(data);
      toast({
        title: "Registration Successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      localStorage.setItem("userInfo", JSON.stringify(data));
      setPicLoading(false);
      history.push("/chats");
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setPicLoading(false);
    }
  };

  const postDetails = (pics) => {
    setPicLoading(true);
    if (pics === undefined) {
      toast({
        title: "Please Select an Image!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    console.log(pics);
    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "chat-app");
      data.append("cloud_name", "dflgmfevw");
      fetch("https://api.cloudinary.com/v1_1/dflgmfevw/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setPic(data.url.toString());
          console.log(data.url.toString());
          setPicLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setPicLoading(false);
        });
    } else {
      toast({
        title: "Please Select an Image!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setPicLoading(false);
      return;
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle signup logic here
  };

  return (
    <div className=" bg-white text-[#333] md:h-screen">
      <div className="grid md:grid-cols-2 items-center gap-8 h-full">
        <div className="max-md:order-1 p-4 bg-gray-900 h-full">
          <img
            src="src/assets/Sign up-cuate.png"
            className="lg:max-w-[90%] w-full h-full object-contain block mx-auto"
            alt="login-image"
          />
        </div>
        <div className="flex items-center p-6 h-full w-full">
          <form
            onSubmit={handleSubmit}
            className="md:col-span-2 w-full py-6 px-6 sm:px-16"
          >
            <div className="mb-6">
              <h3 className="text-3xl font-bold">Create an account</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm mb-2 block">Name</label>
                <div className="relative flex items-center">
                  <input
                    name="name"
                    type="text"
                    required
                    className="bg-white border border-gray-300 w-full text-sm px-4 py-2.5 rounded-md outline-blue-500"
                    placeholder="Enter Your Name"
                    onChange={(e) => setName(e.target.value)}
                  />
                  <FaUser color="#bbb" className="w-4 h-4 absolute right-4" />
                </div>
              </div>
              <div>
                <label className="text-sm mb-2 block">Email</label>
                <div className="relative flex items-center">
                  <input
                    name="email"
                    type="email"
                    required
                    className="bg-white border border-gray-300 w-full text-sm px-4 py-2.5 rounded-md outline-blue-500"
                    placeholder="Enter Your Email Address"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <IoMail color="#bbb" className="w-4 h-4 absolute right-4" />
                </div>
              </div>
              <div>
                <label className="text-sm mb-2 block">Password</label>
                <div className="relative flex items-center">
                  <input
                    name="password"
                    type={show ? "text" : "password"}
                    placeholder="Enter Password"
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-white border border-gray-300 w-full text-sm px-4 py-2.5 rounded-md outline-blue-500"
                  />
                  {show ? (
                    <FaEye
                      onClick={handleClick}
                      className="w-4 h-4 absolute right-4 cursor-pointer"
                    />
                  ) : (
                    <FaEyeSlash
                      onClick={handleClick}
                      className="w-4 h-4 absolute right-4 cursor-pointer"
                    />
                  )}
                </div>
              </div>

              {/* confirm password */}
              <div>
                <label className="text-sm mb-2 block">Confirm Password</label>
                <div className="relative flex items-center">
                  <input
                    name="password"
                    type={show ? "text" : "password"}
                    required
                    onChange={(e) => setConfirmpassword(e.target.value)}
                    className="bg-white border border-gray-300 w-full text-sm px-4 py-2.5 rounded-md outline-blue-500"
                    placeholder="Confirm password"
                  />
                  {show ? (
                    <FaEye
                      onClick={handleClick}
                      className="w-4 h-4 absolute right-4 cursor-pointer"
                    />
                  ) : (
                    <FaEyeSlash
                      onClick={handleClick}
                      className="w-4 h-4 absolute right-4 cursor-pointer"
                    />
                  )}
                </div>
              </div>

              {/* upload image */}
              <div>
                <label className="text-sm mb-2 block">Profile picture</label>
                <div className="relative flex items-center">
                  <input
                    name="image"
                    type="file"
                    accept="image/*"
                    onChange={(e) => postDetails(e.target.files[0])}
                    className="bg-white border border-gray-300 w-full text-sm px-4 py-2.5 rounded-md outline-blue-500"
                  />
                  <FaCloudUploadAlt
                    color="#bbb"
                    className="w-4 h-4 absolute right-4"
                  />
                </div>
              </div>
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 shrink-0 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label for="remember-me" className="ml-3 block text-sm">
                  I accept the{" "}
                  <a
                    href="javascript:void(0);"
                    className="text-blue-600 font-semibold hover:underline ml-1"
                  >
                    Terms and Conditions
                  </a>
                </label>
              </div>
            </div>
            <div className="!mt-10">
              <button
                type="button"
                onClick={submitHandler}
                isLoading={picLoading}
                className="w-full py-3 px-4 text-sm font-semibold rounded text-white bg-gray-700 hover:bg-gray-800 focus:outline-none"
              >
                Create an account
              </button>
            </div>
            <p className="text-sm mt-6 text-center">
              Already have an account?{" "}
              <button
                onClick={onSwitch}
                className="text-blue-600 font-semibold hover:underline ml-1"
              >
                Login here
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
