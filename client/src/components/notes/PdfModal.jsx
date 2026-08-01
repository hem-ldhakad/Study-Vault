import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, ExternalLink, Download, FileText } from 'lucide-react';
import PdfViewer from './PdfViewer';
import Button from '../common/Button';

export const PdfModal = ({
  isOpen,
  onClose,
  note,
  pdfUrl,
  onDownload,
  downloading = false,
}) => {
  if (!note || !isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
        />

        {/* Modal Window Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: 'spring', duration: 0.35 }}
          className="relative w-full max-w-5xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-2xl z-10 my-auto flex flex-col max-h-[92vh]"
        >
          {/* Header Bar */}
          <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/90 gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="p-2.5 rounded-2xl bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 font-bold shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white truncate">
                  {note.title}
                </h3>
                <p className="text-xs font-bold text-slate-700 dark:text-slate-300 truncate">
                  {note.category?.name || 'Academic Note'} • {note.subject?.name || 'Subject'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="p-2 rounded-2xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition"
                title="Close Viewer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Embedded Viewer Content */}
          <div className="p-2 sm:p-4 overflow-y-auto flex-1 bg-slate-900/5 dark:bg-slate-950/50">
            <PdfViewer
              pdfUrl={pdfUrl}
              title={note.title}
              onDownload={onDownload}
              downloading={downloading}
              className="h-full min-h-[500px]"
            />
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default PdfModal;
