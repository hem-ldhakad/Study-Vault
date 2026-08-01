import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Download,
  Eye,
  Bookmark,
  Calendar,
  User,
  ArrowLeft,
  Share2,
  Check,
  ExternalLink,
  BookOpen,
} from 'lucide-react';
import { noteService } from '../services/noteService';
import { userService } from '../services/userService';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Spinner from '../components/common/Spinner';
import PdfViewer from '../components/notes/PdfViewer';
import { formatDate, formatNumber, getPDFUrl } from '../utils/formatters';
import { SERVER_BASE_URL } from '../utils/constants';

export const NoteDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const viewerRef = useRef(null);

  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchNote = async () => {
      setLoading(true);
      try {
        const res = await noteService.getNoteById(id);
        if (res?.data?.note) {
          setNote(res.data.note);
        }

        if (isAuthenticated) {
          const bookmarkRes = await userService.getBookmarks();
          if (bookmarkRes?.data?.bookmarks) {
            const hasBookmarked = bookmarkRes.data.bookmarks.some(
              (b) => (typeof b === 'object' ? b._id === id : b === id)
            );
            setIsBookmarked(hasBookmarked);
          }
        }
      } catch (err) {
        console.error('Error loading note details', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNote();
  }, [id, isAuthenticated]);

  const handleDownload = async () => {
    if (!note) return;
    setDownloading(true);
    try {
      const blobData = await noteService.downloadNote(id);
      const blob = new Blob([blobData], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const filename = `${(note.title || 'Note_Document').replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);

      // Increment local download counter display
      setNote((prev) => (prev ? { ...prev, downloads: (prev.downloads || 0) + 1 } : prev));
    } catch (err) {
      console.error('Download blob error, using fallback direct download', err);
      // Fallback: direct window download trigger
      const directPdfUrl = getPDFUrl(note.pdf, SERVER_BASE_URL);
      window.open(directPdfUrl, '_blank');
    } finally {
      setDownloading(false);
    }
  };

  const handleBookmarkToggle = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    try {
      const res = await userService.toggleBookmark(id);
      setIsBookmarked(res.isBookmarked);
    } catch (err) {
      console.error('Bookmark error', err);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const scrollToViewer = () => {
    if (viewerRef.current) {
      viewerRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <Spinner size="lg" />
        <p className="text-sm font-bold text-slate-800 animate-pulse">Loading note details...</p>
      </div>
    );
  }

  if (!note) {
    return (
      <div className="bg-white border border-slate-300 rounded-3xl p-12 text-center my-6 shadow-md">
        <h3 className="text-xl font-extrabold text-slate-900 mb-2">Note Not Found</h3>
        <p className="text-slate-800 text-sm font-semibold mb-4">The requested note file may have been moved or removed by an admin.</p>
        <Button variant="outline" onClick={() => navigate('/browse')} icon={ArrowLeft}>
          Back to Browse Notes
        </Button>
      </div>
    );
  }

  const pdfUrl = getPDFUrl(note.pdf, SERVER_BASE_URL);

  return (
    <div className="space-y-8 max-w-5xl mx-auto py-4">
      {/* Top Breadcrumbs & Back Link */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-slate-200 hover:text-indigo-600 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Notes
        </button>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleShare} icon={copied ? Check : Share2}>
            {copied ? 'Link Copied!' : 'Share'}
          </Button>
          <Button
            variant={isBookmarked ? 'primary' : 'secondary'}
            size="sm"
            onClick={handleBookmarkToggle}
            icon={Bookmark}
          >
            {isBookmarked ? 'Bookmarked' : 'Bookmark'}
          </Button>
        </div>
      </div>

      {/* Note Header Info Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              {note.category?.name && <Badge variant="indigo">{note.category.name}</Badge>}
              {note.subject?.name && <Badge variant="purple">{note.subject.name}</Badge>}
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">{note.title}</h1>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-extrabold text-sm border border-indigo-200 transition shadow-sm"
            >
              <ExternalLink className="w-4 h-4 text-indigo-600" /> Open PDF Document
            </a>
            <Button size="lg" onClick={handleDownload} loading={downloading} icon={Download}>
              Download PDF
            </Button>
          </div>
        </div>

        <p className="text-slate-800 dark:text-slate-200 text-sm font-semibold leading-relaxed">{note.description || 'No description provided.'}</p>

        {/* Metadata stats row */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-slate-200 font-bold">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-1.5">
              <User className="w-4 h-4 text-indigo-600" />
              <span>Uploaded by <strong className="text-slate-900 dark:text-white">{note.uploadedBy?.name || 'Admin'}</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-purple-600" />
              <span>{formatDate(note.createdAt)}</span>
            </div>
          </div>

          <div className="flex items-center gap-4 font-black">
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4 text-indigo-600" />
              <span>{formatNumber(note.views)} views</span>
            </div>
            <div className="flex items-center gap-1">
              <Download className="w-4 h-4 text-emerald-600" />
              <span>{formatNumber(note.downloads)} downloads</span>
            </div>
          </div>
        </div>
      </div>

      {/* Embedded Interactive PDF Viewer Component Section */}
      <div ref={viewerRef} className="space-y-4 pt-2">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-600" />
            PDF Document Reader
          </h2>
          <span className="text-xs font-bold text-slate-500">Interactive Reader Mode</span>
        </div>

        <PdfViewer
          pdfUrl={pdfUrl}
          title={note.title}
          onDownload={handleDownload}
          downloading={downloading}
        />
      </div>
    </div>
  );
};

export default NoteDetails;

