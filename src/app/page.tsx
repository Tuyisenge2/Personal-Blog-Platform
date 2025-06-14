"use client";

import { getAllCategories } from "@/actions/categories";
import { getAllPosts } from "@/actions/posts";
import { getData } from "@/actions/todoAction";
import Categories from "@/components/categories";
import Posts from "@/components/posts";
import Todos from "@/components/todos";
import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { googleSignInSuccess } from "@/store/slices/googleSlice";
import useToast from "../hooks/useToast";
import { JwtService } from "@/services/jwtService";
import Navbar from "./Navbar";
import { Toaster } from "sonner";
import News from "./News/page";

function HomeContent() {
  // const router = useRouter();
  // const { isAuthenticated } = useAppSelector((state) => state.google);
  // const searchParams = useSearchParams();
  // const token = searchParams.get("token");
  // const storedToken = JwtService.getStoredToken();

  // const dispatch = useAppDispatch();

  // const { showError, showSuccess } = useToast();

  // if (token && token?.length > 2) {
  //   try {
  //     JwtService.storeToken(token);
  //     dispatch(googleSignInSuccess(token));
  //   } catch (error) {
  //     showError("login by google failed!");
  //   }
  // }

  // useEffect(() => {
  //   if (isAuthenticated && JwtService.isTokenValid(storedToken as string)) {
  //     router.push("/dashboard");
  //   } else {
  //     router.push("/dashboard");
  //   }
  // }, [isAuthenticated, router]);

  return (
    <div className=' w-[100%] h-[100%]'>
      <Toaster position='top-right' />
      <Navbar />
      <section id='blogs' className=''>
        <News />
      </section>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense
      fallback={
        <div className='min-h-screen flex items-center justify-center bg-gray-50'>
          <div className='text-center'>
            <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4'></div>
            <p className='text-gray-600'>Loading...</p>
          </div>
        </div>
      }
    >
      <HomeContent />
    </Suspense>
  );
}

// export default async function Home() {
//   const data = await getData();
//   const CatData = await getAllCategories();
//   const postData = await getAllPosts();
//   // return <Todos todos={data} />;
//   // return <Categories initialCategories={CatData} />;
//   return <Posts initialPosts={postData} />;

// }
