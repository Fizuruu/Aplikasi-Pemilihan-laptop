import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Cpu, HardDrive, Smartphone, Zap, Monitor, Laptop as LaptopIcon, 
  Search, Filter, ChevronRight, TrendingUp, Info, CheckCircle2,
  Code, Gamepad, PenTool, BarChart as ChartIcon, Briefcase, DollarSign
} from 'lucide-react';
import { useAuth } from '../App';
import { Laptop, Criterion } from '../types';
import { cn, formatCurrency } from '../lib/utils';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell } from 'recharts';

const usageProfiles = [
  { id: 'programming', name: 'Programming', icon: Code, description: 'Fokus pada RAM dan Processor untuk kompilasi kode.' },
  { id: 'gaming', name: 'Gaming', icon: Gamepad, description: 'Performa GPU tinggi untuk frame rate maksimal.' },
  { id: 'design', name: 'Desain Grafis', icon: PenTool, description: 'Layar berkualitas dan GPU untuk render visual.' },
  { id: 'office', name: 'Office / Admin', icon: Briefcase, description: 'Ringan, batre awet, dan nyaman dibawa-bawa.' },
  { id: 'data', name: 'Data Analyst', icon: ChartIcon, description: 'RAM besar dan CPU kencang untuk olah dataset.' },
];

const budgetFilters = [
  { label: 'Semua Budget', value: 0 },
  { label: '< 7 Juta', value: 7000000 },
  { label: '< 10 Juta', value: 10000000 },
  { label: '< 15 Juta', value: 15000000 },
  { label: '> 15 Juta', value: 30000000 },
];

export default function Dashboard() {
  const { token } = useAuth();
  const [laptops, setLaptops] = useState<Laptop[]>([]);
  const [results, setResults] = useState<Laptop[]>([]);
  const [profile, setProfile] = useState('');
  const [budget, setBudget] = useState(0);
  const [loading, setLoading] = useState(false);
  const [weights, setWeights] = useState<Record<string, number>>({});

  useEffect(() => {
    fetchLaptops();
  }, []);

  const fetchLaptops = async () => {
    const res = await fetch('/api/laptops');
    const data = await res.json();
    setLaptops(data);
  };

  const handleRecommend = async () => {
    if (!profile) return;
    setLoading(true);
    try {
      const res = await fetch('/api/recommend', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ profile, maxBudget: budget || undefined }),
      });
      const data = await res.json();
      setResults(data.results);
      setWeights(data.weights);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-12 pb-20 font-sans">
      {/* Hero Header */}
      <section className="relative min-h-[340px] glass-card rounded-[32px] p-12 overflow-hidden flex flex-col justify-center border-none">
        {/* Animated Background Blur */}
        <div className="absolute top-[-20%] right-[-10%] w-80 h-80 bg-brand-primary/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[20%] w-60 h-60 bg-brand-secondary/10 rounded-full blur-[80px]" />
        
        <div className="relative z-10 max-w-2xl">
          <div className="inline-block px-4 py-1.5 bg-brand-primary/10 border border-brand-primary/20 text-brand-primary rounded-full text-[10px] font-bold uppercase tracking-widest mb-6">
            Smart Decision Engine Active
          </div>
          <h2 className="text-6xl font-extrabold text-[var(--text-primary)] mb-6 tracking-tight leading-[1.1]">
            Temukan Partner <br />
            <span className="gradient-text">Akademik Anda.</span>
          </h2>
          <p className="text-[var(--text-secondary)] text-lg leading-relaxed max-w-lg">
            Gunakan kekuatan algoritma SAW untuk mensinkronisasi kebutuhan spesifik Anda dengan ribuan data perangkat keras terbaik.
          </p>
        </div>

        {/* Decorative interface elements */}
        <div className="absolute top-1/2 right-12 -translate-y-1/2 hidden lg:block opacity-20 pointer-events-none">
           <LaptopIcon size={240} strokeWidth={0.5} className="text-[var(--text-primary)]" />
        </div>
      </section>

      {/* Inputs */}
      <div className="grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          <div>
            <div className="flex items-center justify-between mb-8">
               <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--text-secondary)]">01. Pilih Kategori Penggunaan</h3>
            </div>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
              {usageProfiles.map((p) => {
                const Icon = p.icon;
                return (
                  <button
                    key={p.id}
                    onClick={() => setProfile(p.id)}
                    className={cn(
                      "p-6 rounded-[24px] border transition-all group relative overflow-hidden text-left",
                      profile === p.id 
                        ? "bg-brand-primary/10 border-brand-primary ring-1 ring-brand-primary" 
                        : "bg-[var(--surface)] border-[var(--border-color)] hover:border-brand-primary/30 shadow-sm"
                    )}
                  >
                    <div className={cn(
                      "w-12 h-12 rounded-2xl flex items-center justify-center mb-5 transition-colors",
                      profile === p.id ? "bg-brand-primary text-white shadow-lg shadow-brand-primary/30" : "bg-[var(--main-bg)] text-[var(--text-secondary)] group-hover:bg-brand-primary/10 group-hover:text-brand-primary"
                    )}>
                      <Icon size={24} />
                    </div>
                    <h4 className={cn("font-bold text-sm mb-2 transition-colors", profile === p.id ? "text-[var(--text-primary)]" : "text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]")}>{p.name}</h4>
                    <p className={cn("text-xs leading-relaxed transition-colors", profile === p.id ? "text-[var(--text-primary)]/70" : "text-[var(--text-secondary)]/60")}>
                      {p.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
             <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--text-secondary)] mb-8">02. Tentukan Batas Budget</h3>
             <div className="flex flex-wrap gap-4">
               {budgetFilters.map((f) => (
                 <button
                   key={f.label}
                   onClick={() => setBudget(f.value)}
                   className={cn(
                     "px-6 py-4 rounded-2xl text-xs font-bold border transition-all",
                     budget === f.value 
                       ? "bg-brand-primary text-white border-brand-primary shadow-xl shadow-brand-primary/20" 
                       : "bg-[var(--surface)] text-[var(--text-secondary)] border-[var(--border-color)] hover:border-brand-primary/30"
                   )}
                 >
                   {f.label}
                 </button>
               ))}
             </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-[var(--surface)] border border-[var(--border-color)] rounded-[32px] p-8 h-full flex flex-col justify-between relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/5 blur-3xl rounded-full" />
            
            <div>
              <div className="w-14 h-14 bg-brand-primary/10 border border-brand-primary/20 rounded-2xl flex items-center justify-center text-brand-primary mb-8">
                <Zap size={28} />
              </div>
              <h3 className="text-2xl font-bold mb-4 tracking-tight text-[var(--text-primary)] leading-tight">Proses Rekomendasi</h3>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-10">
                Sistem akan menyinkronkan profil Anda dengan {laptops.length} database perangkat menggunakan normalisasi algoritma SAW.
              </p>
              
              <ul className="space-y-4 mb-10">
                {[
                  { label: 'Normalisasi Matriks', active: !!profile },
                  { label: 'Pembobotan Kriteria', active: !!profile },
                  { label: 'Pemeringkatan Unit', active: !!profile }
                ].map((step, i) => (
                  <li key={i} className={cn(
                    "flex items-center gap-4 text-xs font-bold uppercase tracking-widest transition-colors",
                    step.active ? "text-[var(--text-primary)]" : "text-[var(--text-secondary)]/40"
                  )}>
                    <div className={cn(
                      "w-5 h-5 rounded-full border flex items-center justify-center transition-all",
                      step.active ? "border-brand-primary bg-brand-primary/10 text-brand-primary" : "border-[var(--border-color)]"
                    )}>
                       {step.active && <CheckCircle2 size={12} />}
                    </div>
                    {step.label}
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={handleRecommend}
              disabled={!profile || loading}
              className="btn-primary w-full h-16 flex items-center justify-center gap-3 text-sm"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Dapatkan Unit Terbaik <ChevronRight size={20} /></>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      <AnimatePresence>
        {results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-12 border-t border-[var(--border-color)] pt-20"
          >
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
              <div>
                <div className="text-emerald-500 text-[10px] font-bold uppercase tracking-[0.4em] mb-4">Analisis Berhasil // Unit Ditemukan</div>
                <h3 className="text-5xl font-extrabold tracking-tight text-[var(--text-primary)] mb-4">Rekomendasi Terbaik</h3>
                <p className="text-[var(--text-secondary)] max-w-xl text-sm font-medium leading-relaxed">
                  Berdasarkan pemrosesan data, unit berikut memiliki skor kecocokan tertinggi untuk profil **{usageProfiles.find(u => u.id === profile)?.name}**.
                </p>
              </div>
              <div className="bg-emerald-500/10 border border-emerald-500/20 px-6 py-4 rounded-2xl flex items-center gap-4">
                <TrendingUp size={20} className="text-emerald-500" />
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-500">Match Utama: {results[0].brand} {results[0].model}</span>
              </div>
            </div>

            {/* Chart */}
            <div className="bg-[var(--surface)] border border-[var(--border-color)] rounded-[32px] p-10 shadow-2xl">
              <h4 className="text-xs font-bold uppercase tracking-widest text-[var(--text-secondary)] mb-10 flex items-center gap-3">
                <ChartIcon size={16} className="text-brand-secondary" /> Visualisasi Kecocokan (%)
              </h4>
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={results.slice(0, 5)}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                    <XAxis 
                      dataKey="model" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 10, fontWeight: 700, fill: 'var(--text-secondary)' }}
                      dy={15}
                    />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--text-secondary)' }} domain={[0, 100]} />
                    <RechartsTooltip 
                      cursor={{ fill: 'rgba(0,0,0,0.02)' }}
                      contentStyle={{ backgroundColor: 'var(--surface)', borderRadius: '16px', border: '1px solid var(--border-color)', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}
                      itemStyle={{ color: 'var(--text-primary)', fontSize: '11px', fontWeight: 'bold' }}
                    />
                    <Bar dataKey="matchPercentage" radius={[12, 12, 0, 0]}>
                      {results.slice(0, 5).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index === 0 ? 'var(--brand-primary)' : 'var(--surface-lighter)'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Laptop List */}
            <div className="space-y-8">
               <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--text-secondary)]">Detail Spesifikasi Perangkat</h3>
               <div className="grid gap-8">
                 {results.slice(0, 5).map((l, i) => (
                   <motion.div
                    key={l.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className={cn(
                      "group bg-[var(--surface)] border border-[var(--border-color)] rounded-[32px] p-8 hover:border-brand-primary/50 transition-all relative overflow-hidden",
                      i === 0 && "ring-2 ring-brand-primary ring-offset-4 ring-offset-[var(--main-bg)]"
                    )}
                   >
                     {i === 0 && (
                       <div className="absolute top-0 right-0 px-6 py-2 bg-brand-primary text-white text-[10px] font-bold uppercase tracking-widest transform rotate-45 translate-x-12 translate-y-4 w-48 text-center shadow-lg">
                         Top Match
                       </div>
                     )}

                     <div className="flex flex-col lg:flex-row gap-10">
                        {/* Image */}
                        <div className="w-full lg:w-64 h-64 bg-[var(--main-bg)] rounded-2xl overflow-hidden relative border border-[var(--border-color)]">
                           <img src={l.image_url} alt={l.model} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700" />
                           <div className="absolute top-4 left-4 w-10 h-10 bg-surface text-[var(--text-primary)] font-bold flex items-center justify-center text-lg rounded-xl shadow-xl">
                             {i + 1}
                           </div>
                        </div>

                        {/* Info */}
                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <div className="flex items-center justify-between mb-8">
                              <div>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)] mb-2 block">
                                  Category: {l.brand}
                                </span>
                                <h4 className="text-3xl font-bold tracking-tight text-[var(--text-primary)] leading-none">{l.model}</h4>
                              </div>
                              <div className="text-right">
                                <div className={cn("text-4xl font-extrabold", i === 0 ? "text-brand-primary" : "text-[var(--text-primary)]")}>
                                  {l.matchPercentage}%
                                </div>
                                <div className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest mt-1">Match Score</div>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                               <div className="p-4 bg-[var(--main-bg)] rounded-2xl">
                                 <div className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest mb-2">RAM</div>
                                 <div className="flex items-center gap-2 font-bold text-sm text-[var(--text-primary)]">
                                   <Smartphone size={16} className="text-brand-primary" /> {l.ram}GB Memory
                                 </div>
                               </div>
                               <div className="p-4 bg-[var(--main-bg)] rounded-2xl">
                                 <div className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest mb-2">Storage</div>
                                 <div className="flex items-center gap-2 font-bold text-sm text-[var(--text-primary)]">
                                   <HardDrive size={16} className="text-brand-primary" /> {l.storage}GB SSD
                                 </div>
                               </div>
                               <div className="p-4 bg-[var(--main-bg)] rounded-2xl">
                                 <div className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest mb-2">Battery</div>
                                 <div className="flex items-center gap-2 font-bold text-sm text-[var(--text-primary)]">
                                   <Zap size={16} className="text-brand-primary" /> {l.battery}Wh Unit
                                 </div>
                               </div>
                               <div className="p-4 bg-brand-primary/5 border border-brand-primary/20 rounded-2xl">
                                 <div className="text-[10px] font-bold text-brand-primary uppercase tracking-widest mb-2">Estimasi Harga</div>
                                 <div className="flex items-center gap-1 font-extrabold text-sm text-[var(--text-primary)]">{formatCurrency(l.price)}</div>
                               </div>
                            </div>
                          </div>

                          <div className="flex flex-col md:flex-row md:items-center justify-between border-t border-[var(--border-color)] pt-8 gap-4">
                             <div className="flex items-center gap-3 text-xs font-semibold text-[var(--text-secondary)] italic">
                               <Info size={16} className="text-brand-primary" />
                               {i === 0 ? "Pilihan paling sinkron dengan profil beban kerja Anda." : "Unit cadangan dengan tingkat efisiensi yang kompetitif."}
                             </div>
                             <div className="font-mono font-bold text-[11px] text-[var(--text-secondary)] bg-[var(--surface-lighter)] px-4 py-2 rounded-lg border border-[var(--border-color)]">
                               INDEX_VAL: {l.score}
                             </div>
                          </div>
                        </div>
                     </div>
                   </motion.div>
                 ))}
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
