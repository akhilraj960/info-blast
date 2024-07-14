import mongoose, { Model, Schema } from "mongoose";
import { ILike } from "@/types/models";

const likeSchema: Schema = new Schema({
  blogId: {
    type: mongoose.Types.ObjectId,
    ref: "Blog",
    required: true,
  },
  likes: [
    {
      userId: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true,
      },
    },
  ],
});

const Like: Model<ILike> =
  mongoose.models.Like || mongoose.model<ILike>("Like", likeSchema);

export default Like;
