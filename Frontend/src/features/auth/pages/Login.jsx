import { useState } from "react";
import {
  buttonStyles,
  inputStyles,
  labelStyles,
  errorStyles,
} from "../../../styles/classes.js";

import { loginUser } from "../../../services/authService.js";
import { Link } from "react-router-dom";

export const Login = () => {
  const [username, setUsername] = useState("");
  const [usernameError, setUsernameError] = useState("");

  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const usernameRegex = /^[a-z0-9_]+$/;

  const isFormValid = username && password && !usernameError && !passwordError;

  const handleUsernameValidation = (e) => {
    const value = e.target.value;
    setUsername(value);

    if (!value) {
      setUsernameError("Username is required");
    } else if (!usernameRegex.test(value)) {
      setUsernameError(
        "Username can only consist of lowercase letters, underscores, & numbers",
      );
    } else if (value.length < 3) {
      setUsernameError("Username's length should be at least 3 characters");
    } else {
      setUsernameError("");
    }
  };

  const handlePasswordValidation = (e) => {
    const value = e.target.value;
    setPassword(value);
    if (!value) {
      setPasswordError("Password is required");
    } else if (value.length < 6) {
      setPasswordError("Password length's should be at least 6 characters");
    } else {
      setPasswordError("");
    }
  };

  return (
    <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-8 md:p-10 shadow-2xl backdrop-blur-xl">
      {/* Heading */}
      <div className="mb-8">
        <h1 className="bg-linear-to-r from-purple-300 to-fuchsia-500 bg-clip-text text-3xl sm:text-4xl font-extrabold text-transparent">
          Welcome Back!
        </h1>

        <p className="mt-3 text-sm text-zinc-400">
          Enter your credentials to continue.
        </p>
      </div>

      {/* Form */}
      <form
        className="flex flex-col gap-3 sm:gap-4 md:gap-5"
        autocomplete="off"
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

        {/* Button */}
        <button type="submit" className={buttonStyles} disabled={!isFormValid}>
          Sign In
        </button>
      </form>

      {/* Footer */}
      <p className="mt-8 text-center text-sm text-zinc-500">
        Don&apos;t have an account?{" "}
        <span className="cursor-pointer text-purple-400 hover:text-purple-300">
          <Link to="/register">Register</Link>
        </span>
      </p>
    </div>
  );
};
