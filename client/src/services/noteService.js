import api from './api';

export const noteService = {
  getNotes: async (params = {}) => {
    const response = await api.get('/notes', { params });
    return response.data;
  },

  getRecentNotes: async () => {
    const response = await api.get('/notes/recent');
    return response.data;
  },

  getPopularNotes: async () => {
    const response = await api.get('/notes/popular');
    return response.data;
  },

  getNoteById: async (id) => {
    const response = await api.get(`/notes/${id}`);
    return response.data;
  },

  downloadNote: async (id) => {
    const response = await api.get(`/notes/${id}/download`, {
      responseType: 'blob',
    });
    return response.data;
  },

  createNote: async (formData) => {
    const response = await api.post('/notes', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  updateNote: async (id, formData) => {
    const response = await api.put(`/notes/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  deleteNote: async (id) => {
    const response = await api.delete(`/notes/${id}`);
    return response.data;
  },
};
