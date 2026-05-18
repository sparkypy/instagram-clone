import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    caption: {
      type: String,
      default: "",
      required: true,
    },
    img_url: {
      type: String,
      required: [true, "Image URL is missing"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is requried"],
    },
  },
  { timestamps: true },
);

export const Post = mongoose.model("Post", postSchema);
