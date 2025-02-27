import React, { useState, useEffect } from "react";

type CourtAlbumUploaderProps = {
  onChange: (images: File[]) => void;
  initialImages?: File[]; // Có thể thêm để hỗ trợ edit
};

function CourtAlbumUploader({ onChange, initialImages }: CourtAlbumUploaderProps) {
  const [previewImages, setPreviewImages] = useState<string[]>(initialImages?.map((file) => URL.createObjectURL(file)) || []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const imageFiles = Array.from(files);
      setPreviewImages(imageFiles.map((file) => URL.createObjectURL(file)));
      onChange(imageFiles); // Gửi danh sách File lên parent
    }
  };

  // Cleanup URLs khi component unmount để tránh memory leak
  useEffect(() => {
    return () => {
      previewImages.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewImages]);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-green-600 mb-2">Album</h3>
      <div className="border border-gray-300 rounded-md p-4">
        <label htmlFor="albumUpload" className="block text-gray-700 mb-2">
          Tải lên hình ảnh (chọn nhiều ảnh)
        </label>
        <input
          type="file"
          id="albumUpload"
          name="album"
          accept="image/*"
          multiple
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          onChange={handleImageUpload}
        />
        {previewImages.length > 0 && (
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {previewImages.map((preview, index) => (
              <img
                key={index}
                src={preview}
                alt={`Preview ${index + 1}`}
                className="w-full h-32 object-cover rounded-md"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default CourtAlbumUploader;