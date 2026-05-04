import React, { useState, useEffect, useMemo } from 'react';
import Card from '../common/Card';
import Select from '../common/Select';
import Button from '../common/Button';
import Loader from '../common/Loader';
import { getCropIcon } from '../../utils/cropIcons';
import { getCrops, getStates, getMarkets } from '../../services/dataService';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../hooks/useAuth';
import { addLog } from '../../services/activityService';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

const API_BASE_URL = 'http://localhost:5000/api';

interface HistoricalPrice {
  date: string;
  price: number;
  modalPrice: number;
  minPrice: number;
  maxPrice: number;
}

interface PredictionResult {
  crop?: string;
  market?: string;
  state?: string;
  currentPrice?: number;
  historicalData: HistoricalPrice[];
  predictions: { date: string; predictedPrice: number; confidence: number; minPrice?: number; maxPrice?: number }[];
  trend: 'upward' | 'downward' | 'stable';
  recommendation: string;
  nextWeekPrice: number;
  nextMonthPrice: number;
  confidence?: number;
}

class LinearRegression {
  private slope: number = 0;
  private intercept: number = 0;

  fit(X: number[], y: number[]) {
    const n = X.length;
    const sumX = X.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = X.reduce((acc, xi, i) => acc + xi * y[i], 0);
    const sumXX = X.reduce((acc, xi) => acc + xi * xi, 0);

    this.slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    this.intercept = (sumY - this.slope * sumX) / n;
  }

  predict(X: number[]): number[] {
    return X.map(xi => this.slope * xi + this.intercept);
  }
}

// Deterministic pseudo-random generator seeded from string
const seededRandom = (seed: string): (() => number) => {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  
  return () => {
    hash = (hash * 9301 + 49297) % 233280;
    return Math.abs(hash) / 233280;
  };
};

const fetchHistoricalPrices = async (crop: string, market: string, state: string): Promise<HistoricalPrice[]> => {
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Create deterministic seed from inputs
  const seedKey = `${crop}-${market}-${state}`;
  const random = seededRandom(seedKey);
  
  const basePrice = 2000 + random() * 3000;
  const data: HistoricalPrice[] = [];
  const today = new Date();
  
  for (let i = 89; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
    const seasonalFactor = Math.sin(dayOfYear * 2 * Math.PI / 365) * 0.15;
    const randomFactor = (random() - 0.5) * 0.1;
    const trendFactor = (90 - i) * 0.002;
    
    const priceMultiplier = 1 + seasonalFactor + randomFactor + trendFactor;
    const modalPrice = Math.round(basePrice * priceMultiplier);
    
    data.push({
      date: date.toISOString().split('T')[0],
      price: modalPrice,
      modalPrice: modalPrice,
      minPrice: Math.round(modalPrice * 0.9),
      maxPrice: Math.round(modalPrice * 1.1)
    });
  }
  
  return data;
};

const predictPrices = (historicalData: HistoricalPrice[]): PredictionResult => {
  const model = new LinearRegression();
  
  const recentData = historicalData.slice(-60);
  const X = recentData.map((_, i) => i);
  const y = recentData.map(d => d.modalPrice);
  
  model.fit(X, y);
  
  const predictions = [];
  const today = new Date();
  
  for (let i = 1; i <= 30; i++) {
    const predictedPrice = model.predict([X.length - 1 + i])[0];
    const date = new Date(today);
    date.setDate(date.getDate() + i);
    
    const confidence = Math.max(0.6, 1 - (i * 0.02));
    
    predictions.push({
      date: date.toISOString().split('T')[0],
      predictedPrice: Math.round(predictedPrice),
      confidence: Math.round(confidence * 100)
    });
  }
  
  const firstWeek = predictions.slice(0, 7);
  const lastWeek = predictions.slice(-7);
  const avgFirst = firstWeek.reduce((a, b) => a + b.predictedPrice, 0) / firstWeek.length;
  const avgLast = lastWeek.reduce((a, b) => a + b.predictedPrice, 0) / lastWeek.length;
  
  let trend: 'upward' | 'downward' | 'stable';
  const changePercent = ((avgLast - avgFirst) / avgFirst) * 100;
  
  if (changePercent > 3) trend = 'upward';
  else if (changePercent < -3) trend = 'downward';
  else trend = 'stable';
  
  let recommendation = '';
  if (trend === 'upward') {
    recommendation = `Strong upward trend predicted (${changePercent.toFixed(1)}% increase). Consider holding inventory for better prices.`;
  } else if (trend === 'downward') {
    recommendation = `Downward price trend expected (${Math.abs(changePercent).toFixed(1)}% decrease). Recommend selling soon to lock current prices.`;
  } else {
    recommendation = 'Prices expected to remain stable. Monitor market closely for optimal selling windows.';
  }
  
  return {
    historicalData,
    predictions,
    trend,
    recommendation,
    nextWeekPrice: predictions[6].predictedPrice,
    nextMonthPrice: predictions[29].predictedPrice
  };
};

const Predictory: React.FC = () => {
  const { user } = useAuth();
  const { t, translateDynamic, fNum } = useLanguage();
  
  // Helper to translate crop with icon
  const translateCrop = (crop: string): string => {
    if (!crop) return crop;
    const icon = getCropIcon(crop);
    const key = `crop_${crop}`;
    const translated = t(key);
    const name = translated !== key ? translated : crop;
    return `${icon} ${name}`;
  };
  
  // Helper to translate trend values
  const translateTrend = (trend: string): string => {
    if (trend === 'upward') return t('trend_upward');
    if (trend === 'downward') return t('trend_downward');
    if (trend === 'stable') return t('trend_stable');
    return trend;
  };

  // Helper to translate state
  const translateState = (state: string): string => {
    if (!state) return state;
    const key = `state_${state}`;
    const translated = t(key);
    return translated !== key ? translated : state;
  };

  // Helper to translate market
  const translateMarket = (market: string): string => {
    if (!market) return market;
    const key = `market_${market}`;
    const translated = t(key);
    return translated !== key ? translated : market;
  };
  
  const [crops, setCrops] = useState<string[]>([]);
  const [states, setStates] = useState<string[]>([]);
  const [markets, setMarkets] = useState<string[]>([]);
  const [selection, setSelection] = useState({ crop: '', state: '', market: '' });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    setCrops(getCrops());
    setStates(getStates());
    setMarkets(getMarkets());
  }, []);
  
  const handlePredict = async () => {
    if (!selection.crop || !selection.state || !selection.market) {
      setError(t('fill_all_fields'));
      return;
    }
    
    setLoading(true);
    setError(null);
    setResult(null);
    
    if (user) addLog(user.name, `Price Prediction: ${selection.crop}`, 'Predictory');
    
    try {
      // Get ML prediction from backend
      const predictionResponse = await fetch(
        `${API_BASE_URL}/predictions/predict/${encodeURIComponent(selection.crop)}/${encodeURIComponent(selection.market)}?state=${encodeURIComponent(selection.state)}&days=7`
      );
      
      if (!predictionResponse.ok) {
        const errorData = await predictionResponse.json();
        throw new Error(errorData.error || 'Prediction failed');
      }
      
      const predictionData = await predictionResponse.json();
      
      console.log('Prediction data received:', predictionData); // Debug log
      
      // Transform to match existing format with error handling
      if (!predictionData.predictions || !Array.isArray(predictionData.predictions)) {
        throw new Error('Invalid prediction data received');
      }
      
      const transformedResult: PredictionResult = {
        crop: predictionData.crop || selection.crop,
        market: predictionData.market || selection.market,
        state: predictionData.state || selection.state,
        currentPrice: predictionData.currentPrice || 0,
        predictions: predictionData.predictions.map((p: any, index: number) => ({
          date: p.date || `Day ${index + 1}`,
          predictedPrice: p.predictedPrice || 0,
          confidence: p.confidence || 0.5,
          minPrice: p.minPrice || p.predictedPrice || 0,
          maxPrice: p.maxPrice || p.predictedPrice || 0
        })),
        trend: predictionData.trend || 'stable',
        confidence: predictionData.confidence || 0.5,
        historicalData: [], // Will be fetched separately if needed
        recommendation: predictionData.trend === 'upward' ? 'Buy' : predictionData.trend === 'downward' ? 'Sell' : 'Hold',
        nextWeekPrice: predictionData.predictions[0]?.predictedPrice || 0,
        nextMonthPrice: predictionData.predictions[6]?.predictedPrice || predictionData.predictions[predictionData.predictions.length - 1]?.predictedPrice || 0
      };
      
      console.log('Transformed result:', transformedResult); // Debug log
      setResult(transformedResult);
    } catch (err: any) {
      setError(err.message || t('prediction_failed'));
    } finally {
      setLoading(false);
    }
  };
  
  const chartData = useMemo(() => {
    if (!result || !result.predictions) return [];
    
    // Handle empty historical data by using currentPrice as starting point
    const startingPrice = result.currentPrice || result.predictions[0]?.predictedPrice || 0;
    
    const historical = result.historicalData && result.historicalData.length > 0 
      ? result.historicalData.slice(-30).map(d => ({
          date: d.date.slice(5),
          price: d.price,
          type: 'Historical'
        }))
      : [];
    
    const predicted = result.predictions.map((d, i) => ({
      date: d.date.slice(5),
      price: i === 0 && historical.length === 0 ? startingPrice : d.predictedPrice,
      type: 'Predicted',
      confidence: d.confidence
    }));
    
    return [...historical, ...predicted];
  }, [result]);
  
  const getTrendColor = (trend: string) => {
    if (trend === 'upward') return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (trend === 'downward') return 'text-red-600 bg-red-50 border-red-200';
    return 'text-amber-600 bg-amber-50 border-amber-200';
  };
  
  return (
    <div className="space-y-8 pb-12 animate-fade-in max-w-7xl mx-auto px-4">
      <div className="flex flex-col gap-1">
        <h1 className="text-4xl sm:text-5xl font-black text-gray-900 dark:text-white tracking-tighter italic uppercase leading-none">
          {t('predictory_title')}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 font-bold text-sm uppercase tracking-widest">
          {t('predictory_subtitle')}
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4">
          <Card className="border border-gray-100 dark:border-slate-700 shadow-2xl !p-6 bg-white dark:bg-slate-800 h-fit">
            <h3 className="text-[11px] font-black text-primary-600 uppercase tracking-[0.2em] mb-6 border-b border-primary-100 dark:border-primary-900/30 pb-3">
              ML Prediction Gateway
            </h3>
            <div className="space-y-6">
              <Select 
                label={t('filter_commodity')} 
                options={crops} 
                renderOption={translateCrop} 
                value={selection.crop} 
                onChange={e => setSelection({...selection, crop: e.target.value})} 
              />
              <Select 
                label={t('filter_state_region')} 
                options={states} 
                renderOption={translateState} 
                value={selection.state} 
                onChange={e => setSelection({...selection, state: e.target.value})} 
              />
              <Select 
                label={t('filter_mandi')} 
                options={markets} 
                renderOption={translateMarket} 
                value={selection.market} 
                onChange={e => setSelection({...selection, market: e.target.value})} 
              />
              <Button 
                onClick={handlePredict} 
                disabled={loading} 
                className="w-full py-5 rounded-[1.5rem] text-xl font-black shadow-xl shadow-primary-500/30 active:scale-95 transition-all"
              >
                {loading ? 'Analyzing Trends...' : 'Predict Future Prices'}
              </Button>
              
              {error && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800">
                  <p className="text-red-600 dark:text-red-400 text-sm font-bold">{error}</p>
                </div>
              )}
            </div>
            
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
              <p className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-2">ML Model Info</p>
              <p className="text-xs text-blue-700 dark:text-blue-300">
                Uses Linear Regression on 90 days of Agmarknet historical data to predict prices for the next 30 days.
              </p>
            </div>
          </Card>
        </div>
        
        <div className="lg:col-span-8">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full min-h-[400px] bg-gray-50 dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700">
              <Loader />
              <p className="mt-4 text-gray-500">{t('analyzing_trends')}</p>
            </div>
          ) : result ? (
            <div className="space-y-4">
              <Card className={`p-4 rounded-lg ${getTrendColor(result.trend)}`}>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-xs uppercase opacity-70">{t('trend')}</p>
                    <p className="text-xl font-bold capitalize">{translateTrend(result.trend)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs uppercase opacity-70">{t('confidence')}</p>
                    <p className="text-lg font-bold">{fNum((result.confidence || 0) * 100, { maximumFractionDigits: 0 })}%</p>
                  </div>
                </div>
                <p className="mt-2 text-sm">{result.recommendation}</p>
              </Card>
              
              <div className="grid grid-cols-2 gap-3">
                <Card className="p-4 bg-primary-50 dark:bg-primary-900/20 border border-primary-200 rounded-lg">
                  <p className="text-xs text-primary-600 uppercase">{t('next_week')}</p>
                  <p className="text-2xl font-bold text-primary-700">₹{fNum(result.nextWeekPrice)}</p>
                  <p className="text-xs text-primary-600">{t('per_quintal')}</p>
                </Card>
                <Card className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 rounded-lg">
                  <p className="text-xs text-indigo-600 uppercase">{t('next_month')}</p>
                  <p className="text-2xl font-bold text-indigo-700">₹{fNum(result.nextMonthPrice)}</p>
                  <p className="text-xs text-indigo-600">{t('per_quintal')}</p>
                </Card>
              </div>
              
              <Card className="p-4 border border-gray-200 dark:border-slate-700 rounded-lg">
                <h3 className="text-sm font-bold mb-3">{t('price_forecast')}</h3>
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="date" stroke="#6b7280" tick={{fontSize: 10}} />
                      <YAxis stroke="#6b7280" tick={{fontSize: 10}} tickFormatter={(v) => `₹${fNum(v)}`} />
                      <Tooltip formatter={(value: number) => [`₹${fNum(value)}`, 'Price']} />
                      <Line type="monotone" dataKey="price" stroke="#16a34a" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex items-center justify-center gap-4 mt-2">
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                    <span className="text-xs text-gray-600">{t('historical')}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    <span className="text-xs text-gray-600">{t('predicted')}</span>
                  </div>
                </div>
              </Card>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full min-h-[300px] bg-gray-50 dark:bg-slate-800/50 rounded-xl border border-gray-200 dark:border-slate-700">
              <span className="text-4xl mb-3">🔮</span>
              <p className="text-gray-400">{t('select_crop_market')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Predictory;
