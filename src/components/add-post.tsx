"use client";
import { ChangeEvent, FC, useState, useEffect } from "react";
import { getAllCategories } from "@/actions/categories";

interface Props {
  createPost: (
    title: string,
    content: string,
    categoryId: number | null
  ) => void;
}

const AddPost: FC<Props> = ({ createPost }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [categories, setCategories] = useState<{ id: number; name: string }[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await getAllCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleAdd = async () => {
    if (!title.trim() || !content.trim()) return;
    createPost(title, content, categoryId);
    setTitle("");
    setContent("");
    setCategoryId(null);
  };

  if (loading) {
    return (
      <>
        <p className=''>Loading categories...</p>
      </>
    );
  }

  return (
    <div className='w-full mt-8 p-4 border border-gray-200 rounded-lg'>
      <h2 className='text-xl font-bold mb-4'>Create New Post</h2>
      <input
        type='text'
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder='Post title'
        className='w-full p-2 mb-2 border rounded'
      />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder='Post content'
        className='w-full p-2 mb-2 border rounded min-h-[100px]'
      />

      {
        <select
          value={categoryId || ""}
          onChange={(e) => setCategoryId(Number(e.target.value) || null)}
          className='w-full p-2 mb-2 border rounded bg-black'
        >
          <option value=''>Select a category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      }

      <button
        onClick={handleAdd}
        disabled={!title.trim() || !content.trim() || loading}
        className='bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50'
      >
        Add Post
      </button>
    </div>
  );
};

export default AddPost;

// "use client";
// import { ChangeEvent, FC, useState } from "react";

// interface Props {
//   createPost: (title: string, content: string, categoryId: number | null) => void;
// }

// const AddPost: FC<Props> = ({ createPost }) => {
//   const [title, setTitle] = useState("");
//   const [content, setContent] = useState("");
//   const [categoryId, setCategoryId] = useState<number | null>(null);

//   const handleAdd = async () => {
//     if (!title.trim() || !content.trim()) return;
//     createPost(title, content, categoryId);
//     setTitle("");
//     setContent("");
//     setCategoryId(null);
//   };

//   return (
//     <div className="w-full mt-8 p-4 border border-gray-200 rounded-lg">
//       <h2 className="text-xl font-bold mb-4">Create New Post</h2>
//       <input
//         type="text"
//         value={title}
//         onChange={(e) => setTitle(e.target.value)}
//         placeholder="Post title"
//         className="w-full p-2 mb-2 border rounded"
//       />
//       <textarea
//         value={content}
//         onChange={(e) => setContent(e.target.value)}
//         placeholder="Post content"
//         className="w-full p-2 mb-2 border rounded min-h-[100px]"
//       />
//       <select
//         value={categoryId || ""}
//         onChange={(e) => setCategoryId(Number(e.target.value) || null)}
//         className="w-full p-2 mb-2 border rounded"
//       >
//         <option value="">Select a category</option>
//         <option value="1">Tech</option>
//         <option value="2">Lifestyle</option>
//       </select>
//       <button
//         onClick={handleAdd}
//         disabled={!title.trim() || !content.trim()}
//         className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
//       >
//         Add Post
//       </button>
//     </div>
//   );
// };

// export default AddPost;
