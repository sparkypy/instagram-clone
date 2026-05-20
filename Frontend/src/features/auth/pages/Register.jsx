import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { validateFields } from "../../../utils/validators/fieldValidate.js";
import {
  buttonStyles,
  inputStyles,
  labelStyles,
  errorStyles,
} from "../../../styles/classes.js";
import { Link } from "react-router";
import { useAuth } from "../../../context/AuthContext.jsx";

export const Register = () => {
  const { register } = useAuth();
  const { showToast } = useOutletContext();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    username: "",
    email: "",
    confirmPassword: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    const updatedFormData = {
      ...formData,
      [name]: value,
    };

    setFormData(updatedFormData);

    const error = validateFields(name, value, updatedFormData);

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: error,
    }));
  };

  const isFormValid =
    formData.username &&
    formData.email &&
    formData.password &&
    formData.confirmPassword &&
    !errors.username &&
    !errors.email &&
    !errors.password &&
    !errors.confirmPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      showToast({
        type: "error",
        heading: "Validation Error",
        message: "Passwords do not match",
      });
      return;
    }
    setLoading(true);
    try {
      await register({
        username: formData.username.trim().toLowerCase(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      });
      setFormData({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
      showToast({
        type: "success",
        heading: "Registration Successful",
        message: "Your account has been created successfully.",
      });
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
            value={formData.username}
            onChange={handleChange}
          />

          <p className={errorStyles}>{errors.username}</p>
        </div>

        {/* Email */}
        <div className="flex flex-col gap-2">
          <label className={labelStyles}>Email</label>

          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            className={inputStyles}
            value={formData.email}
            onChange={handleChange}
          />

          <p className={errorStyles}>{errors.email}</p>
        </div>

        {/* Password */}
        <div className="flex flex-col gap-2">
          <label className={labelStyles}>Password</label>

          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            className={inputStyles}
            value={formData.password}
            onChange={handleChange}
          />

          <p className={errorStyles}>{errors.password}</p>
        </div>

        {/* Confirm Password */}
        <div className="flex flex-col gap-2">
          <label className={labelStyles}>Confirm Password</label>

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm your password"
            className={inputStyles}
            value={formData.confirmPassword}
            onChange={handleChange}
          />

          <p className={errorStyles}>{errors.confirmPassword}</p>
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
