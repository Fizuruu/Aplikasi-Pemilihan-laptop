/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, createContext, useContext } from 'react';
import { Laptop, AlertCircle, ChevronRight, LogOut, LayoutDashboard, Database, History, User as UserIcon, MonitorSmartphone } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';
import { User } from './types';
import { cn } from './lib/utils';

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
      <div className="min-h-screen bg-[#FDFCFB] flex flex-col font-sans">
        {/* Navigation */}
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center text-white">
              <MonitorSmartphone size={22} />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-gray-900 leading-none">LaptopPilih</h1>
              <span className="text-[10px] text-gray-400 font-medium uppercase tracking-[0.1em]">SPK System</span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button 
              onClick={() => setCurrentPage('home')}
              className={cn(
                "flex items-center gap-2 text-sm font-medium transition-colors",
                currentPage === 'home' ? "text-black" : "text-gray-400 hover:text-black"
              )}
            >
              <LayoutDashboard size={18} />
              <span>Rekomendasi</span>
            </button>
            <button 
              onClick={() => setCurrentPage('history')}
              className={cn(
                "flex items-center gap-2 text-sm font-medium transition-colors",
                currentPage === 'history' ? "text-black" : "text-gray-400 hover:text-black"
              )}
            >
              <History size={18} />
              <span>Riwayat</span>
            </button>
            {user.role === 'admin' && (
              <button 
                onClick={() => setCurrentPage('admin')}
                className={cn(
                  "flex items-center gap-2 text-sm font-medium transition-colors",
                  currentPage === 'admin' ? "text-black" : "text-gray-400 hover:text-black"
                )}
              >
                <Database size={18} />
                <span>Admin Panel</span>
              </button>
            )}
            <div className="h-4 w-[1px] bg-gray-200" />
            <div className="flex items-center gap-3">
              <div className="flex flex-col items-end mr-1">
                <span className="text-sm font-semibold text-gray-900">{user.email.split('@')[0]}</span>
                <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">{user.role}</span>
              </div>
              <button 
                onClick={logout}
                className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-black hover:text-white transition-all cursor-pointer"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-8">
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
                className="flex flex-col items-center justify-center h-[60vh] text-gray-400"
              >
                <History size={48} strokeWidth={1.5} className="mb-4" />
                <h2 className="text-lg font-medium">Fitur Riwayat akan segera hadir</h2>
                <p className="text-sm">Riwayat Anda sedang dalam proses integrasi.</p>
                <button 
                  onClick={() => setCurrentPage('home')}
                  className="mt-6 text-black font-semibold flex items-center gap-2 hover:gap-3 transition-all"
                >
                  Kembali Beranda <ChevronRight size={18} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        <footer className="py-8 px-6 border-t border-gray-100 flex items-center justify-between text-[11px] font-bold uppercase tracking-widest text-gray-400">
           <span>LAPTOPPILIH &copy; 2026</span>
           <div className="flex gap-6">
             <a href="#" className="hover:text-black">Privacy Policy</a>
             <a href="#" className="hover:text-black">Terms of Service</a>
             <a href="#" className="hover:text-black">Support</a>
           </div>
        </footer>
      </div>
    </AuthContext.Provider>
  );
}
