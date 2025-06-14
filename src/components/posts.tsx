"use client";
import { FC, useState } from "react";
import type { Post as PostType } from "@/types/todoType"; // Renamed type import
import Post from "./post"; // Component import stays the same
import AddPost from "./add-post";
import { addPost, deletePost, updatePost } from "@/actions/posts";

interface Props {
  initialPosts: PostType[]; // Using the renamed type
}

const Posts: FC<Props> = ({ initialPosts }) => {
  const [posts, setPosts] = useState<PostType[]>(initialPosts); // Using renamed type

  const createPost = async (title: string, content: string, categoryId: number | null) => {
    const newPost = await addPost(title, content, categoryId);
    setPosts(prev => [...prev, newPost]);
  };

  const changePost = async (id: number, title: string, content: string, categoryId: number | null) => {
    await updatePost(id, title, content, categoryId);
    setPosts(prev =>
      prev.map(post =>
        post.id === id ? { ...post, title, content, category_id: categoryId } : post
      )
    );
  };

  const deletePostItem = async (id: number) => {
    await deletePost(id);
    setPosts(prev => prev.filter(post => post.id !== id));
  };

  return (
    <main className="max-w-2xl mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8">My Blog Posts</h1>
      
      <div className="space-y-4 mb-8">
        {posts.map(post => (
          <Post
            key={post.id}
            post={post}
            changePost={changePost}
            deletePost={deletePostItem}
          />
        ))}
      </div>

      <AddPost createPost={createPost} />
    </main>
  );
};

export default Posts;