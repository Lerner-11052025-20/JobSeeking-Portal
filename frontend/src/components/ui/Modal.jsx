import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { cn } from '../../utils/cn';

const sizeMap = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  full: 'max-w-full mx-4',
};

const Modal = ({ isOpen, onClose, title, children, size = 'md', className = '' }) => {
  const { isDark } = useTheme();
  const overlayRef = useRef();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose();
  };

  return createPortal(
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
      style={{ backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
    >
      <div className={cn(
        'relative w-full rounded-2xl animate-fade-up',
        sizeMap[size],
        isDark
          ? 'bg-dark-card border border-dark-border shadow-elevated'
          : 'bg-white border border-light-border shadow-card-light',
        className
      )}>
        {/* Header */}
        {title && (
          <div className={cn(
            'flex items-center justify-between px-6 py-4 border-b',
            isDark ? 'border-dark-border' : 'border-light-border'
          )}>
            <h3 className={cn('text-lg font-semibold', isDark ? 'text-white' : 'text-gray-900')}>
              {title}
            </h3>
            <button
              onClick={onClose}
              className={cn(
                'p-1.5 rounded-lg transition-colors',
                isDark ? 'text-gray-400 hover:text-white hover:bg-white/10' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
              )}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}
        {/* Body */}
        <div className="p-6">{children}</div>
        {/* Close btn without title */}
        {!title && (
          <button
            onClick={onClose}
            className={cn(
              'absolute top-4 right-4 p-1.5 rounded-lg transition-colors',
              isDark ? 'text-gray-400 hover:text-white hover:bg-white/10' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
            )}
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>,
    document.body
  );
};

export default Modal;
