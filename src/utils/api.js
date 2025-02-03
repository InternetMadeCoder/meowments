import axios from 'axios';

const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/dlm7van7p';
const CLOUDINARY_UPLOAD_PRESET = 'meowments_upload';
const CLOUDINARY_FOLDER = 'meowments';
const CLOUDINARY_API_KEY = '419321886338194';
const CLOUDINARY_API_SECRET = 'gKW6lQHGDIeGOxlA1ZQ8ksELPtI';

export const api = {
  async fetchPosts() {
    try {
      const response = await axios.get(`${CLOUDINARY_URL}/resources/search`, {
        params: {
          type: 'upload',
          prefix: CLOUDINARY_FOLDER,
          max_results: 500,
        },
        auth: {
          username: CLOUDINARY_API_KEY,
          password: CLOUDINARY_API_SECRET
        }
      });
      return response.data.resources || [];
    } catch (error) {
      console.error('Error fetching posts:', error);
      return [];
    }
  },

  async uploadPost(file, description) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    formData.append('folder', CLOUDINARY_FOLDER);
    formData.append('context', `description=${description}`);

    const response = await axios.post(
      `${CLOUDINARY_URL}/image/upload`,
      formData
    );
    return response.data;
  },

  async deletePost(publicId) {
    return axios.delete(`${CLOUDINARY_URL}/resources/image/upload`, {
      params: { public_ids: [publicId] },
      auth: {
        username: CLOUDINARY_API_KEY,
        password: CLOUDINARY_API_SECRET
      }
    });
  }
};
