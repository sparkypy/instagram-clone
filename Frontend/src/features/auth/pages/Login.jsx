import { useState } from "react";
import {
  buttonStyles,
  inputStyles,
  labelStyles,
  errorStyles,
} from "../../../styles/classes.js";
import { loginUser } from "../../../services/authService.js";
import { validateFields } from "../../../utils/validators/fieldValidate.js";
import { useOutletContext } from "react-router-dom";
import { Link } from "react-router-dom";


export const Login = () => {
  const { showToast } = useOutletContext();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    identifier: "",
    password: "",
  });

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
    formData.identifier &&
    formData.password &&
    !errors.identifier &&
    !errors.password;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await loginUser({
        identifier: formData.identifier.trim().toLowerCase(),
        password: formData.password,
      });
      setFormData({
        identifier: "",
        password: "",
      });
      showToast({
        type: "success",
        heading: "Login Successful",
        message: "You're now logged in.",
      });
      console.log(data);
    } catch (error) {
      const message = error?.response?.data?.message || "Something went wrong";
      showToast({
        type: "error",
        heading: "Login Failed",
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
          Welcome Back!
        </h1>

        <p className="mt-3 text-sm text-zinc-400">
          Enter your credentials to continue.
        </p>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-3 sm:gap-4 md:gap-5"
        autoComplete="off"
      >
        {/* Username */}
        <div className="flex flex-col gap-2">
          <label className={labelStyles}>Email or Username</label>

          <input
            type="text"
            name="identifier"
            placeholder="Enter your email or username"
            className={inputStyles}
            value={formData.identifier}
            onChange={handleChange}
          />

          <p className={errorStyles}>{errors.identifier}</p>
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

        {/* Button */}
        <button
          type="submit"
          className={buttonStyles}
          disabled={!isFormValid || loading}
        >
          {loading ? "Signing In..." : "Sign In"}
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
