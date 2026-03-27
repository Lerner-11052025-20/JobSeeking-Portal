import { useState, useEffect } from 'react';
import MainLayout from '../layouts/MainLayout';
import HeroSection from '../components/home/HeroSection';
import CategoriesSection from '../components/home/CategoriesSection';
import TrendingJobs from '../components/home/TrendingJobs';
import CTASection from '../components/home/CTASection';
import StatsSection from '../components/home/StatsSection';
import FeaturedCompanies from '../components/home/FeaturedCompanies';
import HowItWorks from '../components/home/HowItWorks';
import Testimonials from '../components/home/Testimonials';
import { PageSkeleton } from '../components/ui/Skeleton';
import { useTheme } from '../context/ThemeContext';
import { cn } from '../utils/cn';

const HomePage = () => {
  const [loading, setLoading] = useState(true);
  const { isDark } = useTheme();

  useEffect(() => {
    // Simulate initial page resources loading
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <PageSkeleton />;

  const sections = [
    { component: HeroSection, delay: '' },
    { component: CategoriesSection, delay: 'delay-200' },
    { component: HowItWorks, delay: 'delay-300' },
    { component: TrendingJobs, delay: 'delay-400' },
    { component: StatsSection, delay: 'delay-500' },
    { component: Testimonials, delay: 'delay-500' },
    { component: CTASection, delay: 'delay-500' },
  ];

  return (
    <MainLayout>
      <div className={cn('overflow-hidden', isDark ? 'bg-dark-bg' : 'bg-light-bg')}>
        {sections.map(({ component: Component, delay }, index) => (
          <div key={index} className={cn('animate-in', delay)}>
            <Component />
          </div>
        ))}
      </div>
    </MainLayout>
  );
};

export default HomePage;
