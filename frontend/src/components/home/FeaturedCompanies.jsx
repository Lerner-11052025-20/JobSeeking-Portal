import { useTheme } from '../../context/ThemeContext';
import { cn } from '../../utils/cn';

const companies = [
  'Google', 'Amazon', 'Microsoft', 'Netflix', 'Tesla', 'Zomato', 'Swiggy', 'Razorpay', 'CRED', 'Flipkart'
];

const FeaturedCompanies = () => {
  const { isDark } = useTheme();

  return (
    <section className={cn('py-12 border-y', isDark ? 'bg-dark-bg/30 border-dark-border' : 'bg-gray-50/50 border-light-border')}>
      <div className="container-custom">
        <p className={cn('text-xs font-bold uppercase tracking-widest text-center mb-8', isDark ? 'text-gray-500' : 'text-gray-400')}>
          Trusted by 10,000+ companies worldwide
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-8 grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all">
          {companies.map(c => (
            <span key={c} className={cn('text-lg font-black tracking-tighter transition-all hover:scale-110 hover:opacity-100 cursor-default', isDark ? 'text-white' : 'text-gray-400')}>
              {c}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCompanies;
