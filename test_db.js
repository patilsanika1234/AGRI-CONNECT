import Database from 'better-sqlite3';
import { join } from 'path';

const db = new Database(join('backend', 'data', 'agriconnect.db'));

// Check historical data
const countResult = db.prepare('SELECT COUNT(*) as count FROM historical_prices WHERE crop = ? AND market = ? AND state = ?').all('Wheat', 'Delhi', 'Delhi');
console.log('Historical records count:', countResult[0].count);

const sample = db.prepare('SELECT * FROM historical_prices WHERE crop = ? AND market = ? AND state = ? LIMIT 5').all('Wheat', 'Delhi', 'Delhi');
console.log('Sample data:', sample);

// Check all available crops/markets
const crops = db.prepare('SELECT DISTINCT crop FROM historical_prices LIMIT 10').all();
console.log('Available crops:', crops);

const markets = db.prepare('SELECT DISTINCT market FROM historical_prices LIMIT 10').all();
console.log('Available markets:', markets);

db.close();
