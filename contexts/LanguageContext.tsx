import React, { createContext, useState, useEffect, ReactNode, useContext, useCallback } from 'react';
import { SUPPORTED_LANGUAGES, CROPS, INDIAN_STATES, INDIAN_MARKETS } from '../constants';
import { translateWithLibre, getCachedTranslation } from '../services/translationService';

interface LanguageContextType {
  language: string; 
  languageName: string; 
  changeLanguage: (langCode: string) => void;
  t: (key: string, replacements?: Record<string, string>) => string;
  fNum: (val: number, options?: Intl.NumberFormatOptions) => string;
  fDate: (date: string | number | Date, options?: Intl.DateTimeFormatOptions) => string;
  normalizeInput: (input: string, type: 'crop' | 'state' | 'market') => string;
  translateDynamic: (text: string) => string;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LOCALE_MAP: Record<string, string> = {
    'en': 'en-IN', 'hi': 'hi-IN', 'mr': 'mr-IN', 'ta': 'ta-IN', 'te': 'te-IN',
    'kn': 'kn-IN', 'bn': 'bn-IN', 'gu': 'gu-IN', 'pa': 'pa-IN', 'ml': 'ml-IN'
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<string>(() => {
    const savedLang = localStorage.getItem('language');
    return savedLang && SUPPORTED_LANGUAGES.some(l => l.code === savedLang) ? savedLang : 'en';
  });

  const [translations, setTranslations] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(true);

  const [googleTranslations, setGoogleTranslations] = useState<Record<string, Record<string, string>>>({});
  const [pendingTranslations, setPendingTranslations] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchTranslations = async () => {
      try {
        const langFilesToFetch = SUPPORTED_LANGUAGES.map(lang => lang.code);
        const responses = await Promise.all(
          langFilesToFetch.map(lang => 
            fetch(`./locales/${lang}.json`).then(res => res.ok ? res.json() : {})
          )
        );
        const loadedTranslations = langFilesToFetch.reduce((acc, lang, index) => {
          acc[lang] = responses[index];
          return acc;
        }, {} as Record<string, any>);
        setTranslations(loadedTranslations);
      } catch (error) {
        setTranslations({ en: {} });
      } finally {
        setIsLoading(false);
      }
    };
    fetchTranslations();
  }, []);

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const changeLanguage = useCallback((langCode: string) => {
    setLanguage(langCode);
  }, []);
  
  const languageName = SUPPORTED_LANGUAGES.find(l => l.code === language)?.name || 'English';

  const t = useCallback((key: string, replacements?: Record<string, string>): string => {
    if (isLoading || !translations) return key;
    const langTrans = translations[language] || {};
    const fallbackTrans = translations['en'] || {};
    
    const sanitizedKey = key.trim().replace(/[ /]/g, '_').replace(/,/g, '');
    
    // Try raw key first, then sanitized key
    let translation = langTrans[key] || langTrans[sanitizedKey] || fallbackTrans[key] || fallbackTrans[sanitizedKey];

    // If no translation found and not English, try Google Translate
    if (!translation && language !== 'en') {
      // Check Google Translate cache first
      const cachedGoogleTrans = googleTranslations[language]?.[key] || getCachedTranslation(key, language, 'en');
      if (cachedGoogleTrans) {
        translation = cachedGoogleTrans;
      } else if (!pendingTranslations.has(key)) {
        // Queue for async translation
        setPendingTranslations(prev => new Set(prev).add(key));
        translateWithLibre(key, language, 'en').then(translated => {
          if (translated) {
            setGoogleTranslations(prev => ({
              ...prev,
              [language]: { ...prev[language], [key]: translated }
            }));
            setPendingTranslations(prev => {
              const newSet = new Set(prev);
              newSet.delete(key);
              return newSet;
            });
          }
        });
      }
      // Return English fallback while waiting
      translation = fallbackTrans[key] || fallbackTrans[sanitizedKey] || key;
    }

    // Final fallback to key itself
    if (!translation) {
      translation = key;
    }

    if (replacements) {
        Object.keys(replacements).forEach(placeholder => {
            translation = translation.replace(new RegExp(`{{${placeholder}}}`, 'g'), replacements[placeholder]);
        });
    }
    return translation;
  }, [language, translations, isLoading, googleTranslations, pendingTranslations]);

  const fNum = useCallback((val: number, options: Intl.NumberFormatOptions = {}): string => {
    const locale = LOCALE_MAP[language] || 'en-IN';
    const mergedOptions: any = { 
      ...options,
      // Use Indian number system for all languages
      numberingSystem: language === 'en' ? 'latn' : getNumberingSystem(language)
    };
    if (mergedOptions.style === 'currency' && !mergedOptions.currency) mergedOptions.currency = 'INR';
    return new Intl.NumberFormat(locale, mergedOptions).format(val);
  }, [language]);

  const getNumberingSystem = (lang: string): string => {
    const systems: Record<string, string> = {
      'hi': 'deva', 'mr': 'deva', 'kn': 'knda', 'ta': 'taml', 
      'te': 'telu', 'bn': 'beng', 'gu': 'gujr', 'pa': 'guru', 'ml': 'mlym'
    };
    return systems[lang] || 'latn';
  };

  const fDate = useCallback((date: string | number | Date, options: Intl.DateTimeFormatOptions = { month: 'short', year: 'numeric' }): string => {
    const locale = LOCALE_MAP[language] || 'en-IN';
    let d = date instanceof Date ? date : new Date(date);
    if (isNaN(d.getTime())) return String(date);
    return new Intl.DateTimeFormat(locale, options).format(d);
  }, [language]);

  const translateDynamic = useCallback((text: string): string => {
    if (!text) return '';
    const prefixes = ['crop_', 'state_', 'market_', 'status_', 'category_'];
    const sanitizedText = text.trim().replace(/[ /]/g, '_').replace(/,/g, '');
    
    // Try prefixes with sanitized text
    for (const prefix of prefixes) {
        const key = prefix + sanitizedText;
        const trans = t(key);
        if (trans !== key) return trans;
    }
    
    // Try raw text match
    const directTrans = t(text);
    if (directTrans !== text) return directTrans;

    // Try sanitized text match
    const sanTrans = t(sanitizedText);
    if (sanTrans !== sanitizedText) return sanTrans;

    return text;
  }, [language, translations, t]);

  const normalizeInput = useCallback((input: string, type: 'crop' | 'state' | 'market'): string => {
    const datasets = { crop: CROPS, state: INDIAN_STATES, market: INDIAN_MARKETS };
    const items = datasets[type] as string[];
    const normalized = input.trim().toLowerCase();
    for (const item of items) {
        if (item.toLowerCase() === normalized) return item;
        const key = `${type}_${item.replace(/[ /]/g, '_').replace(/,/g, '')}`;
        for (const lang of SUPPORTED_LANGUAGES) {
            if (translations[lang.code]?.[key]?.toLowerCase() === normalized) return item;
            if (translations[lang.code]?.[item]?.toLowerCase() === normalized) return item;
        }
    }
    return input;
  }, [translations]);

  if (isLoading) return <div className="fixed inset-0 flex items-center justify-center bg-white dark:bg-slate-900 z-50"><div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <LanguageContext.Provider value={{ language, languageName, changeLanguage, t, fNum, fDate, normalizeInput, translateDynamic }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within a LanguageProvider');
  return context;
};