import React, { useState } from "react";
import axios from "axios";
import { useToast } from "@chakra-ui/react";
import { useHistory } from "react-router-dom";
import PropTypes from "prop-types";
import { ChatState } from "../../Context/ChatProvider";
import { FaMessage } from "react-icons/fa6";
import { HiOutlineMail, HiOutlineLockClosed, HiOutlineEye, HiOutlineEyeOff } from "react-icons/hi";

const LoginPage = ({ onSwitch }) => {
  const [showPass, setShowPass] = useState(false);
  const toast = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const { setUser } = ChatState();

  const submitHandler = async () => {
    setLoading(true);
    if (!email || !password) {
      toast({ title: "Please fill all fields", status: "warning", duration: 4000, isClosable: true, position: "top" });
      setLoading(false);
      return;
    }
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/user/login`,
        { email, password },
        { headers: { "Content-type": "application/json" } }
      );
      toast({ title: "Welcome back! 👋", status: "success", duration: 3000, isClosable: true, position: "top" });
      setUser(data);
      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      history.push("/chats");
    } catch (error) {
      toast({
        title: "Login failed",
        description: error.response?.data?.message || error.message,
        status: "error", duration: 5000, isClosable: true, position: "top",
      });
      setLoading(false);
    }
  };

  const fillGuest = () => {
    setEmail("guest@example.com");
    setPassword("123456");
  };

  return (
    <div className="h-screen w-full flex bg-[#0f1620]">
      {/* ── LEFT: Branding panel ── */}
      <div className="hidden lg:block w-[55%] h-full">
        <img
          src="/volodymyr-hryshchenko-V5vqWC9gyEU-unsplash.jpg"
          alt="auth visual"
          className="w-full h-full object-cover"
        />
      </div>

      {/* ── RIGHT: Login form ── */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center">
              <FaMessage size={14} color="white" />
            </div>
            <span className="text-gray-800 font-bold text-lg">Divine Chat</span>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-extrabold text-gray-900">Welcome back</h2>
            <p className="text-gray-500 mt-1.5 text-sm">
              Don't have an account?{" "}
              <button onClick={onSwitch} className="text-blue-600 font-semibold hover:underline">
                Sign up for free
              </button>
            </p>
          </div>

          <div className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email address</label>
              <div className="relative">
                <HiOutlineMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && submitHandler()}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-3 text-sm border border-gray-200 rounded-xl bg-gray-50 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between mb-1.5">
                <label className="text-sm font-medium text-gray-700">Password</label>
                <a href="#" className="text-xs text-blue-600 font-medium hover:underline">Forgot password?</a>
              </div>
              <div className="relative">
                <HiOutlineLockClosed className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && submitHandler()}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-12 py-3 text-sm border border-gray-200 rounded-xl bg-gray-50 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPass ? <HiOutlineEye size={18} /> : <HiOutlineEyeOff size={18} />}
                </button>
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="mt-6 space-y-3">
            <button
              onClick={submitHandler}
              disabled={loading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-60 text-white text-sm font-semibold rounded-xl transition-all shadow-sm shadow-blue-200 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Signing in…
                </>
              ) : "Sign in"}
            </button>

            <button
              onClick={fillGuest}
              disabled={loading}
              className="w-full py-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-600 text-sm font-medium rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <span>👤</span> Use guest credentials
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-gray-100" />
            <span className="text-xs text-gray-400">or sign in with</span>
            <div className="flex-1 h-px bg-gray-100" />
          </div>

          {/* Social */}
          <div className="grid grid-cols-3 gap-3">
            {["Google", "Apple", "Facebook"].map((name) => (
              <button
                key={name}
                className="flex items-center justify-center gap-1.5 py-2.5 border border-gray-200 rounded-xl text-xs font-medium text-gray-600 hover:bg-gray-50 transition-all"
              >
                {name === "Google" && (
                  <svg width="16" height="16" viewBox="0 0 512 512"><path fill="#fbbd00" d="M120 256c0-25.367 6.989-49.13 19.131-69.477v-86.308H52.823C18.568 144.703 0 198.922 0 256s18.568 111.297 52.823 155.785h86.308v-86.308C126.989 305.13 120 281.367 120 256z"/><path fill="#0f9d58" d="m256 392-60 60 60 60c57.079 0 111.297-18.568 155.785-52.823v-86.216h-86.216C305.044 385.147 281.181 392 256 392z"/><path fill="#31aa52" d="m139.131 325.477-86.308 86.308a260.085 260.085 0 0 0 22.158 25.235C123.333 485.371 187.62 512 256 512V392c-49.624 0-93.117-26.72-116.869-66.523z"/><path fill="#3c79e6" d="M512 256a258.24 258.24 0 0 0-4.192-46.377l-2.251-12.299H256v120h121.452a135.385 135.385 0 0 1-51.884 55.638l86.216 86.216a260.085 260.085 0 0 0 25.235-22.158C485.371 388.667 512 324.38 512 256z"/><path fill="#cf2d48" d="m352.167 159.833 10.606 10.606 84.853-84.852-10.606-10.606C388.668 26.629 324.381 0 256 0l-60 60 60 60c36.326 0 70.479 14.146 96.167 39.833z"/><path fill="#eb4132" d="M256 120V0C187.62 0 123.333 26.629 74.98 74.98a259.849 259.849 0 0 0-22.158 25.235l86.308 86.308C162.883 146.72 206.376 120 256 120z"/></svg>
                )}
                {name === "Apple" && (
                  <svg width="14" height="14" fill="#000" viewBox="0 0 22.773 22.773"><path d="M15.769 0h.162c.13 1.606-.483 2.806-1.228 3.675-.731.863-1.732 1.7-3.351 1.573-.108-1.583.506-2.694 1.25-3.561C13.292.879 14.557.16 15.769 0zm4.901 16.716v.045c-.455 1.378-1.104 2.559-1.896 3.655-.723.995-1.609 2.334-3.191 2.334-1.367 0-2.275-.879-3.676-.903-1.482-.024-2.297.735-3.652.926h-.462c-.995-.144-1.798-.932-2.383-1.642-1.725-2.098-3.058-4.808-3.306-8.276v-1.019c.105-2.482 1.311-4.5 2.914-5.478.846-.52 2.009-.963 3.304-.765.555.086 1.122.276 1.619.464.471.181 1.06.502 1.618.485.378-.011.754-.208 1.135-.347 1.116-.403 2.21-.865 3.652-.648 1.733.262 2.963 1.032 3.723 2.22-1.466.933-2.625 2.339-2.427 4.74.176 2.181 1.444 3.457 3.028 4.209z"/></svg>
                )}
                {name === "Facebook" && (
                  <svg width="14" height="14" fill="#007bff" viewBox="0 0 167.657 167.657"><path d="M83.829.349C37.532.349 0 37.881 0 84.178c0 41.523 30.222 75.911 69.848 82.57v-65.081H49.626v-23.42h20.222V60.978c0-20.037 12.238-30.956 30.115-30.956 8.562 0 15.92.638 18.056.919v20.944l-12.399.006c-9.72 0-11.594 4.618-11.594 11.397v14.947h23.193l-3.025 23.42H94.026v65.653c41.476-5.048 73.631-40.312 73.631-83.154 0-46.273-37.532-83.805-83.828-83.805z"/></svg>
                )}
                {name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

LoginPage.propTypes = { onSwitch: PropTypes.func.isRequired };
export default LoginPage;
