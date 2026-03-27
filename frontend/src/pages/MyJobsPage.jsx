import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  PlusCircle, Briefcase, MapPin, Users, 
  Calendar, ChevronRight, Eye, MoreVertical,
  Trash2, Edit
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth, API } from '../context/AuthContext';
import { cn } from '../utils/cn';
import { timeAgo, formatSalary } from '../utils/helpers';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import MainLayout from '../layouts/MainLayout';
import DashboardSidebar from '../layouts/DashboardSidebar';
import { SkeletonBox } from '../components/ui/Skeleton';
import toast from 'react-hot-toast';

const MyJobsPage = () => {
  const { isDark } = useTheme();
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyJobs = async () => {
      try {
        const res = await API.get('/jobs/my/posted');
        setJobs(res.data.jobs || []);
      } catch (err) {
        toast.error('Failed to load your jobs');
      } finally {
        setLoading(false);
      }
    };
    fetchMyJobs();
  }, []);

  const handleDeleteJob = async (id) => {
    if (!window.confirm('Are you sure you want to delete this job posting?')) return;
    try {
      await API.delete(`/jobs/${id}`);
      setJobs(prev => prev.filter(j => j._id !== id));
      toast.success('Job deleted successfully');
    } catch {
      toast.error('Failed to delete job');
    }
  };

  return (
    <MainLayout>
      <div className={cn('min-h-screen pt-20', isDark ? 'bg-dark-bg' : 'bg-light-bg')}>
        <div className="container-custom py-10">
          <div className="flex flex-col lg:flex-row gap-8">
            <DashboardSidebar />
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
                <div>
                  <h1 className={cn('text-3xl font-black font-heading', isDark ? 'text-white' : 'text-gray-900')}>
                    My <span className="gradient-text">Job Posts</span>
                  </h1>
                  <p className={cn('text-sm mt-1', isDark ? 'text-gray-400' : 'text-gray-500')}>Manage and track performance of your job listings</p>
                </div>
                <Link to="/post-job" className="btn-primary rounded-full px-6 flex items-center gap-2">
                  <PlusCircle className="w-4 h-4" /> Post New Job
                </Link>
              </div>

              {/* Jobs List */}
              <div className="space-y-4">
                {loading ? (
                  [1, 2, 3].map(i => <SkeletonBox key={i} className="h-32 w-full rounded-2xl" />)
                ) : jobs.length === 0 ? (
                  <div className={cn(
                    'p-16 rounded-3xl border text-center flex flex-col items-center gap-4',
                    isDark ? 'bg-dark-card border-dark-border' : 'bg-white border-light-border'
                  )}>
                    <div className="w-20 h-20 rounded-full bg-brand-purple/5 flex items-center justify-center text-brand-purple/40">
                      <Briefcase className="w-10 h-10" />
                    </div>
                    <div>
                      <h3 className={cn('font-bold text-xl', isDark ? 'text-white' : 'text-gray-900')}>No jobs posted yet</h3>
                      <p className={cn('text-sm max-w-sm mx-auto mt-2', isDark ? 'text-gray-400' : 'text-gray-500')}>
                        Ready to find your next great hire? Start by posting your first job opportunity.
                      </p>
                    </div>
                    <Link to="/post-job">
                      <Button variant="primary" className="mt-4 rounded-full px-8">Create Your First Listing</Button>
                    </Link>
                  </div>
                ) : (
                  jobs.map((job) => (
                    <div 
                      key={job._id}
                      className={cn(
                        'group relative p-6 rounded-2xl border transition-all duration-300 hover:scale-[1.01] shadow-sm hover:shadow-glow-sm',
                        isDark ? 'bg-dark-card border-dark-border hover:border-brand-purple/50' : 'bg-white border-light-border hover:border-brand-purple/30'
                      )}
                    >
                      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                        <div className="flex items-center gap-5">
                          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-purple to-brand-pink flex items-center justify-center text-white font-bold text-2xl shadow-lg ring-4 ring-brand-purple/10">
                            {job.title[0]}
                          </div>
                          <div>
                            <Link to={`/jobs/${job._id}`} className={cn('font-bold text-lg hover:text-brand-violet transition-colors block mb-1', isDark ? 'text-white' : 'text-gray-900')}>
                              {job.title}
                            </Link>
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                              <span className="text-xs text-gray-500 flex items-center gap-1"><MapPin className="w-3 h-3" /> {job.location}</span>
                              <span className="text-xs text-gray-500 flex items-center gap-1"><Calendar className="w-3 h-3" /> Posted {timeAgo(job.createdAt)}</span>
                              <span className="text-xs font-bold text-brand-violet flex items-center gap-1"><Users className="w-3 h-3" /> {job.applicationsCount || 0} Applicants</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 w-full md:w-auto mt-2 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 border-dark-border/10 justify-between md:justify-end">
                          <Link to={`/jobs/${job._id}`} className={cn(
                            'p-2.5 rounded-xl border transition-all group-hover:border-brand-purple/40',
                            isDark ? 'bg-white/5 border-dark-border text-gray-400 hover:text-white' : 'bg-gray-50 border-gray-100 text-gray-400 hover:text-gray-900'
                          )}>
                            <Eye className="w-5 h-5" />
                          </Link>
                          <button 
                            onClick={() => handleDeleteJob(job._id)}
                            className={cn(
                              'p-2.5 rounded-xl border transition-all border-red-500/10 text-red-500/60 hover:text-red-500 hover:bg-red-500/10',
                              isDark ? 'bg-white/5' : 'bg-red-50'
                            )}
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                          <Link to={`/dashboard/applications/review/${job._id}`}>
                            <button className={cn(
                              'px-8 py-2.5 rounded-full border text-xs font-bold flex items-center gap-2 transition-all duration-300',
                              isDark 
                                ? 'bg-brand-purple/5 border-brand-purple/20 text-brand-violet hover:bg-brand-purple/20 hover:border-brand-purple/40' 
                                : 'bg-brand-purple/5 border-brand-purple/20 text-brand-purple hover:bg-brand-purple/10'
                            )}>
                              View Applicants <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default MyJobsPage;
