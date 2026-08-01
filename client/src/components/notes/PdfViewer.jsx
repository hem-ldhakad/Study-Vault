import React, { useState, useRef } from 'react';
import {
  ExternalLink,
  Download,
  Maximize2,
  Minimize2,
  RefreshCw,
  FileText,
  AlertCircle,
} from 'lucide-react';
import Button from '../common/Button';
import Spinner from '../common/Spinner';

export const PdfViewer = ({
  pdfUrl,
  title = 'PDF Document',
  onDownload,
  downloading = false,
  className = '',
}) => {
  const containerRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [viewerHeight, setViewerHeight] = useState('h-[650px]'); // options: h-[450px], h-[650px], h-[850px]
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [iframeError, setIframeError] = useState(false);

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current
        .requestFullscreen()
        .then(() => setIsFullscreen(true))
        .catch((err) => console.error('Error entering fullscreen:', err));
    } else {
      document
        .exitFullscreen()
        .then(() => setIsFullscreen(false))
        .catch((err) => console.error('Error exiting fullscreen:', err));
    }
  };

  const cycleHeight = () => {
    if (viewerHeight === 'h-[450px]') setViewerHeight('h-[650px]');
    else if (viewerHeight === 'h-[650px]') setViewerHeight('h-[850px]');
    else setViewerHeight('h-[450px]');
  };

  return (
    <div
      ref={containerRef}
      className={`glass-panel bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xl flex flex-col transition-all duration-300 ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none border-none h-screen w-screen' : ''
      } ${className}`}
    >
      {/* Top Interactive Toolbar Header */}
      <div className="bg-slate-900 text-white px-5 py-3.5 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 shadow-md">
        <div className="flex items-center gap-3 min-w-0">
          <div className="p-2 rounded-xl bg-indigo-600/30 text-indigo-400 border border-indigo-500/30 shrink-0">
            <FileText className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-extrabold text-white truncate max-w-xs sm:max-w-md">
              {title}
            </h3>
            <span className="text-[11px] text-slate-400 font-bold tracking-wide flex items-center gap-1.5">
              <span>PDF Document</span>
              <span>•</span>
              <span className="text-emerald-400">Ready to View & Download</span>
            </span>
          </div>
        </div>

        {/* Toolbar Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Height Adjuster Button */}
          {!isFullscreen && (
            <button
              onClick={cycleHeight}
              className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition flex items-center gap-1 border border-slate-700"
              title="Change Viewer Height"
            >
              <span>{viewerHeight === 'h-[450px]' ? 'Compact' : viewerHeight === 'h-[650px]' ? 'Normal' : 'Large'}</span>
            </button>
          )}

          {/* Fullscreen Button */}
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition border border-slate-700"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Reader'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* Reload Frame Button */}
          <button
            onClick={() => {
              setIframeLoaded(false);
              setIframeError(false);
            }}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition border border-slate-700"
            title="Reload PDF Viewer"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          {/* Open in New Tab Button */}
          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs transition flex items-center gap-1.5 shadow-md shadow-indigo-600/30"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Open PDF</span>
          </a>

          {/* Download Button */}
          {onDownload && (
            <Button
              size="sm"
              variant="secondary"
              onClick={onDownload}
              loading={downloading}
              icon={Download}
              className="!py-1.5 !px-3.5 text-xs font-extrabold"
            >
              Download PDF
            </Button>
          )}
        </div>
      </div>

      {/* Embedded PDF Canvas / Iframe Container */}
      <div className={`relative w-full ${isFullscreen ? 'flex-1' : viewerHeight} bg-slate-950 flex items-center justify-center overflow-hidden`}>
        {/* Spinner Loader while loading */}
        {!iframeLoaded && !iframeError && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-950/90 text-white gap-3 p-4">
            <Spinner size="lg" />
            <p className="text-sm font-bold text-slate-300 animate-pulse">
              Loading PDF Document Preview...
            </p>
          </div>
        )}

        {/* Fallback View if iframe encounters error */}
        {iframeError ? (
          <div className="flex flex-col items-center justify-center p-8 text-center bg-slate-900 text-white gap-4 max-w-lg mx-auto rounded-3xl border border-slate-800 shadow-2xl">
            <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <AlertCircle className="w-8 h-8" />
            </div>
            <div>
              <h4 className="text-lg font-black text-white">Direct PDF Viewer Fallback</h4>
              <p className="text-xs text-slate-400 font-semibold mt-1">
                Your browser or extension prevented embedded PDF rendering. You can open the file in a new window or download it directly.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href={pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs transition flex items-center gap-2 shadow-lg"
              >
                <ExternalLink className="w-4 h-4" /> Open PDF Document
              </a>
              {onDownload && (
                <Button size="md" onClick={onDownload} loading={downloading} icon={Download}>
                  Download PDF
                </Button>
              )}
            </div>
          </div>
        ) : (
          /* Main PDF Iframe */
          <iframe
            src={`${pdfUrl}#toolbar=1&navpanes=1&scrollbar=1`}
            title={title}
            onLoad={() => setIframeLoaded(true)}
            onError={() => setIframeError(true)}
            className="w-full h-full border-none bg-slate-900"
          />
        )}
      </div>
    </div>
  );
};

export default PdfViewer;
