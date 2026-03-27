import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, MapPin, SlidersHorizontal, X, ChevronDown, Bookmark, BookmarkCheck, Clock, IndianRupee, Building2, Briefcase } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth, API } from '../context/AuthContext';
import { cn } from '../utils/cn';
import { formatSalary, timeAgo, jobTypeColor } from '../utils/helpers';
import Badge from '../components/ui/Badge';
import MainLayout from '../layouts/MainLayout';
import { JobCardSkeleton } from '../components/ui/Skeleton';
import toast from 'react-hot-toast';

const JOB_TYPES = ['full-time', 'part-time', 'contract', 'internship', 'remote'];
const CATEGORIES = ['IT', 'Engineering', 'Marketing', 'Finance', 'Design', 'Sales', 'HR', 'Operations', 'Healthcare', 'Education'];
const EXPERIENCE = ['fresher', '1-2 years', '3-5 years', '5-10 years', '10+ years'];

const FilterSection = ({ title, children, isDark }) => {
  const [open, setOpen] = useState(true);
  return (
    <div className={cn('pb-4 mb-4 border-b', isDark ? 'border-white/5' : 'border-gray-100')}>
      <button
        onClick={() => setOpen(p => !p)}
        className={cn('w-full flex items-center justify-between text-[11px] font-black uppercase tracking-[0.15em] mb-2 px-1', isDark ? 'text-gray-500' : 'text-gray-400')}
      >
        {title}
        <ChevronDown className={cn('w-3.5 h-3.5 transition-transform duration-300', open && 'rotate-180')} />
      </button>
      {open && <div className="mt-4 space-y-2.5 px-1">{children}</div>}
    </div>
  );
};

const CheckFilter = ({ label, value, checked, onChange, isDark }) => (
  <label 
    onClick={() => onChange(value)}
    className={cn(
      'flex items-center gap-3 cursor-pointer group p-2 rounded-xl transition-all duration-300',
      checked 
        ? (isDark ? 'bg-brand-purple/10 text-brand-violet' : 'bg-brand-purple/5 text-brand-purple')
        : (isDark ? 'hover:bg-white/5 text-gray-400' : 'hover:bg-gray-50 text-gray-600')
    )}
  >
    <div className={cn(
      'w-4 h-4 rounded-md border-2 flex items-center justify-center transition-all',
      checked 
        ? 'bg-brand-purple border-brand-purple' 
        : (isDark ? 'border-white/10' : 'border-gray-200 group-hover:border-brand-purple/30')
    )}>
      {checked && <X className="w-2.5 h-2.5 text-white stroke-[4]" />}
    </div>
    <span className={cn('text-xs font-bold capitalize tracking-tight')}>
      {label}
    </span>
  </label>
);

const FindJobsPage = () => {
  const { isDark } = useTheme();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [savedJobs, setSavedJobs] = useState(new Set(user?.savedJobs || []));
  const [mobileFilters, setMobileFilters] = useState(false);

  // Filter state
  const [filters, setFilters] = useState({
    q: searchParams.get('q') || '',
    location: searchParams.get('location') || '',
    jobType: [],
    category: searchParams.get('category') ? [searchParams.get('category')] : [],
    experience: [],
  });

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.q) params.set('search', filters.q);
      if (filters.location) params.set('location', filters.location);
      if (filters.jobType.length) params.set('jobType', filters.jobType.join(','));
      if (filters.category.length) params.set('category', filters.category[0]);
      if (filters.experience.length) params.set('experience', filters.experience[0]);
      params.set('page', page);
      params.set('limit', 12);
      const res = await API.get(`/jobs?${params}`);
      setJobs(res.data.jobs || []);
      setTotal(res.data.pagination?.total || 0);
    } catch {
      setJobs([]);
    } finally {
      setLoading(false);
    }
  }, [filters, page]);

  useEffect(() => { fetchJobs(); }, [fetchJobs]);

  const toggleFilter = (key, value) => {
    setFilters(p => {
      const list = p[key];
      const isSelected = list.includes(value);
      return {
        ...p,
        [key]: isSelected ? list.filter(v => v !== value) : (key === 'experience' ? [value] : [...list, value])
      };
    });
    setPage(1);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchJobs();
  };

  const clearFilters = () => {
    setFilters({ q: '', location: '', jobType: [], category: [], experience: [] });
    setPage(1);
  };

  const handleSave = async (jobId) => {
    if (!user) { toast.error('Sign in to save jobs'); return; }
    try {
      await API.put(`/auth/save-job/${jobId}`);
      setSavedJobs(prev => {
        const next = new Set(prev);
        if (next.has(jobId)) { next.delete(jobId); toast.success('Removed from saved'); }
        else { next.add(jobId); toast.success('Saved to profile!'); }
        return next;
      });
    } catch { toast.error('Failed to save'); }
  };

  const Sidebar = () => (
    <aside className="w-80 shrink-0 space-y-6 sticky top-28 h-fit pb-10">
      <div className={cn(
        'p-7 rounded-[2.5rem] border overflow-hidden relative',
        isDark ? 'bg-[#13131A] border-white/5' : 'bg-white border-gray-100 shadow-xl shadow-gray-200/20'
      )}>
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className={cn('w-4 h-4', isDark ? 'text-brand-purple' : 'text-brand-purple')} />
            <h2 className={cn('font-black text-xs uppercase tracking-[0.2em]', isDark ? 'text-white' : 'text-gray-900')}>Refine Search</h2>
          </div>
          <button onClick={clearFilters} className="text-[10px] font-black text-brand-purple hover:underline uppercase tracking-widest bg-brand-purple/10 px-3 py-1 rounded-full transition-all hover:bg-brand-purple hover:text-white">Reset All</button>
        </div>

        <div className="space-y-6">
          <FilterSection title="Employment" isDark={isDark}>
            {JOB_TYPES.map(t => (
              <CheckFilter key={t} label={t} value={t} checked={filters.jobType.includes(t)} onChange={v => toggleFilter('jobType', v)} isDark={isDark} />
            ))}
          </FilterSection>

          <FilterSection title="Industry" isDark={isDark}>
            {CATEGORIES.map(c => (
              <CheckFilter key={c} label={c} value={c} checked={filters.category.includes(c)} onChange={v => toggleFilter('category', v)} isDark={isDark} />
            ))}
          </FilterSection>

          <FilterSection title="Experience" isDark={isDark}>
            {EXPERIENCE.map(e => (
              <CheckFilter key={e} label={e} value={e} checked={filters.experience.includes(e)} onChange={v => toggleFilter('experience', v)} isDark={isDark} />
            ))}
          </FilterSection>
        </div>
      </div>
      
      {/* Promo Card */}
      <div className="p-6 rounded-[2.5rem] bg-gradient-to-br from-brand-purple via-brand-pink to-brand-orange text-white relative overflow-hidden group shadow-xl shadow-brand-purple/20">
         <div className="absolute top-0 right-0 w-24 h-24 bg-white/20 blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700"></div>
         <h3 className="text-xl font-black font-heading mb-2 relative z-10">Premium AI Buddy</h3>
         <p className="text-xs font-bold text-white/80 leading-relaxed mb-4 relative z-10">Get smarter matching and priority application visibility.</p>
         <button className="bg-white text-brand-purple text-[10px] font-black uppercase tracking-widest px-6 py-2.5 rounded-full relative z-10 hover:scale-105 active:scale-95 transition-all">Go Pro</button>
      </div>
    </aside>
  );

  return (
    <MainLayout>
      <style>{`
        .scroll-reveal { opacity: 0; transform: translateY(20px); transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1); }
        .scroll-reveal.visible { opacity: 1; transform: translateY(0); }
        .search-glass { backdrop-filter: blur(20px); background: rgba(255, 255, 255, 0.7); }
        .dark .search-glass { background: rgba(19, 19, 26, 0.7); border-color: rgba(255, 255, 255, 0.05); }
        .gradient-border-mask {
           mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
           mask-composite: xor;
           mask-composite: exclude;
           padding: 2px;
        }
      `}</style>

      <div className={cn('min-h-screen pt-20 pb-20', isDark ? 'bg-dark-bg' : 'bg-[#FDFDFF]')}>
        
        {/* Universal Search Dashboard */}
        <div className={cn('transition-all duration-500 py-6 mb-12', isDark ? 'bg-dark-bg/80 border-b border-white/5 backdrop-blur-md' : 'bg-white/80 border-b border-gray-100 backdrop-blur-md')}>
          <div className="container-custom">
            <div className="flex flex-col md:flex-row items-center gap-4">
              <div className="flex-1 w-full">
                <form
                  onSubmit={handleSearch}
                  className={cn(
                    'flex flex-col md:flex-row items-center w-full max-w-[900px] mx-auto transition-all duration-300',
                    'rounded-[14px] border p-1 md:h-14 md:p-1.5',
                    isDark
                      ? 'bg-dark-card border-brand-purple/20 shadow-2xl shadow-black/40 focus-within:border-brand-purple/50 hover:shadow-brand-purple/5 hover:border-brand-purple/30'
                      : 'bg-white border-gray-200 shadow-xl shadow-gray-200/50 focus-within:border-brand-purple/30 hover:shadow-2xl hover:shadow-gray-300/40'
                  )}
                >
                  {/* Job Input (60%) */}
                  <div className="flex-[6] w-full flex items-center gap-3 px-4 h-11 md:h-full">
                    <Search className={cn('w-4 h-4 shrink-0', isDark ? 'text-gray-500' : 'text-gray-400')} />
                    <input
                      type="text"
                      value={filters.q}
                      onChange={e => setFilters(p => ({ ...p, q: e.target.value }))}
                      placeholder="Job title, skills, or company"
                      className={cn(
                        'flex-1 bg-transparent text-[14px] font-medium outline-none w-full',
                        isDark ? 'text-white placeholder-gray-600' : 'text-gray-900 placeholder-gray-400'
                      )}
                    />
                  </div>

                  {/* Vertical Divider (Desktop Only) */}
                  <div className={cn('hidden md:block w-px h-6 shrink-0', isDark ? 'bg-white/5' : 'bg-gray-100')} />

                  {/* Location Input (25%) */}
                  <div className="flex-[2.5] w-full flex items-center gap-3 px-4 h-11 md:h-full">
                    <MapPin className={cn('w-4 h-4 shrink-0', isDark ? 'text-gray-500' : 'text-gray-400')} />
                    <input
                      type="text"
                      value={filters.location}
                      onChange={e => setFilters(p => ({ ...p, location: e.target.value }))}
                      placeholder="City or remote"
                      className={cn(
                        'flex-1 bg-transparent text-[14px] font-medium outline-none w-full',
                        isDark ? 'text-white placeholder-gray-600' : 'text-gray-900 placeholder-gray-400'
                      )}
                    />
                  </div>

                  {/* Search Button (15%) */}
                  <button
                    type="submit"
                    className={cn(
                      'flex-[1.5] w-full md:w-auto px-6 h-11 md:h-full rounded-xl font-bold text-xs uppercase tracking-widest text-white transition-all duration-300 transform active:scale-95',
                      'bg-gradient-to-r from-brand-purple to-brand-pink shadow-md hover:shadow-lg hover:shadow-brand-purple/20 hover:-translate-y-0.5'
                    )}
                  >
                    Search
                  </button>
                </form>
              </div>
              <button
                onClick={() => setMobileFilters(true)}
                className={cn('lg:hidden w-full md:w-auto h-14 rounded-2xl border flex items-center justify-center gap-3 text-xs font-black uppercase tracking-widest transition-all', isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-gray-50 border-gray-100 text-gray-900')}
              >
                <SlidersHorizontal className="w-4 h-4" /> Filters
              </button>
            </div>
          </div>
        </div>

        <div className="container-custom">
          <div className="flex gap-14">
            {/* Left Sidebar (Desktop) */}
            <div className="hidden lg:block">
              <Sidebar />
            </div>

            {/* Main Listings */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
                <div className="space-y-1">
                  <h1 className={cn('text-3xl md:text-4xl font-black font-heading tracking-tight', isDark ? 'text-white' : 'text-gray-900')}>
                    Browse <span className="gradient-text">Opportunities</span>
                  </h1>
                  <p className={cn('text-xs font-bold tracking-widest uppercase', isDark ? 'text-gray-500' : 'text-gray-400')}>
                    {loading ? 'Crunching data...' : `${total.toLocaleString()} Verified Positions Found`}
                  </p>
                </div>
                {!loading && filters.jobType.length + filters.category.length + (filters.experience.length ? 1 : 0) > 0 && (
                  <div className="flex flex-wrap gap-2">
                    <button onClick={clearFilters} className="text-[10px] font-black text-brand-purple hover:underline uppercase p-2 border border-brand-purple/20 rounded-xl hover:bg-brand-purple/5 transition-all">Clear Active Filters</button>
                  </div>
                )}
              </div>

              {/* Grid Layout V2.0 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {loading
                  ? [...Array(8)].map((_, i) => <JobCardSkeleton key={i} isDark={isDark} />)
                  : jobs.length === 0
                    ? (
                      <div className={cn(
                        'col-span-full py-32 rounded-[3rem] border border-dashed flex flex-col items-center text-center px-6',
                        isDark ? 'border-white/10 bg-white/2' : 'border-gray-200 bg-gray-50'
                      )}>
                        <div className="w-24 h-24 rounded-full bg-brand-purple/5 flex items-center justify-center text-brand-purple mb-6">
                           <Briefcase className="w-10 h-10" />
                        </div>
                        <h3 className={cn('text-2xl font-black font-heading mb-2', isDark ? 'text-white' : 'text-gray-900')}>Zero Matches</h3>
                        <p className={cn('text-sm font-medium opacity-60 max-w-sm', isDark ? 'text-gray-400' : 'text-gray-500')}>We couldn't find any roles matching those specific filters. Try broadening your criteria!</p>
                        <button onClick={clearFilters} className="mt-8 btn-primary rounded-full px-10 py-3.5 text-[10px] font-black uppercase tracking-widest">Show All Jobs</button>
                      </div>
                    )
                    : jobs.map((job, idx) => (
                      <div key={job._id} className="scroll-reveal visible animate-in" style={{ animationDelay: `${idx * 50}ms` }}>
                        <V2JobCard job={job} isDark={isDark} isSaved={savedJobs.has(job._id)} onSave={() => handleSave(job._id)} />
                      </div>
                    ))}
              </div>

              {/* Enhanced Pagination V2.0 */}
              {!loading && total > 12 && (
                <div className="flex items-center justify-center gap-2 mt-16 pb-12">
                  <button 
                    onClick={() => { setPage(p => Math.max(1, p - 1)); window.scrollTo(0, 0); }} 
                    disabled={page === 1}
                    className={cn(
                      'p-4 rounded-2xl flex items-center justify-center transition-all duration-300 disabled:opacity-20',
                      isDark ? 'bg-white/5 hover:bg-white/10 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-900 border border-gray-100'
                    )}
                  >
                     <ChevronDown className="w-5 h-5 rotate-90" />
                  </button>
                  {[...Array(Math.ceil(total / 12))].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => { setPage(i + 1); window.scrollTo(0, 0); }}
                      className={cn(
                        'w-12 h-12 rounded-2xl text-xs font-black transition-all duration-300',
                        page === i + 1
                          ? 'bg-brand-purple text-white shadow-glow-sm scale-110'
                          : (isDark ? 'bg-white/5 text-gray-500 hover:text-white hover:bg-white/10' : 'bg-white text-gray-400 hover:text-gray-900 border border-gray-100')
                      )}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button 
                    onClick={() => { setPage(p => p + 1); window.scrollTo(0, 0); }} 
                    disabled={page >= Math.ceil(total / 12)}
                    className={cn(
                      'p-4 rounded-2xl flex items-center justify-center transition-all duration-300 disabled:opacity-20',
                      isDark ? 'bg-white/5 hover:bg-white/10 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-900 border border-gray-100'
                    )}
                  >
                     <ChevronDown className="w-5 h-5 -rotate-90" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modern Mobile Drawer */}
      {mobileFilters && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setMobileFilters(false)} />
          <div className={cn(
            'relative w-full max-w-sm rounded-t-[3rem] sm:rounded-[3.5rem] p-10 overflow-y-auto max-h-[85vh] shadow-2xl animate-in',
            isDark ? 'bg-[#0F0F13] border border-white/10' : 'bg-white'
          )}>
            <div className="w-12 h-1.5 bg-gray-500/20 rounded-full mx-auto mb-8 sm:hidden"></div>
            <Sidebar />
            <button onClick={() => setMobileFilters(false)} className="w-full btn-primary py-4 rounded-2xl mt-8 text-[11px] font-black uppercase tracking-[0.2em] shadow-glow">Apply Filtering</button>
          </div>
        </div>
      )}
    </MainLayout>
  );
};

const V2JobCard = ({ job, isDark, isSaved, onSave }) => {
  return (
    <div className={cn(
      'group relative flex flex-col p-8 rounded-[2.5rem] border transition-all duration-500 overflow-hidden h-full',
      isDark
        ? 'bg-[#0D0C14] border-brand-purple/35 hover:border-brand-purple/70 hover:shadow-[0_0_50px_-20px_rgba(139,92,246,0.3)]'
        : 'bg-white border-brand-purple/20 hover:border-brand-purple/50 hover:shadow-2xl hover:shadow-brand-purple/5 shadow-sm'
    )}>
      
      {/* Hiring Insight */}
      <div className="absolute top-6 right-6 flex items-center gap-2">
         {job.applicationsCount > 10 && (
           <div className="bg-orange-500/10 text-orange-500 text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border border-orange-500/20 flex items-center gap-1">
             <Clock className="w-2.5 h-2.5" /> High Demand
           </div>
         )}
         {timeAgo(job.createdAt).includes('minute') || timeAgo(job.createdAt).includes('hour') ? (
           <div className="bg-emerald-500/10 text-emerald-500 text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border border-emerald-500/20">New</div>
         ) : null}
      </div>

      <div className="flex items-start gap-6 mb-8">
        <div className="w-16 h-16 rounded-[1.25rem] bg-gradient-to-br from-brand-purple to-brand-pink p-0.5 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
           <div className={cn('w-full h-full rounded-[1.2rem] flex items-center justify-center font-black text-2xl text-white', isDark ? 'bg-dark-card/90' : 'bg-white/20')}>
              {job.company?.[0]?.toUpperCase()}
           </div>
        </div>
        <div className="flex-1 pr-12 min-w-0">
          <Link to={`/jobs/${job._id}`}>
            <h3 className={cn('text-[19px] font-black leading-tight group-hover:text-brand-violet transition-colors mb-1.5 truncate', isDark ? 'text-white' : 'text-gray-900')}>
              {job.title}
            </h3>
          </Link>
          <p className={cn('text-xs font-bold flex items-center gap-2 tracking-tight opacity-60', isDark ? 'text-gray-300' : 'text-gray-600')}>
             {job.company}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2.5 mb-8">
        <Badge color={jobTypeColor(job.jobType)} className="text-[9px] px-3.5 py-1 font-black uppercase tracking-widest">{job.jobType}</Badge>
        <Badge color="gray/10" className={cn('text-[9px] px-3.5 py-1 font-black uppercase tracking-widest', isDark ? 'bg-white/5' : 'bg-gray-100')}>{job.category}</Badge>
        {job.experience && <Badge color="indigo" className="text-[9px] px-3.5 py-1 font-black uppercase tracking-widest">{job.experience}</Badge>}
      </div>

      <div className={cn('mt-auto pt-6 border-t grid grid-cols-2 gap-4', isDark ? 'border-white/5' : 'border-gray-50')}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
            <IndianRupee className="w-3.5 h-3.5" />
          </div>
          <div className="min-w-0">
            <p className={cn('text-[11px] font-black truncate', isDark ? 'text-white' : 'text-gray-900')}>{formatSalary(job.salary)}</p>
            <p className="text-[8px] font-bold text-gray-500 uppercase tracking-widest">Comp. Range</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-brand-purple/10 text-brand-purple flex items-center justify-center shrink-0">
            <MapPin className="w-3.5 h-3.5" />
          </div>
          <div className="min-w-0">
            <p className={cn('text-[11px] font-black truncate', isDark ? 'text-white' : 'text-gray-900')}>{job.location}</p>
            <p className="text-[8px] font-bold text-gray-500 uppercase tracking-widest">Office Hub</p>
          </div>
        </div>
      </div>

      <div className="mt-8 flex items-center gap-3">
        <Link to={`/jobs/${job._id}`} className="flex-1">
          <button className={cn(
            'w-full py-4 rounded-[1.25rem] text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300',
            isDark 
              ? 'bg-white/5 text-white hover:bg-brand-purple hover:shadow-glow-sm' 
              : 'bg-gray-50 text-brand-purple hover:bg-brand-purple hover:text-white border border-gray-100 hover:border-transparent shadow-sm'
          )}>
            View Deep Dive
          </button>
        </Link>
        <button
          onClick={onSave}
          className={cn(
            'w-14 h-14 rounded-[1.25rem] flex items-center justify-center transition-all duration-300 border',
            isSaved 
              ? 'bg-brand-purple border-brand-purple text-white shadow-glow-sm' 
              : (isDark ? 'bg-white/5 border-white/5 text-gray-500 hover:text-white hover:border-white/20' : 'bg-white border-gray-100 text-gray-400 hover:text-brand-purple hover:border-brand-purple/30')
          )}
        >
          {isSaved ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );
};

export default FindJobsPage;
