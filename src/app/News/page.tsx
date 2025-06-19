"use client";
import React, { useEffect, useState } from "react";
import AI from "../../../public/resWeb.png";

import Image from "next/image";
import { IoMdClose } from "react-icons/io";
import { getAllPosts } from "@/actions/posts";
function News() {
  
  const [showSinggleNew, setShowSingleNew] = useState(false);
  const [selectedCont, setSelectedConte] = useState(-1);
  const [postData, setPostData] = useState<any[]>([]);

  //  const postData = await getAllPosts();
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await getAllPosts();
        setPostData(data);
      } catch (err) {
        console.error("Failed to fetch posts:", err);
      }
    };
    fetchPosts();
  }, []);

  console.log("ppppppppppppppppppp", postData);

  return (
 
 
 <main className='w-[100%]  text-black pt-[6rem] ipad:px-[10%] max-w-[1750px] laptop:m-auto  py-[3rem] ipad:py-[6rem] '>
      <div className='w-[90%] m-auto flex flex-col gap-16'>
        <h4 className='text-[1.8rem] font-[700] tracking-[5px]'>
          {" "}
          <span>LATEST </span>
          <span className='text-red-600'>NEWS</span>
        </h4>
        
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
                className='single-div max-w-[25rem] w-[100%] bg-white group flex flex-col gap-7'
                onClick={() => {
                  setShowSingleNew(!showSinggleNew);
                  setSelectedConte(id);
                }}
              >
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
  );
}

export default News;
