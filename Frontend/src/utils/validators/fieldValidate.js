import { usernameRegex, emailRegex } from "./regex.js";

export const validateFields = (name, value, formData) => {

  switch (name) {
    case "username":
      if (!value) {
        return "Username is required";
      } else if (!usernameRegex.test(value)) {
        return "Username can only consist of lowercase letters, underscores & numbers";
      } else if (value.length < 3) {
        return "Username length should be at least 3 characters";
      } else {
        return "";
      }
    case "email":
      if (!value) {
        return "Email is required";
      } else if (!emailRegex.test(value)) {
        return "Invalid email address";
      } else {
        return "";
      }
    case "password":
      if (!value) {
        return "Password is required";
      } else if (value.length < 6) {
        return "Password length should be at least 6 characters";
      } else {
        return "";
      }
    case "confirmPassword":
      if (!value) {
        return "Confirm Password is required";
      } else if (value !== formData.password) {
        return "Passwords do not match";
      } else {
        return "";
      }
    default:
      return "";
  }
};
