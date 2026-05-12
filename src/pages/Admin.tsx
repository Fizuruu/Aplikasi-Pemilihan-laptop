import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit3, Save, X, HardDrive, Smartphone, Zap, Monitor, DollarSign, Image as ImageIcon, Database, Scale, AlertCircle, Calculator, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../App';
import { Laptop, Criterion } from '../types';
import { cn, formatCurrency } from '../lib/utils';

export default function Admin() {
  const { token } = useAuth();
  const [laptops, setLaptops] = useState<Laptop[]>([]);
  const [criteria, setCriteria] = useState<Criterion[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Calculator State
  const [showCalculator, setShowCalculator] = useState<{type: 'cpu' | 'gpu', visible: boolean}>({ type: 'cpu', visible: false });
  const [calcInputs, setCalcInputs] = useState({
    cpu: { cores: 4, threads: 8, baseSpeed: 2.4, boostSpeed: 4.2 },
    gpu: { vram: 4, tgp: 60, busWidth: 128 }
  });

  // Form State
  const [newLaptop, setNewLaptop] = useState({
    brand: '', model: '', price: 0, ram: 8, cpu_score: 50, gpu_score: 50, storage: 256, battery: 40, weight: 1.5, image_url: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [lpRes, crRes] = await Promise.all([
      fetch('/api/laptops'),
      fetch('/api/criteria')
    ]);
    setLaptops(await lpRes.json());
    setCriteria(await crRes.json());
  };

  const calculateScore = () => {
    if (showCalculator.type === 'cpu') {
      const { cores, threads, baseSpeed, boostSpeed } = calcInputs.cpu;
      const score = Math.min(100, Math.round((cores * 4) + (threads * 1.5) + (baseSpeed * 5) + (boostSpeed * 8)));
      setNewLaptop({ ...newLaptop, cpu_score: score });
    } else {
      const { vram, tgp, busWidth } = calcInputs.gpu;
      const score = Math.min(100, Math.round((vram * 6) + (tgp * 0.5) + (busWidth * 0.15)));
      setNewLaptop({ ...newLaptop, gpu_score: score });
    }
    setShowCalculator({ ...showCalculator, visible: false });
  };

  const handleAddLaptop = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/laptops', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newLaptop),
      });
      if (res.ok) {
        setIsAdding(false);
        fetchData();
        setNewLaptop({ brand: '', model: '', price: 0, ram: 8, cpu_score: 50, gpu_score: 50, storage: 256, battery: 40, weight: 1.5, image_url: '' });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Hapus laptop ini?')) return;
    await fetch(`/api/laptops/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    fetchData();
  };

  const updateWeight = async (code: string, weight: number) => {
    await fetch(`/api/criteria/${code}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ weight }),
    });
    fetchData();
  };

  return (
    <div className="space-y-12 font-sans pb-20">
      {/* Criteria Section */}
      <section className="glass-card rounded-[32px] p-10 border-none relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/5 blur-[100px]" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 relative z-10 text-[var(--text-primary)]">
          <div>
            <div className="inline-block px-3 py-1 bg-brand-primary/10 border border-brand-primary/20 text-brand-primary rounded-full text-[10px] font-bold uppercase tracking-widest mb-4">
              Decision Configuration
            </div>
            <h2 className="text-4xl font-extrabold tracking-tight mb-2">Bobot Kriteria</h2>
            <p className="text-[var(--text-secondary)] text-sm font-medium">Pengaturan prioritas penilaian untuk algoritma penentuan unit.</p>
          </div>
          <div className="bg-[var(--main-bg)] border border-[var(--border-color)] px-6 py-4 rounded-2xl flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary">
              <Scale size={20} />
            </div>
            <div>
              <div className="text-[var(--text-primary)] font-bold text-lg">{criteria.reduce((sum, c) => sum + c.weight, 0)}%</div>
              <div className="text-[var(--text-secondary)] text-[10px] font-bold uppercase tracking-widest">Total Sinc</div>
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-5 relative z-10">
           {criteria.map((c) => (
             <div key={c.id} className="bg-[var(--surface-lighter)] border border-[var(--border-color)] rounded-2xl p-6 hover:border-brand-primary/30 transition-all">
                <div className="text-[10px] uppercase font-bold text-[var(--text-secondary)] mb-2 tracking-widest">{c.code}</div>
                <div className="font-bold text-xs mb-4 text-[var(--text-primary)] uppercase truncate">{c.name}</div>
                <div className="relative mb-4">
                  <input 
                    type="number" 
                    value={c.weight}
                    onChange={(e) => updateWeight(c.code, Number(e.target.value))}
                    className="w-full bg-[var(--surface)] border border-[var(--border-color)] rounded-xl px-4 py-3 font-bold text-sm text-[var(--text-primary)] focus:border-brand-primary outline-none transition-all pr-10"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-[var(--text-secondary)]">%</span>
                </div>
                <div className={cn(
                  "text-[9px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border",
                  c.type === 'benefit' ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-brand-secondary/10 text-brand-secondary border-brand-secondary/20"
                )}>
                  {c.type}
                </div>
             </div>
           ))}
        </div>
      </section>

      {/* Laptops Section */}
      <section className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-4">
          <div>
            <div className="text-brand-primary text-[10px] font-bold uppercase tracking-widest mb-3">Inventory Sync</div>
            <h2 className="text-4xl font-extrabold tracking-tight text-[var(--text-primary)]">Database Laptop</h2>
          </div>
          <button
            onClick={() => setIsAdding(!isAdding)}
            className="btn-primary px-8 py-4 h-auto text-sm"
          >
            {isAdding ? <><X size={18} /> Batalkan Input</> : <><Plus size={18} /> Daftarkan Unit Baru</>}
          </button>
        </div>

        {isAdding && (
          <div className="bg-[var(--surface)] border border-[var(--border-color)] rounded-[32px] p-10 animate-in fade-in slide-in-from-top-4 relative overflow-hidden shadow-2xl">
             <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/5 blur-[80px] rounded-full" />
             
             <form onSubmit={handleAddLaptop} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 relative z-10">
                <div className="space-y-2 lg:col-span-1">
                   <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)] ml-1">Brand</label>
                   <input type="text" value={newLaptop.brand} onChange={e => setNewLaptop({...newLaptop, brand: e.target.value})} className="input-field" required />
                </div>
                <div className="space-y-2 lg:col-span-1">
                   <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)] ml-1">Model Name</label>
                   <input type="text" value={newLaptop.model} onChange={e => setNewLaptop({...newLaptop, model: e.target.value})} className="input-field" required />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)] ml-1">Price (IDR)</label>
                   <input type="number" value={newLaptop.price} onChange={e => setNewLaptop({...newLaptop, price: parseInt(e.target.value)})} className="input-field" required />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)] ml-1">RAM (GB)</label>
                   <input type="number" value={newLaptop.ram} onChange={e => setNewLaptop({...newLaptop, ram: parseInt(e.target.value)})} className="input-field" required />
                </div>
                <div className="space-y-2">
                   <div className="flex items-center justify-between ml-1">
                     <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)]">CPU Score</label>
                     <button type="button" onClick={() => setShowCalculator({type: 'cpu', visible: true})} className="text-[10px] text-brand-primary font-bold hover:underline flex items-center gap-1">
                       <Calculator size={10} /> Hitung
                     </button>
                   </div>
                   <input type="number" value={newLaptop.cpu_score} onChange={e => setNewLaptop({...newLaptop, cpu_score: parseInt(e.target.value)})} className="input-field" required />
                </div>
                <div className="space-y-2">
                   <div className="flex items-center justify-between ml-1">
                     <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)]">GPU Score</label>
                     <button type="button" onClick={() => setShowCalculator({type: 'gpu', visible: true})} className="text-[10px] text-brand-primary font-bold hover:underline flex items-center gap-1">
                       <Calculator size={10} /> Hitung
                     </button>
                   </div>
                   <input type="number" value={newLaptop.gpu_score} onChange={e => setNewLaptop({...newLaptop, gpu_score: parseInt(e.target.value)})} className="input-field" required />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)] ml-1">Storage (GB)</label>
                   <input type="number" value={newLaptop.storage} onChange={e => setNewLaptop({...newLaptop, storage: parseInt(e.target.value)})} className="input-field" required />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)] ml-1">Battery (Wh)</label>
                   <input type="number" value={newLaptop.battery} onChange={e => setNewLaptop({...newLaptop, battery: parseInt(e.target.value)})} className="input-field" required />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)] ml-1">Weight (Kg)</label>
                   <input type="number" step="0.1" value={newLaptop.weight} onChange={e => setNewLaptop({...newLaptop, weight: parseFloat(e.target.value)})} className="input-field" required />
                </div>
                <div className="space-y-2 lg:col-span-2">
                   <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)] ml-1">Image URL</label>
                   <input type="text" value={newLaptop.image_url} onChange={e => setNewLaptop({...newLaptop, image_url: e.target.value})} className="input-field" placeholder="https://..." required />
                </div>
                <div className="lg:col-span-5 flex justify-end gap-5 mt-6 pt-6 border-t border-[var(--border-color)]">
                   <button type="submit" disabled={loading} className="btn-primary px-12 h-14 text-sm shadow-2xl">
                     {loading ? 'Processing...' : 'Daftarkan Perangkat'}
                   </button>
                </div>
             </form>

             {/* Score Calculator Tool */}
             {showCalculator.visible && (
               <div className="absolute inset-0 z-20 bg-[var(--surface)]/95 flex flex-col items-center justify-center p-12">
                 <div className="max-w-md w-full glass-card p-10 rounded-[32px] relative">
                    <button onClick={() => setShowCalculator({...showCalculator, visible: false})} className="absolute top-6 right-6 text-[var(--text-secondary)] hover:text-red-500">
                      <X size={20} />
                    </button>
                    <div className="flex items-center gap-4 mb-8">
                       <div className="w-12 h-12 bg-brand-primary/10 rounded-2xl flex items-center justify-center text-brand-primary">
                         <Calculator size={24} />
                       </div>
                       <div>
                         <h4 className="text-xl font-bold text-[var(--text-primary)]">Kalkulator {showCalculator.type.toUpperCase()}</h4>
                         <p className="text-xs text-[var(--text-secondary)] font-medium uppercase tracking-widest">Generate Score Otomatis</p>
                       </div>
                    </div>

                    <div className="space-y-6">
                      {showCalculator.type === 'cpu' ? (
                        <>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="text-[10px] font-bold uppercase text-[var(--text-secondary)]">Cores</label>
                              <input type="number" value={calcInputs.cpu.cores} onChange={e => setCalcInputs({...calcInputs, cpu: {...calcInputs.cpu, cores: parseInt(e.target.value)}})} className="input-field" />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] font-bold uppercase text-[var(--text-secondary)]">Threads</label>
                              <input type="number" value={calcInputs.cpu.threads} onChange={e => setCalcInputs({...calcInputs, cpu: {...calcInputs.cpu, threads: parseInt(e.target.value)}})} className="input-field" />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="text-[10px] font-bold uppercase text-[var(--text-secondary)]">Base Clk (GHz)</label>
                              <input type="number" step="0.1" value={calcInputs.cpu.baseSpeed} onChange={e => setCalcInputs({...calcInputs, cpu: {...calcInputs.cpu, baseSpeed: parseFloat(e.target.value)}})} className="input-field" />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] font-bold uppercase text-[var(--text-secondary)]">Boost Clk (GHz)</label>
                              <input type="number" step="0.1" value={calcInputs.cpu.boostSpeed} onChange={e => setCalcInputs({...calcInputs, cpu: {...calcInputs.cpu, boostSpeed: parseFloat(e.target.value)}})} className="input-field" />
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase text-[var(--text-secondary)]">VRAM (GB)</label>
                            <input type="number" value={calcInputs.gpu.vram} onChange={e => setCalcInputs({...calcInputs, gpu: {...calcInputs.gpu, vram: parseInt(e.target.value)}})} className="input-field" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase text-[var(--text-secondary)]">TGP (Watt)</label>
                            <input type="number" value={calcInputs.gpu.tgp} onChange={e => setCalcInputs({...calcInputs, gpu: {...calcInputs.gpu, tgp: parseInt(e.target.value)}})} className="input-field" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase text-[var(--text-secondary)]">Bus Width (Bit)</label>
                            <input type="number" value={calcInputs.gpu.busWidth} onChange={e => setCalcInputs({...calcInputs, gpu: {...calcInputs.gpu, busWidth: parseInt(e.target.value)}})} className="input-field" />
                          </div>
                        </>
                      )}

                      <button onClick={calculateScore} className="w-full btn-primary mt-4 flex items-center justify-center gap-2">
                        <CheckCircle2 size={18} /> Terapkan Skor
                      </button>
                    </div>
                 </div>
               </div>
             )}
          </div>
        )}

        <div className="overflow-x-auto bg-[var(--surface)] border border-[var(--border-color)] rounded-[32px] shadow-2xl">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-[var(--border-color)]">
                <th className="px-8 py-6 text-left text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)]">Unit Model</th>
                <th className="px-8 py-6 text-left text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)]">Harga</th>
                <th className="px-8 py-6 text-left text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)]">Spesifikasi Teknik</th>
                <th className="px-8 py-6 text-left text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)]">Performa</th>
                <th className="px-8 py-6 text-right text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)]">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-color)]">
              {laptops.map((l) => (
                <tr key={l.id} className="hover:bg-brand-primary/[0.02] transition-colors group">
                  <td className="px-8 py-6">
                     <div className="flex items-center gap-5">
                       <div className="w-14 h-14 rounded-2xl border border-[var(--border-color)] overflow-hidden bg-[var(--main-bg)] flex-shrink-0">
                         <img src={l.image_url} alt={l.model} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                       </div>
                       <div>
                         <div className="font-bold text-sm text-[var(--text-primary)] tracking-tight">{l.model}</div>
                         <div className="text-[10px] font-bold text-[var(--text-secondary)] uppercase">{l.brand}</div>
                       </div>
                     </div>
                  </td>
                  <td className="px-8 py-6">
                     <div className="font-bold text-sm text-emerald-500">{formatCurrency(l.price)}</div>
                  </td>
                  <td className="px-8 py-6">
                     <div className="flex flex-wrap gap-2">
                       <span className="bg-[var(--surface-lighter)] text-[var(--text-secondary)] text-[10px] font-bold px-3 py-1 rounded-full border border-[var(--border-color)]">{l.ram}GB RAM</span>
                       <span className="bg-[var(--surface-lighter)] text-[var(--text-secondary)] text-[10px] font-bold px-3 py-1 rounded-full border border-[var(--border-color)]">{l.storage}GB SSD</span>
                       <span className="bg-[var(--surface-lighter)] text-[var(--text-secondary)] text-[10px] font-bold px-3 py-1 rounded-full border border-[var(--border-color)]">{l.battery}Wh</span>
                       <span className="bg-[var(--surface-lighter)] text-[var(--text-secondary)] text-[10px] font-bold px-3 py-1 rounded-full border border-[var(--border-color)]">{l.weight}Kg</span>
                     </div>
                  </td>
                  <td className="px-8 py-6">
                     <div className="flex flex-col gap-3 min-w-[120px]">
                       <div className="flex items-center gap-3">
                         <span className="text-[10px] font-bold text-[var(--text-secondary)] w-4 text-xs">C:</span>
                         <div className="h-1.5 flex-1 bg-[var(--main-bg)] rounded-full overflow-hidden">
                           <div className="h-full bg-brand-primary" style={{ width: `${l.cpu_score}%` }}></div>
                         </div>
                       </div>
                       <div className="flex items-center gap-3">
                         <span className="text-[10px] font-bold text-[var(--text-secondary)] w-4 text-xs">G:</span>
                         <div className="h-1.5 flex-1 bg-[var(--main-bg)] rounded-full overflow-hidden">
                           <div className="h-full bg-brand-secondary" style={{ width: `${l.gpu_score}%` }}></div>
                         </div>
                       </div>
                     </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button 
                      onClick={() => handleDelete(l.id)}
                      className="p-3 text-[var(--text-secondary)] hover:text-red-500 hover:bg-red-500/10 rounded-2xl transition-all"
                    >
                      <Trash2 size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
