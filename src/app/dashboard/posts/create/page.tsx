"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreatePostPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("Tech");

  const categories = ["Tech", "Lifestyle", "Work", "Personal"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement post creation
    router.push("/posts");
  };

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='max-w-2xl mx-auto'>
        <h1 className='text-3xl font-bold mb-8'>Create New Post</h1>

        <form onSubmit={handleSubmit} className='space-y-6'>
          <div>
            <label htmlFor='title' className='block text-sm font-medium mb-2'>
              Title
            </label>
            <input
              type='text'
              id='title'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className='w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent'
              required
            />
          </div>

          <div>
            <label
              htmlFor='category'
              className='block text-sm font-medium mb-2'
            >
              Category
            </label>
            <select
              id='category'
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className='w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent'
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor='content' className='block text-sm font-medium mb-2'>
              Content
            </label>
            <textarea
              id='content'
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={10}
              className='w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent'
              required
            />
          </div>

          <div className='flex gap-4'>
            <button
              type='submit'
              className='bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition'
            >
              Publish Post
            </button>
            <button
              type='button'
              onClick={() => router.back()}
              className='bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300 transition'
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
