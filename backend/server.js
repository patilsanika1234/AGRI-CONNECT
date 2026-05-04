import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Database from 'better-sqlite3';
import cron from 'node-cron';
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

// Database setup
const db = new Database(join(__dirname, 'data', 'agriconnect.db'));

// Initialize database tables
const initDatabase = () => {
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
    
    CREATE INDEX IF NOT EXISTS idx_prices_crop ON historical_prices(crop);
    CREATE INDEX IF NOT EXISTS idx_prices_market ON historical_prices(market);
    CREATE INDEX IF NOT EXISTS idx_prices_date ON historical_prices(arrival_date);
    CREATE INDEX IF NOT EXISTS idx_prices_crop_market_date ON historical_prices(crop, market, arrival_date);
    
    CREATE TABLE IF NOT EXISTS ml_models (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      crop TEXT NOT NULL,
      market TEXT NOT NULL,
      model_data BLOB NOT NULL,
      trained_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      accuracy REAL,
      last_trained_date TEXT
    );
    
    CREATE INDEX IF NOT EXISTS idx_models_crop_market ON ml_models(crop, market);
    
    CREATE TABLE IF NOT EXISTS predictions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      crop TEXT NOT NULL,
      market TEXT NOT NULL,
      state TEXT NOT NULL,
      predicted_price REAL NOT NULL,
      confidence REAL,
      prediction_date TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    
    CREATE INDEX IF NOT EXISTS idx_predictions_crop_market ON predictions(crop, market);
  `);
  console.log('Database initialized');
};

initDatabase();

// Import routes
import priceRoutes from './routes/prices.js';
import predictionRoutes from './routes/predictions.js';
import dataCollectionRoutes from './routes/dataCollection.js';

// Use routes
app.use('/api/prices', priceRoutes);
app.use('/api/predictions', predictionRoutes);
app.use('/api/data', dataCollectionRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Get database stats
app.get('/api/stats', (req, res) => {
  try {
    const priceCount = db.prepare('SELECT COUNT(*) as count FROM historical_prices').get();
    const cropCount = db.prepare('SELECT COUNT(DISTINCT crop) as count FROM historical_prices').get();
    const marketCount = db.prepare('SELECT COUNT(DISTINCT market) as count FROM historical_prices').get();
    const modelCount = db.prepare('SELECT COUNT(*) as count FROM ml_models').get();
    
    res.json({
      totalPriceRecords: priceCount.count,
      uniqueCrops: cropCount.count,
      uniqueMarkets: marketCount.count,
      trainedModels: modelCount.count
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api`);
});

export { db };
