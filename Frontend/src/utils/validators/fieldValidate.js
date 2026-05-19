import { usernameRegex, emailRegex } from "./regex.js";

export const validateFields = (name, value, formData) => {
  switch (name) {
    case "username":
      if (!value) return "Username is required";

      if (!usernameRegex.test(value))
        return "Username can only consist of lowercase letters, underscores & numbers";

      if (value.length < 3)
        return "Username length should be at least 3 characters";

      return "";
    case "email":
      if (!value) return "Email is required";

      if (!emailRegex.test(value)) return "Invalid email address";

      return "";

    case "password":
      if (!value) return "Password is required";

      if (value.length < 6)
        return "Password length should be at least 6 characters";

      return "";
    case "confirmPassword":
      if (!value) return "Confirm Password is required";

      if (value !== formData.password) return "Passwords do not match";

      return "";
    case "identifier":
      if (!value) return "Email or Username is required";

      return "";
    default:
      return "";
  }
};
