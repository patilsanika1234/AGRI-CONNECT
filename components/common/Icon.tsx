import React from 'react';

interface IconProps {
  name: IconName;
  size?: number;
  className?: string;
}

export type IconName = 
  | 'dashboard' | 'market' | 'predict' | 'crop' | 'schemes' | 'home' | 'admin'
  | 'rice' | 'wheat' | 'maize' | 'cotton' | 'sugarcane' | 'soybean' | 'potato' | 'tomato' | 'onion' | 'mango'
  | 'location' | 'state' | 'mandi' | 'soil' | 'water' | 'fertilizer' | 'pesticide'
  | 'search' | 'filter' | 'download' | 'upload' | 'refresh' | 'check' | 'close' | 'arrow-right'
  | 'user' | 'settings' | 'logout' | 'language' | 'sun' | 'moon' | 'menu'
  | 'trend-up' | 'trend-down' | 'chart' | 'money' | 'calendar' | 'info' | 'warning' | 'error'
  | 'leaf' | 'plant' | 'sprout' | 'farm' | 'tractor' | 'cloud' | 'rain' | 'sun-weather'
  | 'bank' | 'government' | 'document' | 'eligibility' | 'apply' | 'success';

const ICONS: Record<IconName, string> = {
  // Navigation
  dashboard: '📊',
  market: '📈',
  predict: '🔮',
  crop: '🌾',
  schemes: '📜',
  home: '🏠',
  admin: '🛡️',
  
  // Crops
  rice: '🍚',
  wheat: '🌾',
  maize: '🌽',
  cotton: '🧶',
  sugarcane: '🎋',
  soybean: '🫘',
  potato: '🥔',
  tomato: '🍅',
  onion: '🧅',
  mango: '🥭',
  
  // Location & Resources
  location: '📍',
  state: '🗺️',
  mandi: '🏪',
  soil: '🪴',
  water: '💧',
  fertilizer: '🧪',
  pesticide: '☠️',
  
  // Actions
  search: '🔍',
  filter: '⚡',
  download: '⬇️',
  upload: '⬆️',
  refresh: '🔄',
  check: '✓',
  close: '✕',
  'arrow-right': '→',
  
  // User
  user: '👤',
  settings: '⚙️',
  logout: '🚪',
  language: '🌐',
  sun: '☀️',
  moon: '🌙',
  menu: '☰',
  
  // Analytics
  'trend-up': '📈',
  'trend-down': '📉',
  chart: '📊',
  money: '💰',
  calendar: '📅',
  info: 'ℹ️',
  warning: '⚠️',
  error: '❌',
  
  // Agriculture
  leaf: '🍃',
  plant: '🌱',
  sprout: '🌿',
  farm: '🚜',
  tractor: '🚜',
  cloud: '☁️',
  rain: '🌧️',
  'sun-weather': '☀️',
  
  // Government
  bank: '🏦',
  government: '🏛️',
  document: '📄',
  eligibility: '✅',
  apply: '📝',
  success: '🎉',
};

export const Icon: React.FC<IconProps> = ({ name, size = 20, className = '' }) => {
  return (
    <span 
      className={`inline-flex items-center justify-center ${className}`}
      style={{ fontSize: size, lineHeight: 1 }}
      role="img"
      aria-label={name}
    >
      {ICONS[name]}
    </span>
  );
};

// Helper to get crop icon emoji directly
export const getCropIcon = (cropName: string): string => {
  const normalized = cropName.toLowerCase();
  if (normalized.includes('rice')) return '🍚';
  if (normalized.includes('wheat')) return '🌾';
  if (normalized.includes('maize') || normalized.includes('corn')) return '🌽';
  if (normalized.includes('cotton')) return '🧶';
  if (normalized.includes('sugarcane')) return '🎋';
  if (normalized.includes('soybean')) return '🫘';
  if (normalized.includes('potato')) return '🥔';
  if (normalized.includes('tomato')) return '🍅';
  if (normalized.includes('onion')) return '🧅';
  if (normalized.includes('mango')) return '🥭';
  if (normalized.includes('bajra') || normalized.includes('millet')) return '🌾';
  if (normalized.includes('moong') || normalized.includes('gram')) return '🫘';
  if (normalized.includes('groundnut') || normalized.includes('peanut')) return '🥜';
  if (normalized.includes('turmeric')) return '🟡';
  if (normalized.includes('ginger')) return '🫚';
  if (normalized.includes('garlic')) return '🧄';
  if (normalized.includes('chili') || normalized.includes('pepper')) return '🌶️';
  if (normalized.includes('carrot')) return '🥕';
  if (normalized.includes('cabbage') || normalized.includes('cauliflower')) return '🥬';
  if (normalized.includes('okra') || normalized.includes('ladies finger')) return '🥒';
  if (normalized.includes('pumpkin')) return '🎃';
  if (normalized.includes('cucumber')) return '🥒';
  if (normalized.includes('banana')) return '🍌';
  if (normalized.includes('apple')) return '🍎';
  if (normalized.includes('orange')) return '🍊';
  if (normalized.includes('grapes')) return '🍇';
  if (normalized.includes('watermelon')) return '🍉';
  if (normalized.includes('coffee')) return '☕';
  if (normalized.includes('tea')) return '🍵';
  if (normalized.includes('coconut')) return '🥥';
  return '🌱';
};

// Helper to get resource icon by type
export const getResourceIcon = (type: string): IconName => {
  const normalized = type.toLowerCase();
  if (normalized.includes('water')) return 'water';
  if (normalized.includes('fertilizer')) return 'fertilizer';
  if (normalized.includes('pesticide') || normalized.includes('pest')) return 'pesticide';
  if (normalized.includes('soil')) return 'soil';
  return 'leaf';
};

export default Icon;
