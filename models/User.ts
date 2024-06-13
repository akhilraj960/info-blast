import { IUser } from "@/types/models";
import mongoose, { Document, Schema, Model } from "mongoose";

let profile_imgs_name_list: string[] = [
  "Garfield",
  "Tinkerbell",
  "Annie",
  "Loki",
  "Cleo",
  "Angel",
  "Bob",
  "Mia",
  "Coco",
  "Gracie",
  "Bear",
  "Bella",
  "Abby",
  "Harley",
  "Cali",
  "Leo",
  "Luna",
  "Jack",
  "Felix",
  "Kiki",
];

let profile_imgs_collections_list: string[] = [
  "notionists-neutral",
  "adventurer-neutral",
  "fun-emoji",
];

const userSchema: Schema = new Schema(
  {
    personal_info: {
      firstName: {
        type: String,
        required: true,
      },
      lastName: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
      },
      password: {
        type: String,
      },
      username: {
        type: String,
        minlength: [3, "Username must be 3 letters long"],
        unique: true,
      },
      bio: {
        type: String,
        maxlength: [200, "Bio should not be more than 200"],
        default: "",
      },
      profile_img: {
        type: String,
        // default: () => {
        //   return `https://api.dicebear.com/6.x/${
        //     profile_imgs_collections_list[
        //       Math.floor(Math.random() * profile_imgs_collections_list.length)
        //     ]
        //   }/svg?seed=${
        //     profile_imgs_name_list[
        //       Math.floor(Math.random() * profile_imgs_name_list.length)
        //     ]
        //   }`;
        // },
      },
    },
    social_links: {
      youtube: {
        type: String,
        default: "",
      },
      instagram: {
        type: String,
        default: "",
      },
      facebook: {
        type: String,
        default: "",
      },
      twitter: {
        type: String,
        default: "",
      },
      github: {
        type: String,
        default: "",
      },
      website: {
        type: String,
        default: "",
      },
    },
    account_info: {
      total_posts: {
        type: Number,
        default: 0,
      },
      total_reads: {
        type: Number,
        default: 0,
      },
    },
    google_auth: {
      type: Boolean,
      default: false,
    },
    blogs: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Blog",
      default: [],
    },
  },
  {
    timestamps: {
      createdAt: "joinedAt",
    },
  }
);

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", userSchema);
export default User;
