"use client";
import { useState, useEffect, useRef } from "react";
import { getAllCategories } from "@/actions/categories";
import { addPost } from "@/actions/posts";
import { useRouter } from "next/navigation";
import { ClipLoader } from "react-spinners";
import { useCloudinary } from "@/hooks/useCloudinary";
import Image from "next/image";

interface User {
  id: number;
  email: string;
  name?: string;
  // Add other user properties as needed
}

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
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const {
    uploadImage,
    loading: uploadLoading,
    error: uploadError,
  } = useCloudinary();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get user from localStorage and redirect if not logged in
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      setCurrentUser(user);
    } else {
      // Redirect to login if no user found
      router.push("/login");
      return;
    }
  }, [router]);

  // Fetch categories
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

    // Only fetch categories if user is authenticated
    if (currentUser) {
      fetchCategories();
    }
  }, [currentUser]);

  const handleImageSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedImage(file);

    // Create preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeSelectedImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleAdd = async () => {
    if (!title.trim() || !content.trim() || !currentUser?.id) return;

    setSubmitting(true);
    try {
      let imageUrl = null;

      // Upload image if one was selected
      if (selectedImage) {
        imageUrl = await uploadImage(selectedImage);
      }

      // Create the post with the image URL and author ID
      await addPost(title, content, categoryId, currentUser.id, imageUrl);
      router.push("/posts");
    } catch (error) {
      console.error("Failed to create post:", error);
    } finally {
      setSubmitting(false);
    }
  };

  // Show loading while checking authentication or fetching data
  if (loading || !currentUser) {
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

        {/* Display current user info */}
        <div className='mb-4 p-3 bg-blue-50 rounded-md border border-blue-200'>
          <p className='text-sm text-blue-800'>
            <span className='font-medium'>Author:</span>{" "}
            {currentUser.name || currentUser.email}
          </p>
        </div>

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
              disabled={submitting}
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
              disabled={submitting}
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
              disabled={submitting}
            >
              <option value=''>Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor='image'
              className='block text-sm font-medium text-gray-700 mb-1'
            >
              Featured Image
            </label>

            {imagePreview ? (
              <div className='relative group'>
                <div className='relative h-64 w-full rounded-lg overflow-hidden mb-2 border border-gray-300'>
                  <Image
                    src={imagePreview}
                    alt='Selected preview'
                    fill
                    className='object-cover'
                  />
                </div>
                <button
                  type='button'
                  onClick={removeSelectedImage}
                  className='absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition'
                  disabled={submitting}
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className='h-5 w-5 text-red-600'
                    viewBox='0 0 20 20'
                    fill='currentColor'
                  >
                    <path
                      fillRule='evenodd'
                      d='M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z'
                      clipRule='evenodd'
                    />
                  </svg>
                </button>
              </div>
            ) : (
              <div className='border-2 border-dashed border-gray-300 rounded-lg p-6 text-center'>
                <label className='cursor-pointer'>
                  <div className='flex flex-col items-center justify-center gap-2'>
                    <svg
                      className='w-12 h-12 text-gray-400'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
                      />
                    </svg>
                    <span className='text-sm text-gray-600'>
                      Click to select an image
                    </span>
                    <input
                      id='image'
                      type='file'
                      accept='image/*'
                      onChange={handleImageSelection}
                      className='hidden'
                      ref={fileInputRef}
                      disabled={submitting}
                    />
                  </div>
                </label>
              </div>
            )}
          </div>

          <div className='flex justify-end space-x-3 pt-4'>
            <button
              type='button'
              onClick={() => router.back()}
              className='px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition'
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              onClick={handleAdd}
              disabled={
                !title.trim() ||
                !content.trim() ||
                submitting ||
                !currentUser?.id
              }
              className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center min-w-[100px]'
            >
              {submitting ? (
                <ClipLoader color='#ffffff' size={20} />
              ) : (
                "Create Post"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddPost;

// const AddPost = () => {
//   const router = useRouter();
//   const [title, setTitle] = useState("");
//   const [content, setContent] = useState("");
//   const [categoryId, setCategoryId] = useState<number | null>(null);
//   const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [submitting, setSubmitting] = useState(false);
//   const [selectedImage, setSelectedImage] = useState<File | null>(null);
//   const [imagePreview, setImagePreview] = useState<string | null>(null);
//   const { uploadImage, loading: uploadLoading, error: uploadError } = useCloudinary();
//   const fileInputRef = useRef<HTMLInputElement>(null);

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

//   const handleImageSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     setSelectedImage(file);

//     // Create preview URL
//     const reader = new FileReader();
//     reader.onloadend = () => {
//       setImagePreview(reader.result as string);
//     };
//     reader.readAsDataURL(file);
//   };

//   const removeSelectedImage = () => {
//     setSelectedImage(null);
//     setImagePreview(null);
//     if (fileInputRef.current) {
//       fileInputRef.current.value = "";
//     }
//   };

//   const handleAdd = async () => {
//     if (!title.trim() || !content.trim()) return;

//     setSubmitting(true);
//     try {
//       let imageUrl = null;

//       // Upload image if one was selected
//       if (selectedImage) {
//         imageUrl = await uploadImage(selectedImage);
//       }

//       // Create the post with the image URL
//       await addPost(title, content, categoryId, imageUrl);
//       router.push("/posts");
//     } catch (error) {
//       console.error("Failed to create post:", error);
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className='flex justify-center items-center min-h-[200px]'>
//         <ClipLoader color='#3B82F6' size={40} />
//       </div>
//     );
//   }

//   return (
//     <div className='flex justify-center p-4'>
//       <div className='w-full max-w-2xl border border-gray-200 rounded-lg p-6 shadow-sm'>
//         <h2 className='text-2xl font-bold mb-6 text-center'>Create New Post</h2>

//         <div className='space-y-4'>
//           <div>
//             <label
//               htmlFor='title'
//               className='block text-sm font-medium text-gray-700 mb-1'
//             >
//               Title
//             </label>
//             <input
//               id='title'
//               type='text'
//               value={title}
//               onChange={(e) => setTitle(e.target.value)}
//               placeholder='Post title'
//               className='w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
//               disabled={submitting}
//             />
//           </div>

//           <div>
//             <label
//               htmlFor='content'
//               className='block text-sm font-medium text-gray-700 mb-1'
//             >
//               Content
//             </label>
//             <textarea
//               id='content'
//               value={content}
//               onChange={(e) => setContent(e.target.value)}
//               placeholder='Post content'
//               className='w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[150px]'
//               disabled={submitting}
//             />
//           </div>

//           <div>
//             <label
//               htmlFor='category'
//               className='block text-sm font-medium text-gray-700 mb-1'
//             >
//               Category
//             </label>
//             <select
//               id='category'
//               value={categoryId || ""}
//               onChange={(e) => setCategoryId(Number(e.target.value) || null)}
//               className='w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
//               disabled={submitting}
//             >
//               <option value=''>Select a category</option>
//               {categories.map((category) => (
//                 <option key={category.id} value={category.id}>
//                   {category.name}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div>
//             <label
//               htmlFor='image'
//               className='block text-sm font-medium text-gray-700 mb-1'
//             >
//               Featured Image
//             </label>

//             {imagePreview ? (
//               <div className="relative group">
//                 <div className="relative h-64 w-full rounded-lg overflow-hidden mb-2 border border-gray-300">
//                   <Image
//                     src={imagePreview}
//                     alt="Selected preview"
//                     fill
//                     className="object-cover"
//                   />
//                 </div>
//                 <button
//                   type="button"
//                   onClick={removeSelectedImage}
//                   className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition"
//                   disabled={submitting}
//                 >
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     className="h-5 w-5 text-red-600"
//                     viewBox="0 0 20 20"
//                     fill="currentColor"
//                   >
//                     <path
//                       fillRule="evenodd"
//                       d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
//                       clipRule="evenodd"
//                     />
//                   </svg>
//                 </button>
//               </div>
//             ) : (
//               <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
//                 <label className="cursor-pointer">
//                   <div className="flex flex-col items-center justify-center gap-2">
//                     <svg
//                       className="w-12 h-12 text-gray-400"
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
//                       />
//                     </svg>
//                     <span className="text-sm text-gray-600">
//                       Click to select an image
//                     </span>
//                     <input
//                       id="image"
//                       type="file"
//                       accept="image/*"
//                       onChange={handleImageSelection}
//                       className="hidden"
//                       ref={fileInputRef}
//                       disabled={submitting}
//                     />
//                   </div>
//                 </label>
//               </div>
//             )}
//           </div>

//           <div className='flex justify-end space-x-3 pt-4'>
//             <button
//               type='button'
//               onClick={() => router.back()}
//               className='px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition'
//               disabled={submitting}
//             >
//               Cancel
//             </button>
//             <button
//               onClick={handleAdd}
//               disabled={!title.trim() || !content.trim() || submitting}
//               className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center min-w-[100px]'
//             >
//               {submitting ? (
//                 <ClipLoader color='#ffffff' size={20} />
//               ) : (
//                 "Create Post"
//               )}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AddPost;
