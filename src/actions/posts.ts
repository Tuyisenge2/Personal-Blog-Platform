"use server";
import { db } from "@/db/drizzle";
import { categories, posts } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// Get single post by ID
export const getPost = async (id: number): Promise<any | null> => {
  const result = await db
    .select({
      id: posts.id,
      title: posts.title,
      content: posts.content,
      image_url: posts.image_url,
      category_id: posts.category_id,
      category_name: categories.name,
      created_at: posts.created_at,
      updated_at: posts.updated_at,
    })
    .from(posts)
    .leftJoin(categories, eq(posts.category_id, categories.id))
    .where(eq(posts.id, id));

  return result[0] || null;
};

export const getAllPosts = async (): Promise<any[]> => {
  return await db
    .select({
      id: posts.id,
      title: posts.title,
      content: posts.content,
      image_url: posts.image_url,
      category_id: posts.category_id,
      category_name: categories.name,
      created_at: posts.created_at,
      updated_at: posts.updated_at,
    })
    .from(posts)
    .leftJoin(categories, eq(posts.category_id, categories.id));
};

export const addPost = async (
  title: string,
  content: string,
  categoryId: number | null,
  image_url?: string
) => {
  const now = new Date();
  const [newPost] = await db
    .insert(posts)
    .values({
      title,
      content,
      image_url,
      category_id: categoryId,
      created_at: now,
      updated_at: now,
    })
    .returning();
  revalidatePath("/posts");
  return {
    ...newPost,
    created_at: newPost.created_at ? new Date(newPost.created_at) : now,
    updated_at: newPost.updated_at ? new Date(newPost.updated_at) : now,
  };
};

export const updatePost = async (
  id: number,
  title: string,
  content: string,
  categoryId: number | null,
  image_url?: string
) => {
  await db
    .update(posts)
    .set({ 
      title, 
      content, 
      image_url,
      category_id: categoryId,
      updated_at: new Date()
    })
    .where(eq(posts.id, id));
  revalidatePath("/posts");
};

export const deletePost = async (id: number) => {
  await db.delete(posts).where(eq(posts.id, id));
  revalidatePath("/posts");
};


export const getPostsByAuthor = async (authorId: number): Promise<any[]> => {
  return await db
    .select({
      id: posts.id,
      title: posts.title,
      content: posts.content,
      image_url: posts.image_url,
      category_id: posts.category_id,
      category_name: categories.name,
      author_id: posts.author_id,
      created_at: posts.created_at,
      updated_at: posts.updated_at,
    })
    .from(posts)
    .leftJoin(categories, eq(posts.category_id, categories.id))
    .where(eq(posts.author_id, authorId)); // Filter by author ID
};