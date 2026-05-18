import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "username is required"],
      lowercase: true,
      trim: true,
      unique: [true, "username already exists"],
      minlength: [3, "username must be at least 3 characters long"],
    },
    email: {
      type: String,
      required: [true, "email is required"],
      lowercase: true,
      trim: true,
      unique: [true, "email already exists"],
    },
    password: {
      type: String,
      required: [true, "password is required"],
      minlength: [6, "password must be at least 6 characters long"],
    },
    bio: {
      type: String,
    },
    profileImage: {
      type: String,
      default: "https://ik.imagekit.io/sparkylynx/user-silhouette.jpg",
    },
  },
  { timestamps: true },
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

export const User = mongoose.model("User", userSchema);
