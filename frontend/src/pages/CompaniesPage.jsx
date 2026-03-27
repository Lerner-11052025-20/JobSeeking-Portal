import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, MapPin, Search, ArrowRight,
  Briefcase, Users, Star, TrendingUp, ShieldCheck,
  ChevronRight, Globe, IndianRupee, Layers
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { API } from '../context/AuthContext';
import { cn } from '../utils/cn';
import MainLayout from '../layouts/MainLayout';
import { SkeletonBox } from '../components/ui/Skeleton';
import Badge from '../components/ui/Badge';
import toast from 'react-hot-toast';

const CompaniesPage = () => {
  const { isDark } = useTheme();
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSort, setActiveSort] = useState('trending');
  
  const containerRef = useRef(null);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await API.get('/auth/companies');
        setCompanies(res.data.companies || []);
      } catch (err) {
        toast.error('Failed to load companies');
      } finally {
        setLoading(false);
      }
    };
    fetchCompanies();
  }, []);

  const filteredCompanies = companies.filter(c => 
    (c.companyName || c.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.location || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <MainLayout>
      <style>{`
        .scroll-reveal { opacity: 0; transform: translateY(30px); transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1); }
        .scroll-reveal.visible { opacity: 1; transform: translateY(0); }
        .glass-card { 
          backdrop-filter: blur(12px); 
          background: rgba(255, 255, 255, 0.03); 
          border: 1px solid rgba(255, 255, 255, 0.05); 
        }
        .light .glass-card { 
          background: rgba(255, 255, 255, 0.8); 
          border: 1px solid rgba(0, 0, 0, 0.05); 
          box-shadow: 0 10px 40px rgba(0,0,0,0.04);
        }
        .hero-gradient {
          background: radial-gradient(circle at 70% 20%, rgba(139, 92, 246, 0.15), transparent 40%),
                      radial-gradient(circle at 10% 80%, rgba(236, 72, 153, 0.1), transparent 40%);
        }
      `}</style>

      <div className={cn('min-h-screen pt-20 pb-20 overflow-hidden', isDark ? 'bg-dark-bg' : 'bg-[#F9FAFF]')}>
        
        {/* Cinematic Hero Section */}
        <section className="relative py-24 hero-gradient">
           <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-brand-purple/5 blur-[120px] rounded-full animate-pulse-slow"></div>
              <div className="absolute bottom-1/4 left-1/4 w-[300px] h-[300px] bg-brand-pink/5 blur-[100px] rounded-full"></div>
           </div>

           <div className="container-custom relative z-10 text-center max-w-4xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-purple/10 border border-brand-purple/20 mb-8 animate-in">
                 <Star className="w-3.5 h-3.5 text-brand-purple fill-brand-purple" />
                 <span className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-violet">Premium Companies Ecosystem</span>
              </div>
              
              <h1 className={cn('text-5xl md:text-7xl font-black font-heading tracking-tight mb-8 leading-[1.1]', isDark ? 'text-white' : 'text-gray-900')}>
                Explore World-Class <br />
                <span className="gradient-text">Workplaces.</span>
              </h1>
              
              <p className={cn('text-lg md:text-xl font-medium max-w-2xl mx-auto mb-12 opacity-60 leading-relaxed', isDark ? 'text-gray-400' : 'text-gray-600')}>
                Discover companies that prioritize growth, culture, and innovation. Find where you belong today.
              </p>

              {/* High-End Search Interface */}
              <div className="max-w-3xl mx-auto">
                 <div className={cn(
                    'flex flex-col md:flex-row items-center p-2 rounded-[2.5rem] border transition-all duration-500 shadow-2xl',
                    isDark ? 'bg-white/5 border-brand-purple/20 focus-within:border-brand-purple/50' : 'bg-white border-brand-purple/20 shadow-gray-200/50 focus-within:border-brand-purple'
                 )}>
                    <div className="flex-1 flex items-center gap-4 px-6 w-full">
                       <Search className="w-5 h-5 text-brand-purple" />
                       <input 
                          type="text" 
                          placeholder="Search enterprise names or locations..." 
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className={cn('flex-1 bg-transparent text-sm h-14 md:h-16 outline-none font-bold', isDark ? 'text-white' : 'text-gray-900')}
                       />
                    </div>
                    <div className="hidden md:block w-px h-8 bg-gray-500/10 mx-2" />
                    <button className="w-full md:w-auto btn-primary rounded-[2rem] px-10 py-4 text-xs font-black uppercase tracking-widest shadow-glow">
                       Discover
                    </button>
                 </div>
              </div>

              {/* Sorting Pills */}
              <div className="flex flex-wrap items-center justify-center gap-3 mt-12 overflow-x-auto pb-4">
                 {['Trending', 'Most Jobs', 'Top Rated', 'Near Me'].map(sort => (
                    <button 
                      key={sort}
                      onClick={() => setActiveSort(sort.toLowerCase())}
                      className={cn(
                        'px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all whitespace-nowrap',
                        activeSort === sort.toLowerCase()
                          ? 'bg-brand-purple border-brand-purple text-white shadow-glow-sm'
                          : (isDark ? 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-white/10' : 'bg-white border-gray-100 text-gray-500 hover:border-brand-purple hover:text-brand-purple')
                      )}
                    >
                       {sort}
                    </button>
                 ))}
              </div>
           </div>
        </section>

        {/* Global Companies Feed */}
        <section className="container-custom py-20" ref={containerRef}>
          <div className="flex items-center justify-between mb-16 px-4">
             <div>
                <h2 className={cn('text-2xl font-black font-heading tracking-tight', isDark ? 'text-white' : 'text-gray-900')}>Verified Partners</h2>
                <div className="flex items-center gap-2 mt-1">
                   <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                   <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">{loading ? 'Scanning ecosystem...' : `${filteredCompanies.length} Active Ecosystems`}</p>
                </div>
             </div>
             <div className="hidden sm:flex items-center gap-4">
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Layout View</p>
                <div className="flex p-1 rounded-xl bg-gray-500/5 border border-white/5">
                   <div className="p-2 rounded-lg bg-brand-purple text-white"><Layers className="w-4 h-4" /></div>
                </div>
             </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
              {[...Array(6)].map((_, i) => <SkeletonBox key={i} className="h-96 rounded-[3.5rem]" isDark={isDark} />)}
            </div>
          ) : filteredCompanies.length === 0 ? (
            <div className={cn(
              'py-32 rounded-[4rem] border border-dashed text-center max-w-4xl mx-auto',
              isDark ? 'border-white/10 bg-white/2' : 'border-gray-200 bg-gray-50'
            )}>
              <div className="w-24 h-24 rounded-full bg-brand-purple/5 flex items-center justify-center text-brand-purple mx-auto mb-8">
                 <Building2 className="w-10 h-10" />
              </div>
              <h3 className={cn('text-3xl font-black font-heading mb-3', isDark ? 'text-white' : 'text-gray-900')}>Company Not Found</h3>
              <p className={cn('text-sm font-medium opacity-60 mb-8 max-w-sm mx-auto', isDark ? 'text-gray-400' : 'text-gray-600')}>No registered workspace matches your query. Try broadening your location or name tags.</p>
              <button onClick={() => setSearchTerm('')} className="btn-primary rounded-full px-12 py-4 text-[10px] font-black uppercase tracking-[0.2em]">Reset Search</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 px-4">
              {filteredCompanies.map((company, idx) => (
                <div key={company._id} className="scroll-reveal visible animate-in" style={{ animationDelay: `${idx * 100}ms` }}>
                   <CompanyLargeCard company={company} isDark={isDark} />
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </MainLayout>
  );
};

const CompanyLargeCard = ({ company, isDark }) => {
  return (
    <div className={cn(
      'group relative h-full flex flex-col p-8 rounded-[3.5rem] border transition-all duration-700 h-full',
      isDark 
        ? 'bg-[#0D0C14] border-brand-purple/35 hover:border-brand-purple/70 hover:shadow-[0_0_60px_-15px_rgba(139,92,246,0.3)]' 
        : 'bg-white border-brand-purple/20 hover:border-brand-purple/40 hover:shadow-2xl hover:shadow-brand-purple/10 shadow-sm shadow-gray-100'
    )}>
      
      {/* Decorative Slab Background */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-brand-purple/10 to-transparent blur-3xl rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700"></div>

      <div className="flex items-start justify-between mb-10">
        <div className="relative">
          <div className="w-20 h-20 rounded-[1.75rem] bg-gradient-to-br from-brand-purple to-brand-pink p-[2px] shadow-xl group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-500">
             <div className={cn('w-full h-full rounded-[1.65rem] flex items-center justify-center font-black text-3xl text-white', isDark ? 'bg-[#13131A]' : 'bg-white/20')}>
                {company.companyLogo ? (
                  <img src={company.companyLogo} alt={company.companyName} className="w-full h-full object-cover rounded-[1.6rem]" />
                ) : (
                  (company.companyName || company.name)?.[0]?.toUpperCase()
                )}
             </div>
          </div>
          <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-emerald-500 border-4 border-white dark:border-[#13131A] flex items-center justify-center shadow-lg">
             <ShieldCheck className="w-4 h-4 text-white" />
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
           <Badge color="purple" className="text-[8px] font-black uppercase tracking-widest px-3 py-1">Top Workspace</Badge>
           <div className="flex items-center gap-1 text-accent-yellow">
              <Star className="w-3 h-3 fill-accent-yellow" />
              <span className="text-[10px] font-black tracking-tighter">4.8</span>
           </div>
        </div>
      </div>

      <div className="mb-8">
        <h3 className={cn('text-2xl font-black font-heading leading-tight mb-3 group-hover:text-brand-violet transition-colors', isDark ? 'text-white' : 'text-gray-900')}>
          {company.companyName || company.name}
        </h3>
        <div className="flex flex-wrap items-center gap-4">
           <div className="flex items-center gap-1.5 opacity-60">
              <MapPin className="w-3.5 h-3.5 text-brand-purple" />
              <span className="text-[11px] font-bold tracking-tight">{company.location || 'Distributed'}</span>
           </div>
           <div className="flex items-center gap-1.5 opacity-60">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-[11px] font-bold tracking-tight">Hiring Fast</span>
           </div>
        </div>
      </div>

      <p className={cn('text-[13px] font-medium leading-relaxed mb-10 line-clamp-3 opacity-60', isDark ? 'text-gray-300' : 'text-gray-600')}>
        {company.companyDescription || 'Leading the industry with high-impact innovation and an exceptional culture of excellence.'}
      </p>

      <div className={cn('mt-auto pt-8 border-t flex items-center justify-between', isDark ? 'border-white/5' : 'border-gray-100')}>
         <div className="flex flex-col">
            <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1 items-center flex gap-1"><Users className="w-3 h-3" /> Talent Hub</span>
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className={cn(
                  'w-8 h-8 rounded-full border-2 flex items-center justify-center text-[10px] font-black transition-transform hover:scale-110 hover:z-10',
                  isDark ? 'bg-white/10 border-[#13131A] text-gray-400' : 'bg-gray-100 border-white text-gray-500'
                )}>
                  {i}
                </div>
              ))}
              <div className={cn(
                'w-8 h-8 rounded-full border-2 flex items-center justify-center text-[8px] font-black bg-brand-purple text-white z-10',
                isDark ? 'border-[#13131A]' : 'border-white'
              )}>+82</div>
            </div>
         </div>
         
         <Link 
           to={`/jobs?q=${company.companyName || company.name}`}
           className="group/btn flex items-center gap-2"
         >
            <div className={cn(
              'h-12 w-12 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover/btn:w-32 group-hover/btn:bg-brand-purple group-hover/btn:text-white',
              isDark ? 'bg-white/5 text-brand-violet' : 'bg-brand-purple/5 text-brand-purple border border-brand-purple/10'
            )}>
               <span className="hidden group-hover/btn:block text-[10px] font-black uppercase tracking-widest pl-2">Jobs</span>
               <ChevronRight className="w-5 h-5 shrink-0" />
            </div>
         </Link>
      </div>

      {/* Stats Footnote */}
      <div className="mt-8 flex items-center justify-between gap-2 px-2">
         <div className="flex items-center gap-1.5 opacity-40 group-hover:opacity-100 transition-opacity">
            <Globe className="w-3 h-3" />
            <span className="text-[9px] font-black uppercase tracking-tighter">Global Org</span>
         </div>
         <div className="flex items-center gap-1.5 opacity-40 group-hover:opacity-100 transition-opacity">
            <IndianRupee className="w-3 h-3" />
            <span className="text-[9px] font-black uppercase tracking-tighter">High Growth</span>
         </div>
      </div>
    </div>
  );
};

export default CompaniesPage;
