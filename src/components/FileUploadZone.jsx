import { Upload } from 'lucide-react';
import { useState } from 'react';

function FileUploadZone({ onUpload, uploading, uploadProgress }) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      onUpload(files[0]);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      onUpload(file);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`
        relative border-2 border-dashed rounded-lg p-6 text-center transition-all
        ${
          isDragging
            ? 'border-emerald-500 bg-emerald-950/20'
            : 'border-zinc-800 hover:border-zinc-700'
        }
        ${uploading ? 'opacity-50 pointer-events-none' : 'cursor-pointer'}
      `}
    >
      <input
        type="file"
        onChange={handleFileSelect}
        disabled={uploading}
        accept=".jpg,.jpeg,.png,.gif,.pdf,.txt,.doc,.docx"
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />

      <Upload
        className={`w-8 h-8 mx-auto mb-2 ${
          isDragging ? 'text-emerald-400' : 'text-zinc-600'
        }`}
      />

      <p className="text-sm text-zinc-400 mb-1">
        {uploading ? 'Uploading...' : 'Drop file here or click to browse'}
      </p>

      <p className="text-xs text-zinc-600">
        Max 10MB • Images, PDFs, Documents
      </p>

      {uploading && uploadProgress > 0 && (
        <div className="mt-3">
          <div className="w-full bg-zinc-800 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-emerald-500 h-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
          <p className="text-xs text-zinc-500 mt-1">{uploadProgress}%</p>
        </div>
      )}
    </div>
  );
}

export default FileUploadZone;
