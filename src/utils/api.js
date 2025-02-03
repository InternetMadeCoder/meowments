import axios from 'axios';
import { ref, set, remove, get, child } from 'firebase/database';
import { db } from './firebase';

const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY;
const IMGBB_URL = 'https://api.imgbb.com/1';

export const api = {
  async fetchPosts() {
    try {
      const dbRef = ref(db);
      const snapshot = await get(child(dbRef, 'posts'));
      if (snapshot.exists()) {
        const posts = Object.values(snapshot.val());
        return posts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      }
      return [];
    } catch (error) {
      console.error('Error fetching posts:', error);
      return [];
    }
  },

  async uploadPost(file, description) {
    try {
      // Upload to ImgBB
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
        imageUrl: imageData.display_url, // Changed from url to display_url
        description,
        timestamp: new Date().toISOString(),
        deleteUrl: imageData.delete_url
      };

      // Save to Firebase
      await set(ref(db, `posts/${newPost.id}`), newPost);

      return newPost;
    } catch (error) {
      console.error('Upload error:', error);
      throw new Error('Upload failed. Please try again.');
    }
  },

  async deletePost(postId) {
    try {
      await remove(ref(db, `posts/${postId}`));
      return true;
    } catch (error) {
      console.error('Delete error:', error);
      throw error;
    }
  }
};
