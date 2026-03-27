import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Briefcase, CheckCircle2, XCircle, AlertCircle, Eye,
  ArrowLeft, Clock, MapPin, Building2, User, FileText
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth, API } from '../context/AuthContext';
import { cn } from '../utils/cn';
import { timeAgo, capitalize, getCloudinaryDownloadUrl } from '../utils/helpers';
import Badge from '../components/ui/Badge';
import MainLayout from '../layouts/MainLayout';
import ApplicationProgress from '../components/applications/ApplicationProgress';
import { SkeletonBox } from '../components/ui/Skeleton';
import toast from 'react-hot-toast';

const statusConfig = {
  pending:     { color: 'yellow', icon: AlertCircle, label: 'Under Review', desc: 'The employer is currently reviewing your profile.' },
  reviewed:    { color: 'cyan',   icon: Eye,          label: 'Reviewed',     desc: 'Your application has been viewed by the employer.' },
  shortlisted: { color: 'green',  icon: CheckCircle2, label: 'Shortlisted',  desc: 'Congratulations! You have been shortlisted for the next round.' },
  rejected:    { color: 'red',    icon: XCircle,      label: 'Rejected',     desc: 'Thank you for your interest. The employer has moved forward with other candidates.' },
  hired:       { color: 'purple', icon: CheckCircle2, label: 'Hired 🎉',     desc: 'You have been selected for this position!' },
};

const ApplicationTrackingPage = () => {
  const { id } = useParams();
  const { isDark } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApp = async () => {
      try {
        const res = await API.get(`/applications/${id}`);
        setApplication(res.data.application);
      } catch (err) {
        toast.error('Application not found');
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchApp();
  }, [id, navigate]);

  if (loading) return (
    <MainLayout>
      <div className={cn('min-h-screen pt-24', isDark ? 'bg-dark-bg' : 'bg-light-bg')}>
        <div className="container-custom py-8 space-y-6">
          <SkeletonBox className="h-10 w-1/3" />
          <SkeletonBox className="h-64" />
        </div>
      </div>
    </MainLayout>
  );

  if (!application) return null;

  const job = application.job;
  const currentStatus = application.status || 'pending';
  const cfg = statusConfig[currentStatus] || statusConfig.pending;
  const StatusIcon = cfg.icon;

  // Timeline (mock for UI)
  const timeline = [
    { status: 'Applied', date: application.createdAt, done: true },
    { status: 'Under Review', date: null, done: currentStatus !== 'pending' },
    { status: capitalize(currentStatus), date: application.updatedAt, current: true, done: true },
  ];

  return (
    <MainLayout>
      <div className={cn('min-h-screen pt-20', isDark ? 'bg-dark-bg' : 'bg-light-bg')}>
        <div className="container-custom py-10 max-w-4xl">
          <button
            onClick={() => navigate('/dashboard')}
            className={cn('flex items-center gap-1.5 text-sm mb-6 transition-colors', isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900')}
          >
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </button>

          <div className="flex flex-col md:flex-row gap-8">
            {/* Left: App Info */}
            <div className="flex-1 space-y-6">
              <div className={cn('p-8 rounded-3xl border', isDark ? 'bg-dark-card border-dark-border' : 'bg-white border-light-border shadow-sm')}>
                <div className="flex items-start justify-between gap-4 mb-8 pb-8 border-b border-dark-border/10">
                  <div className="flex items-center gap-5">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-purple to-brand-pink flex items-center justify-center text-white font-bold text-2xl shadow-lg ring-4 ring-brand-purple/10">
                      {job?.company?.[0]?.toUpperCase()}
                    </div>
                    <div>
                      <h1 className={cn('text-2xl font-black font-heading', isDark ? 'text-white' : 'text-gray-900')}>{job?.title}</h1>
                      <p className={cn('text-base', isDark ? 'text-gray-400' : 'text-gray-500')}>{job?.company}</p>
                    </div>
                  </div>
                  <Badge color={cfg.color} className="text-xs px-4 py-1.5 border">
                    <StatusIcon className="w-4 h-4" /> {cfg.label}
                  </Badge>
                </div>

                <div className={cn('p-6 rounded-2xl mb-10', isDark ? 'bg-dark-hover/50 border border-dark-border' : 'bg-gray-50 border border-gray-100')}>
                  <h3 className={cn('text-sm font-bold mb-2 flex items-center gap-2', isDark ? 'text-white' : 'text-gray-900')}>
                    <AlertCircle className="w-4 h-4 text-brand-violet" /> Status Update
                  </h3>
                  <p className={cn('text-sm leading-relaxed', isDark ? 'text-gray-400' : 'text-gray-500')}>{cfg.desc}</p>
                </div>

                <ApplicationProgress application={application} />
              </div>
            </div>

            {/* Right: Job Snapshot */}
            <div className="w-full md:w-80 shrink-0 space-y-6">
              <div className={cn('p-6 rounded-2xl border', isDark ? 'bg-dark-card border-dark-border' : 'bg-white border-light-border shadow-sm')}>
                <h2 className={cn('font-bold mb-4', isDark ? 'text-white' : 'text-gray-900')}>Job Overview</h2>
                <div className="space-y-4">
                  {[
                    { icon: MapPin, text: job?.location },
                    { icon: Briefcase, text: job?.jobType },
                    { icon: FileText, text: job?.category },
                    { icon: Clock, text: `Applied ${timeAgo(application.createdAt)}` },
                  ].map(({ icon: Icon, text }) => (
                    <div key={text} className={cn('flex items-center gap-3 text-sm', isDark ? 'text-gray-400' : 'text-gray-500')}>
                      <Icon className="w-4 h-4 text-brand-violet" /> {text}
                    </div>
                  ))}
                  {application.resumeUrl && (
                    <a 
                      href={getCloudinaryDownloadUrl(application.resumeUrl, application.resumeName || `Resume_Application`)} 
                      download={application.resumeName || `Resume_Application.pdf`}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className={cn('flex items-center gap-3 text-sm transition-colors hover:text-brand-violet', isDark ? 'text-gray-100' : 'text-gray-800')}
                    >
                      <FileText className="w-4 h-4 text-brand-violet" /> View/Download Submitted Resume
                    </a>
                  )}
                </div>
                <div className="mt-6 pt-6 border-t border-dark-border/40">
                  <Link to={`/jobs/${job?._id}`}>
                    <button className="btn-secondary w-full text-xs">View Original Job Post</button>
                  </Link>
                </div>
              </div>

              <div className={cn('p-6 rounded-2xl border', isDark ? 'bg-dark-card border-dark-border' : 'bg-white border-light-border shadow-sm')}>
                <h2 className={cn('font-bold mb-3', isDark ? 'text-white' : 'text-gray-900')}>Next Steps?</h2>
                <p className={cn('text-xs leading-relaxed', isDark ? 'text-gray-400' : 'text-gray-500')}>
                  Make sure your resume is up-to-date. Employers may contact you via email or phone for further evaluation.
                </p>
                <Link to="/profile">
                  <button className="btn-ghost w-full text-xs mt-4">Update My Profile</button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ApplicationTrackingPage;
