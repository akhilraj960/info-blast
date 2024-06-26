export interface Author {
    personal_info: {
      firstName: string,
      lastName: string
      profile_img: string
      username: string
    }
  }
  
  export interface Blog {
    blog_id: string
    title: string
    banner: string
    author: Author
    description: string
    tags: string[]
    publishedAt: string
  }