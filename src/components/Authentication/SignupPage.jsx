import { useToast } from "@chakra-ui/toast";
import axios from "axios";
import { useState } from "react";
import { useHistory } from "react-router";
import { FaMessage } from "react-icons/fa6";
import {
  HiOutlineUser, HiOutlineMail, HiOutlineLockClosed,
  HiOutlineEye, HiOutlineEyeOff, HiOutlinePhotograph,
} from "react-icons/hi";

const SignupPage = ({ onSwitch }) => {
  const [showPass, setShowPass] = useState(false);
  const toast = useToast();
  const history = useHistory();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [confirmpassword, setConfirmpassword] = useState("");
  const [password, setPassword] = useState("");
  const [pic, setPic] = useState();
  const [picLoading, setPicLoading] = useState(false);
  const [picPreview, setPicPreview] = useState(null);

  const submitHandler = async () => {
    setPicLoading(true);
    if (!name || !email || !password || !confirmpassword) {
      toast({ title: "Please fill all fields", status: "warning", duration: 4000, isClosable: true, position: "top" });
      setPicLoading(false);
      return;
    }
    if (password !== confirmpassword) {
      toast({ title: "Passwords do not match", status: "warning", duration: 4000, isClosable: true, position: "top" });
      setPicLoading(false);
      return;
    }
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/user`,
        { name, email, password, pic },
        { headers: { "Content-type": "application/json" } }
      );
      toast({ title: "Account created! 🎉", status: "success", duration: 3000, isClosable: true, position: "top" });
      localStorage.setItem("userInfo", JSON.stringify(data));
      setPicLoading(false);
      history.push("/chats");
    } catch (error) {
      toast({
        title: "Registration failed",
        description: error.response?.data?.message || error.message,
        status: "error", duration: 5000, isClosable: true, position: "top",
      });
      setPicLoading(false);
    }
  };

  const postDetails = (pics) => {
    if (!pics) return;
    // Show local preview immediately
    setPicPreview(URL.createObjectURL(pics));

    if (pics.type !== "image/jpeg" && pics.type !== "image/png") {
      toast({ title: "Please select a JPEG or PNG image", status: "warning", duration: 4000, isClosable: true, position: "top" });
      return;
    }
    setPicLoading(true);
    const formData = new FormData();
    formData.append("file", pics);
    formData.append("upload_preset", "chat-app");
    formData.append("cloud_name", "dflgmfevw");
    fetch("https://api.cloudinary.com/v1_1/dflgmfevw/image/upload", { method: "post", body: formData })
      .then((res) => res.json())
      .then((data) => { setPic(data.url.toString()); setPicLoading(false); })
      .catch(() => { toast({ title: "Image upload failed", status: "error", duration: 4000, isClosable: true }); setPicLoading(false); });
  };

  // Password strength
  const strength = !password ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : 3;
  const strengthLabel = ["", "Weak", "Good", "Strong"][strength];
  const strengthColor = ["", "bg-red-400", "bg-yellow-400", "bg-green-400"][strength];

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

      {/* ── RIGHT: Signup form ── */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white overflow-y-auto">
        <div className="w-full max-w-md py-4">
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-2 mb-6">
            <img src="/favicon.ico" alt="logo" className="w-10 h-10" />
          </div>

          <div className="mb-6">
            <h2 className="text-3xl font-extrabold text-gray-900">Create account</h2>
            <p className="text-gray-500 mt-1.5 text-sm">
              Already have an account?{" "}
              <button onClick={onSwitch} className="text-blue-600 font-semibold hover:underline">Sign in</button>
            </p>
          </div>

          {/* Avatar picker */}
          <div className="flex items-center gap-4 mb-5">
            <div className="relative w-14 h-14 shrink-0">
              {picPreview ? (
                <img src={picPreview} alt="avatar" className="w-14 h-14 rounded-full object-cover ring-2 ring-blue-400 ring-offset-2" />
              ) : (
                <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center ring-2 ring-gray-200 ring-offset-2">
                  <HiOutlineUser size={22} className="text-gray-400" />
                </div>
              )}
              {picLoading && (
                <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center">
                  <svg className="w-5 h-5 text-white animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                </div>
              )}
            </div>
            <div>
              <label htmlFor="avatar-upload" className="cursor-pointer inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700">
                <HiOutlinePhotograph size={16} />
                {picPreview ? "Change photo" : "Upload photo"}
              </label>
              <input id="avatar-upload" type="file" accept="image/*" className="hidden" onChange={(e) => postDetails(e.target.files[0])} />
              <p className="text-xs text-gray-400 mt-0.5">JPEG or PNG, max 2MB</p>
            </div>
          </div>

          <div className="space-y-3.5">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Full name</label>
              <div className="relative">
                <HiOutlineUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={17} />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email address</label>
              <div className="relative">
                <HiOutlineMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={17} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <HiOutlineLockClosed className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={17} />
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password"
                  className="w-full pl-10 pr-12 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all"
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPass ? <HiOutlineEye size={17} /> : <HiOutlineEyeOff size={17} />}
                </button>
              </div>
              {/* Strength bar */}
              {password && (
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex-1 flex gap-1">
                    {[1, 2, 3].map((n) => (
                      <div key={n} className={`h-1 flex-1 rounded-full transition-all ${n <= strength ? strengthColor : "bg-gray-100"}`} />
                    ))}
                  </div>
                  <span className={`text-xs font-medium ${["", "text-red-500", "text-yellow-500", "text-green-500"][strength]}`}>{strengthLabel}</span>
                </div>
              )}
            </div>

            {/* Confirm password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm password</label>
              <div className="relative">
                <HiOutlineLockClosed className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={17} />
                <input
                  type={showPass ? "text" : "password"}
                  value={confirmpassword}
                  onChange={(e) => setConfirmpassword(e.target.value)}
                  placeholder="Confirm your password"
                  className={`w-full pl-10 pr-4 py-2.5 text-sm border rounded-xl bg-gray-50 outline-none focus:bg-white focus:ring-2 transition-all
                    ${confirmpassword && confirmpassword !== password
                      ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                      : "border-gray-200 focus:border-blue-500 focus:ring-blue-100"}`}
                />
                {confirmpassword && (
                  <span className={`absolute right-3.5 top-1/2 -translate-y-1/2 text-sm ${confirmpassword === password ? "text-green-500" : "text-red-400"}`}>
                    {confirmpassword === password ? "✓" : "✗"}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="mt-6">
            <button
              onClick={submitHandler}
              disabled={picLoading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-60 text-white text-sm font-semibold rounded-xl transition-all shadow-sm shadow-blue-200 flex items-center justify-center gap-2"
            >
              {picLoading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Creating account…
                </>
              ) : "Create account"}
            </button>
          </div>

          <p className="text-center text-xs text-gray-400 mt-4">
            By signing up you agree to our{" "}
            <a href="#" className="text-blue-500 hover:underline">Terms of Service</a>{" "}
            &amp;{" "}
            <a href="#" className="text-blue-500 hover:underline">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
