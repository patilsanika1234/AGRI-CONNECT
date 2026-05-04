import Database from 'better-sqlite3';
import { join } from 'path';
import { predictPrice } from './ml/predictor.js';

const db = new Database(join('data', 'agriconnect.db'));

// Get historical data for Wheat/Delhi
const stmt = db.prepare(`
  SELECT price, arrival_date 
  FROM historical_prices 
  WHERE crop = ? AND market = ? AND state = ?
  ORDER BY arrival_date DESC 
  LIMIT 90
`);

const historicalData = stmt.all('Wheat', 'Delhi', 'Delhi');
console.log('Historical data count:', historicalData.length);
console.log('First few records:', historicalData.slice(0, 3));

try {
  const prediction = await predictPrice('Wheat', 'Delhi', historicalData, 7);
  console.log('Prediction result:', JSON.stringify(prediction, null, 2));
  
  if (prediction.prices && prediction.prices.length > 0) {
    console.log('First prediction:', prediction.prices[0]);
  } else {
    console.log('No predictions found!');
  }
} catch (error) {
  console.error('Prediction error:', error.message);
}

db.close();
