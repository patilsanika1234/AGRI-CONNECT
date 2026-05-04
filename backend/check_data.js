import Database from 'better-sqlite3';
import { join } from 'path';

const db = new Database(join('data', 'agriconnect.db'));

// Check which crop/market/state combinations have sufficient data
const stmt = db.prepare(`
  SELECT crop, market, state, COUNT(*) as record_count
  FROM historical_prices 
  GROUP BY crop, market, state
  HAVING COUNT(*) >= 30
  ORDER BY record_count DESC
`);

const sufficientData = stmt.all();
console.log('Crop/Market/State combinations with 30+ days of data:');
console.log('='.repeat(60));

sufficientData.forEach(row => {
  console.log(`${row.crop} | ${row.market} | ${row.state} | ${row.record_count} records`);
});

// Also check what's missing
const insufficientStmt = db.prepare(`
  SELECT crop, market, state, COUNT(*) as record_count
  FROM historical_prices 
  GROUP BY crop, market, state
  HAVING COUNT(*) < 30
  ORDER BY record_count DESC
`);

const insufficientData = insufficientStmt.all();
console.log('\nCrop/Market/State combinations with < 30 days of data:');
console.log('='.repeat(60));

if (insufficientData.length === 0) {
  console.log('None - all combinations have sufficient data');
} else {
  insufficientData.forEach(row => {
    console.log(`${row.crop} | ${row.market} | ${row.state} | ${row.record_count} records`);
  });
}

db.close();
