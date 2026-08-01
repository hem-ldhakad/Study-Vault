import React from 'react';
import {
  ExternalLink,
  Download,
  FileText,
  CheckCircle2,
  Sparkles,
  BookOpen,
} from 'lucide-react';
import Button from '../common/Button';

export const PdfViewer = ({
  pdfUrl,
  title = 'PDF Document',
  onDownload,
  downloading = false,
  className = '',
}) => {
  return (
    <div
      className={`bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl p-6 sm:p-10 flex flex-col items-center text-center justify-center gap-6 ${className}`}
    >
      <div className="p-4 rounded-3xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 shadow-lg shadow-indigo-600/10">
        <FileText className="w-12 h-12" />
      </div>

      <div className="space-y-2 max-w-xl">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold">
          <CheckCircle2 className="w-3.5 h-3.5" /> Verified Original Academic Document
        </div>
        <h3 className="text-xl sm:text-2xl font-black text-white leading-snug">{title}</h3>
        <p className="text-xs sm:text-sm text-slate-400 font-semibold leading-relaxed">
          Open this PDF document directly in your browser's full reader to view high-resolution colored pages, diagrams, and full content.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        <a
          href={pdfUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="px-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-sm transition flex items-center gap-2.5 shadow-xl shadow-indigo-600/30 hover:scale-105 active:scale-95"
        >
          <ExternalLink className="w-4 h-4" />
          <span>Open Full PDF Document</span>
        </a>

        {onDownload && (
          <Button
            size="lg"
            variant="secondary"
            onClick={onDownload}
            loading={downloading}
            icon={Download}
            className="!py-3.5 !px-6 text-sm font-extrabold"
          >
            Download PDF
          </Button>
        )}
      </div>
    </div>
  );
};

export default PdfViewer;
