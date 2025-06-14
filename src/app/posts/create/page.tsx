"use client";
import { useState, useEffect } from "react";
import { getAllCategories } from "@/actions/categories";
import { addPost } from "@/actions/posts";
import { useRouter } from "next/navigation";
import { ClipLoader } from "react-spinners";

const AddPost = () => {
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
    setSubmitting(true);
    try {
      await addPost(title, content, categoryId);
      router.push("/posts"); // Redirect after successful submission
    } catch (error) {
      console.error("Failed to create post:", error);
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
        <h2 className='text-2xl font-bold mb-6 text-center'>Create New Post</h2>

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
              onClick={handleAdd}
              disabled={!title.trim() || !content.trim() || submitting}
              className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center min-w-[100px]'
            >
              {submitting ? (
                <ClipLoader color='#ffffff' size={20} />
              ) : (
                "Add Post"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddPost;

// "use client";
// import { ChangeEvent, FC, useState, useEffect } from "react";
// import { getAllCategories } from "@/actions/categories";
// import { addPost, deletePost, updatePost } from "@/actions/posts";
// import { useRouter } from "next/navigation";

// interface Props {
//   createPost: (
//     title: string,
//     content: string,
//     categoryId: number | null
//   ) => void;
// }

// const AddPost: FC<Props> = () => {
//   const router = useRouter();

//   const [title, setTitle] = useState("");
//   const [content, setContent] = useState("");
//   const [categoryId, setCategoryId] = useState<number | null>(null);
//   const [categories, setCategories] = useState<{ id: number; name: string }[]>(
//     []
//   );
//   const [loading, setLoading] = useState(true);
//   // Fetch categories on component mount
//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const categoriesData = await getAllCategories();
//         setCategories(categoriesData);
//       } catch (error) {
//         console.error("Failed to fetch categories:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCategories();
//   }, []);

//   const handleAdd = async () => {
//     if (!title.trim() || !content.trim()) return;
//     //    createPost(title, content, categoryId);
//     const newPost = await addPost(title, content, categoryId);
//     setTitle("");
//     setContent("");
//     setCategoryId(null);
//   };

//   if (loading) {
//     return (
//       <>
//         <p className=''> loader</p>
//       </>
//     );
//   }

//   return (
//     <div className='w-full mt-8 p-4 border border-gray-200 rounded-lg'>
//       <h2 className='text-xl font-bold mb-4'>Create New Post</h2>
//       <input
//         type='text'
//         value={title}
//         onChange={(e) => setTitle(e.target.value)}
//         placeholder='Post title'
//         className='w-full p-2 mb-2 border rounded'
//       />
//       <textarea
//         value={content}
//         onChange={(e) => setContent(e.target.value)}
//         placeholder='Post content'
//         className='w-full p-2 mb-2 border rounded min-h-[100px]'
//       />

//       {
//         <select
//           value={categoryId || ""}
//           onChange={(e) => setCategoryId(Number(e.target.value) || null)}
//           className='w-full p-2 mb-2 border rounded'
//         >
//           <option value=''>Select a category</option>
//           {categories.map((category) => (
//             <option key={category.id} value={category.id}>
//               {category.name}
//             </option>
//           ))}
//         </select>
//       }

//       <button
//         onClick={handleAdd}
//         disabled={!title.trim() || !content.trim() || loading}
//         className='bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50'
//       >
//         Add Post
//       </button>
//       <button
//         type='button'
//         onClick={() => router.back()}
//         className='bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300 transition'
//       >
//         Cancel
//       </button>
//     </div>
//   );
// };

// export default AddPost;
