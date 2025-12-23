import { useState, useRef } from 'react';
import api from '../utils/api';
import { Upload, FileText, X } from 'lucide-react';

function UploadCSV({ onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.name.endsWith('.csv')) {
        setFile(droppedFile);
        setMessage({ type: '', text: '' });
      } else {
        setMessage({ type: 'error', text: 'Please upload a CSV file' });
      }
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.name.endsWith('.csv')) {
        setFile(selectedFile);
        setMessage({ type: '', text: '' });
      } else {
        setMessage({ type: 'error', text: 'Please upload a CSV file' });
      }
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage({ type: 'error', text: 'Please select a file' });
      return;
    }

    setUploading(true);
    setMessage({ type: '', text: '' });

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await api.post('/transactions/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      setMessage({ 
        type: 'success', 
        text: `${response.data.count} transactions uploaded successfully!` 
      });
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      
      if (onUploadSuccess) onUploadSuccess();
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Upload failed' 
      });
    } finally {
      setUploading(false);
    }
  };

  const removeFile = () => {
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Upload Bank Statement</h2>
      
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        
        {!file ? (
          <>
            <p className="text-gray-600 mb-2">Drag and drop your CSV file here, or</p>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="text-indigo-600 hover:text-indigo-800 font-semibold"
            >
              Browse Files
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="hidden"
            />
          </>
        ) : (
          <div className="flex items-center justify-center space-x-4">
            <FileText className="w-8 h-8 text-indigo-600" />
            <span className="text-gray-700 font-medium">{file.name}</span>
            <button
              onClick={removeFile}
              className="text-red-500 hover:text-red-700"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        )}
      </div>

      {message.text && (
        <div className={`mt-4 p-4 rounded ${
          message.type === 'success' 
            ? 'bg-green-100 text-green-700 border border-green-400' 
            : 'bg-red-100 text-red-700 border border-red-400'
        }`}>
          {message.text}
        </div>
      )}

      {file && (
        <button
          onClick={handleUpload}
          disabled={uploading}
          className="mt-4 w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition duration-200 font-semibold disabled:bg-indigo-400"
        >
          {uploading ? 'Uploading...' : 'Upload & Process'}
        </button>
      )}
    </div>
  );
}

export default UploadCSV;