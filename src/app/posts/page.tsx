"use client";

import Image from "next/image";
import { IoMdClose } from "react-icons/io";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getAllPosts, deletePost } from "@/actions/posts";
import { getAllCategories } from "@/actions/categories";

interface Post {
  id: number;
  title: string;
  content: string;
  image_url: string | null; // Added image_url to the interface
  category_id: number | null;
  created_at: string;
  category_name?: string;
}

interface Category {
  id: number;
  name: string;
}

export default function PostsPage() {
  const router = useRouter();
  const [showSinglePost, setShowSinglePost] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | "all">(
    "all"
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postsData, categoriesData] = await Promise.all([
          getAllPosts(),
          getAllCategories(),
        ]);

        // Enhance posts with category names
        const enhancedPosts = postsData.map((post) => ({
          ...post,
          category_name:
            categoriesData.find((cat) => cat.id === post.category_id)?.name ||
            "Uncategorized",
        }));

        setPosts(enhancedPosts);
        setCategories(categoriesData);
      } catch (err) {
        console.error("Failed to fetch data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await deletePost(id);
        setPosts(posts.filter((post) => post.id !== id));
      } catch (error) {
        console.error("Failed to delete post:", error);
      }
    }
  };

  const handleEdit = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/posts/edit/${id}`);
  };

  const filteredPosts =
    selectedCategory === "all"
      ? posts
      : posts.filter((post) => post.category_id === selectedCategory);

  if (loading) {
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600'></div>
      </div>
    );
  }

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
      <div className='mb-6 overflow-x-auto'>
        <div className='flex gap-2 pb-2'>
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-4 py-2 rounded-lg whitespace-nowrap ${
              selectedCategory === "all"
                ? "bg-red-600 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            All Posts
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap ${
                selectedCategory === category.id
                  ? "bg-red-600 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Posts Grid */}
      <div className='w-full'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {filteredPosts.map((post) => {
            const formattedDate = new Date(post.created_at).toLocaleDateString(
              "en-US",
              {
                year: "numeric",
                month: "long",
                day: "numeric",
              }
            );

            return (
              <div
                key={post.id}
                className='bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 relative group'
                onClick={() => {
                  setShowSinglePost(true);
                  setSelectedPostId(post.id);
                }}
              >
                <div className='absolute top-4 right-4 flex gap-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity'>
                  <button
                    onClick={(e) => handleEdit(post.id, e)}
                    className='p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition'
                  >
                    <FiEdit2 className='text-gray-600' />
                  </button>
                  <button
                    onClick={(e) => handleDelete(post.id, e)}
                    className='p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition'
                  >
                    <FiTrash2 className='text-red-600' />
                  </button>
                </div>

                <div className='h-48 relative overflow-hidden'>
                  {post.image_url ? (
                    <Image
                      src={post.image_url}
                      alt={post.title}
                      fill
                      className='object-cover'
                      sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                    />
                  ) : (
                    <div className='w-full h-full bg-gray-200 flex items-center justify-center'>
                      <span className='text-gray-400'>No Image</span>
                    </div>
                  )}
                </div>

                <div className='p-4'>
                  <div className='flex justify-between items-start mb-2'>
                    <h3 className='text-lg font-semibold line-clamp-2'>
                      {post.title}
                    </h3>
                    <span className='text-xs px-2 py-1 bg-gray-100 rounded-full'>
                      {post.category_name}
                    </span>
                  </div>
                  <p className='text-gray-500 text-sm'>{formattedDate}</p>
                  <p className='text-gray-600 mt-2 line-clamp-3'>
                    {post.content}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Single Post Modal */}
      {showSinglePost && selectedPostId && (
        <div className='fixed inset-0 z-50 overflow-y-auto'>
          <div
            className='fixed inset-0 bg-black/80'
            onClick={() => setShowSinglePost(false)}
          ></div>

          <div className='relative bg-white rounded-lg max-w-4xl w-full mx-auto my-8 p-6 max-h-[90vh] overflow-y-auto'>
            <button
              className='absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100'
              onClick={() => setShowSinglePost(false)}
            >
              <IoMdClose className='text-2xl text-gray-500' />
            </button>

            {posts
              .filter((post) => post.id === selectedPostId)
              .map((post) => {
                const formattedDate = new Date(
                  post.created_at
                ).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                });

                return (
                  <div key={post.id} className='space-y-6'>
                    {post.image_url && (
                      <div className='relative h-64 rounded-lg overflow-hidden'>
                        <Image
                          src={post.image_url}
                          alt={post.title}
                          fill
                          className='object-cover'
                        />
                      </div>
                    )}

                    <div className='space-y-4'>
                      <div className='flex justify-between items-start'>
                        <h2 className='text-2xl font-bold'>{post.title}</h2>
                        <span className='text-sm px-3 py-1 bg-gray-100 rounded-full'>
                          {post.category_name}
                        </span>
                      </div>

                      <p className='text-gray-500 text-sm'>{formattedDate}</p>

                      <div className='prose max-w-none'>
                        {post.content.split("\n\n").map((paragraph, i) => (
                          <p key={i} className='mb-4'>
                            {paragraph}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
}


