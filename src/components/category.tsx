"use client";
import { ChangeEvent, FC, useState } from "react";
import type { Category } from "@/types/todoType"; // ✅ Type-only import

interface Props {
  category: Category;
  changeCategoryName: (id: number, name: string) => void;
  deleteCategory: (id: number) => void;
}

const Category: FC<Props> = ({
  category,
  changeCategoryName,
  deleteCategory,
}) => {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(category.name);

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleEdit = () => setEditing(true);

  const handleSave = async () => {
    if (name.trim() === "") return;
    changeCategoryName(category.id, name);
    setEditing(false);
  };

  const handleCancel = () => {
    setName(category.name);
    setEditing(false);
  };

  const handleDelete = () => {
    if (confirm(`Delete category "${category.name}" and all its posts?`)) {
      deleteCategory(category.id);
    }
  };

  return (
    <div className="flex items-center gap-2 p-4 border rounded-lg border-gray-200">
      <input
        type="text"
        value={name}
        onChange={handleNameChange}
        readOnly={!editing}
        className="outline-none read-only:border-transparent focus:border border-gray-200 rounded px-2 py-1 w-full"
      />

      <div className="flex gap-1 ml-auto">
        {editing ? (
          <>
            <button
              onClick={handleSave}
              disabled={!name.trim()}
              className="bg-green-600 text-green-50 rounded px-2 w-14 py-1 disabled:opacity-50"
            >
              Save
            </button>
            <button
              onClick={handleCancel}
              className="bg-red-400 w-16 text-red-50 rounded px-2 py-1"
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <button
              onClick={handleEdit}
              className="bg-blue-400 text-blue-50 rounded w-14 px-2 py-1"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="bg-red-400 w-16 text-red-50 rounded px-2 py-1"
            >
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Category;













// "use client";
// import { ChangeEvent, FC, useState } from "react";
// import { Category } from "@/types/todoType";

// interface Props {
//   category: Category;
//   changeCategoryName: (id: number, name: string) => void;
//   deleteCategory: (id: number) => void;
// }

// const Category: FC<Props> = ({
//   category,
//   changeCategoryName,
//   deleteCategory,
// }) => {
//   const [editing, setEditing] = useState(false);
//   const [name, setName] = useState(category.name);

//   const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
//     setName(e.target.value);
//   };

//   const handleEdit = () => setEditing(true);

//   const handleSave = async () => {
//     if (name.trim() === "") return; // Prevent empty names
//     changeCategoryName(category.id, name);
//     setEditing(false);
//   };

//   const handleCancel = () => {
//     setName(category.name);
//     setEditing(false);
//   };

//   const handleDelete = () => {
//     if (confirm(`Delete category "${category.name}" and all its posts?`)) {
//       deleteCategory(category.id);
//     }
//   };

//   return (
//     <div className="flex items-center gap-2 p-4 border rounded-lg border-gray-200">
//       {/* Category Name Input */}
//       <input
//         type="text"
//         value={name}
//         onChange={handleNameChange}
//         readOnly={!editing}
//         className="outline-none read-only:border-transparent focus:border border-gray-200 rounded px-2 py-1 w-full"
//       />

//       {/* Action Buttons */}
//       <div className="flex gap-1 ml-auto">
//         {editing ? (
//           <>
//             <button
//               onClick={handleSave}
//               disabled={!name.trim()}
//               className="bg-green-600 text-green-50 rounded px-2 w-14 py-1 disabled:opacity-50"
//             >
//               Save
//             </button>
//             <button
//               onClick={handleCancel}
//               className="bg-red-400 w-16 text-red-50 rounded px-2 py-1"
//             >
//               Cancel
//             </button>
//           </>
//         ) : (
//           <>
//             <button
//               onClick={handleEdit}
//               className="bg-blue-400 text-blue-50 rounded w-14 px-2 py-1"
//             >
//               Edit
//             </button>
//             <button
//               onClick={handleDelete}
//               className="bg-red-400 w-16 text-red-50 rounded px-2 py-1"
//             >
//               Delete
//             </button>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Category;