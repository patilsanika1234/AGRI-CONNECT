/**
 * Direct Agmarknet API Service
 * Uses data.gov.in Agmarknet API for real-time mandi prices
 */

const AGMARKNET_API_KEY = (import.meta as any).env?.VITE_AGMARKNET_API_KEY || "";

interface AgmarknetPriceRecord {
  state: string;
  district: string;
  market: string;
  commodity: string;
  variety: string;
  arrival_date: string;
  min_price: string;
  max_price: string;
  modal_price: string;
}

interface AgmarknetApiResponse {
  records: AgmarknetPriceRecord[];
  total: number;
}

/**
 * Fetch live prices from Agmarknet API
 * https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070
 */
export const fetchAgmarknetPrices = async (
  crop: string,
  market: string,
  state: string,
  limit: number = 10
): Promise<AgmarknetApiResponse | null> => {
  try {
    // Normalize inputs for API
    const normalizedCrop = crop.trim();
    const normalizedMarket = market.trim();
    const normalizedState = state.trim();

    // Build API URL with filters
    const baseUrl = "https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070";
    
    // Properly encode filters for data.gov.in API
    const filters = JSON.stringify({
      commodity: normalizedCrop,
      market: normalizedMarket,
      state: normalizedState
    });
    
    const params = new URLSearchParams({
      "api-key": AGMARKNET_API_KEY,
      format: "json",
      limit: limit.toString(),
      filters: filters
    });

    const url = `${baseUrl}?${params.toString()}`;
    console.log(`[AGMARKNET API] Crop: ${normalizedCrop}, Market: ${normalizedMarket}, State: ${normalizedState}`);
    console.log(`[AGMARKNET API] URL: ${url.replace(AGMARKNET_API_KEY, "***")}`);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Accept": "application/json"
      }
    });

    if (!response.ok) {
      console.error(`[AGMARKNET API] HTTP Error: ${response.status}`);
      return null;
    }

    const data = await response.json();
    
    // Debug: Log full response structure
    console.log(`[AGMARKNET API] Response keys:`, Object.keys(data));
    console.log(`[AGMARKNET API] Total from API:`, data.total || 'N/A');
    
    if (!data.records || data.records.length === 0) {
      console.warn(`[AGMARKNET API] No records found for ${crop} in ${market}, ${state}`);
      console.log(`[AGMARKNET API] Attempting relaxed search (state only)...`);
      
      // Try with just state filter
      const relaxedParams = new URLSearchParams({
        "api-key": AGMARKNET_API_KEY,
        format: "json",
        limit: "20",
        filters: JSON.stringify({ state: normalizedState })
      });
      
      const relaxedUrl = `${baseUrl}?${relaxedParams.toString()}`;
      const relaxedResponse = await fetch(relaxedUrl, {
        method: "GET",
        headers: { "Accept": "application/json" }
      });
      
      if (relaxedResponse.ok) {
        const relaxedData = await relaxedResponse.json();
        if (relaxedData.records && relaxedData.records.length > 0) {
          // Filter for matching crop client-side
          const matchingRecords = relaxedData.records.filter(
            (r: AgmarknetPriceRecord) => 
              r.commodity.toLowerCase() === normalizedCrop.toLowerCase()
          );
          if (matchingRecords.length > 0) {
            console.log(`[AGMARKNET API] Found ${matchingRecords.length} records via relaxed search`);
            return { records: matchingRecords, total: matchingRecords.length };
          }
        }
      }
      
      return null;
    }

    console.log(`[AGMARKNET API] Found ${data.records.length} records`);
    console.log(`[AGMARKNET API] First record:`, JSON.stringify(data.records[0], null, 2));
    return data;

  } catch (error) {
    console.error("[AGMARKNET API] Fetch error:", error);
    return null;
  }
};

/**
 * Get latest price for a crop/market/state combination
 * Returns the most recent price record
 */
export const getLatestAgmarknetPrice = async (
  crop: string,
  market: string,
  state: string
): Promise<AgmarknetPriceRecord | null> => {
  const response = await fetchAgmarknetPrices(crop, market, state, 1);
  if (response && response.records.length > 0) {
    return response.records[0];
  }
  return null;
};

/**
 * Transform Agmarknet record to LivePriceResult format
 */
export const transformAgmarknetToLiveResult = (
  record: AgmarknetPriceRecord,
  crop: string,
  market: string,
  state: string
) => {
  const modalPrice = parseInt(record.modal_price) || 0;
  const minPrice = parseInt(record.min_price) || 0;
  const maxPrice = parseInt(record.max_price) || 0;
  
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
    market,
    state,
    price: modalPrice,
    pricePerKg: parseFloat((modalPrice / 100).toFixed(2)),
    minPricePerKg: parseFloat((minPrice / 100).toFixed(2)),
    maxPricePerKg: parseFloat((maxPrice / 100).toFixed(2)),
    unit: "Per Quintal",
    arrivalDate: record.arrival_date,
    lastUpdated: new Date().toLocaleString(),
    source: "Agmarknet Price Portal (data.gov.in)",
    isRealTime: true,
    recommendation: {
      currentPriceAssessment: `Agmarknet verified modal rate at ₹${(modalPrice/100).toFixed(2)}/kg for ${crop} in ${market}.`,
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
      title: "Agmarknet Official Portal", 
      uri: "https://agmarknet.gov.in" 
    }]
  };
};
