import { FileText } from 'lucide-react';
import { useEffect, useState } from 'react';
import api from '../api';
import FileItem from './FileItem';
import FileUploadZone from './FileUploadZone';

function FilesSection({ taskId, isExpanded, canUpload, canDelete }) {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isExpanded && files.length === 0) {
      fetchFiles();
    }
  }, [isExpanded, taskId]);

  const fetchFiles = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get(`/tasks/${taskId}/files`);
      setFiles(response.data);
    } catch (err) {
      console.error('Failed to fetch files:', err);
      setError('Failed to load files');
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (file) => {
    if (file.size > 10 * 1024 * 1024) {
      setError('File too large (max 10MB)');
      return;
    }

    setUploading(true);
    setUploadProgress(0);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await api.post(`/tasks/${taskId}/files`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(progress);
        },
      });

      setFiles([...files, response.data]);
      setUploadProgress(0);
    } catch (err) {
      console.error('Failed to upload file:', err);
      setError(err.response?.data?.detail || 'Failed to upload file');
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = async (fileId, filename) => {
    try {
      const response = await api.get(`/files/${fileId}`, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to download file:', err);
      setError('Failed to download file');
    }
  };

  const handleDelete = async (fileId) => {
    if (!window.confirm('Delete this file?')) return;

    try {
      await api.delete(`/files/${fileId}`);
      setFiles(files.filter((f) => f.id !== fileId));
    } catch (err) {
      console.error('Failed to delete file:', err);
      setError('Failed to delete file');
    }
  };

  if (!isExpanded) return null;

  return (
    <div className="mt-4 pt-4 border-t border-zinc-800">
      <div className="flex items-center gap-2 mb-3">
        <FileText size={16} className="text-zinc-500" />
        <h4 className="text-sm font-bold text-zinc-400 uppercase tracking-wider">
          Attachments ({files.length})
        </h4>
      </div>

      {error && (
        <div className="mb-3 p-2 bg-red-950/30 border border-red-900/50 rounded text-red-400 text-xs">
          {error}
        </div>
      )}

      {canUpload && (
        <FileUploadZone
          onUpload={handleUpload}
          uploading={uploading}
          uploadProgress={uploadProgress}
        />
      )}

      {loading ? (
        <div className="flex justify-center py-6">
          <div className="w-6 h-6 border-2 border-zinc-700 border-t-emerald-500 rounded-full animate-spin"></div>
        </div>
      ) : files.length > 0 ? (
        <div className="mt-3 space-y-2">
          {files.map((file) => (
            <FileItem
              key={file.id}
              file={file}
              onDownload={handleDownload}
              onDelete={handleDelete}
              canDelete={canDelete}
            />
          ))}
        </div>
      ) : (
        <p className="text-center py-6 text-zinc-600 text-sm">
          No files attached
        </p>
      )}
    </div>
  );
}

export default FilesSection;
