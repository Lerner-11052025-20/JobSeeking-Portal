import { cn } from '../../utils/cn';
import { 
  CheckCircle2, Clock, Send, Eye, 
  MapPin, Briefcase, FileText, AlertCircle,
  XCircle, Award
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const ApplicationProgress = ({ application }) => {
  const { isDark } = useTheme();
  const status = application.status || 'pending';

  const steps = [
    { 
      id: 'applied', 
      title: 'Application Sent', 
      desc: 'Applied on ' + new Date(application.createdAt).toLocaleDateString(),
      icon: Send,
      done: true 
    },
    { 
      id: 'pending', 
      title: 'Under Review', 
      desc: 'Employer is reviewing your profile',
      icon: Eye,
      done: status !== 'pending' && status !== 'rejected',
      active: status === 'pending'
    },
    { 
      id: 'shortlisted', 
      title: 'Shortlisted', 
      desc: application.employerNotes || 'Congratulations! Next rounds coming up',
      icon: Award,
      done: status === 'shortlisted' || status === 'hired',
      active: status === 'shortlisted',
      error: status === 'rejected'
    },
    { 
      id: 'hired', 
      title: 'Hired', 
      desc: 'Final offer accepted',
      icon: CheckCircle2,
      done: status === 'hired',
      active: status === 'hired'
    }
  ];

  return (
    <div className={cn('p-8 rounded-3xl border', isDark ? 'bg-dark-card border-dark-border shadow-glow-sm' : 'bg-white border-light-border shadow-sm')}>
      <div className="flex items-center justify-between mb-10">
        <h3 className={cn('text-xl font-bold font-heading', isDark ? 'text-white' : 'text-gray-900')}>
          Application <span className="gradient-text">Progress</span>
        </h3>
        <Badge color={status === 'rejected' ? 'red' : 'purple'}>
          {status.toUpperCase()}
        </Badge>
      </div>

      <div className="relative space-y-8">
        {/* Connection Line */}
        <div className={cn('absolute left-[19px] top-4 bottom-4 w-0.5', isDark ? 'bg-white/10' : 'bg-gray-100')} />

        {steps.map((step, i) => {
          const isLast = i === steps.length - 1;
          const Icon = step.icon;
          const isDone = step.done;
          const isActive = step.active;
          const isError = step.error && status === 'rejected' && step.id === 'shortlisted';

          return (
            <div key={step.id} className="relative flex items-start gap-5 group">
              {/* Icon Container */}
              <div className={cn(
                'relative z-10 w-10 h-10 rounded-full flex items-center justify-center border-4 transition-all duration-500',
                isDone 
                  ? 'bg-brand-purple border-brand-purple/20 text-white' 
                  : isError 
                    ? 'bg-red-500 border-red-500/20 text-white'
                    : isActive
                      ? 'bg-white/5 border-brand-purple text-brand-violet animate-pulse shadow-glow-sm'
                      : isDark ? 'bg-dark-bg border-dark-border text-gray-600' : 'bg-gray-50 border-gray-100 text-gray-400'
              )}>
                {isError ? <XCircle className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
              </div>

              {/* Text */}
              <div className="flex-1 pt-1">
                <p className={cn(
                  'font-bold text-sm transition-colors',
                  isDone || isActive ? (isDark ? 'text-white' : 'text-gray-900') : 'text-gray-500'
                )}>
                  {step.title}
                </p>
                <p className={cn(
                  'text-xs mt-1 transition-all',
                  isActive ? 'text-brand-violet font-medium' : 'text-gray-500'
                )}>
                  {isError ? 'Applications was not moved forward' : step.desc}
                </p>
                
                {isActive && (
                  <div className="mt-3 flex items-center gap-2">
                    <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-brand-violet animate-bounce" />
                      <div className="w-1.5 h-1.5 rounded-full bg-brand-violet animate-bounce delay-100" />
                      <div className="w-1.5 h-1.5 rounded-full bg-brand-violet animate-bounce delay-200" />
                    </div>
                    <span className="text-[10px] uppercase tracking-widest font-bold text-brand-violet">Real-time Tracking Active</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const Badge = ({ children, color }) => {
  const colors = {
    purple: 'bg-brand-purple/10 text-brand-violet border-brand-purple/20',
    red: 'bg-red-500/10 text-red-500 border-red-500/20',
    green: 'bg-green-500/10 text-green-500 border-green-500/20',
  };
  return (
    <span className={cn('px-3 py-1 rounded-full text-[10px] font-black tracking-widest border', colors[color] || colors.purple)}>
      {children}
    </span>
  );
};

export default ApplicationProgress;
