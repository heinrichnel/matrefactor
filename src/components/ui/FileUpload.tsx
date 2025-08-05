import React, { useState, DragEvent, ChangeEvent } from "react";

const FileUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-6">
      <label
        htmlFor="file-upload"
        className={`w-full max-w-md p-6 border-2 border-dashed rounded-xl cursor-pointer text-center transition ${
          isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input id="file-upload" type="file" className="hidden" onChange={handleFileSelect} />
        <p className="text-gray-500">
          {file ? (
            <span className="text-green-600 font-semibold">{file.name}</span>
          ) : (
            "Drag & drop a file here, or click to select"
          )}
        </p>
      </label>
      {file && (
        <button
          onClick={() => alert(`Uploading: ${file.name}`)}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Upload
        </button>
      )}
    </div>
  );
};

export default FileUpload;
