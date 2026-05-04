#!/usr/bin/env node
import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Open database
const db = new Database(join(__dirname, '..', 'data', 'agriconnect.db'));

console.log('Loading comprehensive 2025 data into database...');

// Create tables if not exist
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
`);

// Clear existing data
db.exec('DELETE FROM historical_prices');
console.log('Cleared existing data');

// Insert statement
const insert = db.prepare(`
  INSERT INTO historical_prices (crop, market, state, price, min_price, max_price, unit, arrival_date)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`);

// Generate 90 days of data for all 13 crops
const CROPS = [
  ['Rice', 'Mumbai', 'Maharashtra', 3500, 0.05],
  ['Wheat', 'Delhi', 'Delhi', 2400, 0.06],
  ['Maize', 'Hyderabad', 'Telangana', 1850, 0.08],
  ['Cotton', 'Ahmedabad', 'Gujarat', 6500, 0.12],
  ['Sugarcane', 'Lucknow', 'Uttar Pradesh', 350, 0.03],
  ['Soybean', 'Indore', 'Madhya Pradesh', 4300, 0.10],
  ['Potato', 'Delhi', 'Delhi', 1200, 0.15],
  ['Tomato', 'Mumbai', 'Maharashtra', 2800, 0.20],
  ['Onion', 'Mumbai', 'Maharashtra', 2200, 0.25],
  ['Mango', 'Hyderabad', 'Telangana', 5800, 0.18],
  ['Mustard', 'Jaipur', 'Rajasthan', 4900, 0.09],
  ['Bajra', 'Jaipur', 'Rajasthan', 2150, 0.07],
  ['Jowar', 'Mumbai', 'Maharashtra', 2400, 0.08]
];

let count = 0;
const startDate = new Date('2025-01-01');

for (const [crop, market, state, basePrice, volatility] of CROPS) {
  for (let day = 0; day < 90; day++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + day);
    const dateStr = date.toISOString().split('T')[0];
    
    // Generate realistic price with trend and noise
    const trend = 1 + (0.001 * day); // Slight upward trend
    const noise = 1 + (Math.random() * volatility * 2 - volatility);
    const price = Math.round(basePrice * trend * noise * 100) / 100;
    const minPrice = Math.round(price * 0.92 * 100) / 100;
    const maxPrice = Math.round(price * 1.08 * 100) / 100;
    
    insert.run(crop, market, state, price, minPrice, maxPrice, 'Per Quintal', dateStr);
    count++;
  }
  console.log(`✓ Added 90 days for ${crop}`);
}

console.log(`\n✅ Total records inserted: ${count}`);
console.log('Database ready for ML predictions!');

// Verify count
const result = db.prepare('SELECT COUNT(*) as count FROM historical_prices').get();
console.log(`Verified: ${result.count} records in database`);
