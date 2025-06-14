"use client";

import resWeb from "../../../public/resWeb.png";
import AI from "../../../public/resWeb.png";
import Js from "../../../public/resWeb.png";
import Image from "next/image";
import { IoMdClose } from "react-icons/io";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getAllPosts, deletePost } from "@/actions/posts";
import { getAllCategories } from "@/actions/categories";
import { useRouter } from "next/navigation";

interface Post {
  id: string;
  title: string;
  content: string;
  category: string;
  createdAt: string;
}

export default function PostsPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categories = ["Tech", "Lifestyle", "Work", "Personal"];
  const [showSinggleNew, setShowSingleNew] = useState(false);
  const [selectedCont, setSelectedConte] = useState(-1);
  const [postData, setPostData] = useState<any[]>([]);
  const [catData, setCatData] = useState<any[]>([]);

  //  const postData = await getAllPosts();
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await getAllPosts();
        const CatData = await getAllCategories();
        setPostData(data);
        setCatData(CatData);
      } catch (err) {
        console.error("Failed to fetch posts:", err);
      }
    };
    fetchPosts();
  }, []);

  const handleDelete = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click event
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await deletePost(id);
        setPostData(postData.filter((post) => post.id !== id));
      } catch (error) {
        console.error("Failed to delete post:", error);
      }
    }
  };

  const handleEdit = (id: number, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click event
    router.push(`/posts/edit/${id}`);
  };

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
          {catData.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.name)}
              className={`px-4 py-2 rounded-lg ${
                selectedCategory === category.name
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

      <main className='w-[100%]  text-black  ipad:px-[10%] max-w-[1750px] laptop:m-auto  py-[3rem] ipad:py-[6rem] '>
        <div className='w-[90%] m-auto flex flex-col gap-16'>
          <div
            className='all-cards grid grid-cols-3 bimobile:grid-cols-2 tablet:grid-cols-3
         gap-x-6 gap-y-6 laptop:gap-x-5 laptop:gap-y-5 w-[100%]  max-w-[1200px] '
          >
            {postData.map(({ id, content, title, created_at: date }) => {
              const formattedDate = new Date(date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              });
              return (
                <div
                  key={id}
                  className='single-div max-w-[25rem] w-[100%] bg-white group flex flex-col gap-7 relative'
                  onClick={() => {
                    setShowSingleNew(!showSinggleNew);
                    setSelectedConte(id);
                  }}
                >
                  <div className='absolute top-4 right-4 flex gap-2 z-10'>
                    <button
                      onClick={(e) => handleEdit(id, e)}
                      className='p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition'
                    >
                      <FiEdit2 className='text-gray-600' />
                    </button>
                    <button
                      onClick={(e) => handleDelete(id, e)}
                      className='p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition'
                    >
                      <FiTrash2 className='text-red-600' />
                    </button>
                  </div>
                  <a className='image-container w-[100%] h-[100%] bimobile:h-[28vh] ipad:h-[35vh] rounded-lg overflow-hidden '>
                    <Image
                      className='w-[100%] h-[100%] '
                      src={AI}
                      alt='dmsosdm'
                    />
                  </a>
                  <div className='card-caption flex flex-col gap-7  hover: '>
                    <a className=' text-black font-[600] text-[21px] tracking-[1px] hover:text-red-800'>
                      {title}
                    </a>
                    <p
                      className=' text-gray-500  font-[400] text-[15px] italic
              '
                    >
                      {formattedDate}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div
          className={`${
            showSinggleNew ? `block` : `hidden`
          } w-full h-full bg-black fixed top-0 left-0 opacity-80  z-[901] `}
        ></div>
        <div
          className={`${
            showSinggleNew ? `block` : `hidden`
          } w-full h-full bg-white fixed top-0 left-0  z-[905] ipad:w-[80%] ipad:left-[10%] ipad:top-[10%] ipad:h-[650px] overflow-y-scroll`}
        >
          <div className='w-full h-full p-4 tablet:p-8 ipad:py-[5rem] bg-white'>
            <button
              className='text-[20px] absolute top-5 right-5 border-gray-500  border-2 rounded-full text-gray-500'
              onClick={() => setShowSingleNew(!showSinggleNew)}
            >
              <IoMdClose />
            </button>
            {postData
              .filter((i) => i.id == selectedCont)
              .map((i) => (
                <div
                  key={i.id}
                  className='flex flex-col gap-5 w-full ipad:max-w-[1000px] target:gap-10 ipad:m-auto'
                >
                  <div className='h-[322px]'>
                    <Image
                      className='w-[100%] h-[100%] object-cover rounded'
                      src={AI}
                      alt='dmsosdm'
                    />
                  </div>
                  <div className='flex flex-col gap-5'>
                    <span className='flex flex-col gap-2'>
                      <p className='text-black font-[700] text-[30px]'>
                        {i.title}
                      </p>
                      <p className='text-gray-500  font-[400] text-[11px] italic ipad:text-[14px]'>
                        {i.date}
                      </p>
                    </span>
                    <p className='text-gray-600 text-[15px]'>{i.content}</p>
                  </div>
                </div>
              ))}
          </div>{" "}
        </div>
      </main>
    </div>
  );
}
