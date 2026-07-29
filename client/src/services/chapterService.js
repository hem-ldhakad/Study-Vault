import api from './api';

export const chapterService = {
  getChapters: async (params = {}) => {
    const response = await api.get('/chapters', { params });
    return response.data;
  },

  createChapter: async (data) => {
    const response = await api.post('/chapters', data);
    return response.data;
  },

  updateChapter: async (id, data) => {
    const response = await api.put(`/chapters/${id}`, data);
    return response.data;
  },

  deleteChapter: async (id) => {
    const response = await api.delete(`/chapters/${id}`);
    return response.data;
  },
};
