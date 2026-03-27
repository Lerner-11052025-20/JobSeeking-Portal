import { useEffect, useRef, useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { cn } from '../../utils/cn';
import { Search, FileText, CheckCircle2, UserPlus, Send, Handshake } from 'lucide-react';

/* ─────────────── Version 2.0 Major — How It Works Section ─────────────── */

const seekerSteps = [
  { title: 'Create Profile', desc: 'Sign up and build your professional profile with your experience and skills.', icon: UserPlus, color: 'text-[#8B5CF6]', glow: 'hover:shadow-[0_0_30px_rgba(139,92,246,0.15)] hover:border-[#8B5CF6]/50' },
  { title: 'Search Jobs', desc: 'Easy-to-use search filters help you find the perfect role among thousands.', icon: Search, color: 'text-[#EC4899]', glow: 'hover:shadow-[0_0_30px_rgba(236,72,153,0.15)] hover:border-[#EC4899]/50' },
  { title: 'Get Hired', desc: 'Apply with one click and track your applications until you land your dream job.', icon: CheckCircle2, color: 'text-[#10B981]', glow: 'hover:shadow-[0_0_30px_rgba(16,185,129,0.15)] hover:border-[#10B981]/50' },
];

const employerSteps = [
  { title: 'Post a Vacancy', desc: 'Create a detailed job post and reach half a million active candidates instantly.', icon: Send, color: 'text-[#F97316]', glow: 'hover:shadow-[0_0_30px_rgba(249,115,22,0.15)] hover:border-[#F97316]/50' },
  { title: 'Review & Filter', desc: 'Advanced screening tools help you find the best match for your company culture.', icon: FileText, color: 'text-[#06B6D4]', glow: 'hover:shadow-[0_0_30px_rgba(6,182,212,0.15)] hover:border-[#06B6D4]/50' },
  { title: 'Scale Your Team', desc: 'Interview and onboard top talent faster than ever before.', icon: Handshake, color: 'text-[#F43F5E]', glow: 'hover:shadow-[0_0_30px_rgba(244,63,94,0.15)] hover:border-[#F43F5E]/50' },
];

const HowItWorks = () => {
  const { isDark } = useTheme();
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
      { threshold: 0.15, rootMargin: "0px" }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <style>{`
        .hiw-reveal {
          opacity: 0;
          transform: translateY(40px);
          transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .hiw-reveal.visible {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>
      
      <section 
        ref={sectionRef} 
        className={cn('py-28 relative overflow-hidden', isDark ? 'bg-[#0B0A11]' : 'bg-white')}
      >
        <div className="container-custom relative z-10">
          
          <div className={cn('text-center max-w-2xl mx-auto mb-20 hiw-reveal', isVisible ? 'visible' : '')}>
            <p className={cn('text-xs font-bold tracking-widest uppercase mb-4', isDark ? 'text-[#8B5CF6]' : 'text-brand-purple')}>
              Simple & Effective
            </p>
            <h2 className={cn('text-4xl md:text-[44px] leading-tight font-black font-heading mb-6', isDark ? 'text-white' : 'text-gray-900')}>
              How <span className="gradient-text-v2 text-transparent bg-clip-text bg-gradient-to-r from-[#8B5CF6] via-[#EC4899] to-[#F97316]">It Works</span>
            </h2>
            <p className={cn('text-[16px] leading-relaxed', isDark ? 'text-gray-400' : 'text-gray-500')}>
              Follow our intuitive 3-step process to effortlessly reach your career goals or build your dream team with top-tier talent.
            </p>
          </div>

          <div className="space-y-24">
            
            {/* For Job Seekers V2 */}
            <div>
              <div className={cn('flex items-center gap-4 mb-12 hiw-reveal', isVisible ? 'visible' : '')} style={{ transitionDelay: '100ms' }}>
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#8B5CF6] to-[#6D28D9] flex items-center justify-center shadow-lg shadow-[#8B5CF6]/30">
                  <UserPlus className="w-6 h-6 text-white" />
                </div>
                <h3 className={cn('text-2xl font-black tracking-tight', isDark ? 'text-white' : 'text-gray-900')}>
                  For Job Seekers
                </h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 relative">
                {/* Connecting Lines (Desktop only) */}
                <div className="hidden md:block absolute top-1/2 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#8B5CF6]/20 to-transparent -translate-y-1/2 z-0" />
                
                {seekerSteps.map((step, i) => (
                  <div 
                    key={step.title} 
                    className={cn('relative z-10 hiw-reveal', isVisible ? 'visible' : '')}
                    style={{ transitionDelay: `${200 + (i * 100)}ms` }}
                  >
                    <div className={cn(
                      'group flex flex-col p-8 rounded-[2rem] border h-full transition-all duration-500 cursor-default',
                      isDark ? 'bg-[#0D0C14] border-brand-purple/35 shadow-2xl shadow-brand-purple/5 hover:border-brand-purple/70 hover:-translate-y-2' : 'bg-white border-brand-purple/20 hover:border-brand-purple/50 hover:shadow-lg hover:shadow-brand-purple/5 hover:-translate-y-2 shadow-sm'
                    )}>
                      <div className="mb-8 relative">
                        <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center relative overflow-hidden group-hover:scale-110 transition-transform duration-500">
                          <div className={cn('absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity', step.color.replace('text-', 'bg-'))} />
                          <step.icon className={cn('w-7 h-7 relative z-10', step.color)} />
                        </div>
                        <span className={cn('absolute -top-3 -right-3 text-[100px] font-black leading-none opacity-[0.03] pointer-events-none transition-opacity duration-300 group-hover:opacity-[0.06]', isDark ? 'text-white' : 'text-gray-900')}>
                          {i + 1}
                        </span>
                      </div>
                      <h4 className={cn('text-xl font-bold mb-3 tracking-tight', isDark ? 'text-white group-hover:text-gray-200' : 'text-gray-900')}>
                        {step.title}
                      </h4>
                      <p className={cn('text-[15px] leading-relaxed', isDark ? 'text-gray-400' : 'text-gray-500')}>
                        {step.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* For Employers V2 */}
            <div>
              <div className={cn('flex flex-row-reverse items-center justify-end md:justify-start md:flex-row gap-4 mb-12 hiw-reveal text-right md:text-left', isVisible ? 'visible' : '')} style={{ transitionDelay: '300ms' }}>
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#EC4899] to-[#BE185D] flex items-center justify-center shadow-lg shadow-[#EC4899]/30">
                  <Handshake className="w-6 h-6 text-white" />
                </div>
                <h3 className={cn('text-2xl font-black tracking-tight', isDark ? 'text-white' : 'text-gray-900')}>
                  For Employers
                </h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 relative">
                {/* Connecting Lines */}
                <div className="hidden md:block absolute top-1/2 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#EC4899]/20 to-transparent -translate-y-1/2 z-0" />
                
                {employerSteps.map((step, i) => (
                  <div 
                    key={step.title} 
                    className={cn('relative z-10 hiw-reveal', isVisible ? 'visible' : '')}
                    style={{ transitionDelay: `${400 + (i * 100)}ms` }}
                  >
                    <div className={cn(
                      'group flex flex-col p-8 rounded-[2rem] border h-full transition-all duration-500 cursor-default',
                      isDark ? 'bg-[#0D0C14] border-brand-purple/35 shadow-2xl shadow-brand-purple/5 hover:border-brand-purple/70 hover:-translate-y-2' : 'bg-white border-brand-purple/20 hover:border-brand-purple/50 hover:shadow-lg hover:shadow-brand-purple/5 hover:-translate-y-2 shadow-sm'
                    )}>
                      <div className="mb-8 relative flex justify-start">
                        <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center relative overflow-hidden group-hover:scale-110 transition-transform duration-500">
                          <div className={cn('absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity', step.color.replace('text-', 'bg-'))} />
                          <step.icon className={cn('w-7 h-7 relative z-10', step.color)} />
                        </div>
                        <span className={cn('absolute -top-3 -right-3 text-[100px] font-black leading-none opacity-[0.03] pointer-events-none transition-opacity duration-300 group-hover:opacity-[0.06]', isDark ? 'text-white' : 'text-gray-900')}>
                          {i + 1}
                        </span>
                      </div>
                      <h4 className={cn('text-xl font-bold mb-3 tracking-tight', isDark ? 'text-white group-hover:text-gray-200' : 'text-gray-900')}>
                        {step.title}
                      </h4>
                      <p className={cn('text-[15px] leading-relaxed', isDark ? 'text-gray-400' : 'text-gray-500')}>
                        {step.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  );
};

export default HowItWorks;
