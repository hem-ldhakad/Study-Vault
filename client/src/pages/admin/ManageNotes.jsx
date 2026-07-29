import React, { useEffect, useState } from 'react';
import { Search, Edit, Trash2, Plus, Eye, Download, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { noteService } from '../../services/noteService';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Spinner from '../../components/common/Spinner';
import Modal from '../../components/common/Modal';
import Toast from '../../components/common/Toast';
import { formatDate, formatNumber } from '../../utils/formatters';

export const ManageNotes = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedNote, setSelectedNote] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const res = await noteService.getNotes({ search });
      if (res?.data?.notes) setNotes(res.data.notes);
    } catch (err) {
      console.error('Error fetching notes list', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [search]);

  const handleDelete = async () => {
    if (!selectedNote) return;
    setDeleting(true);
    try {
      await noteService.deleteNote(selectedNote._id);
      setToastMsg('Note deleted successfully');
      setDeleteModalOpen(false);
      setSelectedNote(null);
      fetchNotes();
    } catch (err) {
      console.error('Error deleting note', err);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-100 tracking-tight">Manage Notes Catalog</h1>
          <p className="text-slate-400 text-sm mt-1">View, search, edit, or delete published study notes</p>
        </div>

        <Link to="/admin/upload">
          <Button icon={Plus}>Upload New Note</Button>
        </Link>
      </div>

      {/* Search Filter */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
        <div className="relative max-w-md">
          <input
            type="text"
            placeholder="Search notes by title or tags..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 pl-10 pr-4 py-2 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          />
          <Search className="w-4 h-4 absolute left-3.5 top-2.5 text-slate-400" />
        </div>
      </div>

      {/* Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="py-16 text-center">
            <Spinner size="lg" />
          </div>
        ) : notes.length === 0 ? (
          <div className="p-12 text-center text-slate-500">No notes match your search.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-800/80 text-xs font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-700/60">
                <tr>
                  <th className="px-4 py-3">Note Title</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Subject</th>
                  <th className="px-4 py-3">Views / Downloads</th>
                  <th className="px-4 py-3">Uploaded</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {notes.map((note) => (
                  <tr key={note._id} className="hover:bg-slate-800/40 transition">
                    <td className="px-4 py-3 font-semibold text-slate-100 max-w-xs truncate">{note.title}</td>
                    <td className="px-4 py-3">
                      <Badge variant="indigo">{note.category?.name || 'General'}</Badge>
                    </td>
                    <td className="px-4 py-3 text-slate-400">{note.subject?.name || '-'}</td>
                    <td className="px-4 py-3 text-xs text-slate-400">
                      <span className="mr-3">{formatNumber(note.views)} views</span>
                      <span className="text-emerald-400">{formatNumber(note.downloads)} downloads</span>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-500">{formatDate(note.createdAt)}</td>
                    <td className="px-4 py-3 text-right space-x-2">
                      <button
                        onClick={() => {
                          setSelectedNote(note);
                          setDeleteModalOpen(true);
                        }}
                        className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition"
                        title="Delete Note"
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

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Confirm Note Deletion"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-300">
            Are you sure you want to delete <strong className="text-white">{selectedNote?.title}</strong>?
            This will remove the document and permanently delete its associated files from disk.
          </p>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <Button variant="secondary" onClick={() => setDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" loading={deleting} onClick={handleDelete}>
              Delete Note
            </Button>
          </div>
        </div>
      </Modal>

      <Toast message={toastMsg} type="success" onClose={() => setToastMsg('')} />
    </div>
  );
};

export default ManageNotes;
