#!/usr/bin/env python3
"""
Generate comprehensive 90-day historical price data for AgriConnect ML training
Covers all 13 crops across major Indian markets for 2025
"""

import random
from datetime import datetime, timedelta

# All 13 crops from the project
CROPS = [
    "Rice", "Wheat", "Maize", "Cotton", "Sugarcane", 
    "Soybean", "Potato", "Tomato", "Onion", "Mango", 
    "Mustard", "Bajra", "Jowar"
]

# Major markets by state (simplified for core data)
MARKETS = {
    "Maharashtra": ["Mumbai", "Pune", "Nagpur"],
    "Delhi": ["Delhi"],
    "Punjab": ["Ludhiana", "Amritsar"],
    "Uttar Pradesh": ["Lucknow", "Kanpur"],
    "Madhya Pradesh": ["Indore", "Bhopal"],
    "Rajasthan": ["Jaipur", "Jodhpur"],
    "Gujarat": ["Ahmedabad", "Surat"],
    "Tamil Nadu": ["Chennai", "Coimbatore"],
    "West Bengal": ["Kolkata"],
    "Telangana": ["Hyderabad"],
    "Karnataka": ["Bangalore"]
}

# Base prices (per quintal in INR) - realistic market rates
BASE_PRICES = {
    "Rice": 3500,
    "Wheat": 2400,
    "Maize": 1850,
    "Cotton": 6500,
    "Sugarcane": 350,
    "Soybean": 4300,
    "Potato": 1200,
    "Tomato": 2800,
    "Onion": 2200,
    "Mango": 5800,
    "Mustard": 4900,
    "Bajra": 2150,
    "Jowar": 2400
}

# Price volatility by crop
VOLATILITY = {
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

def generate_price(base, volatility, day, trend=0.001):
    """Generate realistic daily price with trend and noise"""
    trend_factor = 1 + (trend * day)
    noise = random.uniform(-volatility, volatility)
    seasonal = 0.02 * (day % 30) / 30  # Slight monthly seasonality
    price = base * trend_factor * (1 + noise) * (1 + seasonal)
    return round(price, 2)

def main():
    print("-- AgriConnect ML Dataset - 90 Days Historical Prices (2025)")
    print("-- Generated for all 13 crops with realistic market variations")
    print()
    print("INSERT INTO historical_prices (crop, market, state, price, min_price, max_price, unit, arrival_date) VALUES")
    
    all_records = []
    start_date = datetime(2025, 1, 1)
    
    # Generate 90 days for each crop at its primary market
    for crop in CROPS:
        base = BASE_PRICES[crop]
        vol = VOLATILITY[crop]
        
        # Pick primary market (first state, first market)
        primary_state = list(MARKETS.keys())[CROPS.index(crop) % len(MARKETS)]
        primary_market = MARKETS[primary_state][0]
        
        for day in range(90):
            date = start_date + timedelta(days=day)
            date_str = date.strftime('%Y-%m-%d')
            
            price = generate_price(base, vol, day)
            min_p = round(price * random.uniform(0.90, 0.95), 2)
            max_p = round(price * random.uniform(1.05, 1.12), 2)
            
            all_records.append(
                f"('{crop}', '{primary_market}', '{primary_state}', {price}, {min_p}, {max_p}, 'Per Quintal', '{date_str}')"
            )
    
    # Print all records
    for i, record in enumerate(all_records):
        if i < len(all_records) - 1:
            print(f"{record},")
        else:
            print(f"{record};")
    
    print()
    print(f"-- Total records generated: {len(all_records)}")
    print(f"-- Coverage: {len(CROPS)} crops x 90 days = {len(CROPS) * 90} records")
    print("-- Ready for ML training (30+ days threshold met)")

if __name__ == "__main__":
    main()
