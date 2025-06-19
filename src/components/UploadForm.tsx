"use client";

import { useState } from 'react';
import { useCloudinary } from '@/hooks/useCloudinary';

export default function UploadForm() {
  const [image, setImage] = useState<string | null>(null);
  const { uploadImage, loading, error } = useCloudinary();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const url = await uploadImage(file);
      setImage(url);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} disabled={loading} />
      {loading && <p>Uploading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {image && (
        <div className="mt-4">
          <img src={image} alt="Uploaded preview" className="max-w-full" />
        </div>
      )}
    </div>
  );
}