# 🌾 AgriConnect Backend

AI-powered backend system for **AgriConnect**, designed to provide real-time agricultural price insights and machine learning-based price predictions.

---

## 🚀 Overview

This backend serves as the core engine of AgriConnect, combining:

* 📊 **Real-time crop prices** using Agmarknet API
* 🧠 **Machine Learning predictions** using historical data
* 🗄️ **Efficient data storage** with SQLite
* ⚙️ **Automated data pipelines** for continuous updates

---

## 🏗️ Architecture

* **Live Prices (Today):**
  Fetched directly from Agmarknet API for real-time accuracy

* **ML Predictions:**
  Generated using historical price data stored locally and trained ML models

---

## 🛠️ Tech Stack

* **Backend:** Node.js, Express.js
* **Database:** SQLite
* **Machine Learning:** Time Series Analysis
* **API Integration:** Agmarknet API
* **Tools:** Git, GitHub

---

## ⚙️ Setup Instructions

### 1️⃣ Navigate to backend

```bash
cd backend
```

### 2️⃣ Install dependencies

```bash
npm install
```

### 3️⃣ Setup database

```bash
npm run setup
```

### 4️⃣ Start the server

```bash
npm run dev
```

---

## 📥 Data Collection

```bash
npm run collect
```

* Fetches historical crop price data
* Stores it in the database
* Recommended to run daily

---

## 🤖 Model Training

```bash
# Train all crops
npm run train

# Train specific crop & market
npm run train Wheat Mumbai
```

---

## 🔗 API Endpoints

### 📊 Prices

* `GET /api/prices/today/:crop/:market` → Real-time price
* `GET /api/prices/historical/:crop/:market?days=30` → Historical data
* `GET /api/prices/trends/:crop/:market` → Market trends

### 🔮 Predictions (ML)

* `GET /api/predictions/predict/:crop/:market?days=7` → Future price prediction
* `GET /api/predictions/accuracy/:crop/:market` → Model accuracy

### 📥 Data Collection

* `POST /api/data/collect` → Trigger data collection
* `GET /api/data/status` → Check collection status

### 🩺 Health & Stats

* `GET /api/health` → Server health check
* `GET /api/stats` → Database statistics

---

## 🗄️ Database Schema

### 📌 historical_prices

Stores time-based crop price data used for ML training

### 📌 ml_models

Tracks trained models and their performance

### 📌 predictions

Stores predicted values for validation and analysis

---

## 🧠 ML Approach

* 📉 Simple Moving Average (7, 14, 30 days)
* 📈 Linear Regression for trend analysis
* ⚡ Volatility analysis for confidence scoring
* 🔄 Seasonal pattern detection

---

## 🔐 Environment Variables

Create a `.env` file:

```env
PORT=5000
AGMARKNET_API_KEY=your_api_key
NODE_ENV=development
```

---

## ⏱️ Automation (Cron Jobs)

* 📅 Daily: Data collection
* 📆 Weekly: Model retraining
* 🧹 Monthly: Cleanup old records

---

## 📈 Future Enhancements

* 🌦️ Weather-based prediction improvements
* 📊 Advanced ML models (LSTM, ARIMA)
* 📱 Integration with frontend dashboard
* 🌍 Multi-market analysis

---

## 👩‍💻 Author

* Your Name
* GitHub: https://github.com/your-username

---

## 📜 License

This project is developed for educational and research purposes.
