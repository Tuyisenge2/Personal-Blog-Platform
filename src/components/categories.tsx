"use client";
import { FC, useState } from "react";
import { Category } from "@/types/todoType";
import CategoryItem from "./category"; // We'll create this next
import AddCategory from "./add-category";
import { 
  addCategory, 
  deleteCategory, 
  updateCategory 
} from "@/actions/categories";

interface Props {
  initialCategories: Category[];
}

const Categories: FC<Props> = ({ initialCategories }) => {
  const [categories, setCategories] = useState<Category[]>(initialCategories);

  // Create new category
  const createCategory = async (name: string) => {
    try {
      const newCategory = await addCategory(name);
      setCategories(prev => [...prev, newCategory]);
    } catch (error) {
      console.error("Failed to create category:", error);
      throw error; // Re-throw for error handling in AddCategory
    }
  };

  // Update category name
  const changeCategoryName = async (id: number, name: string) => {
    await updateCategory(id, name);
    setCategories(prev =>
      prev.map(cat => (cat.id === id ? { ...cat, name } : cat))
    );
  };

  // Delete category
  const deleteCategoryItem = async (id: number) => {
    await deleteCategory(id);
    setCategories(prev => prev.filter(cat => cat.id !== id));
  };

  return (
    <main className="flex mx-auto max-w-xl w-full min-h-screen flex-col items-center p-16">
      <h1 className="text-5xl font-medium mb-8">Categories</h1>
      
      <div className="w-full flex flex-col gap-4">
        {/* Category List */}
        {categories.map((category) => (
          <CategoryItem
            key={category.id}
            category={category}
            changeCategoryName={changeCategoryName}
            deleteCategory={deleteCategoryItem}
          />
        ))}
      </div>

      {/* Add New Category */}
      <div className="mt-8 w-full">
        <AddCategory createCategory={createCategory} />
      </div>
    </main>
  );
};

export default Categories;