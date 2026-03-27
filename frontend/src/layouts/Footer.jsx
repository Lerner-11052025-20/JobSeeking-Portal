import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Twitter, Linkedin, Github, Instagram, Mail, MapPin, Phone, Send, Sparkles } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { cn } from '../utils/cn';

/* ─────────────── Version 2.1 Ultra — Premium Footer ─────────────── */

const footerLinks = {
  'Product': [
    { label: 'Browse Jobs', href: '/jobs' },
    { label: 'Remote Jobs', href: '#' },
    { label: 'Companies', href: '#' },
    { label: 'Salary Guide', href: '#' },
  ],
  'Resources': [
    { label: 'Career Blog', href: '#' },
    { label: 'Resume Tips', href: '#' },
    { label: 'Hiring Insights', href: '#' },
    { label: 'Career Advice', href: '#' },
  ],
  'Support': [
    { label: 'Help Center', href: '#' },
    { label: 'Contact Us', href: '#' },
    { label: 'Pricing', href: '#' },
    { label: 'Accessibility', href: '#' },
  ],
};

const socials = [
  { icon: Twitter, href: '#', label: 'Twitter', color: 'hover:text-[#1DA1F2]' },
  { icon: Linkedin, href: '#', label: 'LinkedIn', color: 'hover:text-[#0A66C2]' },
  { icon: Github, href: '#', label: 'GitHub', color: 'hover:text-white' },
  { icon: Instagram, href: '#', label: 'Instagram', color: 'hover:text-[#E4405F]' },
];

const Footer = () => {
  const { isDark } = useTheme();
  const [email, setEmail] = useState('');

  return (
    <footer className={cn(
      'relative pt-24 pb-12 overflow-hidden border-t',
      isDark ? 'bg-[#0B0A11] border-white/5' : 'bg-white border-gray-100'
    )}>
      {/* Premium Background Effects */}
      {isDark && (
        <>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-px bg-gradient-to-r from-transparent via-brand-purple/50 to-transparent opacity-30" />
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-brand-purple/5 blur-[120px] rounded-full pointer-events-none" />
        </>
      )}

      <div className="container-custom relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8 mb-20">
          
          {/* Brand & Newsletter Section */}
          <div className="lg:col-span-4 max-w-sm">
            <Link to="/" className="flex items-center gap-3 mb-8 group">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#8B5CF6] via-[#D946EF] to-[#EC4899] flex items-center justify-center shadow-lg shadow-brand-purple/20 transition-transform duration-500 group-hover:scale-110">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <span className={cn('text-2xl font-black tracking-tight font-heading', isDark ? 'text-white' : 'text-gray-900')}>
                Talent<span className="gradient-text-v2 text-transparent bg-clip-text bg-gradient-to-r from-[#8B5CF6] to-[#EC4899]">Bridge</span>
              </span>
            </Link>
            
            <p className={cn('text-[15px] leading-relaxed mb-10 font-medium', isDark ? 'text-gray-400' : 'text-gray-500')}>
              The next-generation career platform for world-class talent and high-growth companies.
            </p>

            {/* Micro-Subscription Form */}
            <div className="relative group">
              <h5 className={cn('text-[12px] font-black uppercase tracking-widest mb-4', isDark ? 'text-gray-500' : 'text-gray-400')}>
                Stay Updated
              </h5>
              <div className={cn(
                'flex items-center p-1 rounded-2xl border transition-all duration-300',
                isDark ? 'bg-white/5 border-white/5 focus-within:border-brand-purple/50' : 'bg-gray-50 border-gray-100 focus-within:border-brand-purple/30'
              )}>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="bg-transparent border-none focus:ring-0 text-sm px-4 w-full placeholder:text-gray-600"
                />
                <button className="p-3 rounded-xl bg-brand-purple text-white transition-all hover:scale-105 hover:shadow-glow-sm">
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Link Columns Grid */}
          <div className="lg:col-span-5 grid grid-cols-2 sm:grid-cols-3 gap-8">
            {Object.entries(footerLinks).map(([title, links]) => (
              <div key={title}>
                <h4 className={cn('text-[14px] font-black uppercase tracking-widest mb-8', isDark ? 'text-gray-100' : 'text-gray-900')}>
                  {title}
                </h4>
                <ul className="space-y-4">
                  {links.map(link => (
                    <li key={link.label}>
                      <Link
                        to={link.href}
                        className={cn(
                          'text-[15px] font-medium transition-all duration-300 relative group flex items-center w-fit',
                          isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-brand-purple'
                        )}
                      >
                        <span className="absolute -left-3 w-1 h-1 rounded-full bg-brand-purple opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-1" />
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Contact Details Cards */}
          <div className="lg:col-span-3">
             <h4 className={cn('text-[14px] font-black uppercase tracking-widest mb-8', isDark ? 'text-gray-100' : 'text-gray-900')}>
                Let&apos;s Connect
              </h4>
             <div className="space-y-3">
                {[
                  { icon: Mail, text: 'hello@talentbridge.in', label: 'Email' },
                  { icon: Phone, text: '+91 98765 43210', label: 'Phone' },
                  { icon: MapPin, text: 'Bangalore, India', label: 'Visit' },
                ].map(({ icon: Icon, text, label }) => (
                  <div key={text} className={cn(
                    'p-4 rounded-2xl border flex items-center gap-4 group cursor-pointer transition-all duration-300',
                    isDark ? 'bg-white/5 border-white/5 hover:bg-white/[0.08] hover:border-white/10' : 'bg-gray-50 border-transparent hover:bg-white hover:shadow-lg hover:shadow-black/5'
                  )}>
                    <div className={cn('p-2.5 rounded-xl transition-all duration-300', isDark ? 'bg-[#1A1A24]' : 'bg-white shadow-sm')}>
                      <Icon className="w-4 h-4 text-brand-purple" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-0.5">{label}</p>
                      <p className={cn('text-[13px] font-bold', isDark ? 'text-gray-300' : 'text-gray-700')}>{text}</p>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        </div>

        {/* Re-Engineered Bottom Bar */}
        <div className={cn(
          'pt-12 mt-12 border-t flex flex-col md:flex-row items-center justify-between gap-10',
          isDark ? 'border-white/5' : 'border-gray-100'
        )}>
          
          <div className="flex flex-col items-center md:items-start gap-3">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-brand-purple/10 border border-brand-purple/20">
               <Sparkles className="w-3.5 h-3.5 text-brand-purple" />
               <span className="text-[11px] font-black text-brand-purple uppercase tracking-tight">Active since 2025</span>
            </div>
            <p className={cn('text-[12px] font-bold', isDark ? 'text-gray-600' : 'text-gray-400')}>
              © 2025 TalentBridge Technologies. Built with precision for the elite. 
            </p>
          </div>

          <div className="flex items-center gap-8">
            <div className="flex items-center gap-4">
               {['Privacy', 'Terms', 'Security'].map(text => (
                 <a key={text} href="#" className={cn('text-[12px] font-black uppercase tracking-widest transition-colors', isDark ? 'text-gray-600 hover:text-white' : 'text-gray-400 hover:text-gray-900')}>
                    {text}
                 </a>
               ))}
            </div>
            
            <div className="h-8 w-px bg-gray-500/10" />

            <div className="flex items-center gap-4">
              {socials.map(({ icon: Icon, label, color }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className={cn(
                    'transition-all duration-300 transform hover:scale-125',
                    isDark ? 'text-gray-600' : 'text-gray-400',
                    color
                  )}
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
