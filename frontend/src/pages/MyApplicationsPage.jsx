import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, Briefcase, Calendar, MapPin, 
  ChevronRight, Upload, CheckCircle2, AlertCircle,
  Eye, File, Download
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth, API } from '../context/AuthContext';
import { cn } from '../utils/cn';
import { timeAgo, capitalize, getCloudinaryDownloadUrl } from '../utils/helpers';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import MainLayout from '../layouts/MainLayout';
import DashboardSidebar from '../layouts/DashboardSidebar';
import { SkeletonBox } from '../components/ui/Skeleton';
import toast from 'react-hot-toast';

const statusStyles = {
  pending: 'yellow',
  reviewed: 'cyan',
  shortlisted: 'green',
  rejected: 'red',
  hired: 'purple',
};

const MyApplicationsPage = () => {
  const { isDark } = useTheme();
  const { user, updateUser } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await API.get('/applications/my');
        setApplications(res.data.applications);
      } catch (err) {
        toast.error('Failed to load applications');
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      return toast.error('File too large (max 5MB)');
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('resume', file);

    try {
      const res = await API.put('/auth/profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      updateUser(res.data.user);
      toast.success('Resume uploaded successfully! 📄');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <MainLayout>
      <div className={cn('min-h-screen pt-20', isDark ? 'bg-dark-bg' : 'bg-light-bg')}>
        <div className="container-custom py-10">
          <div className="flex flex-col lg:flex-row gap-8">
            <DashboardSidebar />
            
            <div className="flex-1 min-w-0">
              <div className="mb-8">
                <h1 className={cn('text-3xl font-black font-heading', isDark ? 'text-white' : 'text-gray-900')}>
                  My <span className="gradient-text">Applications</span>
                </h1>
                <p className={cn('text-sm mt-1', isDark ? 'text-gray-400' : 'text-gray-500')}>Track and manage all your job applications in one place</p>
              </div>

              {/* Resume Status Card */}
              <div className={cn(
                'p-6 rounded-3xl border mb-8 flex flex-col sm:flex-row items-center justify-between gap-6 transition-all duration-300',
                isDark ? 'bg-dark-card border-dark-border shadow-glow-sm' : 'bg-white border-light-border shadow-sm'
              )}>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-brand-purple/10 flex items-center justify-center text-brand-purple">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className={cn('font-bold', isDark ? 'text-white' : 'text-gray-900')}>My Resume</h3>
                    <p className={cn('text-xs mt-0.5', isDark ? 'text-gray-400' : 'text-gray-500')}>
                      {user.resume ? (
                        <span className="flex items-center gap-1 text-green-400"><CheckCircle2 className="w-3 h-3" /> Resume uploaded</span>
                      ) : (
                        <span className="flex items-center gap-1 text-amber-400"><AlertCircle className="w-3 h-3" /> No resume uploaded yet</span>
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {(user.resumeUrl || user.resume) && (
                    <div className="flex items-center gap-2">
                      <a 
                        href={user.resumeUrl || user.resume} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="btn-ghost text-xs px-3 py-2 flex items-center gap-2"
                      >
                        <Eye className="w-3.5 h-3.5" /> View
                      </a>
                      <a 
                        href={getCloudinaryDownloadUrl(user.resumeUrl || user.resume, user.resumeName || `My_Resume_${user.name}`)} 
                        download={user.resumeName || `Resume_${user.name}.pdf`}
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="btn-ghost text-xs px-3 py-2 flex items-center gap-2"
                        title="Download Resume"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  )}
                  <label className={cn(
                    'btn-primary text-xs px-6 py-2.5 flex items-center gap-2 cursor-pointer transition-transform hover:scale-105 active:scale-95',
                    uploading && 'opacity-60 pointer-events-none'
                  )}>
                    {uploading ? (
                      <><div className="animate-spin h-3.5 w-3.5 border-2 border-white/30 border-t-white rounded-full" /> Uploading...</>
                    ) : (
                      <><Upload className="w-3.5 h-3.5" /> {user.resume ? 'Update Resume' : 'Upload Resume'}</>
                    )}
                    <input type="file" className="hidden" accept=".pdf,.doc,.docx" onChange={handleResumeUpload} />
                  </label>
                </div>
              </div>

              {/* Applications List */}
              <div className="space-y-4">
                {loading ? (
                  [1, 2, 3].map(i => <SkeletonBox key={i} className="h-28 w-full rounded-2xl" />)
                ) : applications.length === 0 ? (
                  <div className={cn(
                    'p-12 rounded-3xl border text-center flex flex-col items-center gap-4',
                    isDark ? 'bg-dark-card border-dark-border' : 'bg-white border-light-border'
                  )}>
                    <div className="w-16 h-16 rounded-full bg-gray-500/10 flex items-center justify-center text-gray-500">
                      <Briefcase className="w-8 h-8 opacity-40" />
                    </div>
                    <div>
                      <h3 className={cn('font-bold text-lg', isDark ? 'text-white' : 'text-gray-900')}>No applications yet</h3>
                      <p className={cn('text-sm max-w-xs mx-auto mt-1', isDark ? 'text-gray-400' : 'text-gray-500')}>
                        Your dream job is waiting for you. Start exploring and apply to jobs that match your skills!
                      </p>
                    </div>
                    <Link to="/jobs">
                      <Button variant="primary" size="sm" className="mt-2">Browse Jobs</Button>
                    </Link>
                  </div>
                ) : (
                  applications.map((app) => (
                    <Link 
                      key={app._id}
                      to={`/applications/${app._id}`}
                      className={cn(
                        'group block p-5 rounded-2xl border transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] shadow-sm hover:shadow-glow-sm',
                        isDark ? 'bg-dark-card border-dark-border hover:border-brand-purple/50' : 'bg-white border-light-border hover:border-brand-purple/30'
                      )}
                    >
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-brand-purple to-brand-pink flex items-center justify-center text-white font-bold text-xl shadow-lg ring-4 ring-brand-purple/10">
                            {app.job?.title?.[0]?.toUpperCase()}
                          </div>
                          <div>
                            <h3 className={cn('font-bold text-base transition-colors group-hover:text-brand-violet', isDark ? 'text-white' : 'text-gray-900')}>
                              {app.job?.title}
                            </h3>
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
                              <span className={cn('text-xs flex items-center gap-1', isDark ? 'text-gray-400' : 'text-gray-500')}>
                                <File className="w-3 h-3" /> {app.job?.company}
                              </span>
                              <span className={cn('text-xs flex items-center gap-1', isDark ? 'text-gray-400' : 'text-gray-500')}>
                                <MapPin className="w-3 h-3" /> {app.job?.location}
                              </span>
                              <span className={cn('text-xs flex items-center gap-1', isDark ? 'text-gray-400' : 'text-gray-500')}>
                                <Calendar className="w-3 h-3" /> {timeAgo(app.createdAt)}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-3 sm:pt-0 mt-2 sm:mt-0">
                          <Badge color={statusStyles[app.status] || 'yellow'} className="text-[10px] uppercase tracking-wider font-extrabold px-3">
                            {app.status === 'pending' ? 'Under Review' : capitalize(app.status)}
                          </Badge>
                          <ChevronRight className={cn('w-5 h-5 transition-transform group-hover:translate-x-1', isDark ? 'text-gray-600' : 'text-gray-300')} />
                        </div>
                      </div>
                    </Link>
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

export default MyApplicationsPage;
