import { useTheme } from '../../context/ThemeContext';
import { cn } from '../../utils/cn';

export const SkeletonBox = ({ className = '', isDark }) => {
  return (
    <div className={cn(
      'rounded-xl animate-pulse-shimmer relative overflow-hidden',
      isDark ? 'bg-white/5' : 'bg-gray-100',
      className
    )}>
      {/* Shimmer Overlay */}
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/[0.08] to-transparent"></div>
    </div>
  );
};

export const JobCardSkeleton = ({ isDark }) => (
  <div className={cn(
    'rounded-[2.5rem] p-7 border transition-all duration-300',
    isDark ? 'bg-[#13131A] border-white/5' : 'bg-white border-gray-100 shadow-sm'
  )}>
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between">
        <SkeletonBox className="w-16 h-16 rounded-2xl" isDark={isDark} />
        <SkeletonBox className="w-10 h-10 rounded-xl" isDark={isDark} />
      </div>
      <div className="space-y-3">
        <SkeletonBox className="h-6 w-3/4 rounded-lg" isDark={isDark} />
        <SkeletonBox className="h-4 w-1/2 rounded-lg opacity-60" isDark={isDark} />
      </div>
      <div className="flex gap-2.5">
        <SkeletonBox className="h-7 w-20 rounded-full" isDark={isDark} />
        <SkeletonBox className="h-7 w-24 rounded-full" isDark={isDark} />
      </div>
      <div className="pt-6 border-t border-white/5 flex gap-4">
        <SkeletonBox className="h-4 flex-1 rounded-lg" isDark={isDark} />
        <SkeletonBox className="h-4 flex-1 rounded-lg" isDark={isDark} />
      </div>
      <SkeletonBox className="h-12 w-full rounded-2xl" isDark={isDark} />
    </div>
  </div>
);

export const PageSkeleton = () => {
  const { isDark } = useTheme();
  return (
    <div className="container-custom py-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {[...Array(6)].map((_, i) => (
        <JobCardSkeleton key={i} isDark={isDark} />
      ))}
    </div>
  );
};
