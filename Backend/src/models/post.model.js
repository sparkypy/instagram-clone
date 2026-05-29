import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: [500, "Post cannot exceed 500 characters"],
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    image: {
      type: String,
      default: "",
    },
  },
  { timestamps: true },
);

postSchema.index({ owner: 1, createdAt: -1 });

export const Post = mongoose.model("Post", postSchema);
