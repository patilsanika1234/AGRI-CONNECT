#!/usr/bin/env node
import axios from 'axios';
import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import cron from 'node-cron';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const db = new Database(join(__dirname, '..', 'data', 'agriconnect.db'));

// Agmarknet API configuration
const API_KEY = process.env.AGMARKNET_API_KEY || '579b464db66ec23bdd000001cdd3946e44ce4aad7209ff7b23ac571b';
const BASE_URL = 'https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070';

// Major crops to collect
const CROPS = [
  'Wheat', 'Rice', 'Maize', 'Soybean', 'Cotton',
  'Sugarcane', 'Groundnut', 'Mustard', 'Potato', 'Tomato',
  'Chickpea', 'Pigeon Pea', 'Turmeric', 'Onion', 'Barley',
  'Jowar', 'Bajra', 'Moong', 'Urad', 'Masur'
];

// Major markets by state
const MARKETS = [
  { state: 'Maharashtra', markets: ['Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Aurangabad'] },
  { state: 'Punjab', markets: ['Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala'] },
  { state: 'Haryana', markets: ['Karnal', 'Hisar', 'Rohtak', 'Ambala'] },
  { state: 'Uttar Pradesh', markets: ['Lucknow', 'Kanpur', 'Agra', 'Varanasi', 'Meerut'] },
  { state: 'Madhya Pradesh', markets: ['Indore', 'Bhopal', 'Gwalior', 'Jabalpur'] },
  { state: 'Rajasthan', markets: ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota'] },
  { state: 'Gujarat', markets: ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot'] },
  { state: 'Karnataka', markets: ['Bangalore', 'Mysore', 'Hubli', 'Mangalore'] },
  { state: 'Tamil Nadu', markets: ['Chennai', 'Coimbatore', 'Madurai', 'Salem'] },
  { state: 'Andhra Pradesh', markets: ['Hyderabad', 'Vijayawada', 'Visakhapatnam'] },
  { state: 'Telangana', markets: ['Hyderabad', 'Warangal', 'Nizamabad'] },
  { state: 'Kerala', markets: ['Kochi', 'Thiruvananthapuram', 'Kozhikode'] },
  { state: 'West Bengal', markets: ['Kolkata', 'Howrah', 'Durgapur', 'Siliguri'] },
  { state: 'Bihar', markets: ['Patna', 'Gaya', 'Muzaffarpur'] },
  { state: 'Odisha', markets: ['Bhubaneswar', 'Cuttack', 'Rourkela'] },
  { state: 'Assam', markets: ['Guwahati', 'Dibrugarh'] },
];

async function collectData() {
  console.log('Starting data collection...');
  console.log(`Crops: ${CROPS.length}, States: ${MARKETS.length}`);
  
  let totalCollected = 0;
  let errors = 0;
  
  const insertStmt = db.prepare(`
    INSERT OR IGNORE INTO historical_prices 
    (crop, market, state, price, min_price, max_price, unit, arrival_date)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  
  for (const crop of CROPS) {
    for (const stateData of MARKETS) {
      for (const market of stateData.markets) {
        try {
          const response = await axios.get(BASE_URL, {
            params: {
              'api-key': API_KEY,
              format: 'json',
              limit: 100,
              filters: {
                commodity: crop,
                market: market,
                state: stateData.state
              }
            },
            timeout: 15000
          });
          
          const records = response.data.records || [];
          
          for (const record of records) {
            try {
              insertStmt.run(
                crop,
                market,
                stateData.state,
                parseFloat(record.modal_price) || 0,
                parseFloat(record.min_price) || 0,
                parseFloat(record.max_price) || 0,
                record.unit || 'Per Quintal',
                record.arrival_date || new Date().toISOString().split('T')[0]
              );
              totalCollected++;
            } catch (err) {
              // Ignore duplicate entries
            }
          }
          
          if (records.length > 0) {
            console.log(`✓ ${crop} @ ${market}, ${stateData.state}: ${records.length} records`);
          }
          
          // Delay to avoid rate limiting
          await new Promise(resolve => setTimeout(resolve, 500));
          
        } catch (error) {
          errors++;
          if (error.response?.status !== 404) {
            console.log(`✗ ${crop} @ ${market}: ${error.message}`);
          }
        }
      }
    }
  }
  
  console.log(`\nCollection complete!`);
  console.log(`Total records collected: ${totalCollected}`);
  console.log(`Errors: ${errors}`);
  
  // Print summary
  const summary = db.prepare(`
    SELECT 
      COUNT(*) as total,
      COUNT(DISTINCT crop) as crops,
      COUNT(DISTINCT market) as markets,
      COUNT(DISTINCT state) as states,
      MIN(arrival_date) as earliest,
      MAX(arrival_date) as latest
    FROM historical_prices
  `).get();
  
  console.log(`\nDatabase Summary:`);
  console.log(`- Total records: ${summary.total}`);
  console.log(`- Unique crops: ${summary.crops}`);
  console.log(`- Unique markets: ${summary.markets}`);
  console.log(`- Unique states: ${summary.states}`);
  console.log(`- Date range: ${summary.earliest} to ${summary.latest}`);
}

// Run immediately if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  collectData().catch(console.error);
}

export { collectData, CROPS, MARKETS };
