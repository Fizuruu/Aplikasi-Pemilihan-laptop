export interface User {
  id: number;
  email: string;
  role: 'admin' | 'mahasiswa';
}

export interface Laptop {
  id: number;
  brand: string;
  model: string;
  price: number;
  ram: number;
  cpu_score: number;
  gpu_score: number;
  storage: number;
  battery: number;
  weight: number;
  image_url: string;
  score?: number;
  matchPercentage?: number;
}

export interface Criterion {
  id: number;
  code: string;
  name: string;
  type: 'benefit' | 'cost';
  weight: number;
}

export interface HistoryItem {
  id: number;
  profile: string;
  results: Laptop[];
  created_at: string;
}
