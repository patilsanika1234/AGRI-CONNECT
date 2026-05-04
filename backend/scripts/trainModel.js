#!/usr/bin/env node
import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { trainModel, getTrainedModels } from '../ml/predictor.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const db = new Database(join(__dirname, '..', 'data', 'agriconnect.db'));

async function trainAllModels() {
  console.log('Starting ML model training...\n');
  
  // Get all crop/market combinations with sufficient data
  const combos = db.prepare(`
    SELECT crop, market, COUNT(*) as records
    FROM historical_prices
    GROUP BY crop, market
    HAVING records >= 30
    ORDER BY records DESC
  `).all();
  
  console.log(`Found ${combos.length} crop/market combinations with sufficient data (30+ records)\n`);
  
  let trained = 0;
  let failed = 0;
  
  for (const combo of combos) {
    try {
      const result = await trainModel(combo.crop, combo.market);
      if (result.success) {
        console.log(`✓ Trained: ${combo.crop} @ ${combo.market} (${combo.records} records)`);
        trained++;
      } else {
        console.log(`⚠ Skipped: ${combo.crop} @ ${combo.market} - ${result.message}`);
        failed++;
      }
    } catch (error) {
      console.log(`✗ Failed: ${combo.crop} @ ${combo.market} - ${error.message}`);
      failed++;
    }
    
    // Small delay to prevent overwhelming the system
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  console.log(`\nTraining complete!`);
  console.log(`Successfully trained: ${trained}`);
  console.log(`Failed/Skipped: ${failed}`);
  
  // Show all trained models
  const models = getTrainedModels();
  console.log(`\nTotal trained models in database: ${models.length}`);
  
  // Show top 10 by accuracy
  if (models.length > 0) {
    console.log('\nTop 10 models by accuracy:');
    models
      .sort((a, b) => (b.accuracy || 0) - (a.accuracy || 0))
      .slice(0, 10)
      .forEach((m, i) => {
        console.log(`${i + 1}. ${m.crop} @ ${m.market} - ${(m.accuracy * 100).toFixed(1)}%`);
      });
  }
}

// Train specific crop/market
async function trainSpecific(crop, market) {
  console.log(`Training model for ${crop} @ ${market}...\n`);
  
  try {
    const result = await trainModel(crop, market);
    if (result.success) {
      console.log(`✓ Success!`);
      console.log(`  Records used: ${result.recordsUsed}`);
      console.log(`  Date range: ${result.dateRange.from} to ${result.dateRange.to}`);
    } else {
      console.log(`⚠ ${result.message}`);
    }
  } catch (error) {
    console.log(`✗ Error: ${error.message}`);
  }
}

// Run training
if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);
  
  if (args.length === 2) {
    // Train specific crop/market
    trainSpecific(args[0], args[1]).catch(console.error);
  } else {
    // Train all
    trainAllModels().catch(console.error);
  }
}

export { trainAllModels, trainSpecific };
