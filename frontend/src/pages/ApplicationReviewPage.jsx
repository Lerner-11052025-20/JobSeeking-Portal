import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Mail, Phone, MapPin, 
  Briefcase, FileText, Eye, Download,
  CheckCircle2, XCircle, Clock, MessageSquare,
  User, Building2
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth, API } from '../context/AuthContext';
import { cn } from '../utils/cn';
import { timeAgo, capitalize, getCloudinaryDownloadUrl } from '../utils/helpers';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import MainLayout from '../layouts/MainLayout';
import { SkeletonBox } from '../components/ui/Skeleton';
import toast from 'react-hot-toast';

const ApplicationReviewPage = () => {
  const { id } = useParams();
  const { isDark } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [application, setApplication] = useState(null);
  const [targetJob, setTargetJob] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [viewMode, setViewMode] = useState('loading'); // 'single', 'list', 'loading', 'error'
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // 1. Try fetching as application
        try {
          const res = await API.get(`/applications/${id}`);
          setApplication(res.data.application);
          setNotes(res.data.application.employerNotes || '');
          setViewMode('single');
          setLoading(false);
          return;
        } catch (err) {
          if (err?.response?.status !== 404) throw err;
        }

        // 2. Try fetching as job (for View Applicants button redirect)
        const jobRes = await API.get(`/jobs/${id}`);
        setTargetJob(jobRes.data.job);
        
        const appRes = await API.get(`/applications/job/${id}`);
        setApplicants(appRes.data.applications || []);
        setViewMode('list');
      } catch (err) {
        toast.error('Data not found');
        navigate('/dashboard/jobs');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, navigate]);

  const handleUpdateStatus = async (status, applicationId = null) => {
    const targetId = applicationId || id;
    setUpdating(targetId);
    try {
      await API.put(`/applications/${targetId}/status`, { status, employerNotes: notes });
      toast.success(`Application ${status}!`);
      if (viewMode === 'single') {
        setApplication(prev => ({ ...prev, status }));
      } else {
        setApplicants(prev => prev.map(a => a._id === targetId ? { ...a, status } : a));
      }
    } catch {
      toast.error('Failed to update status');
    } finally {
      setUpdating(null);
    }
  };

  if (loading) return (
    <MainLayout>
      <div className={cn('min-h-screen pt-24', isDark ? 'bg-dark-bg' : 'bg-light-bg')}>
        <div className="container-custom py-8 space-y-6">
          <SkeletonBox className="h-10 w-1/3" />
          <SkeletonBox className="h-96 w-full rounded-3xl" />
        </div>
      </div>
    </MainLayout>
  );

  if (viewMode === 'list' && targetJob) {
    return (
      <MainLayout>
        <div className={cn('min-h-screen pt-20', isDark ? 'bg-dark-bg' : 'bg-light-bg')}>
          <div className="container-custom py-10">
            <button
              onClick={() => navigate('/dashboard/jobs')}
              className={cn('flex items-center gap-1.5 text-sm mb-6 transition-colors', isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900')}
            >
              <ArrowLeft className="w-4 h-4" /> Back to My Jobs
            </button>

            <div className="flex items-center justify-between gap-4 mb-8 flex-wrap">
              <div>
                <h1 className={cn('text-3xl font-black mb-2', isDark ? 'text-white' : 'text-gray-900')}>
                  Reviewing <span className="gradient-text">Applicants</span>
                </h1>
                <p className="text-gray-500 text-sm flex items-center gap-2">
                  <Briefcase className="w-4 h-4" /> {targetJob.title} • {applicants.length} Total
                </p>
              </div>
              <Badge color="purple" className="px-6 py-2 border">MANAGE TALENT</Badge>
            </div>

            {applicants.length === 0 ? (
              <div className={cn('p-24 text-center rounded-[2rem] border-2 border-dashed', isDark ? 'bg-dark-card/30 border-dark-border text-gray-600' : 'bg-white border-light-border text-gray-400')}>
                <Users className="w-12 h-12 mx-auto mb-4 opacity-30" />
                <h2 className="text-xl font-black">No Candidates Yet</h2>
                <p className="text-sm">Your premium job listing is live. New talent will appear here.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {/* Table Header Row (Desktop Only) */}
                <div className="hidden md:grid grid-cols-12 gap-4 px-8 py-3 opacity-30 text-[10px] uppercase font-black tracking-widest">
                  <div className="col-span-4">Candidate Information</div>
                  <div className="col-span-2">Current Status</div>
                  <div className="col-span-3">Applied On</div>
                  <div className="col-span-3 text-right">Actions</div>
                </div>

                {applicants.map((app) => (
                  <div key={app._id} className={cn(
                    'group relative p-4 md:px-8 md:py-5 rounded-[2rem] border-2 transition-all duration-500 overflow-hidden',
                    isDark 
                      ? 'bg-dark-card border-dark-border/50 hover:border-brand-purple/30' 
                      : 'bg-white border-light-border/50 hover:border-brand-purple/20 shadow-sm hover:shadow-glow-sm'
                  )}>
                    {/* Status Glow Indicator */}
                    <div className={cn(
                      'absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-12 rounded-r-full transition-all opacity-0 group-hover:opacity-100',
                      app.status === 'hired' ? 'bg-emerald-500 shadow-[0_0_15px_#10b981]' :
                      app.status === 'rejected' ? 'bg-red-500' : 'bg-brand-purple shadow-glow-sm'
                    )} />

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                      {/* Name & Contact */}
                      <div className="col-span-4 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-[1.2rem] bg-gradient-to-br from-brand-purple/20 to-brand-pink/20 flex items-center justify-center text-brand-purple font-black transition-transform group-hover:scale-110">
                          {app.applicant?.name?.[0]}
                        </div>
                        <div className="min-w-0">
                          <h3 className={cn('font-black text-[15px] truncate transition-colors group-hover:text-brand-violet', isDark ? 'text-white' : 'text-gray-900')}>
                            {app.applicant?.name}
                          </h3>
                          <p className="text-[10px] text-gray-500 flex items-center gap-1.5 mt-0.5">
                            <Mail className="w-3 h-3" /> {app.applicant?.email}
                          </p>
                        </div>
                      </div>

                      {/* Status */}
                      <div className="col-span-2">
                        <Badge 
                          color={
                            app.status === 'hired' ? 'purple' : 
                            app.status === 'shortlisted' ? 'green' : 
                            app.status === 'rejected' ? 'red' : 'yellow'
                          }
                          className="text-[9px] px-3 font-bold border-none bg-black/5"
                        >
                          {capitalize(app.status === 'pending' ? 'Received' : app.status)}
                        </Badge>
                      </div>

                      {/* Date */}
                      <div className="col-span-3">
                        <p className="text-[11px] font-bold text-gray-500">{timeAgo(app.createdAt)}</p>
                        <p className={cn('text-[9px] uppercase tracking-tighter opacity-40', isDark ? 'text-white' : 'text-black')}>Submission Date</p>
                      </div>

                      {/* Actions */}
                      <div className="col-span-3 flex items-center justify-end gap-2">
                        <div className="flex items-center gap-1.5 mr-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                             onClick={() => window.open(app.resumeUrl || app.applicant?.resumeUrl || app.applicant?.resume, '_blank')}
                             className="p-2.5 rounded-2xl hover:bg-brand-purple/10 text-brand-violet transition-colors"
                             title="Quick View"
                           >
                             <Eye className="w-4 h-4" />
                           </button>
                           <a 
                             href={getCloudinaryDownloadUrl(app.resumeUrl || app.applicant?.resumeUrl || app.applicant?.resume, app.resumeName || app.applicant?.resumeName || `Resume_${app.applicant?.name}`)}
                             download={app.resumeName || app.applicant?.resumeName || `Resume_${app.applicant?.name}.pdf`}
                             target="_blank"
                             rel="noopener noreferrer"
                             className="p-2.5 rounded-2xl hover:bg-brand-purple/10 text-gray-400 hover:text-brand-pink transition-colors"
                             title="Download Original"
                           >
                             <Download className="w-4 h-4" />
                           </a>
                        </div>
                        <Link to={`/dashboard/applications/review/${app._id}`} className="shrink-0">
                          <button className="btn-primary py-2.5 px-6 rounded-2xl text-[10px] font-black uppercase tracking-wider transition-all hover:px-8 group-hover:shadow-glow">
                             Review Profile
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!application) return null;

  const applicant = application.applicant;
  const job = application.job;
  const resume = application.resumeUrl || applicant?.resumeUrl || applicant?.resume;
  const isPdf = typeof resume === 'string' && resume.toLowerCase().endsWith('.pdf');

  return (
    <MainLayout>
      <div className={cn('min-h-screen pt-20', isDark ? 'bg-dark-bg' : 'bg-light-bg')}>
        <div className="container-custom py-10 max-w-5xl">
          <button
            onClick={() => navigate(-1)}
            className={cn('flex items-center gap-1.5 text-sm mb-6 transition-colors', isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900')}
          >
            <ArrowLeft className="w-4 h-4" /> Back to Applicants
          </button>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Column: Applicant Details */}
            <div className="flex-1 space-y-6">
              <div className={cn('p-8 rounded-3xl border', isDark ? 'bg-dark-card border-dark-border' : 'bg-white border-light-border shadow-sm')}>
                <div className="flex items-start justify-between gap-4 mb-8">
                  <div className="flex items-center gap-5">
                    <div className="w-20 h-20 rounded-2xl bg-brand-purple/20 flex items-center justify-center text-brand-purple font-bold text-3xl">
                      {applicant?.name?.[0]}
                    </div>
                    <div>
                      <h1 className={cn('text-2xl font-black font-heading', isDark ? 'text-white' : 'text-gray-900')}>
                        {applicant?.name}
                      </h1>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
                        <span className="text-xs text-gray-500 flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> {applicant?.email}</span>
                        {applicant?.phone && <span className="text-xs text-gray-500 flex items-center gap-1"><Phone className="w-3.5 h-3.5" /> {applicant?.phone}</span>}
                      </div>
                    </div>
                  </div>
                  <Badge 
                    color={
                      application.status === 'hired' ? 'purple' : 
                      application.status === 'shortlisted' ? 'green' : 
                      application.status === 'rejected' ? 'red' : 'yellow'
                    }
                    className="text-xs px-4 py-1.5 border"
                  >
                    {capitalize(application.status === 'pending' ? 'Reviewing' : application.status)}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-8 border-y border-dark-border/10">
                  <div>
                    <h3 className={cn('text-sm font-bold uppercase tracking-wider mb-4 opacity-70', isDark ? 'text-gray-300' : 'text-gray-500')}>Education</h3>
                    <p className={cn('text-sm leading-relaxed', isDark ? 'text-gray-200' : 'text-gray-800')}>
                      {applicant?.education || 'No education details provided.'}
                    </p>
                  </div>
                  <div>
                    <h3 className={cn('text-sm font-bold uppercase tracking-wider mb-4 opacity-70', isDark ? 'text-gray-300' : 'text-gray-500')}>Experience</h3>
                    <p className={cn('text-sm leading-relaxed', isDark ? 'text-gray-200' : 'text-gray-800')}>
                      {applicant?.experience || 'No experience details provided.'}
                    </p>
                  </div>
                </div>

                <div className="mt-8">
                  <h3 className={cn('text-sm font-bold uppercase tracking-wider mb-4 opacity-70', isDark ? 'text-gray-300' : 'text-gray-500')}>Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {applicant?.skills?.length > 0 ? applicant.skills.map(skill => (
                      <Badge key={skill} color="purple">{skill}</Badge>
                    )) : <p className="text-xs opacity-50 italic">No skills listed</p>}
                  </div>
                </div>

                {application.coverLetter && (
                  <div className="mt-10">
                    <h3 className={cn('text-sm font-bold mb-3', isDark ? 'text-white' : 'text-gray-900')}>Cover Letter</h3>
                    <div className={cn('p-5 rounded-2xl text-sm leading-relaxed whitespace-pre-line border', isDark ? 'bg-dark-hover/30 border-dark-border text-gray-300' : 'bg-gray-50 border-gray-100 text-gray-600')}>
                      {application.coverLetter}
                    </div>
                  </div>
                )}
              </div>

              {/* Resume Component */}
              <div className={cn('p-8 rounded-3xl border', isDark ? 'bg-dark-card border-dark-border' : 'bg-white border-light-border shadow-sm')}>
                <div className="flex items-center justify-between mb-6">
                  <h3 className={cn('text-lg font-bold flex items-center gap-2', isDark ? 'text-white' : 'text-gray-900')}>
                    <FileText className="w-5 h-5 text-brand-violet" /> Candidate Resume
                  </h3>
                  {resume && <Badge color="gray">{isPdf ? 'PDF' : 'DOC'}</Badge>}
                </div>
                
                {resume ? (
                  <div className="flex items-center justify-between p-6 rounded-2xl border bg-brand-purple/5 border-brand-purple/20">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-brand-purple/20 flex items-center justify-center text-brand-purple">
                        <FileText className="w-6 h-6" />
                      </div>
                      <div>
                        <p className={cn('font-bold text-sm', isDark ? 'text-gray-100' : 'text-gray-900')}>{application.resumeName || applicant?.resumeName || `Resume_${applicant?.name?.replace(/\s/g, '_')}.${isPdf ? 'pdf' : 'doc'}`}</p>
                        <p className="text-xs text-gray-500">Cloudinary Managed File</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => window.open(resume, '_blank')}
                        className="btn-ghost p-3 rounded-xl"
                        title="View Resume"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      <a 
                        href={getCloudinaryDownloadUrl(resume, application.resumeName || applicant?.resumeName || `Resume_${applicant?.name}`)} 
                        download={application.resumeName || applicant?.resumeName || `Resume_${applicant?.name}.pdf`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-primary p-3 rounded-xl"
                        title="Download Resume"
                      >
                        <Download className="w-5 h-5" />
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6 opacity-40">
                    <XCircle className="w-10 h-10 mx-auto mb-2" />
                    <p className="text-sm">No resume uploaded</p>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Actions */}
            <div className="w-full lg:w-96 shrink-0 space-y-6">
              <div className={cn('p-6 rounded-3xl border shadow-glow-sm border-brand-purple/30', isDark ? 'bg-dark-card' : 'bg-white')}>
                <h3 className={cn('text-lg font-bold mb-6', isDark ? 'text-white' : 'text-gray-900')}>Take Action</h3>
                
                <div className="space-y-4 mb-8">
                  <div className="relative">
                    <label className={cn('text-xs font-bold mb-2 flex items-center gap-2 opacity-70', isDark ? 'text-white' : 'text-gray-900')}>
                      <MessageSquare className="w-3.5 h-3.5" /> Personalized Feedback
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Add a reason for shortlisting/rejection to notify the candidate..."
                      className={cn(
                        'w-full p-4 rounded-2xl border text-sm outline-none h-32 transition-all resize-none',
                        isDark ? 'bg-dark-hover/50 border-dark-border focus:border-brand-purple text-white' : 'bg-gray-50 border-gray-200 focus:border-brand-purple'
                      )}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {application.status === 'hired' ? (
                    <div className="col-span-2 flex items-center justify-center gap-3 p-4 rounded-2xl bg-green-500/10 border border-green-500/20 text-green-500 font-black text-sm animate-pulse">
                      <CheckCircle2 className="w-5 h-5 shadow-glow-sm" /> HIRED AS HUNTER
                    </div>
                  ) : (
                    <>
                      <Button 
                        fullWidth 
                        variant="primary" 
                        loading={updating && application.status !== 'shortlisted' && application.status !== 'hired'}
                        onClick={() => handleUpdateStatus(application.status === 'shortlisted' ? 'hired' : 'shortlisted')}
                        className={cn(
                          'rounded-2xl shadow-lg transition-all duration-500', 
                          application.status === 'shortlisted' ? 'bg-gradient-to-r from-emerald-500 to-teal-600 shadow-emerald-500/20' : ''
                        )}
                      >
                        <CheckCircle2 className="w-4 h-4" /> {application.status === 'shortlisted' ? 'Hire' : 'Shortlist'}
                      </Button>
                      <Button 
                        fullWidth 
                        variant="secondary" 
                        loading={updating && application.status !== 'rejected'}
                        onClick={() => handleUpdateStatus('rejected')}
                        className="rounded-2xl border-red-500/20 text-red-500 hover:bg-red-500/10"
                        disabled={application.status === 'rejected'}
                      >
                        <XCircle className="w-4 h-4" /> {application.status === 'rejected' ? 'Rejected' : 'Reject'}
                      </Button>
                    </>
                  )}
                </div>
              </div>

              <div className={cn('p-6 rounded-3xl border', isDark ? 'bg-dark-card border-dark-border' : 'bg-white border-light-border')}>
                <h3 className={cn('font-bold text-sm mb-4 flex items-center gap-2', isDark ? 'text-gray-300' : 'text-gray-700')}>
                  <Briefcase className="w-4 h-4" /> Job Snapshot
                </h3>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-purple to-brand-pink flex items-center justify-center text-white font-bold shrink-0 shadow-lg">
                    {job?.title?.[0]}
                  </div>
                  <div className="min-w-0">
                    <p className={cn('font-bold truncate', isDark ? 'text-white' : 'text-gray-900')}>{job?.title}</p>
                    <p className={cn('text-xs truncate text-gray-500')}>{job?.postedBy?.companyName}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500 flex items-center gap-1.5"><Clock className="w-3 h-3" /> Submitted</span>
                    <span className={isDark ? 'text-white' : 'text-gray-800'}>{timeAgo(application.createdAt)}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500 flex items-center gap-1.5"><MapPin className="w-3 h-3" /> Location</span>
                    <span className={isDark ? 'text-white' : 'text-gray-800'}>{job?.location}</span>
                  </div>
                </div>
                <Link to={`/jobs/${job?._id}`} className="block mt-6">
                  <Button fullWidth variant="ghost" size="sm" className="text-[10px] uppercase font-bold tracking-widest bg-white/5">View Job Details</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ApplicationReviewPage;
