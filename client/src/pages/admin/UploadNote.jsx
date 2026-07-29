import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, FileText, Image, ArrowLeft, CheckCircle } from 'lucide-react';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Card from '../../components/common/Card';
import Toast from '../../components/common/Toast';
import { noteService } from '../../services/noteService';
import { categoryService } from '../../services/categoryService';
import { subjectService } from '../../services/subjectService';
import { chapterService } from '../../services/chapterService';

export const UploadNote = () => {
  const [categories, setCategories] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [chapters, setChapters] = useState([]);

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

  const navigate = useNavigate();

  useEffect(() => {
    categoryService.getCategories().then((res) => {
      if (res?.data?.categories) setCategories(res.data.categories);
    }).catch(console.error);
  }, []);

  useEffect(() => {
    if (category) {
      subjectService.getSubjects({ category }).then((res) => {
        if (res?.data?.subjects) setSubjects(res.data.subjects);
      }).catch(console.error);
    } else {
      setSubjects([]);
    }
    setSubject('');
    setChapters([]);
    setChapter('');
  }, [category]);

  useEffect(() => {
    if (subject) {
      chapterService.getChapters({ subject }).then((res) => {
        if (res?.data?.chapters) setChapters(res.data.chapters);
      }).catch(console.error);
    } else {
      setChapters([]);
    }
    setChapter('');
  }, [subject]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!title || !category || !subject || !chapter) {
      setErrorMsg('Please fill in Title, Category, Subject, and Chapter');
      return;
    }

    if (!pdfFile) {
      setErrorMsg('Please select a PDF document file');
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
      setToastMsg('Note uploaded successfully!');
      setTimeout(() => {
        navigate('/admin/notes');
      }, 1500);
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to upload note';
      setErrorMsg(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-100 tracking-tight">Upload New Study Note</h1>
          <p className="text-slate-400 text-sm mt-1">Publish PDF notes and study guides for students</p>
        </div>

        <button
          onClick={() => navigate('/admin/notes')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-slate-200 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Cancel
        </button>
      </div>

      <Card hover={false} className="p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {errorMsg && (
            <div className="p-4 bg-rose-950/80 border border-rose-800 text-rose-300 text-sm rounded-xl">
              {errorMsg}
            </div>
          )}

          {/* Title Input */}
          <Input
            label="Note Title *"
            placeholder="e.g. Data Structures & Algorithms Complete Notes"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          {/* Description Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Description
            </label>
            <textarea
              rows={3}
              placeholder="Provide a brief summary of what this note covers..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl p-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
          </div>

          {/* Cascading Dropdowns Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
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

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Subject *
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
                disabled={!category}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 disabled:opacity-50"
              >
                <option value="">Select Subject</option>
                {subjects.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Chapter *
              </label>
              <select
                value={chapter}
                onChange={(e) => setChapter(e.target.value)}
                required
                disabled={!subject}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 disabled:opacity-50"
              >
                <option value="">Select Chapter</option>
                {chapters.map((ch) => (
                  <option key={ch._id} value={ch._id}>
                    {ch.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Tags Input */}
          <Input
            label="Tags (Comma Separated)"
            placeholder="e.g. computer-science, algorithms, midterm-prep"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />

          {/* File Upload Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
            {/* PDF File Input */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                PDF Document File *
              </label>
              <div className="border-2 border-dashed border-indigo-900/60 bg-slate-900/60 rounded-2xl p-4 text-center hover:border-indigo-500 transition">
                <FileText className="w-8 h-8 text-indigo-400 mx-auto mb-2" />
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setPdfFile(e.target.files[0])}
                  className="block w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-500 cursor-pointer"
                />
                {pdfFile && (
                  <p className="text-xs text-emerald-400 mt-2 font-medium truncate">
                    Selected: {pdfFile.name}
                  </p>
                )}
              </div>
            </div>

            {/* Thumbnail Image Input */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                Thumbnail Image (Optional)
              </label>
              <div className="border-2 border-dashed border-slate-800 bg-slate-900/60 rounded-2xl p-4 text-center hover:border-slate-600 transition">
                <Image className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setThumbnailFile(e.target.files[0])}
                  className="block w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-slate-700 file:text-slate-200 hover:file:bg-slate-600 cursor-pointer"
                />
                {thumbnailFile && (
                  <p className="text-xs text-emerald-400 mt-2 font-medium truncate">
                    Selected: {thumbnailFile.name}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <Button type="submit" size="lg" loading={submitting} icon={Upload}>
              Publish Study Note
            </Button>
          </div>
        </form>
      </Card>

      <Toast message={toastMsg} type="success" onClose={() => setToastMsg('')} />
    </div>
  );
};

export default UploadNote;
