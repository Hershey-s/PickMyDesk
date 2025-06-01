import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Snackbar, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

import googleLogo from "../assets/google-logo.webp";
import axios from "axios";
import Or from "../CommonComponent/Or";
import FormError from "../CommonComponent/FormError";
// import useGoogleAuth from "../hooks/useGoogleAuth";

export default function AuthForm({ formType }) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user"); // Default to user
  const [isLoadding, setIsLoadding] = useState(false);
  const [serverError, setServerError] = useState("");
  const navigate = useNavigate();
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false);
  const { login } = useUser();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/");
    }

    // Check if Google is loaded
    const checkGoogleLoaded = () => {
      if (window.google && window.google.accounts) {
        setIsGoogleLoaded(true);
      } else {
        setTimeout(checkGoogleLoaded, 100);
      }
    };
    checkGoogleLoaded();
  }, []);

  async function sendData(e) {
    try {
      setIsLoadding(true);
      setServerError(""); // Clear previous errors
      const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5004";
      let url = formType === "login" ? "login" : "signup";

      console.log("Environment VITE_API_URL:", import.meta.env.VITE_API_URL);
      console.log("Using baseURL:", baseURL);
      console.log("Sending request to:", `${baseURL}/${url}`);
      console.log("Data:", { username, email, password: "***", role });

      let requestData = {
        username,
        email,
        password,
      };

      // Add role only for signup
      if (formType === "signup") {
        requestData.role = role;
      }

      let response = await axios.post(`${baseURL}/${url}`, requestData);

      console.log("Response:", response.data);

      if (response.data.message) {
        setMessage(response.data.message);
        setOpen(true);
      }
      if (response.data.token) {
        // Use the login function from UserContext
        login(response.data.token, response.data.user);
        console.log("User logged in successfully");
        setTimeout(() => {
          navigate("/");
        }, 1000); // Small delay to show success message
      }

      setIsLoadding(false);
    } catch (err) {
      console.error("Auth error:", err);
      setServerError(err.response?.data?.message || "An error occurred");
      setIsLoadding(false);
    }
  }

  const handleGoogleSignIn = () => {
    console.log("Google sign-in button clicked");

    // Check if Google is loaded
    if (!window.google) {
      setServerError("Google services not loaded. Please refresh the page.");
      return;
    }

    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    console.log("Client ID:", clientId);

    if (!clientId || clientId === "your_google_client_id_here") {
      setServerError("Google Client ID not configured properly.");
      return;
    }

    try {
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: async (response) => {
          console.log("Google response:", response);
          try {
            const baseURL =
              import.meta.env.VITE_API_URL || "http://localhost:5004";
            const result = await axios.post(`${baseURL}/auth/google`, {
              token: response.credential,
            });

            console.log("Backend response:", result.data);

            if (result.data.token) {
              localStorage.setItem("token", result.data.token);
              setMessage(result.data.message);
              setOpen(true);
              setTimeout(() => {
                navigate("/");
              }, 1000);
            }
          } catch (error) {
            console.error("Google auth error:", error);
            setServerError(
              error.response?.data?.message || "Google authentication failed"
            );
          }
        },
        auto_select: false,
        cancel_on_tap_outside: true,
        use_fedcm_for_prompt: false,
      });

      // Try using renderButton instead of prompt for better compatibility
      const buttonDiv = document.createElement("div");
      buttonDiv.id = "google-signin-button-temp";
      document.body.appendChild(buttonDiv);

      window.google.accounts.id.renderButton(buttonDiv, {
        theme: "outline",
        size: "large",
        text: "signin_with",
        width: 300,
      });

      // Trigger click on the rendered button
      setTimeout(() => {
        const googleButton = buttonDiv.querySelector('div[role="button"]');
        if (googleButton) {
          googleButton.click();
        }
        document.body.removeChild(buttonDiv);
      }, 100);
    } catch (error) {
      console.error("Error initializing Google Sign-In:", error);
      setServerError("Failed to initialize Google Sign-In: " + error.message);
    }
  };

  return (
    <div className="flex justify-center items-center  min-h-screen bg-purple-50 ">
      <div className="px-8 py-6 rounded-2xl w-105  bg-white text-center  mx-2 shadow-2xl ">
        <h2 className="text-black text-3xl font-semibold flex justify-center items-center gap-2 mb-4">
          {formType === "login" ? "🦚 Welcome back" : "🙏 Let's get started"}
        </h2>
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={!isGoogleLoaded}
          className={`w-full flex items-center mb-2 justify-center gap-1 px-4 py-2.5 rounded-full font-medium transition-colors ${
            isGoogleLoaded
              ? "bg-gray-200 text-black hover:bg-gray-300 cursor-pointer"
              : "bg-gray-100 text-gray-400 cursor-not-allowed"
          }`}
          title={
            !isGoogleLoaded
              ? "Loading Google services..."
              : "Sign in with Google"
          }
        >
          <img
            src={googleLogo}
            alt="Google Logo"
            className={`w-8 h-8 ${!isGoogleLoaded ? "opacity-50" : ""}`}
          />
          {formType === "login" ? "Log in" : "Sign Up"} with Google
          {!isGoogleLoaded && " (Loading...)"}
        </button>
        <Or />
        <form onSubmit={handleSubmit(sendData)}>
          <div className="space-y-4  text-start">
            {formType === "signup" && (
              <div>
                <label htmlFor="username" className="mb-1 font-medium">
                  Username *
                </label>
                <input
                  type="text"
                  {...register("username", {
                    required: "Please enter a username",
                    minLength: {
                      value: 3,
                      message: "Username must be at least 3 characters",
                    },
                    maxLength: {
                      value: 40,
                      message: "Username must be at most 40 characters", // Fixed message
                    },
                  })}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Eg: Username"
                  className={`border border-gray-400 focus:outline-none w-full px-4 py-3 rounded-full bg-white/80 text-black
                              transition-colors duration-300 ${
                                errors.username
                                  ? "border-red-500"
                                  : "hover:border-black focus:border-purple-800"
                              }`}
                />
                {errors.username && (
                  <FormError
                    styles="text-sm" // Corrected class to `text-sm`
                    errorsMessage={errors.username.message}
                  />
                )}
              </div>
            )}

            {formType === "signup" && (
              <div>
                <label htmlFor="role" className="mb-1 font-medium">
                  Account Type *
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="border border-gray-400 focus:outline-none w-full px-4 py-3 rounded-full bg-white/80 text-black
                            transition-colors duration-300 hover:border-black focus:border-purple-800"
                >
                  <option value="user">User (Book Workspaces)</option>
                  <option value="admin">
                    Admin (Create & Manage Workspaces)
                  </option>
                </select>
                <p className="text-sm mt-1 text-gray-600">
                  {role === "user"
                    ? "Choose this to book and use workspaces"
                    : "Choose this to create and manage workspace listings"}
                </p>
              </div>
            )}

            <div>
              <label htmlFor="email" className="mb-1  font-medium">
                Email *
              </label>
              <input
                type="email"
                {...register("email", {
                  required: "Please use a valid email address",
                  maxLength: {
                    value: 40,
                    message: "Email must be at most 40 characters",
                  },
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Invalid email address",
                  },
                })}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@gmail.com"
                className={`border border-gray-400  focus:outline-none w-full px-4  py-3 rounded-full bg-white/80 text-black
                  transition-colors duration-300    ${
                    errors.email
                      ? "border-red-500"
                      : "hover:border-black focus:border-purple-800 "
                  }`}
              />
              {errors.email && (
                <FormError
                  styles={"text-sm"}
                  errorsMessage={errors.email.message}
                />
              )}
            </div>
            <div>
              <label htmlFor="password" className="mb-1 font-medium">
                Password *
              </label>
              <input
                type="password"
                value={password}
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters",
                  },
                  maxLength: {
                    value: 20,
                    message: "Password must be at most 20 characters",
                  },
                })}
                onChange={(e) => setPassword(e.target.value)}
                className={`border border-gray-400  focus:outline-none  w-full px-4 py-3 rounded-full bg-white/80 text-black
                  transition-colors duration-300  ${
                    errors.password
                      ? "border-red-500"
                      : "hover:border-black focus:border-purple-800"
                  }`}
              />
              {errors.password && (
                <FormError
                  styles={"text-sm"}
                  errorsMessage={errors.password.message}
                />
              )}
              <p className="text-sm mt-2 text-gray-800">
                At least 8 characters
              </p>
            </div>
          </div>
          <button
            disabled={isLoadding}
            type="submit"
            className="mt-4 w-full  text-white py-3 rounded-full  font-semibold hover:bg-purple-900 mb-2  bg-purple-800"
            style={isLoadding ? { background: "black" } : {}}
          >
            {formType === "login"
              ? isLoadding
                ? "Logging in..."
                : "Log in"
              : isLoadding
              ? "Signing up..."
              : "Sign up"}
          </button>
          <FormError styles={"text-md"} errorsMessage={serverError} />
        </form>
        <Or />

        <p className="text-black-400 text-md">
          {formType === "login"
            ? "Don't have an account? "
            : "Already have an account?"}

          <Link
            to={formType === "login" ? "/signup" : "/login"}
            className="ml-1 text-purple-800 hover:text-purple-900 font-semibold"
          >
            {formType === "login" ? "Sign up" : "Log in"}
          </Link>
        </p>
      </div>
      <div>
        <Snackbar
          open={open}
          autoHideDuration={3000}
          message={message}
          onClose={() => setOpen(false)}
          action={
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={() => setOpen(false)}
            >
              <CloseIcon />
            </IconButton>
          }
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
          ContentProps={{
            sx: {
              backgroundColor: "#e8f5e9", // Light green background
              color: "green", // Green text
              fontWeight: "bold", // Bold text
            },
          }}
        />
      </div>
    </div>
  );
}
