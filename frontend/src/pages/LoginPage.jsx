import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Briefcase, ArrowRight, Sun, Moon, Sparkles, Shield, Zap, Users } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { cn } from '../utils/cn';
import toast from 'react-hot-toast';

/* ─────────────── Version 2.0 Major — Login Page ─────────────── */

const LoginPage = () => {
  const { isDark, toggleTheme } = useTheme();
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const formRef = useRef(null);

  // Redirect if already logged in
  useEffect(() => {
    if (user) navigate('/dashboard');
  }, [user, navigate]);

  // Entrance animation
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [focusedField, setFocusedField] = useState(null);

  const validate = () => {
    const errs = {};
    if (!form.email) errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Please enter a valid email';
    if (!form.password) errs.password = 'Password is required';
    else if (form.password.length < 6) errs.password = 'Minimum 6 characters required';
    return errs;
  };

  const handleChange = (e) => {
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors(p => ({ ...p, [e.target.name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('Welcome back! 🎉');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  // Feature highlights for left panel
  const features = [
    { icon: Zap, title: 'Lightning Fast', desc: 'Find your dream job in seconds' },
    { icon: Shield, title: 'Secure & Private', desc: 'Your data is always protected' },
    { icon: Users, title: '500K+ Users', desc: 'Join our growing community' },
  ];

  return (
    <div className={cn(
      'login-v2 min-h-screen flex transition-colors duration-500',
      isDark ? 'bg-dark-bg' : 'bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/20'
    )}>
      {/* ───── Inline Styles for v2.0 animations ───── */}
      <style>{`
        .login-v2 .fade-up { opacity: 0; transform: translateY(30px); transition: all 0.7s cubic-bezier(0.16,1,0.3,1); }
        .login-v2 .fade-up.show { opacity: 1; transform: translateY(0); }
        .login-v2 .fade-left { opacity: 0; transform: translateX(-40px); transition: all 0.8s cubic-bezier(0.16,1,0.3,1); }
        .login-v2 .fade-left.show { opacity: 1; transform: translateX(0); }
        .login-v2 .fade-right { opacity: 0; transform: translateX(40px); transition: all 0.8s cubic-bezier(0.16,1,0.3,1); }
        .login-v2 .fade-right.show { opacity: 1; transform: translateX(0); }
        .login-v2 .scale-in { opacity: 0; transform: scale(0.9); transition: all 0.6s cubic-bezier(0.16,1,0.3,1); }
        .login-v2 .scale-in.show { opacity: 1; transform: scale(1); }
        .login-v2 .stagger-1 { transition-delay: 0.1s; }
        .login-v2 .stagger-2 { transition-delay: 0.2s; }
        .login-v2 .stagger-3 { transition-delay: 0.3s; }
        .login-v2 .stagger-4 { transition-delay: 0.4s; }
        .login-v2 .stagger-5 { transition-delay: 0.5s; }
        .login-v2 .stagger-6 { transition-delay: 0.6s; }
        .login-v2 .stagger-7 { transition-delay: 0.7s; }

        @keyframes float-particle {
          0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.6; }
          50% { transform: translateY(-20px) rotate(180deg); opacity: 1; }
        }
        @keyframes orbit {
          0% { transform: rotate(0deg) translateX(120px) rotate(0deg); }
          100% { transform: rotate(360deg) translateX(120px) rotate(-360deg); }
        }
        @keyframes pulse-ring {
          0% { transform: scale(0.95); opacity: 0.5; }
          50% { transform: scale(1.05); opacity: 0.8; }
          100% { transform: scale(0.95); opacity: 0.5; }
        }
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .login-v2 .particle {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          animation: float-particle 4s ease-in-out infinite;
        }
        .login-v2 .orbit-dot {
          position: absolute;
          width: 8px; height: 8px;
          border-radius: 50%;
          animation: orbit 8s linear infinite;
        }
        .login-v2 .pulse-ring {
          animation: pulse-ring 3s ease-in-out infinite;
        }
        .login-v2 .gradient-animated {
          background-size: 200% 200%;
          animation: gradient-shift 4s ease infinite;
        }
        .login-v2 .input-glow:focus-within {
          box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.15);
        }
        .login-v2 .btn-shimmer {
          position: relative;
          overflow: hidden;
        }
        .login-v2 .btn-shimmer::after {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.15) 50%, transparent 70%);
          transform: translateX(-100%);
          transition: transform 0.6s;
        }
        .login-v2 .btn-shimmer:hover::after {
          transform: translateX(100%);
        }
        .login-v2 .feature-card {
          transition: all 0.3s cubic-bezier(0.16,1,0.3,1);
        }
        .login-v2 .feature-card:hover {
          transform: translateX(8px);
        }
      `}</style>

      {/* ───── LEFT PANEL — Brand Showcase (hidden on mobile) ───── */}
      <div className={cn(
        'hidden lg:flex lg:w-[48%] relative overflow-hidden flex-col justify-center items-center p-12',
        isDark
          ? 'bg-gradient-to-br from-[#0f0526] via-[#1a0a3e] to-[#0B0F1A]'
          : 'bg-gradient-to-br from-brand-purple via-[#8B5CF6] to-[#A855F7]'
      )}>
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Floating particles */}
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="particle"
              style={{
                width: `${6 + i * 3}px`,
                height: `${6 + i * 3}px`,
                background: isDark
                  ? `rgba(139, 92, 246, ${0.3 + i * 0.1})`
                  : `rgba(255, 255, 255, ${0.2 + i * 0.08})`,
                left: `${15 + i * 14}%`,
                top: `${10 + i * 12}%`,
                animationDelay: `${i * 0.7}s`,
                animationDuration: `${3 + i * 0.5}s`,
              }}
            />
          ))}
          {/* Large gradient orbs */}
          <div className={cn(
            'absolute w-72 h-72 rounded-full blur-[100px]',
            isDark ? 'bg-brand-purple/20' : 'bg-white/20'
          )} style={{ top: '10%', right: '-10%' }} />
          <div className={cn(
            'absolute w-96 h-96 rounded-full blur-[120px]',
            isDark ? 'bg-brand-pink/15' : 'bg-pink-300/20'
          )} style={{ bottom: '-15%', left: '-10%' }} />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-md">
          {/* Logo */}
          <div className={cn('fade-left stagger-1', visible && 'show')}>
            <div className="flex items-center gap-3 mb-12">
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

          {/* Main heading */}
          <div className={cn('fade-left stagger-2', visible && 'show')}>
            <h2 className="text-4xl xl:text-5xl font-black text-white font-heading leading-tight mb-4">
              Your Next{' '}
              <span className={cn(
                'inline-block gradient-animated bg-gradient-to-r from-pink-300 via-yellow-200 to-pink-300 bg-clip-text text-transparent'
              )}>
                Career Move
              </span>{' '}
              Starts Here
            </h2>
          </div>
          <div className={cn('fade-left stagger-3', visible && 'show')}>
            <p className="text-white/70 text-lg mb-10 leading-relaxed">
              Connect with top companies, discover opportunities that match your skills, and take your career to new heights.
            </p>
          </div>

          {/* Feature cards */}
          <div className="space-y-4">
            {features.map((f, i) => (
              <div
                key={f.title}
                className={cn(
                  'fade-left feature-card flex items-center gap-4 p-4 rounded-2xl',
                  isDark
                    ? 'bg-white/5 border border-white/10 backdrop-blur-sm'
                    : 'bg-white/15 border border-white/20 backdrop-blur-sm',
                  `stagger-${i + 4}`,
                  visible && 'show'
                )}
              >
                <div className={cn(
                  'w-10 h-10 rounded-xl flex items-center justify-center shrink-0',
                  isDark ? 'bg-brand-purple/30' : 'bg-white/20'
                )}>
                  <f.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">{f.title}</p>
                  <p className="text-white/60 text-xs mt-0.5">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Version badge */}
          <div className={cn('fade-left stagger-7 mt-10', visible && 'show')}>
            <div className={cn(
              'inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold',
              isDark
                ? 'bg-brand-purple/20 text-brand-violet border border-brand-purple/30'
                : 'bg-white/20 text-white border border-white/30'
            )}>
              <Sparkles className="w-3.5 h-3.5" />
              Version 2.0 Major — New UI
            </div>
          </div>
        </div>
      </div>

      {/* ───── RIGHT PANEL — Login Form ───── */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-8 lg:p-12 relative">
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

        {/* Mobile background orbs */}
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

        <div className="w-full max-w-md relative z-10" ref={formRef}>
          {/* Mobile logo */}
          <div className={cn('lg:hidden text-center mb-8 fade-up stagger-1', visible && 'show')}>
            <Link to="/" className="inline-flex items-center gap-2.5 mb-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-purple to-brand-pink flex items-center justify-center shadow-glow-sm">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <span className={cn('text-xl font-bold font-heading', isDark ? 'text-white' : 'text-gray-900')}>
                Talent<span className="gradient-text">Bridge</span>
              </span>
            </Link>
          </div>

          {/* Welcome text */}
          <div className={cn('fade-up stagger-1', visible && 'show')}>
            <div className={cn(
              'inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-5',
              isDark
                ? 'bg-brand-purple/15 text-brand-violet border border-brand-purple/20'
                : 'bg-purple-100 text-brand-purple border border-purple-200'
            )}>
              <Sparkles className="w-3 h-3" />
              Welcome back
            </div>
          </div>

          <div className={cn('fade-up stagger-2', visible && 'show')}>
            <h1 className={cn('text-3xl sm:text-4xl font-black font-heading mb-2', isDark ? 'text-white' : 'text-gray-900')}>
              Sign in to your{' '}
              <span className="gradient-text">account</span>
            </h1>
          </div>

          <div className={cn('fade-up stagger-3 mb-8', visible && 'show')}>
            <p className={cn('text-sm', isDark ? 'text-gray-400' : 'text-gray-500')}>
              Enter your credentials to access your dashboard
            </p>
          </div>

          {/* Form Card */}
          <div className={cn(
            'scale-in stagger-3 rounded-3xl p-7 sm:p-8 border',
            isDark
              ? 'bg-dark-card/80 border-dark-border backdrop-blur-xl shadow-card-dark'
              : 'bg-white/80 border-gray-100 backdrop-blur-xl shadow-xl shadow-purple-500/5'
          , visible && 'show')}>
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email input */}
              <div className={cn('fade-up stagger-4', visible && 'show')}>
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
                  <div className={cn(
                    'pl-4 transition-colors duration-300',
                    focusedField === 'email' ? 'text-brand-purple' : 'text-gray-400'
                  )}>
                    <Mail className="w-4.5 h-4.5" />
                  </div>
                  <input
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    className={cn(
                      'w-full bg-transparent px-3 py-3.5 text-sm outline-none',
                      isDark ? 'text-white placeholder-gray-500' : 'text-gray-900 placeholder-gray-400'
                    )}
                  />
                </div>
                {errors.email && (
                  <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password input */}
              <div className={cn('fade-up stagger-5', visible && 'show')}>
                <div className="flex items-center justify-between mb-2">
                  <label className={cn('text-sm font-medium', isDark ? 'text-gray-300' : 'text-gray-700')}>
                    Password
                  </label>
                  <Link
                    to="/forgot-password"
                    className={cn(
                      'text-xs font-medium transition-colors',
                      isDark ? 'text-brand-violet hover:text-brand-pink' : 'text-brand-purple hover:text-brand-pink'
                    )}
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className={cn(
                  'input-glow relative flex items-center rounded-xl border transition-all duration-300',
                  focusedField === 'password'
                    ? isDark ? 'border-brand-purple bg-dark-hover' : 'border-brand-purple bg-purple-50/50'
                    : isDark ? 'border-dark-border bg-dark-hover' : 'border-gray-200 bg-gray-50/80',
                  errors.password && 'border-red-500/70'
                )}>
                  <div className={cn(
                    'pl-4 transition-colors duration-300',
                    focusedField === 'password' ? 'text-brand-purple' : 'text-gray-400'
                  )}>
                    <Lock className="w-4.5 h-4.5" />
                  </div>
                  <input
                    name="password"
                    type={showPass ? 'text' : 'password'}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    value={form.password}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                    className={cn(
                      'w-full bg-transparent px-3 py-3.5 text-sm outline-none',
                      isDark ? 'text-white placeholder-gray-500' : 'text-gray-900 placeholder-gray-400'
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(p => !p)}
                    className={cn(
                      'pr-4 transition-colors duration-200',
                      isDark ? 'text-gray-500 hover:text-brand-violet' : 'text-gray-400 hover:text-brand-purple'
                    )}
                  >
                    {showPass ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Submit button */}
              <div className={cn('fade-up stagger-6 pt-1', visible && 'show')}>
                <button
                  type="submit"
                  disabled={loading}
                  className={cn(
                    'btn-shimmer w-full flex items-center justify-center gap-2.5 px-6 py-4 rounded-xl font-semibold text-sm text-white',
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
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign In
                      <ArrowRight className="w-4.5 h-4.5" />
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Divider */}
            <div className={cn('fade-up stagger-6 relative my-7 flex items-center gap-3', visible && 'show')}>
              <div className={cn('flex-1 h-px', isDark ? 'bg-dark-border' : 'bg-gray-200')} />
              <span className={cn('text-xs font-medium', isDark ? 'text-gray-500' : 'text-gray-400')}>
                or continue with
              </span>
              <div className={cn('flex-1 h-px', isDark ? 'bg-dark-border' : 'bg-gray-200')} />
            </div>

            {/* Social login */}
            <div className={cn('fade-up stagger-7 grid grid-cols-2 gap-3', visible && 'show')}>
              {[
                { name: 'Google', icon: '🔍' },
                { name: 'LinkedIn', icon: '💼' },
              ].map(provider => (
                <button
                  key={provider.name}
                  type="button"
                  onClick={() => toast('Social login coming soon!')}
                  className={cn(
                    'flex items-center justify-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium',
                    'transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]',
                    isDark
                      ? 'border-dark-border text-gray-300 hover:bg-white/5 hover:border-brand-purple/30'
                      : 'border-gray-200 text-gray-600 hover:bg-purple-50/60 hover:border-brand-purple/30 bg-gray-50/50'
                  )}
                >
                  <span className="text-base">{provider.icon}</span>
                  {provider.name}
                </button>
              ))}
            </div>
          </div>

          {/* Register link */}
          <div className={cn('fade-up stagger-7 text-center mt-7', visible && 'show')}>
            <p className={cn('text-sm', isDark ? 'text-gray-400' : 'text-gray-500')}>
              Don&apos;t have an account?{' '}
              <Link
                to="/register"
                className={cn(
                  'font-semibold transition-colors inline-flex items-center gap-1',
                  isDark ? 'text-brand-violet hover:text-brand-pink' : 'text-brand-purple hover:text-brand-pink'
                )}
              >
                Create one free
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
