import { Link } from 'react-router-dom';
import { Briefcase, ArrowLeft, Search } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { cn } from '../utils/cn';
import MainLayout from '../layouts/MainLayout';
import Button from '../components/ui/Button';

const NotFoundPage = () => {
  const { isDark } = useTheme();

  return (
    <MainLayout>
      <div className={cn(
        'min-h-screen flex items-center justify-center p-6 transition-colors duration-300',
        isDark ? 'bg-[#0F1117]' : 'bg-gray-50'
      )}>
        {/* Background decorative elements */}
        {isDark && (
          <>
            <div className="absolute top-20 left-10 w-64 h-64 bg-brand-purple/5 blur-[120px] rounded-full" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-brand-pink/5 blur-[150px] rounded-full" />
          </>
        )}

        <div className="max-w-xl w-full text-center relative z-10 scale-in">
          {/* Icon Box */}
          <div className="relative inline-block mb-10">
            <div className="w-20 h-20 rounded-2xl bg-gradient-brand flex items-center justify-center shadow-glow-lg animate-bounce-slow">
              <Briefcase className="w-10 h-10 text-white" />
            </div>
            <div className="absolute inset-0 bg-gradient-brand blur-2xl opacity-40 -z-10" />
          </div>

          {/* 404 Text */}
          <h1 className={cn(
            'text-8xl md:text-9xl font-black font-heading mb-4 tracking-tighter',
            isDark ? 'text-white' : 'text-gray-900'
          )}>
            <span className="gradient-text">404</span>
          </h1>

          <h2 className={cn(
            'text-2xl md:text-3xl font-bold mb-6',
            isDark ? 'text-gray-100' : 'text-gray-800'
          )}>
            Page Not Found
          </h2>

          <p className={cn(
            'text-base md:text-lg mb-10 max-w-md mx-auto leading-relaxed',
            isDark ? 'text-gray-400' : 'text-gray-500'
          )}>
            Oops! The page you&apos;re looking for doesn&apos;t exist or has been moved. 
            Don&apos;t let this stop your job search journey.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/">
              <Button variant="primary" className="rounded-2xl px-8 h-12 flex items-center gap-2 shadow-glow-sm">
                <ArrowLeft className="w-4 h-4" /> Back to Home
              </Button>
            </Link>
            <Link to="/jobs">
              <Button variant="secondary" className="rounded-2xl px-8 h-12 flex items-center gap-2 bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10">
                <Search className="w-4 h-4" /> Browse Jobs
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default NotFoundPage;
