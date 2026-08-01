// Format views and downloads counts (e.g., 1200 -> 1.2k)
export const formatNumber = (num) => {
  if (!num) return '0';
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k';
  }
  return num.toString();
};

// Format date strings to friendly format
export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
};

// Truncate text with ellipsis
export const truncateText = (text, maxLength = 80) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// Build clean absolute PDF URL
export const getPDFUrl = (pdfPath, serverBaseUrl = '') => {
  if (!pdfPath) return '';
  if (pdfPath.startsWith('http://') || pdfPath.startsWith('https://') || pdfPath.startsWith('blob:') || pdfPath.startsWith('data:')) {
    return pdfPath;
  }
  const cleanPath = pdfPath.startsWith('/') ? pdfPath : `/${pdfPath}`;
  return `${serverBaseUrl}${cleanPath}`;
};

