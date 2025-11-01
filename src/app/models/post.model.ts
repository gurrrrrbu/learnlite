import { Schema, models, model, Types } from "mongoose";

const PostSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    body: { type: String, required: true },
    owner: { type: Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export const Post = models.Post || model("Post", PostSchema);
