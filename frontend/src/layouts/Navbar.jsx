import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { cn } from '../utils/cn';
import { getInitials, timeAgo } from '../utils/helpers';
import {
  Briefcase, Bell, Moon, Sun, User,
  LayoutDashboard, LogOut, ChevronDown, Menu, X,
  Sparkles, Search, ArrowRight, Settings, FileText, ChevronRight
} from 'lucide-react';

/* ─────────────── Version 2.0 Major — Navbar ─────────────── */

const navLinks = [
  { label: 'Find Jobs', href: '/jobs', icon: Search },
  { label: 'Companies', href: '/companies', icon: Briefcase },
  { label: 'Dashboard', href: '/dashboard', auth: true, icon: LayoutDashboard },
];

const Navbar = () => {
  const { isDark, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const { notifications, unreadCount, markAllRead } = useNotifications();
  const navigate = useNavigate();
  const location = useLocation();

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);

  // Smart scroll: show/hide navbar on scroll direction + blur background on scroll
  const handleScroll = useCallback(() => {
    const currentY = window.scrollY;
    setScrolled(currentY > 10);
    // Hide navbar on scroll down, show on scroll up (only after 100px)
    if (currentY > 100) {
      setVisible(currentY < lastScrollY.current || currentY < 50);
    } else {
      setVisible(true);
    }
    lastScrollY.current = currentY;
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Close menus on outside click
  useEffect(() => {
    const close = (e) => {
      if (!e.target.closest('#profile-menu-v2')) setProfileOpen(false);
      if (!e.target.closest('#notif-menu-v2')) setNotifOpen(false);
      if (!e.target.closest('#mobile-menu-v2') && !e.target.closest('#menu-toggle-v2')) setMobileOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    await logout();
    setProfileOpen(false);
    navigate('/');
  };

  return (
    <>
      {/* Inline styles for v2.0 navbar animations */}
      <style>{`
        .navbar-v2 {
          transition: transform 0.35s cubic-bezier(0.16,1,0.3,1),
                      background-color 0.3s ease,
                      box-shadow 0.3s ease,
                      border-color 0.3s ease,
                      backdrop-filter 0.3s ease;
        }
        .navbar-v2.nav-hidden {
          transform: translateY(-100%);
        }
        .navbar-v2 .nav-link-v2 {
          position: relative;
          overflow: hidden;
        }
        .navbar-v2 .nav-link-v2::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 50%;
          width: 0;
          height: 2px;
          background: linear-gradient(90deg, #7C3AED, #EC4899);
          transition: width 0.3s ease, left 0.3s ease;
          border-radius: 2px;
        }
        .navbar-v2 .nav-link-v2:hover::after,
        .navbar-v2 .nav-link-v2.active-link::after {
          width: 60%;
          left: 20%;
        }
        .navbar-v2 .dropdown-enter {
          animation: dropdownSlide 0.25s cubic-bezier(0.16,1,0.3,1) forwards;
        }
        @keyframes dropdownSlide {
          from { opacity: 0; transform: translateY(-8px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .navbar-v2 .mobile-slide {
          animation: mobileSlide 0.3s cubic-bezier(0.16,1,0.3,1) forwards;
        }
        @keyframes mobileSlide {
          from { opacity: 0; transform: translateY(-12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .navbar-v2 .icon-btn {
          transition: all 0.25s cubic-bezier(0.16,1,0.3,1);
        }
        .navbar-v2 .icon-btn:hover {
          transform: scale(1.08);
        }
        .navbar-v2 .icon-btn:active {
          transform: scale(0.95);
        }
        .navbar-v2 .notif-badge {
          animation: badgePop 0.4s cubic-bezier(0.16,1,0.3,1);
        }
        @keyframes badgePop {
          0% { transform: scale(0); }
          70% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }
        .navbar-v2 .profile-ring {
          transition: box-shadow 0.3s ease, transform 0.3s ease;
        }
        .navbar-v2 .profile-ring:hover {
          box-shadow: 0 0 0 3px rgba(124,58,237,0.3);
        }
        .navbar-v2 .theme-toggle {
          transition: all 0.4s cubic-bezier(0.16,1,0.3,1);
        }
        .navbar-v2 .theme-toggle:hover {
          transform: rotate(30deg) scale(1.1);
        }
      `}</style>

      <nav className={cn(
        'navbar-v2 fixed top-0 left-0 right-0 z-50',
        !visible && 'nav-hidden',
        scrolled
          ? isDark
            ? 'bg-dark-bg/90 backdrop-blur-2xl border-b border-dark-border/50 shadow-lg shadow-black/20'
            : 'bg-white/85 backdrop-blur-2xl border-b border-gray-200/60 shadow-lg shadow-purple-500/5'
          : 'bg-transparent'
      )}>
        <div className="container-custom">
          <div className="flex items-center justify-between h-[68px]">

            {/* ─── Logo ─── */}
            <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
              <div className={cn(
                'w-9 h-9 rounded-xl flex items-center justify-center shadow-lg transition-all duration-300 group-hover:shadow-glow-sm group-hover:scale-105',
                'bg-gradient-to-br from-brand-purple via-brand-pink to-brand-orange'
              )}>
                <Briefcase className="w-4.5 h-4.5 text-white" />
              </div>
              <span className={cn(
                'text-lg font-bold font-heading transition-colors',
                isDark ? 'text-white' : 'text-gray-900'
              )}>
                Talent<span className="gradient-text">Bridge</span>
              </span>
              {/* Version badge — subtle */}
              <span className={cn(
                'hidden lg:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wider uppercase',
                isDark
                  ? 'bg-brand-purple/15 text-brand-violet border border-brand-purple/20'
                  : 'bg-purple-50 text-brand-purple border border-purple-200/60'
              )}>
                v2.0
              </span>
            </Link>

            {/* ─── Desktop Navigation ─── */}
            <div className="hidden md:flex items-center gap-0.5">
              {navLinks.map(link => {
                if (link.auth && !user) return null;
                return (
                  <NavLink
                    key={link.href}
                    to={link.href}
                    className={({ isActive }) => cn(
                      'nav-link-v2 flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-250',
                      isActive
                        ? cn('active-link', isDark
                          ? 'text-white bg-white/[0.06]'
                          : 'text-brand-purple bg-purple-50/80')
                        : isDark
                          ? 'text-gray-400 hover:text-white hover:bg-white/[0.04]'
                          : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50/80'
                    )}
                  >
                    <link.icon className="w-3.5 h-3.5" />
                    {link.label}
                  </NavLink>
                );
              })}
            </div>

            {/* ─── Right Side Actions ─── */}
            <div className="flex items-center gap-1.5">

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className={cn(
                  'icon-btn theme-toggle p-2.5 rounded-xl transition-all duration-300',
                  isDark
                    ? 'text-gray-400 hover:text-yellow-400 hover:bg-yellow-400/10'
                    : 'text-gray-500 hover:text-amber-500 hover:bg-amber-50'
                )}
                title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                aria-label="Toggle theme"
              >
                {isDark ? <Sun className="w-[18px] h-[18px]" /> : <Moon className="w-[18px] h-[18px]" />}
              </button>

              {user ? (
                <>
                  {/* ─── Notifications ─── */}
                  <div className="relative hidden md:block" id="notif-menu-v2">
                    <button
                      onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }}
                      className={cn(
                        'icon-btn relative p-2.5 rounded-xl transition-all duration-250',
                        notifOpen
                          ? isDark ? 'bg-white/10 text-white' : 'bg-purple-50 text-brand-purple'
                          : isDark ? 'text-gray-400 hover:text-white hover:bg-white/[0.06]' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                      )}
                      aria-label="Notifications"
                    >
                      <Bell className="w-[18px] h-[18px]" />
                      {unreadCount > 0 && (
                        <span className="notif-badge absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-gradient-to-r from-brand-pink to-brand-orange text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-lg shadow-pink-500/30">
                          {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                      )}
                    </button>

                    {/* Notification Dropdown */}
                    {notifOpen && (
                      <div className={cn(
                        'dropdown-enter absolute right-0 mt-3 w-[360px] rounded-2xl border shadow-2xl z-50 overflow-hidden',
                        isDark
                          ? 'bg-dark-card/95 backdrop-blur-xl border-dark-border shadow-black/40'
                          : 'bg-white/95 backdrop-blur-xl border-gray-200 shadow-purple-500/10'
                      )}>
                        {/* Header */}
                        <div className={cn('px-5 py-4 border-b flex items-center justify-between', isDark ? 'border-dark-border/50' : 'border-gray-100')}>
                          <div className="flex items-center gap-2">
                            <h3 className={cn('font-bold text-sm', isDark ? 'text-white' : 'text-gray-900')}>Notifications</h3>
                            {unreadCount > 0 && (
                              <span className={cn(
                                'px-2 py-0.5 rounded-full text-[10px] font-bold',
                                isDark ? 'bg-brand-pink/20 text-brand-pink' : 'bg-pink-100 text-pink-600'
                              )}>
                                {unreadCount} new
                              </span>
                            )}
                          </div>
                          {unreadCount > 0 && (
                            <button onClick={markAllRead} className="text-[11px] font-medium text-brand-violet hover:text-brand-pink transition-colors">
                              Mark all read
                            </button>
                          )}
                        </div>

                        {/* Notification List */}
                        <div className="max-h-[380px] overflow-y-auto">
                          {notifications.length === 0 ? (
                            <div className="py-14 text-center px-6">
                              <div className={cn('w-12 h-12 rounded-2xl mx-auto mb-3 flex items-center justify-center', isDark ? 'bg-dark-hover' : 'bg-gray-100')}>
                                <Bell className="w-5 h-5 text-gray-400" />
                              </div>
                              <p className={cn('text-sm font-medium', isDark ? 'text-gray-400' : 'text-gray-500')}>All caught up!</p>
                              <p className={cn('text-xs mt-1', isDark ? 'text-gray-500' : 'text-gray-400')}>No notifications right now</p>
                            </div>
                          ) : (
                            notifications.map((n) => (
                              <Link
                                key={n._id}
                                to={n.link || '#'}
                                onClick={() => setNotifOpen(false)}
                                className={cn(
                                  'flex items-start gap-3.5 px-5 py-4 transition-all duration-200 border-b last:border-0 group',
                                  !n.read
                                    ? isDark ? 'bg-brand-purple/[0.04] hover:bg-brand-purple/[0.08]' : 'bg-purple-50/40 hover:bg-purple-50/70'
                                    : isDark ? 'hover:bg-white/[0.03]' : 'hover:bg-gray-50/80',
                                  isDark ? 'border-dark-border/30' : 'border-gray-50'
                                )}
                              >
                                <div className="relative shrink-0">
                                  <div className={cn(
                                    'w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm text-white shadow-lg',
                                    n.type === 'application' ? 'bg-gradient-to-br from-blue-500 to-cyan-500 shadow-blue-500/20'
                                      : n.type === 'status_update' ? 'bg-gradient-to-br from-accent-green to-emerald-600 shadow-green-500/20'
                                        : 'bg-gradient-to-br from-brand-purple to-brand-pink shadow-purple-500/20'
                                  )}>
                                    {n.title[0]}
                                  </div>
                                  {!n.read && (
                                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-brand-pink rounded-full border-2 border-white dark:border-dark-card shadow-sm" />
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className={cn('text-[13px] font-semibold leading-tight', isDark ? 'text-gray-100' : 'text-gray-900')}>{n.title}</p>
                                  <p className={cn('text-[11px] mt-1 line-clamp-2 leading-relaxed', isDark ? 'text-gray-400' : 'text-gray-500')}>{n.message}</p>
                                  <p className="text-[10px] text-gray-500 mt-1.5">{timeAgo(n.createdAt)}</p>
                                </div>
                                <ChevronRight className={cn('w-4 h-4 shrink-0 mt-1 transition-transform group-hover:translate-x-0.5', isDark ? 'text-gray-600' : 'text-gray-300')} />
                              </Link>
                            ))
                          )}
                        </div>

                        {/* Footer */}
                        <Link
                          to="/dashboard"
                          onClick={() => setNotifOpen(false)}
                          className={cn(
                            'flex items-center justify-center gap-1.5 py-3.5 text-[11px] font-bold uppercase tracking-wider border-t transition-colors',
                            isDark
                              ? 'border-dark-border/50 text-gray-400 hover:text-white hover:bg-white/[0.03]'
                              : 'border-gray-100 text-gray-500 hover:text-brand-purple hover:bg-purple-50/50'
                          )}
                        >
                          View All Activity
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    )}
                  </div>

                  {/* ─── Profile Dropdown ─── */}
                  <div className="relative" id="profile-menu-v2">
                    <button
                      onClick={() => { setProfileOpen(p => !p); setNotifOpen(false); }}
                      className={cn(
                        'flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-2xl transition-all duration-250',
                        profileOpen
                          ? isDark ? 'bg-white/10' : 'bg-purple-50'
                          : isDark ? 'hover:bg-white/[0.05]' : 'hover:bg-gray-50'
                      )}
                    >
                      <div className={cn(
                        'profile-ring w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 overflow-hidden',
                        'bg-gradient-to-br from-brand-purple via-brand-pink to-brand-orange shadow-md'
                      )}>
                        {user.profilePicture ? (
                          <img src={user.profilePicture} alt={user.name} className="w-full h-full object-cover" />
                        ) : (
                          getInitials(user.name)
                        )}
                      </div>
                      <span className={cn(
                        'text-sm font-medium hidden md:block max-w-[100px] truncate',
                        isDark ? 'text-gray-200' : 'text-gray-700'
                      )}>
                        {user.name.split(' ')[0]}
                      </span>
                      <ChevronDown className={cn(
                        'w-3.5 h-3.5 hidden md:block transition-transform duration-250',
                        isDark ? 'text-gray-500' : 'text-gray-400',
                        profileOpen && 'rotate-180'
                      )} />
                    </button>

                    {/* Profile Dropdown */}
                    {profileOpen && (
                      <div className={cn(
                        'dropdown-enter absolute right-0 mt-2.5 w-56 rounded-2xl border shadow-2xl z-50 overflow-hidden',
                        isDark
                          ? 'bg-dark-card/95 backdrop-blur-xl border-dark-border shadow-black/40'
                          : 'bg-white/95 backdrop-blur-xl border-gray-200 shadow-purple-500/10'
                      )}>
                        {/* User info header */}
                        <div className={cn(
                          'px-4 py-4 border-b',
                          isDark ? 'border-dark-border/50' : 'border-gray-100'
                        )}>
                          <div className="flex items-center gap-3">
                            <div className={cn(
                              'w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0 overflow-hidden',
                              'bg-gradient-to-br from-brand-purple via-brand-pink to-brand-orange shadow-md'
                            )}>
                              {user.profilePicture ? (
                                <img src={user.profilePicture} alt={user.name} className="w-full h-full object-cover" />
                              ) : (
                                getInitials(user.name)
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className={cn('text-sm font-bold truncate', isDark ? 'text-white' : 'text-gray-900')}>
                                {user.name}
                              </p>
                              <p className={cn('text-[11px] truncate', isDark ? 'text-gray-500' : 'text-gray-400')}>
                                {user.email}
                              </p>
                            </div>
                          </div>
                          {/* Role badge */}
                          <div className={cn(
                            'mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-semibold uppercase tracking-wider',
                            user.role === 'employer'
                              ? isDark ? 'bg-accent-cyan/10 text-accent-cyan' : 'bg-cyan-50 text-cyan-600'
                              : isDark ? 'bg-accent-green/10 text-accent-green' : 'bg-green-50 text-green-600'
                          )}>
                            <Sparkles className="w-3 h-3" />
                            {user.role === 'employer' ? 'Employer' : 'Job Seeker'}
                          </div>
                        </div>

                        {/* Menu items */}
                        <div className="py-1.5">
                          {[
                            { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
                            { label: 'My Profile', icon: User, href: '/profile' },
                            ...(user.role === 'jobseeker' ? [{ label: 'My Applications', icon: FileText, href: '/dashboard/applications' }] : []),
                          ].map(item => (
                            <Link
                              key={item.href}
                              to={item.href}
                              onClick={() => setProfileOpen(false)}
                              className={cn(
                                'flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-all duration-200 group',
                                isDark
                                  ? 'text-gray-300 hover:text-white hover:bg-white/[0.05]'
                                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50/80'
                              )}
                            >
                              <item.icon className={cn('w-4 h-4 transition-colors', isDark ? 'text-gray-500 group-hover:text-brand-violet' : 'text-gray-400 group-hover:text-brand-purple')} />
                              {item.label}
                            </Link>
                          ))}
                        </div>

                        {/* Logout */}
                        <div className={cn('border-t py-1.5', isDark ? 'border-dark-border/50' : 'border-gray-100')}>
                          <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium w-full text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200 group"
                          >
                            <LogOut className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                            Sign Out
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                /* ─── Auth Buttons (Logged Out) ─── */
                <div className="hidden md:flex items-center gap-2">
                  <Link to="/login">
                    <button className={cn(
                      'px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-250',
                      isDark
                        ? 'text-gray-300 hover:text-white hover:bg-white/[0.06]'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    )}>
                      Sign In
                    </button>
                  </Link>
                  <Link to="/register">
                    <button className={cn(
                      'relative overflow-hidden px-5 py-2.5 rounded-xl text-sm font-semibold text-white',
                      'bg-gradient-to-r from-brand-purple via-brand-pink to-brand-orange',
                      'hover:shadow-glow-md hover:scale-[1.03] active:scale-[0.97]',
                      'transition-all duration-300'
                    )}>
                      Get Started
                      <ArrowRight className="w-3.5 h-3.5 inline ml-1" />
                    </button>
                  </Link>
                </div>
              )}

              {/* ─── Mobile Hamburger ─── */}
              <button
                id="menu-toggle-v2"
                onClick={() => setMobileOpen(p => !p)}
                className={cn(
                  'icon-btn md:hidden p-2.5 rounded-xl transition-all duration-250',
                  mobileOpen
                    ? isDark ? 'bg-white/10 text-white' : 'bg-purple-50 text-brand-purple'
                    : isDark ? 'text-gray-400 hover:text-white hover:bg-white/[0.06]' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                )}
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* ─── Mobile Menu ─── */}
        {mobileOpen && (
          <div
            id="mobile-menu-v2"
            className={cn(
              'mobile-slide md:hidden border-t py-3 px-4',
              isDark
                ? 'bg-dark-bg/98 backdrop-blur-2xl border-dark-border/50'
                : 'bg-white/98 backdrop-blur-2xl border-gray-200/60'
            )}
          >
            {/* Nav links */}
            <div className="space-y-1">
              {navLinks.map((link, i) => {
                if (link.auth && !user) return null;
                return (
                  <NavLink
                    key={link.href}
                    to={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) => cn(
                      'flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-200',
                      isActive
                        ? isDark ? 'bg-brand-purple/15 text-brand-violet' : 'bg-purple-50 text-brand-purple'
                        : isDark ? 'text-gray-400 hover:text-white hover:bg-white/[0.05]' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    )}
                    style={{ animationDelay: `${i * 50}ms` }}
                  >
                    <link.icon className="w-4 h-4" />
                    {link.label}
                  </NavLink>
                );
              })}
            </div>

            {/* Notifications link for mobile */}
            {user && (
              <Link
                to="/dashboard"
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'flex items-center justify-between gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all mt-1',
                  isDark ? 'text-gray-400 hover:text-white hover:bg-white/[0.05]' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                )}
              >
                <div className="flex items-center gap-3">
                  <Bell className="w-4 h-4" />
                  Notifications
                </div>
                {unreadCount > 0 && (
                  <span className="min-w-[20px] h-5 px-1.5 bg-gradient-to-r from-brand-pink to-brand-orange text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </Link>
            )}

            {/* Divider */}
            <div className={cn('h-px my-3', isDark ? 'bg-dark-border/50' : 'bg-gray-100')} />

            {/* Auth buttons or user info */}
            {!user ? (
              <div className="flex flex-col gap-2">
                <Link to="/login" onClick={() => setMobileOpen(false)}>
                  <button className={cn(
                    'w-full py-3 rounded-xl text-sm font-semibold border transition-all',
                    isDark
                      ? 'border-dark-border text-gray-300 hover:bg-white/[0.05]'
                      : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                  )}>
                    Sign In
                  </button>
                </Link>
                <Link to="/register" onClick={() => setMobileOpen(false)}>
                  <button className="w-full py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-brand-purple via-brand-pink to-brand-orange hover:shadow-glow-sm transition-all">
                    Get Started <ArrowRight className="w-3.5 h-3.5 inline ml-1" />
                  </button>
                </Link>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-purple via-brand-pink to-brand-orange flex items-center justify-center text-white text-xs font-bold shadow-md overflow-hidden">
                    {user.profilePicture ? (
                      <img src={user.profilePicture} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      getInitials(user.name)
                    )}
                  </div>
                  <div>
                    <p className={cn('text-sm font-bold', isDark ? 'text-white' : 'text-gray-900')}>{user.name}</p>
                    <p className={cn('text-[11px]', isDark ? 'text-gray-500' : 'text-gray-400')}>{user.role === 'employer' ? 'Employer' : 'Job Seeker'}</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2.5 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;
