import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database('spk_laptop.db');
const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-delta';

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    password TEXT,
    role TEXT DEFAULT 'mahasiswa'
  );

  CREATE TABLE IF NOT EXISTS laptops (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    brand TEXT,
    model TEXT,
    price INTEGER,
    ram INTEGER,
    cpu_score INTEGER,
    gpu_score INTEGER,
    storage INTEGER,
    battery INTEGER,
    weight REAL,
    image_url TEXT
  );

  CREATE TABLE IF NOT EXISTS criteria (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code TEXT UNIQUE,
    name TEXT,
    type TEXT, -- 'benefit' or 'cost'
    weight REAL
  );

  CREATE TABLE IF NOT EXISTS recommendations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    profile TEXT,
    results TEXT, -- JSON
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Seed initial data if empty
const seedLaptops = () => {
  const count = db.prepare('SELECT COUNT(*) as count FROM laptops').get() as { count: number };
  if (count.count === 0) {
    const laptops = [
      ['Asus', 'VivoBook Go 14', 6000000, 8, 40, 30, 256, 42, 1.3, 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400&q=80'],
      ['Lenovo', 'Ideapad Slim 3', 7500000, 8, 55, 40, 512, 45, 1.4, 'https://images.unsplash.com/photo-1544731612-de7f96afe55f?w=400&q=80'],
      ['Acer', 'Swift 3', 9500000, 16, 70, 50, 512, 50, 1.2, 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&q=80'],
      ['MacBook', 'Air M1', 12500000, 8, 85, 70, 256, 100, 1.29, 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=400&q=80'],
      ['ROG', 'Zephyrus G14', 18000000, 16, 95, 90, 1000, 76, 1.6, 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&q=80'],
      ['HP', 'Victus 15', 11000000, 16, 75, 80, 512, 70, 2.3, 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=400&q=80'],
    ];
    const stmt = db.prepare('INSERT INTO laptops (brand, model, price, ram, cpu_score, gpu_score, storage, battery, weight, image_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
    laptops.forEach(laptop => stmt.run(...laptop));
  }
};

const seedCriteria = () => {
  const count = db.prepare('SELECT COUNT(*) as count FROM criteria').get() as { count: number };
  if (count.count === 0) {
    const criteria = [
      ['C1', 'Harga', 'cost', 20],
      ['C2', 'RAM', 'benefit', 15],
      ['C3', 'Processor', 'benefit', 20],
      ['C4', 'VGA/GPU', 'benefit', 15],
      ['C5', 'Storage', 'benefit', 10],
      ['C6', 'Baterai', 'benefit', 10],
      ['C7', 'Berat', 'cost', 10],
    ];
    const stmt = db.prepare('INSERT INTO criteria (code, name, type, weight) VALUES (?, ?, ?, ?)');
    criteria.forEach(c => stmt.run(...c));
  }
};

const seedAdmin = async () => {
  const admin = db.prepare('SELECT * FROM users WHERE email = ?').get('admin@laptopsystem.com');
  if (!admin) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    db.prepare('INSERT INTO users (email, password, role) VALUES (?, ?, ?)').run('admin@laptopsystem.com', hashedPassword, 'admin');
  }
};

seedLaptops();
seedCriteria();
seedAdmin();

async function startServer() {
  const app = express();
  app.use(express.json());

  // Auth Middleware
  const authenticate = (req: any, res: any, next: any) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Unauthorized' });
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
      next();
    } catch (err) {
      res.status(401).json({ error: 'Invalid token' });
    }
  };

  const isAdmin = (req: any, res: any, next: any) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
    next();
  };

  // Auth Routes
  app.post('/api/auth/register', async (req, res) => {
    const { email, password } = req.body;
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const result = db.prepare('INSERT INTO users (email, password) VALUES (?, ?)').run(email, hashedPassword);
      res.json({ id: result.lastInsertRowid });
    } catch (err: any) {
      res.status(400).json({ error: 'Email already exists' });
    }
  });

  app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email) as any;
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET);
    res.json({ token, user: { id: user.id, email: user.email, role: user.role } });
  });

  // Laptop Routes
  app.get('/api/laptops', (req, res) => {
    const laptops = db.prepare('SELECT * FROM laptops').all();
    res.json(laptops);
  });

  app.post('/api/laptops', authenticate, isAdmin, (req, res) => {
    const { brand, model, price, ram, cpu_score, gpu_score, storage, battery, weight, image_url } = req.body;
    const stmt = db.prepare(`
      INSERT INTO laptops (brand, model, price, ram, cpu_score, gpu_score, storage, battery, weight, image_url)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const result = stmt.run(brand, model, price, ram, cpu_score, gpu_score, storage, battery, weight, image_url);
    res.json({ id: result.lastInsertRowid });
  });

  app.delete('/api/laptops/:id', authenticate, isAdmin, (req, res) => {
    db.prepare('DELETE FROM laptops WHERE id = ?').run(req.params.id);
    res.json({ success: true });
  });

  // Criteria & Weights
  app.get('/api/criteria', (req, res) => {
    const criteria = db.prepare('SELECT * FROM criteria').all();
    res.json(criteria);
  });

  app.put('/api/criteria/:code', authenticate, isAdmin, (req, res) => {
    const { weight } = req.body;
    db.prepare('UPDATE criteria SET weight = ? WHERE code = ?').run(weight, req.params.code);
    res.json({ success: true });
  });

  // SPK Calculation (SAW)
  app.post('/api/recommend', authenticate, (req: any, res: any) => {
    const { profile, maxBudget } = req.body; // profile: 'programming', 'gaming', etc.
    const budget = maxBudget || 20000000;

    const laptops = db.prepare('SELECT * FROM laptops WHERE price <= ?').all(budget) as any[];
    const criteria = db.prepare('SELECT * FROM criteria').all() as any[];

    if (laptops.length === 0) return res.json({ results: [] });

    // Profile weights overrides
    const weights: Record<string, number> = {};
    criteria.forEach(c => weights[c.code] = c.weight);

    // Dynamic adjustment based on profile
    if (profile === 'programming') {
      weights['C2'] += 10; weights['C3'] += 10; weights['C1'] -= 10; weights['C4'] -= 10;
    } else if (profile === 'gaming') {
      weights['C4'] += 15; weights['C3'] += 5; weights['C7'] -= 10; weights['C6'] -= 10;
    } else if (profile === 'design') {
      weights['C4'] += 10; weights['C2'] += 10;
    } else if (profile === 'office') {
       weights['C7'] += 10; weights['C6'] += 10; weights['C4'] -= 20;
    }

    // Step 1: Find Min/Max for each criterion
    const bounds: Record<string, { min: number, max: number }> = {};
    const cols = ['price', 'ram', 'cpu_score', 'gpu_score', 'storage', 'battery', 'weight'];
    const codes = ['C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7'];

    codes.forEach((code, i) => {
      const col = cols[i];
      const values = laptops.map(l => l[col]);
      bounds[code] = {
        min: Math.min(...values),
        max: Math.max(...values)
      };
    });

    // Step 2 & 3: Normalize and Weighted Sum
    const results = laptops.map(laptop => {
      let score = 0;
      const normalizedValues: Record<string, number> = {};

      codes.forEach((code, i) => {
        const col = cols[i];
        const val = laptop[col];
        const crit = criteria.find(c => c.code === code);
        let normalized = 0;

        if (crit.type === 'benefit') {
          normalized = val / bounds[code].max;
        } else {
          normalized = bounds[code].min / val;
        }
        
        normalizedValues[code] = normalized;
        score += normalized * (weights[code] / 100);
      });

      return {
        ...laptop,
        score: parseFloat(score.toFixed(4)),
        matchPercentage: Math.round(score * 100)
      };
    }).sort((a, b) => b.score - a.score);

    // Save to history
    db.prepare('INSERT INTO recommendations (user_id, profile, results) VALUES (?, ?, ?)').run(
      req.user.id, profile, JSON.stringify(results.slice(0, 5))
    );

    res.json({ results, weights });
  });

  app.get('/api/history', authenticate, (req: any, res: any) => {
    const history = db.prepare('SELECT * FROM recommendations WHERE user_id = ? ORDER BY created_at DESC').all(req.user.id);
    res.json(history.map((h: any) => ({ ...h, results: JSON.parse(h.results) })));
  });

  // Vite/Static setup
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(3000, '0.0.0.0', () => {
    console.log('Server running on http://localhost:3000');
  });
}

startServer();
