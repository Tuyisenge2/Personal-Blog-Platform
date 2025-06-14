"use client";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { IoMdClose, IoMdMenu } from "react-icons/io";

export default function Navbar() {
  const [toggleOpen, setToggleOpen] = useState(false);
  const [screenWidth, setScreenWidth] = useState(0);
  const [activeSection, setActiveSection] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const sections = document.querySelectorAll("section");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.6 }
    );
    sections.forEach((section) => observer.observe(section));
    return () => {
      sections.forEach((section) => observer.unobserve(section));
    };
  }, []);
  const isToggleOpen = () => {
    setToggleOpen(!toggleOpen);
  };
  return (
    <main className=' w-[100%] '>
      (
      <div
        className={
          "container px-16 w-[100%] m-auto max-w-[156rem]  bg-white  fixed top-0 left-0 right-0 z-[900] text-black ipad:px-[4%] laptop:px-[10%] border-b4 shadow-lg"
        }
      >
        <div className=' topbar_inner w-[100%] h-[10vh] flex items-center justify-between '>
          <div className=' logo '>
            <p className=' text-[26px] laptop:text-[30px] font-[800] tracking-[12px]'>
              Blog Platform
            </p>
          </div>
          <div className='menu '>
            <ul className='list-none m-0 flex gap-12 font-[500] text-[16px] laptop:text-[16px] '>
              <li className='hover:text-red-700 hover:ease-in '>
                {" "}
                <a
                  href='#home'
                  className={activeSection === "home" ? "text-red-700 " : ""}
                >
                  Blogs
                </a>
              </li>
              <li className='hover:text-red-700  hover:ease-in'>
                <a
                  href='#about'
                  className={activeSection === "about" ? "text-red-700 " : ""}
                >
                  Add Blog{" "}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      )
      {/*      
      {screenWidth < 1024 && (
        <div className='flex w-[100%] m-auto   justify-between h-[10vh] z-[900] fixed top-0 left-0 right-0 bg-white px-[5%]'>
          <div className='font-bold flex  items-center text-[2rem] tracking-[0.4rem]'>
            Tito
          </div>
          <div className='flex items-center text-[2rem]'>
            <button onClick={isToggleOpen}>
              {toggleOpen ? <IoMdClose /> : <IoMdMenu />}
            </button>
          </div>
        </div>
      )}
      {toggleOpen && (
        <div className='w-full border-b-2  py-5 fixed top-[3.4rem] left-0 bg-white z-[900]'>
          <motion.div
            className=' flex flex-col gap-2 w-[90%] m-auto '
            initial={{ x: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ ease: "easeInOut", duration: 1 }}
          >
            <ul className='list-none'>
              <li className='hover:text-red-700  hover:ease-in'>
                <a
                  href='#home'
                  className={activeSection === "home" ? "text-red-700 " : ""}
                  onClick={() => {
                    setToggleOpen(false);
                  }}
                >
                  Home{" "}
                </a>
              </li>
              <li className='hover:text-red-700  hover:ease-in'>
                <a
                  href='#about'
                  className={activeSection === "about" ? "text-red-700 " : ""}
                  onClick={() => {
                    setToggleOpen(false);
                  }}
                >
                  about{" "}
                </a>
              </li>
              <li className='hover:text-red-700  hover:ease-in'>
                <a
                  href='#portfolio'
                  className={
                    activeSection === "portfolio" ? "text-red-700 " : ""
                  }
                  onClick={() => {
                    setToggleOpen(false);
                  }}
                >
                  portfolio{" "}
                </a>
              </li>
              <li className='hover:text-red-700  hover:ease-in'>
                <a
                  href='#skills'
                  className={activeSection === "skills" ? "text-red-700 " : ""}
                  onClick={() => {
                    setToggleOpen(false);
                  }}
                >
                  skills{" "}
                </a>
              </li>
              <li className='hover:text-red-700  hover:ease-in'>
                <a
                  href='#blogs'
                  className={activeSection === "blogs" ? "text-red-700 " : ""}
                  onClick={() => {
                    setToggleOpen(false);
                  }}
                >
                  blogs{" "}
                </a>
              </li>

              <li className='hover:text-red-700  hover:ease-in'>
                <a
                  href='#contact'
                  className={activeSection === "contact" ? "text-red-700 " : ""}
                  onClick={() => {
                    setToggleOpen(false);
                  }}
                >
                  contact{" "}
                </a>
              </li>
            </ul>
          </motion.div>
        </div>
      )} */}
    </main>
  );
}
