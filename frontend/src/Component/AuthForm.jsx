import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Snackbar, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import googleLogo from "../assets/google-logo.webp";
import axios from "axios";
import Or from "../CommonComponent/Or";
import FormError from "../CommonComponent/FormError";

export default function AuthForm({ formType }) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoadding, setIsLoadding] = useState(false);
  const [serverError, setServerError] = useState("");
  const navigate = useNavigate();
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
  }, []);

  async function sendData(e) {
    try {
      setIsLoadding(true);
      let url = formType === "login" ? "login" : "signup";
      let response = await axios.post(`http://localhost:5000/${url}`, {
        username,
        email,
        password,
      });
      if (response.data.message) {
        setMessage(response.data.message);
        setOpen(true);
      }
      if (response.data.message && response.data.token) {
        localStorage.setItem("token", response.data.token);
      }

      setIsLoadding(false);
      navigate("/");
    } catch (err) {
      setServerError(err.response.data.message);
      setIsLoadding(false);
    }
  }

  return (
    <div className="flex justify-center items-center  min-h-screen bg-purple-50 ">
      <div className="px-8 py-6 rounded-2xl w-105  bg-white text-center  mx-2 shadow-2xl ">
        <h2 className="text-black text-3xl font-semibold flex justify-center items-center gap-2 mb-4">
          {formType === "login" ? "🦚 Welcome back" : "🙏 Let's get started"}
        </h2>
        <button className=" w-full flex items-center mb-2 justify-center gap-1 bg-gray-200 text-black px-4 py-2.5 rounded-full font-medium hover:bg-gray-300  ">
          <img src={googleLogo} alt="Google Logo" className="w-8 h-8 " />
          {formType === "login" ? "Log in" : "Sign Up"} with Google
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
                  styles={"text - sm"}
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
                  styles={"text - sm"}
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
