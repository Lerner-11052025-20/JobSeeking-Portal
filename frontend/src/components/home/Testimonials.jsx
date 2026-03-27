import { useEffect, useRef, useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { cn } from '../../utils/cn';
import { Quote, Star } from 'lucide-react';

/* ─────────────── Version 2.0 Major — Testimonials Section ─────────────── */

const testimonials = [
  {
    name: 'Anjali Sharma',
    role: 'Product Designer at Google',
    text: 'TalentBridge helped me find a role that matches my design values and career goals seamlessly. The interface is simply world-class.',
    avatar: 'AS',
    glow: 'group-hover:shadow-[0_0_40px_rgba(139,92,246,0.15)]',
  },
  {
    name: 'Vikram Mehta',
    role: 'Senior Backend Engineer',
    text: 'Working at top companies once felt like a dream. After using TalentBridge, I have been reached out to by 5 unicorn startups.',
    avatar: 'VM',
    glow: 'group-hover:shadow-[0_0_40px_rgba(236,72,153,0.15)]',
  },
  {
    name: 'Rajesh Iyer',
    role: 'HR Manager at Zomato',
    text: 'As an employer, finding quality talent is our biggest challenge. This platform transformed our hiring pipeline in weeks.',
    avatar: 'RI',
    glow: 'group-hover:shadow-[0_0_40px_rgba(16,185,129,0.15)]',
  },
];

const Testimonials = () => {
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
        .tm-reveal {
          opacity: 0;
          transform: translateY(30px) scale(0.98);
          transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .tm-reveal.visible {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      `}</style>

      <section 
        ref={sectionRef} 
        className={cn('py-28 relative overflow-hidden', isDark ? 'bg-dark-bg' : 'bg-slate-50/30')}
      >
        <div className="container-custom relative z-10">
          <div className={cn('text-center max-w-2xl mx-auto mb-20 tm-reveal', isVisible ? 'visible' : '')}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-purple/10 border border-brand-purple/20 text-brand-purple text-xs font-bold uppercase tracking-wider mb-6">
              <Star className="w-3.5 h-3.5 fill-current" />
              Trusted by Experts
            </div>
            <h2 className={cn('text-4xl md:text-5xl font-black font-heading mb-6 tracking-tight', isDark ? 'text-white' : 'text-gray-900')}>
              Success <span className="gradient-text-v2 text-transparent bg-clip-text bg-gradient-to-r from-[#8B5CF6] via-[#EC4899] to-[#F97316]">Stories</span>
            </h2>
            <p className={cn('text-lg leading-relaxed', isDark ? 'text-gray-400' : 'text-gray-500')}>
              Hear from our community of professionals who found their perfect match and accelerated their career growth.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, idx) => (
              <div 
                key={t.name} 
                className={cn('tm-reveal h-full', isVisible ? 'visible' : '')}
                style={{ transitionDelay: `${idx * 150}ms` }}
              >
                <div className={cn(
                  'group p-8 md:p-10 rounded-[2.5rem] border relative transition-all duration-500 flex flex-col h-full',
                  isDark 
                    ? 'bg-[#0D0C14] border-brand-purple/35 hover:border-brand-purple/70 shadow-2xl shadow-brand-purple/10 hover:-translate-y-2' 
                    : 'bg-white border-brand-purple/20 hover:border-brand-purple/50 hover:shadow-2xl hover:shadow-brand-purple/5 hover:-translate-y-2 shadow-md'
                )}>
                  <Quote className={cn('absolute top-10 right-10 w-12 h-12 opacity-5 transition-opacity duration-300 group-hover:opacity-10', isDark ? 'text-white' : 'text-gray-900')} />
                  
                  <div className="flex gap-1 mb-8">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#F59E0B] text-[#F59E0B] drop-shadow-[0_0_8px_rgba(245,158,11,0.3)]" />
                    ))}
                  </div>

                  <p className={cn('text-[16px] leading-relaxed mb-10 transition-colors duration-300', isDark ? 'text-gray-300 group-hover:text-white' : 'text-gray-600')}>
                    &quot;{t.text}&quot;
                  </p>

                  <div className="mt-auto flex items-center gap-4">
                    <div className={cn(
                      'w-14 h-14 rounded-2xl flex items-center justify-center text-white font-black text-lg shadow-lg relative overflow-hidden transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3',
                      'bg-gradient-to-br from-[#8B5CF6] via-[#D946EF] to-[#EC4899]'
                    )}>
                      <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <span className="relative z-10">{t.avatar}</span>
                    </div>
                    <div>
                      <h4 className={cn('text-[15px] font-black tracking-tight mb-0.5', isDark ? 'text-white' : 'text-gray-900')}>{t.name}</h4>
                      <p className={cn('text-[13px] font-medium tracking-wide', isDark ? 'text-gray-500' : 'text-gray-400')}>{t.role}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Testimonials;
