import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Layers } from 'lucide-react';
import { chapterService } from '../../services/chapterService';
import { subjectService } from '../../services/subjectService';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';
import Spinner from '../../components/common/Spinner';
import Toast from '../../components/common/Toast';
import Badge from '../../components/common/Badge';

export const ManageChapters = () => {
  const [chapters, setChapters] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingChapter, setEditingChapter] = useState(null);
  const [chapterName, setChapterName] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [toastMsg, setToastMsg] = useState('');

  const fetchChapters = async () => {
    setLoading(true);
    try {
      const res = await chapterService.getChapters(selectedSubject ? { subject: selectedSubject } : {});
      if (res?.data?.chapters) setChapters(res.data.chapters);
    } catch (err) {
      console.error('Error fetching chapters', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    subjectService.getSubjects().then((res) => {
      if (res?.data?.subjects) setSubjects(res.data.subjects);
    }).catch(console.error);
  }, []);

  useEffect(() => {
    fetchChapters();
  }, [selectedSubject]);

  const handleOpenCreate = () => {
    setEditingChapter(null);
    setChapterName('');
    setSubjectId('');
    setErrorMsg('');
    setModalOpen(true);
  };

  const handleOpenEdit = (chapter) => {
    setEditingChapter(chapter);
    setChapterName(chapter.name);
    setSubjectId(chapter.subject?._id || chapter.subject || '');
    setErrorMsg('');
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!chapterName.trim() || !subjectId) {
      setErrorMsg('Chapter name and Subject selection are required');
      return;
    }

    setSubmitting(true);
    try {
      if (editingChapter) {
        await chapterService.updateChapter(editingChapter._id, {
          name: chapterName.trim(),
          subject: subjectId,
        });
        setToastMsg('Chapter updated successfully');
      } else {
        await chapterService.createChapter({
          name: chapterName.trim(),
          subject: subjectId,
        });
        setToastMsg('Chapter created successfully');
      }
      setModalOpen(false);
      fetchChapters();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this chapter?')) return;
    try {
      await chapterService.deleteChapter(id);
      setToastMsg('Chapter deleted successfully');
      fetchChapters();
    } catch (err) {
      console.error('Error deleting chapter', err);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-100 tracking-tight">Manage Chapters</h1>
          <p className="text-slate-400 text-sm mt-1">Configure module topics and chapter units under subjects</p>
        </div>

        <Button onClick={handleOpenCreate} icon={Plus}>
          Add Chapter
        </Button>
      </div>

      {/* Subject Filter */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center gap-4">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Filter by Subject:</label>
        <select
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
          className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
        >
          <option value="">All Subjects</option>
          {subjects.map((s) => (
            <option key={s._id} value={s._id}>
              {s.name}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="py-16 text-center">
            <Spinner size="lg" />
          </div>
        ) : chapters.length === 0 ? (
          <div className="p-12 text-center text-slate-500">No chapters found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-800/80 text-xs font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-700/60">
                <tr>
                  <th className="px-6 py-4">Chapter Name</th>
                  <th className="px-6 py-4">Subject</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {chapters.map((ch) => (
                  <tr key={ch._id} className="hover:bg-slate-800/40 transition">
                    <td className="px-6 py-4 font-bold text-slate-100 flex items-center gap-3">
                      <Layers className="w-5 h-5 text-pink-400" />
                      {ch.name}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="purple">{ch.subject?.name || 'General'}</Badge>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEdit(ch)}
                        className="p-2 text-slate-400 hover:text-indigo-400 hover:bg-slate-800 rounded-lg transition"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(ch._id)}
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
        title={editingChapter ? 'Edit Chapter' : 'Create New Chapter'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {errorMsg && <p className="text-xs text-rose-400 font-medium">{errorMsg}</p>}
          <Input
            label="Chapter Name *"
            placeholder="e.g. Binary Search Trees & Heaps"
            value={chapterName}
            onChange={(e) => setChapterName(e.target.value)}
            required
          />

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
              Belongs to Subject *
            </label>
            <select
              value={subjectId}
              onChange={(e) => setSubjectId(e.target.value)}
              required
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            >
              <option value="">Select Subject</option>
              {subjects.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <Button type="button" variant="secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={submitting}>
              {editingChapter ? 'Save Changes' : 'Create Chapter'}
            </Button>
          </div>
        </form>
      </Modal>

      <Toast message={toastMsg} type="success" onClose={() => setToastMsg('')} />
    </div>
  );
};

export default ManageChapters;
