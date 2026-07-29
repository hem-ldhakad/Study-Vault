import React from 'react';
import { motion } from 'framer-motion';
import NoteCard from './NoteCard';
import Spinner from '../common/Spinner';

export const NoteGrid = ({
  notes = [],
  loading = false,
  onBookmarkToggle,
  userBookmarks = [],
}) => {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <Spinner size="lg" />
        <p className="text-sm text-slate-400 font-medium animate-pulse">Loading StudyVault notes...</p>
      </div>
    );
  }

  if (!notes || notes.length === 0) {
    return (
      <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-12 text-center my-6">
        <h3 className="text-xl font-bold text-slate-300 mb-2">No Notes Found</h3>
        <p className="text-slate-500 text-sm max-w-md mx-auto">
          We couldn't find any study notes matching your criteria. Try adjusting your search keywords or clearing active category filters.
        </p>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 my-6"
    >
      {notes.map((note) => {
        const isBookmarked = Array.isArray(userBookmarks)
          ? userBookmarks.some((b) => (typeof b === 'object' ? b._id === note._id : b === note._id))
          : false;

        return (
          <motion.div key={note._id} variants={itemVariants}>
            <NoteCard
              note={note}
              onBookmarkToggle={onBookmarkToggle}
              isBookmarked={isBookmarked}
            />
          </motion.div>
        );
      })}
    </motion.div>
  );
};

export default NoteGrid;
