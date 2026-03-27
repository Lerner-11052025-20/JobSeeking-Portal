import { forwardRef } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { cn } from '../../utils/cn';

const Input = forwardRef(({
  label,
  error,
  hint,
  icon,
  suffix,
  className = '',
  containerClassName = '',
  type = 'text',
  ...props
}, ref) => {
  const { isDark } = useTheme();
  const inputClass = isDark ? 'input-dark' : 'input-light';

  return (
    <div className={cn('flex flex-col gap-1.5', containerClassName)}>
      {label && (
        <label className={cn(
          'text-sm font-medium',
          isDark ? 'text-gray-300' : 'text-gray-700'
        )}>
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 z-10 pointer-events-none">
            {icon}
          </div>
        )}
        <input
          ref={ref}
          type={type}
          className={cn(
            inputClass,
            icon && 'pl-10',
            suffix && 'pr-12',
            error && 'border-red-500/70 focus:border-red-500 focus:ring-red-500/30',
            className
          )}
          {...props}
        />
        {suffix && (
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400">
            {suffix}
          </div>
        )}
      </div>
      {error && (
        <p className="text-xs text-red-400 flex items-center gap-1">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
      {hint && !error && (
        <p className={cn('text-xs', isDark ? 'text-gray-500' : 'text-gray-400')}>{hint}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
