import { getStates, getCrops, getMarkets } from "./dataService";
import { getLiveMarketIntel } from "./geminiService";
import { fetchCedaAgmarknetPrices, transformCedaToLiveResult } from "./cedaAgmarknetService";

/**
 * BACKEND BRIDGE (SIMULATED)
 * This service mimics a Node.js/Django backend.
 * React components call these methods instead of calling the API directly.
 */
export const backendBridge = {
    /**
     * Fetches mandi data from CEDA Agmarknet API (government data),
     * falls back to Gemini AI if API fails or returns no data.
     */
    fetchMandiData: async (crop: string, market: string, state: string) => {
        console.log(`[BACKEND PROXY] Received request: GET /api/v1/mandi/price?crop=${crop}&mandi=${market}`);
        
        // Try CEDA Agmarknet API first (No API key needed - open government data)
        console.log(`[BACKEND PROXY] Attempting CEDA Agmarknet API...`);
        const cedaData = await fetchCedaAgmarknetPrices(crop, state, market, 7);
        
        if (cedaData && cedaData.results.length > 0) {
            // Get most recent record
            const latestRecord = cedaData.results.sort((a, b) => 
                new Date(b.date).getTime() - new Date(a.date).getTime()
            )[0];
            const result = transformCedaToLiveResult(latestRecord, crop, market, state);
            console.log(`[BACKEND PROXY] 200 OK - Data retrieved from CEDA Agmarknet API`);
            return result;
        }
        
        // Fallback to Gemini AI
        console.log(`[BACKEND PROXY] CEDA API empty, falling back to Gemini AI...`);
        const result = await getLiveMarketIntel(crop, market, state);
        
        if (result) {
            console.log(`[BACKEND PROXY] 200 OK - Data retrieved via AI Cloud Node`);
            return result;
        } else {
            console.error(`[BACKEND PROXY] 503 Service Unavailable - All sources failed`);
            throw new Error("BACKEND_SERVICE_TIMEOUT");
        }
    }
};

/**
 * Metadata provider for Market selection.
 */
export const fetch_available_metadata = async (): Promise<{ crops: string[], markets: string[], states: string[] }> => {
    return {
        crops: getCrops(),
        markets: getMarkets(),
        states: getStates()
    };
};
