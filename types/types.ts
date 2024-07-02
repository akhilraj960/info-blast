export interface Author {
  personal_info: {
    firstName: string;
    lastName: string;
    profile_img: string;
    username: string;
  };
}

export interface Activity {
  activity: { total_likes: number; total_comments: number };
}

export interface Blog {
  blog_id: string;
  title: string;
  banner: string;
  author: Author;
  description: string;
  tags: string[];
  publishedAt: string;
  content: any;
  activity?: any;
}
