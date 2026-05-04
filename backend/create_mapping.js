import Database from 'better-sqlite3';
import { join } from 'path';

const db = new Database(join('data', 'agriconnect.db'));

// Get all available combinations
const stmt = db.prepare(`
  SELECT crop, market, state, COUNT(*) as record_count
  FROM historical_prices 
  GROUP BY crop, market, state
  HAVING COUNT(*) >= 30
  ORDER BY crop, market, state
`);

const combinations = stmt.all();

console.log('Available crop/market/state combinations:');
console.log('='.repeat(80));

// Create a mapping object
const mapping = {};

combinations.forEach(row => {
  if (!mapping[row.crop]) {
    mapping[row.crop] = [];
  }
  mapping[row.crop].push({
    market: row.market,
    state: row.state,
    records: row.record_count
  });
});

console.log(JSON.stringify(mapping, null, 2));

db.close();
