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
  blog_id: string;
  title: string;
  banner: string;
  description: string;
  content: any[];
  tags: string[];
  author: string;
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
