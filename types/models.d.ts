import mongoose, { Schema } from "mongoose";

export interface IUser extends Document {
  clerkId: string;
  personal_info: {
    firstName: string;
    lastName: string;
    email: string;
    password?: string;
    username: string;
    bio?: string;
    profile_img?: string;
  };
  social_links: {
    youtube?: string;
    instagram?: string;
    facebook?: string;
    twitter?: string;
    github?: string;
    website?: string;
  };
  account_info: {
    total_posts: number;
    total_reads: number;
  };
  google_auth: boolean;
  blogs: mongoose.Types.ObjectId[];
  joinedAt?: Date;
}

export interface IBlog extends Document {
  _id?: string;
  blog_id: string;
  title: string;
  banner: string;
  description: string;
  content: any[];
  tags: string[];
  author: mongoose.Types.ObjectId;
  activity: {
    total_likes: number;
    total_comments: number;
    total_reads: number;
    total_parent_comments: number;
  };
  comments: mongoose.Types.ObjectId[];
  draft: boolean;
  publishedAt: Date;
}

export interface ILike extends Document {
  blogId: mongoose.Types.ObjectId;
  likes: mongoose.Types.ObjectId;
}
