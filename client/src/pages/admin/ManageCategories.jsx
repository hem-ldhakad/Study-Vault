import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Folder } from 'lucide-react';
import { categoryService } from '../../services/categoryService';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';
import Spinner from '../../components/common/Spinner';
import Toast from '../../components/common/Toast';
import { formatDate } from '../../utils/formatters';

export const ManageCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryName, setCategoryName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [toastMsg, setToastMsg] = useState('');

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await categoryService.getCategories();
      if (res?.data?.categories) setCategories(res.data.categories);
    } catch (err) {
      console.error('Error fetching categories', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleOpenCreate = () => {
    setEditingCategory(null);
    setCategoryName('');
    setErrorMsg('');
    setModalOpen(true);
  };

  const handleOpenEdit = (category) => {
    setEditingCategory(category);
    setCategoryName(category.name);
    setErrorMsg('');
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!categoryName.trim()) {
      setErrorMsg('Category name is required');
      return;
    }

    setSubmitting(true);
    try {
      if (editingCategory) {
        await categoryService.updateCategory(editingCategory._id, { name: categoryName.trim() });
        setToastMsg('Category updated successfully');
      } else {
        await categoryService.createCategory({ name: categoryName.trim() });
        setToastMsg('Category created successfully');
      }
      setModalOpen(false);
      fetchCategories();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    try {
      await categoryService.deleteCategory(id);
      setToastMsg('Category deleted successfully');
      fetchCategories();
    } catch (err) {
      console.error('Error deleting category', err);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-100 tracking-tight">Manage Categories</h1>
          <p className="text-slate-400 text-sm mt-1">Add, edit, or delete academic department categories</p>
        </div>

        <Button onClick={handleOpenCreate} icon={Plus}>
          Add Category
        </Button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="py-16 text-center">
            <Spinner size="lg" />
          </div>
        ) : categories.length === 0 ? (
          <div className="p-12 text-center text-slate-500">No categories found. Click 'Add Category' to create one.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-800/80 text-xs font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-700/60">
                <tr>
                  <th className="px-6 py-4">Category Name</th>
                  <th className="px-6 py-4">Created Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {categories.map((cat) => (
                  <tr key={cat._id} className="hover:bg-slate-800/40 transition">
                    <td className="px-6 py-4 font-bold text-slate-100 flex items-center gap-3">
                      <Folder className="w-5 h-5 text-indigo-400" />
                      {cat.name}
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500">{formatDate(cat.createdAt)}</td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEdit(cat)}
                        className="p-2 text-slate-400 hover:text-indigo-400 hover:bg-slate-800 rounded-lg transition"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(cat._id)}
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
        title={editingCategory ? 'Edit Category' : 'Create New Category'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {errorMsg && <p className="text-xs text-rose-400 font-medium">{errorMsg}</p>}
          <Input
            label="Category Name *"
            placeholder="e.g. Computer Science"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            required
          />
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <Button type="button" variant="secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={submitting}>
              {editingCategory ? 'Save Changes' : 'Create Category'}
            </Button>
          </div>
        </form>
      </Modal>

      <Toast message={toastMsg} type="success" onClose={() => setToastMsg('')} />
    </div>
  );
};

export default ManageCategories;
