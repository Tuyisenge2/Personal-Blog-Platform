"use server";
import { db } from "@/db/drizzle";
import { categories } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// Get all categories
export const getAllCategories = async () => {
  return await db.select().from(categories);
};

// Add new category (now returns the created category)
export const addCategory = async (name: string) => {
  const [newCategory] = await db.insert(categories)
    .values({ name })
    .returning(); // This returns the inserted record
  
  revalidatePath("/posts");
  return newCategory; // Make sure to return the category
};

// Update category (new addition)
export const updateCategory = async (id: number, name: string) => {
  await db.update(categories)
    .set({ name })
    .where(eq(categories.id, id));
  revalidatePath("/posts");
};

// Delete category
export const deleteCategory = async (id: number) => {
  await db.delete(categories).where(eq(categories.id, id));
  revalidatePath("/posts");
};










// 
// "use server";
// import { db } from "@/db/drizzle";
// import { categories } from "@/db/schema";
// import { eq } from "drizzle-orm";
// import { revalidatePath } from "next/cache";

// // Get all categories
// export const getAllCategories = async () => {
//   return await db.select().from(categories);
// };

// // Add new category
// export const addCategory = async (name: string) => {
//   await db.insert(categories).values({ name });
//   revalidatePath("/posts"); // Revalidate blog post pages
// };

// // Delete category (only if no posts are linked)
// export const deleteCategory = async (id: number) => {
//   await db.delete(categories).where(eq(categories.id, id));
//   revalidatePath("/posts");
// };