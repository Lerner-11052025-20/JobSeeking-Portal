/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'Poppins', 'system-ui', 'sans-serif'],
        heading: ['Poppins', 'Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Dark theme backgrounds
        dark: {
          bg:     '#08070B',
          card:   '#0D0C14',
          border: 'rgba(124, 58, 237, 0.15)',
          hover:  '#12111A',
        },
        // Light theme backgrounds
        light: {
          bg:     '#F8FAFC',
          card:   '#FFFFFF',
          border: '#E2E8F0',
          hover:  '#F1F5F9',
        },
        // Brand palette
        brand: {
          purple: '#7C3AED',
          pink:   '#EC4899',
          orange: '#F97316',
          violet: '#8B5CF6',
          rose:   '#F43F5E',
        },
        // Accent
        accent: {
          cyan:   '#06B6D4',
          green:  '#10B981',
          yellow: '#F59E0B',
        },
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(135deg, #7C3AED 0%, #EC4899 50%, #F97316 100%)',
        'gradient-hero':  'linear-gradient(135deg, #0B0F1A 0%, #1a0533 50%, #0B0F1A 100%)',
        'gradient-card':  'linear-gradient(135deg, rgba(124,58,237,0.1) 0%, rgba(236,72,153,0.05) 100%)',
        'gradient-glow':  'radial-gradient(ellipse at center, rgba(124,58,237,0.3) 0%, transparent 70%)',
        'gradient-mesh':  'radial-gradient(at 40% 20%, hsla(280,100%,74%,0.15) 0px, transparent 50%), radial-gradient(at 80% 0%, hsla(189,100%,56%,0.1) 0px, transparent 50%), radial-gradient(at 0% 50%, hsla(355,100%,93%,0.05) 0px, transparent 50%)',
      },
      boxShadow: {
        'glow-sm':  '0 0 10px rgba(124,58,237,0.3)',
        'glow-md':  '0 0 20px rgba(124,58,237,0.4), 0 0 40px rgba(124,58,237,0.2)',
        'glow-lg':  '0 0 30px rgba(124,58,237,0.5), 0 0 60px rgba(236,72,153,0.2)',
        'card-dark': '0 4px 24px rgba(0,0,0,0.4)',
        'card-light': '0 4px 24px rgba(0,0,0,0.08)',
        'elevated': '0 20px 60px rgba(0,0,0,0.3)',
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '24px',
        '4xl': '32px',
      },
      animation: {
        'fade-in':      'fadeIn 0.5s ease-out',
        'fade-up':      'fadeUp 0.6s ease-out',
        'slide-in':     'slideIn 0.4s ease-out',
        'glow-pulse':   'glowPulse 2s ease-in-out infinite',
        'float':        'float 3s ease-in-out infinite',
        'shimmer':      'shimmer 2s linear infinite',
        'gradient-x':   'gradientX 4s ease infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 10px rgba(124,58,237,0.3)' },
          '50%': { boxShadow: '0 0 30px rgba(124,58,237,0.6), 0 0 60px rgba(236,72,153,0.3)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        gradientX: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
      transitionDuration: {
        '250': '250ms',
        '350': '350ms',
        '400': '400ms',
      },
    },
  },
  plugins: [],
}
