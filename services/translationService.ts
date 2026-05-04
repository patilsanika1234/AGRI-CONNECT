const LIBRETRANSLATE_API_URL = 'https://libretranslate.de';

interface LibreTranslateResponse {
  translatedText: string;
}

const TRANSLATION_CACHE: Record<string, Record<string, string>> = {};

const LOCALE_TO_LIBRE_MAP: Record<string, string> = {
  'en': 'en',
  'hi': 'hi',
  'bn': 'bn',
  'gu': 'gu',
  'mr': 'mr',
  'ta': 'ta',
  'te': 'te',
  'kn': 'kn',
  'ml': 'ml',
  'pa': 'pa'
};

// Alternative LibreTranslate instances (free public mirrors)
const ALTERNATIVE_INSTANCES = [
  'https://libretranslate.com',
  'https://translate.argosopentech.com',
  'https://libretranslate.pussthecat.org'
];

export const translateWithLibre = async (
  text: string,
  targetLang: string,
  sourceLang: string = 'en'
): Promise<string | null> => {
  if (!text || text.trim() === '') {
    return text;
  }

  const libreTargetLang = LOCALE_TO_LIBRE_MAP[targetLang] || targetLang;
  const libreSourceLang = LOCALE_TO_LIBRE_MAP[sourceLang] || sourceLang;
  const cacheKey = `${text}_${libreSourceLang}_${libreTargetLang}`;

  // Check cache first
  if (TRANSLATION_CACHE[libreSourceLang]?.[cacheKey]) {
    return TRANSLATION_CACHE[libreSourceLang][cacheKey];
  }

  try {
    const response = await fetch(`${LIBRETRANSLATE_API_URL}/translate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: text,
        source: libreSourceLang,
        target: libreTargetLang,
        format: 'text'
      })
    });

    if (!response.ok) {
      // If rate limited, try alternative instance
      if (response.status === 429) {
        return await translateWithAlternativeInstance(text, targetLang, sourceLang);
      }
      throw new Error(`Translation API error: ${response.status}`);
    }

    const data: LibreTranslateResponse = await response.json();
    const translatedText = data.translatedText;

    if (translatedText) {
      // Store in cache
      if (!TRANSLATION_CACHE[libreSourceLang]) {
        TRANSLATION_CACHE[libreSourceLang] = {};
      }
      TRANSLATION_CACHE[libreSourceLang][cacheKey] = translatedText;
    }

    return translatedText || null;
  } catch (error) {
    console.error('LibreTranslate API error:', error);
    // Try alternative instance as fallback
    return await translateWithAlternativeInstance(text, targetLang, sourceLang);
  }
};

const translateWithAlternativeInstance = async (
  text: string,
  targetLang: string,
  sourceLang: string = 'en'
): Promise<string | null> => {
  const libreTargetLang = LOCALE_TO_LIBRE_MAP[targetLang] || targetLang;
  const libreSourceLang = LOCALE_TO_LIBRE_MAP[sourceLang] || sourceLang;

  for (const instance of ALTERNATIVE_INSTANCES) {
    try {
      const response = await fetch(`${instance}/translate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: text,
          source: libreSourceLang,
          target: libreTargetLang,
          format: 'text'
        })
      });

      if (response.ok) {
        const data: LibreTranslateResponse = await response.json();
        return data.translatedText || null;
      }
    } catch (e) {
      continue;
    }
  }
  return null;
};

export const batchTranslate = async (
  texts: string[],
  targetLang: string,
  sourceLang: string = 'en'
): Promise<Record<string, string>> => {
  if (texts.length === 0) {
    return {};
  }

  const libreTargetLang = LOCALE_TO_LIBRE_MAP[targetLang] || targetLang;
  const libreSourceLang = LOCALE_TO_LIBRE_MAP[sourceLang] || sourceLang;
  const results: Record<string, string> = {};

  // LibreTranslate doesn't support batch natively, so translate one by one
  // But we do it concurrently with Promise.all
  const translationPromises = texts.map(async (text) => {
    const translated = await translateWithLibre(text, targetLang, sourceLang);
    if (translated) {
      results[text] = translated;
    }
  });

  await Promise.all(translationPromises);
  return results;
};

export const clearTranslationCache = (): void => {
  Object.keys(TRANSLATION_CACHE).forEach(key => {
    delete TRANSLATION_CACHE[key];
  });
};

export const getCachedTranslation = (
  text: string,
  targetLang: string,
  sourceLang: string = 'en'
): string | null => {
  const libreTargetLang = LOCALE_TO_LIBRE_MAP[targetLang] || targetLang;
  const libreSourceLang = LOCALE_TO_LIBRE_MAP[sourceLang] || sourceLang;
  const cacheKey = `${text}_${libreSourceLang}_${libreTargetLang}`;
  return TRANSLATION_CACHE[libreSourceLang]?.[cacheKey] || null;
};
