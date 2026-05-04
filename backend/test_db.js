import Database from 'better-sqlite3';
import { join } from 'path';

const db = new Database(join('data', 'agriconnect.db'));

// Check historical data
const countResult = db.prepare('SELECT COUNT(*) as count FROM historical_prices WHERE crop = ? AND market = ? AND state = ?').all('Wheat', 'Delhi', 'Delhi');
console.log('Historical records count for Wheat/Delhi:', countResult[0].count);

// Check if there's any data at all
const totalResult = db.prepare('SELECT COUNT(*) as count FROM historical_prices').all();
console.log('Total historical records:', totalResult[0].count);

if (totalResult[0].count > 0) {
  // Get sample data
  const sample = db.prepare('SELECT * FROM historical_prices LIMIT 5').all();
  console.log('Sample data:', sample);
  
  // Get available crops
  const crops = db.prepare('SELECT DISTINCT crop FROM historical_prices LIMIT 10').all();
  console.log('Available crops:', crops);
  
  // Get available markets
  const markets = db.prepare('SELECT DISTINCT market FROM historical_prices LIMIT 10').all();
  console.log('Available markets:', markets);
}

db.close();
