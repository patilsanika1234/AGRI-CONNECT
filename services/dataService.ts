import { CROPS, INDIAN_MARKETS, INDIAN_STATES, MOCK_SCHEMES } from '../constants';
import { Scheme } from '../types';

const CROPS_KEY = 'agri_custom_crops';
const MARKETS_KEY = 'agri_custom_markets';
const STATES_KEY = 'agri_custom_states';
const SCHEMES_KEY = 'agri_custom_schemes';
const DELETED_ITEMS_KEY = 'agri_deleted_items';
const FEATURE_VISIBILITY_KEY = 'agri_feature_visibility';
const DASHBOARD_WIDGETS_KEY = 'agri_dashboard_widgets';
const GLOBAL_SETTINGS_KEY = 'agri_global_settings';

// --- Feature Visibility ---
export const getFeatureVisibility = () => {
  const defaults = {
    dashboard: true,
    marketIntel: true,
    cropAdvisory: true,
    schemes: true,
    activity: true
  };
  const saved = JSON.parse(localStorage.getItem(FEATURE_VISIBILITY_KEY) || '{}');
  return { ...defaults, ...saved };
};

export const setFeatureVisibility = (feature: string, isVisible: boolean) => {
  const current = getFeatureVisibility();
  const updated = { ...current, [feature]: isVisible };
  localStorage.setItem(FEATURE_VISIBILITY_KEY, JSON.stringify(updated));
};

// --- Dashboard Control (Widgets & Metrics) ---
export const getDashboardWidgets = () => {
  const defaults = {
    revenue_velocity: true,
    price_volatility: true,
    production_mix: true,
    profit_waterfall: true,
    market_benchmarks: true,
    efficiency_matrix: true,
    seasonal_rainfall: false,
    soil_health_trend: false
  };
  const saved = JSON.parse(localStorage.getItem(DASHBOARD_WIDGETS_KEY) || '{}');
  return { ...defaults, ...saved };
};

export const setDashboardWidget = (widget: string, isVisible: boolean) => {
  const current = getDashboardWidgets();
  const updated = { ...current, [widget]: isVisible };
  localStorage.setItem(DASHBOARD_WIDGETS_KEY, JSON.stringify(updated));
};

export const getGlobalSettings = () => {
    const defaults = {
        productionTarget: '50000',
        announcement: 'Welcome to AgriConnect.',
        lastUpdate: Date.now()
    };
    const saved = JSON.parse(localStorage.getItem(GLOBAL_SETTINGS_KEY) || '{}');
    return { ...defaults, ...saved };
};

export const setGlobalSettings = (settings: { productionTarget?: string, announcement?: string }) => {
    const current = getGlobalSettings();
    const updated = { ...current, ...settings, lastUpdate: Date.now() };
    localStorage.setItem(GLOBAL_SETTINGS_KEY, JSON.stringify(updated));
};

// --- Helper for soft-deleting constants ---
const getDeletedItems = (): string[] => JSON.parse(localStorage.getItem(DELETED_ITEMS_KEY) || '[]');
const addDeletedItem = (item: string) => {
  const deleted = getDeletedItems();
  if (!deleted.includes(item)) {
    deleted.push(item);
    localStorage.setItem(DELETED_ITEMS_KEY, JSON.stringify(deleted));
  }
};

const restoreItem = (item: string) => {
  const deleted = getDeletedItems();
  const updated = deleted.filter(i => i !== item);
  localStorage.setItem(DELETED_ITEMS_KEY, JSON.stringify(updated));
};

// --- States ---
export const getStates = (): string[] => {
  const custom = JSON.parse(localStorage.getItem(STATES_KEY) || '[]');
  const deleted = getDeletedItems();
  const all = Array.from(new Set([...INDIAN_STATES, ...custom]));
  return all.filter(s => !deleted.includes(`state:${s}`)).sort();
};

export const addState = (state: string) => {
  const custom = JSON.parse(localStorage.getItem(STATES_KEY) || '[]');
  if (!custom.includes(state) && !INDIAN_STATES.includes(state)) {
    custom.push(state);
    localStorage.setItem(STATES_KEY, JSON.stringify(custom));
  }
  restoreItem(`state:${state}`);
};

export const deleteState = (state: string) => {
  const custom = JSON.parse(localStorage.getItem(STATES_KEY) || '[]');
  const updated = custom.filter((s: string) => s !== state);
  localStorage.setItem(STATES_KEY, JSON.stringify(updated));
  addDeletedItem(`state:${state}`);
};

// --- Crops ---
export const getCrops = (): string[] => {
  const custom = JSON.parse(localStorage.getItem(CROPS_KEY) || '[]');
  const deleted = getDeletedItems();
  const all = Array.from(new Set([...CROPS, ...custom]));
  return all.filter(c => !deleted.includes(`crop:${c}`)).sort();
};

export const addCrop = (crop: string) => {
  const custom = JSON.parse(localStorage.getItem(CROPS_KEY) || '[]');
  if (!custom.includes(crop) && !CROPS.includes(crop)) {
    custom.push(crop);
    localStorage.setItem(CROPS_KEY, JSON.stringify(custom));
  }
  restoreItem(`crop:${crop}`);
};

export const deleteCrop = (crop: string) => {
  const custom = JSON.parse(localStorage.getItem(CROPS_KEY) || '[]');
  const updated = custom.filter((c: string) => c !== crop);
  localStorage.setItem(CROPS_KEY, JSON.stringify(updated));
  addDeletedItem(`crop:${crop}`);
};

// --- Markets ---
export const getMarkets = (): string[] => {
  const custom = JSON.parse(localStorage.getItem(MARKETS_KEY) || '[]');
  const deleted = getDeletedItems();
  const all = Array.from(new Set([...INDIAN_MARKETS, ...custom]));
  return all.filter(m => !deleted.includes(`market:${m}`)).sort();
};

export const addMarket = (market: string) => {
  const custom = JSON.parse(localStorage.getItem(MARKETS_KEY) || '[]');
  if (!custom.includes(market) && !INDIAN_MARKETS.includes(market)) {
    custom.push(market);
    localStorage.setItem(MARKETS_KEY, JSON.stringify(custom));
  }
  restoreItem(`market:${market}`);
};

export const deleteMarket = (market: string) => {
  const custom = JSON.parse(localStorage.getItem(MARKETS_KEY) || '[]');
  const updated = custom.filter((m: string) => m !== market);
  localStorage.setItem(MARKETS_KEY, JSON.stringify(updated));
  addDeletedItem(`market:${market}`);
};

// --- Schemes ---
export const getSchemes = (): Scheme[] => {
  const centralSchemes: Scheme[] = [
    { id: 1000, state: 'All', name: 'PM-Kisan Samman Nidhi (National)', category: 'Income Support', status: 'Active', description: 'Direct income support of ₹6,000 per year to all land-holding farmer families.', link: 'https://pmkisan.gov.in/' },
    { id: 1001, state: 'All', name: 'Pradhan Mantri Fasal Bima Yojana', category: 'Insurance', status: 'Active', description: 'Comprehensive crop insurance against non-preventable natural risks.', link: 'https://pmfby.gov.in/' },
    { id: 1002, state: 'All', name: 'Kisan Credit Card (KCC)', category: 'Credit', status: 'Active', description: 'Timely credit for agricultural needs at subsidized interest rates.', link: 'https://www.myscheme.gov.in/schemes/kcc' },
    { id: 1003, state: 'All', name: 'Soil Health Card Scheme', category: 'Advisory', status: 'Active', description: 'Report card for soil health to help optimize fertilizer usage.', link: 'https://www.soilhealth.dac.gov.in/' },
    { id: 1004, state: 'All', name: 'PM Krishi Sinchai Yojana (PMKSY)', category: 'Irrigation', status: 'Active', description: 'Improving farm-level water use efficiency through Micro Irrigation.', link: 'https://pmksy.gov.in/' },
    { id: 1005, state: 'All', name: 'National Agriculture Market (e-NAM)', category: 'Marketing', status: 'Active', description: 'Pan-India electronic trading portal for agricultural commodities.', link: 'https://enam.gov.in/' }
  ];

  const customSchemes = JSON.parse(localStorage.getItem(SCHEMES_KEY) || '[]');
  const deleted = getDeletedItems();

  const all = [...centralSchemes, ...MOCK_SCHEMES, ...customSchemes];
  return all.filter(s => !deleted.includes(`scheme:${s.id}`));
};

export const addScheme = (scheme: Omit<Scheme, 'id'>) => {
  const custom = JSON.parse(localStorage.getItem(SCHEMES_KEY) || '[]');
  const newScheme = { ...scheme, id: Date.now() };
  custom.push(newScheme);
  localStorage.setItem(SCHEMES_KEY, JSON.stringify(custom));
  return newScheme;
};

export const deleteScheme = (id: number) => {
  const custom = JSON.parse(localStorage.getItem(SCHEMES_KEY) || '[]');
  const updated = custom.filter((s: Scheme) => s.id !== id);
  localStorage.setItem(SCHEMES_KEY, JSON.stringify(updated));
  addDeletedItem(`scheme:${id}`);
};