import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, FileText, Image as ImageIcon, Plus, CheckCircle } from 'lucide-react';
import { useNotes } from '../../hooks/useNotes';
import { noteService } from '../../services/noteService';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Toast from '../../components/common/Toast';

export const UploadNote = () => {
  const { categories, subjects, chapters, fetchNotes } = useNotes();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [subject, setSubject] = useState('');
  const [chapter, setChapter] = useState('');
  const [tags, setTags] = useState('');

  const [pdfFile, setPdfFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [toastMsg, setToastMsg] = useState('');

  const filteredSubjects = category
    ? subjects.filter((s) => s.category?._id === category || s.category === category)
    : subjects;

  const filteredChapters = subject
    ? chapters.filter((c) => c.subject?._id === subject || c.subject === subject)
    : chapters;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!title || !category || !subject || !chapter) {
      setErrorMsg('Please fill in title, category, subject, and chapter');
      return;
    }

    if (!pdfFile) {
      setErrorMsg('PDF file attachment is required');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('category', category);
    formData.append('subject', subject);
    formData.append('chapter', chapter);
    formData.append('tags', tags);
    formData.append('pdf', pdfFile);
    if (thumbnailFile) {
      formData.append('thumbnail', thumbnailFile);
    }

    setSubmitting(true);
    try {
      await noteService.createNote(formData);
      await fetchNotes();
      setToastMsg('Note uploaded successfully!');
      setTimeout(() => {
        navigate('/admin/notes');
      }, 1000);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to upload note');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Upload Study Note</h1>
        <p className="text-slate-700 dark:text-slate-300 text-sm font-medium mt-1">Publish new PDF notes and study materials to StudyVault</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {errorMsg && (
          <div className="p-4 bg-rose-50 border border-rose-300 text-rose-800 text-sm rounded-2xl font-bold">
            {errorMsg}
          </div>
        )}

        <Card hover={false} className="space-y-4">
          <h3 className="font-extrabold text-lg text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-3">
            Note Information
          </h3>

          <Input
            label="Note Title *"
            type="text"
            placeholder="e.g., Advanced Operating System Concepts & CPU Scheduling"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 mb-1">
              Description
            </label>
            <textarea
              rows={3}
              placeholder="Brief summary of what this study guide covers..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-2xl p-3 text-sm text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 mb-1">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  setSubject('');
                  setChapter('');
                }}
                className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-2xl px-3 py-2.5 text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 mb-1">
                Subject *
              </label>
              <select
                value={subject}
                onChange={(e) => {
                  setSubject(e.target.value);
                  setChapter('');
                }}
                className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-2xl px-3 py-2.5 text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              >
                <option value="">Select Subject</option>
                {filteredSubjects.map((sub) => (
                  <option key={sub._id} value={sub._id}>
                    {sub.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 mb-1">
                Chapter *
              </label>
              <select
                value={chapter}
                onChange={(e) => setChapter(e.target.value)}
                className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-2xl px-3 py-2.5 text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              >
                <option value="">Select Chapter</option>
                {filteredChapters.map((ch) => (
                  <option key={ch._id} value={ch._id}>
                    {ch.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <Input
            label="Tags (Comma Separated)"
            type="text"
            placeholder="os, cpu, scheduling, computer-science"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
        </Card>

        {/* File Attachments Card */}
        <Card hover={false} className="space-y-4">
          <h3 className="font-extrabold text-lg text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-3">
            File Attachments
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* PDF Upload */}
            <div className="p-4 border-2 border-dashed border-indigo-300 dark:border-indigo-800 rounded-3xl text-center space-y-2 bg-indigo-50/50 dark:bg-indigo-950/20">
              <FileText className="w-8 h-8 text-indigo-600 dark:text-indigo-400 mx-auto" />
              <p className="text-xs font-bold text-slate-900 dark:text-white">PDF Document *</p>
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => setPdfFile(e.target.files[0])}
                className="text-xs text-slate-700 dark:text-slate-300 file:mr-2 file:py-1 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-indigo-600 file:text-white cursor-pointer"
                required
              />
              {pdfFile && <p className="text-xs text-emerald-600 font-bold truncate">{pdfFile.name}</p>}
            </div>

            {/* Thumbnail Upload */}
            <div className="p-4 border-2 border-dashed border-slate-300 dark:border-slate-800 rounded-3xl text-center space-y-2 bg-slate-50 dark:bg-slate-900">
              <ImageIcon className="w-8 h-8 text-slate-500 mx-auto" />
              <p className="text-xs font-bold text-slate-900 dark:text-white">Thumbnail Cover Image (Optional)</p>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setThumbnailFile(e.target.files[0])}
                className="text-xs text-slate-700 dark:text-slate-300 file:mr-2 file:py-1 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-slate-700 file:text-white cursor-pointer"
              />
              {thumbnailFile && <p className="text-xs text-emerald-600 font-bold truncate">{thumbnailFile.name}</p>}
            </div>
          </div>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" size="lg" loading={submitting} icon={CheckCircle}>
            Publish Note
          </Button>
        </div>
      </form>

      <Toast message={toastMsg} type="success" onClose={() => setToastMsg('')} />
    </div>
  );
};

export default UploadNote;
