
import React, { useState, useEffect } from 'react';
import Card from '../common/Card';
import Select from '../common/Select';
import Button from '../common/Button';
import Loader from '../common/Loader';
import { Icon } from '../common/Icon';
import { getCropIcon } from '../../utils/cropIcons';
import { getStates, getCrops } from '../../services/dataService';
import { getCropAdvisory } from '../../services/geminiService';
import { useAuth } from '../../hooks/useAuth';
import { useLanguage } from '../../contexts/LanguageContext';
import { CropAdvisoryRecommendation } from '../../types';

const ADVISORY_TOPICS = ["Fertilizer, Water & Pesticides"];
const SOIL_TYPES = ["Alluvial", "Black (Regur)", "Red & Yellow", "Laterite", "Arid/Desert", "Saline/Alkaline", "Peaty/Marshy"];

const getSoilIcon = (soilType: string) => {
  if (soilType.includes('Black')) return '🪨';
  if (soilType.includes('Red')) return '🧱';
  if (soilType.includes('Laterite')) return '🟫';
  if (soilType.includes('Arid') || soilType.includes('Desert')) return '🏜️';
  if (soilType.includes('Peaty')) return '🌿';
  return '🌱';
};

const CropInsights: React.FC = () => {
  const { user } = useAuth();
  const { t, language, languageName, translateDynamic, fNum } = useLanguage();
  
  // Helper functions for translation with icons
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
  
  const [states, setStates] = useState<string[]>([]);
  const [crops, setCrops] = useState<string[]>([]);
  
  const [farmProfile, setFarmProfile] = useState({
    crop: '', 
    state: user?.state || '', 
    soilType: SOIL_TYPES[0]
  });
  
  const [insightData, setInsightData] = useState<{ recommendation: CropAdvisoryRecommendation, sources: any[] } | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const s = getStates();
    const c = getCrops();
    setStates(s);
    setCrops(c);
    setFarmProfile(prev => ({
      ...prev,
      crop: c[0] || '',
      state: prev.state || (s.includes('Maharashtra') ? 'Maharashtra' : s[0]) || ''
    }));
  }, []);

  const handleGenerateInsights = async () => {
    if (!farmProfile.crop || !farmProfile.state) return;
    setIsAnalyzing(true);
    setInsightData(null); // Explicitly clear old data
    setError(null);
    
    try {
      const result = await getCropAdvisory(
        farmProfile.crop, 
        'Fertilizer, Water & Pesticides', 
        farmProfile.state, 
        languageName, 
        '1.0',
        farmProfile.soilType
      );
      setInsightData(result);
    } catch (err) {
      setError(t('analysis_engine_offline'));
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Helper to translate resource type using translation keys
  const translateResourceType = (type: string): string => {
    if (!type) return type;
    const lower = type.toLowerCase();
    if (lower.includes('water')) return t('resource_water');
    if (lower.includes('fertilizer')) return t('resource_fertilizer');
    if (lower.includes('pesticide')) return t('resource_pesticides');
    if (lower.includes('soil')) return t('resource_soil');
    if (lower.includes('season')) return t('resource_season');
    return type;
  };
  const getResourceIcon = (type: string): string => {
    const lower = type.toLowerCase();
    if (lower.includes('water') || lower.includes('pani') || lower.includes('pāni')) return '💧';
    if (lower.includes('fertilizer') || lower.includes('khad') || lower.includes('khata')) return '🧪';
    if (lower.includes('pesticide') || lower.includes('pest') || lower.includes('aushad')) return '📦';
    if (lower.includes('soil') || lower.includes('mati') || lower.includes('jami')) return '🪴';
    if (lower.includes('season') || lower.includes('ritu') || lower.includes('hanga')) return '📅';
    return '📦';
  };

  // Helper to translate step titles from API to local translations
  const getStepTitle = (title: string): string => {
    const lower = title.toLowerCase();
    if (lower.includes('preparation')) return t('step_preparation_title');
    if (lower.includes('sowing') || lower.includes('planting')) return t('step_sowing_title');
    if (lower.includes('growth') || lower.includes('vegetative')) return t('step_growth_title');
    if (lower.includes('harvest') || lower.includes('reaping')) return t('step_harvest_title');
    if (lower.includes('fertilizer') || lower.includes('basal')) return t('step_growth_title');
    if (lower.includes('irrigation') || lower.includes('water')) return t('step_growth_title');
    if (lower.includes('pest') || lower.includes('disease')) return t('step_growth_title');
    return title;
  };

  // Helper to format numbers with locale
  const formatNum = (num: number | string): string => {
    if (typeof num === 'string') return num;
    return fNum(num);
  };

  return (
    <div className="space-y-8 pb-12 animate-fade-in max-w-7xl mx-auto px-4">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-3">
          <h1 className="text-4xl sm:text-5xl font-black text-gray-900 dark:text-white tracking-tighter italic uppercase leading-none">
            {t('crop_insights_title')}
          </h1>
          <div className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 px-3 py-1 rounded-full border border-blue-200 dark:border-blue-800">
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
            <span className="text-blue-700 dark:text-blue-400 text-[10px] font-black uppercase tracking-tighter">{t('scientific_agronomy')}</span>
          </div>
        </div>
        <p className="text-gray-500 dark:text-gray-400 font-bold text-sm uppercase tracking-widest">
          {t('crop_insights_subtitle')}
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-6">
          <Card className="border border-gray-100 dark:border-slate-700 shadow-2xl !p-6 bg-white dark:bg-slate-800">
            <h3 className="text-[11px] font-black text-primary-600 uppercase tracking-[0.2em] mb-6 border-b border-primary-100 dark:border-primary-900/30 pb-3">{t('scientific_setup')}</h3>
            <div className="space-y-6">
              <Select icon="crop" label={t('commodity_focus')} options={crops} renderOption={translateCrop} value={farmProfile.crop} onChange={e => {
                setFarmProfile({...farmProfile, crop: e.target.value});
                setInsightData(null);
              }} />
              
              <Select icon="soil" label={t('soil_type')} options={SOIL_TYPES} renderOption={(opt) => `${getSoilIcon(opt)} ${translateDynamic(opt)}`} value={farmProfile.soilType} onChange={e => { setFarmProfile({...farmProfile, soilType: e.target.value}); setInsightData(null); }} />
              
              <Select icon="state" label={t('state_region')} options={states} renderOption={translateState} value={farmProfile.state} onChange={e => { setFarmProfile({...farmProfile, state: e.target.value}); setInsightData(null); }} />
              
              <Button icon="search" onClick={handleGenerateInsights} disabled={isAnalyzing} className="w-full py-5 rounded-[1.5rem] text-lg font-black uppercase tracking-widest shadow-xl shadow-primary-500/20 active:scale-95 transition-all mt-4">
                {isAnalyzing ? <><Icon name="refresh" className="animate-spin" /> {t('analyzing_papers')}</> : <>{t('generate_roadmap')} <Icon name="arrow-right" /></>}
              </Button>
            </div>
          </Card>
          
          {insightData?.sources && insightData.sources.length > 0 && (
            <Card className="border border-gray-100 dark:border-slate-700 shadow-xl !p-6 bg-slate-50 dark:bg-slate-900/40">
              <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">{t('peer_reviewed_citations')}</h3>
              <div className="space-y-3">
                {insightData.sources.map((src, i) => (
                  <a key={i} href={src.uri} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-xs font-black text-blue-600 dark:text-blue-400 hover:text-blue-800 transition-colors truncate">
                    <span>📑</span> {src.title.substring(0, 35)}...
                  </a>
                ))}
              </div>
            </Card>
          )}
        </div>

        <div className="lg:col-span-8">
          {isAnalyzing ? (
            <div className="flex flex-col items-center justify-center h-full min-h-[500px] bg-white dark:bg-slate-800 rounded-[3rem] border-4 border-dashed border-gray-100 dark:border-slate-700 shadow-inner">
              <Loader />
              <div className="mt-8 text-center space-y-2 px-10">
                <p className="font-black text-primary-600 animate-pulse uppercase text-lg tracking-widest italic">{t('scanning_repositories')}</p>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">{t('cross_referencing')} {farmProfile.landSize} {t('hectares')}</p>
              </div>
            </div>
          ) : insightData ? (
            <div className="space-y-6 animate-fade-in">
              <Card className="bg-primary-600 text-white p-6 rounded-2xl">
                <h2 className="text-2xl font-bold mb-2">{translateDynamic(farmProfile.crop)} {t('guide')}</h2>
                <p className="text-sm text-white/80">{translateDynamic(farmProfile.state)} | {translateDynamic(farmProfile.soilType)}</p>
                <p className="mt-4 text-white/90 italic">"{insightData.recommendation.topicSummary}"</p>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {insightData.recommendation.resources.map((res, i) => (
                  <Card key={i} className="!p-4 border border-gray-100 dark:border-slate-700 bg-white dark:bg-slate-800">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-2xl">{getResourceIcon(res.type)}</span>
                      <span className="text-xs font-bold text-gray-500 uppercase">{translateResourceType(res.type)}</span>
                    </div>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">{res.quantity || t('calculated')}</p>
                    <p className="text-xs text-gray-500 mt-1">{res.detail}</p>
                  </Card>
                ))}
              </div>

              <Card className="border border-gray-100 dark:border-slate-700 shadow-2xl rounded-[3rem] p-12 bg-white dark:bg-slate-800">
                <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase italic mb-10 flex items-center gap-4">
                  <span className="w-12 h-2 bg-blue-600 rounded-full"></span>
                  {t('research_driven_protocol')}
                </h3>
              <div className="space-y-6">
                {insightData.recommendation.detailedSteps.map((step, i) => (
                  <div key={i} className="flex gap-4 p-4 bg-gray-50 dark:bg-slate-900 rounded-xl">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary-600 text-white rounded-lg flex items-center justify-center font-bold text-sm">
                      {i + 1}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white mb-1">{getStepTitle(step.title)}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              </Card>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-full min-h-[500px] text-center p-12 bg-red-50 dark:bg-red-900/10 rounded-[3rem] border-4 border-dashed border-red-200 dark:border-red-900/30">
               <div className="text-[100px] mb-6">🏜️</div>
               <h3 className="text-3xl font-black text-red-800 dark:text-red-400 mb-2 italic tracking-tighter uppercase">{t('protocol_failure')}</h3>
               <p className="text-red-600 dark:text-red-500 font-bold uppercase tracking-widest text-xs max-w-sm leading-relaxed whitespace-pre-line">{error}</p>
               <Button onClick={handleGenerateInsights} className="mt-10 !bg-red-600 !px-10 !py-4 shadow-xl shadow-red-500/30">{t('retry_analysis')}</Button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full min-h-[500px] text-center p-12 bg-white dark:bg-slate-800 rounded-[3rem] border-4 border-dashed border-gray-100 dark:border-slate-700">
              <div className="text-[120px] mb-6 opacity-20 grayscale">🧬</div>
              <h3 className="text-3xl font-black text-gray-800 dark:text-white mb-2 italic tracking-tighter uppercase">{t('scientific_node_ready')}</h3>
              <p className="text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest text-sm max-w-sm leading-relaxed">
                {t('provide_farm_specs')}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CropInsights;
