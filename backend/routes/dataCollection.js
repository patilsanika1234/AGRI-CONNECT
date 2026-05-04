import { Router } from 'express';
import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import axios from 'axios';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = Router();
const db = new Database(join(__dirname, '..', 'data', 'agriconnect.db'));

// Agmarknet API configuration
const AGMARKNET_API_KEY = process.env.AGMARKNET_API_KEY || '579b464db66ec23bdd000001cdd3946e44ce4aad7209ff7b23ac571b';
const AGMARKNET_BASE_URL = 'https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070';

// Collect data from Agmarknet API
router.post('/collect', async (req, res) => {
  try {
    const { crops, markets, states, days = 30 } = req.body;
    
    const results = {
      collected: 0,
      errors: [],
      details: []
    };
    
    for (const crop of crops) {
      for (const market of markets) {
        for (const state of states) {
          try {
            // Fetch from Agmarknet
            const response = await axios.get(AGMARKNET_BASE_URL, {
              params: {
                'api-key': AGMARKNET_API_KEY,
                format: 'json',
                limit: 1000,
                filters: {
                  commodity: crop,
                  market: market,
                  state: state
                }
              },
              timeout: 10000
            });
            
            const records = response.data.records || [];
            
            // Insert into database
            const insertStmt = db.prepare(`
              INSERT OR IGNORE INTO historical_prices 
              (crop, market, state, price, min_price, max_price, unit, arrival_date)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `);
            
            const insertMany = db.transaction((records) => {
              for (const record of records) {
                insertStmt.run(
                  crop,
                  market,
                  state,
                  parseFloat(record.modal_price) || 0,
                  parseFloat(record.min_price) || 0,
                  parseFloat(record.max_price) || 0,
                  record.unit || 'Per Quintal',
                  record.arrival_date || new Date().toISOString().split('T')[0]
                );
              }
            });
            
            insertMany(records);
            results.collected += records.length;
            results.details.push({ crop, market, state, records: records.length });
            
          } catch (error) {
            results.errors.push({ crop, market, state, error: error.message });
          }
        }
      }
    }
    
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Trigger manual data collection for specific crop/market
router.post('/collect/:crop/:market', async (req, res) => {
  try {
    const { crop, market } = req.params;
    const { state } = req.query;
    
    const response = await axios.get(AGMARKNET_BASE_URL, {
      params: {
        'api-key': AGMARKNET_API_KEY,
        format: 'json',
        limit: 100,
        filters: {
          commodity: crop,
          market: market,
          ...(state && { state })
        }
      },
      timeout: 10000
    });
    
    const records = response.data.records || [];
    
    const insertStmt = db.prepare(`
      INSERT OR IGNORE INTO historical_prices 
      (crop, market, state, price, min_price, max_price, unit, arrival_date)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    let inserted = 0;
    for (const record of records) {
      const result = insertStmt.run(
        crop,
        market,
        record.state || state || 'Unknown',
        parseFloat(record.modal_price) || 0,
        parseFloat(record.min_price) || 0,
        parseFloat(record.max_price) || 0,
        record.unit || 'Per Quintal',
        record.arrival_date || new Date().toISOString().split('T')[0]
      );
      if (result.changes > 0) inserted++;
    }
    
    res.json({
      crop,
      market,
      fetched: records.length,
      inserted,
      message: `Collected ${inserted} new records`
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get data collection status
router.get('/status', (req, res) => {
  try {
    const priceCount = db.prepare('SELECT COUNT(*) as count FROM historical_prices').get();
    const dateRange = db.prepare(`
      SELECT 
        MIN(arrival_date) as earliest,
        MAX(arrival_date) as latest
      FROM historical_prices
    `).get();
    
    const recentInsert = db.prepare(`
      SELECT COUNT(*) as count 
      FROM historical_prices 
      WHERE fetched_at >= datetime('now', '-1 day')
    `).get();
    
    res.json({
      totalRecords: priceCount.count,
      dateRange,
      recordsAddedLast24h: recentInsert.count
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
