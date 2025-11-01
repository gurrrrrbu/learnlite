import mongoose, { Schema, model, models } from "mongoose";

const PostSchema = new Schema({
  title: String,
  content: String,
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

export const Post = models.Post || model("Post", PostSchema);
