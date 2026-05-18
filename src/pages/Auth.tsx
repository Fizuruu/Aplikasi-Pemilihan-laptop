import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Lock, UserPlus, LogIn, MonitorSmartphone, ArrowRight } from 'lucide-react';
import { useAuth } from '../App';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
    
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Terjadi kesalahan');

      if (isLogin) {
        login(data.token, data.user);
      } else {
        setIsLogin(true);
        setError('Registrasi berhasil! Silakan login.');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-[var(--main-bg)] overflow-hidden font-sans">
      {/* Left side: Content/Branding */}
      <div className="hidden lg:flex flex-col justify-between p-16 bg-[var(--surface)]/50 relative border-r border-[var(--border-color)]">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-brand-primary/10 rounded-full blur-[120px]" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-20 animate-in fade-in slide-in-from-left-4 duration-700">
            <div className="w-12 h-12 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-2xl flex items-center justify-center text-white shadow-xl shadow-brand-primary/20">
              <MonitorSmartphone size={28} />
            </div>
            <span className="text-2xl font-extrabold tracking-tight text-[var(--text-primary)]">Sistem<span className="gradient-text">Pilih Laptop</span></span>
          </div>
          
          <div className="space-y-6">
            <h2 className="text-7xl font-extrabold leading-[1.05] tracking-tight text-[var(--text-primary)]">
              Pilih Laptop <br />
              <span className="gradient-text">Tanpa Ragu.</span>
            </h2>
            <p className="text-lg text-[var(--text-secondary)] max-w-md leading-relaxed">
              Sistem Pendukung Keputusan cerdas yang membantu mahasiswa menemukan perangkat terbaik sesuai budget dan spesifikasi teknis.
            </p>
          </div>
        </div>

        <div className="relative z-10">
           <div className="flex items-center gap-6 mb-8">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-[var(--main-bg)] bg-[var(--surface-lighter)] flex items-center justify-center text-xs font-bold text-[var(--text-secondary)]">
                    U{i}
                  </div>
                ))}
              </div>
              <p className="text-sm font-medium text-[var(--text-secondary)]">Digunakan oleh 500+ Mahasiswa</p>
           </div>
           <div className="p-1 w-fit rounded-full bg-[var(--surface-lighter)] border border-[var(--border-color)] flex gap-2">
              <span className="px-4 py-1.5 rounded-full bg-brand-primary/10 text-brand-primary text-[10px] font-bold uppercase tracking-wider">Metode SAW</span>
              <span className="px-4 py-1.5 rounded-full text-[var(--text-secondary)]/50 text-[10px] font-bold uppercase tracking-wider">User Centric</span>
           </div>
        </div>
      </div>

      {/* Right side: Form */}
      <div className="flex items-center justify-center p-8 lg:p-24 relative">
        <div className="absolute top-1/4 right-0 w-64 h-64 bg-brand-secondary/5 blur-[100px]" />
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md relative z-10"
        >
          <div className="mb-12 text-center lg:text-left">
            <h3 className="text-4xl font-bold text-[var(--text-primary)] mb-3 tracking-tight">
              {isLogin ? 'Selamat Datang' : 'Buat Akun Baru'}
            </h3>
            <p className="text-[var(--text-secondary)] font-medium">
              {isLogin ? 'Silakan masuk untuk melanjutkan navigasi.' : 'Mulai perjalanan pencarian laptop ideal Anda.'}
            </p>
          </div>

          {error && (
            <div className="p-4 mb-8 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl text-sm font-medium flex items-center gap-3 animate-in fade-in zoom-in-95">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-[var(--text-secondary)] ml-1">Email Address</label>
              <div className="relative group">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-14 pl-12 pr-4 bg-[var(--surface)] border border-[var(--border-color)] rounded-2xl text-[var(--text-primary)] outline-none focus:border-brand-primary/50 transition-all font-medium placeholder:text-[var(--text-secondary)]/40"
                  placeholder="name@email.com"
                  required
                />
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] group-focus-within:text-brand-primary transition-colors" size={20} />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-[var(--text-secondary)] ml-1">Password</label>
              <div className="relative group">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-14 pl-12 pr-4 bg-[var(--surface)] border border-[var(--border-color)] rounded-2xl text-[var(--text-primary)] outline-none focus:border-brand-primary/50 transition-all font-medium placeholder:text-[var(--text-secondary)]/40"
                  placeholder="••••••••"
                  required
                />
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] group-focus-within:text-brand-primary transition-colors" size={20} />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full h-14 mt-4 flex items-center justify-center gap-3"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {isLogin ? 'Masuk Sekarang' : 'Daftar Akun'}
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>

          <div className="mt-10 pt-10 border-t border-[var(--border-color)] text-center">
            <p className="text-[var(--text-secondary)] text-sm font-medium">
              {isLogin ? "Belum punya akun?" : "Sudah punya akun?"}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="ml-2 text-brand-primary hover:text-brand-secondary font-bold transition-colors"
              >
                {isLogin ? 'Daftar Gratis' : 'Login di sini'}
              </button>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
