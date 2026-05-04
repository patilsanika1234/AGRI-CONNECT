// Crop emoji icons mapping for visual representation
export const CROP_ICONS: Record<string, string> = {
  // Cereals
  'Rice': '🌾',
  'Wheat': '🌾',
  'Bajra': '🌾',
  'Maize': '🌽',
  'Jowar': '🌾',
  'Barley': '🌾',
  'Ragi': '🌾',
  'Oats': '🌾',
  
  // Pulses
  'Moong': '🫘',
  'Urad': '🫘',
  'Arhar': '🫘',
  'Chana': '🫘',
  'Masur': '🫘',
  'Tur': '🫘',
  'Gram': '🫘',
  'Lentil': '🫘',
  'Peas': '🫛',
  'Rajma': '🫘',
  
  // Oilseeds
  'Groundnut': '🥜',
  'Mustard': '🌿',
  'Soyabean': '🌱',
  'Sunflower': '🌻',
  'Sesame': '🌿',
  'Castor': '🌿',
  'Linseed': '🌿',
  'Safflower': '🌻',
  
  // Cotton & Fiber
  'Cotton': '🧶',
  'Jute': '🌿',
  
  // Spices
  'Turmeric': '🟡',
  'Ginger': '🫚',
  'Garlic': '🧄',
  'Onion': '🧅',
  'Chili': '🌶️',
  'Coriander': '🌿',
  'Cumin': '🌿',
  'Fenugreek': '🌿',
  'Pepper': '🫚',
  'Cardamom': '🫚',
  'Clove': '🌿',
  
  // Vegetables
  'Potato': '🥔',
  'Tomato': '🍅',
  'Brinjal': '🍆',
  'Cabbage': '🥬',
  'Cauliflower': '🥦',
  'Spinach': '🥬',
  'Okra': '🥬',
  'Carrot': '🥕',
  'Radish': '🥕',
  'Beans': '🫛',
  'Bitter Gourd': '🥒',
  'Bottle Gourd': '🍾',
  'Pumpkin': '🎃',
  'Cucumber': '🥒',
  
  // Fruits
  'Mango': '🥭',
  'Banana': '🍌',
  'Apple': '🍎',
  'Orange': '🍊',
  'Papaya': '🥭',
  'Pomegranate': '🍎',
  'Grapes': '🍇',
  'Watermelon': '🍉',
  'Guava': '🍐',
  'Lemon': '🍋',
  
  // Others
  'Sugarcane': '🎋',
  'Coffee': '☕',
  'Tea': '🍵',
  'Tobacco': '🚬',
  'Arecanut': '🥥',
  'Coconut': '🥥',
  'Rubber': '🌳',
  'Silk': '🧵',
};

// Get icon for a crop
export function getCropIcon(cropName: string): string {
  return CROP_ICONS[cropName] || '🌱'; // Default to seedling if not found
}

// Format crop name with icon
export function formatCropWithIcon(cropName: string, t?: (key: string) => string): string {
  const icon = getCropIcon(cropName);
  const name = t ? t(`crop_${cropName}`) : cropName;
  return `${icon} ${name}`;
}

// Common crop categories for filtering/display
export const CROP_CATEGORIES = {
  cereals: ['Rice', 'Wheat', 'Bajra', 'Maize', 'Jowar', 'Barley', 'Ragi'],
  pulses: ['Moong', 'Urad', 'Arhar', 'Chana', 'Masur', 'Tur', 'Gram', 'Lentil', 'Peas', 'Rajma'],
  oilseeds: ['Groundnut', 'Mustard', 'Soyabean', 'Sunflower', 'Sesame', 'Castor', 'Linseed', 'Safflower'],
  spices: ['Turmeric', 'Ginger', 'Garlic', 'Onion', 'Chili', 'Coriander', 'Cumin', 'Fenugreek', 'Pepper', 'Cardamom', 'Clove'],
  vegetables: ['Potato', 'Tomato', 'Brinjal', 'Cabbage', 'Cauliflower', 'Spinach', 'Okra', 'Carrot', 'Radish', 'Beans', 'Bitter Gourd', 'Bottle Gourd', 'Pumpkin', 'Cucumber'],
  fruits: ['Mango', 'Banana', 'Apple', 'Orange', 'Papaya', 'Pomegranate', 'Grapes', 'Watermelon', 'Guava', 'Lemon'],
};
