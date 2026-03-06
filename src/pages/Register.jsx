import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import toast from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";
import { auth } from "../firebase/firebase.config";
import axios from "axios";

export default function Signup() {
  const [error, setError] = useState("");
  const navigate = useNavigate();
  // const [ setPassword, showPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const googleProvider = new GoogleAuthProvider();

  const handleSignup = async (e) => {
    e.preventDefault();
    const name = e.target.name.value.trim();
    const photoURL = e.target.photo.value.trim();
    const email = e.target.email.value.trim();
    // Use the state password, not a new local variable
    const userPassword = password;

    // Password validation
    if (
      !/[A-Z]/.test(userPassword) ||
      !/[a-z]/.test(userPassword) ||
      !/[0-9]/.test(userPassword) ||
      userPassword.length < 6
    ) {
      setError(
        "Password must contain uppercase, lowercase, number and be at least 6 characters long.",
      );
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        userPassword,
      );

      // Only update profile if name or photoURL exist
      if (name || photoURL) {
        await updateProfile(userCredential.user, {
          displayName: name,
          photoURL,
        });

        // 🔥 Save user to MongoDB
        const userInfo = {
          name,
          email,
          photoURL,
          role: "user",
          status: "active",
        };
        //https://local-chef-bazaar-server-wine.vercel.app
        await axios.post(
          "https://local-chef-bazaar-server-wine.vercel.app/api/users",
          userInfo,
        );
      }

      toast.success("Signup successful! Welcome aboard 💫");

      // Redirect to the page the user originally tried to access
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);

      // 🔥 ADD THIS: Save Google user to MongoDB
      const userInfo = {
        name: result.user.displayName,
        email: result.user.email,
        photoURL: result.user.photoURL,
        role: "user",
        status: "active",
      };

      await axios.post(
        "https://local-chef-bazaar-server-wine.vercel.app/api/users",
        userInfo,
      );

      toast.success("Signed in with Google!");
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen  px-4 ">
  <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-xl border border-primary">

    <h2 className="text-3xl font-bold text-center mb-2 text-primary">
      Create an Account
    </h2>
    <p className="text-center text-sm text-gray-500 mb-6">
      Join us and start your journey today
    </p>

    <form onSubmit={handleSignup} className="space-y-4">

      {/* Full Name */}
      <input
        type="text"
        name="name"
        placeholder="Full Name"
        required
        className="w-full border border-gray-300 rounded-lg px-4 py-2.5
        text-gray-800 placeholder-gray-400
        focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary
        transition duration-200"
      />

      {/* Photo URL */}
      <input
        type="text"
        name="photo"
        placeholder="Photo URL"
        required
        className="w-full border border-gray-300 rounded-lg px-4 py-2.5
        text-gray-800 placeholder-gray-400
        focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary
        transition duration-200"
      />

      {/* Email */}
      <input
        type="email"
        name="email"
        placeholder="Email"
        required
        className="w-full border border-gray-300 rounded-lg px-4 py-2.5
        text-gray-800 placeholder-gray-400
        focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary
        transition duration-200"
      />

      {/* Password */}
      <div className="relative">
        <input
          required
          type={showPass ? "text" : "password"}
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 pr-16
          text-gray-800 placeholder-gray-400
          focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary
          transition duration-200"
        />
        <button
          type="button"
          onClick={() => setShowPass((v) => !v)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-primary hover:text-primary transition"
        >
          {showPass ? "Hide" : "Show"}
        </button>
      </div>

      {error && (
        <p className="text-red-500 text-sm font-medium">{error}</p>
      )}

      {/* Register Button */}
      <button
        type="submit"
        className="w-full bg-primary hover:bg-orange-600
        text-white font-semibold
        py-2.5 rounded-lg
        shadow-md hover:shadow-lg
        transition duration-200"
      >
        Register
      </button>
    </form>

    {/* Divider */}
    <div className="flex items-center my-6">
      <div className="flex-1 border-t border-gray-200"></div>
      <span className="px-3 text-sm text-gray-400">OR</span>
      <div className="flex-1 border-t border-gray-200"></div>
    </div>

    {/* Google Button */}
    <button
      onClick={handleGoogleSignup}
      className="w-full flex items-center justify-center gap-3
      border border-gray-300 bg-white text-gray-700
      px-4 py-2.5 rounded-lg text-sm font-medium
      shadow-sm hover:bg-gray-50 hover:shadow-md
      transition duration-200"
    >
      <FcGoogle className="text-xl" />
      <span>Continue with Google</span>
    </button>

    <p className="mt-6 text-center text-sm text-gray-600">
      Already have an account?{" "}
      <Link
        to="/login"
        className="font-medium text-primary hover:text-orange-600 hover:underline transition"
      >
        Login
      </Link>
    </p>

  </div>
</div>
  );
}
