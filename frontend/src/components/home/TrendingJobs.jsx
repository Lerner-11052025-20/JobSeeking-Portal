import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Clock, IndianRupee, Bookmark, BookmarkCheck, ExternalLink, Building2, Flame } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth, API } from '../../context/AuthContext';
import { cn } from '../../utils/cn';
import { formatSalary, timeAgo, jobTypeColor } from '../../utils/helpers';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { JobCardSkeleton } from '../ui/Skeleton';
import toast from 'react-hot-toast';

/* ─────────────── Version 2.0 Major — Trending Jobs Section ─────────────── */

const TrendingJobs = () => {
  const { isDark } = useTheme();
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savedJobs, setSavedJobs] = useState(new Set(user?.savedJobs || []));

  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    API.get('/jobs?limit=6&sortBy=createdAt')
      .then(res => setJobs(res.data.jobs || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "0px" }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    return () => observer.disconnect();
  }, []);

  const handleSave = async (jobId) => {
    if (!user) { toast.error('Sign in to save jobs'); return; }
    try {
      await API.put(`/auth/save-job/${jobId}`);
      setSavedJobs(prev => {
        const next = new Set(prev);
        if (next.has(jobId)) { next.delete(jobId); toast.success('Job removed'); }
        else { next.add(jobId); toast.success('Job saved!'); }
        return next;
      });
    } catch { toast.error('Failed to save job'); }
  };

  return (
    <>
      <style>{`
        .tj-reveal {
          opacity: 0;
          transform: translateY(30px) scale(0.98);
          transition: opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .tj-reveal.visible {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      `}</style>

      <section 
        ref={sectionRef} 
        className={cn('py-28 relative overflow-hidden', isDark ? 'bg-dark-bg' : 'bg-slate-50/50')}
      >
        {/* Glow Effect Background V2 */}
        {isDark && (
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-purple/10 blur-[120px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/2" />
        )}

        <div className="container-custom relative z-10">
          {/* Header V2 */}
          <div className={cn('flex flex-col md:flex-row items-start md:items-end justify-between mb-14 gap-6 tj-reveal', isVisible ? 'visible' : '')}>
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Flame className={cn('w-5 h-5', isDark ? 'text-[#F97316]' : 'text-orange-500')} />
                <p className={cn('text-xs font-bold tracking-widest uppercase', isDark ? 'text-[#F97316]' : 'text-orange-500')}>
                  Hot & Actively Hiring
                </p>
              </div>
              <h2 className={cn('text-4xl md:text-5xl font-black font-heading tracking-tight', isDark ? 'text-white' : 'text-gray-900')}>
                Trending <span className="gradient-text-v2 text-transparent bg-clip-text bg-gradient-to-r from-[#8B5CF6] via-[#EC4899] to-[#F97316]">Jobs</span>
              </h2>
            </div>
            
            <Link
              to="/jobs"
              className={cn(
                'group hidden md:flex items-center gap-2 text-[14px] font-bold transition-all duration-300 px-6 py-3 rounded-xl border',
                isDark 
                  ? 'bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-brand-purple/50' 
                  : 'bg-white border-gray-200 text-gray-900 hover:bg-gray-50 hover:border-brand-purple/30 shadow-sm'
              )}
            >
              Explore all roles <ExternalLink className="w-4 h-4 transition-transform group-hover:scale-110 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </div>

          {/* Grid V2 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading
              ? [...Array(6)].map((_, i) => <JobCardSkeleton key={i} isDark={isDark} />)
              : jobs.length === 0
                ? (
                  <div className="col-span-full text-center py-24">
                    <Building2 className="w-16 h-16 mx-auto mb-6 text-gray-600 opacity-50" />
                    <p className={cn('text-xl font-bold tracking-tight', isDark ? 'text-gray-300' : 'text-gray-700')}>No jobs available yet</p>
                    <p className={cn('text-[15px] mt-2 max-w-sm mx-auto', isDark ? 'text-gray-500' : 'text-gray-500')}>Check back later as new opportunities are posted by our partners.</p>
                  </div>
                )
                : jobs.map((job, idx) => (
                  <div 
                    key={job._id}
                    className={cn('tj-reveal h-full', isVisible ? 'visible' : '')}
                    style={{ transitionDelay: `${(idx % 6) * 100}ms` }}
                  >
                    <JobCard
                      job={job}
                      isDark={isDark}
                      isSaved={savedJobs.has(job._id)}
                      onSave={() => handleSave(job._id)}
                    />
                  </div>
                ))}
          </div>

          <div className="mt-10 md:hidden text-center">
            <Link to="/jobs">
              <Button variant="secondary" className="w-full">Explore all roles</Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

/* ─────────────── V2 Job Card Component ─────────────── */
const JobCard = ({ job, isDark, isSaved, onSave }) => {
  const companyInitial = job.company?.[0]?.toUpperCase() || '?';
  const color = jobTypeColor(job.jobType);

  return (
    <div className={cn(
      'group relative flex flex-col justify-between h-full p-6 sm:p-7 rounded-[1.5rem] border transition-all duration-300 cursor-pointer overflow-hidden',
      isDark
        ? 'bg-[#0D0C14] border-brand-purple/35 hover:border-brand-purple/70 hover:-translate-y-2 hover:shadow-[0_15px_40px_-15px_rgba(139,92,246,0.3)]'
        : 'bg-white border-brand-purple/20 hover:border-brand-purple/50 hover:bg-[#F8FAFC] hover:-translate-y-2 hover:shadow-[0_15px_40px_-10px_rgba(0,0,0,0.08)] shadow-sm'
    )}>
      {/* Top Section */}
      <div>
        <div className="flex items-start justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <div className={cn(
              'w-14 h-14 rounded-[1rem] flex items-center justify-center text-white font-black text-xl shrink-0 shadow-lg relative overflow-hidden transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3',
              'bg-gradient-to-br from-[#8B5CF6] to-[#EC4899]'
            )}>
              <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="relative z-10">{companyInitial}</span>
            </div>
            <div>
              <h3 className={cn(
                'font-black text-[17px] leading-snug tracking-tight transition-colors mb-1 line-clamp-1',
                isDark ? 'text-gray-100 group-hover:text-white' : 'text-gray-900 group-hover:text-gray-900'
              )}>
                {job.title}
              </h3>
              <p className={cn('text-[14px] font-medium line-clamp-1', isDark ? 'text-gray-400 group-hover:text-gray-300' : 'text-gray-500')}>
                {job.company}
              </p>
            </div>
          </div>
          
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); onSave(); }}
            className={cn(
              'p-2.5 rounded-xl transition-all duration-300 shrink-0 border relative z-20',
              isSaved
                ? isDark ? 'text-[#8B5CF6] bg-[#8B5CF6]/10 border-[#8B5CF6]/20' : 'text-brand-purple bg-purple-50 border-purple-100'
                : isDark
                  ? 'text-gray-500 border-white/5 bg-white/5 hover:bg-[#8B5CF6]/10 hover:text-[#8B5CF6] hover:border-[#8B5CF6]/30'
                  : 'text-gray-400 border-gray-100 bg-gray-50 hover:bg-purple-50 hover:text-brand-purple hover:border-purple-200'
            )}
            title={isSaved ? 'Unsave' : 'Save job'}
          >
            {isSaved ? <BookmarkCheck className="w-[18px] h-[18px] fill-current" /> : <Bookmark className="w-[18px] h-[18px]" />}
          </button>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-2 mb-6">
          <Badge color={color}>{job.jobType}</Badge>
          {job.category && <Badge color="gray">{job.category}</Badge>}
          {job.experience && <Badge color="cyan">{job.experience}</Badge>}
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-y-3 gap-x-4 mb-6">
          <div className={cn('flex items-center gap-2 text-[13px] font-medium', isDark ? 'text-gray-400' : 'text-gray-600')}>
            <MapPin className={cn('w-4 h-4 shrink-0', isDark ? 'text-[#06B6D4]' : 'text-cyan-600')} /> 
            <span className="truncate">{job.location}</span>
          </div>
          <div className={cn('flex items-center gap-2 text-[13px] font-medium', isDark ? 'text-gray-400' : 'text-gray-600')}>
            <IndianRupee className={cn('w-4 h-4 shrink-0', isDark ? 'text-[#10B981]' : 'text-emerald-600')} /> 
            <span className="truncate">{formatSalary(job.salary)}</span>
          </div>
          <div className={cn('flex items-center gap-2 text-[13px] font-medium col-span-2', isDark ? 'text-gray-400' : 'text-gray-600')}>
            <Clock className={cn('w-4 h-4 shrink-0', isDark ? 'text-[#F59E0B]' : 'text-amber-600')} /> 
            Posted {timeAgo(job.createdAt)}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className={cn(
        'flex items-center justify-between pt-5 mt-auto border-t transition-colors',
        isDark ? 'border-white/5 group-hover:border-white/10' : 'border-gray-100 group-hover:border-gray-200'
      )}>
        <div className={cn('flex items-center gap-2 text-[13px] font-bold')}>
          <div className={cn(
            'w-2 h-2 rounded-full animate-pulse',
            job.applicationsCount > 0 ? 'bg-amber-500' : 'bg-emerald-500'
          )} />
          <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>
            {job.applicationsCount > 0 ? `${job.applicationsCount} applicants` : 'Be the first!'}
          </span>
        </div>
        
        <Link to={`/jobs/${job._id}`} className="relative z-20" onClick={(e) => e.stopPropagation()}>
          <button className={cn(
            'text-[13px] font-black px-4 py-2 rounded-xl transition-all duration-300 transform group-hover:scale-105 active:scale-95',
            isDark
              ? 'bg-white/5 text-gray-200 hover:bg-[#8B5CF6] hover:text-white shadow-sm'
              : 'bg-gray-100 text-gray-800 hover:bg-brand-purple hover:text-white shadow-sm'
          )}>
            View Details
          </button>
        </Link>
      </div>
      
      {/* Decorative Glow */}
      <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-gradient-to-tl from-[#8B5CF6]/20 to-transparent blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
    </div>
  );
};

export { JobCard };
export default TrendingJobs;
