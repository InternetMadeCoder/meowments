import { useState, useRef } from 'react';
import axios from 'axios';

const Upload = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [description, setDescription] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result);
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile?.type.startsWith('image/') || droppedFile?.type.startsWith('video/')) {
      setFile(droppedFile);
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result);
      reader.readAsDataURL(droppedFile);
    } else {
      alert('Please upload a valid image or video file.');
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'your_upload_preset');  // Use your Cloudinary upload preset here
    formData.append('description', description); // Send description as metadata

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/dlm7van7p/image/upload`, // Cloudinary endpoint
        formData
      );
      console.log('Upload successful:', response.data.secure_url);
      setUploadedImageUrl(response.data.secure_url); // Store the uploaded image/video URL
      // Reset form
      setFile(null);
      setPreview(null);
      setDescription('');
    } catch (err) {
      console.error('Upload failed:', err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 px-4">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800">Share Your <span className="text-rose-500">MeowMent</span></h1>
          <p className="mt-2 text-gray-600">Upload your favorite furry friend moments!</p>
        </div>

        {/* Upload Area */}
        <div 
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors
            ${isDragging ? 'border-rose-500 bg-rose-50' : 'border-gray-300 hover:border-rose-400'}
            ${!file ? 'cursor-pointer' : ''}`}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => !file && fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept="image/*,video/*" // Allows image and video files
            onChange={handleFileChange}
          />

          {preview ? (
            <div className="space-y-4">
              <img src={preview} alt="Preview" className="max-h-96 mx-auto rounded-lg shadow-lg" />
              <button 
                onClick={() => { setFile(null); setPreview(null); }}
                className="text-sm text-rose-500 hover:text-rose-600"
              >
                Remove image
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-6xl text-rose-300">📸</div>
              <div className="text-gray-500">
                Drag and drop your image or video here, or click to browse
              </div>
            </div>
          )}
        </div>

        {/* Description Input */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
            rows="3"
            placeholder="Tell us about this moment..."
          />
        </div>

        {/* Upload Button */}
        <button
          onClick={handleUpload}
          disabled={!file || isUploading}
          className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-colors
            ${!file || isUploading 
              ? 'bg-gray-300 cursor-not-allowed' 
              : 'bg-rose-500 hover:bg-rose-600'
            }`}
        >
          {isUploading ? 'Uploading...' : 'Share MeowMent'}
        </button>

        {/* Display Uploaded Image URL */}
        {uploadedImageUrl && (
          <div className="mt-8 text-center">
            <p className="text-lg text-gray-600">Uploaded image/video URL:</p>
            <a href={uploadedImageUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500">
              {uploadedImageUrl}
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default Upload;
