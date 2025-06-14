"use client";

import { useState } from "react";
import Link from "next/link";

interface Post {
  id: string;
  title: string;
  content: string;
  category: string;
  createdAt: string;
}

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categories = ["Tech", "Lifestyle", "Work", "Personal"];

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='flex justify-between items-center mb-8'>
        <h1 className='text-3xl font-bold'>My Blog Posts</h1>
        <Link
          href='/posts/create'
          className='bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition'
        >
          Create New Post
        </Link>
      </div>

      {/* Category Filter */}
      <div className='mb-6'>
        <div className='flex gap-2'>
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-4 py-2 rounded-lg ${
              selectedCategory === "all"
                ? "bg-red-600 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg ${
                selectedCategory === category
                  ? "bg-red-600 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Posts Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {posts.length === 0 ? (
          <div className='col-span-full text-center py-12'>
            <p className='text-gray-500'>
              No posts yet. Create your first post!
            </p>
          </div>
        ) : (
          posts.map((post) => (
            <div
              key={post.id}
              className='bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition'
            >
              <h2 className='text-xl font-semibold mb-2'>{post.title}</h2>
              <p className='text-gray-600 mb-4 line-clamp-3'>{post.content}</p>
              <div className='flex justify-between items-center'>
                <span className='bg-gray-200 px-3 py-1 rounded-full text-sm'>
                  {post.category}
                </span>
                <div className='flex gap-2'>
                  <Link
                    href={`/posts/edit/${post.id}`}
                    className='text-blue-600 hover:text-blue-800'
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => {}}
                    className='text-red-600 hover:text-red-800'
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
