export interface IUser extends Document {
  clerkId:string
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
