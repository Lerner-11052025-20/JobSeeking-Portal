import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Briefcase, TrendingUp, Sparkles, ArrowRight, UserCheck, Star, Zap, ChevronRight, X } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { cn } from '../../utils/cn';

/* ─────────────── Version 2.0 Major — Hero Section ─────────────── */

const HeroSection = () => {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef(null);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (keyword) params.set('q', keyword);
    if (location) params.set('location', location);
    navigate(`/jobs?${params.toString()}`);
  };

  const popularSearches = ['React Developer', 'Product Manager', 'Data Scientist', 'UI/UX Designer', 'DevOps'];

  // Mouse tracking for parallax orb effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!containerRef.current) return;
      const { clientX, clientY } = e;
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;

      const moveX = (clientX - windowWidth / 2) * 0.05;
      const moveY = (clientY - windowHeight / 2) * 0.05;

      document.documentElement.style.setProperty('--mouse-x', `${moveX}px`);
      document.documentElement.style.setProperty('--mouse-y', `${moveY}px`);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <>
      <style>{`
        /* v2.0 Hero Animations */
        .hero-title-word {
          display: inline-block;
          animation: wordFadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        @keyframes wordFadeUp {
          from { opacity: 0; transform: translateY(30px) rotate(-2deg); }
          to { opacity: 1; transform: translateY(0) rotate(0); }
        }
        
        .hero-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.6;
          transition: transform 0.2s ease-out;
          transform: translate(var(--mouse-x, 0), var(--mouse-y, 0));
          pointer-events: none;
        }

        .search-glass {
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease, border-color 0.4s ease;
        }
        .search-glass.focused {
          transform: translateY(-4px) scale(1.02);
        }

        .floating-badge {
          animation: float 6s ease-in-out infinite;
        }
        .floating-badge-delayed {
          animation: float 6s ease-in-out infinite 3s;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }

        .avatar-stack-item {
          border: 2px solid var(--border-color);
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .avatar-stack-item:hover {
          transform: translateY(-8px) scale(1.1);
          z-index: 10;
        }

        .stat-card-v2 {
          position: relative;
          overflow: hidden;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .stat-card-v2::before {
          content: '';
          position: absolute;
          top: -50%; left: -50%; width: 200%; height: 200%;
          background: conic-gradient(transparent, rgba(124, 58, 237, 0.1), transparent 30%);
          animation: rotate 6s linear infinite;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .stat-card-v2:hover::before { opacity: 1; }
        .stat-card-v2:hover {
          transform: translateY(-5px);
        }
        @keyframes rotate {
          100% { transform: rotate(360deg); }
        }
      `}</style>

      <section
        ref={containerRef}
        className={cn(
          'relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-24 pb-16',
          isDark ? 'bg-[#0B0A11]' : 'bg-slate-50'
        )}
      >
        {/* ─── V2.0 Dynamic Background Effects ─── */}
        <div className="absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
          {/* Parallax Orbs */}
          <div className="hero-orb bg-indigo-500/30 w-[600px] h-[600px] -top-32 -left-32 mix-blend-multiply dark:mix-blend-screen" />
          <div className="hero-orb bg-fuchsia-500/20 w-[500px] h-[500px] top-1/4 -right-20 mix-blend-multiply dark:mix-blend-screen" style={{ '--mouse-x': 'calc(var(--mouse-y) * -1)', '--mouse-y': 'calc(var(--mouse-x) * -1)' }} />
          <div className="hero-orb bg-amber-500/20 w-[600px] h-[600px] -bottom-40 left-1/4 mix-blend-multiply dark:mix-blend-screen" style={{ '--mouse-x': 'calc(var(--mouse-x) * 0.5)', '--mouse-y': 'calc(var(--mouse-y) * 0.5)' }} />

          {/* Grid Pattern */}
          <div
            className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none"
            style={{
              backgroundImage: 'linear-gradient(rgba(0,0,0,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,1) 1px, transparent 1px)',
              backgroundSize: '40px 40px',
              maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)',
              WebkitMaskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)'
            }}
          />
        </div>

        {/* ─── Floating UI Elements (Hero Decor) ─── */}
        <div className="absolute inset-0 z-10 pointer-events-none hidden lg:block max-w-[1400px] mx-auto w-full">
          {/* Top Left Badge */}
          <div className={cn(
            'floating-badge absolute top-[25%] left-[8%] px-4 py-3 rounded-2xl flex items-center gap-3 backdrop-blur-xl border shadow-xl',
            isDark ? 'bg-dark-card/60 border-white/10' : 'bg-white/80 border-white/50'
          )}>
            <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-500">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <p className={cn('text-xs font-bold', isDark ? 'text-white' : 'text-gray-900')}>10K+ Hired</p>
              <p className={cn('text-[10px]', isDark ? 'text-gray-400' : 'text-gray-500')}>This month</p>
            </div>
          </div>

          {/* Bottom Right Badge */}
          <div className={cn(
            'floating-badge-delayed absolute top-[35%] right-[8%] px-4 py-3 rounded-2xl flex items-center gap-3 backdrop-blur-xl border shadow-xl',
            isDark ? 'bg-dark-card/60 border-white/10' : 'bg-white/80 border-white/50'
          )}>
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <p className={cn('text-xs font-bold', isDark ? 'text-white' : 'text-gray-900')}>Fast Response</p>
              <p className={cn('text-[10px]', isDark ? 'text-gray-400' : 'text-gray-500')}>24h avg. reply</p>
            </div>
          </div>
        </div>

        {/* ─── Main Content ─── */}
        <div className="container-custom relative z-20 flex flex-col items-center text-center">

          {/* Version/Announcement Badge */}
          <div className={cn(
            'inline-flex items-center gap-2 px-3 py-1.5 rounded-full border mb-8 cursor-pointer group transition-all hover:scale-105',
            isDark
              ? 'bg-brand-purple/10 border-brand-purple/30 hover:bg-brand-purple/20 shadow-[0_0_15px_rgba(124,58,237,0.15)]'
              : 'bg-white border-brand-purple/20 hover:border-brand-purple/40 shadow-sm text-brand-purple'
          )}>
            <span className="w-4 h-4 rounded-full bg-brand-pink text-white flex items-center justify-center">
              <Sparkles className="w-2.5 h-2.5" />
            </span>
            <span className={cn('text-[11px] font-bold tracking-wide uppercase', isDark ? 'text-brand-pink' : 'text-brand-purple')}>
              v2.0 UI Overhaul Live
            </span>
            <ChevronRight className={cn('w-3 h-3 transition-transform group-hover:translate-x-1', isDark ? 'text-brand-pink' : 'text-brand-purple')} />
          </div>

          {/* Headline with sequential animation */}
          <h1 className={cn(
            'text-5xl sm:text-6xl md:text-7xl lg:text-[80px] font-black font-heading leading-[1.05] tracking-tight mb-6 max-w-[900px]',
            isDark ? 'text-white' : 'text-slate-900'
          )}>
            <span className="hero-title-word" style={{ animationDelay: '0ms' }}>Unlock</span>{' '}
            <span className="hero-title-word" style={{ animationDelay: '100ms' }}>Your</span>{' '}
            <span className="hero-title-word" style={{ animationDelay: '200ms' }}>True</span>{' '}
            <span className="relative inline-block hero-title-word" style={{ animationDelay: '300ms' }}>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-purple via-brand-pink to-brand-orange">
                Potential
              </span>
              {/* Glowing text shadow for dark mode */}
              {isDark && (
                <span className="absolute inset-0 bg-clip-text text-transparent bg-gradient-to-r from-brand-purple via-brand-pink to-brand-orange blur-2xl opacity-50 select-none" aria-hidden>
                  Potential
                </span>
              )}
            </span>
            <br className="hidden md:block" />
            <span className="hero-title-word" style={{ animationDelay: '400ms' }}> Discover</span>{' '}
            <span className="hero-title-word" style={{ animationDelay: '500ms' }}>Greatness.</span>
          </h1>

          <p className={cn(
            'text-lg sm:text-xl leading-relaxed mb-10 max-w-[650px] mx-auto hero-title-word',
            isDark ? 'text-slate-400' : 'text-slate-600'
          )} style={{ animationDelay: '600ms' }}>
            Join Asia&apos;s most exclusive network. Instantly match with top-tier companies, secure your dream job, and elevate your career trajectory today.
          </p>

          <form
            onSubmit={handleSearch}
            className={cn(
              'relative flex flex-col md:flex-row items-center w-full max-w-[900px] mx-auto mb-10 transition-all duration-300',
              'rounded-[14px] border p-1 md:h-14 md:p-1.5',
              isDark
                ? 'bg-dark-card border-brand-purple/20 shadow-2xl shadow-black/40 focus-within:border-brand-purple/50 hover:shadow-brand-purple/5 hover:border-brand-purple/30'
                : 'bg-white border-gray-200 shadow-xl shadow-gray-200/50 focus-within:border-brand-purple/30 hover:shadow-2xl hover:shadow-gray-300/40'
            )}
            style={{ animationDelay: '700ms' }}
          >
            {/* Job Input (60%) */}
            <div className="flex-[6] w-full flex items-center gap-3 px-4 h-11 md:h-full">
              <Search className={cn('w-4 h-4 shrink-0', isDark ? 'text-gray-500' : 'text-gray-400')} />
              <input
                type="text"
                value={keyword}
                onChange={e => setKeyword(e.target.value)}
                placeholder="Job title, skills, or company"
                className={cn(
                  'flex-1 bg-transparent text-[14px] font-medium outline-none w-full',
                  isDark ? 'text-white placeholder-gray-600' : 'text-gray-900 placeholder-gray-400'
                )}
              />
              {keyword && (
                <button type="button" onClick={() => setKeyword('')} className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Vertical Divider (Desktop Only) */}
            <div className={cn('hidden md:block w-px h-6 shrink-0', isDark ? 'bg-white/5' : 'bg-gray-100')} />

            {/* Location Input (25%) */}
            <div className="flex-[2.5] w-full flex items-center gap-3 px-4 h-11 md:h-full">
              <MapPin className={cn('w-4 h-4 shrink-0', isDark ? 'text-gray-500' : 'text-gray-400')} />
              <input
                type="text"
                value={location}
                onChange={e => setLocation(e.target.value)}
                placeholder="City or remote"
                className={cn(
                  'flex-1 bg-transparent text-[14px] font-medium outline-none w-full',
                  isDark ? 'text-white placeholder-gray-600' : 'text-gray-900 placeholder-gray-400'
                )}
              />
              {location && (
                <button type="button" onClick={() => setLocation('')} className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
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

          {/* Popular Tags */}
          <div className="flex flex-wrap items-center justify-center gap-y-3 gap-x-2 hero-title-word" style={{ animationDelay: '800ms' }}>
            <span className={cn('text-xs font-semibold uppercase tracking-wider', isDark ? 'text-gray-500' : 'text-gray-400')}>Trending:</span>
            {popularSearches.map(term => (
              <button
                key={term}
                onClick={() => { setKeyword(term); navigate(`/jobs?q=${encodeURIComponent(term)}`); }}
                className={cn(
                  'text-[11px] font-semibold px-3.5 py-1.5 rounded-full border transition-all duration-300',
                  isDark
                    ? 'border-dark-border text-gray-400 hover:border-brand-pink hover:text-brand-pink hover:bg-brand-pink/10 hover:-translate-y-0.5'
                    : 'border-gray-200 text-gray-600 hover:border-brand-purple hover:text-brand-purple hover:bg-purple-50 hover:-translate-y-0.5'
                )}
              >
                {term}
              </button>
            ))}
          </div>

          {/* ─── V2.0 Social Proof & Stats ─── */}
          <div className="mt-20 w-full max-w-[1000px] mx-auto hero-title-word" style={{ animationDelay: '900ms' }}>
            <div className={cn(
              'grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 p-4 md:p-6 rounded-[2rem] md:rounded-[3rem] backdrop-blur-md',
              isDark ? 'bg-dark-card/30 border border-white/5' : 'bg-white/40 border border-white shadow-xl shadow-slate-200/50'
            )}>
              {/* Stat 1 */}
              <div className="stat-card-v2 flex flex-col items-center justify-center p-4 rounded-2xl">
                <div className="flex -space-x-3 mb-3" style={{ '--border-color': isDark ? '#1a1825' : '#ffffff' }}>
                  {[1, 2, 3, 4].map((i) => (
                    <img key={i} src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" className="avatar-stack-item w-10 h-10 rounded-full object-cover" />
                  ))}
                  <div className="avatar-stack-item w-10 h-10 rounded-full bg-brand-purple flex items-center justify-center text-white text-[10px] font-bold z-10">
                    +500K
                  </div>
                </div>
                <p className={cn('text-[11px] font-bold uppercase tracking-wider', isDark ? 'text-gray-400' : 'text-gray-500')}>Global Talent</p>
              </div>

              {/* Stat 2 */}
              <div className="stat-card-v2 flex flex-col items-center justify-center p-4 rounded-2xl border-l md:border-l-0 border-t md:border-t-0" style={{ borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}>
                <div className={cn('w-10 h-10 rounded-2xl flex items-center justify-center mb-3', isDark ? 'bg-brand-pink/10 text-brand-pink' : 'bg-pink-50 text-brand-pink')}>
                  <Briefcase className="w-5 h-5" />
                </div>
                <h4 className={cn('text-2xl font-black font-heading mb-1', isDark ? 'text-white' : 'text-slate-900')}>12,400+</h4>
                <p className={cn('text-[11px] font-bold uppercase tracking-wider', isDark ? 'text-gray-400' : 'text-gray-500')}>Live Jobs</p>
              </div>

              {/* Stat 3 */}
              <div className="stat-card-v2 flex flex-col items-center justify-center p-4 rounded-2xl border-t md:border-l border-t-white/5" style={{ borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}>
                <div className={cn('w-10 h-10 rounded-2xl flex items-center justify-center mb-3', isDark ? 'bg-brand-orange/10 text-brand-orange' : 'bg-orange-50 text-orange-500')}>
                  <TrendingUp className="w-5 h-5" />
                </div>
                <h4 className={cn('text-2xl font-black font-heading mb-1', isDark ? 'text-white' : 'text-slate-900')}>98%</h4>
                <p className={cn('text-[11px] font-bold uppercase tracking-wider', isDark ? 'text-gray-400' : 'text-gray-500')}>Success Rate</p>
              </div>

              {/* Stat 4 */}
              <div className="stat-card-v2 flex flex-col items-center justify-center p-4 rounded-2xl border-l border-t border-white/5 md:border-t-0" style={{ borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}>
                <div className={cn('w-10 h-10 rounded-2xl flex items-center justify-center mb-3', isDark ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-50 text-emerald-600')}>
                  <Star className="w-5 h-5" />
                </div>
                <h4 className={cn('text-2xl font-black font-heading mb-1', isDark ? 'text-white' : 'text-slate-900')}>4.9/5</h4>
                <p className={cn('text-[11px] font-bold uppercase tracking-wider', isDark ? 'text-gray-400' : 'text-gray-500')}>User Rating</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HeroSection;
