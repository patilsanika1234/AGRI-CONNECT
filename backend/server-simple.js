import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database setup with error handling
let db;
try {
  db = new Database(join(__dirname, 'data', 'agriconnect.db'), { verbose: console.log });
  console.log('✅ Database connected');
} catch (error) {
  console.error('❌ Database connection failed:', error.message);
  process.exit(1);
}

// Simple database initialization
const initDatabase = () => {
  try {
    db.exec(`
      CREATE TABLE IF NOT EXISTS historical_prices (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        crop TEXT NOT NULL,
        market TEXT NOT NULL,
        state TEXT NOT NULL,
        price REAL NOT NULL,
        min_price REAL,
        max_price REAL,
        unit TEXT,
        arrival_date TEXT NOT NULL,
        fetched_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE TABLE IF NOT EXISTS predictions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        crop TEXT NOT NULL,
        market TEXT NOT NULL,
        state TEXT,
        predicted_price REAL NOT NULL,
        confidence REAL,
        prediction_date TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Database initialized');
  } catch (error) {
    console.error('❌ Database initialization failed:', error.message);
  }
};

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'AgriConnect API is running' });
});

app.get('/api/data-count', (req, res) => {
  try {
    const count = db.prepare('SELECT COUNT(*) as count FROM historical_prices').get();
    res.json({ count: count.count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Import routes dynamically
try {
  const predictionsRouter = await import('./routes/predictions.js');
  app.use('/api/predictions', predictionsRouter.default);
  console.log('✅ Predictions routes loaded');
} catch (error) {
  console.error('❌ Failed to load predictions routes:', error.message);
}

// Start server
initDatabase();

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 API available at http://localhost:${PORT}/api`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🔄 Shutting down server...');
  if (db) db.close();
  process.exit(0);
});
