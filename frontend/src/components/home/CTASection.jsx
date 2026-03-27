import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../utils/cn';

/* ─────────────── Version 2.0 Major — CTA Section ─────────────── */

const CTASection = () => {
  const { isDark } = useTheme();
  const { user } = useAuth();
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "0px" }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <style>{`
        .cta-reveal {
          opacity: 0;
          transform: translateY(30px) scale(0.98);
          transition: opacity 1s cubic-bezier(0.16, 1, 0.3, 1), transform 1s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .cta-reveal.visible {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      `}</style>

      <section 
        ref={sectionRef} 
        className={cn('py-20 md:py-28 relative overflow-hidden', isDark ? 'bg-dark-bg' : 'bg-white')}
      >
        <div className="container-custom relative z-10">
          <div className={cn(
            'cta-reveal relative overflow-hidden rounded-[3rem] p-12 md:p-20 text-center border transition-all duration-700',
            isVisible ? 'visible' : '',
            isDark
              ? 'bg-[#12131A] border-white/5 shadow-[0_30px_100px_-20px_rgba(139,92,246,0.1)]'
              : 'bg-gradient-to-br from-[#8B5CF6] via-[#D946EF] to-[#EC4899] border-transparent shadow-2xl shadow-brand-purple/25'
          )}>
            
            {/* Background Orbs & Effects */}
            {isDark && (
              <>
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-brand-purple/10 to-transparent pointer-events-none" />
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-brand-purple/20 blur-[120px] rounded-full animate-pulse pointer-events-none" />
                <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-brand-pink/15 blur-[120px] rounded-full animate-pulse pointer-events-none" style={{ animationDelay: '1s' }} />
              </>
            )}

            {!isDark && (
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2" />
            )}

            <div className="relative z-10">
              <div className={cn(
                'inline-flex items-center gap-2 px-5 py-2 rounded-full text-[13px] font-black tracking-widest uppercase mb-10 transition-all duration-500',
                isDark
                  ? 'bg-brand-purple/10 border border-brand-purple/20 text-brand-purple'
                  : 'bg-white/20 text-white backdrop-blur-md border border-white/30'
              )}>
                <Sparkles className="w-4 h-4 animate-bounce" />
                Ready to transform your career?
              </div>

              <h2 className={cn(
                'text-4xl md:text-6xl font-black font-heading mb-8 tracking-tighter leading-[1.1]',
                isDark ? 'text-white' : 'text-white drop-shadow-lg'
              )}>
                {user?.role === 'employer'
                  ? 'Build Your Dream Team'
                  : 'Land Your Dream Job'}
              </h2>
              
              <p className={cn(
                'text-lg md:text-xl mb-12 max-w-2xl mx-auto leading-relaxed font-medium',
                isDark ? 'text-gray-400' : 'text-white/90'
              )}>
                {user?.role === 'employer'
                  ? 'Access the world\'s most talented network of professionals. Hire the top 1% instantly.'
                  : 'Join over 500K elite professionals who have secured roles at world-class companies through TalentBridge.'}
              </p>

              <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
                {user ? (
                  <Link to={user.role === 'employer' ? '/post-job' : '/jobs'} className="w-full sm:w-auto">
                    <button className={cn(
                      'group relative inline-flex items-center justify-center gap-3 w-full sm:w-auto px-10 py-5 rounded-2xl font-black text-[17px] transition-all duration-300 transform',
                      isDark
                        ? 'bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] text-white hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] hover:-translate-y-1 active:scale-95'
                        : 'bg-white text-gray-900 hover:bg-gray-50 hover:shadow-xl hover:-translate-y-1 active:scale-95 shadow-lg'
                    )}>
                      {user.role === 'employer' ? 'Post a Vacancy' : 'Explore Roles'} 
                      <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                    </button>
                  </Link>
                ) : (
                  <>
                    <Link to="/register" className="w-full sm:w-auto">
                      <button className={cn(
                        'group relative inline-flex items-center justify-center gap-3 w-full sm:w-auto px-10 py-5 rounded-2xl font-black text-[17px] transition-all duration-300 transform',
                        isDark
                          ? 'bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] text-white hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] hover:-translate-y-1 active:scale-95'
                          : 'bg-white text-gray-900 hover:bg-gray-50 hover:shadow-xl hover:-translate-y-1 active:scale-95 shadow-lg'
                      )}>
                        Join TalentBridge <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                      </button>
                    </Link>
                    <Link to="/jobs" className="w-full sm:w-auto">
                      <button className={cn(
                        'inline-flex items-center justify-center px-10 py-5 rounded-2xl font-black text-[17px] border-2 transition-all duration-300 transform hover:-translate-y-1 active:scale-95',
                        isDark
                          ? 'border-white/10 text-white hover:bg-white/5 hover:border-white/20'
                          : 'border-white/40 text-white hover:bg-white/10 hover:border-white/60'
                      )}>
                        Browse Opportunities
                      </button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default CTASection;
