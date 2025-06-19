"use client";
import { Suspense, useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "@/actions/users";
import { ClipLoader } from "react-spinners";
import Image from "next/image";
import basketballPlayer from "../../../public/bg-home.png";
import basketballPlayer2 from "../../../public/bg-home2.jpg";

import useToast from "@/hooks/useToast";

function LoginContent() {
  const router = useRouter();
  const { showSuccess, showError } = useToast();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
  
    try {
      const result = await loginUser(formData.email, formData.password);
  
      if (result.error) {
        setError(result.error);
        showError(result.error);
        return;
      }
  
      // Store token in localStorage
      if (result.token) {
        localStorage.setItem('authToken', result.token);
        // Optionally store user data if needed
        localStorage.setItem('user', JSON.stringify(result.user));
      }
      showSuccess("Login successful!");
      router.push("/posts");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
      showError("Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex flex-col md:flex-row h-screen'>
      <div className='flex-1 flex flex-col justify-center items-center bg-white p-8 w-full md:w-1/2'>
        <div className='w-full max-w-md'>
          <h1 className='text-3xl font-bold mb-2'>WELCOME BACK</h1>
          <p className='text-gray-600 mb-6'>
            Welcome back! Please enter your details.
          </p>

          {error && (
            <div className='mb-4 p-3 bg-red-100 text-red-700 rounded-md'>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className='space-y-4'>
            <div>
              <input
                type='email'
                name='email'
                placeholder='Enter your email'
                value={formData.email}
                onChange={handleChange}
                className='border rounded-md p-2 w-full border-gray-300'
                required
                pattern='[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$'
                title='Please enter a valid email address (e.g., user@example.com)'
              />
            </div>

            <div>
              <input
                type='password'
                name='password'
                placeholder='**********'
                value={formData.password}
                onChange={handleChange}
                className='border rounded-md p-2 w-full border-gray-300'
                required
                minLength={6}
                title='Password must be at least 6 characters long'
              />
            </div>

            <button
              type='submit'
              disabled={loading}
              className='bg-red-600 text-white px-6 py-2 rounded-lg w-full hover:bg-red-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center'
            >
              {loading ? <ClipLoader color='#ffffff' size={20} /> : "Sign in"}
            </button>
            <p className='text-gray-600'>
              Don't have an account?{" "}
              <a href='/register' className='text-blue-600 hover:underline'>
                Sign up
              </a>
            </p>
          </form>
        </div>
      </div>

      <div className='hidden md:flex flex-1 bg-gray-200 relative'>
        <Image
          src={basketballPlayer2}
          alt='Basketball Player Illustration'
          fill
          className='object-cover'
          priority
        />
      </div>
    </div>
  );
}

export default function Login() {
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
      <LoginContent />
    </Suspense>
  );
}
