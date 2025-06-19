export type todoType = {
    id: number;
    text: string;
    done: boolean;
  };
  
  export type Category = {
    id: number;
    name: string;
  };
  
  // Post type (with optional category relation)
  export type Post = {
    id: number;
    title: string;
    content: string;
    category_id: number | null;
    image_url?: string; // Make optional if not all posts will have images
    created_at: Date;
    updated_at: Date;
  };

  
  export type UserType = {
    id: number;
    username: string;
    email: string;
    password: string;
    is_admin: boolean;
    created_at: Date;
    updated_at: Date;
  };