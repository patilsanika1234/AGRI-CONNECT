// Test script to verify multilingual functionality
const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'mr', name: 'Marathi' },
  { code: 'hi', name: 'Hindi' },
  { code: 'ta', name: 'Tamil' },
  { code: 'te', name: 'Telugu' },
  { code: 'kn', name: 'Kannada' },
  { code: 'bn', name: 'Bengali' },
  { code: 'gu', name: 'Gujarati' },
  { code: 'pa', name: 'Punjabi' },
  { code: 'ml', name: 'Malayalam' }
];

const LOCALE_MAP = {
    'en': 'en-IN', 'hi': 'hi-IN', 'mr': 'mr-IN', 'ta': 'ta-IN', 'te': 'te-IN',
    'kn': 'kn-IN', 'bn': 'bn-IN', 'gu': 'gu-IN', 'pa': 'pa-IN', 'ml': 'ml-IN'
};

const getNumberingSystem = (lang) => {
    const systems = {
      'hi': 'deva', 'mr': 'deva', 'kn': 'knda', 'ta': 'taml', 
      'te': 'telu', 'bn': 'beng', 'gu': 'gujr', 'pa': 'guru', 'ml': 'mlym'
    };
    return systems[lang] || 'latn';
};

const testNumberFormatting = (lang) => {
    const locale = LOCALE_MAP[lang] || 'en-IN';
    const numberingSystem = lang === 'en' ? 'latn' : getNumberingSystem(lang);
    
    console.log(`\n=== ${SUPPORTED_LANGUAGES.find(l => l.code === lang).name} (${lang}) ===`);
    
    // Test different number formats
    const testNumbers = [
        { value: 1234567.89, options: { style: 'currency', currency: 'INR' }, label: 'Currency' },
        { value: 1234567.89, options: {}, label: 'Number' },
        { value: 0.95, options: { style: 'percent' }, label: 'Percentage' },
        { value: 1234567, options: { notation: 'compact' }, label: 'Compact' }
    ];
    
    testNumbers.forEach(({ value, options, label }) => {
        try {
            const mergedOptions = { ...options, numberingSystem };
            const formatted = new Intl.NumberFormat(locale, mergedOptions).format(value);
            console.log(`${label}: ${formatted}`);
        } catch (error) {
            console.log(`${label}: ERROR - ${error.message}`);
        }
    });
};

const testDateFormatting = (lang) => {
    const locale = LOCALE_MAP[lang] || 'en-IN';
    const testDate = new Date();
    
    try {
        const formatted = new Intl.DateTimeFormat(locale, { 
            month: 'short', 
            year: 'numeric',
            day: 'numeric'
        }).format(testDate);
        console.log(`Date: ${formatted}`);
    } catch (error) {
        console.log(`Date: ERROR - ${error.message}`);
    }
};

// Run tests for all languages
console.log('🌍 Testing Multilingual Number and Date Formatting');
console.log('='.repeat(60));

SUPPORTED_LANGUAGES.forEach(lang => {
    testNumberFormatting(lang.code);
    testDateFormatting(lang.code);
});

console.log('\n✅ Multilingual formatting test completed!');
