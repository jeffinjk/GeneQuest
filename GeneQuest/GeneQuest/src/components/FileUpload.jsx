import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, CheckCircle, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FileUpload = () => {
  const navigate = useNavigate();
  const isAuthenticated = false; // This would be replaced with actual auth state

  const onDrop = useCallback((acceptedFiles) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    // Handle file upload logic here
    console.log(acceptedFiles);
  }, [isAuthenticated, navigate]);

  const { getRootProps, getInputProps, isDragActive, acceptedFiles } = useDropzone({
    onDrop,
    accept: {
      'text/plain': ['.fasta', '.vcf'],
    },
    maxSize: 50 * 1024 * 1024, // 50MB
  });

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${
            isDragActive
              ? 'border-indigo-500 bg-indigo-50'
              : 'border-gray-300 hover:border-indigo-400'
          }`}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-2 text-sm text-gray-600">
          {isAuthenticated 
            ? "Drag and drop your FASTA or VCF files here, or click to select files"
            : "Please login to upload files"}
        </p>
        <p className="text-xs text-gray-500 mt-1">Maximum file size: 50MB</p>
      </div>

      {acceptedFiles.length > 0 && isAuthenticated && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Uploaded files:</h4>
          <ul className="space-y-2">
            {acceptedFiles.map((file) => (
              <li
                key={file.name}
                className="flex items-center space-x-2 text-sm text-gray-600 bg-gray-50 p-2 rounded"
              >
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>{file.name}</span>
                <span className="text-gray-400">({(file.size / 1024).toFixed(1)} KB)</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FileUpload;