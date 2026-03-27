import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Code2, BarChart2, Palette, DollarSign, Megaphone, Users,
  Settings, TrendingUp, HeartPulse, GraduationCap, ChevronRight
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { API } from '../../context/AuthContext';
import { cn } from '../../utils/cn';

/* ─────────────── Version 2.0 Major — Categories Section ─────────────── */

const categoriesData = [
  { label: 'IT', dbLabel: 'IT', icon: Code2, color: 'text-[#8B5CF6]', bg: 'bg-[#8B5CF6]/10', border: 'border-[#8B5CF6]/20', glow: 'hover:border-[#8B5CF6]/50 hover:shadow-[0_0_30px_rgba(139,92,246,0.15)]' },
  { label: 'Analytics', dbLabel: 'Engineering', icon: BarChart2, color: 'text-[#06B6D4]', bg: 'bg-[#06B6D4]/10', border: 'border-[#06B6D4]/20', glow: 'hover:border-[#06B6D4]/50 hover:shadow-[0_0_30px_rgba(6,182,212,0.15)]' },
  { label: 'Design', dbLabel: 'Design', icon: Palette, color: 'text-[#EC4899]', bg: 'bg-[#EC4899]/10', border: 'border-[#EC4899]/20', glow: 'hover:border-[#EC4899]/50 hover:shadow-[0_0_30px_rgba(236,72,153,0.15)]' },
  { label: 'Finance', dbLabel: 'Finance', icon: DollarSign, color: 'text-[#10B981]', bg: 'bg-[#10B981]/10', border: 'border-[#10B981]/20', glow: 'hover:border-[#10B981]/50 hover:shadow-[0_0_30px_rgba(16,185,129,0.15)]' },
  { label: 'Marketing', dbLabel: 'Marketing', icon: Megaphone, color: 'text-[#F97316]', bg: 'bg-[#F97316]/10', border: 'border-[#F97316]/20', glow: 'hover:border-[#F97316]/50 hover:shadow-[0_0_30px_rgba(249,115,22,0.15)]' },
  { label: 'Human Resources', dbLabel: 'HR', icon: Users, color: 'text-[#F43F5E]', bg: 'bg-[#F43F5E]/10', border: 'border-[#F43F5E]/20', glow: 'hover:border-[#F43F5E]/50 hover:shadow-[0_0_30_rgba(244,63,94,0.15)]' },
  { label: 'Operations', dbLabel: 'Operations', icon: Settings, color: 'text-[#F59E0B]', bg: 'bg-[#F59E0B]/10', border: 'border-[#F59E0B]/20', glow: 'hover:border-[#F59E0B]/50 hover:shadow-[0_0_30px_rgba(245,158,11,0.15)]' },
  { label: 'Sales', dbLabel: 'Sales', icon: TrendingUp, color: 'text-[#3B82F6]', bg: 'bg-[#3B82F6]/10', border: 'border-[#3B82F6]/20', glow: 'hover:border-[#3B82F6]/50 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)]' },
  { label: 'Healthcare', dbLabel: 'Healthcare', icon: HeartPulse, color: 'text-[#E11D48]', bg: 'bg-[#E11D48]/10', border: 'border-[#E11D48]/20', glow: 'hover:border-[#E11D48]/50 hover:shadow-[0_0_30px_rgba(225,29,72,0.15)]' },
  { label: 'Education', dbLabel: 'Education', icon: GraduationCap, color: 'text-[#059669]', bg: 'bg-[#059669]/10', border: 'border-[#059669]/20', glow: 'hover:border-[#059669]/50 hover:shadow-[0_0_30px_rgba(5,150,105,0.15)]' },
];

const companies = [
  'Google', 'Amazon', 'Microsoft', 'Netflix', 'Tesla', 'Zomato', 'Swiggy', 'Razorpay', 'CRED', 'Flipkart'
];

const CategoriesSection = () => {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [stats, setStats] = useState({});

  useEffect(() => {
    API.get('/jobs/stats/categories')
      .then(res => {
        const statsMap = {};
        res.data.stats.forEach(s => {
          statsMap[s._id] = s.count;
        });
        setStats(statsMap);
      })
      .catch(() => {});
  }, []);

  // High-performance Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // Only animate once
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <style>{`
        .scroll-reveal {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .scroll-reveal.visible {
          opacity: 1;
          transform: translateY(0);
        }
        .gradient-text-v2 {
          background: linear-gradient(90deg, #8B5CF6, #EC4899, #F97316);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }
      `}</style>
      
      <section 
        ref={sectionRef} 
        className={cn('relative py-20 overflow-hidden', isDark ? 'bg-dark-bg' : 'bg-slate-50')}
      >
        {/* Decorative Grid Background */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>

        <div className="container-custom relative z-10">
          
          {/* Version 2.0 Unified Feature Header (Replaces separate FeaturedCompanies file) */}
          <div className={cn('scroll-reveal pb-16 border-b mb-16', isVisible ? 'visible' : '', isDark ? 'border-white/5' : 'border-gray-200')}>
            <p className={cn('text-[11px] font-black uppercase tracking-[0.2em] text-center mb-8', isDark ? 'text-gray-500' : 'text-gray-400')}>
              Trusted by 10,000+ companies worldwide
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-10 md:gap-x-14 gap-y-6">
              {companies.map((c, i) => (
                <span 
                  key={c} 
                  className={cn(
                    'text-lg md:text-xl font-black tracking-tight transition-all duration-300 transform cursor-default',
                    isDark ? 'text-gray-600 hover:text-white' : 'text-gray-400 hover:text-gray-800'
                  )}
                  style={{ transitionDelay: isVisible ? `${i * 50}ms` : '0ms' }}
                >
                  {c}
                </span>
              ))}
            </div>
          </div>

          {/* Categories Header */}
          <div className={cn('text-center mb-14 scroll-reveal', isVisible ? 'visible' : '')}>
            <p className={cn('text-xs font-bold tracking-widest uppercase mb-4', isDark ? 'text-[#8B5CF6]' : 'text-brand-purple')}>
              Explore Opportunities
            </p>
            <h2 className={cn('text-4xl md:text-5xl font-black font-heading tracking-tight', isDark ? 'text-white' : 'text-gray-900')}>
              Browse by <span className="gradient-text-v2">Category</span>
            </h2>
            <p className={cn('mt-4 text-[15px] max-w-xl mx-auto', isDark ? 'text-gray-400' : 'text-gray-500')}>
              Discover roles across every industry, from startups to Fortune 500 companies.
            </p>
          </div>

          {/* Categories V2.0 Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-5">
            {categoriesData.map((cat, idx) => {
              const count = stats[cat.dbLabel] || 0;
              return (
                <button
                  key={cat.label}
                  onClick={() => navigate(`/jobs?category=${encodeURIComponent(cat.dbLabel)}`)}
                  className={cn(
                    'group scroll-reveal flex flex-col items-center justify-center gap-4 p-6 rounded-2xl md:rounded-[1.5rem] border text-center transition-all duration-300 cursor-pointer w-full',
                    isDark
                      ? 'bg-[#0D0C14] border-brand-purple/35 shadow-2xl shadow-brand-purple/5 hover:border-brand-purple/70 hover:-translate-y-1.5'
                      : 'bg-white border-brand-purple/20 hover:border-brand-purple/50 hover:shadow-lg hover:shadow-brand-purple/5 hover:-translate-y-1.5 shadow-sm',
                    isVisible ? 'visible' : ''
                  )}
                  style={{ transitionDelay: isVisible ? `${(idx % 5) * 75}ms` : '0ms' }}
                >
                  <div className={cn(
                    'w-14 h-14 rounded-2xl flex items-center justify-center transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 relative',
                    cat.bg,
                    isDark ? `border ${cat.border}` : ''
                  )}>
                    <span className="absolute inset-0 rounded-2xl mix-blend-overlay opacity-50 bg-gradient-to-br from-white/20 to-transparent"></span>
                    <cat.icon className={cn('w-6 h-6 relative z-10', cat.color)} />
                  </div>
                  <div>
                    <h3 className={cn(
                      'text-[15px] font-bold tracking-tight mb-1 transition-colors',
                      isDark ? 'text-gray-200 group-hover:text-white' : 'text-gray-800 group-hover:text-gray-900'
                    )}>
                      {cat.label}
                    </h3>
                    <p className={cn('text-[13px] font-medium', isDark ? 'text-gray-500 group-hover:text-gray-400' : 'text-gray-500 group-hover:text-gray-600')}>
                      {count.toLocaleString()} job{count !== 1 ? 's' : ''}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* View All V2.0 Link */}
          <div className={cn('mt-12 text-center scroll-reveal', isVisible ? 'visible' : '')} style={{ transitionDelay: '500ms' }}>
            <button
              onClick={() => navigate('/jobs')}
              className={cn(
                'group inline-flex items-center gap-2 text-[14px] font-bold transition-all duration-300 hover:gap-3',
                isDark ? 'text-[#8B5CF6] hover:text-[#EC4899]' : 'text-brand-purple hover:text-brand-pink'
              )}
            >
              View all categories <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>

        </div>
      </section>
    </>
  );
};

export default CategoriesSection;
