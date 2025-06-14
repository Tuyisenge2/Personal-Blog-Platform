"use server";
import { db } from "@/db/drizzle";
import { posts } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export const addPost = async (title: string, content: string, categoryId: number | null) => {
  const [newPost] = await db.insert(posts)
    .values({ title, content, category_id: categoryId })
    .returning();
  revalidatePath("/posts");
  return newPost;
};

export const updatePost = async (
  id: number,
  title: string,
  content: string,
  categoryId: number | null
) => {
  await db.update(posts)
    .set({ title, content, category_id: categoryId })
    .where(eq(posts.id, id));
  revalidatePath("/posts");
};

export const deletePost = async (id: number) => {
  await db.delete(posts).where(eq(posts.id, id));
  revalidatePath("/posts");
};















// "use server";
// import { db } from "@/db/drizzle";
// import { posts, categories } from "@/db/schema";
// import { eq, and } from "drizzle-orm";
// import { revalidatePath } from "next/cache";

// // Get all posts with category names
// export const getAllPosts = async () => {
//   return await db
//     .select({
//       id: posts.id,
//       title: posts.title,
//       content: posts.content,
//       category: categories.name,
//       createdAt: posts.created_at
//     })
//     .from(posts)
//     .leftJoin(categories, eq(posts.category_id, categories.id));
// };

// // Create new post
// export const createPost = async (
//   title: string,
//   content: string,
//   categoryId: number
// ) => {
//   await db.insert(posts).values({ 
//     title, 
//     content, 
//     category_id: categoryId 
//   });
//   revalidatePath("/posts");
// };

// // Update post
// export const updatePost = async (
//   id: number,
//   title: string,
//   content: string,
//   categoryId: number
// ) => {
//   await db
//     .update(posts)
//     .set({ title, content, category_id: categoryId })
//     .where(eq(posts.id, id));
//   revalidatePath("/posts");
// };

// // Delete post
// export const deletePost = async (id: number) => {
//   await db.delete(posts).where(eq(posts.id, id));
//   revalidatePath("/posts");
// };