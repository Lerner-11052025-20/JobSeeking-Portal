// Format salary range
export const formatSalary = (salary) => {
  if (!salary) return 'Not disclosed';
  const { min, max, currency = 'INR' } = salary;
  const fmt = (n) => {
    if (n >= 100000) return `${(n / 100000).toFixed(1)}L`;
    if (n >= 1000) return `${(n / 1000).toFixed(0)}K`;
    return n;
  };
  if (min && max) return `₹${fmt(min)} - ₹${fmt(max)}`;
  if (min) return `₹${fmt(min)}+`;
  if (max) return `Up to ₹${fmt(max)}`;
  return 'Not disclosed';
};

// Relative time (e.g. "2 days ago")
export const timeAgo = (date) => {
  const now = new Date();
  const past = new Date(date);
  const diff = Math.floor((now - past) / 1000); // seconds
  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return past.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
};

// Truncate text
export const truncate = (str, n = 120) =>
  str && str.length > n ? str.slice(0, n) + '…' : str;

// Job type color mapping
export const jobTypeColor = (type) => {
  const map = {
    'full-time': 'green',
    'part-time': 'yellow',
    contract: 'cyan',
    internship: 'orange',
    remote: 'purple',
  };
  return map[type] || 'gray';
};

// Capitalize first letter
export const capitalize = (str) =>
  str ? str.charAt(0).toUpperCase() + str.slice(1) : '';

// Generate avatar initials
export const getInitials = (name = '') =>
  name.split(' ').slice(0, 2).map(w => w[0]?.toUpperCase()).join('');
// Cloudinary Download URL helper
export const getCloudinaryDownloadUrl = (url, originalName = 'Resume') => {
  if (!url || typeof url !== 'string' || !url.includes('cloudinary.com')) return url;
  
  // Extract extension to ensure the filename maintains its type
  const urlParts = url.split('.');
  const extension = urlParts.length > 1 ? urlParts[urlParts.length - 1].split('?')[0].toLowerCase() : 'pdf';
  
  const cleanName = originalName.replace(/[^a-zA-Z0-9.-]/g, '_');
  const finalFilename = cleanName.endsWith(`.${extension}`) ? cleanName : `${cleanName}.${extension}`;

  // If it's an image/PDF resource, we can use Cloudinary's native attachment transformation
  if (extension === 'pdf' || url.includes('/image/upload/')) {
    return url.replace('/upload/', `/upload/fl_attachment:${finalFilename}/`);
  }

  // Raw file handling (DOC, DOCX) - Cloudinary applies content-disposition automatically,
  // returning direct link
  return url;
};
