import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Briefcase, Eye, EyeOff, Building2, ArrowRight, ArrowLeft, Check, Sun, Moon, Sparkles, Shield, Zap, Users, ChevronRight } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { cn } from '../utils/cn';
import toast from 'react-hot-toast';

/* ─────────────── Version 2.0 Major — Register Page ─────────────── */

const STEPS = ['Role', 'Details', 'Password'];

const RegisterPage = () => {
  const { isDark, toggleTheme } = useTheme();
  const { register, user } = useAuth();
  const navigate = useNavigate();

  // Redirect if registered successfully
  useEffect(() => {
    if (user) navigate('/dashboard');
  }, [user, navigate]);

  // Entrance animation
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors] = useState({});
  const [focusedField, setFocusedField] = useState(null);
  // Step transition animation
  const [stepVisible, setStepVisible] = useState(true);
  const [form, setForm] = useState({
    role: '',
    name: '',
    email: '',
    companyName: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors(p => ({ ...p, [e.target.name]: '' }));
  };

  // Password strength calculator
  const getPasswordStrength = (pwd) => {
    if (!pwd) return { level: 0, label: '', color: '' };
    let score = 0;
    if (pwd.length >= 6) score++;
    if (pwd.length >= 10) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    if (score <= 1) return { level: 1, label: 'Weak', color: 'bg-red-500' };
    if (score <= 2) return { level: 2, label: 'Fair', color: 'bg-orange-500' };
    if (score <= 3) return { level: 3, label: 'Good', color: 'bg-yellow-500' };
    if (score <= 4) return { level: 4, label: 'Strong', color: 'bg-accent-green' };
    return { level: 5, label: 'Very Strong', color: 'bg-accent-green' };
  };

  const passwordStrength = getPasswordStrength(form.password);

  // Validators
  const validateStep0 = () => {
    if (!form.role) { setErrors({ role: 'Please select a role' }); return false; }
    return true;
  };
  const validateStep1 = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.email) errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Invalid email address';
    if (form.role === 'employer' && !form.companyName.trim()) errs.companyName = 'Company name is required';
    if (Object.keys(errs).length > 0) { setErrors(errs); return false; }
    return true;
  };
  const validateStep2 = () => {
    const errs = {};
    if (!form.password) errs.password = 'Password is required';
    else if (form.password.length < 6) errs.password = 'Minimum 6 characters';
    if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    if (Object.keys(errs).length > 0) { setErrors(errs); return false; }
    return true;
  };

  const animateStepChange = (newStep) => {
    setStepVisible(false);
    setTimeout(() => {
      setStep(newStep);
      setErrors({});
      setStepVisible(true);
    }, 250);
  };

  const next = () => {
    const validators = [validateStep0, validateStep1, validateStep2];
    if (validators[step]()) animateStepChange(step + 1);
  };

  const back = () => animateStepChange(step - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep2()) return;
    setLoading(true);
    try {
      const { confirmPassword, ...payload } = form;
      await register(payload);
      toast.success('Account created successfully! 🎉');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  // Dynamic left panel content per step
  const stepContent = [
    { title: 'Choose Your Path', desc: 'Whether you\'re looking for your dream job or the perfect candidate, we\'ve got you covered.', emoji: '🎯' },
    { title: 'Tell Us About You', desc: 'Your profile helps us personalize your experience and show you the most relevant opportunities.', emoji: '✨' },
    { title: 'Secure Your Account', desc: 'Create a strong password to keep your account and data safe. You\'re almost there!', emoji: '🔐' },
  ];

  return (
    <div className={cn(
      'register-v2 min-h-screen flex transition-colors duration-500',
      isDark ? 'bg-dark-bg' : 'bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/20'
    )}>
      {/* ───── Inline Styles ───── */}
      <style>{`
        .register-v2 .fade-up { opacity: 0; transform: translateY(30px); transition: all 0.7s cubic-bezier(0.16,1,0.3,1); }
        .register-v2 .fade-up.show { opacity: 1; transform: translateY(0); }
        .register-v2 .fade-left { opacity: 0; transform: translateX(-40px); transition: all 0.8s cubic-bezier(0.16,1,0.3,1); }
        .register-v2 .fade-left.show { opacity: 1; transform: translateX(0); }
        .register-v2 .fade-right { opacity: 0; transform: translateX(40px); transition: all 0.8s cubic-bezier(0.16,1,0.3,1); }
        .register-v2 .fade-right.show { opacity: 1; transform: translateX(0); }
        .register-v2 .scale-in { opacity: 0; transform: scale(0.9); transition: all 0.6s cubic-bezier(0.16,1,0.3,1); }
        .register-v2 .scale-in.show { opacity: 1; transform: scale(1); }
        .register-v2 .stagger-1 { transition-delay: 0.1s; }
        .register-v2 .stagger-2 { transition-delay: 0.2s; }
        .register-v2 .stagger-3 { transition-delay: 0.3s; }
        .register-v2 .stagger-4 { transition-delay: 0.4s; }
        .register-v2 .stagger-5 { transition-delay: 0.5s; }
        .register-v2 .stagger-6 { transition-delay: 0.6s; }
        .register-v2 .stagger-7 { transition-delay: 0.7s; }

        @keyframes float-particle-r {
          0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.5; }
          50% { transform: translateY(-25px) rotate(180deg); opacity: 1; }
        }
        @keyframes gradient-shift-r {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .register-v2 .particle {
          position: absolute; border-radius: 50%; pointer-events: none;
          animation: float-particle-r 4s ease-in-out infinite;
        }
        .register-v2 .gradient-animated {
          background-size: 200% 200%;
          animation: gradient-shift-r 4s ease infinite;
        }
        .register-v2 .input-glow:focus-within {
          box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.15);
        }
        .register-v2 .btn-shimmer {
          position: relative; overflow: hidden;
        }
        .register-v2 .btn-shimmer::after {
          content: '';
          position: absolute; top: -50%; left: -50%;
          width: 200%; height: 200%;
          background: linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.15) 50%, transparent 70%);
          transform: translateX(-100%);
          transition: transform 0.6s;
        }
        .register-v2 .btn-shimmer:hover::after {
          transform: translateX(100%);
        }
        .register-v2 .role-card { transition: all 0.3s cubic-bezier(0.16,1,0.3,1); }
        .register-v2 .role-card:hover { transform: translateY(-2px); }
        .register-v2 .step-content { transition: opacity 0.25s ease, transform 0.25s ease; }
        .register-v2 .step-content.hidden-step { opacity: 0; transform: translateY(15px); }
        .register-v2 .step-content.visible-step { opacity: 1; transform: translateY(0); }
      `}</style>

      {/* ───── LEFT PANEL — Brand + Step Context ───── */}
      <div className={cn(
        'hidden lg:flex lg:w-[48%] relative overflow-hidden flex-col justify-between p-12',
        isDark
          ? 'bg-gradient-to-br from-[#0f0526] via-[#1a0a3e] to-[#0B0F1A]'
          : 'bg-gradient-to-br from-brand-purple via-[#8B5CF6] to-[#A855F7]'
      )}>
        {/* Particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="particle"
              style={{
                width: `${6 + i * 3}px`, height: `${6 + i * 3}px`,
                background: isDark
                  ? `rgba(139, 92, 246, ${0.3 + i * 0.1})`
                  : `rgba(255, 255, 255, ${0.2 + i * 0.08})`,
                left: `${15 + i * 14}%`, top: `${10 + i * 12}%`,
                animationDelay: `${i * 0.7}s`, animationDuration: `${3 + i * 0.5}s`,
              }}
            />
          ))}
          <div className={cn(
            'absolute w-72 h-72 rounded-full blur-[100px]',
            isDark ? 'bg-brand-purple/20' : 'bg-white/20'
          )} style={{ top: '10%', right: '-10%' }} />
          <div className={cn(
            'absolute w-96 h-96 rounded-full blur-[120px]',
            isDark ? 'bg-brand-pink/15' : 'bg-pink-300/20'
          )} style={{ bottom: '-15%', left: '-10%' }} />
        </div>

        {/* Top — Logo */}
        <div className={cn('relative z-10 fade-left stagger-1', visible && 'show')}>
          <div className="flex items-center gap-3">
            <div className={cn(
              'w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg',
              isDark ? 'bg-gradient-to-br from-brand-purple to-brand-pink' : 'bg-white/20 backdrop-blur-sm'
            )}>
              <Briefcase className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white font-heading">
              Talent<span className="text-pink-300">Bridge</span>
            </span>
          </div>
        </div>

        {/* Middle — Dynamic Step Content */}
        <div className="relative z-10 max-w-md">
          <div className={cn('fade-left stagger-2', visible && 'show')}>
            <div className="text-6xl mb-6">{stepContent[step].emoji}</div>
            <h2 className="text-4xl xl:text-5xl font-black text-white font-heading leading-tight mb-4">
              {stepContent[step].title}
            </h2>
            <p className="text-white/70 text-lg leading-relaxed">
              {stepContent[step].desc}
            </p>
          </div>

          {/* Progress */}
          <div className={cn('mt-10 fade-left stagger-3', visible && 'show')}>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-white/80 text-sm font-medium">Step {step + 1} of {STEPS.length}</span>
              <span className="text-white/40 text-sm">— {STEPS[step]}</span>
            </div>
            <div className={cn(
              'w-full h-2 rounded-full overflow-hidden',
              isDark ? 'bg-white/10' : 'bg-white/20'
            )}>
              <div
                className="h-full bg-gradient-to-r from-pink-400 to-yellow-300 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Bottom — Version + Stats */}
        <div className={cn('relative z-10 fade-left stagger-4', visible && 'show')}>
          <div className="flex items-center gap-4">
            <div className={cn(
              'inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold',
              isDark
                ? 'bg-brand-purple/20 text-brand-violet border border-brand-purple/30'
                : 'bg-white/20 text-white border border-white/30'
            )}>
              <Sparkles className="w-3.5 h-3.5" />
              Version 2.0 Major
            </div>
            <div className="flex items-center gap-3 text-white/50 text-xs">
              <span className="flex items-center gap-1"><Shield className="w-3 h-3" /> 256-bit SSL</span>
              <span className="flex items-center gap-1"><Users className="w-3 h-3" /> 500K+ Users</span>
            </div>
          </div>
        </div>
      </div>

      {/* ───── RIGHT PANEL — Registration Form ───── */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-8 lg:p-12 relative overflow-y-auto">
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className={cn(
            'absolute top-6 right-6 w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300 z-50',
            isDark
              ? 'bg-dark-card border border-dark-border text-gray-400 hover:text-yellow-400 hover:border-brand-purple/40'
              : 'bg-white border border-gray-200 text-gray-500 hover:text-brand-purple hover:border-brand-purple/30 shadow-sm'
          )}
          aria-label="Toggle theme"
        >
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        {/* Mobile bg orbs */}
        <div className="lg:hidden absolute inset-0 overflow-hidden pointer-events-none">
          <div className={cn(
            'absolute w-64 h-64 rounded-full blur-[80px]',
            isDark ? 'bg-brand-purple/15' : 'bg-purple-200/40'
          )} style={{ top: '-10%', right: '-15%' }} />
          <div className={cn(
            'absolute w-48 h-48 rounded-full blur-[60px]',
            isDark ? 'bg-brand-pink/10' : 'bg-pink-200/30'
          )} style={{ bottom: '5%', left: '-10%' }} />
        </div>

        <div className="w-full max-w-md relative z-10">
          {/* Mobile logo */}
          <div className={cn('lg:hidden text-center mb-6 fade-up stagger-1', visible && 'show')}>
            <Link to="/" className="inline-flex items-center gap-2.5 mb-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-purple to-brand-pink flex items-center justify-center shadow-glow-sm">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <span className={cn('text-xl font-bold font-heading', isDark ? 'text-white' : 'text-gray-900')}>
                Talent<span className="gradient-text">Bridge</span>
              </span>
            </Link>
          </div>

          {/* Header */}
          <div className={cn('fade-up stagger-1', visible && 'show')}>
            <div className={cn(
              'inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-5',
              isDark
                ? 'bg-brand-purple/15 text-brand-violet border border-brand-purple/20'
                : 'bg-purple-100 text-brand-purple border border-purple-200'
            )}>
              <Sparkles className="w-3 h-3" />
              Create your account
            </div>
          </div>

          <div className={cn('fade-up stagger-2', visible && 'show')}>
            <h1 className={cn('text-3xl sm:text-4xl font-black font-heading mb-2', isDark ? 'text-white' : 'text-gray-900')}>
              Join <span className="gradient-text">TalentBridge</span>
            </h1>
          </div>

          <div className={cn('fade-up stagger-3 mb-6', visible && 'show')}>
            <p className={cn('text-sm', isDark ? 'text-gray-400' : 'text-gray-500')}>
              Set up your account in just a few steps
            </p>
          </div>

          {/* Step indicator - Desktop */}
          <div className={cn('fade-up stagger-3 hidden sm:flex items-center gap-1 mb-7', visible && 'show')}>
            {STEPS.map((label, i) => (
              <div key={label} className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => { if (i < step) animateStepChange(i); }}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300',
                    i < step
                      ? 'bg-accent-green/15 text-accent-green cursor-pointer hover:bg-accent-green/25'
                      : i === step
                        ? isDark
                            ? 'bg-brand-purple/20 text-brand-violet border border-brand-purple/30'
                            : 'bg-purple-100 text-brand-purple border border-purple-200'
                        : isDark ? 'bg-dark-card text-gray-500' : 'bg-gray-100 text-gray-400'
                  )}
                >
                  {i < step ? <Check className="w-3 h-3" /> : <span className="w-3 h-3 flex items-center justify-center text-[10px]">{i + 1}</span>}
                  {label}
                </button>
                {i < STEPS.length - 1 && <ChevronRight className={cn('w-3.5 h-3.5', isDark ? 'text-gray-600' : 'text-gray-300')} />}
              </div>
            ))}
          </div>

          {/* Mobile step indicator */}
          <div className={cn('sm:hidden flex items-center gap-2 mb-6 fade-up stagger-3', visible && 'show')}>
            {STEPS.map((_, i) => (
              <div key={i} className={cn(
                'h-1.5 flex-1 rounded-full transition-all duration-500',
                i <= step
                  ? 'bg-gradient-to-r from-brand-purple to-brand-pink'
                  : isDark ? 'bg-dark-border' : 'bg-gray-200'
              )} />
            ))}
          </div>

          {/* Card */}
          <div className={cn(
            'scale-in stagger-3 rounded-3xl p-7 sm:p-8 border',
            isDark
              ? 'bg-dark-card/80 border-dark-border backdrop-blur-xl shadow-card-dark'
              : 'bg-white/80 border-gray-100 backdrop-blur-xl shadow-xl shadow-purple-500/5',
            visible && 'show'
          )}>
            <form onSubmit={handleSubmit}>
              <div className={cn('step-content', stepVisible ? 'visible-step' : 'hidden-step')}>

                {/* ── Step 0: Role Selection ── */}
                {step === 0 && (
                  <div className="space-y-4">
                    <p className={cn('text-sm font-medium mb-5', isDark ? 'text-gray-300' : 'text-gray-700')}>
                      I am looking to...
                    </p>
                    {[
                      {
                        value: 'jobseeker', icon: User, title: 'Find a Job',
                        desc: 'Browse opportunities, apply, track applications',
                        gradient: 'from-blue-500 to-cyan-500',
                        lightBg: 'bg-blue-50 border-blue-200 hover:border-blue-400 hover:bg-blue-50',
                        darkBg: 'bg-blue-500/5 border-blue-500/20 hover:border-blue-400/50',
                        selectedLight: 'bg-blue-50 border-blue-500 shadow-lg shadow-blue-500/10',
                        selectedDark: 'bg-blue-500/10 border-blue-500 shadow-lg shadow-blue-500/20',
                      },
                      {
                        value: 'employer', icon: Building2, title: 'Hire Talent',
                        desc: 'Post jobs, review candidates, build your team',
                        gradient: 'from-brand-purple to-brand-pink',
                        lightBg: 'bg-purple-50 border-purple-200 hover:border-purple-400 hover:bg-purple-50',
                        darkBg: 'bg-brand-purple/5 border-brand-purple/20 hover:border-brand-purple/50',
                        selectedLight: 'bg-purple-50 border-brand-purple shadow-lg shadow-purple-500/10',
                        selectedDark: 'bg-brand-purple/10 border-brand-purple shadow-lg shadow-brand-purple/20',
                      },
                    ].map(opt => {
                      const isSelected = form.role === opt.value;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => { setForm(p => ({ ...p, role: opt.value })); setErrors({}); }}
                          className={cn(
                            'role-card w-full flex items-center gap-4 p-5 rounded-2xl border-2 text-left transition-all duration-300',
                            isSelected
                              ? isDark ? opt.selectedDark : opt.selectedLight
                              : isDark ? opt.darkBg : `bg-white ${opt.lightBg}`
                          )}
                        >
                          <div className={cn(
                            'w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300',
                            isSelected
                              ? `bg-gradient-to-br ${opt.gradient} shadow-lg`
                              : isDark ? 'bg-dark-hover' : 'bg-gray-100'
                          )}>
                            <opt.icon className={cn('w-5 h-5 transition-colors', isSelected ? 'text-white' : isDark ? 'text-gray-400' : 'text-gray-500')} />
                          </div>
                          <div className="flex-1">
                            <p className={cn('font-semibold text-sm', isDark ? 'text-gray-100' : 'text-gray-900')}>{opt.title}</p>
                            <p className={cn('text-xs mt-0.5', isDark ? 'text-gray-400' : 'text-gray-500')}>{opt.desc}</p>
                          </div>
                          <div className={cn(
                            'w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-300 shrink-0',
                            isSelected
                              ? 'border-current bg-current'
                              : isDark ? 'border-gray-600' : 'border-gray-300'
                          )}>
                            {isSelected && <Check className="w-3 h-3 text-white" />}
                          </div>
                        </button>
                      );
                    })}
                    {errors.role && <p className="text-xs text-red-400 flex items-center gap-1 mt-2">{errors.role}</p>}
                  </div>
                )}

                {/* ── Step 1: Details ── */}
                {step === 1 && (
                  <div className="space-y-5">
                    {/* Full Name */}
                    <div>
                      <label className={cn('block text-sm font-medium mb-2', isDark ? 'text-gray-300' : 'text-gray-700')}>
                        Full Name
                      </label>
                      <div className={cn(
                        'input-glow relative flex items-center rounded-xl border transition-all duration-300',
                        focusedField === 'name'
                          ? isDark ? 'border-brand-purple bg-dark-hover' : 'border-brand-purple bg-purple-50/50'
                          : isDark ? 'border-dark-border bg-dark-hover' : 'border-gray-200 bg-gray-50/80',
                        errors.name && 'border-red-500/70'
                      )}>
                        <div className={cn('pl-4 transition-colors', focusedField === 'name' ? 'text-brand-purple' : 'text-gray-400')}>
                          <User className="w-4.5 h-4.5" />
                        </div>
                        <input
                          name="name" placeholder="John Doe" value={form.name} onChange={handleChange}
                          onFocus={() => setFocusedField('name')} onBlur={() => setFocusedField(null)}
                          className={cn('w-full bg-transparent px-3 py-3.5 text-sm outline-none', isDark ? 'text-white placeholder-gray-500' : 'text-gray-900 placeholder-gray-400')}
                        />
                      </div>
                      {errors.name && <p className="mt-1.5 text-xs text-red-400">{errors.name}</p>}
                    </div>

                    {/* Email */}
                    <div>
                      <label className={cn('block text-sm font-medium mb-2', isDark ? 'text-gray-300' : 'text-gray-700')}>
                        Email Address
                      </label>
                      <div className={cn(
                        'input-glow relative flex items-center rounded-xl border transition-all duration-300',
                        focusedField === 'email'
                          ? isDark ? 'border-brand-purple bg-dark-hover' : 'border-brand-purple bg-purple-50/50'
                          : isDark ? 'border-dark-border bg-dark-hover' : 'border-gray-200 bg-gray-50/80',
                        errors.email && 'border-red-500/70'
                      )}>
                        <div className={cn('pl-4 transition-colors', focusedField === 'email' ? 'text-brand-purple' : 'text-gray-400')}>
                          <Mail className="w-4.5 h-4.5" />
                        </div>
                        <input
                          name="email" type="email" placeholder="you@example.com" value={form.email} onChange={handleChange}
                          onFocus={() => setFocusedField('email')} onBlur={() => setFocusedField(null)}
                          className={cn('w-full bg-transparent px-3 py-3.5 text-sm outline-none', isDark ? 'text-white placeholder-gray-500' : 'text-gray-900 placeholder-gray-400')}
                        />
                      </div>
                      {errors.email && <p className="mt-1.5 text-xs text-red-400">{errors.email}</p>}
                    </div>

                    {/* Company Name (employer only) */}
                    {form.role === 'employer' && (
                      <div>
                        <label className={cn('block text-sm font-medium mb-2', isDark ? 'text-gray-300' : 'text-gray-700')}>
                          Company Name
                        </label>
                        <div className={cn(
                          'input-glow relative flex items-center rounded-xl border transition-all duration-300',
                          focusedField === 'companyName'
                            ? isDark ? 'border-brand-purple bg-dark-hover' : 'border-brand-purple bg-purple-50/50'
                            : isDark ? 'border-dark-border bg-dark-hover' : 'border-gray-200 bg-gray-50/80',
                          errors.companyName && 'border-red-500/70'
                        )}>
                          <div className={cn('pl-4 transition-colors', focusedField === 'companyName' ? 'text-brand-purple' : 'text-gray-400')}>
                            <Building2 className="w-4.5 h-4.5" />
                          </div>
                          <input
                            name="companyName" placeholder="Acme Corp" value={form.companyName} onChange={handleChange}
                            onFocus={() => setFocusedField('companyName')} onBlur={() => setFocusedField(null)}
                            className={cn('w-full bg-transparent px-3 py-3.5 text-sm outline-none', isDark ? 'text-white placeholder-gray-500' : 'text-gray-900 placeholder-gray-400')}
                          />
                        </div>
                        {errors.companyName && <p className="mt-1.5 text-xs text-red-400">{errors.companyName}</p>}
                      </div>
                    )}
                  </div>
                )}

                {/* ── Step 2: Password ── */}
                {step === 2 && (
                  <div className="space-y-5">
                    {/* Password */}
                    <div>
                      <label className={cn('block text-sm font-medium mb-2', isDark ? 'text-gray-300' : 'text-gray-700')}>
                        Password
                      </label>
                      <div className={cn(
                        'input-glow relative flex items-center rounded-xl border transition-all duration-300',
                        focusedField === 'password'
                          ? isDark ? 'border-brand-purple bg-dark-hover' : 'border-brand-purple bg-purple-50/50'
                          : isDark ? 'border-dark-border bg-dark-hover' : 'border-gray-200 bg-gray-50/80',
                        errors.password && 'border-red-500/70'
                      )}>
                        <div className={cn('pl-4 transition-colors', focusedField === 'password' ? 'text-brand-purple' : 'text-gray-400')}>
                          <Lock className="w-4.5 h-4.5" />
                        </div>
                        <input
                          name="password" type={showPass ? 'text' : 'password'} placeholder="Min 6 characters"
                          value={form.password} onChange={handleChange}
                          onFocus={() => setFocusedField('password')} onBlur={() => setFocusedField(null)}
                          className={cn('w-full bg-transparent px-3 py-3.5 text-sm outline-none', isDark ? 'text-white placeholder-gray-500' : 'text-gray-900 placeholder-gray-400')}
                        />
                        <button type="button" onClick={() => setShowPass(p => !p)}
                          className={cn('pr-4 transition-colors', isDark ? 'text-gray-500 hover:text-brand-violet' : 'text-gray-400 hover:text-brand-purple')}>
                          {showPass ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                        </button>
                      </div>
                      {errors.password && <p className="mt-1.5 text-xs text-red-400">{errors.password}</p>}

                      {/* Password strength bar */}
                      {form.password && (
                        <div className="mt-3">
                          <div className="flex gap-1.5 mb-1.5">
                            {[1, 2, 3, 4, 5].map(i => (
                              <div key={i} className={cn(
                                'h-1.5 flex-1 rounded-full transition-all duration-300',
                                i <= passwordStrength.level
                                  ? passwordStrength.color
                                  : isDark ? 'bg-dark-border' : 'bg-gray-200'
                              )} />
                            ))}
                          </div>
                          <p className={cn('text-xs font-medium', isDark ? 'text-gray-400' : 'text-gray-500')}>
                            Strength: <span className={cn(
                              passwordStrength.level <= 1 ? 'text-red-400'
                              : passwordStrength.level <= 2 ? 'text-orange-400'
                              : passwordStrength.level <= 3 ? 'text-yellow-400'
                              : 'text-accent-green'
                            )}>{passwordStrength.label}</span>
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Confirm Password */}
                    <div>
                      <label className={cn('block text-sm font-medium mb-2', isDark ? 'text-gray-300' : 'text-gray-700')}>
                        Confirm Password
                      </label>
                      <div className={cn(
                        'input-glow relative flex items-center rounded-xl border transition-all duration-300',
                        focusedField === 'confirmPassword'
                          ? isDark ? 'border-brand-purple bg-dark-hover' : 'border-brand-purple bg-purple-50/50'
                          : isDark ? 'border-dark-border bg-dark-hover' : 'border-gray-200 bg-gray-50/80',
                        errors.confirmPassword && 'border-red-500/70'
                      )}>
                        <div className={cn('pl-4 transition-colors', focusedField === 'confirmPassword' ? 'text-brand-purple' : 'text-gray-400')}>
                          <Lock className="w-4.5 h-4.5" />
                        </div>
                        <input
                          name="confirmPassword" type="password" placeholder="Repeat password"
                          value={form.confirmPassword} onChange={handleChange}
                          onFocus={() => setFocusedField('confirmPassword')} onBlur={() => setFocusedField(null)}
                          className={cn('w-full bg-transparent px-3 py-3.5 text-sm outline-none', isDark ? 'text-white placeholder-gray-500' : 'text-gray-900 placeholder-gray-400')}
                        />
                        {/* Match indicator */}
                        {form.confirmPassword && (
                          <div className="pr-4">
                            {form.password === form.confirmPassword ? (
                              <Check className="w-4.5 h-4.5 text-accent-green" />
                            ) : (
                              <svg className="w-4.5 h-4.5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                            )}
                          </div>
                        )}
                      </div>
                      {errors.confirmPassword && <p className="mt-1.5 text-xs text-red-400">{errors.confirmPassword}</p>}
                    </div>
                  </div>
                )}

              </div>

              {/* ── Action Buttons ── */}
              <div className="flex gap-3 mt-7">
                {step > 0 && (
                  <button
                    type="button"
                    onClick={back}
                    className={cn(
                      'flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl text-sm font-semibold transition-all duration-300',
                      'hover:scale-[1.02] active:scale-[0.98]',
                      isDark
                        ? 'bg-dark-hover border border-dark-border text-gray-300 hover:border-brand-purple/30'
                        : 'bg-gray-100 border border-gray-200 text-gray-600 hover:border-brand-purple/30 hover:bg-gray-50'
                    )}
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </button>
                )}
                {step < 2 ? (
                  <button
                    type="button"
                    onClick={next}
                    className={cn(
                      'btn-shimmer flex-1 flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-semibold text-sm text-white',
                      'bg-gradient-to-r from-brand-purple via-brand-pink to-brand-orange gradient-animated',
                      'hover:shadow-glow-md hover:scale-[1.02] active:scale-[0.98]',
                      'transition-all duration-300 cursor-pointer'
                    )}
                  >
                    Continue
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={loading}
                    className={cn(
                      'btn-shimmer flex-1 flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-semibold text-sm text-white',
                      'bg-gradient-to-r from-brand-purple via-brand-pink to-brand-orange gradient-animated',
                      'hover:shadow-glow-md hover:scale-[1.02] active:scale-[0.98]',
                      'transition-all duration-300 cursor-pointer',
                      loading && 'opacity-60 cursor-not-allowed hover:scale-100 hover:shadow-none'
                    )}
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                        </svg>
                        Creating Account...
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        Create Account
                      </>
                    )}
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Login link */}
          <div className={cn('fade-up stagger-7 text-center mt-7', visible && 'show')}>
            <p className={cn('text-sm', isDark ? 'text-gray-400' : 'text-gray-500')}>
              Already have an account?{' '}
              <Link
                to="/login"
                className={cn(
                  'font-semibold transition-colors inline-flex items-center gap-1',
                  isDark ? 'text-brand-violet hover:text-brand-pink' : 'text-brand-purple hover:text-brand-pink'
                )}
              >
                Sign in
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
