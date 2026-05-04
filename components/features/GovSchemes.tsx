import React, { useState, useEffect, useMemo } from 'react';
import Card from '../common/Card';
import Select from '../common/Select';
import Button from '../common/Button';
import Modal from '../common/Modal';
import Loader from '../common/Loader';
import { INDIAN_STATES } from '../../constants';
import { Scheme, FarmerProfile } from '../../types';
import { getSchemeEligibility, getLatestGovSchemes } from '../../services/geminiService';
import { getSchemes } from '../../services/dataService';
import { useAuth } from '../../hooks/useAuth';
import { useLanguage } from '../../contexts/LanguageContext';

const GovSchemes: React.FC = () => {
    const { user } = useAuth();
    const { t, translateDynamic, language, languageName } = useLanguage();
    
    // Helper to translate scheme names
    const translateSchemeName = (name: string): string => {
        if (!name) return name;
        // Try to match known scheme names
        const key = `scheme_${name.replace(/\s+/g, '_')}`;
        const translated = t(key);
        return translated !== key ? translated : name;
    };
    
    // Helper to translate scheme descriptions
    const translateSchemeDesc = (desc: string, name: string): string => {
        if (!desc || !name) return desc;
        const key = `scheme_${name.replace(/\s+/g, '_')}_desc`;
        const translated = t(key);
        return translated !== key ? translated : desc;
    };
    
    const [selectedState, setSelectedState] = useState(user?.state || 'All');
    const [localSchemes, setLocalSchemes] = useState<Scheme[]>([]);
    const [discoveredSchemes, setDiscoveredSchemes] = useState<Scheme[]>([]);
    const [eligibilityResults, setEligibilityResults] = useState<Record<number, string>>({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isChecking, setIsChecking] = useState(false);
    const [isDiscovering, setIsDiscovering] = useState(false);
    const [schemeToCheck, setSchemeToCheck] = useState<Scheme | null>(null);
    
    const [farmerProfile, setFarmerProfile] = useState<FarmerProfile>({
        name: user?.name || 'Farmer', 
        state: user?.state || 'Maharashtra', 
        landHolding: '2.0', 
        crops: ['Rice'], 
        annualIncome: '250000', 
        hasLoan: false, 
        loanAmount: '0',
        gender: 'Male', 
        casteCategory: 'General', 
        irrigationType: 'Canal', 
        farmerType: 'Small'
    });

    // Load local schemes
    useEffect(() => {
        const schemesData = getSchemes();
        setLocalSchemes(schemesData);
        setDiscoveredSchemes([]);
        setEligibilityResults({});
    }, []);

    // AI Discovery logic
    const handleDiscoverLatest = async () => {
        if (selectedState === "All") return;
        setIsDiscovering(true);
        const latest = await getLatestGovSchemes(selectedState, languageName);
        setDiscoveredSchemes(latest);
        setIsDiscovering(false);
    };

    const handleCheckEligibility = async () => {
        if (!schemeToCheck) return;
        setIsChecking(true);
        const result = await getSchemeEligibility({ name: schemeToCheck.name, description: schemeToCheck.description }, farmerProfile);
        setEligibilityResults(prev => ({ ...prev, [schemeToCheck.id]: result }));
        setIsChecking(false);
        setIsModalOpen(false);
    };

    // Filtered list logic:
    // Selecting a state shows matching state schemes AND central schemes (state: 'All').
    const filteredSchemes = useMemo(() => {
        const normalizedSelected = selectedState.trim().toLowerCase();
        let pool = [...discoveredSchemes, ...localSchemes];
        
        // Remove duplicates if any (based on name)
        const uniquePool = Array.from(new Map(pool.map(item => [item.name, item])).values());

        if (selectedState === 'All') {
            return uniquePool.sort((a, b) => a.name.localeCompare(b.name));
        }

        // Show schemes for selected state OR central schemes (state: 'All')
        return uniquePool
            .filter(scheme => 
                scheme.state.toLowerCase() === normalizedSelected || 
                scheme.state === 'All'
            )
            .sort((a, b) => a.name.localeCompare(b.name));
    }, [localSchemes, discoveredSchemes, selectedState]);

    return (
        <div className="space-y-8 pb-12 animate-fade-in max-w-6xl mx-auto px-4">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pt-8">
                <div className="space-y-1">
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white italic tracking-tight uppercase leading-none">
                        {t('gov_schemes_title')}
                    </h1>
                    <div className="flex items-center gap-2">
                         <span className="w-8 h-1 bg-primary-500 rounded-full"></span>
                         <p className="text-xs font-black text-gray-500 uppercase tracking-widest">
                            {t('gov_schemes_subtitle')}
                         </p>
                    </div>
                </div>
                
                <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
                    <div className="w-full sm:w-64">
                        <Select 
                            label={t('gov_schemes_select_state')} 
                            options={['All', ...INDIAN_STATES]} 
                            renderOption={(o) => o === 'All' ? t('filter_all_states') : translateDynamic(o)} 
                            value={selectedState} 
                            onChange={e => setSelectedState(e.target.value)} 
                        />
                    </div>
                    {selectedState !== "All" && (
                        <Button 
                            onClick={handleDiscoverLatest} 
                            disabled={isDiscovering}
                            className="w-full sm:w-auto !py-3 !px-8 !rounded-2xl !bg-indigo-600 hover:!bg-indigo-700 shadow-xl shadow-indigo-500/20 text-[10px] font-black uppercase tracking-widest whitespace-nowrap active:scale-95 transition-all transform"
                        >
                            {isDiscovering ? 'Scouting...' : `Scout AI Schemes`}
                        </Button>
                    )}
                </div>
            </div>

            {isDiscovering && (
                <div className="p-16 text-center bg-indigo-50/20 dark:bg-indigo-900/10 rounded-[3rem] border-2 border-dashed border-indigo-200 dark:border-indigo-800 animate-pulse flex flex-col items-center">
                    <Loader />
                    <p className="mt-6 font-black text-indigo-600 dark:text-indigo-400 uppercase text-xs tracking-[0.2em]">
                        Scanning Regional Gateways...
                    </p>
                </div>
            )}
            
            <div className="grid grid-cols-1 gap-6">
                {filteredSchemes.length > 0 ? filteredSchemes.map((scheme) => (
                    <div 
                        key={`${scheme.id}-${scheme.state}`} 
                        className="p-5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl hover:shadow-md transition-shadow"
                    >
                        <div className="flex justify-between items-start gap-4">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className={`text-xs px-2 py-1 rounded ${scheme.state === 'All' ? 'bg-gray-100 text-gray-600' : 'bg-primary-100 text-primary-600'}`}>
                                        {scheme.state === 'All' ? t('central') : scheme.state}
                                    </span>
                                    {scheme.category && (
                                        <span className="text-xs text-gray-500">{scheme.category}</span>
                                    )}
                                </div>
                                <h3 className="font-bold text-gray-900 dark:text-white mb-2">{translateSchemeName(scheme.name)}</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{translateSchemeDesc(scheme.description, scheme.name)}</p>
                                <div className="flex gap-2">
                                    <Button onClick={() => { setSchemeToCheck(scheme); setIsModalOpen(true); }} className="!text-xs !py-2 !px-4">
                                        {t('check_eligibility')}
                                    </Button>
                                    <a href={scheme.link} target="_blank" rel="noreferrer" className="text-xs text-blue-600 hover:underline py-2">
                                        {t('visit_portal')}
                                    </a>
                                </div>
                            </div>
                            <span className={`text-xs px-2 py-1 rounded ${scheme.status === 'Active' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                                {scheme.status}
                            </span>
                        </div>
                    </div>
                )) : (
                    <div className="py-20 text-center">
                        <p className="text-4xl mb-4">🏛️</p>
                        <p className="font-bold text-gray-800 dark:text-white">No Schemes Found</p>
                        <p className="text-sm text-gray-500">Try adjusting your filters.</p>
                    </div>
                )}
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={t('scheme_eligibility_engine')}>
                <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <Select label="Gender" options={['Male', 'Female', 'Other']} renderOption={translateDynamic} value={farmerProfile.gender} onChange={e => setFarmerProfile({...farmerProfile, gender: e.target.value as any})} />
                        <Select label="Caste Category" options={['General', 'OBC', 'SC', 'ST']} renderOption={translateDynamic} value={farmerProfile.casteCategory} onChange={e => setFarmerProfile({...farmerProfile, casteCategory: e.target.value as any})} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <Select label="Farmer Type" options={['Small', 'Marginal', 'Medium', 'Large']} renderOption={translateDynamic} value={farmerProfile.farmerType} onChange={e => setFarmerProfile({...farmerProfile, farmerType: e.target.value as any})} />
                        <Select label="Irrigation" options={['Canal', 'Borewell', 'Rainfed', 'Drip']} renderOption={translateDynamic} value={farmerProfile.irrigationType} onChange={e => setFarmerProfile({...farmerProfile, irrigationType: e.target.value as any})} />
                    </div>
                    <Button onClick={handleCheckEligibility} disabled={isChecking} className="w-full py-5 !rounded-2xl font-black uppercase tracking-widest shadow-2xl shadow-primary-500/20 active:scale-[0.98] transition-all transform hover:scale-[1.01]">
                        {isChecking ? 'Verifying Credentials...' : 'Verify My Eligibility'}
                    </Button>
                </div>
            </Modal>
        </div>
    );
};

export default GovSchemes;