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

  getAllUsers: async () => {
    const response = await api.get('/users');
    return response.data;
  },

  updateUserRole: async (id, role) => {
    const response = await api.put(`/users/${id}/role`, { role });
    return response.data;
  },

  deleteUser: async (id) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },
};
