import React, { useEffect, useState } from 'react';
import { useNotes } from '../hooks/useNotes';
import NoteGrid from '../components/notes/NoteGrid';
import { userService } from '../services/userService';
import { useAuth } from '../hooks/useAuth';
import { Filter, RefreshCw } from 'lucide-react';

export const BrowseNotes = () => {
  const {
    notes,
    categories,
    subjects,
    chapters,
    selectedCategory,
    setSelectedCategory,
    selectedSubject,
    setSelectedSubject,
    selectedChapter,
    setSelectedChapter,
    searchQuery,
    setSearchQuery,
    loading,
    clearFilters,
  } = useNotes();

  const { isAuthenticated } = useAuth();
  const [userBookmarks, setUserBookmarks] = useState([]);

  useEffect(() => {
    if (isAuthenticated) {
      userService.getBookmarks().then((res) => {
        if (res?.data?.bookmarks) {
          setUserBookmarks(res.data.bookmarks);
        }
      }).catch(console.error);
    }
  }, [isAuthenticated]);

  const handleBookmarkToggle = async (noteId) => {
    if (!isAuthenticated) return;
    try {
      const res = await userService.toggleBookmark(noteId);
      if (res?.bookmarks) {
        setUserBookmarks(res.bookmarks);
      }
    } catch (err) {
      console.error('Bookmark toggle error', err);
    }
  };

  const filteredSubjects = selectedCategory
    ? subjects.filter((s) => s.category?._id === selectedCategory || s.category === selectedCategory)
    : subjects;

  const filteredChapters = selectedSubject
    ? chapters.filter((c) => c.subject?._id === selectedSubject || c.subject === selectedSubject)
    : chapters;

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Explore Study Notes</h1>
          <p className="text-slate-700 dark:text-slate-300 text-sm font-medium mt-1">Browse, search, and download academic notes across all subjects</p>
        </div>
      </div>

      {/* Filter Control Bar */}
      <div className="glass-panel p-4 rounded-3xl space-y-4 shadow-md">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" /> Filter Options
          </span>
          {(selectedCategory || selectedSubject || selectedChapter || searchQuery) && (
            <button
              onClick={clearFilters}
              className="text-xs font-bold text-indigo-700 dark:text-indigo-300 hover:underline flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" /> Reset Filters
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setSelectedSubject('');
              setSelectedChapter('');
            }}
            className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-2xl px-3 py-2 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>

          <select
            value={selectedSubject}
            onChange={(e) => {
              setSelectedSubject(e.target.value);
              setSelectedChapter('');
            }}
            className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-2xl px-3 py-2 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All Subjects</option>
            {filteredSubjects.map((sub) => (
              <option key={sub._id} value={sub._id}>
                {sub.name}
              </option>
            ))}
          </select>

          <select
            value={selectedChapter}
            onChange={(e) => setSelectedChapter(e.target.value)}
            className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-2xl px-3 py-2 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All Chapters</option>
            {filteredChapters.map((ch) => (
              <option key={ch._id} value={ch._id}>
                {ch.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <NoteGrid
        notes={notes}
        loading={loading}
        onBookmarkToggle={handleBookmarkToggle}
        userBookmarks={userBookmarks}
      />
    </div>
  );
};

export default BrowseNotes;
