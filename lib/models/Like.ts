import mongoose, { Model, Schema } from "mongoose";
import { ILike } from "@/types/models";

const likeSchema: Schema = new Schema(
  {
    blog: {
      type: mongoose.Types.ObjectId,
      ref: "Blog",
      required: true,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Like: Model<ILike> =
  mongoose.models.Like || mongoose.model<ILike>("Like", likeSchema);

export default Like;
