
import React, { useState, useEffect } from 'react';
import Card from '../common/Card';
import Select from '../common/Select';
import Button from '../common/Button';
import Loader from '../common/Loader';
import { fetch_available_metadata, backendBridge } from '../../services/marketIntelligenceService';
import { LivePriceResult } from '../../services/geminiService';
import { addLog } from '../../services/activityService';
import { useAuth } from '../../hooks/useAuth';
import { useLanguage } from '../../contexts/LanguageContext';
import { getCropIcon } from '../../utils/cropIcons';

const MarketIntelligence: React.FC = () => {
  const { user } = useAuth();
  const { t, fNum, translateDynamic } = useLanguage();
  
  // Helper functions to translate with proper prefixes and icons
  const translateCrop = (crop: string): string => {
    if (!crop) return crop;
    const icon = getCropIcon(crop);
    const key = `crop_${crop}`;
    const translated = t(key);
    const name = translated !== key ? translated : crop;
    return `${icon} ${name}`;
  };
  
  const translateState = (state: string): string => {
    if (!state) return state;
    const key = `state_${state}`;
    const translated = t(key);
    return translated !== key ? translated : state;
  };
  
  const translateMarket = (market: string): string => {
    if (!market) return market;
    // First try direct translation of the full market key
    const fullKey = `market_${market}`;
    const fullTrans = t(fullKey);
    if (fullTrans !== fullKey) return fullTrans;
    
    // If no direct translation, split by comma and translate parts
    const parts = market.split(',').map(p => p.trim());
    const translatedParts = parts.map(part => {
      // Try market key first
      const marketKey = `market_${part}`;
      const marketTrans = t(marketKey);
      if (marketTrans !== marketKey) return marketTrans;
      
      // Then try state key
      const stateKey = `state_${part}`;
      const stateTrans = t(stateKey);
      if (stateTrans !== stateKey) return stateTrans;
      
      // Return original if no translation found
      return part;
    });
    return translatedParts.join(', ');
  };
  
  const [options, setOptions] = useState<{crops: string[], markets: string[], states: string[]}>({
    crops: [], markets: [], states: []
  });
  
  const [selection, setSelection] = useState({ crop: '', market: '', state: '' });
  const [intel, setIntel] = useState<LivePriceResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [isMetaLoading, setIsMetaLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMeta = async () => {
      setIsMetaLoading(true);
      const meta = await fetch_available_metadata();
      setOptions(meta);
      if (meta.crops.length > 0) {
        setSelection({ crop: meta.crops[0], state: meta.states[0], market: meta.markets[0] });
      }
      setIsMetaLoading(false);
    };
    loadMeta();
  }, []);

  const handleAnalyze = async () => {
    setLoading(true);
    setError(null);
    setIntel(null);
    
    if (user) addLog(user.name, `Scrape Request: ${selection.crop}`, 'Market Intelligence');

    try {
      const result = await backendBridge.fetchMandiData(selection.crop, selection.market, selection.state);
      setIntel(result);
    } catch (err: any) {
      setError("Market data currently unavailable. Please verify your internet connection or API availability.");
    } finally {
      setLoading(false);
    }
  };

  const getVerdictColor = (verdict: string) => {
    const v = verdict.toUpperCase();
    if (v.includes('SELL')) return 'bg-emerald-600 border-emerald-500';
    if (v.includes('HOLD')) return 'bg-amber-600 border-amber-500';
    return 'bg-blue-600 border-blue-500';
  };

  return (
    <div className="space-y-8 pb-12 animate-fade-in max-w-7xl mx-auto px-4">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-3">
          <h1 className="text-4xl sm:text-5xl font-black text-gray-900 dark:text-white tracking-tighter italic uppercase leading-none">
            {t('market_intel_title')}
          </h1>
          <div className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800 shadow-sm">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            <span className="text-emerald-700 dark:text-emerald-400 text-[10px] font-black uppercase tracking-tighter">AI Node Active</span>
          </div>
        </div>
        <p className="text-gray-500 dark:text-gray-400 font-bold text-sm uppercase tracking-widest">
          {t('market_intel_subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4">
          <Card className="border border-gray-100 dark:border-slate-700 shadow-2xl !p-6 bg-white dark:bg-slate-800 h-fit">
            <h3 className="text-[11px] font-black text-primary-600 uppercase tracking-[0.2em] mb-6 border-b border-primary-100 dark:border-primary-900/30 pb-3">Selection Gateway</h3>
            {isMetaLoading ? <Loader /> : (
              <div className="space-y-6">
                <Select label={t('filter_commodity')} options={options.crops} renderOption={translateCrop} value={selection.crop} onChange={e => setSelection({...selection, crop: e.target.value})} />
                <Select label={t('filter_state_region')} options={options.states} renderOption={translateState} value={selection.state} onChange={e => setSelection({...selection, state: e.target.value})} />
                <Select label={t('filter_mandi')} options={options.markets} renderOption={translateMarket} value={selection.market} onChange={e => setSelection({...selection, market: e.target.value})} />
                <Button onClick={handleAnalyze} disabled={loading} className="w-full py-5 rounded-[1.5rem] text-xl font-black shadow-xl shadow-primary-500/30 active:scale-95 transition-all">
                  {loading ? 'Processing...' : 'Fetch Agmarknet Advice'}
                </Button>
              </div>
            )}
          </Card>
        </div>

        <div className="lg:col-span-8">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full min-h-[500px] bg-white dark:bg-slate-800 rounded-[3rem] border-4 border-dashed border-gray-100 dark:border-slate-700">
              <Loader />
              <div className="mt-8 text-center px-10">
                <p className="font-black text-primary-600 animate-pulse uppercase text-lg tracking-widest italic">Scanning Official Agmarknet Portal...</p>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2">Connecting to Grounded Intelligence Nodes</p>
              </div>
            </div>
          ) : intel ? (
            <div className="space-y-6 animate-fade-in">
              <Card className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl overflow-hidden p-6">
                <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
                  <div>
                    <span className="text-xs font-bold text-emerald-600 uppercase">{intel.source}</span>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{translateCrop(intel.crop)}</h2>
                    <p className="text-sm text-gray-500">{translateMarket(intel.market)}, {translateState(intel.state)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400">{t('date')}</p>
                    <p className="font-bold text-gray-700 dark:text-gray-300">{intel.arrivalDate}</p>
                  </div>
                </div>
                
                <div className="text-center py-6 border-y border-gray-100 dark:border-slate-700">
                  <p className="text-xs text-gray-400 uppercase mb-1">{t('modal_price')} ({t('per_kg')})</p>
                  <p className="text-5xl font-bold text-primary-600">₹{fNum(intel.pricePerKg)}</p>
                  <p className="text-sm text-gray-500 mt-2">₹{fNum(intel.price)} / {t('quintal')}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="p-4 bg-gray-50 dark:bg-slate-900 rounded-lg text-center">
                    <p className="text-xs text-gray-400 uppercase mb-1">{t('min')}</p>
                    <p className="text-xl font-bold text-gray-700 dark:text-gray-300">₹{fNum(intel.minPricePerKg)}/{t('kg')}</p>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-slate-900 rounded-lg text-center">
                    <p className="text-xs text-gray-400 uppercase mb-1">{t('max')}</p>
                    <p className="text-xl font-bold text-gray-700 dark:text-gray-300">₹{fNum(intel.maxPricePerKg)}/{t('kg')}</p>
                  </div>
                </div>
              </Card>

              <Card className={`p-6 rounded-xl ${getVerdictColor(intel.recommendation.optimalSellingStrategy.recommendation)} text-white`}>
                <p className="text-xs uppercase opacity-80 mb-1">{t('recommendation')}</p>
                <p className="text-2xl font-bold mb-3">{translateDynamic(intel.recommendation.optimalSellingStrategy.recommendation)}</p>
                <p className="text-sm opacity-90">{translateDynamic(intel.recommendation.optimalSellingStrategy.advice)}</p>
              </Card>

              <div className="flex flex-wrap gap-2">
                {intel.groundingSources?.map((s, i) => (
                  <a key={i} href={s.uri} target="_blank" rel="noreferrer" className="text-xs text-blue-600 hover:underline">
                    {s.title}
                  </a>
                ))}
              </div>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-full min-h-[500px] text-center p-12 bg-red-50 dark:bg-red-900/10 rounded-[3rem] border-4 border-dashed border-red-200 dark:border-red-900/30">
              <div className="text-[100px] mb-6">⚙️</div>
              <h3 className="text-3xl font-black text-red-800 dark:text-red-400 mb-2 italic tracking-tighter uppercase">Service Issue</h3>
              <p className="text-red-600 dark:text-red-500 font-bold uppercase tracking-widest text-xs max-w-sm leading-relaxed whitespace-pre-line">{error}</p>
              <Button onClick={handleAnalyze} className="mt-10 !bg-red-600 !px-10 !py-4 shadow-xl shadow-red-500/30">Retry Scrape</Button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full min-h-[500px] text-center p-12 bg-white dark:bg-slate-800 rounded-[3rem] border-4 border-dashed border-gray-100 dark:border-slate-700">
              <div className="text-[120px] mb-6 opacity-20 grayscale">🔭</div>
              <h3 className="text-3xl font-black text-gray-800 dark:text-white mb-2 italic tracking-tighter uppercase">Intelligence Node Ready</h3>
              <p className="text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest text-sm max-w-sm leading-relaxed">
                Configure your request on the left. The AI Node will perform a real-time Mandi search specifically via Agmarknet and return an optimal selling strategy.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MarketIntelligence;
