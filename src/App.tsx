/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, createContext, useContext } from 'react';
import { Laptop, AlertCircle, ChevronRight, LogOut, LayoutDashboard, Database, History, User as UserIcon, MonitorSmartphone, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';
import { User } from './types';
import { cn } from './lib/utils';
import { useTheme } from './context/ThemeContext';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export default function App() {
  const { theme, toggleTheme } = useTheme();
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState<'home' | 'admin' | 'history'>('home');

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, [token]);

  const login = (newToken: string, newUser: User) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    setCurrentPage('home');
  };

  if (loading) return null;

  if (!user) {
    return (
      <AuthContext.Provider value={{ user, token, login, logout, loading }}>
        <Auth />
      </AuthContext.Provider>
    );
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      <div className="min-h-screen bg-[var(--main-bg)] flex flex-col font-sans transition-colors duration-300">
        {/* Subtle Gradient Background */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-primary/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-[0%] right-[-10%] w-[30%] h-[50%] bg-brand-secondary/10 rounded-full blur-[100px]" />
        </div>

        {/* Navigation */}
        <nav className="sticky top-0 z-50 bg-[var(--surface)]/80 backdrop-blur-xl border-b border-[var(--border-color)] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-xl flex items-center justify-center text-white shadow-lg shadow-brand-primary/20">
              <MonitorSmartphone size={22} />
            </div>
            <div>
              <h1 className="text-xl font-extrabold tracking-tight text-[var(--text-primary)] leading-none">
                Laptop<span className="gradient-text">Pilih</span>
              </h1>
              <span className="text-[10px] text-[var(--text-secondary)] font-medium uppercase tracking-[0.2em]">Decision Support System</span>
            </div>
          </div>

          <div className="flex items-center gap-8">
            <button 
              onClick={() => setCurrentPage('home')}
              className={cn(
                "flex items-center gap-2 text-xs font-semibold uppercase tracking-widest transition-all",
                currentPage === 'home' ? "text-brand-primary" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              )}
            >
              <LayoutDashboard size={16} />
              <span>Dashboard</span>
            </button>
            <button 
              onClick={() => setCurrentPage('history')}
              className={cn(
                "flex items-center gap-2 text-xs font-semibold uppercase tracking-widest transition-all",
                currentPage === 'history' ? "text-brand-primary" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              )}
            >
              <History size={16} />
              <span>History</span>
            </button>
            {user.role === 'admin' && (
              <button 
                onClick={() => setCurrentPage('admin')}
                className={cn(
                  "flex items-center gap-2 text-xs font-semibold uppercase tracking-widest transition-all",
                  currentPage === 'admin' ? "text-brand-primary" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                )}
              >
                <Database size={16} />
                <span>Admin</span>
              </button>
            )}
            <div className="h-4 w-[1px] bg-[var(--border-color)]" />
            
            <div className="flex items-center gap-4">
              <button
                onClick={toggleTheme}
                className="w-10 h-10 rounded-xl border border-[var(--border-color)] flex items-center justify-center text-[var(--text-secondary)] hover:bg-brand-primary/10 hover:text-brand-primary transition-all"
              >
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              <div className="flex flex-col items-end">
                <span className="text-sm font-bold text-[var(--text-primary)]">{user.email.split('@')[0]}</span>
                <span className="text-[9px] text-[var(--text-secondary)] font-bold tracking-tighter px-1.5 py-0.5 rounded bg-[var(--surface-lighter)] border border-[var(--border-color)]">{user.role.toUpperCase()}</span>
              </div>
              <button 
                onClick={logout}
                className="w-10 h-10 rounded-xl border border-[var(--border-color)] flex items-center justify-center text-[var(--text-secondary)] hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/20 transition-all"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-10 relative z-10">
          <AnimatePresence mode="wait">
            {currentPage === 'home' && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Dashboard />
              </motion.div>
            )}
            {currentPage === 'admin' && user.role === 'admin' && (
              <motion.div
                key="admin"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Admin />
              </motion.div>
            )}
            {currentPage === 'history' && (
              <motion.div
                key="history"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center justify-center h-[60vh] text-[var(--text-secondary)]"
              >
                <div className="w-20 h-20 bg-[var(--surface)] border border-[var(--border-color)] rounded-3xl flex items-center justify-center mb-6">
                  <History size={40} className="text-brand-primary" />
                </div>
                <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">History is coming soon</h2>
                <p className="text-[var(--text-secondary)] max-w-xs text-center opacity-60">We're working on integrating your personal recommendation history.</p>
                <button 
                  onClick={() => setCurrentPage('home')}
                  className="btn-primary mt-8 flex items-center gap-2"
                >
                  Return to Dashboard <ChevronRight size={18} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        <footer className="py-10 px-6 border-t border-[var(--border-color)] flex flex-col md:flex-row items-center justify-between text-xs font-medium text-[var(--text-secondary)] opacity-80">
           <div className="mb-4 md:mb-0">
             <span className="font-bold text-[var(--text-primary)]">LaptopPilih</span> &copy; 2026 &bull; Made for Students
           </div>
           <div className="flex gap-8">
             <a href="#" className="hover:text-[var(--text-primary)] transition-colors">Privacy Policy</a>
             <a href="#" className="hover:text-[var(--text-primary)] transition-colors">Terms of Service</a>
             <a href="#" className="hover:text-[var(--text-primary)] transition-colors">Help Center</a>
           </div>
        </footer>
      </div>
    </AuthContext.Provider>
  );
}
