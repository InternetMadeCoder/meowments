import { useState, useRef } from 'react';
import axios from 'axios';
import { usePosts } from '../context/PostsContext';
import { useNavigate } from 'react-router-dom';
import Modal from './Modal';
import { api } from '../utils/api';

const Upload = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [description, setDescription] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const fileInputRef = useRef(null);
  const { addPost } = usePosts();
  const navigate = useNavigate();

  const scrollToExplore = () => {
    const exploreSection = document.getElementById('explore')
    exploreSection?.scrollIntoView({ behavior: 'smooth' })
  }

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

    try {
      await addPost({ file, description });
      setShowSuccessModal(true);
      setFile(null);
      setPreview(null);
      setDescription('');
    } catch (error) {
      console.error('Upload failed:', error);
      alert(error.message || 'Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  // Show loading state in button
  const buttonText = isUploading ? (
    <div className="flex items-center justify-center">
      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      Uploading...
    </div>
  ) : 'Share MeowMent';

  return (
    <>
      <div className="min-h-screen pt-20 px-4">
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-800">Share Your <span className="text-rose-500">MeowMent</span></h1>
            <p className="mt-2 text-gray-600">Upload your favorite furry friend moments!</p>
          </div>

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
              accept="image/*,video/*"
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

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 
                focus:border-rose-500 focus:ring-1 focus:ring-rose-500
                text-gray-900 placeholder-gray-400 bg-white"
              rows="3"
              placeholder="Tell us about this meowment..."
            />
          </div>

          <button
            onClick={handleUpload}
            disabled={!file || isUploading}
            className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-colors
              ${!file || isUploading ? 'bg-gray-300 cursor-not-allowed' : 'bg-rose-500 hover:bg-rose-600'}`}
          >
            {buttonText}
          </button>

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

      <Modal 
        isOpen={showSuccessModal} 
        onClose={() => {
          setShowSuccessModal(false);
          document.getElementById('explore')?.scrollIntoView({ behavior: 'smooth' });
        }}
      >
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Upload Successful!</h3>
          <p className="text-gray-600 mb-6">Your moment has been shared successfully.</p>
          <button
            onClick={() => {
              setShowSuccessModal(false);
              document.getElementById('explore')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-6 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors"
          >
            View Post
          </button>
        </div>
      </Modal>
    </>
  );
};

export default Upload;
