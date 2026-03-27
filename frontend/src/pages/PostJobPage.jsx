import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Briefcase, FileText, MapPin, DollarSign, Tag, Check, ChevronRight
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth, API } from '../context/AuthContext';
import { cn } from '../utils/cn';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import MainLayout from '../layouts/MainLayout';
import toast from 'react-hot-toast';

const STEPS = ['Basic Info', 'Job Details', 'Requirements', 'Review'];

const JOB_TYPES = ['full-time', 'part-time', 'contract', 'internship', 'remote'];
const CATEGORIES = ['IT', 'Engineering', 'Marketing', 'Finance', 'Design', 'Sales', 'HR', 'Operations', 'Other'];
const EXPERIENCE_LEVELS = ['fresher', '1-2 years', '3-5 years', '5-10 years', '10+ years'];

const SelectOption = ({ options, field, label, isDark, update, form }) => (
  <div className="space-y-1.5">
    {label && <label className={cn('text-sm font-medium', isDark ? 'text-gray-300' : 'text-gray-700')}>{label}</label>}
    <div className="flex flex-wrap gap-2">
      {options.map(opt => (
        <button
          key={opt}
          type="button"
          onClick={() => update(field, opt)}
          className={cn(
            'px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-200 capitalize',
            form[field] === opt
              ? 'bg-brand-purple/15 border-brand-purple text-brand-violet shadow-glow-sm'
              : isDark
                ? 'border-dark-border text-gray-400 hover:border-brand-purple/40 hover:text-brand-violet'
                : 'border-light-border text-gray-500 hover:border-brand-purple/30 hover:text-brand-purple'
          )}
        >
          {opt}
        </button>
      ))}
    </div>
  </div>
);

const PostJobPage = () => {
  const { isDark } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [skillInput, setSkillInput] = useState('');
  const [form, setForm] = useState({
    title: '',
    company: user?.companyName || '',
    location: '',
    jobType: 'full-time',
    category: 'IT',
    salaryMin: '',
    salaryMax: '',
    experience: 'fresher',
    vacancies: '1',
    description: '',
    skills: [],
    education: '',
    deadline: '',
  });
  const [errors, setErrors] = useState({});

  const update = (field, value) => {
    setForm(p => ({ ...p, [field]: value }));
    if (errors[field]) setErrors(p => ({ ...p, [field]: '' }));
  };

  const addSkill = () => {
    const s = skillInput.trim();
    if (s && !form.skills.includes(s)) {
      update('skills', [...form.skills, s]);
    }
    setSkillInput('');
  };

  const removeSkill = (s) => update('skills', form.skills.filter(sk => sk !== s));

  const validateStep = (i) => {
    const errs = {};
    if (i === 0) {
      if (!form.title.trim()) errs.title = 'Job title required';
      if (!form.company.trim()) errs.company = 'Company name required';
      if (!form.location.trim()) errs.location = 'Location required';
    }
    if (i === 1) {
      if (!form.description.trim()) errs.description = 'Job description required';
      if (form.description.trim().length < 50) errs.description = 'Description must be at least 50 characters';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const nextStep = () => {
    if (validateStep(step)) setStep(p => p + 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const payload = {
        ...form,
        salary: { min: Number(form.salaryMin) || 0, max: Number(form.salaryMax) || 0 },
        vacancies: Number(form.vacancies) || 1,
      };
      await API.post('/jobs', payload);
      toast.success('Job posted successfully! 🎉');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to post job');
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.role !== 'employer') {
    return (
      <MainLayout>
        <div className={cn('min-h-screen pt-24 flex items-center justify-center', isDark ? 'bg-dark-bg' : 'bg-light-bg')}>
          <div className="text-center">
            <Briefcase className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h2 className={cn('text-2xl font-bold', isDark ? 'text-white' : 'text-gray-900')}>Employers Only</h2>
            <p className={cn('mt-2 mb-6', isDark ? 'text-gray-400' : 'text-gray-500')}>Only employers can post jobs.</p>
            <Button onClick={() => navigate('/register')}>Register as Employer</Button>
          </div>
        </div>
      </MainLayout>
    );
  }


  return (
    <MainLayout>
      <div className={cn('min-h-screen pt-20', isDark ? 'bg-dark-bg' : 'bg-light-bg')}>
        <div className="container-custom py-10 max-w-3xl">
          {/* Header */}
          <div className="mb-10">
            <h1 className={cn('text-3xl font-black', isDark ? 'text-white' : 'text-gray-900')}>
              Post a <span className="gradient-text">New Job</span>
            </h1>
            <p className={cn('text-sm mt-1', isDark ? 'text-gray-400' : 'text-gray-500')}>
              Reach thousands of qualified candidates
            </p>
          </div>

          {/* Step Indicator */}
          <div className="flex items-center mb-10">
            {STEPS.map((label, i) => (
              <div key={label} className="flex items-center flex-1 last:flex-none">
                <div className="flex items-center gap-2">
                  <div className={cn(
                    'w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300',
                    i < step ? 'bg-accent-green text-white' : i === step ? 'bg-gradient-brand text-white shadow-glow-sm' : isDark ? 'bg-dark-border text-gray-500' : 'bg-gray-200 text-gray-400'
                  )}>
                    {i < step ? <Check className="w-4 h-4" /> : i + 1}
                  </div>
                  <span className={cn('text-xs font-medium hidden sm:block', i === step ? (isDark ? 'text-white' : 'text-gray-900') : isDark ? 'text-gray-500' : 'text-gray-400')}>
                    {label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={cn('flex-1 h-0.5 mx-3', i < step ? 'bg-accent-green' : isDark ? 'bg-dark-border' : 'bg-gray-200')} />
                )}
              </div>
            ))}
          </div>

          {/* Card */}
          <div className={cn('rounded-2xl border p-8', isDark ? 'bg-dark-card border-dark-border' : 'bg-white border-light-border shadow-sm')}>
            {/* Step 0: Basic Info */}
            {step === 0 && (
              <div className="space-y-5">
                <Input label="Job Title *" placeholder="e.g. Senior React Developer" value={form.title} onChange={e => update('title', e.target.value)} error={errors.title} icon={<Briefcase className="w-4 h-4" />} />
                <Input label="Company Name *" placeholder="Your company name" value={form.company} onChange={e => update('company', e.target.value)} error={errors.company} />
                <Input label="Location *" placeholder="e.g. Bangalore, India or Remote" value={form.location} onChange={e => update('location', e.target.value)} error={errors.location} icon={<MapPin className="w-4 h-4" />} />
                <SelectOption options={JOB_TYPES} field="jobType" label="Job Type" isDark={isDark} update={update} form={form} />
                <SelectOption options={CATEGORIES} field="category" label="Category" isDark={isDark} update={update} form={form} />
              </div>
            )}

            {/* Step 1: Details */}
            {step === 1 && (
              <div className="space-y-5">
                <div className="space-y-1.5">
                  <label className={cn('text-sm font-medium', isDark ? 'text-gray-300' : 'text-gray-700')}>
                    Job Description * <span className={cn('font-normal text-xs', isDark ? 'text-gray-500' : 'text-gray-400')}>(min 50 chars)</span>
                  </label>
                  <textarea
                    value={form.description}
                    onChange={e => update('description', e.target.value)}
                    rows={8}
                    placeholder="Describe the role, responsibilities, and what makes it exciting..."
                    className={cn(
                      'w-full rounded-xl px-4 py-3 text-sm resize-y min-h-[160px] outline-none border transition-all duration-300',
                      errors.description ? 'border-red-500/70' : '',
                      isDark
                        ? 'bg-dark-hover border-dark-border text-gray-100 placeholder-gray-500 focus:border-brand-purple focus:ring-1 focus:ring-brand-purple/50'
                        : 'bg-white border-light-border text-gray-900 placeholder-gray-400 focus:border-brand-purple focus:ring-1 focus:ring-brand-purple/30'
                    )}
                  />
                  {errors.description && <p className="text-xs text-red-400">{errors.description}</p>}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input label="Min Salary (₹/yr)" placeholder="e.g. 500000" type="number" value={form.salaryMin} onChange={e => update('salaryMin', e.target.value)} icon={<DollarSign className="w-4 h-4" />} />
                  <Input label="Max Salary (₹/yr)" placeholder="e.g. 1200000" type="number" value={form.salaryMax} onChange={e => update('salaryMax', e.target.value)} icon={<DollarSign className="w-4 h-4" />} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input label="Vacancies" type="number" min="1" value={form.vacancies} onChange={e => update('vacancies', e.target.value)} />
                  <Input label="Application Deadline" type="date" value={form.deadline} onChange={e => update('deadline', e.target.value)} />
                </div>
              </div>
            )}

            {/* Step 2: Requirements */}
            {step === 2 && (
              <div className="space-y-5">
                <SelectOption options={EXPERIENCE_LEVELS} field="experience" label="Experience Required" isDark={isDark} update={update} form={form} />
                <Input label="Education Requirement" placeholder="e.g. B.Tech / BE in CS" value={form.education} onChange={e => update('education', e.target.value)} />
                {/* Skills */}
                <div className="space-y-2">
                  <label className={cn('text-sm font-medium', isDark ? 'text-gray-300' : 'text-gray-700')}>Required Skills</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={skillInput}
                      onChange={e => setSkillInput(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSkill(); } }}
                      placeholder="Type a skill and press Enter or Add"
                      className={cn(
                        'flex-1 rounded-xl px-4 py-3 text-sm outline-none border transition-all duration-300',
                        isDark ? 'bg-dark-hover border-dark-border text-gray-100 placeholder-gray-500 focus:border-brand-purple' : 'bg-white border-light-border text-gray-900 placeholder-gray-400 focus:border-brand-purple'
                      )}
                    />
                    <Button type="button" variant="secondary" onClick={addSkill} size="sm">Add</Button>
                  </div>
                  {form.skills.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {form.skills.map(skill => (
                        <span key={skill} className={cn('flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border', isDark ? 'bg-brand-purple/10 border-brand-purple/25 text-brand-violet' : 'bg-purple-50 border-purple-200 text-brand-purple')}>
                          <Tag className="w-3 h-3" />
                          {skill}
                          <button onClick={() => removeSkill(skill)} className="hover:text-red-400 ml-0.5 transition-colors">×</button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 3: Review */}
            {step === 3 && (
              <div className="space-y-5">
                <h3 className={cn('text-lg font-bold', isDark ? 'text-white' : 'text-gray-900')}>Review Your Job Post</h3>
                {[
                  { label: 'Title', value: form.title },
                  { label: 'Company', value: form.company },
                  { label: 'Location', value: form.location },
                  { label: 'Type', value: form.jobType },
                  { label: 'Category', value: form.category },
                  { label: 'Experience', value: form.experience },
                  { label: 'Salary', value: `₹${form.salaryMin || 0} – ₹${form.salaryMax || 0}` },
                  { label: 'Vacancies', value: form.vacancies },
                ].map(({ label, value }) => (
                  <div key={label} className={cn('flex justify-between py-2.5 border-b text-sm', isDark ? 'border-dark-border' : 'border-light-border')}>
                    <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>{label}</span>
                    <span className={cn('font-medium capitalize', isDark ? 'text-gray-100' : 'text-gray-900')}>{value}</span>
                  </div>
                ))}
                {form.skills.length > 0 && (
                  <div>
                    <p className={cn('text-sm mb-2', isDark ? 'text-gray-400' : 'text-gray-500')}>Skills</p>
                    <div className="flex flex-wrap gap-2">
                      {form.skills.map(s => <span key={s} className="badge-purple">{s}</span>)}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Nav Buttons */}
            <div className="flex gap-3 mt-8">
              {step > 0 && (
                <Button variant="secondary" onClick={() => setStep(p => p - 1)}>Back</Button>
              )}
              {step < STEPS.length - 1 ? (
                <Button onClick={nextStep} className="flex-1" icon={<ChevronRight className="w-4 h-4" />}>
                  Continue
                </Button>
              ) : (
                <Button onClick={handleSubmit} loading={loading} className="flex-1" icon={<Check className="w-4 h-4" />}>
                  Post Job
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default PostJobPage;
