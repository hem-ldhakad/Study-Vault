import React, { useEffect, useState } from 'react';
import { Bookmark, Sparkles } from 'lucide-react';
import NoteGrid from '../components/notes/NoteGrid';
import { userService } from '../services/userService';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export const Bookmarks = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchBookmarks = async () => {
      setLoading(true);
      try {
        const res = await userService.getBookmarks();
        if (res?.data?.bookmarks) {
          setBookmarks(res.data.bookmarks);
        }
      } catch (err) {
        console.error('Error fetching bookmarks', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookmarks();
  }, [isAuthenticated, navigate]);

  const handleBookmarkToggle = async (noteId) => {
    try {
      const res = await userService.toggleBookmark(noteId);
      if (res?.bookmarks) {
        // Filter out unbookmarked note from local state
        setBookmarks((prev) => prev.filter((b) => b._id !== noteId));
      }
    } catch (err) {
      console.error('Error toggling bookmark', err);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-100 tracking-tight flex items-center gap-2">
          <Bookmark className="w-7 h-7 text-amber-400 fill-current" /> My Saved Bookmarks
        </h1>
        <p className="text-slate-400 text-sm mt-1">Access your saved study notes and reading list anytime</p>
      </div>

      <NoteGrid
        notes={bookmarks}
        loading={loading}
        onBookmarkToggle={handleBookmarkToggle}
        userBookmarks={bookmarks}
      />
    </div>
  );
};

export default Bookmarks;
