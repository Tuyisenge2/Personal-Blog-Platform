"use client";
import { ChangeEvent, FC, useState } from "react";

interface Props {
  createCategory: (name: string) => void;
}

const AddCategory: FC<Props> = ({ createCategory }) => {
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    if (error) setError(""); // Clear error on typing
  };

  const handleAdd = async () => {
    if (!name.trim()) {
      setError("Category name cannot be empty");
      return;
    }
    
    try {
      await createCategory(name.trim());
      setName("");
    } catch (err) {
      setError("Category already exists");
    }
  };

  return (
    <div className="w-full mt-4">
      <div className="flex gap-1">
        <input
          type="text"
          placeholder="Tech, Lifestyle, Work..."
          className={`flex-1 px-3 py-2 border rounded-lg outline-none focus:ring-2 ${
            error ? "border-red-500 focus:ring-red-200" : "border-gray-200 focus:ring-blue-200"
          }`}
          value={name}
          onChange={handleChange}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
        />
        <button
          onClick={handleAdd}
          disabled={!name.trim()}
          className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Add
        </button>
      </div>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default AddCategory;