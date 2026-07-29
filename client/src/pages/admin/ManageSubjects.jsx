import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Book } from 'lucide-react';
import { subjectService } from '../../services/subjectService';
import { categoryService } from '../../services/categoryService';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';
import Spinner from '../../components/common/Spinner';
import Toast from '../../components/common/Toast';
import Badge from '../../components/common/Badge';

export const ManageSubjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [subjectName, setSubjectName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [toastMsg, setToastMsg] = useState('');

  const fetchSubjects = async () => {
    setLoading(true);
    try {
      const res = await subjectService.getSubjects(selectedCategory ? { category: selectedCategory } : {});
      if (res?.data?.subjects) setSubjects(res.data.subjects);
    } catch (err) {
      console.error('Error fetching subjects', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    categoryService.getCategories().then((res) => {
      if (res?.data?.categories) setCategories(res.data.categories);
    }).catch(console.error);
  }, []);

  useEffect(() => {
    fetchSubjects();
  }, [selectedCategory]);

  const handleOpenCreate = () => {
    setEditingSubject(null);
    setSubjectName('');
    setCategoryId('');
    setErrorMsg('');
    setModalOpen(true);
  };

  const handleOpenEdit = (subject) => {
    setEditingSubject(subject);
    setSubjectName(subject.name);
    setCategoryId(subject.category?._id || subject.category || '');
    setErrorMsg('');
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!subjectName.trim() || !categoryId) {
      setErrorMsg('Subject name and Category selection are required');
      return;
    }

    setSubmitting(true);
    try {
      if (editingSubject) {
        await subjectService.updateSubject(editingSubject._id, {
          name: subjectName.trim(),
          category: categoryId,
        });
        setToastMsg('Subject updated successfully');
      } else {
        await subjectService.createSubject({
          name: subjectName.trim(),
          category: categoryId,
        });
        setToastMsg('Subject created successfully');
      }
      setModalOpen(false);
      fetchSubjects();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this subject?')) return;
    try {
      await subjectService.deleteSubject(id);
      setToastMsg('Subject deleted successfully');
      fetchSubjects();
    } catch (err) {
      console.error('Error deleting subject', err);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-100 tracking-tight">Manage Subjects</h1>
          <p className="text-slate-400 text-sm mt-1">Configure academic course subjects under department categories</p>
        </div>

        <Button onClick={handleOpenCreate} icon={Plus}>
          Add Subject
        </Button>
      </div>

      {/* Category Filter */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center gap-4">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Filter by Category:</label>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="py-16 text-center">
            <Spinner size="lg" />
          </div>
        ) : subjects.length === 0 ? (
          <div className="p-12 text-center text-slate-500">No subjects found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-800/80 text-xs font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-700/60">
                <tr>
                  <th className="px-6 py-4">Subject Name</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {subjects.map((subj) => (
                  <tr key={subj._id} className="hover:bg-slate-800/40 transition">
                    <td className="px-6 py-4 font-bold text-slate-100 flex items-center gap-3">
                      <Book className="w-5 h-5 text-purple-400" />
                      {subj.name}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="indigo">{subj.category?.name || 'General'}</Badge>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEdit(subj)}
                        className="p-2 text-slate-400 hover:text-indigo-400 hover:bg-slate-800 rounded-lg transition"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(subj._id)}
                        className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingSubject ? 'Edit Subject' : 'Create New Subject'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {errorMsg && <p className="text-xs text-rose-400 font-medium">{errorMsg}</p>}
          <Input
            label="Subject Name *"
            placeholder="e.g. Data Structures"
            value={subjectName}
            onChange={(e) => setSubjectName(e.target.value)}
            required
          />

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
              Belongs to Category *
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              required
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            >
              <option value="">Select Category</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <Button type="button" variant="secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={submitting}>
              {editingSubject ? 'Save Changes' : 'Create Subject'}
            </Button>
          </div>
        </form>
      </Modal>

      <Toast message={toastMsg} type="success" onClose={() => setToastMsg('')} />
    </div>
  );
};

export default ManageSubjects;
