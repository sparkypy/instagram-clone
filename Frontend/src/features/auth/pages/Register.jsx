import { useState } from "react";
import { registerUser } from "../../../services/authService.js";
import { useOutletContext } from "react-router";

import {
  buttonStyles,
  inputStyles,
  labelStyles,
  errorStyles,
} from "../../../styles/classes.js";
import { Link } from "react-router";

export const Register = () => {
  const [username, setUsername] = useState("");
  const [usernameError, setUsernameError] = useState("");

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const [loading, setLoading] = useState(false);

  const usernameRegex = /^[a-z0-9_]+$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const { showToast } = useOutletContext();

  const handleUsernameValidation = (e) => {
    const value = e.target.value;

    setUsername(value);

    if (!value) {
      setUsernameError("Username is required");
    } else if (!usernameRegex.test(value)) {
      setUsernameError(
        "Username can only consist of lowercase letters, underscores & numbers",
      );
    } else if (value.length < 3) {
      setUsernameError("Username length should be at least 3 characters");
    } else {
      setUsernameError("");
    }
  };

  const handleEmailValidation = (e) => {
    const value = e.target.value;

    setEmail(value);

    if (!value) {
      setEmailError("Email is required");
    } else if (!emailRegex.test(value)) {
      setEmailError("Invalid email address");
    } else {
      setEmailError("");
    }
  };

  const handlePasswordValidation = (e) => {
    const value = e.target.value;

    setPassword(value);

    if (!value) {
      setPasswordError("Password is required");
    } else if (value.length < 6) {
      setPasswordError("Password length should be at least 6 characters");
    } else {
      setPasswordError("");
    }

    if (confirmPassword && value !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
    } else {
      setConfirmPasswordError("");
    }
  };

  const handleConfirmPasswordValidation = (e) => {
    const value = e.target.value;

    setConfirmPassword(value);

    if (!value) {
      setConfirmPasswordError("Please confirm your password");
    } else if (value !== password) {
      setConfirmPasswordError("Passwords do not match");
    } else {
      setConfirmPasswordError("");
    }
  };

  const isFormValid =
    username &&
    email &&
    password &&
    confirmPassword &&
    !usernameError &&
    !emailError &&
    !passwordError &&
    !confirmPasswordError;

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    try {
      const data = await registerUser({ username, email, password });
      setUsername("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      showToast({
        type: "success",
        heading: "Registration Successful",
        message: "Your account has been created successfully.",
      });
      console.log(data);
    } catch (error) {
      const message = error?.response?.data?.message || "Something went wrong";
      showToast({
        type: "error",
        heading: "Registration Failed",
        message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-8 md:p-10 shadow-2xl backdrop-blur-xl">
      {/* Heading */}
      <div className="mb-8">
        <h1 className="bg-linear-to-r from-purple-300 to-fuchsia-500 bg-clip-text text-3xl sm:text-4xl font-extrabold text-transparent">
          Create Account
        </h1>

        <p className="mt-3 text-sm text-zinc-400">Register to get started.</p>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-1 sm:gap-2 md:gap-3"
        autoComplete="off"
      >
        {/* Username */}
        <div className="flex flex-col gap-2">
          <label className={labelStyles}>Username</label>

          <input
            type="text"
            name="username"
            placeholder="Enter your username"
            className={inputStyles}
            value={username}
            onChange={handleUsernameValidation}
          />

          <p className={errorStyles}>{usernameError}</p>
        </div>

        {/* Email */}
        <div className="flex flex-col gap-2">
          <label className={labelStyles}>Email</label>

          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            className={inputStyles}
            value={email}
            onChange={handleEmailValidation}
          />

          <p className={errorStyles}>{emailError}</p>
        </div>

        {/* Password */}
        <div className="flex flex-col gap-2">
          <label className={labelStyles}>Password</label>

          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            className={inputStyles}
            value={password}
            onChange={handlePasswordValidation}
          />

          <p className={errorStyles}>{passwordError}</p>
        </div>

        {/* Confirm Password */}
        <div className="flex flex-col gap-2">
          <label className={labelStyles}>Confirm Password</label>

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm your password"
            className={inputStyles}
            value={confirmPassword}
            onChange={handleConfirmPasswordValidation}
          />

          <p className={errorStyles}>{confirmPasswordError}</p>
        </div>

        {/* Button */}
        <button
          type="submit"
          className={buttonStyles}
          disabled={!isFormValid || loading}
        >
          {loading ? "Creating Account..." : "Create Account"}
        </button>
      </form>

      {/* Footer */}
      <p className="mt-8 text-center text-sm text-zinc-500">
        Already have an account?{" "}
        <span className="cursor-pointer text-purple-400 hover:text-purple-300">
          <Link to="/login">Login</Link>
        </span>
      </p>
    </div>
  );
};
