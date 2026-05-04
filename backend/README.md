# AgriConnect Backend

Backend server for AgriConnect with ML-based price prediction.

## Architecture

- **Display (Today's Prices)**: Uses Agmarknet API directly for real-time prices
- **ML Predictions**: Uses collected historical data stored in SQLite database, trained ML models

## Setup

```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Setup database
npm run setup

# Start server
npm run dev
```

## Data Collection

```bash
# Collect historical data from Agmarknet API
npm run collect

# This will populate the database with historical prices
# Run this daily to keep data fresh
```

## Model Training

```bash
# Train ML models for all crops with sufficient data
npm run train

# Train specific crop/market
npm run train Wheat Mumbai
```

## API Endpoints

### Prices
- `GET /api/prices/today/:crop/:market` - Get today's price (from API directly)
- `GET /api/prices/historical/:crop/:market?days=30` - Get historical prices
- `GET /api/prices/trends/:crop/:market` - Get price trends

### Predictions (ML)
- `GET /api/predictions/predict/:crop/:market?days=7` - Get ML prediction
- `GET /api/predictions/accuracy/:crop/:market` - Get prediction accuracy

### Data Collection
- `POST /api/data/collect` - Trigger data collection
- `GET /api/data/status` - Get collection status

### Health
- `GET /api/health` - Server health check
- `GET /api/stats` - Database statistics

## Database Schema

### historical_prices
- Stores collected price data over time
- Used for ML training

### ml_models
- Stores trained model metadata
- Tracks model accuracy

### predictions
- Stores generated predictions
- Used for accuracy validation

## ML Algorithm

Uses time series analysis with:
- Simple Moving Average (SMA) - 7, 14, 30 day windows
- Linear regression for trend detection
- Volatility analysis for confidence scoring
- Seasonal pattern detection

## Environment Variables

```env
PORT=5000
AGMARKNET_API_KEY=your_api_key
NODE_ENV=development
```

## Cron Jobs

The backend can be configured to:
- Collect data daily at midnight
- Retrain models weekly
- Clean old records monthly
