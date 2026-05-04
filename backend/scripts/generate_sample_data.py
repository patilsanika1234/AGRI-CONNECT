#!/usr/bin/env python3
"""
Generate comprehensive 2025 sample data for AgriConnect ML training
Includes all 13 crops from the project across major Indian markets
"""

import random
from datetime import datetime, timedelta

# Crops from the project
CROPS = [
    "Rice", "Wheat", "Maize", "Cotton", "Sugarcane", 
    "Soybean", "Potato", "Tomato", "Onion", "Mango", 
    "Mustard", "Bajra", "Jowar"
]

# States and their major markets
STATE_MARKETS = {
    "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Nashik"],
    "Punjab": ["Ludhiana", "Amritsar", "Jalandhar"],
    "Haryana": ["Karnal", "Hisar", "Rohtak"],
    "Uttar Pradesh": ["Lucknow", "Kanpur", "Agra", "Varanasi"],
    "Madhya Pradesh": ["Indore", "Bhopal", "Gwalior"],
    "Rajasthan": ["Jaipur", "Jodhpur", "Udaipur"],
    "Gujarat": ["Ahmedabad", "Surat", "Vadodara"],
    "Karnataka": ["Bangalore", "Mysore", "Hubli"],
    "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai"],
    "Andhra Pradesh": ["Vijayawada", "Visakhapatnam"],
    "Telangana": ["Hyderabad", "Warangal"],
    "Kerala": ["Kochi", "Thiruvananthapuram"],
    "West Bengal": ["Kolkata", "Howrah"],
    "Bihar": ["Patna", "Gaya"],
    "Odisha": ["Bhubaneswar", "Cuttack"],
    "Delhi": ["Azadpur", "Ghazipur"]
}

# Base prices for each crop (per quintal in INR)
CROP_BASE_PRICES = {
    "Rice": 3200,
    "Wheat": 2400,
    "Maize": 1800,
    "Cotton": 6500,
    "Sugarcane": 340,
    "Soybean": 4200,
    "Potato": 1200,
    "Tomato": 2500,
    "Onion": 2000,
    "Mango": 5500,
    "Mustard": 4800,
    "Bajra": 2100,
    "Jowar": 2300
}

# Volatility factor for each crop
CROP_VOLATILITY = {
    "Rice": 0.05,
    "Wheat": 0.06,
    "Maize": 0.08,
    "Cotton": 0.12,
    "Sugarcane": 0.03,
    "Soybean": 0.10,
    "Potato": 0.15,
    "Tomato": 0.20,
    "Onion": 0.25,
    "Mango": 0.18,
    "Mustard": 0.09,
    "Bajra": 0.07,
    "Jowar": 0.08
}

def generate_price(base_price, volatility, trend=0):
    """Generate realistic price with trend and volatility"""
    trend_factor = 1 + (trend * 0.002)  # Slight daily trend
    volatility_range = base_price * volatility
    random_change = random.uniform(-volatility_range, volatility_range)
    price = base_price * trend_factor + random_change
    return round(price, 2)

def generate_historical_data():
    """Generate 90 days of historical data for all crops"""
    records = []
    start_date = datetime(2025, 1, 1)
    
    for crop in CROPS:
        base_price = CROP_BASE_PRICES[crop]
        volatility = CROP_VOLATILITY[crop]
        
        for state, markets in STATE_MARKETS.items():
            for market in markets:
                # Generate trend (slight upward/downward/random)
                trend = random.choice([-1, 0, 1])
                
                for day in range(90):
                    date = start_date + timedelta(days=day)
                    date_str = date.strftime('%Y-%m-%d')
                    
                    # Vary price by state (some states have higher/lower prices)
                    state_factor = random.uniform(0.85, 1.15)
                    adjusted_base = base_price * state_factor
                    
                    price = generate_price(adjusted_base, volatility, trend * (day % 7))
                    min_price = round(price * random.uniform(0.90, 0.98), 2)
                    max_price = round(price * random.uniform(1.02, 1.12), 2)
                    
                    records.append(
                        f"('{crop}', '{market}', '{state}', {price}, {min_price}, {max_price}, 'Per Quintal', '{date_str}')"
                    )
    
    return records

def generate_predictions():
    """Generate sample predictions for next 7 days"""
    records = []
    start_date = datetime(2025, 4, 1)  # Predictions for April 2025
    
    for crop in ["Rice", "Wheat", "Maize", "Cotton", "Potato", "Tomato", "Onion"]:
        base_price = CROP_BASE_PRICES[crop]
        
        for state, markets in list(STATE_MARKETS.items())[:8]:  # Top 8 states
            for market in markets[:2]:  # Top 2 markets per state
                for day in range(7):
                    date = start_date + timedelta(days=day)
                    date_str = date.strftime('%Y-%m-%d')
                    
                    predicted_price = round(base_price * random.uniform(0.95, 1.08), 2)
                    confidence = round(random.uniform(0.72, 0.91), 2)
                    
                    records.append(
                        f"('{crop}', '{market}', '{state}', {predicted_price}, {confidence}, '{date_str}')"
                    )
    
    return records

def generate_ml_models():
    """Generate ML model metadata for trained crops"""
    records = []
    
    for crop in CROPS[:10]:  # Top 10 crops
        for state, markets in list(STATE_MARKETS.items())[:6]:  # Top 6 states
            for market in markets[:1]:  # Primary market
                mean_price = CROP_BASE_PRICES[crop]
                std_dev = round(mean_price * CROP_VOLATILITY[crop] * 2, 2)
                trend = random.choice(["upward", "downward", "stable"])
                accuracy = round(random.uniform(0.75, 0.88), 2)
                
                model_data = f'"{{\\"mean\\": {mean_price}, \\stdDev\\": {std_dev}, \\trend\\": \\"{trend}\\", \\seasonality\\": {{}}}}"'
                
                records.append(
                    f"('{crop}', '{market}', {model_data}, {accuracy}, '2025-03-31')"
                )
    
    return records

def main():
    print("-- AgriConnect Comprehensive Sample Data (2025)")
    print("-- Generated for all 13 crops across major Indian markets")
    print()
    
    # Historical prices
    print("-- =====================================================")
    print("-- historical_prices: 90 days of data for all crops")
    print("-- Total records: ~18,720 (13 crops x 16 states x 4 markets x 90 days)")
    print("-- =====================================================")
    print()
    print("INSERT INTO historical_prices (crop, market, state, price, min_price, max_price, unit, arrival_date) VALUES")
    
    historical_records = generate_historical_data()
    
    # Print first 200 records as sample (file would be too large otherwise)
    for i, record in enumerate(historical_records[:200]):
        if i < 199:
            print(f"{record},")
        else:
            print(f"{record};")
    
    print()
    print(f"-- ... ({len(historical_records)} - 200 = {len(historical_records) - 200} more records)")
    print("-- Run the data collection script to generate full dataset")
    print()
    
    # ML Models
    print("-- =====================================================")
    print("-- ml_models: Trained model metadata")
    print("-- =====================================================")
    print()
    print("INSERT INTO ml_models (crop, market, model_data, accuracy, last_trained_date) VALUES")
    
    model_records = generate_ml_models()
    for i, record in enumerate(model_records):
        if i < len(model_records) - 1:
            print(f"{record},")
        else:
            print(f"{record};")
    
    print()
    
    # Predictions
    print("-- =====================================================")
    print("-- predictions: 7-day price forecasts")
    print("-- =====================================================")
    print()
    print("INSERT INTO predictions (crop, market, state, predicted_price, confidence, prediction_date) VALUES")
    
    prediction_records = generate_predictions()
    for i, record in enumerate(prediction_records):
        if i < len(prediction_records) - 1:
            print(f"{record},")
        else:
            print(f"{record};")
    
    print()
    print(f"-- Summary:")
    print(f"-- - Historical prices: ~{len(historical_records)} records")
    print(f"-- - ML models: ~{len(model_records)} records")
    print(f"-- - Predictions: ~{len(prediction_records)} records")

if __name__ == "__main__":
    main()
