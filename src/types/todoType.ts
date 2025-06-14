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
    created_at: Date;
    updated_at: Date;
  };

  