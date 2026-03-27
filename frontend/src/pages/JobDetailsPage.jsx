import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  MapPin, Clock, IndianRupee, Briefcase, Users, Calendar,
  Bookmark, BookmarkCheck, Share2, ArrowLeft, CheckCircle2,
  Building2, Globe, ExternalLink, Mail, Phone, FileText, Eye, Download
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth, API } from '../context/AuthContext';
import { cn } from '../utils/cn';
import { formatSalary, timeAgo, jobTypeColor, getCloudinaryDownloadUrl } from '../utils/helpers';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import MainLayout from '../layouts/MainLayout';
import { SkeletonBox } from '../components/ui/Skeleton';
import toast from 'react-hot-toast';

const JobDetailsPage = () => {
  const { id } = useParams();
  const { isDark } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [similarJobs, setSimilarJobs] = useState([]);
  const [applicants, setApplicants] = useState([]);
  const [loadingApplicants, setLoadingApplicants] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await API.get(`/jobs/${id}`);
        const jobData = res.data.job;
        setJob(jobData);
        if (user?.savedJobs?.includes(id)) setSaved(true);
        
        API.get(`/jobs?category=${jobData.category}&limit=3`)
          .then(r => setSimilarJobs((r.data.jobs || []).filter(j => j._id !== id)));

        if (user?.role === 'employer' && jobData.postedBy === user._id) {
          fetchApplicants(id);
        }
      } catch (err) {
        toast.error('Failed to load job');
        navigate('/jobs');
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id, user, navigate]);

  const fetchApplicants = async (jobId) => {
    setLoadingApplicants(true);
    try {
      const res = await API.get(`/applications/job/${jobId}`);
      setApplicants(res.data.applications || []);
    } catch {
      toast.error('Failed to load applicants');
    } finally {
      setLoadingApplicants(false);
    }
  };

  const handleUpdateStatus = async (appId, status) => {
    try {
      await API.put(`/applications/${appId}/status`, { status });
      toast.success(`Application ${status}!`);
      setApplicants(prev => prev.map(a => a._id === appId ? { ...a, status } : a));
    } catch {
      toast.error('Failed to update status');
    }
  };

  const handleApply = async () => {
    if (!user) { toast.error('Sign in to apply'); navigate('/login'); return; }
    if (user.role === 'employer') { toast.error('Employers cannot apply to jobs'); return; }
    setApplying(true);
    try {
      await API.post(`/applications/${id}`, { coverLetter: '' });
      setApplied(true);
      toast.success('Application submitted! 🎉');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Application failed');
    } finally {
      setApplying(false);
    }
  };

  const handleSave = async () => {
    if (!user) { toast.error('Sign in to save jobs'); return; }
    try {
      await API.put(`/auth/save-job/${id}`);
      setSaved(p => !p);
      toast.success(saved ? 'Job removed' : 'Job saved!');
    } catch { toast.error('Failed to save job'); }
  };

  if (loading) return (
    <MainLayout>
      <div className={cn('min-h-screen pt-24', isDark ? 'bg-dark-bg' : 'bg-light-bg')}>
        <div className="container-custom py-8">
          <div className="flex gap-8">
            <div className="flex-1 space-y-4">
              <SkeletonBox className="h-10 w-3/4" />
              <SkeletonBox className="h-6 w-1/2" />
              <SkeletonBox className="h-40 w-full" />
              <SkeletonBox className="h-40 w-full" />
            </div>
            <div className="w-72 space-y-4 hidden lg:block">
              <SkeletonBox className="h-48 w-full" />
              <SkeletonBox className="h-32 w-full" />
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );

  if (!job) return null;

  const skills = job.skills || [];
  const responsibilities = job.description?.split('\n').filter(l => l.trim()) || [];

  return (
    <MainLayout>
      <div className={cn('min-h-screen pt-20', isDark ? 'bg-dark-bg' : 'bg-light-bg')}>
        {/* Header Bar */}
        <div className={cn('border-b py-6', isDark ? 'bg-dark-card border-dark-border' : 'bg-white border-light-border')}>
          <div className="container-custom">
            <button
              onClick={() => navigate(-1)}
              className={cn('flex items-center gap-1.5 text-sm mb-4 transition-colors', isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900')}
            >
              <ArrowLeft className="w-4 h-4" /> Back to Jobs
            </button>
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-purple to-brand-pink flex items-center justify-center text-white font-bold text-2xl shrink-0">
                  {job.company?.[0]?.toUpperCase()}
                </div>
                <div>
                  <h1 className={cn('text-2xl md:text-3xl font-black', isDark ? 'text-white' : 'text-gray-900')}>{job.title}</h1>
                  <p className={cn('text-base mt-1', isDark ? 'text-gray-400' : 'text-gray-500')}>{job.company}</p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <Badge color={jobTypeColor(job.jobType)}>{job.jobType}</Badge>
                    {job.category && <Badge color="gray">{job.category}</Badge>}
                    {job.experience && <Badge color="cyan">{job.experience}</Badge>}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={handleSave} className={cn('p-2.5 rounded-xl border transition-all', saved ? 'bg-brand-purple/15 border-brand-purple/30 text-brand-violet' : isDark ? 'border-dark-border text-gray-400 hover:border-brand-purple/40 hover:text-brand-violet' : 'border-light-border text-gray-400 hover:border-brand-purple/30 hover:text-brand-purple')}>
                  {saved ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
                </button>
                <button
                  onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success('Link copied!'); }}
                  className={cn('p-2.5 rounded-xl border transition-all', isDark ? 'border-dark-border text-gray-400 hover:border-brand-purple/40 hover:text-brand-violet' : 'border-light-border text-gray-400 hover:border-brand-purple/30 hover:text-brand-purple')}
                >
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="container-custom py-8">
          <div className="flex gap-8 flex-col lg:flex-row">
            <div className="flex-1 min-w-0 space-y-6">
              {user?.role === 'employer' && job.postedBy === user._id && (
                <div className={cn('p-6 rounded-2xl border mb-6 transition-all duration-300', isDark ? 'bg-dark-card border-brand-purple/20 shadow-xl' : 'bg-white border-brand-purple/20 hover:border-brand-purple/40 shadow-sm')}>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className={cn('text-xl font-bold font-heading', isDark ? 'text-white' : 'text-gray-900')}>
                      Recent <span className="gradient-text">Applicants</span> ({applicants.length})
                    </h2>
                  </div>
                  {loadingApplicants ? (
                    <div className="space-y-4">{[1, 2, 3].map(i => <SkeletonBox key={i} className="h-20" />)}</div>
                  ) : applicants.length === 0 ? (
                    <div className="text-center py-10 opacity-50">
                      <Users className="w-12 h-12 mx-auto mb-3" />
                      <p>No applications yet.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {applicants.map((app) => (
                        <div key={app._id} className={cn('p-5 rounded-2xl border transition-all duration-300', isDark ? 'bg-dark-hover/30 border-dark-border' : 'bg-gray-50 border-gray-100')}>
                          <div className="flex flex-col md:flex-row gap-5 items-start md:items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-full bg-brand-purple/20 flex items-center justify-center text-brand-purple font-bold">{app.applicant?.name?.[0]}</div>
                              <div>
                                <h3 className={cn('font-bold text-base', isDark ? 'text-white' : 'text-gray-900')}>{app.applicant?.name}</h3>
                                <div className="flex items-center gap-4 mt-1">
                                  <span className="text-xs text-gray-500 flex items-center gap-1"><Mail className="w-3 h-3" /> {app.applicant?.email}</span>
                                  {app.applicant?.phone && <span className="text-xs text-gray-500 flex items-center gap-1"><Phone className="w-3 h-3" /> {app.applicant?.phone}</span>}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-3 w-full md:w-auto">
                              {/* Resume Controls */}
                              <div className="flex items-center gap-2 flex-1 md:flex-none">
                                {(() => {
                                  const resume = app.resumeUrl || app.applicant?.resumeUrl || app.applicant?.resume;
                                  const applicantName = app.applicant?.name?.replace(/\s+/g, '_') || 'Applicant';
                                  const isPdf = typeof resume === 'string' && resume.toLowerCase().endsWith('.pdf');
                                  const ResumeIcon = isPdf ? FileText : FileText; // Could use more icons if needed
                                  
                                  if (!resume) {
                                    return (
                                      <button 
                                        disabled 
                                        className={cn(
                                          'flex-1 md:flex-none flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-bold opacity-30 cursor-not-allowed',
                                          isDark ? 'bg-white/5 text-gray-400' : 'bg-gray-100 text-gray-500'
                                        )}
                                        title="No resume uploaded"
                                      >
                                        <FileText className="w-3.5 h-3.5" /> No Resume
                                      </button>
                                    );
                                  }

                                  return (
                                    <>
                                      {/* View Button */}
                                      <button 
                                        onClick={() => window.open(resume, '_blank')}
                                        className={cn(
                                          'flex-1 md:flex-none flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all duration-300 border',
                                          isDark 
                                            ? 'bg-brand-purple/10 border-brand-purple/30 text-brand-violet hover:bg-brand-purple/20 hover:shadow-glow-sm' 
                                            : 'bg-purple-50 border-purple-200 text-brand-purple hover:bg-purple-100'
                                        )}
                                        title={`View ${isPdf ? 'PDF' : 'Resume'} in browser`}
                                      >
                                        <Eye className="w-3.5 h-3.5" /> View
                                      </button>

                                      {/* Download Button */}
                                      <a 
                                        href={getCloudinaryDownloadUrl(resume, `Resume_${applicantName}`)} 
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={cn(
                                          'flex-1 md:flex-none flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all duration-300 border',
                                          isDark 
                                            ? 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:text-white' 
                                            : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                                        )}
                                        title={`Download Documentation`}
                                      >
                                        <Download className="w-3.5 h-3.5" /> Download
                                      </a>
                                    </>
                                  );
                                })()}
                              </div>

                              <select 
                                value={app.status} 
                                onChange={(e) => handleUpdateStatus(app._id, e.target.value)} 
                                className={cn(
                                  'flex-1 md:flex-none bg-transparent border-0 text-xs font-bold outline-none py-2 px-4 rounded-xl cursor-pointer transition-all', 
                                  app.status === 'shortlisted' ? 'text-green-400 bg-green-400/10' : 
                                  app.status === 'rejected' ? 'text-red-400 bg-red-400/10' : 
                                  'text-brand-violet bg-brand-purple/10'
                                )}
                              >
                                <option value="pending">Pending</option>
                                <option value="shortlisted">Shortlist</option>
                                <option value="rejected">Reject</option>
                              </select>

                              {/* Review Profile Link */}
                              <Link 
                                to={`/dashboard/applications/review/${app._id}`}
                                className={cn(
                                  'flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 border',
                                  isDark 
                                    ? 'bg-white/5 border-white/10 text-white hover:bg-brand-purple hover:border-brand-purple' 
                                    : 'bg-brand-purple text-white hover:bg-brand-violet'
                                )}
                              >
                                Review Full Profile
                              </Link>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div className={cn('grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-2xl border transition-all duration-300', isDark ? 'bg-dark-card border-brand-purple/20 shadow-xl' : 'bg-white border-brand-purple/20 hover:border-brand-purple/40 shadow-sm')}>
                {[
                  { icon: MapPin, label: 'Location', value: job.location },
                  { icon: IndianRupee, label: 'Salary', value: formatSalary(job.salary) },
                  { icon: Users, label: 'Vacancies', value: `${job.vacancies || 1} openings` },
                  { icon: Calendar, label: 'Posted', value: timeAgo(job.createdAt) },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="text-center">
                    <Icon className="w-5 h-5 mx-auto mb-1.5 text-brand-violet" />
                    <p className={cn('text-[11px] uppercase tracking-wide font-medium', isDark ? 'text-gray-500' : 'text-gray-400')}>{label}</p>
                    <p className={cn('text-sm font-semibold mt-0.5', isDark ? 'text-gray-200' : 'text-gray-800')}>{value}</p>
                  </div>
                ))}
              </div>

              <div className={cn('p-6 rounded-2xl border transition-all duration-300', isDark ? 'bg-dark-card border-brand-purple/20 shadow-xl' : 'bg-white border-brand-purple/20 hover:border-brand-purple/40 shadow-sm')}>
                <h2 className={cn('text-lg font-bold mb-4', isDark ? 'text-white' : 'text-gray-900')}>Job Description</h2>
                <div className={cn('text-sm leading-relaxed space-y-3', isDark ? 'text-gray-300' : 'text-gray-600')}>{responsibilities.map((line, i) => <p key={i}>{line}</p>)}</div>
              </div>

              {skills.length > 0 && (
                <div className={cn('p-6 rounded-2xl border transition-all duration-300', isDark ? 'bg-dark-card border-brand-purple/20 shadow-xl' : 'bg-white border-brand-purple/20 hover:border-brand-purple/40 shadow-sm')}>
                  <h2 className={cn('text-lg font-bold mb-4', isDark ? 'text-white' : 'text-gray-900')}>Required Skills</h2>
                  <div className="flex flex-wrap gap-2">{skills.map(skill => <div key={skill} className={cn('flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border', isDark ? 'bg-brand-purple/10 border-brand-purple/25 text-brand-violet' : 'bg-purple-50 border-purple-200 text-brand-purple')}><CheckCircle2 className="w-3.5 h-3.5" /> {skill}</div>)}</div>
                </div>
              )}

              <div className="lg:hidden">{applied ? <div className={cn('flex items-center gap-2 px-6 py-4 rounded-xl font-semibold text-accent-green', isDark ? 'bg-accent-green/10 border border-accent-green/20' : 'bg-green-50 border border-green-200')}><CheckCircle2 className="w-5 h-5" /> Application Submitted!</div> : <Button fullWidth loading={applying} onClick={handleApply} size="lg">Apply Now</Button>}</div>
            </div>

            <div className="w-full lg:w-80 shrink-0 space-y-5">
              <div className={cn('p-6 rounded-2xl border transition-all duration-300', isDark ? 'bg-dark-card border-brand-purple/20 shadow-xl' : 'bg-white border-brand-purple/20 hover:border-brand-purple/40 shadow-sm')}>
                {applied ? (
                  <div className={cn('text-center space-y-3', isDark ? 'text-accent-green' : 'text-green-600')}><CheckCircle2 className="w-10 h-10 mx-auto" /><p className="font-bold text-lg">Applied!</p><p className={cn('text-sm', isDark ? 'text-gray-400' : 'text-gray-500')}>Great job! Track your application in your dashboard.</p><Link to="/dashboard"><Button variant="secondary" fullWidth>View Dashboard</Button></Link></div>
                ) : (
                  <>
                    <p className={cn('text-sm mb-4', isDark ? 'text-gray-400' : 'text-gray-500')}>{job.applicationsCount > 0 ? `${job.applicationsCount} people applied. Be next!` : 'Be the first to apply!'}</p>
                    {job.deadline && <p className={cn('text-xs mb-4', isDark ? 'text-gray-500' : 'text-gray-400')}>Deadline: {new Date(job.deadline).toLocaleDateString('en-IN', { dateStyle: 'medium' })}</p>}
                    <Button fullWidth loading={applying} onClick={handleApply} size="lg">Apply Now</Button>
                  </>
                )}
              </div>
              <div className={cn('p-6 rounded-2xl border transition-all duration-300', isDark ? 'bg-dark-card border-brand-purple/20 shadow-xl' : 'bg-white border-brand-purple/20 hover:border-brand-purple/40 shadow-sm')}>
                <h3 className={cn('font-bold text-base mb-4', isDark ? 'text-white' : 'text-gray-900')}>About the Company</h3>
                <div className="flex items-center gap-3 mb-4"><div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-purple to-brand-pink flex items-center justify-center text-white font-bold">{job.company?.[0]?.toUpperCase()}</div><div><p className={cn('font-semibold', isDark ? 'text-gray-100' : 'text-gray-900')}>{job.company}</p><p className={cn('text-xs', isDark ? 'text-gray-400' : 'text-gray-500')}>{job.category} Industry</p></div></div>
                <div className={cn('flex items-center gap-2 text-sm', isDark ? 'text-gray-400' : 'text-gray-500')}><Globe className="w-4 h-4" /> Visit company website<ExternalLink className="w-3.5 h-3.5" /></div>
              </div>
              {similarJobs.length > 0 && (
                <div className={cn('p-6 rounded-2xl border transition-all duration-300', isDark ? 'bg-dark-card border-brand-purple/20 shadow-xl' : 'bg-white border-brand-purple/20 hover:border-brand-purple/40 shadow-sm')}>
                  <h3 className={cn('font-bold text-base mb-4', isDark ? 'text-white' : 'text-gray-900')}>Similar Jobs</h3>
                  <div className="space-y-3">{similarJobs.map(sj => <Link key={sj._id} to={`/jobs/${sj._id}`} className={cn('flex items-center gap-3 p-3 rounded-xl transition-colors group', isDark ? 'hover:bg-dark-hover' : 'hover:bg-gray-50')}><div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-purple to-brand-pink flex items-center justify-center text-white text-sm font-bold shrink-0">{sj.company?.[0]?.toUpperCase()}</div><div className="min-w-0"><p className={cn('text-sm font-medium truncate group-hover:text-brand-violet transition-colors', isDark ? 'text-gray-200' : 'text-gray-800')}>{sj.title}</p><p className={cn('text-xs truncate', isDark ? 'text-gray-500' : 'text-gray-400')}>{sj.company}</p></div></Link>)}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default JobDetailsPage;
