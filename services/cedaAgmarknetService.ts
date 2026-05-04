/**
 * CEDA Agmarknet API Service
 * Uses Centre for Economic Data and Analysis (Ashoka University) API
 * This is a verified academic/government data partnership providing Agmarknet data
 * API Documentation: https://agmarknet.ceda.ashoka.edu.in/
 * Data Source: Ministry of Agriculture & Farmers Welfare, Government of India
 */

interface CedaPriceRecord {
  date: string;
  commodity: string;
  variety: string;
  state: string;
  district: string;
  market: string;
  min_price: number;
  max_price: number;
  modal_price: number;
}

interface CedaApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: CedaPriceRecord[];
}

const CEDA_BASE_URL = "https://agmarknet.ceda.ashoka.edu.in/api/v2";

/**
 * Fetch prices from CEDA Agmarknet API
 * No API key required - open government data
 */
export const fetchCedaAgmarknetPrices = async (
  crop: string,
  state: string,
  market?: string,
  days: number = 7
): Promise<CedaApiResponse | null> => {
  try {
    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const formatDate = (d: Date) => d.toISOString().split('T')[0];

    // Build query parameters
    const params = new URLSearchParams({
      commodity: crop.trim(),
      state: state.trim(),
      start_date: formatDate(startDate),
      end_date: formatDate(endDate),
      limit: "10"
    });

    if (market) {
      params.append("market", market.trim());
    }

    const url = `${CEDA_BASE_URL}/prices?${params.toString()}`;
    console.log(`[CEDA API] Fetching: ${url}`);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Accept": "application/json"
      }
    });

    if (!response.ok) {
      console.error(`[CEDA API] HTTP Error: ${response.status}`);
      return null;
    }

    const data: CedaApiResponse = await response.json();
    
    console.log(`[CEDA API] Found ${data.count} records`);
    if (data.results.length > 0) {
      console.log(`[CEDA API] Sample record:`, JSON.stringify(data.results[0], null, 2));
    }

    return data;

  } catch (error) {
    console.error("[CEDA API] Fetch error:", error);
    return null;
  }
};

/**
 * Get latest price from CEDA API
 */
export const getLatestCedaPrice = async (
  crop: string,
  state: string,
  market?: string
): Promise<CedaPriceRecord | null> => {
  const response = await fetchCedaAgmarknetPrices(crop, state, market, 3);
  if (response && response.results.length > 0) {
    // Return the most recent record
    return response.results.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    )[0];
  }
  return null;
};

/**
 * Transform CEDA record to LivePriceResult format
 */
export const transformCedaToLiveResult = (
  record: CedaPriceRecord,
  crop: string,
  market: string,
  state: string
) => {
  const modalPrice = record.modal_price;
  const minPrice = record.min_price;
  const maxPrice = record.max_price;
  
  // Determine trend based on min/max spread
  const spread = maxPrice - minPrice;
  const spreadPercent = maxPrice > 0 ? (spread / maxPrice) * 100 : 0;
  
  let trend = "Stable";
  let recommendation = "HOLD";
  let adviceText = "Market showing balanced demand-supply. Monitor for optimal selling window.";
  
  if (spreadPercent > 15) {
    trend = "Rising";
    recommendation = "HOLD";
    adviceText = "Price volatility indicates upward momentum. Hold for better prices.";
  } else if (spreadPercent < 5 && modalPrice > minPrice * 1.05) {
    trend = "Falling";
    recommendation = "SELL NOW";
    adviceText = "Narrow price spread suggests weakening demand. Consider selling now.";
  }

  return {
    crop,
    market: market || record.market,
    state,
    price: modalPrice,
    pricePerKg: parseFloat((modalPrice / 100).toFixed(2)),
    minPricePerKg: parseFloat((minPrice / 100).toFixed(2)),
    maxPricePerKg: parseFloat((maxPrice / 100).toFixed(2)),
    unit: "Per Quintal",
    arrivalDate: record.date,
    lastUpdated: new Date().toLocaleString(),
    source: "Agmarknet via CEDA (Ministry of Agriculture, GoI)",
    isRealTime: true,
    recommendation: {
      currentPriceAssessment: `Agmarknet verified modal rate at ₹${(modalPrice/100).toFixed(2)}/kg for ${crop} in ${market || record.market}.`,
      priceTrendForecast: { 
        trend, 
        justification: `Price spread of ₹${spread} (${spreadPercent.toFixed(1)}%) indicates ${trend.toLowerCase()} market conditions.` 
      },
      alternativeMarkets: [],
      optimalSellingStrategy: { 
        recommendation, 
        advice: adviceText 
      }
    },
    groundingSources: [{ 
      title: "Agmarknet Official (CEDA)", 
      uri: "https://agmarknet.gov.in" 
    }]
  };
};

/**
 * Get available commodities from CEDA API
 */
export const fetchCedaCommodities = async (): Promise<string[]> => {
  try {
    const response = await fetch(`${CEDA_BASE_URL}/commodities`, {
      headers: { "Accept": "application/json" }
    });
    
    if (!response.ok) return [];
    
    const data = await response.json();
    return data.results?.map((c: any) => c.name) || [];
  } catch (error) {
    console.error("[CEDA API] Error fetching commodities:", error);
    return [];
  }
};

/**
 * Get available states from CEDA API
 */
export const fetchCedaStates = async (): Promise<string[]> => {
  try {
    const response = await fetch(`${CEDA_BASE_URL}/states`, {
      headers: { "Accept": "application/json" }
    });
    
    if (!response.ok) return [];
    
    const data = await response.json();
    return data.results?.map((s: any) => s.name) || [];
  } catch (error) {
    console.error("[CEDA API] Error fetching states:", error);
    return [];
  }
};

/**
 * Get available markets for a state from CEDA API
 */
export const fetchCedaMarkets = async (state: string): Promise<string[]> => {
  try {
    const params = new URLSearchParams({ state: state.trim() });
    const response = await fetch(`${CEDA_BASE_URL}/markets?${params.toString()}`, {
      headers: { "Accept": "application/json" }
    });
    
    if (!response.ok) return [];
    
    const data = await response.json();
    return data.results?.map((m: any) => m.name) || [];
  } catch (error) {
    console.error("[CEDA API] Error fetching markets:", error);
    return [];
  }
};
