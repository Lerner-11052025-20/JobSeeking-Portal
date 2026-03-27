import { NavLink } from 'react-router-dom';
import { 
  BarChart2, Briefcase, FileText, User, 
  Settings, LogOut, LayoutDashboard, PlusCircle, Search
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { cn } from '../utils/cn';

const DashboardSidebar = () => {
  const { isDark } = useTheme();
  const { user, logout } = useAuth();

  const links = [
    { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
    { label: 'Profile Settings', icon: User, href: '/profile' },
  ];

  if (user?.role === 'employer') {
    links.push(
      { label: 'Post a Job', icon: PlusCircle, href: '/post-job' },
      { label: 'My Postings', icon: Briefcase, href: '/dashboard/jobs' }
    );
  } else {
    links.push(
      { label: 'My Applications', icon: FileText, href: '/dashboard/applications' },
      { label: 'Find Jobs', icon: Search, href: '/jobs' }
    );
  }

  return (
    <aside className={cn(
      'w-72 shrink-0 h-fit hidden lg:flex flex-col gap-4 sticky top-[80px] pb-10',
    )}>
       <div className={cn(
         'p-5 rounded-2xl border flex flex-col gap-1.5 shadow-sm',
         isDark ? 'bg-[#0D0C14] border-brand-purple/35 shadow-2xl' : 'bg-white border-brand-purple/10 shadow-gray-200/20'
       )}>
          <div className="px-4 py-3 mb-2">
             <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest opacity-60">Navigation</p>
          </div>

          {links.map(link => (
            <NavLink
              key={link.href}
              to={link.href}
              end={link.href === '/dashboard'}
            >
              {({ isActive }) => (
                <div className={cn(
                  'flex items-center gap-4 px-5 py-3.5 rounded-xl transition-all duration-200 group',
                  isActive
                    ? 'bg-brand-purple text-white shadow-md shadow-brand-purple/20'
                    : isDark ? 'text-gray-400 hover:text-white hover:bg-white/5' : 'text-gray-600 hover:text-brand-purple hover:bg-brand-purple/5'
                )}>
                   <link.icon className={cn('w-4 h-4', isActive ? 'text-white' : 'group-hover:text-brand-purple')} />
                   <span className="text-[11px] font-bold uppercase tracking-wider">{link.label}</span>
                </div>
              )}
            </NavLink>
          ))}

          <div className={cn('h-px my-4 mx-4', isDark ? 'bg-white/5' : 'bg-gray-100')} />

          <button
            onClick={logout}
            className={cn(
              'flex items-center gap-4 px-5 py-3.5 rounded-xl text-[11px] font-bold uppercase tracking-wider text-red-500 hover:bg-red-500/10 transition-all duration-200 group',
            )}
          >
             <LogOut className="w-4 h-4" />
             Sign Out
          </button>
       </div>
       
       {/* Sidebar AI Tool */}
       <div className={cn(
         'p-6 rounded-2xl border relative overflow-hidden group',
         isDark ? 'bg-dark-card border-brand-purple/20' : 'bg-white border-brand-purple/10 shadow-sm'
       )}>
          <h4 className={cn('text-sm font-bold mb-1', isDark ? 'text-white' : 'text-gray-900')}>Career Assistant</h4>
          <p className="text-[10px] font-bold text-gray-500 leading-relaxed mb-4">Optimize your presence with our AI tools.</p>
          <button className="w-full py-2.5 rounded-lg bg-brand-purple text-white text-[9px] font-bold uppercase tracking-wider hover:bg-brand-violet transition-all">Launch AI Helper</button>
       </div>
    </aside>
  );
};


export default DashboardSidebar;
