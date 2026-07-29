import api from './api';

export const userService = {
  toggleBookmark: async (noteId) => {
    const response = await api.post(`/users/bookmarks/${noteId}`);
    return response.data;
  },

  getBookmarks: async () => {
    const response = await api.get('/users/bookmarks');
    return response.data;
  },
};
