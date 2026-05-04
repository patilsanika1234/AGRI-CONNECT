-- AgriConnect Database Schema
-- SQLite Database for ML Price Prediction
-- File: backend/data/agriconnect.db

-- =====================================================
-- Table: historical_prices
-- Purpose: Store collected historical price data from Agmarknet API
-- Used for: Training ML models and trend analysis
-- =====================================================

CREATE TABLE IF NOT EXISTS historical_prices (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    crop TEXT NOT NULL,           -- Crop name (Wheat, Rice, etc.)
    market TEXT NOT NULL,         -- Market name (Mumbai, Delhi, etc.)
    state TEXT NOT NULL,          -- State name (Maharashtra, Punjab, etc.)
    price REAL NOT NULL,          -- Modal price (average price)
    min_price REAL,               -- Minimum price recorded
    max_price REAL,               -- Maximum price recorded
    unit TEXT,                    -- Unit (Per Quintal, Per Ton, etc.)
    arrival_date TEXT NOT NULL,   -- Date of price record (YYYY-MM-DD)
    fetched_at DATETIME DEFAULT CURRENT_TIMESTAMP  -- When data was collected
);

-- Indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_prices_crop ON historical_prices(crop);
CREATE INDEX IF NOT EXISTS idx_prices_market ON historical_prices(market);
CREATE INDEX IF NOT EXISTS idx_prices_date ON historical_prices(arrival_date);
CREATE INDEX IF NOT EXISTS idx_prices_crop_market_date ON historical_prices(crop, market, arrival_date);

-- =====================================================
-- Table: ml_models
-- Purpose: Store trained ML model metadata
-- Used for: Tracking model accuracy and training history
-- =====================================================

CREATE TABLE IF NOT EXISTS ml_models (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    crop TEXT NOT NULL,           -- Crop this model was trained for
    market TEXT NOT NULL,         -- Market this model was trained for
    model_data BLOB NOT NULL,     -- JSON blob with model parameters
    trained_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    accuracy REAL,                -- Model accuracy (0-1)
    last_trained_date TEXT        -- Date of last training
);

-- Index for model lookup
CREATE INDEX IF NOT EXISTS idx_models_crop_market ON ml_models(crop, market);

-- =====================================================
-- Table: predictions
-- Purpose: Store generated price predictions
-- Used for: Displaying predictions and validating accuracy
-- =====================================================

CREATE TABLE IF NOT EXISTS predictions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    crop TEXT NOT NULL,           -- Crop being predicted
    market TEXT NOT NULL,         -- Market being predicted
    state TEXT NOT NULL,          -- State for context
    predicted_price REAL NOT NULL,-- Predicted price value
    confidence REAL,              -- Confidence score (0-1)
    prediction_date TEXT NOT NULL,-- Date for which price is predicted
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Index for prediction lookup
CREATE INDEX IF NOT EXISTS idx_predictions_crop_market ON predictions(crop, market);

-- =====================================================
-- Sample Queries for ML Training
-- =====================================================

-- Get historical data for a specific crop/market (last 90 days)
SELECT price, arrival_date 
FROM historical_prices 
WHERE crop = 'Wheat' AND market = 'Mumbai'
AND arrival_date >= date('now', '-90 days')
ORDER BY arrival_date ASC;

-- Get average price trends by month
SELECT 
    strftime('%Y-%m', arrival_date) as month,
    AVG(price) as avg_price,
    MIN(price) as min_price,
    MAX(price) as max_price
FROM historical_prices 
WHERE crop = 'Wheat' AND market = 'Mumbai'
GROUP BY month
ORDER BY month DESC;

-- Get all trained models with accuracy
SELECT crop, market, accuracy, last_trained_date 
FROM ml_models 
ORDER BY accuracy DESC;

-- Validate prediction accuracy (compare predictions with actual)
SELECT 
    p.prediction_date,
    p.predicted_price,
    h.price as actual_price,
    ABS(p.predicted_price - h.price) / h.price * 100 as error_percent
FROM predictions p
JOIN historical_prices h 
    ON p.crop = h.crop 
    AND p.market = h.market
    AND h.arrival_date = p.prediction_date
WHERE p.crop = 'Wheat' AND p.market = 'Mumbai'
ORDER BY p.prediction_date DESC;
