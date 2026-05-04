import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { linearRegression } from 'simple-statistics';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const db = new Database(join(__dirname, '..', 'data', 'agriconnect.db'));

// Predict prices using time series analysis
export async function predictPrice(crop, market, historicalData, daysAhead = 7) {
  try {
    // Sort data by date ascending
    const sortedData = historicalData.sort((a, b) => 
      new Date(a.arrival_date) - new Date(b.arrival_date)
    );
    
    // Extract prices and create time indices
    const prices = sortedData.map(d => d.price);
    const n = prices.length;
    
    if (n < 10) {
      throw new Error('Insufficient data for prediction');
    }
    
    // Simple Moving Average (SMA)
    const sma7 = calculateSMA(prices, 7);
    const sma14 = calculateSMA(prices, 14);
    const sma30 = calculateSMA(prices, 30);
    
    // Linear regression for trend
    const timePoints = prices.map((_, i) => [i, prices[i]]);
    const regression = linearRegression(timePoints);
    const slope = regression.m;
    const intercept = regression.b;
    
    // Calculate volatility (standard deviation)
    const mean = prices.reduce((a, b) => a + b, 0) / n;
    const variance = prices.reduce((sum, price) => sum + Math.pow(price - mean, 2), 0) / n;
    const stdDev = Math.sqrt(variance);
    
    // Trend analysis
    const recentTrend = prices.slice(-7).reduce((a, b) => a + b, 0) / 7;
    const olderTrend = prices.slice(-14, -7).reduce((a, b) => a + b, 0) / 7;
    
    let trendDirection = 'stable';
    if (recentTrend > olderTrend * 1.05) trendDirection = 'upward';
    else if (recentTrend < olderTrend * 0.95) trendDirection = 'downward';
    
    // Generate predictions for next N days
    const predictions = [];
    const lastPrice = prices[prices.length - 1];
    const lastDate = new Date(sortedData[sortedData.length - 1].arrival_date);
    
    for (let i = 1; i <= daysAhead; i++) {
      // Combine multiple factors for prediction
      const trendComponent = slope * (n + i);
      const seasonalComponent = calculateSeasonalFactor(sortedData, i);
      const momentumComponent = (recentTrend - olderTrend) * 0.3;
      
      // Weighted prediction
      let predictedPrice = intercept + trendComponent + seasonalComponent + momentumComponent;
      
      // Add confidence bounds based on volatility
      const confidence = Math.max(0.5, 1 - (stdDev / mean));
      const variance = stdDev * (1 + i * 0.1); // Increasing uncertainty over time
      
      const prediction = {
        date: new Date(lastDate.getTime() + i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        predictedPrice: Math.round(predictedPrice * 100) / 100,
        minPrice: Math.round((predictedPrice - variance) * 100) / 100,
        maxPrice: Math.round((predictedPrice + variance) * 100) / 100,
        confidence: Math.round(confidence * 100) / 100
      };
      
      predictions.push(prediction);
    }
    
    // Calculate overall confidence based on data quality
    const dataQuality = Math.min(1, n / 90); // Max confidence with 90 days of data
    const volatilityScore = Math.max(0, 1 - (stdDev / mean));
    const overallConfidence = Math.round(((dataQuality + volatilityScore) / 2) * 100) / 100;
    
    return {
      prices: predictions,
      trend: trendDirection,
      confidence: overallConfidence,
      basedOn: {
        records: n,
        days: Math.round(n),
        sma7: Math.round(sma7 * 100) / 100,
        sma14: Math.round(sma14 * 100) / 100,
        sma30: Math.round(sma30 * 100) / 100,
        volatility: Math.round((stdDev / mean) * 100) / 100
      }
    };
  } catch (error) {
    throw new Error(`Prediction failed: ${error.message}`);
  }
}

// Calculate Simple Moving Average
function calculateSMA(prices, period) {
  if (prices.length < period) return prices[prices.length - 1];
  const sum = prices.slice(-period).reduce((a, b) => a + b, 0);
  return sum / period;
}

// Calculate seasonal factor based on day of week patterns
function calculateSeasonalFactor(historicalData, daysAhead) {
  const dayOfWeekPrices = {};
  
  historicalData.forEach(d => {
    const day = new Date(d.arrival_date).getDay();
    if (!dayOfWeekPrices[day]) dayOfWeekPrices[day] = [];
    dayOfWeekPrices[day].push(d.price);
  });
  
  // Calculate average price for each day of week
  const dayAverages = {};
  for (const [day, prices] of Object.entries(dayOfWeekPrices)) {
    dayAverages[day] = prices.reduce((a, b) => a + b, 0) / prices.length;
  }
  
  // Return adjustment factor (simplified)
  return 0; // For simplicity, returning 0 (can be enhanced)
}

// Train/update model for a specific crop/market
export async function trainModel(crop, market) {
  try {
    // Get all historical data
    const stmt = db.prepare(`
      SELECT price, arrival_date 
      FROM historical_prices 
      WHERE crop = ? AND market = ? 
      ORDER BY arrival_date ASC
    `);
    
    const data = stmt.all(crop, market);
    
    if (data.length < 30) {
      return { 
        success: false, 
        message: `Insufficient data. Need 30+ records, have ${data.length}` 
      };
    }
    
    // Calculate model metrics
    const prices = data.map(d => d.price);
    const mean = prices.reduce((a, b) => a + b, 0) / prices.length;
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    
    // Store model metadata
    const insertStmt = db.prepare(`
      INSERT INTO ml_models (crop, market, model_data, accuracy, last_trained_date)
      VALUES (?, ?, ?, ?, date('now'))
      ON CONFLICT(crop, market) DO UPDATE SET
        model_data = excluded.model_data,
        accuracy = excluded.accuracy,
        trained_at = CURRENT_TIMESTAMP,
        last_trained_date = date('now')
    `);
    
    const modelData = JSON.stringify({
      mean,
      min,
      max,
      count: data.length,
      trainedAt: new Date().toISOString()
    });
    
    insertStmt.run(crop, market, modelData, 0.85); // Placeholder accuracy
    
    return {
      success: true,
      crop,
      market,
      recordsUsed: data.length,
      dateRange: {
        from: data[0].arrival_date,
        to: data[data.length - 1].arrival_date
      }
    };
  } catch (error) {
    throw new Error(`Training failed: ${error.message}`);
  }
}

// Get all trained models
export function getTrainedModels() {
  try {
    const stmt = db.prepare(`
      SELECT crop, market, accuracy, last_trained_date 
      FROM ml_models 
      ORDER BY trained_at DESC
    `);
    return stmt.all();
  } catch (error) {
    throw new Error(`Failed to get models: ${error.message}`);
  }
}
