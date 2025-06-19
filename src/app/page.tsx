"use client";

import { Suspense, useEffect } from "react";
import { useRouter } from "next/navigation";
import useToast from "../hooks/useToast";
import { Toaster } from "sonner";
import PostsPage from "./posts/page";
import { verifyToken } from "@/lib/actions/auth";

function HomeContent() {
  const router = useRouter();
  const { showError } = useToast();

  useEffect(() => {
    const checkAuth = () => {
      try {
        // Get token from localStorage
        const token = localStorage.getItem('authToken');
        
        if (!token) {
          router.push("/login");
          return;
        }

        // Verify the token
        const decoded = verifyToken(token);
        
        // If token is valid, redirect to posts
        if (decoded.userId) {
          router.push("/posts");
        } else {
          throw new Error("Invalid token");
        }
      } catch (error) {
        console.error("Authentication check failed:", error);
        // Clear invalid token
        // localStorage.removeItem('authToken');
        // localStorage.removeItem('user');
        router.push("/login");
        showError("Session expired. Please login again.");
      }
    };

    checkAuth();
  }, [router, showError]);

  return (
    <div className='w-[100%] h-[100%]'>
      <Toaster position='top-right' />
      <PostsPage />
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












// "use client";

// import { getAllCategories } from "@/actions/categories";
// import { getAllPosts } from "@/actions/posts";
// import { getData } from "@/actions/todoAction";
// import Categories from "@/components/categories";
// import Posts from "@/components/posts";
// import Todos from "@/components/todos";
// import { useEffect, Suspense } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import { useAppDispatch, useAppSelector } from "@/store/hooks";
// import { googleSignInSuccess } from "@/store/slices/googleSlice";
// import useToast from "../hooks/useToast";
// import { JwtService } from "@/services/jwtService";
// import Navbar from "./Navbar";
// import { Toaster } from "sonner";
// import News from "./News/page";
// import PostsPage from "./posts/page";

// function HomeContent() {
//   const router = useRouter();
// //  const { isAuthenticated } = useAppSelector((state) => state.google);
//   const searchParams = useSearchParams();
//   const token = searchParams.get("token");
//   const storedToken = JwtService.getStoredToken();

//   const dispatch = useAppDispatch();

//   const { showError, showSuccess } = useToast();

//   if (token && token?.length > 2) {
//     try {
//       JwtService.storeToken(token);
//       dispatch(googleSignInSuccess(token));
//     } catch (error) {
//       showError("login by google failed!");
//     }
//   }

//   useEffect(() => {
//     if (JwtService.isTokenValid(storedToken as string)) {
//       router.push("/posts");
//     } else {
//       router.push("/login");
//     }
//   }, [ router]);

//   return (
//     <div className=' w-[100%] h-[100%]'>
//       {/* <Toaster position='top-right' />
//       <Navbar />
//       <section id='blogs' className=''>
//         <News />
//       </section> */}
//       <PostsPage />
//     </div>
//   );
// }

// export default function Home() {
//   return (
//     <Suspense
//       fallback={
//         <div className='min-h-screen flex items-center justify-center bg-gray-50'>
//           <div className='text-center'>
//             <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4'></div>
//             <p className='text-gray-600'>Loading...</p>
//           </div>
//         </div>
//       }
//     >
//       <HomeContent />
//     </Suspense>
//   );
// }
