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
    <div className="space-y-12 pb-20">
      {/* Hero Header */}
      <section className="relative h-[300px] bg-black rounded-[40px] p-12 overflow-hidden flex flex-col justify-center">
        <div className="relative z-10 max-w-2xl">
          <h2 className="text-5xl font-bold text-white mb-4 tracking-tight leading-tight">
            Kebutuhan Laptop <br />
            <span className="text-gray-500 italic font-serif">Sesuai Passion Anda.</span>
          </h2>
          <p className="text-gray-400 text-lg">Mulai langkah Anda dengan perangkat yang tepat. Pilih profil penggunaan Anda di bawah ini.</p>
        </div>
        {/* Background blobs */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gray-900 rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-1/4 w-[200px] h-[200px] bg-white/5 rounded-full blur-[80px]" />
      </section>

      {/* Inputs */}
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div>
            <div className="flex items-center justify-between mb-6">
               <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">Pilih Kategori Penggunaan</h3>
               {profile && (
                 <span className="text-xs font-bold text-black border border-black px-2 py-1 rounded">PROFIL AKTIF</span>
               )}
            </div>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              {usageProfiles.map((p) => {
                const Icon = p.icon;
                return (
                  <button
                    key={p.id}
                    onClick={() => setProfile(p.id)}
                    className={cn(
                      "p-6 rounded-[24px] border-2 text-left transition-all group",
                      profile === p.id 
                        ? "bg-black border-black text-white" 
                        : "bg-white border-gray-100 hover:border-gray-200"
                    )}
                  >
                    <div className={cn(
                      "w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-colors",
                      profile === p.id ? "bg-white text-black" : "bg-gray-50 text-gray-400 group-hover:bg-black group-hover:text-white"
                    )}>
                      <Icon size={24} />
                    </div>
                    <h4 className="font-bold mb-1">{p.name}</h4>
                    <p className={cn("text-xs leading-relaxed", profile === p.id ? "text-gray-400" : "text-gray-400")}>
                      {p.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
             <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6">Filter Budget Maksimal</h3>
             <div className="flex flex-wrap gap-3">
               {budgetFilters.map((f) => (
                 <button
                   key={f.label}
                   onClick={() => setBudget(f.value)}
                   className={cn(
                     "px-6 py-3 rounded-full text-sm font-bold border-2 transition-all",
                     budget === f.value 
                       ? "bg-black border-black text-white" 
                       : "bg-white border-gray-100 text-gray-500 hover:border-gray-300"
                   )}
                 >
                   {f.label}
                 </button>
               ))}
             </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-100 rounded-[32px] p-8 h-full flex flex-col justify-between">
            <div>
              <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-black mb-6">
                <Zap size={28} />
              </div>
              <h3 className="text-2xl font-bold mb-4 tracking-tight">Siap Hitung?</h3>
              <p className="text-sm text-gray-500 leading-relaxed mb-8">
                Sistem akan memproses data {laptops.length} laptop menggunakan metode **Simple Additive Weighting (SAW)** 
                berdasarkan kriteria yang telah ditentukan.
              </p>
              
              <ul className="space-y-4 mb-8">
                {['Normalisasi Matriks', 'Pembobotan Kriteria', 'Pemeringkatan Teratur'].map((step, i) => (
                  <li key={i} className="flex items-center gap-3 text-xs font-bold text-gray-400 uppercase tracking-widest">
                    <CheckCircle2 size={16} className={profile ? "text-black" : "text-gray-200"} />
                    {step}
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={handleRecommend}
              disabled={!profile || loading}
              className="w-full h-16 bg-black text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-30 disabled:hover:scale-100"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Dapatkan Rekomendasi <ChevronRight size={20} /></>
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
            className="space-y-10 border-t border-gray-100 pt-16"
          >
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <h3 className="text-4xl font-bold tracking-tight mb-2">Hasil Rekomendasi</h3>
                <p className="text-gray-500 max-w-xl">
                  Berdasarkan algoritma SAW, berikut adalah laptop yang paling cocok untuk kategori **{usageProfiles.find(u => u.id === profile)?.name}**.
                </p>
              </div>
              <div className="bg-gray-50 px-6 py-3 rounded-2xl border border-gray-100 flex items-center gap-3">
                <TrendingUp size={20} className="text-green-600" />
                <span className="text-xs font-bold uppercase tracking-wider text-gray-600">Terbaik: {results[0].brand} {results[0].model}</span>
              </div>
            </div>

            {/* Chart */}
            <div className="bg-white border border-gray-100 rounded-[32px] p-8">
              <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-8 flex items-center gap-2">
                <ChartIcon size={16} /> Grafik Kecocokan (%)
              </h4>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={results.slice(0, 5)}>
                    <CartesianGrid strokeDasharray="1 1" vertical={false} stroke="#E5E7EB" />
                    <XAxis 
                      dataKey="model" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 10, fontWeight: 700, fill: '#9CA3AF' }}
                      dy={10}
                    />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9CA3AF' }} domain={[0, 100]} />
                    <RechartsTooltip 
                      cursor={{ fill: '#F9FAFB' }}
                      contentStyle={{ borderRadius: '16px', border: '1px solid #E5E7EB', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                    />
                    <Bar dataKey="matchPercentage" radius={[8, 8, 0, 0]}>
                      {results.slice(0, 5).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index === 0 ? '#000000' : '#E5E7EB'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Laptop List */}
            <div className="space-y-6">
               <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">Peringkat & Alasan</h3>
               <div className="grid gap-6">
                 {results.slice(0, 5).map((l, i) => (
                   <motion.div
                    key={l.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="group bg-white border border-gray-100 rounded-[32px] p-6 hover:border-black transition-all"
                   >
                     <div className="flex flex-col lg:flex-row gap-8">
                        {/* Image */}
                        <div className="w-full lg:w-48 h-48 bg-gray-50 rounded-2xl overflow-hidden relative">
                           <img src={l.image_url} alt={l.model} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                           <div className="absolute top-3 left-3 w-8 h-8 bg-black/80 backdrop-blur text-white font-bold rounded-lg flex items-center justify-center text-sm">
                             {i + 1}
                           </div>
                        </div>

                        {/* Info */}
                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <div className="flex items-center justify-between mb-4">
                              <div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{l.brand}</span>
                                <h4 className="text-xl font-bold tracking-tight text-gray-900 leading-none">{l.model}</h4>
                              </div>
                              <div className="text-right">
                                <div className="text-2xl font-black text-black">{l.matchPercentage}%</div>
                                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Similarity Score</div>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                               <div className="p-3 bg-gray-50 rounded-xl">
                                 <div className="text-[10px] uppercase font-bold text-gray-400 mb-1">RAM</div>
                                 <div className="flex items-center gap-2 font-bold text-xs"><Smartphone size={14} /> {l.ram}GB</div>
                               </div>
                               <div className="p-3 bg-gray-50 rounded-xl">
                                 <div className="text-[10px] uppercase font-bold text-gray-400 mb-1">Storage</div>
                                 <div className="flex items-center gap-2 font-bold text-xs"><HardDrive size={14} /> {l.storage}GB</div>
                               </div>
                               <div className="p-3 bg-gray-50 rounded-xl">
                                 <div className="text-[10px] uppercase font-bold text-gray-400 mb-1">Batre</div>
                                 <div className="flex items-center gap-2 font-bold text-xs"><Zap size={14} /> {l.battery}Wh</div>
                               </div>
                               <div className="p-3 bg-gray-50 rounded-xl">
                                 <div className="text-[10px] uppercase font-bold text-gray-400 mb-1">Harga</div>
                                 <div className="flex items-center gap-1 font-bold text-xs text-black">{formatCurrency(l.price)}</div>
                               </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between border-t border-gray-50 pt-6">
                             <div className="flex items-center gap-2 text-xs font-medium text-gray-500 italic">
                               <Info size={14} />
                               {i === 0 ? "Pilihan ideal karena optimasi pada bobot utama." : "Alternatif bagus dengan keseimbangan performa/harga."}
                             </div>
                             <div className="font-bold text-sm bg-gray-50 px-4 py-2 rounded-xl text-gray-400">
                               SCORE: {l.score}
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
