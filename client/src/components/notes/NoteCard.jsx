import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, Download, Bookmark, BookOpen, User } from 'lucide-react';
import { motion } from 'framer-motion';
import Badge from '../common/Badge';
import { formatNumber } from '../../utils/formatters';
import { SERVER_BASE_URL } from '../../utils/constants';

const PASTEL_THEMES = [
  {
    bg: 'from-sky-50 via-indigo-50/70 to-blue-100/60 border-blue-200',
    badge: 'bg-sky-100 text-sky-950 border-sky-300',
    icon: 'text-indigo-600',
    pdf: 'bg-indigo-600 text-white',
  },
  {
    bg: 'from-emerald-50 via-teal-50/70 to-emerald-100/60 border-emerald-200',
    badge: 'bg-emerald-100 text-emerald-950 border-emerald-300',
    icon: 'text-emerald-600',
    pdf: 'bg-emerald-600 text-white',
  },
  {
    bg: 'from-purple-50 via-fuchsia-50/70 to-violet-100/60 border-purple-200',
    badge: 'bg-purple-100 text-purple-950 border-purple-300',
    icon: 'text-purple-600',
    pdf: 'bg-purple-600 text-white',
  },
  {
    bg: 'from-rose-50 via-pink-50/70 to-rose-100/60 border-rose-200',
    badge: 'bg-rose-100 text-rose-950 border-rose-300',
    icon: 'text-rose-600',
    pdf: 'bg-rose-600 text-white',
  },
  {
    bg: 'from-amber-50 via-yellow-50/70 to-amber-100/60 border-amber-200',
    badge: 'bg-amber-100 text-amber-950 border-amber-300',
    icon: 'text-amber-700',
    pdf: 'bg-amber-600 text-white',
  },
];

const getPastelTheme = (note) => {
  const str = (note.category?.name || note.title || note._id || '');
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash += str.charCodeAt(i);
  }
  return PASTEL_THEMES[hash % PASTEL_THEMES.length];
};

export const NoteCard = ({ note, onBookmarkToggle, isBookmarked = false }) => {
  const [imageError, setImageError] = useState(false);

  const theme = getPastelTheme(note);

  const thumbnailSrc = note.thumbnail && !imageError
    ? `${SERVER_BASE_URL}${note.thumbnail.startsWith('/') ? note.thumbnail : `/${note.thumbnail}`}`
    : null;

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.2 }}
      className="glass-panel bg-white rounded-3xl overflow-hidden flex flex-col justify-between shadow-md border border-slate-200 hover:border-indigo-500 transition-all duration-300 group relative"
    >
      <div>
        {/* Full Card Link Wrapper */}
        <Link to={`/notes/${note._id}`} className="block">
          {/* Card Thumbnail Container */}
          <div className="relative h-48 bg-slate-50 flex items-center justify-center overflow-hidden border-b border-slate-200 cursor-pointer p-4">
            {thumbnailSrc ? (
              <img
                src={thumbnailSrc}
                alt={note.title}
                onError={() => setImageError(true)}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              /* Dynamic Light Pastel Book Cover Card Preview */
              <div className={`w-full h-full flex flex-col justify-between p-4 bg-gradient-to-br ${theme.bg} border text-slate-900 rounded-2xl shadow-inner relative overflow-hidden group-hover:scale-105 transition-transform duration-300`}>
                <div className="absolute -right-6 -bottom-6 w-28 h-28 bg-white/20 rounded-full blur-xl pointer-events-none"></div>

                <div className="flex items-center justify-between z-10">
                  <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-lg border shadow-xs ${theme.badge}`}>
                    {note.category?.name || 'Academic Note'}
                  </span>
                  <BookOpen className={`w-4 h-4 ${theme.icon}`} />
                </div>

                <div className="z-10 space-y-1 my-auto py-1">
                  <h4 className="text-sm font-black text-slate-900 line-clamp-2 leading-tight">
                    {note.title}
                  </h4>
                  <p className="text-[11px] font-bold text-slate-700 truncate">
                    {note.subject?.name || 'Study Guide'}
                  </p>
                </div>

                <div className="flex items-center justify-between text-[10px] font-bold text-slate-800 z-10 pt-1.5 border-t border-slate-200/60">
                  <span className="truncate max-w-[120px] font-bold text-slate-700">{note.chapter?.name || 'Chapter Guide'}</span>
                  <span className={`px-1.5 py-0.5 rounded text-[9px] font-black tracking-wider shadow-xs ${theme.pdf}`}>PDF</span>
                </div>
              </div>
            )}

            {/* Category Badge overlay when custom thumbnail image is present */}
            {thumbnailSrc && note.category?.name && (
              <div className="absolute top-3 left-3 z-10">
                <Badge variant="indigo">{note.category.name}</Badge>
              </div>
            )}
          </div>

          {/* Card Body Details */}
          <div className="p-5 space-y-3">
            <h3 className="font-extrabold text-slate-900 text-base group-hover:text-indigo-600 transition-colors line-clamp-1">
              {note.title}
            </h3>

            <p className="text-xs text-slate-800 font-semibold line-clamp-2 leading-relaxed">
              {note.description || 'No description provided.'}
            </p>

            {/* Subject & Chapter Breadcrumb */}
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
              {note.subject?.name && <span>{note.subject.name}</span>}
              {note.chapter?.name && (
                <>
                  <span className="text-slate-400">•</span>
                  <span className="text-purple-700 truncate">{note.chapter.name}</span>
                </>
              )}
            </div>
          </div>
        </Link>
      </div>

      {/* Bookmark Action Button (Overlay with e.stopPropagation) */}
      {onBookmarkToggle && (
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onBookmarkToggle(note._id);
          }}
          className={`absolute top-3 right-3 p-2 rounded-2xl backdrop-blur-md transition-all shadow-md z-20 ${
            isBookmarked
              ? 'bg-amber-500 text-white shadow-amber-500/30'
              : 'bg-white/90 text-slate-800 hover:text-indigo-600 border border-slate-200'
          }`}
          title={isBookmarked ? 'Remove Bookmark' : 'Bookmark Note'}
        >
          <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
        </button>
      )}

      {/* Card Footer Statistics */}
      <Link to={`/notes/${note._id}`} className="block">
        <div className="px-5 py-3 border-t border-slate-200 bg-slate-100 flex items-center justify-between text-xs text-slate-900 font-black">
          <div className="flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-indigo-600" />
            <span className="truncate max-w-[100px]">{note.uploadedBy?.name || 'Admin'}</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-slate-900">
              <Eye className="w-3.5 h-3.5 text-indigo-600" />
              {formatNumber(note.views)}
            </span>
            <span className="flex items-center gap-1 text-slate-900">
              <Download className="w-3.5 h-3.5 text-emerald-600" />
              {formatNumber(note.downloads)}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default NoteCard;
