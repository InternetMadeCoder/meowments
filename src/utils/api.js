import axios from 'axios';

const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY;
const IMGBB_URL = 'https://api.imgbb.com/1';

export const api = {
  async fetchPosts() {
    try {
      // Note: ImgBB doesn't have a fetch endpoint, so we'll store the posts in localStorage
      const posts = JSON.parse(localStorage.getItem('posts') || '[]');
      return posts;
    } catch (error) {
      console.error('Error fetching posts:', error);
      return [];
    }
  },

  async uploadPost(file, description) {
    try {
      // Convert file to base64
      const base64String = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result.split(',')[1]);
        reader.readAsDataURL(file);
      });

      const formData = new FormData();
      formData.append('key', IMGBB_API_KEY);
      formData.append('image', base64String);
      formData.append('name', file.name);

      const response = await axios.post(`${IMGBB_URL}/upload`, formData);
      const imageData = response.data.data;
      
      const newPost = {
        id: imageData.id,
        imageUrl: imageData.url,  // Use direct URL from ImgBB
        description,
        timestamp: new Date().toISOString(),
        deleteUrl: imageData.delete_url
      };

      // Store in localStorage
      const posts = JSON.parse(localStorage.getItem('posts') || '[]');
      posts.unshift(newPost);
      localStorage.setItem('posts', JSON.stringify(posts));

      return newPost;
    } catch (error) {
      console.error('Upload error:', error);
      throw new Error('Upload failed. Please try again.');
    }
  },

  async deletePost(postId) {
    try {
      // Get current posts from localStorage
      const posts = JSON.parse(localStorage.getItem('posts') || '[]');
      
      // Find the post to be deleted
      const postToDelete = posts.find(post => post.id === postId);
      if (!postToDelete) {
        throw new Error('Post not found');
      }

      // Remove from localStorage
      const updatedPosts = posts.filter(post => post.id !== postId);
      localStorage.setItem('posts', JSON.stringify(updatedPosts));

      return true;
    } catch (error) {
      console.error('Delete error:', error);
      throw error;
    }
  }
};
