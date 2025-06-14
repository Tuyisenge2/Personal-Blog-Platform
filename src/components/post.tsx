"use client";
import { ChangeEvent, FC, useState } from "react";
import { Post } from "@/types/todoType";

interface Props {
  post: Post;
  changePost: (id: number, title: string, content: string, category_id: number | null) => void;
  deletePost: (id: number) => void;
}

const Post: FC<Props> = ({ post, changePost, deletePost }) => {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.content);
  const [categoryId, setCategoryId] = useState(post.category_id);

  const handleEdit = () => setEditing(true);

  const handleSave = async () => {
    await changePost(post.id, title, content, categoryId);
    setEditing(false);
  };

  const handleCancel = () => {
    setTitle(post.title);
    setContent(post.content);
    setCategoryId(post.category_id);
    setEditing(false);
  };

  const handleDelete = () => {
    if (confirm("Delete this post permanently?")) {
      deletePost(post.id);
    }
  };

  return (
    <div className="p-4 border border-gray-200 rounded-lg mb-4">
      {editing ? (
        <>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 mb-2 border rounded"
            placeholder="Post title"
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-2 mb-2 border rounded min-h-[100px]"
            placeholder="Post content"
          />
          <select
            value={categoryId || ""}
            onChange={(e) => setCategoryId(Number(e.target.value) || null)}
            className="w-full p-2 mb-2 border rounded"
          >
            <option value="">Uncategorized</option>
            {/* Categories would be passed as props in real implementation */}
            <option value="1">Tech</option>
            <option value="2">Lifestyle</option>
          </select>
        </>
      ) : (
        <>
          <h3 className="text-xl font-bold">{post.title}</h3>
          <p className="text-gray-600 mb-2">{post.content}</p>
          <span className="text-sm text-gray-500">
            {new Date(post.created_at).toLocaleDateString()}
          </span>
        </>
      )}

      <div className="flex gap-2 mt-4">
        {editing ? (
          <>
            <button
              onClick={handleSave}
              className="bg-green-600 text-white px-3 py-1 rounded"
            >
              Save
            </button>
            <button
              onClick={handleCancel}
              className="bg-gray-500 text-white px-3 py-1 rounded"
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <button
              onClick={handleEdit}
              className="bg-blue-600 text-white px-3 py-1 rounded"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="bg-red-600 text-white px-3 py-1 rounded"
            >
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Post;