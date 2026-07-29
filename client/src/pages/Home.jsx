import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Sparkles, BookOpen, Download, ArrowRight, ShieldCheck, FileCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from '../components/common/Button';
import NoteGrid from '../components/notes/NoteGrid';
import { noteService } from '../services/noteService';
import { userService } from '../services/userService';
import { useAuth } from '../hooks/useAuth';
import { useNotes } from '../hooks/useNotes';

export const Home = () => {
  const [recentNotes, setRecentNotes] = useState([]);
  const [popularNotes, setPopularNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState('');
  const [userBookmarks, setUserBookmarks] = useState([]);

  const { isAuthenticated } = useAuth();
  const { setSearchQuery } = useNotes();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [recentRes, popularRes] = await Promise.all([
          noteService.getRecentNotes(),
          noteService.getPopularNotes(),
        ]);
        if (recentRes?.data?.notes) setRecentNotes(recentRes.data.notes);
        if (popularRes?.data?.notes) setPopularNotes(popularRes.data.notes);

        if (isAuthenticated) {
          const bookmarkRes = await userService.getBookmarks();
          if (bookmarkRes?.data?.bookmarks) {
            setUserBookmarks(bookmarkRes.data.bookmarks);
          }
        }
      } catch (err) {
        console.error('Error loading home data', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setSearchQuery(searchInput.trim());
      navigate('/browse');
    }
  };

  const handleBookmarkToggle = async (noteId) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    try {
      const res = await userService.toggleBookmark(noteId);
      if (res?.bookmarks) {
        setUserBookmarks(res.bookmarks);
      }
    } catch (err) {
      console.error('Error toggling bookmark', err);
    }
  };

  return (
    <div className="space-y-16 py-4">
      {/* Hero Section */}
      <section className="relative rounded-3xl bg-gradient-to-b from-indigo-100/80 via-purple-50/60 to-slate-50 dark:from-slate-800/90 dark:via-slate-900/90 dark:to-slate-900 border border-slate-300 dark:border-indigo-800/50 p-8 sm:p-12 lg:p-16 overflow-hidden shadow-2xl transition-colors">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/15 dark:bg-indigo-500/20 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-500/15 dark:bg-purple-500/20 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-3xl mx-auto text-center space-y-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-pill text-indigo-800 dark:text-indigo-200 text-xs font-bold uppercase tracking-wider shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            Verified Academic Notes & Study Guides
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-tight"
          >
            Accelerate Your Learning with{' '}
            <span className="pastel-gradient-text">
              StudyVault
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-slate-800 dark:text-slate-200 text-base sm:text-lg max-w-2xl mx-auto font-medium leading-relaxed"
          >
            Discover, download, and share high-quality lecture notes, study materials, and subject summaries curated for academic excellence.
          </motion.p>

          {/* Hero Search Bar */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            onSubmit={handleSearchSubmit}
            className="flex items-center gap-2 max-w-xl mx-auto glass-panel p-2.5 rounded-2xl shadow-xl backdrop-blur-xl"
          >
            <div className="flex-1 flex items-center pl-3 gap-2">
              <Search className="w-5 h-5 text-slate-600 dark:text-slate-300" />
              <input
                type="text"
                placeholder="Search notes by subject, chapter, or keyword..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full bg-transparent text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 text-sm focus:outline-none font-bold"
              />
            </div>
            <Button type="submit" size="md">
              Search
            </Button>
          </motion.form>

          {/* Quick Metrics Badge Row */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-8 text-xs font-bold text-slate-800 dark:text-slate-200 border-t border-slate-300 dark:border-slate-700/80">
            <div className="flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>PDF & Image Notes</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Categorized Topics</span>
            </div>
            <div className="flex items-center gap-2">
              <Download className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span>Instant Downloads</span>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Notes Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" /> Popular Study Notes
            </h2>
            <p className="text-slate-700 dark:text-slate-300 text-xs font-medium mt-1">Most downloaded and viewed notes on StudyVault</p>
          </div>
          <Link
            to="/popular"
            className="text-xs font-bold text-indigo-700 dark:text-indigo-300 hover:underline flex items-center gap-1 group"
          >
            View All <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <NoteGrid
          notes={popularNotes.slice(0, 4)}
          loading={loading}
          onBookmarkToggle={handleBookmarkToggle}
          userBookmarks={userBookmarks}
        />
      </section>

      {/* Recent Uploads Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-600 dark:text-indigo-400" /> Recent Uploads
            </h2>
            <p className="text-slate-700 dark:text-slate-300 text-xs font-medium mt-1">Latest academic notes added to the platform</p>
          </div>
          <Link
            to="/recent"
            className="text-xs font-bold text-indigo-700 dark:text-indigo-300 hover:underline flex items-center gap-1 group"
          >
            View All <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <NoteGrid
          notes={recentNotes.slice(0, 4)}
          loading={loading}
          onBookmarkToggle={handleBookmarkToggle}
          userBookmarks={userBookmarks}
        />
      </section>
    </div>
  );
};

export default Home;
