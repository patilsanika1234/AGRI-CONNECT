import fs from 'fs';
import path from 'path';

// Check translation completeness across all languages
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

const getAllKeys = (obj, prefix = '') => {
  let keys = [];
  for (const key in obj) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      keys = keys.concat(getAllKeys(obj[key], fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  return keys;
};

const main = () => {
  console.log('🔍 Checking Translation Completeness\n');
  
  // Load all translation files
  const translations = {};
  SUPPORTED_LANGUAGES.forEach(lang => {
    try {
      const content = fs.readFileSync(`./locales/${lang.code}.json`, 'utf8');
      translations[lang.code] = JSON.parse(content);
    } catch (error) {
      console.log(`❌ Failed to load ${lang.name}: ${error.message}`);
      translations[lang.code] = {};
    }
  });

  // Get all keys from English (reference)
  const englishKeys = getAllKeys(translations['en']);
  console.log(`📝 English reference keys: ${englishKeys.length}`);

  // Check each language
  SUPPORTED_LANGUAGES.forEach(lang => {
    if (lang.code === 'en') return;
    
    const langKeys = getAllKeys(translations[lang.code]);
    const missingKeys = englishKeys.filter(key => {
      const keyParts = key.split('.');
      let current = translations[lang.code];
      for (const part of keyParts) {
        if (!current || !current[part]) return true;
        current = current[part];
      }
      return false;
    });

    const completionRate = ((englishKeys.length - missingKeys.length) / englishKeys.length * 100).toFixed(1);
    
    console.log(`\n🌍 ${lang.name} (${lang.code})`);
    console.log(`   ✅ Translated: ${langKeys.length}/${englishKeys.length} keys (${completionRate}%)`);
    console.log(`   ❌ Missing: ${missingKeys.length} keys`);
    
    if (missingKeys.length > 0 && missingKeys.length <= 10) {
      console.log(`   📋 Missing keys: ${missingKeys.slice(0, 5).join(', ')}${missingKeys.length > 5 ? '...' : ''}`);
    }
  });

  console.log('\n✅ Translation check completed!');
};

main();
