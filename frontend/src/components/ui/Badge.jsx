import { useTheme } from '../../context/ThemeContext';
import { cn } from '../../utils/cn';

const Badge = ({ children, color = 'purple', className = '' }) => {
  const { isDark } = useTheme();

  const colorMap = {
    purple: isDark
      ? 'bg-brand-purple/15 text-brand-violet border-brand-purple/25'
      : 'bg-purple-50 text-purple-700 border-purple-200',
    green: isDark
      ? 'bg-accent-green/15 text-accent-green border-accent-green/25'
      : 'bg-green-50 text-green-700 border-green-200',
    yellow: isDark
      ? 'bg-accent-yellow/15 text-accent-yellow border-accent-yellow/25'
      : 'bg-yellow-50 text-yellow-700 border-yellow-200',
    red: isDark
      ? 'bg-red-500/15 text-red-400 border-red-500/25'
      : 'bg-red-50 text-red-700 border-red-200',
    cyan: isDark
      ? 'bg-accent-cyan/15 text-accent-cyan border-accent-cyan/25'
      : 'bg-cyan-50 text-cyan-700 border-cyan-200',
    orange: isDark
      ? 'bg-brand-orange/15 text-brand-orange border-brand-orange/25'
      : 'bg-orange-50 text-orange-700 border-orange-200',
    gray: isDark
      ? 'bg-gray-700/50 text-gray-300 border-gray-600'
      : 'bg-gray-100 text-gray-600 border-gray-200',
  };

  return (
    <span className={cn(
      'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border',
      colorMap[color] || colorMap.purple,
      className
    )}>
      {children}
    </span>
  );
};

export default Badge;
