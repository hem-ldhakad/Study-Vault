import api from './api';

export const subjectService = {
  getSubjects: async (params = {}) => {
    const response = await api.get('/subjects', { params });
    return response.data;
  },

  createSubject: async (data) => {
    const response = await api.post('/subjects', data);
    return response.data;
  },

  updateSubject: async (id, data) => {
    const response = await api.put(`/subjects/${id}`, data);
    return response.data;
  },

  deleteSubject: async (id) => {
    const response = await api.delete(`/subjects/${id}`);
    return response.data;
  },
};
