"use client";
import { FC, useState } from "react";
import type { Post } from "@/types/todoType"; // ✅ type-only import
import Post from "./post"; // ✅ component import is OK now
import AddPost from "./add-post";
import { addPost, deletePost, updatePost } from "@/actions/posts";

interface Props {
  initialPosts: Post[];
}

const Posts: FC<Props> = ({ initialPosts }) => {
  const [posts, setPosts] = useState<Post[]>(initialPosts);

  const createPost = async (title: string, content: string, categoryId: number | null) => {
    const newPost = await addPost(title, content, categoryId);
    setPosts(prev => [...prev, newPost]);
  };

  const changePost = async (id: number, title: string, content: string, categoryId: number | null) => {
    await updatePost(id, title, content, categoryId);
    setPosts(prev =>
      prev.map(post =>
        post.id === id ? { ...post, title, content, category_id: categoryId } : post
      )
    );
  };

  const deletePostItem = async (id: number) => {
    await deletePost(id);
    setPosts(prev => prev.filter(post => post.id !== id));
  };

  return (
    <main className="max-w-2xl mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8">My Blog Posts</h1>
      
      <div className="space-y-4 mb-8">
        {posts.map(post => (
          <Post
            key={post.id}
            post={post}
            changePost={changePost}
            deletePost={deletePostItem}
          />
        ))}
      </div>

      <AddPost createPost={createPost} />
    </main>
  );
};

export default Posts;















// "use client";
// import { FC, useState } from "react";
// import { Post } from "@/types/todoType";
// import Post from "./post";
// import AddPost from "./add-post";
// import { addPost, deletePost, updatePost } from "@/actions/posts";

// interface Props {
//   initialPosts: Post[];
// }

// const Posts: FC<Props> = ({ initialPosts }) => {
//   const [posts, setPosts] = useState<Post[]>(initialPosts);

//   const createPost = async (title: string, content: string, categoryId: number | null) => {
//     const newPost = await addPost(title, content, categoryId);
//     setPosts(prev => [...prev, newPost]);
//   };

//   const changePost = async (id: number, title: string, content: string, categoryId: number | null) => {
//     await updatePost(id, title, content, categoryId);
//     setPosts(prev =>
//       prev.map(post =>
//         post.id === id ? { ...post, title, content, category_id: categoryId } : post
//       )
//     );
//   };

//   const deletePostItem = async (id: number) => {
//     await deletePost(id);
//     setPosts(prev => prev.filter(post => post.id !== id));
//   };

//   return (
//     <main className="max-w-2xl mx-auto p-8">
//       <h1 className="text-4xl font-bold mb-8">My Blog Posts</h1>
      
//       <div className="space-y-4 mb-8">
//         {posts.map(post => (
//           <Post
//             key={post.id}
//             post={post}
//             changePost={changePost}
//             deletePost={deletePostItem}
//           />
//         ))}
//       </div>

//       <AddPost createPost={createPost} />
//     </main>
//   );
// };

// export default Posts;