import { useEffect, useRef, useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { cn } from '../../utils/cn';
import { Users, Briefcase, Building2, Globe } from 'lucide-react';

/* ─────────────── Version 2.0 Major — Stats Section ─────────────── */

const stats = [
  { label: 'Live Jobs', value: '450K+', icon: Briefcase, color: 'text-[#8B5CF6]', glow: 'shadow-[#8B5CF6]/30', border: 'group-hover:border-[#8B5CF6]/50' },
  { label: 'Companies', value: '120K+', icon: Building2, color: 'text-[#EC4899]', glow: 'shadow-[#EC4899]/30', border: 'group-hover:border-[#EC4899]/50' },
  { label: 'Candidates', value: '500K+', icon: Users, color: 'text-[#06B6D4]', glow: 'shadow-[#06B6D4]/30', border: 'group-hover:border-[#06B6D4]/50' },
  { label: 'Global Offices', value: '50+', icon: Globe, color: 'text-[#10B981]', glow: 'shadow-[#10B981]/30', border: 'group-hover:border-[#10B981]/50' },
];

const StatsSection = () => {
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
        .stat-reveal {
          opacity: 0;
          transform: translateY(30px) scale(0.95);
          transition: opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .stat-reveal.visible {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      `}</style>

      <section 
        ref={sectionRef} 
        className={cn('py-16 md:py-24 relative', isDark ? 'bg-[#0B0A11]' : 'bg-white')}
      >
        <div className="container-custom relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {stats.map((stat, i) => (
              <div 
                key={stat.label} 
                className={cn('stat-reveal h-full', isVisible ? 'visible' : '')}
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <div className={cn(
                  'group flex flex-col items-center justify-center text-center p-8 rounded-[2rem] border transition-all duration-500 cursor-default h-full',
                  isDark 
                    ? `bg-[#12131A] border-white/5 hover:-translate-y-2 hover:bg-[#161722] hover:shadow-[0_15px_40px_-15px_rgba(255,255,255,0.05)] ${stat.border}`
                    : `bg-white border-transparent hover:border-transparent hover:shadow-[0_15px_40px_-10px_rgba(0,0,0,0.05)] hover:-translate-y-2`
                )}>
                  {/* Icon Container */}
                  <div className="relative mb-6">
                    <div className={cn(
                      'w-[72px] h-[72px] rounded-2xl flex items-center justify-center transition-transform duration-500 group-hover:scale-110 relative overflow-hidden shadow-lg',
                      stat.glow,
                      isDark ? 'bg-white/5' : 'bg-gray-50'
                    )}>
                      <div className={cn('absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity duration-500', stat.color.replace('text-', 'bg-'))} />
                      <stat.icon className={cn('w-8 h-8 relative z-10', stat.color)} />
                    </div>
                  </div>
                  
                  {/* Numbers */}
                  <h3 className={cn(
                    'text-4xl md:text-5xl font-black mb-2 tracking-tighter transition-colors duration-300', 
                    isDark ? 'text-white group-hover:text-gray-100' : 'text-gray-900 group-hover:text-black'
                  )}>
                    {stat.value}
                  </h3>
                  
                  {/* Label */}
                  <p className={cn('text-[15px] font-medium tracking-wide', isDark ? 'text-gray-500' : 'text-gray-500')}>
                    {stat.label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default StatsSection;
