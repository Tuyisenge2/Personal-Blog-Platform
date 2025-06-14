"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAllCategories } from "@/actions/categories";
import { getPost, updatePost } from "@/actions/posts";
import { ClipLoader } from "react-spinners";

export default function EditPostPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [categories, setCategories] = useState<{ id: number; name: string }[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postData, categoriesData] = await Promise.all([
          getPost(Number(params.id)),
          getAllCategories(),
        ]);

        setTitle(postData.title);
        setContent(postData.content);
        setCategoryId(postData.category_id);
        setCategories(categoriesData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.id]);

  const handleUpdate = async () => {
    if (!title.trim() || !content.trim()) return;
    setSubmitting(true);
    try {
      await updatePost(Number(params.id), title, content, categoryId);
      router.push("/posts");
    } catch (error) {
      console.error("Failed to update post:", error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className='flex justify-center items-center min-h-[200px]'>
        <ClipLoader color='#3B82F6' size={40} />
      </div>
    );
  }

  return (
    <div className='flex justify-center p-4'>
      <div className='w-full max-w-2xl border border-gray-200 rounded-lg p-6 shadow-sm'>
        <h2 className='text-2xl font-bold mb-6 text-center'>Edit Post</h2>

        <div className='space-y-4'>
          <div>
            <label
              htmlFor='title'
              className='block text-sm font-medium text-gray-700 mb-1'
            >
              Title
            </label>
            <input
              id='title'
              type='text'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder='Post title'
              className='w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
            />
          </div>

          <div>
            <label
              htmlFor='content'
              className='block text-sm font-medium text-gray-700 mb-1'
            >
              Content
            </label>
            <textarea
              id='content'
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder='Post content'
              className='w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[150px]'
            />
          </div>

          <div>
            <label
              htmlFor='category'
              className='block text-sm font-medium text-gray-700 mb-1'
            >
              Category
            </label>
            <select
              id='category'
              value={categoryId || ""}
              onChange={(e) => setCategoryId(Number(e.target.value) || null)}
              className='w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
            >
              <option value=''>Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className='flex justify-end space-x-3 pt-4'>
            <button
              type='button'
              onClick={() => router.back()}
              className='px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition'
            >
              Cancel
            </button>
            <button
              onClick={handleUpdate}
              disabled={!title.trim() || !content.trim() || submitting}
              className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center min-w-[100px]'
            >
              {submitting ? (
                <ClipLoader color='#ffffff' size={20} />
              ) : (
                "Update Post"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
