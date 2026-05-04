import React, { useState, useEffect } from 'react';
import Card from '../common/Card';
import Select from '../common/Select';
import Button from '../common/Button';
import Loader from '../common/Loader';
import { getStates, getCrops } from '../../services/dataService';
import { getCropAdvisory } from '../../services/geminiService';
import { useAuth } from '../../hooks/useAuth';
import { useLanguage } from '../../contexts/LanguageContext';
import { CropAdvisoryRecommendation } from '../../types';

const ADVISORY_TOPICS = ["Water Requirements", "Fertilizer Usage", "Soil Management", "Pest Control", "Sowing Strategy", "Comprehensive Guide"];
const SOIL_TYPES = ["Alluvial", "Black", "Red", "Laterite", "Arid", "Saline", "Peaty", "Forest"];

const AgriGuide: React.FC = () => {
    const { user } = useAuth();
    const { t, language, translateDynamic } = useLanguage();
    
    const [states, setStates] = useState<string[]>([]);
    const [crops, setCrops] = useState<string[]>([]);
    
    const [farmProfile, setFarmProfile] = useState({
        crop: '', 
        state: user?.state || '', 
        topic: ADVISORY_TOPICS[0],
        landSize: '1.0',
        soilType: SOIL_TYPES[0]
    });
    
    const [guideData, setGuideData] = useState<{ recommendation: CropAdvisoryRecommendation, sources: any[] } | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

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

    const handleGenerateGuide = async () => {
        if (!farmProfile.crop || !farmProfile.state) return;
        setIsAnalyzing(true);
        // Using existing geminiService which handles the resource-specific prompt structure
        const result = await getCropAdvisory(
            farmProfile.crop, 
            farmProfile.topic, 
            farmProfile.state, 
            language,
            farmProfile.landSize,
            farmProfile.soilType
        );
        setGuideData(result);
        setIsAnalyzing(false);
    };

    const getResourceIcon = (type: string) => {
        switch (type) {
            case 'Water': return '💧';
            case 'Fertilizer': return '🧪';
            case 'Soil': return '🪴';
            default: return '📦';
        }
    };

    return (
        <div className="space-y-8 pb-12 animate-fade-in max-w-7xl mx-auto px-4">
            <div className="flex flex-col gap-1">
                <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight italic uppercase leading-none">{t('agri_guide_title')}</h1>
                <p className="text-xs font-black text-gray-500 uppercase tracking-widest">{t('agri_guide_subtitle')}</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-4 space-y-4">
                    <Card className="border border-gray-100 dark:border-slate-700 shadow-xl !p-6">
                        <h3 className="text-[10px] font-black text-primary-600 uppercase tracking-[0.2em] mb-6 border-b border-primary-100 pb-2">Farm Configuration</h3>
                        <div className="space-y-5">
                            <Select 
                                label="Target Commodity" 
                                options={crops} 
                                renderOption={translateDynamic}
                                value={farmProfile.crop} 
                                onChange={e => setFarmProfile({...farmProfile, crop: e.target.value})} 
                            />
                            <Select 
                                label="Advisory Focus" 
                                options={ADVISORY_TOPICS} 
                                renderOption={translateDynamic}
                                value={farmProfile.topic} 
                                onChange={e => setFarmProfile({...farmProfile, topic: e.target.value})} 
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Land (Ha)</label>
                                    <input 
                                        type="number" 
                                        step="0.1" 
                                        className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-md text-sm"
                                        value={farmProfile.landSize}
                                        onChange={e => setFarmProfile({...farmProfile, landSize: e.target.value})}
                                    />
                                </div>
                                <Select 
                                    label="Soil Type" 
                                    options={SOIL_TYPES} 
                                    renderOption={translateDynamic}
                                    value={farmProfile.soilType} 
                                    onChange={e => setFarmProfile({...farmProfile, soilType: e.target.value})} 
                                />
                            </div>
                            <Select 
                                label="Regional Context" 
                                options={states} 
                                renderOption={translateDynamic}
                                value={farmProfile.state} 
                                onChange={e => setFarmProfile({...farmProfile, state: e.target.value})} 
                            />
                            <Button onClick={handleGenerateGuide} disabled={isAnalyzing} className="w-full py-4 rounded-xl font-black uppercase tracking-widest shadow-lg shadow-primary-500/20 active:scale-95 transition-all mt-4">
                                {isAnalyzing ? 'Consulting Experts...' : 'Get Personalized Advice'}
                            </Button>
                        </div>
                    </Card>
                    
                    {guideData?.sources && guideData.sources.length > 0 && (
                        <Card className="border border-gray-100 dark:border-slate-700 shadow-sm !p-6">
                            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Referenced Nodes</h3>
                            <div className="space-y-3">
                                {guideData.sources.map((src, i) => (
                                    <a key={i} href={src.uri} target="_blank" rel="noreferrer" className="block text-xs font-bold text-blue-600 hover:underline truncate">
                                        🔗 {src.title}
                                    </a>
                                ))}
                            </div>
                        </Card>
                    )}
                </div>

                <div className="lg:col-span-8">
                    {isAnalyzing ? (
                        <div className="flex flex-col items-center justify-center h-full min-h-[500px] bg-white dark:bg-slate-800 rounded-[3rem] border-4 border-dashed border-gray-100 dark:border-slate-700">
                            <Loader />
                            <p className="mt-6 font-black text-primary-600 animate-pulse uppercase text-base tracking-widest">Generating Precision Roadmap...</p>
                        </div>
                    ) : guideData ? (
                        <div className="space-y-6 animate-fade-in">
                            <Card className="bg-slate-900 text-white p-10 rounded-[3rem] border-none shadow-2xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-8 opacity-10 text-8xl">🔬</div>
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="bg-primary-600 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">AI Expert Verdict</span>
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">State: {translateDynamic(farmProfile.state)}</span>
                                </div>
                                <h2 className="text-4xl font-black mb-2 tracking-tight italic uppercase">Roadmap: {translateDynamic(farmProfile.crop)}</h2>
                                <p className="text-primary-400 font-bold text-xl uppercase tracking-widest">Scope: {translateDynamic(farmProfile.topic)}</p>
                                <div className="mt-8 pt-8 border-t border-slate-800">
                                    <p className="text-slate-300 text-lg leading-relaxed italic font-medium">
                                        "{guideData.recommendation.topicSummary}"
                                    </p>
                                </div>
                            </Card>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {guideData.recommendation.resources.map((res, i) => (
                                    <Card key={i} className="!p-6 border border-gray-100 dark:border-slate-700 hover:border-primary-400 transition-colors">
                                        <div className="flex items-center gap-3 mb-3">
                                            <span className="text-2xl">{getResourceIcon(res.type)}</span>
                                            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{translateDynamic(res.type)} Needs</h4>
                                        </div>
                                        <p className="text-sm font-black text-gray-800 dark:text-white uppercase tracking-tight mb-1">{res.quantity || 'Calculated'}</p>
                                        <p className="text-xs font-bold text-gray-500 italic">{res.detail}</p>
                                    </Card>
                                ))}
                            </div>

                            <Card className="border border-gray-100 dark:border-slate-700 shadow-sm">
                                <h3 className="text-xl font-black text-gray-800 dark:text-white uppercase italic mb-6 flex items-center gap-3">
                                    <span className="w-8 h-1 bg-primary-600 rounded-full"></span>
                                    Actionable Sequence
                                </h3>
                                <div className="space-y-8">
                                    {guideData.recommendation.detailedSteps.map((step, i) => (
                                        <div key={i} className="flex gap-6 group">
                                            <div className="flex-shrink-0 w-12 h-12 bg-primary-50 dark:bg-primary-900/20 text-primary-600 rounded-2xl flex items-center justify-center font-black text-xl shadow-sm border border-primary-100 group-hover:scale-110 transition-transform">
                                                {i + 1}
                                            </div>
                                            <div className="space-y-1">
                                                <h4 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tight">{step.title}</h4>
                                                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium leading-relaxed">{step.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card>

                            {guideData.recommendation.criticalWarning && (
                                <div className="p-8 bg-red-50 dark:bg-red-900/10 border-2 border-red-100 dark:border-red-900/30 rounded-[2.5rem] flex items-start gap-6">
                                    <span className="text-4xl">⚠️</span>
                                    <div>
                                        <h4 className="text-xs font-black text-red-600 uppercase tracking-widest mb-1">Critical Advisory</h4>
                                        <p className="text-sm font-bold text-red-800 dark:text-red-300 italic">{guideData.recommendation.criticalWarning}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full min-h-[500px] text-center p-12 bg-white dark:bg-slate-800 rounded-[3rem] border-4 border-dashed border-gray-100 dark:border-slate-700">
                            <div className="text-8xl mb-6 opacity-30">📚</div>
                            <h3 className="text-3xl font-black text-gray-800 dark:text-white mb-2 italic tracking-tighter">Precision Intelligence Node</h3>
                            <p className="text-gray-500 font-bold uppercase tracking-widest text-sm max-w-sm">
                                Enter your farm specifics to generate a scientific agricultural roadmap including resource optimization for water and fertilizers.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AgriGuide;