import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  FileText,
  Download,
  Eye,
  Bookmark,
  Calendar,
  User,
  ArrowLeft,
  Share2,
  Check,
} from 'lucide-react';
import { noteService } from '../services/noteService';
import { userService } from '../services/userService';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Spinner from '../components/common/Spinner';
import { formatDate, formatNumber } from '../utils/formatters';
import { SERVER_BASE_URL } from '../utils/constants';

export const NoteDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

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
    setDownloading(true);
    try {
      const blobData = await noteService.downloadNote(id);
      const url = window.URL.createObjectURL(new Blob([blobData]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${note.title.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);

      // Increment local download counter display
      setNote((prev) => (prev ? { ...prev, downloads: prev.downloads + 1 } : prev));
    } catch (err) {
      console.error('Download error', err);
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

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <Spinner size="lg" />
        <p className="text-sm text-slate-400 font-medium animate-pulse">Loading note document...</p>
      </div>
    );
  }

  if (!note) {
    return (
      <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-12 text-center my-6">
        <h3 className="text-xl font-bold text-slate-300 mb-2">Note Not Found</h3>
        <p className="text-slate-500 text-sm mb-4">The requested note file may have been moved or removed by an admin.</p>
        <Button variant="outline" onClick={() => navigate('/browse')} icon={ArrowLeft}>
          Back to Browse Notes
        </Button>
      </div>
    );
  }

  const pdfUrl = `${SERVER_BASE_URL}${note.pdf}`;

  return (
    <div className="space-y-8 max-w-5xl mx-auto py-4">
      {/* Top Breadcrumbs & Back Link */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-slate-200 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back
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
      <div className="bg-slate-800/80 border border-slate-700/60 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-2">
            {note.category?.name && <Badge variant="indigo">{note.category.name}</Badge>}
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100">{note.title}</h1>
          </div>

          <Button size="lg" onClick={handleDownload} loading={downloading} icon={Download}>
            Download PDF
          </Button>
        </div>

        <p className="text-slate-300 text-sm leading-relaxed">{note.description || 'No description provided.'}</p>

        {/* Metadata stats row */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-700/50 text-xs text-slate-400">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-1.5">
              <User className="w-4 h-4 text-indigo-400" />
              <span>Uploaded by <strong className="text-slate-200">{note.uploadedBy?.name || 'Admin'}</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-purple-400" />
              <span>{formatDate(note.createdAt)}</span>
            </div>
          </div>

          <div className="flex items-center gap-4 font-semibold text-slate-300">
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4 text-indigo-400" />
              <span>{formatNumber(note.views)} views</span>
            </div>
            <div className="flex items-center gap-1">
              <Download className="w-4 h-4 text-emerald-400" />
              <span>{formatNumber(note.downloads)} downloads</span>
            </div>
          </div>
        </div>
      </div>

      {/* Embedded PDF Document Viewer */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl space-y-3 p-4">
        <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800 text-xs text-slate-400">
          <span className="flex items-center gap-2 font-medium">
            <FileText className="w-4 h-4 text-indigo-400" /> Embedded PDF Preview
          </span>
          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-400 hover:underline"
          >
            Open in new tab
          </a>
        </div>

        <div className="w-full h-[650px] rounded-2xl overflow-hidden bg-slate-950">
          <iframe
            src={`${pdfUrl}#toolbar=0`}
            title={note.title}
            className="w-full h-full border-none"
          />
        </div>
      </div>
    </div>
  );
};

export default NoteDetails;
