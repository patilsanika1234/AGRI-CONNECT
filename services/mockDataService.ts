import { ActivityLog } from '../types';

// Agriculture Market Intelligence Dataset aligned with provided CSV headers
const generateRecords = () => {
    const states = ["Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"];
    const crops = ["Rice", "Wheat", "Maize", "Cotton", "Sugarcane", "Soybean", "Potato", "Tomato", "Onion", "Mango"];
    const markets = ["Azadpur, Delhi", "Vashi, Mumbai", "Koyambedu, Chennai", "Ghazipur, Delhi", "Mechua, Kolkata", "Yeshwanthpur, Bengaluru", "Kothapet, Hyderabad"];
    
    const basePrices: Record<string, number> = {
        "Rice": 2800, "Wheat": 2400, "Maize": 2000, "Cotton": 7500, "Sugarcane": 350,
        "Soybean": 5000, "Potato": 1500, "Tomato": 2000, "Onion": 3000, "Mango": 6000
    };

    const dates = [
        "2024-01-15", "2024-04-15", "2024-07-15", "2024-10-15",
        "2025-01-15", "2025-04-15"
    ];

    const records = [];
    
    for (const state of states) {
        for (const crop of crops) {
            for (const date of dates) {
                const market = markets[Math.floor(Math.random() * markets.length)];
                const base = basePrices[crop];
                
                const variance = 1 + (Math.random() * 0.2 - 0.1); 
                const modal = Math.round(base * variance);
                const min = Math.round(modal * 0.9);
                const max = Math.round(modal * 1.1);
                const production = 800 + Math.round(Math.random() * 2000);
                const sales = (modal * production) / 10;
                const profit = Math.round(sales * 0.15);
                
                records.push({
                    State: state,
                    Market: market,
                    Commodity: crop,
                    Arrival_Date: date,
                    Modal_Price: modal,
                    Min_Price: min,
                    Max_Price: max,
                    Production: production,
                    Profit: profit,
                    Sales: sales,
                    Month: new Date(date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                });
            }
        }
    }
    return records;
};

const masterData = generateRecords();

export const parseCSV = () => masterData;

export const getFilteredDataset = (filters: { state: string; crop: string; market: string }) => {
    const data = masterData;
    const selected_state = filters.state.trim().toLowerCase();
    const selected_crop = filters.crop.trim().toLowerCase();
    const selected_market = filters.market.trim().toLowerCase();

    return data.filter(d => {
        const matchState = selected_state === 'all states' || d.State.toLowerCase() === selected_state;
        const matchCrop = selected_crop === 'all crops' || d.Commodity.toLowerCase() === selected_crop;
        const matchMarket = selected_market === 'all markets' || d.Market.toLowerCase() === selected_market;
        return matchState && matchCrop && matchMarket;
    });
};

export const getUniqueStates = () => Array.from(new Set(masterData.map(d => d.State))).sort();
export const getUniqueCrops = () => Array.from(new Set(masterData.map(d => d.Commodity))).sort();
export const getUniqueMarkets = () => Array.from(new Set(masterData.map(d => d.Market))).sort();

export const getSalesTrendsData = (filters: any) => {
    const filtered = getFilteredDataset(filters);
    const grouped = filtered.reduce((acc: any, curr) => {
        const month = curr.Month;
        if (!acc[month]) acc[month] = { name: month, Sales: 0, Profit: 0 };
        acc[month].Sales += curr.Sales;
        acc[month].Profit += curr.Profit;
        return acc;
    }, {});
    return Object.values(grouped).sort((a: any, b: any) => {
        return new Date(a.name).getTime() - new Date(b.name).getTime();
    });
};

export const getCropDistributionData = (filters: any) => {
    const filtered = getFilteredDataset(filters);
    const grouped = filtered.reduce((acc: any, curr) => {
        const crop = curr.Commodity;
        if (!acc[crop]) acc[crop] = { name: crop, value: 0 };
        acc[crop].value += curr.Production;
        return acc;
    }, {});
    return Object.values(grouped);
};

export const getMarketSalesPerformance = (filters: any) => {
    const filtered = getFilteredDataset(filters);
    const grouped = filtered.reduce((acc: any, curr) => {
        const market = curr.Market.split(',')[0];
        if (!acc[market]) acc[market] = { name: market, Sales: 0 };
        acc[market].Sales += curr.Sales;
        return acc;
    }, {});
    return Object.values(grouped).sort((a: any, b: any) => b.Sales - a.Sales);
};

export const getEfficiencyMatrixData = (filters: any) => {
    const filtered = getFilteredDataset(filters);
    return filtered.slice(0, 50).map(d => ({
        x: d.Production,
        y: d.Profit,
        crop: d.Commodity,
        price: d.Modal_Price / 100
    }));
};

export const getMarketPriceTrends = (filters: any) => {
    const filtered = getFilteredDataset(filters);
    const grouped = filtered.reduce((acc: any, curr) => {
        const month = curr.Month;
        if (!acc[month]) acc[month] = { name: month, Index: 0, count: 0 };
        const pricePerKg = curr.Modal_Price / 100;
        acc[month].Index += pricePerKg;
        acc[month].count += 1;
        return acc;
    }, {});

    return Object.values(grouped).map((g: any) => {
        const avg = g.Index / g.count;
        return {
            name: g.name,
            Index: Math.round(avg * 100) / 100,
            Forecast: Math.round(avg * (1 + (Math.random() * 0.1 - 0.05)) * 100) / 100
        };
    }).sort((a: any, b: any) => new Date(a.name).getTime() - new Date(b.name).getTime());
};

export const STATE_CLIMATE_MAP: Record<string, string> = {
    "Andhra Pradesh": "Tropical",
    "Arunachal Pradesh": "Mountain",
    "Assam": "Tropical Wet",
    "Bihar": "Humid Subtropical",
    "Chhattisgarh": "Tropical",
    "Goa": "Tropical Wet",
    "Gujarat": "Arid",
    "Haryana": "Semi-Arid",
    "Himachal Pradesh": "Mountain",
    "Jharkhand": "Humid Subtropical",
    "Karnataka": "Tropical",
    "Kerala": "Tropical Wet",
    "Madhya Pradesh": "Tropical",
    "Maharashtra": "Tropical Wet & Dry",
    "Manipur": "Humid Subtropical",
    "Meghalaya": "Tropical Wet",
    "Mizoram": "Tropical Wet",
    "Nagaland": "Tropical Wet",
    "Odisha": "Tropical",
    "Punjab": "Semi-Arid",
    "Rajasthan": "Arid",
    "Sikkim": "Mountain",
    "Tamil Nadu": "Tropical",
    "Telangana": "Tropical",
    "Tripura": "Tropical Wet",
    "Uttar Pradesh": "Humid Subtropical",
    "Uttarakhand": "Mountain",
    "West Bengal": "Tropical Wet"
};

export const AGRONOMIC_DATA: Record<string, any> = {
    "Rice": { soil: ["Alluvial", "Clayey"], n_kg: 100, p_kg: 50, k_kg: 50, water_mm: 1200, irrigation_sessions: 20, climate: "Tropical Wet", temp_range: "20-35°C", spacing: "20x15 cm" },
    "Wheat": { soil: ["Alluvial", "Clayey"], n_kg: 120, p_kg: 60, k_kg: 40, water_mm: 400, irrigation_sessions: 6, climate: "Cool & Dry", temp_range: "10-25°C", spacing: "22.5 cm rows" },
    "Maize": { soil: ["Alluvial", "Red", "Black"], n_kg: 120, p_kg: 60, k_kg: 40, water_mm: 600, irrigation_sessions: 8, climate: "Tropical", temp_range: "18-32°C", spacing: "60x20 cm" },
    "Cotton": { soil: ["Black", "Alluvial"], n_kg: 100, p_kg: 50, k_kg: 50, water_mm: 800, irrigation_sessions: 10, climate: "Tropical", temp_range: "21-30°C", spacing: "90x60 cm" },
    "Sugarcane": { soil: ["Alluvial", "Black"], n_kg: 250, p_kg: 100, k_kg: 125, water_mm: 2000, irrigation_sessions: 25, climate: "Tropical", temp_range: "20-35°C", spacing: "90-120 cm rows" },
    "Soybean": { soil: ["Black", "Alluvial"], n_kg: 30, p_kg: 60, k_kg: 40, water_mm: 500, irrigation_sessions: 4, climate: "Tropical", temp_range: "15-32°C", spacing: "45x5 cm" },
    "Potato": { soil: ["Alluvial", "Sandy Loam"], n_kg: 150, p_kg: 100, k_kg: 120, water_mm: 500, irrigation_sessions: 8, climate: "Cool & Dry", temp_range: "15-25°C", spacing: "60x20 cm" },
    "Tomato": { soil: ["Alluvial", "Sandy Loam", "Red"], n_kg: 100, p_kg: 80, k_kg: 60, water_mm: 600, irrigation_sessions: 12, climate: "Tropical", temp_range: "20-28°C", spacing: "60x45 cm" },
    "Onion": { soil: ["Sandy Loam", "Clayey"], n_kg: 120, p_kg: 50, k_kg: 80, water_mm: 400, irrigation_sessions: 15, climate: "Cool & Dry", temp_range: "15-30°C", spacing: "15x10 cm" },
    "Mango": { soil: ["Alluvial", "Laterite", "Red"], n_kg: 100, p_kg: 50, k_kg: 100, water_mm: 1000, irrigation_sessions: 10, climate: "Tropical", temp_range: "24-30°C", spacing: "10x10 m" }
};

export const getCropAgronomicData = (crop: string) => AGRONOMIC_DATA[crop] || null;
