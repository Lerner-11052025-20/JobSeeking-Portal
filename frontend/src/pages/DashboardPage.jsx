import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
   Briefcase, Users, TrendingUp, FileText, Clock, MapPin,
   CheckCircle2, XCircle, AlertCircle, Plus, Eye, IndianRupee,
   BookOpen, LayoutDashboard, ChevronRight, Star, Layers, ShieldCheck, Bookmark, ArrowRight, Building2
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth, API } from '../context/AuthContext';
import { cn } from '../utils/cn';
import { timeAgo } from '../utils/helpers';
import MainLayout from '../layouts/MainLayout';
import DashboardSidebar from '../layouts/DashboardSidebar';
import { SkeletonBox } from '../components/ui/Skeleton';

// Application status styling
const statusConfig = {
   pending: { color: 'yellow', icon: AlertCircle, label: 'Under Review', bg: 'bg-yellow-500/10', text: 'text-yellow-500', glow: 'shadow-[0_0_15px_rgba(234,179,8,0.2)]' },
   reviewed: { color: 'cyan', icon: Eye, label: 'Reviewed', bg: 'bg-cyan-500/10', text: 'text-cyan-500', glow: 'shadow-[0_0_15px_rgba(6,182,212,0.2)]' },
   shortlisted: { color: 'green', icon: CheckCircle2, label: 'Shortlisted', bg: 'bg-emerald-500/10', text: 'text-emerald-500', glow: 'shadow-[0_0_15px_rgba(16,185,129,0.2)]' },
   rejected: { color: 'red', icon: XCircle, label: 'Rejected', bg: 'bg-red-500/10', text: 'text-red-500', glow: 'shadow-[0_0_15px_rgba(239,68,68,0.2)]' },
   hired: { color: 'purple', icon: CheckCircle2, label: 'Hired 🎉', bg: 'bg-brand-purple/10', text: 'text-brand-purple', glow: 'shadow-[0_0_20px_rgba(124,58,237,0.3)]' },
};

// ─── Professional Stat Card ───
const StatCard = ({ icon: Icon, label, value, isDark, trend }) => (
   <div className={cn(
      'p-6 rounded-2xl flex flex-col gap-4 border transition-all duration-300',
      isDark
         ? 'bg-[#0D0C14] border-brand-purple/35 hover:border-brand-purple/70 shadow-2xl shadow-brand-purple/5'
         : 'bg-white border-brand-purple/20 hover:border-brand-purple/40 shadow-sm hover:shadow-md'
   )}>
      <div className="flex items-center justify-between">
         <div className={cn('p-2.5 rounded-xl', isDark ? 'bg-white/5 text-brand-violet' : 'bg-brand-purple/5 text-brand-purple')}>
            <Icon className="w-5 h-5" />
         </div>
         {trend && (
            <span className={cn(
               'text-[10px] font-bold px-2 py-0.5 rounded-full border',
               trend > 0
                  ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/10'
                  : 'bg-red-500/10 text-red-400 border-red-500/10'
            )}>
               {trend > 0 ? '+' : ''}{trend}%
            </span>
         )}
      </div>
      <div>
         <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">{label}</p>
         <h3 className={cn('text-2xl font-bold', isDark ? 'text-white' : 'text-gray-900')}>{value}</h3>
      </div>
   </div>
);

// ─── Job Seeker Dashboard ─────────────────────────────
const JobSeekerDashboard = ({ isDark, user }) => {
   const [applications, setApplications] = useState([]);
   const [loading, setLoading] = useState(true);
   const [stats, setStats] = useState({ applications: 0, shortlisted: 0, pending: 0, savedJobs: 0 });

   useEffect(() => {
      setLoading(true);
      Promise.all([
         API.get('/applications/my'),
         API.get('/auth/stats')
      ])
         .then(([appRes, statsRes]) => {
            setApplications(appRes.data.applications || []);
            setStats(statsRes.data.stats || stats);
         })
         .catch(() => { })
         .finally(() => setLoading(false));
   }, []);

   return (
      <div className="space-y-12 pb-20">
         {/* Professional Welcome Hub */}
         <div className={cn(
            'relative p-8 lg:p-10 mt-20 rounded-3xl overflow-hidden border transition-all duration-300',
            isDark ? 'bg-[#0D0C14] border-brand-purple/35 shadow-2xl' : 'bg-white border-brand-purple/10 shadow-sm'
         )}>
            <div className="relative z-10  flex flex-col md:flex-row items-center justify-between gap-8">
               <div className="max-w-xl text-center md:text-left">
                  <h1 className={cn('text-3xl lg:text-4xl font-bold tracking-tight mb-2', isDark ? 'text-white' : 'text-gray-900')}>
                     Welcome back, {user.name.split(' ')[0]}
                  </h1>
                  <p className={cn('text-sm font-medium mb-8 opacity-60', isDark ? 'text-gray-400' : 'text-gray-500')}>
                     Here's what's happening with your job applications today.
                  </p>
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                     <Link to="/jobs" className="btn-primary rounded-xl px-6 py-3 text-xs font-bold uppercase tracking-wider">Explore Roles</Link>
                     <button className={cn('px-6 py-3 rounded-xl border font-bold text-xs uppercase tracking-wider transition-all', isDark ? 'border-white/10 text-white hover:bg-white/5' : 'border-gray-200 text-gray-600 hover:bg-gray-50')}>Refresh Dashboard</button>
                  </div>
               </div>

               <div className="hidden lg:flex items-center gap-6">
                  <div className={cn('px-6 py-4 rounded-2xl border text-center min-w-[120px]', isDark ? 'bg-white/5 border-brand-purple/40' : 'bg-gray-50/50 border-gray-100')}>
                     <span className={cn('block text-2xl font-bold mb-1', isDark ? 'text-brand-purple' : 'text-brand-purple')}>{stats.applications}</span>
                     <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Sent</span>
                  </div>
                  <div className={cn('px-6 py-4 rounded-2xl border text-center min-w-[120px]', isDark ? 'bg-white/5 border-brand-purple/40' : 'bg-gray-50/50 border-gray-100')}>
                     <span className={cn('block text-2xl font-bold mb-1', isDark ? 'text-emerald-500' : 'text-emerald-600')}>{stats.shortlisted}</span>
                     <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Active</span>
                  </div>
               </div>
            </div>
         </div>

         {/* Simplified Stat Grid */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard icon={Layers} label="Submissions" value={stats.applications} isDark={isDark} />
            <StatCard icon={ShieldCheck} label="Shortlisted" value={stats.shortlisted} isDark={isDark} />
            <StatCard icon={Clock} label="Under Review" value={stats.pending} isDark={isDark} />
            <StatCard icon={Bookmark} label="Archived Jobs" value={stats.savedJobs} isDark={isDark} />
         </div>

         {/* Application Feed - Simple Professional */}
         <section className={cn(
            'rounded-2xl border overflow-hidden transition-all duration-300',
            isDark ? 'bg-[#0D0C14] border-brand-purple/35 shadow-2xl' : 'bg-white border-brand-purple/20 hover:border-brand-purple/40 shadow-sm'
         )}>
            <div className={cn('flex items-center justify-between p-6 border-b', isDark ? 'border-white/5' : 'border-gray-50')}>
               <div className="flex items-center gap-3">
                  <div className={cn('w-10 h-10 rounded-xl bg-brand-purple/10 flex items-center justify-center text-brand-purple')}>
                     <Briefcase className="w-5 h-5" />
                  </div>
                  <div>
                     <h2 className={cn('font-bold text-lg', isDark ? 'text-white' : 'text-gray-900')}>Active Applications</h2>
                     <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">{applications.length} Items being tracked</p>
                  </div>
               </div>
               <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Real-time Sync</span>
                  <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
               </div>
            </div>

            {loading
               ? <div className="p-6 space-y-4">{[1, 2, 3].map(i => <SkeletonBox key={i} className="h-20 rounded-xl" isDark={isDark} />)}</div>
               : applications.length === 0
                  ? (
                     <div className="py-24 text-center px-6">
                        <div className={cn('w-16 h-16 rounded-full bg-gray-500/5 mx-auto mb-6 flex items-center justify-center text-gray-400')}>
                           <Layers className="w-8 h-8" />
                        </div>
                        <h3 className={cn('text-xl font-bold mb-2', isDark ? 'text-white' : 'text-gray-900')}>No Applications Yet</h3>
                        <p className={cn('text-xs font-medium opacity-60 mb-8 max-w-xs mx-auto', isDark ? 'text-gray-400' : 'text-gray-500')}>Start applying to roles and track your journey here in real-time.</p>
                        <Link to="/jobs" className="btn-primary rounded-xl px-10 py-3 text-xs font-bold uppercase tracking-wider">Find Jobs</Link>
                     </div>
                  ) : (
                     <div className="divide-y divide-gray-500/5 max-h-[600px] overflow-y-auto">
                        {applications.map((app) => {
                           const cfg = statusConfig[app.status] || statusConfig.pending;
                           return (
                              <Link
                                 key={app._id}
                                 to={`/dashboard/applications/${app._id}`}
                                 className={cn(
                                    'flex flex-col lg:flex-row items-center gap-6 p-6 transition-all duration-300 group',
                                    isDark ? 'hover:bg-white/[0.02]' : 'hover:bg-gray-50'
                                 )}
                              >
                                 <div className="relative shrink-0">
                                    <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg text-white shadow-md bg-gradient-to-br from-brand-purple to-brand-pink')}>
                                       {app.job?.company?.[0]?.toUpperCase()}
                                    </div>
                                 </div>

                                 <div className="flex-1 min-w-0 text-center lg:text-left">
                                    <h4 className={cn('font-bold text-lg leading-tight truncate', isDark ? 'text-white' : 'text-gray-900')}>
                                       {app.job?.title}
                                    </h4>
                                    <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mt-1.5 opacity-60">
                                       <span className="text-xs font-bold flex items-center gap-2"><Building2 className="w-3.5 h-3.5" /> {app.job?.company}</span>
                                       <span className="text-xs font-bold flex items-center gap-2"><Clock className="w-3.5 h-3.5" /> {timeAgo(app.createdAt)}</span>
                                    </div>
                                 </div>

                                 <div className="flex items-center gap-4 shrink-0">
                                    <div className={cn('px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider border transition-all', cfg.bg, cfg.text, isDark ? 'border-brand-purple/20' : 'border-brand-purple/20 group-hover:border-brand-purple/40')}>
                                       {cfg.label}
                                    </div>
                                    <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center border transition-all', isDark ? 'border-brand-purple/20 text-gray-400 group-hover:bg-brand-purple group-hover:text-white' : 'border-brand-purple/10 text-gray-300 group-hover:bg-brand-purple group-hover:text-white bg-white shadow-sm')}>
                                       <ChevronRight className="w-5 h-5" />
                                    </div>
                                 </div>
                              </Link>
                           );
                        })}
                     </div>
                  )
            }
         </section>
      </div>
   );
};

// ─── Employer Dashboard ──────────────────────────────
const EmployerDashboard = ({ isDark, user }) => {
   const [jobs, setJobs] = useState([]);
   const [recentApps, setRecentApps] = useState([]);
   const [loading, setLoading] = useState(true);
   const [stats, setStats] = useState({ activeJobs: 0, totalApplicants: 0, shortlisted: 0, totalPosts: 0 });

   useEffect(() => {
      setLoading(true);
      Promise.all([
         API.get('/jobs/my/posted'),
         API.get('/auth/stats'),
         API.get('/applications/employer/recent')
      ])
         .then(([jobsRes, statsRes, appsRes]) => {
            setJobs(jobsRes.data.jobs || []);
            setStats(statsRes.data.stats || stats);
            setRecentApps(appsRes.data.applications || []);
         })
         .catch(() => { })
         .finally(() => setLoading(false));
   }, []);

   return (
      <div className="space-y-8 pb-20">
         {/* Simple Professional Header */}
         <div className={cn(
            'relative p-8 lg:p-12 rounded-3xl mt-20 overflow-hidden border',
            isDark ? 'bg-dark-card border-brand-purple/20' : 'bg-white border-brand-purple/10 shadow-sm'
         )}>
            <div className="relative z-10 flex flex-col xl:flex-row items-center justify-between gap-10">
               <div className="max-w-2xl text-center xl:text-left">
                  <h1 className={cn('text-3xl lg:text-5xl font-bold tracking-tight mb-4', isDark ? 'text-white' : 'text-gray-900')}>
                     Talent Acquisition <span className="text-brand-purple">Dashboard</span>
                  </h1>
                  <p className={cn('text-sm font-medium mb-8 leading-relaxed opacity-60', isDark ? 'text-gray-400' : 'text-gray-500')}>
                     Monitor your active roles, track candidate status, and manage your hiring pipeline from one central hub.
                  </p>
                  <div className="flex flex-wrap items-center justify-center xl:justify-start gap-4">
                     <Link to="/post-job" className="btn-primary rounded-xl px-8 py-3.5 text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                        <Plus className="w-4 h-4" /> Create New Posting
                     </Link>
                     <button className={cn('px-8 py-3.5 rounded-xl border font-bold text-xs uppercase tracking-wider transition-all', isDark ? 'border-white/10 text-white hover:bg-white/5' : 'border-gray-200 text-gray-600 hover:bg-gray-50')}>
                        View Analytics
                     </button>
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-4 w-full xl:w-fit">
                  <div className={cn('p-6 rounded-2xl border text-center xl:min-w-[160px]', isDark ? 'bg-white/2 border-white/5' : 'bg-gray-50/50 border-gray-100 shadow-sm')}>
                     <span className={cn('block text-3xl font-bold mb-1', isDark ? 'text-white' : 'text-gray-900')}>{stats.activeJobs}</span>
                     <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Active Roles</span>
                  </div>
                  <div className={cn('p-6 rounded-2xl border text-center xl:min-w-[160px]', isDark ? 'bg-brand-purple/5 border-brand-purple/10' : 'bg-purple-50/50 border-brand-purple/20')}>
                     <span className={cn('block text-3xl font-bold mb-1', isDark ? 'text-brand-violet' : 'text-brand-purple')}>{stats.totalApplicants}</span>
                     <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Applicants</span>
                  </div>
               </div>
            </div>
         </div>

         <div className="grid grid-cols-1 2xl:grid-cols-2 gap-8">
            {/* Active Jobs Section */}
            <div className={cn('rounded-2xl border overflow-hidden transition-all duration-300', isDark ? 'bg-dark-card border-brand-purple/20 shadow-xl' : 'bg-white border-brand-purple/20 hover:border-brand-purple/40 shadow-sm')}>
               <div className={cn('flex items-center justify-between p-6 border-b', isDark ? 'border-white/5' : 'border-gray-50')}>
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                        <TrendingUp className="w-5 h-5" />
                     </div>
                     <h2 className={cn('font-bold text-lg', isDark ? 'text-white' : 'text-gray-900')}>Active Postings</h2>
                  </div>
                  <Link to="/dashboard/jobs" className="text-[10px] font-bold text-brand-purple uppercase tracking-widest hover:underline px-4 py-2 rounded-lg bg-brand-purple/5">Manage All</Link>
               </div>

               {loading ? <div className="space-y-3 p-6">{[1, 2, 3].map(i => <SkeletonBox key={i} className="h-20 rounded-xl" isDark={isDark} />)}</div> : (
                  <div className="p-4 space-y-3 max-h-[500px] overflow-y-auto">
                     {jobs.length === 0 ? <p className="text-center py-10 text-xs text-gray-500">No active roles found.</p> : jobs.map(job => (
                    <div key={job._id} className={cn('p-5 rounded-xl border transition-all duration-300', isDark ? 'bg-white/2 border-brand-purple/20 hover:border-brand-purple/40' : 'bg-gray-50 border-brand-purple/10 hover:border-brand-purple/20')}>
                           <div className="flex items-start justify-between gap-4 mb-4">
                              <Link to={`/jobs/${job._id}`} className={cn('font-bold text-md transition-colors truncate flex-1', isDark ? 'text-white' : 'text-gray-900')}>{job.title}</Link>
                              <span className={cn('px-2 py-0.5 rounded-lg text-[8px] font-bold uppercase tracking-wider', job.status === 'active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-gray-500/10 text-gray-400')}>{job.status}</span>
                           </div>
                           <div className="flex items-center gap-6 opacity-60">
                              <div className="flex items-center gap-2 text-xs font-medium"><Users className="w-3.5 h-3.5" /> {job.applicationsCount} applicants</div>
                              <div className="flex items-center gap-2 text-xs font-medium"><Clock className="w-3.5 h-3.5" /> {timeAgo(job.createdAt)}</div>
                           </div>
                        </div>
                     ))}
                  </div>
               )}
            </div>

            {/* Recent Applications Section */}
            <div className={cn('rounded-2xl border overflow-hidden transition-all duration-300', isDark ? 'bg-dark-card border-brand-purple/20 shadow-xl' : 'bg-white border-brand-purple/20 hover:border-brand-purple/40 shadow-sm')}>
               <div className={cn('flex items-center justify-between p-6 border-b', isDark ? 'border-white/5' : 'border-gray-50')}>
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-xl bg-brand-purple/10 flex items-center justify-center text-brand-purple">
                        <Users className="w-5 h-5" />
                     </div>
                     <h2 className={cn('font-bold text-lg', isDark ? 'text-white' : 'text-gray-900')}>Candidate Insights</h2>
                  </div>
                  <div className="flex items-center gap-2">
                     <div className="w-1.5 h-1.5 rounded-full bg-brand-purple"></div>
                     <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Active Processing</span>
                  </div>
               </div>

               {loading ? <div className="space-y-3 p-6">{[1, 2, 3].map(i => <SkeletonBox key={i} className="h-20 rounded-xl" isDark={isDark} />)}</div> : (
                  <div className="p-4 space-y-3 max-h-[500px] overflow-y-auto">
                     {recentApps.length === 0 ? <p className="text-center py-10 text-xs text-gray-500">No recent activity.</p> : recentApps.map(app => (
                        <div key={app._id} className={cn('p-5 rounded-xl border transition-all duration-300 group', isDark ? 'bg-white/2 border-white/5 hover:border-brand-purple/30' : 'bg-gray-50 border-gray-100 hover:border-brand-purple/20 shadow-sm')}>
                           <div className="flex items-center justify-between gap-4">
                              <div className="flex items-center gap-4">
                                 <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-purple to-brand-pink flex items-center justify-center font-bold text-lg text-white">
                                    {app.applicant?.name?.[0]}
                                 </div>
                                 <div>
                                    <p className={cn('font-bold text-md', isDark ? 'text-white' : 'text-gray-900')}>{app.applicant?.name}</p>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight mt-0.5">Applied for <span className="text-brand-purple">{app.job?.title}</span></p>
                                 </div>
                              </div>
                              <Link to={`/dashboard/applications/review/${app._id}`} className={cn('w-10 h-10 rounded-xl flex items-center justify-center border border-gray-500/10 transition-all', isDark ? 'hover:bg-brand-purple text-gray-400 hover:text-white' : 'hover:bg-brand-purple text-gray-300 hover:text-white bg-white')}>
                                 <Eye className="w-5 h-5" />
                              </Link>
                           </div>
                           <div className="mt-4 pt-4 border-t border-gray-500/5 flex items-center justify-between">
                              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{timeAgo(app.createdAt)}</span>
                              <span className="text-[9px] font-bold text-brand-purple uppercase bg-brand-purple/5 px-2 py-0.5 rounded-lg">Review Alert</span>
                           </div>
                        </div>
                     ))}
                  </div>
               )}
            </div>
         </div>
      </div>
   );
};

// ─── Dashboard Page ───────────────────────────────────
const DashboardPage = () => {
   const { isDark } = useTheme();
   const { user, loading } = useAuth();

   if (loading) return (
      <MainLayout>
         <div className={cn('min-h-screen pt-[72px] pb-20 overflow-hidden', isDark ? 'bg-dark-bg' : 'bg-[#FDFDFF]')}>
            <div className="container-custom py-6">
               <div className="flex flex-col lg:flex-row gap-12">
                  <div className="hidden lg:block w-72 h-96 rounded-[3rem] bg-white/5 animate-pulse"></div>
                  <div className="flex-1 space-y-10">
                     <SkeletonBox className="h-64 rounded-[4rem]" isDark={isDark} />
                     <div className="grid grid-cols-4 gap-6">{[...Array(4)].map((_, i) => <SkeletonBox key={i} className="h-32 rounded-[2.5rem]" isDark={isDark} />)}</div>
                     <SkeletonBox className="h-96 rounded-[3.5rem]" isDark={isDark} />
                  </div>
               </div>
            </div>
         </div>
      </MainLayout>
   );

   if (!user) return (
      <MainLayout>
         <div className={cn('min-h-screen pt-24 flex items-center justify-center', isDark ? 'bg-dark-bg' : 'bg-light-bg')}>
            <div className="text-center max-w-sm px-6">
               <div className="w-24 h-24 rounded-full bg-brand-purple/5 flex items-center justify-center text-brand-purple mx-auto mb-8">
                  <LayoutDashboard className="w-12 h-12" />
               </div>
               <h2 className={cn('text-3xl font-bold mb-4', isDark ? 'text-white' : 'text-gray-900')}>Identity Required</h2>
               <p className={cn('text-sm font-medium opacity-60 mb-10', isDark ? 'text-gray-400' : 'text-gray-500')}>Your professional command center is encrypted. Please sign in to verify your access credentials.</p>
               <Link to="/login" className="w-full block btn-primary py-5 rounded-2xl text-[11px] font-bold uppercase tracking-wider shadow-glow">Access Dashboard</Link>
            </div>
         </div>
      </MainLayout>
   );

   return (
      <MainLayout>
         <div className={cn('min-h-screen pt-[72px] pb-20 overflow-hidden', isDark ? 'bg-dark-bg' : 'bg-[#FDFDFF]')}>
            <div className="container-custom">
               <div className="flex flex-col lg:flex-row gap-12 items-start">
                  <DashboardSidebar />
                  <div className="flex-1 min-w-0">
                     {user.role === 'employer'
                        ? <EmployerDashboard isDark={isDark} user={user} />
                        : <JobSeekerDashboard isDark={isDark} user={user} />
                     }
                  </div>
               </div>
            </div>
         </div>
      </MainLayout>
   );
};

export default DashboardPage;
