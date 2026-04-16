import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { logOut } from '../firebase';
import { Logo } from './Logo';
import { ThemeToggle } from './ThemeToggle';
import { 
  Users, 
  Activity, 
  Building2, 
  Settings, 
  LogOut,
  Menu,
  X,
  LayoutDashboard
} from 'lucide-react';
import clsx from 'clsx';

export const AdminLayout: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    await logOut();
    navigate('/login');
  };

  const navItems = [
    { name: 'Users', path: '/admin/users', icon: Users },
    { name: 'Performance', path: '/admin/performance', icon: Activity },
    { name: 'Companies', path: '/admin/companies', icon: Building2 },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100 font-sans overflow-hidden transition-colors duration-300">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 bg-white dark:bg-[#111827]/80 backdrop-blur-xl border-r border-slate-200 dark:border-white/5 flex-col z-20 transition-colors duration-300">
        <div className="p-6 flex items-center gap-3">
          <Logo className="w-8 h-8" />
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-rose-600 to-orange-600 dark:from-rose-400 dark:to-orange-400 tracking-tight">Admin</h1>
        </div>
        
        <nav className="flex-1 px-4 py-2 space-y-1.5 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                clsx(
                  'flex items-center px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 group',
                  isActive
                    ? 'bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-300 shadow-sm dark:shadow-none'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-slate-200'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon className={clsx(
                    "mr-3 h-5 w-5 flex-shrink-0 transition-colors duration-200",
                    isActive ? "text-rose-600 dark:text-rose-400" : "text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300"
                  )} />
                  {item.name}
                </>
              )}
            </NavLink>
          ))}
          
          <div className="pt-4 mt-4 border-t border-slate-200 dark:border-white/5">
            <NavLink
              to="/dashboard"
              className="flex items-center px-3 py-2.5 text-sm font-medium rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-slate-200 transition-all duration-200 group"
            >
              <LayoutDashboard className="mr-3 h-5 w-5 flex-shrink-0 text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors duration-200" />
              User View
            </NavLink>
          </div>
        </nav>

        <div className="p-4 border-t border-slate-200 dark:border-white/5">
          <div className="flex items-center gap-3 px-3 py-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-rose-100 dark:bg-rose-900/50 flex items-center justify-center text-rose-600 dark:text-rose-400 font-bold text-sm shrink-0">
              {user?.displayName?.charAt(0) || user?.email?.charAt(0) || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                {user?.displayName || 'Admin User'}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                {user?.email}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-3 py-2 text-sm font-medium text-rose-600 dark:text-rose-400 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors duration-200"
          >
            <LogOut className="mr-3 h-5 w-5" />
            Sign out
          </button>
        </div>
      </aside>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <aside className={clsx(
        "fixed inset-y-0 left-0 w-72 bg-white dark:bg-[#111827] border-r border-slate-200 dark:border-white/5 flex flex-col z-40 transition-transform duration-300 ease-in-out lg:hidden",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo className="w-8 h-8" />
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-rose-600 to-orange-600 dark:from-rose-400 dark:to-orange-400 tracking-tight">Admin</h1>
          </div>
          <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <nav className="flex-1 px-4 py-2 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                clsx(
                  'flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group',
                  isActive
                    ? 'bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-300'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-slate-200'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon className={clsx(
                    "mr-3 h-5 w-5 flex-shrink-0 transition-colors duration-200",
                    isActive ? "text-rose-600 dark:text-rose-400" : "text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300"
                  )} />
                  {item.name}
                </>
              )}
            </NavLink>
          ))}
          
          <div className="pt-4 mt-4 border-t border-slate-200 dark:border-white/5">
            <NavLink
              to="/dashboard"
              className="flex items-center px-4 py-3 text-sm font-medium rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-slate-200 transition-all duration-200 group"
            >
              <LayoutDashboard className="mr-3 h-5 w-5 flex-shrink-0 text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors duration-200" />
              User View
            </NavLink>
          </div>
        </nav>

        <div className="p-4 border-t border-slate-200 dark:border-white/5">
          <div className="flex items-center gap-3 px-4 py-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-900/50 flex items-center justify-center text-rose-600 dark:text-rose-400 font-bold text-lg shrink-0">
              {user?.displayName?.charAt(0) || user?.email?.charAt(0) || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                {user?.displayName || 'Admin User'}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                {user?.email}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 text-sm font-medium text-rose-600 dark:text-rose-400 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors duration-200"
          >
            <LogOut className="mr-3 h-5 w-5" />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Desktop Header */}
        <header className="hidden lg:flex h-16 items-center justify-end px-8 bg-white/50 dark:bg-[#111827]/50 backdrop-blur-md border-b border-slate-200 dark:border-white/5 sticky top-0 z-10 transition-colors duration-300">
          <ThemeToggle />
        </header>

        {/* Mobile Header */}
        <header className="lg:hidden h-16 flex items-center justify-between px-4 bg-white/80 dark:bg-[#111827]/80 backdrop-blur-md border-b border-slate-200 dark:border-white/5 sticky top-0 z-10 transition-colors duration-300">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 -ml-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
            >
              <Menu className="h-6 w-6" />
            </button>
            <Logo className="w-6 h-6" />
          </div>
          <ThemeToggle />
        </header>

        <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};
