import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  ExternalLink,
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
  const [imgError, setImgError] = useState(false);

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
        <p className="text-sm font-bold text-slate-800 animate-pulse">Loading note document...</p>
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

  // Build clean URLs for PDF and Thumbnail
  const cleanPdfPath = note.pdf.startsWith('/') ? note.pdf : `/${note.pdf}`;
  const pdfUrl = `${SERVER_BASE_URL}${cleanPdfPath}`;

  const thumbnailUrl = note.thumbnail
    ? `${SERVER_BASE_URL}${note.thumbnail.startsWith('/') ? note.thumbnail : `/${note.thumbnail}`}`
    : null;

  return (
    <div className="space-y-8 max-w-5xl mx-auto py-4">
      {/* Top Breadcrumbs & Back Link */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-900 hover:text-indigo-600 transition"
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
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-2">
            {note.category?.name && <Badge variant="indigo">{note.category.name}</Badge>}
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">{note.title}</h1>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-extrabold text-sm border border-indigo-200 transition shadow-sm"
            >
              <ExternalLink className="w-4 h-4 text-indigo-600" /> Open Full PDF
            </a>
            <Button size="lg" onClick={handleDownload} loading={downloading} icon={Download}>
              Download PDF
            </Button>
          </div>
        </div>

        <p className="text-slate-800 text-sm font-semibold leading-relaxed">{note.description || 'No description provided.'}</p>

        {/* Metadata stats row */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-200 text-xs text-slate-900 font-bold">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-1.5">
              <User className="w-4 h-4 text-indigo-600" />
              <span>Uploaded by <strong className="text-slate-900">{note.uploadedBy?.name || 'Admin'}</strong></span>
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

      {/* Direct Cover / First Page Preview Image Container */}
      <div className="bg-white border border-slate-300 rounded-3xl overflow-hidden shadow-2xl space-y-4 p-6">
        <div className="flex items-center justify-between px-2 pb-3 border-b border-slate-200 text-xs text-slate-900 font-bold">
          <span className="flex items-center gap-2 text-sm font-extrabold text-slate-900">
            <FileText className="w-4 h-4 text-indigo-600" /> Document Preview
          </span>
          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-600 hover:underline font-extrabold flex items-center gap-1.5 bg-indigo-50 px-3 py-1.5 rounded-xl border border-indigo-200"
          >
            <ExternalLink className="w-3.5 h-3.5" /> View PDF Document
          </a>
        </div>

        <div className="w-full min-h-[350px] max-h-[700px] rounded-2xl overflow-hidden bg-slate-50 border border-slate-200 flex items-center justify-center p-4">
          {thumbnailUrl && !imgError ? (
            <img
              src={thumbnailUrl}
              alt={note.title}
              onError={() => setImgError(true)}
              className="max-h-[650px] w-auto object-contain rounded-xl shadow-lg border border-slate-200 mx-auto"
            />
          ) : (
            <div className="flex flex-col items-center justify-center py-12 px-6 text-center space-y-4 max-w-md mx-auto">
              <div className="p-5 bg-indigo-50 rounded-3xl border border-indigo-200 shadow-sm">
                <FileText className="w-16 h-16 text-indigo-600" />
              </div>
              <div>
                <h4 className="text-base font-extrabold text-slate-900">{note.title}</h4>
                <p className="text-xs text-slate-700 font-medium mt-1">PDF Study Guide Document</p>
              </div>
              <a
                href={pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-extrabold text-xs shadow-md shadow-indigo-500/20 transition"
              >
                <ExternalLink className="w-4 h-4" /> Open Full PDF Document
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NoteDetails;
