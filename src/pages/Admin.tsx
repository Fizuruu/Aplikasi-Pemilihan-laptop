import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit3, Save, X, HardDrive, Smartphone, Zap, Monitor, DollarSign, Image as ImageIcon, Database, Scale, AlertCircle } from 'lucide-react';
import { useAuth } from '../App';
import { Laptop, Criterion } from '../types';
import { cn, formatCurrency } from '../lib/utils';

export default function Admin() {
  const { token } = useAuth();
  const [laptops, setLaptops] = useState<Laptop[]>([]);
  const [criteria, setCriteria] = useState<Criterion[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(false);

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
    <div className="space-y-12">
      {/* Criteria Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Kriteria & Bobot Global</h2>
            <p className="text-sm text-gray-500">Sesuaikan bobot dasar untuk perhitungan SAW.</p>
          </div>
          <div className="bg-blue-50 text-blue-600 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2">
            <Scale size={16} /> TOTAL: {criteria.reduce((sum, c) => sum + c.weight, 0)}%
          </div>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
           {criteria.map((c) => (
             <div key={c.id} className="bg-white border border-gray-100 rounded-2xl p-4">
                <div className="text-[10px] uppercase font-black text-gray-400 mb-1">{c.code}</div>
                <div className="font-bold text-sm mb-3">{c.name}</div>
                <div className="relative">
                  <input 
                    type="number" 
                    value={c.weight}
                    onChange={(e) => updateWeight(c.code, Number(e.target.value))}
                    className="w-full bg-gray-50 border-none rounded-lg px-3 py-2 font-mono text-xs focus:ring-1 focus:ring-black outline-none"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-400">%</span>
                </div>
                <div className={cn(
                  "mt-2 text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 rounded inline-block",
                  c.type === 'benefit' ? "bg-green-50 text-green-600" : "bg-orange-50 text-orange-600"
                )}>
                  {c.type}
                </div>
             </div>
           ))}
        </div>
      </section>

      {/* Laptops Section */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Alternatif Laptop</h2>
            <p className="text-sm text-gray-500">Kelola data laptop yang tersedia dalam sistem.</p>
          </div>
          <button
            onClick={() => setIsAdding(!isAdding)}
            className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-2xl font-bold text-sm hover:scale-105 transition-all shadow-lg active:scale-95"
          >
            {isAdding ? <><X size={18} /> Batal</> : <><Plus size={18} /> Tambah Unit</>}
          </button>
        </div>

        {isAdding && (
          <div className="bg-white border-2 border-dashed border-gray-200 rounded-[32px] p-8 mb-8 animate-in fade-in slide-in-from-top-4">
             <form onSubmit={handleAddLaptop} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                <div className="space-y-2 lg:col-span-1">
                   <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Brand</label>
                   <input type="text" value={newLaptop.brand} onChange={e => setNewLaptop({...newLaptop, brand: e.target.value})} className="w-full h-11 border border-gray-100 rounded-xl px-4 text-sm" required />
                </div>
                <div className="space-y-2 lg:col-span-1">
                   <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Model</label>
                   <input type="text" value={newLaptop.model} onChange={e => setNewLaptop({...newLaptop, model: e.target.value})} className="w-full h-11 border border-gray-100 rounded-xl px-4 text-sm" required />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Harga (Rp)</label>
                   <input type="number" value={newLaptop.price} onChange={e => setNewLaptop({...newLaptop, price: parseInt(e.target.value)})} className="w-full h-11 border border-gray-100 rounded-xl px-4 text-sm" required />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">RAM (GB)</label>
                   <input type="number" value={newLaptop.ram} onChange={e => setNewLaptop({...newLaptop, ram: parseInt(e.target.value)})} className="w-full h-11 border border-gray-100 rounded-xl px-4 text-sm" required />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">CPU Score (1-100)</label>
                   <input type="number" value={newLaptop.cpu_score} onChange={e => setNewLaptop({...newLaptop, cpu_score: parseInt(e.target.value)})} className="w-full h-11 border border-gray-100 rounded-xl px-4 text-sm" required />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">GPU Score (1-100)</label>
                   <input type="number" value={newLaptop.gpu_score} onChange={e => setNewLaptop({...newLaptop, gpu_score: parseInt(e.target.value)})} className="w-full h-11 border border-gray-100 rounded-xl px-4 text-sm" required />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Storage (GB)</label>
                   <input type="number" value={newLaptop.storage} onChange={e => setNewLaptop({...newLaptop, storage: parseInt(e.target.value)})} className="w-full h-11 border border-gray-100 rounded-xl px-4 text-sm" required />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Battery (Wh)</label>
                   <input type="number" value={newLaptop.battery} onChange={e => setNewLaptop({...newLaptop, battery: parseInt(e.target.value)})} className="w-full h-11 border border-gray-100 rounded-xl px-4 text-sm" required />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Weight (kg)</label>
                   <input type="number" step="0.1" value={newLaptop.weight} onChange={e => setNewLaptop({...newLaptop, weight: parseFloat(e.target.value)})} className="w-full h-11 border border-gray-100 rounded-xl px-4 text-sm" required />
                </div>
                <div className="space-y-2 lg:col-span-2">
                   <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Image URL</label>
                   <input type="text" value={newLaptop.image_url} onChange={e => setNewLaptop({...newLaptop, image_url: e.target.value})} className="w-full h-11 border border-gray-100 rounded-xl px-4 text-sm" placeholder="https://..." required />
                </div>
                <div className="lg:col-span-5 flex justify-end gap-3 mt-4">
                   <button type="submit" disabled={loading} className="px-10 h-11 bg-black text-white rounded-xl font-bold text-sm disabled:opacity-50">
                     Simpan Data
                   </button>
                </div>
             </form>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full bg-white border border-gray-100 rounded-[32px] overflow-hidden">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4 text-left text-[10px] font-black tracking-widest text-gray-400 uppercase">Unit</th>
                <th className="px-6 py-4 text-left text-[10px] font-black tracking-widest text-gray-400 uppercase">Harga</th>
                <th className="px-6 py-4 text-left text-[10px] font-black tracking-widest text-gray-400 uppercase">Specs (R/S/B/W)</th>
                <th className="px-6 py-4 text-left text-[10px] font-black tracking-widest text-gray-400 uppercase">Score (C/G)</th>
                <th className="px-6 py-4 text-right text-[10px] font-black tracking-widest text-gray-400 uppercase">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {laptops.map((l) => (
                <tr key={l.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                     <div className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100">
                         <img src={l.image_url} alt={l.model} className="w-full h-full object-cover" />
                       </div>
                       <div>
                         <div className="font-bold text-gray-900">{l.model}</div>
                         <div className="text-[10px] font-bold text-gray-400 uppercase">{l.brand}</div>
                       </div>
                     </div>
                  </td>
                  <td className="px-6 py-4">
                     <div className="font-mono text-xs font-bold text-black">{formatCurrency(l.price)}</div>
                  </td>
                  <td className="px-6 py-4">
                     <div className="flex gap-2 text-[10px] font-bold">
                       <span className="bg-gray-100 px-2 py-0.5 rounded">R: {l.ram}</span>
                       <span className="bg-gray-100 px-2 py-0.5 rounded">S: {l.storage}</span>
                       <span className="bg-gray-100 px-2 py-0.5 rounded">B: {l.battery}</span>
                       <span className="bg-gray-100 px-2 py-0.5 rounded">W: {l.weight}</span>
                     </div>
                  </td>
                  <td className="px-6 py-4">
                     <div className="flex gap-2">
                       <div className="h-1.5 w-16 bg-gray-100 rounded-full overflow-hidden">
                         <div className="h-full bg-blue-500" style={{ width: `${l.cpu_score}%` }}></div>
                       </div>
                       <div className="h-1.5 w-16 bg-gray-100 rounded-full overflow-hidden">
                         <div className="h-full bg-purple-500" style={{ width: `${l.gpu_score}%` }}></div>
                       </div>
                     </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => handleDelete(l.id)}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={18} />
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
