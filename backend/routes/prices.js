import { Router } from 'express';
import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = Router();
const db = new Database(join(__dirname, '..', 'data', 'agriconnect.db'));

// Get historical prices for a crop/market
router.get('/historical/:crop/:market', (req, res) => {
  try {
    const { crop, market } = req.params;
    const { days = 30 } = req.query;
    
    const stmt = db.prepare(`
      SELECT * FROM historical_prices 
      WHERE crop = ? AND market = ? 
      AND arrival_date >= date('now', '-${days} days')
      ORDER BY arrival_date DESC
    `);
    
    const prices = stmt.all(crop, market);
    res.json(prices);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get today's price (display - from API directly)
router.get('/today/:crop/:market', async (req, res) => {
  try {
    const { crop, market } = req.params;
    const { state } = req.query;
    
    // Fetch from Agmarknet API directly
    const response = await fetch(
      `https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?` +
      `api-key=579b464db66ec23bdd000001cdd3946e44ce4aad7209ff7b23ac571b&` +
      `format=json&limit=1&filters[commodity]=${encodeURIComponent(crop)}&` +
      `filters[market]=${encodeURIComponent(market)}&filters[state]=${encodeURIComponent(state || '')}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch from Agmarknet');
    }
    
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get price trends
router.get('/trends/:crop/:market', (req, res) => {
  try {
    const { crop, market } = req.params;
    const { days = 30 } = req.query;
    
    const stmt = db.prepare(`
      SELECT 
        arrival_date,
        AVG(price) as avg_price,
        MIN(price) as min_price,
        MAX(price) as max_price,
        COUNT(*) as records
      FROM historical_prices 
      WHERE crop = ? AND market = ? 
      AND arrival_date >= date('now', '-${days} days')
      GROUP BY arrival_date
      ORDER BY arrival_date DESC
    `);
    
    const trends = stmt.all(crop, market);
    res.json(trends);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all crops
router.get('/crops', (req, res) => {
  try {
    const stmt = db.prepare('SELECT DISTINCT crop FROM historical_prices ORDER BY crop');
    const crops = stmt.all().map(row => row.crop);
    res.json(crops);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all markets for a crop
router.get('/markets/:crop', (req, res) => {
  try {
    const { crop } = req.params;
    const stmt = db.prepare('SELECT DISTINCT market FROM historical_prices WHERE crop = ? ORDER BY market');
    const markets = stmt.all(crop).map(row => row.market);
    res.json(markets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
