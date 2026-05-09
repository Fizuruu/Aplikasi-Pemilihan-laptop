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
    <div className="min-h-screen grid lg:grid-cols-2 bg-white">
      {/* Left side: Content/Branding */}
      <div className="hidden lg:flex flex-col justify-between p-12 bg-black text-white relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-black">
              <MonitorSmartphone size={28} />
            </div>
            <span className="text-2xl font-bold tracking-tight">LaptopPilih</span>
          </div>
          
          <h2 className="text-6xl font-bold leading-[1.1] mb-6">
            Temukan Laptop <br />
            <span className="text-gray-500 italic font-serif">Terbaik Anda.</span>
          </h2>
          <p className="text-lg text-gray-400 max-w-md">
            Sistem Pendukung Keputusan cerdas yang membantu mahasiswa memilih laptop sesuai budget dan kebutuhan perkuliahan.
          </p>
        </div>

        <div className="relative z-10">
          <div className="flex gap-4 mb-4">
             {[1, 2, 3].map(i => (
               <div key={i} className="w-12 h-1 bg-gray-800 rounded-full" />
             ))}
          </div>
          <p className="text-sm font-medium text-gray-500 uppercase tracking-widest">
            Metode SAW &bull; User-Centric Design &bull; Startup Experience
          </p>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-gray-900 rounded-full opacity-50" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-gray-900 rounded-full opacity-50" />
      </div>

      {/* Right side: Form */}
      <div className="flex items-center justify-center p-8 lg:p-24 bg-[#FDFCFB]">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md"
        >
          <div className="mb-10 text-center lg:text-left">
            <h3 className="text-3xl font-bold text-gray-900 mb-2">
              {isLogin ? 'Selamat Datang' : 'Buat Akun Baru'}
            </h3>
            <p className="text-gray-500">
              {isLogin ? 'Masuk untuk mencari rekomendasi laptop Anda.' : 'Daftar sekarang untuk memulai perjalanan Anda.'}
            </p>
          </div>

          {error && (
            <div className="p-4 mb-6 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-100 flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-14 pl-12 pr-4 bg-white border border-gray-200 rounded-2xl outline-none focus:border-black transition-all font-medium"
                  placeholder="name@example.com"
                  required
                />
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Password</label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-14 pl-12 pr-4 bg-white border border-gray-200 rounded-2xl outline-none focus:border-black transition-all font-medium"
                  placeholder="••••••••"
                  required
                />
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-14 bg-black text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-gray-900 transition-all active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {isLogin ? 'Masuk Sekarang' : 'Daftar Sekarang'}
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-gray-100 text-center">
            <p className="text-gray-500 text-sm">
              {isLogin ? "Belum punya akun?" : "Sudah punya akun?"}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="ml-2 font-bold text-black hover:underline"
              >
                {isLogin ? 'Daftar Gratis' : 'Masuk di sini'}
              </button>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
