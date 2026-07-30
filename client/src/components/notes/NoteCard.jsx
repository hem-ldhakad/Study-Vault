import React from 'react';
import { Link } from 'react-router-dom';
import { Eye, Download, Bookmark, FileText, User } from 'lucide-react';
import { motion } from 'framer-motion';
import Badge from '../common/Badge';
import { formatNumber } from '../../utils/formatters';
import { SERVER_BASE_URL } from '../../utils/constants';

export const NoteCard = ({ note, onBookmarkToggle, isBookmarked = false }) => {
  const thumbnailSrc = note.thumbnail
    ? `${SERVER_BASE_URL}${note.thumbnail}`
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
          <div className="relative h-48 bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 flex items-center justify-center overflow-hidden border-b border-slate-200 cursor-pointer">
            {thumbnailSrc ? (
              <img
                src={thumbnailSrc}
                alt={note.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="flex flex-col items-center gap-2 text-indigo-700">
                <div className="p-3 bg-white rounded-2xl shadow-sm border border-slate-200">
                  <FileText className="w-8 h-8 text-indigo-600" />
                </div>
                <span className="text-[11px] font-black uppercase tracking-wider text-slate-800">PDF Document</span>
              </div>
            )}

            {/* Category Badge */}
            {note.category?.name && (
              <div className="absolute top-3 left-3">
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
          className={`absolute top-3 right-3 p-2 rounded-2xl backdrop-blur-md transition-all shadow-md z-10 ${
            isBookmarked
              ? 'bg-amber-500 text-white shadow-amber-500/30'
              : 'bg-white text-slate-800 hover:text-indigo-600 border border-slate-200'
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
