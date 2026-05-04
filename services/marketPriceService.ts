
import { parseCSV } from './mockDataService';

/**
 * Interface representing the structured price information for a crop
 */
export interface MarketPriceInfo {
    crop: string;
    market: string;
    currentPrice: number;
    month: string;
}

/**
 * Utility to convert date string to a sortable timestamp
 * Reused logic for consistent time-series analysis.
 */
const getDateTimestamp = (dateStr: string): number => {
    // Arrival_Date is in YYYY-MM-DD format in mockDataService
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? 0 : d.getTime();
};

/**
 * Fetches the most recent price for every crop available in a specific market.
 * 
 * @param market - The name of the Mandi/Market to filter by.
 * @returns An array of MarketPriceInfo objects.
 */
export const getAllCurrentPricesByMarket = (market: string): MarketPriceInfo[] => {
    const data = parseCSV();
    const searchMarket = market.toLowerCase();

    // 1. Filter by market (Exact match or fuzzy inclusion)
    const marketRecords = data.filter(d => 
        d.Market.toLowerCase() === searchMarket || 
        d.Market.toLowerCase().includes(searchMarket)
    );

    if (marketRecords.length === 0) {
        console.warn(`No market data found for query: ${market}`);
        return [];
    }

    // 2. Group records by Commodity (Fixed: Changed from 'Crop' to 'Commodity' to match data source)
    const cropGroups: Record<string, typeof marketRecords> = {};
    marketRecords.forEach(record => {
        if (!cropGroups[record.Commodity]) {
            cropGroups[record.Commodity] = [];
        }
        cropGroups[record.Commodity].push(record);
    });

    // 3. Extract latest price for each crop
    const results: MarketPriceInfo[] = Object.keys(cropGroups).map(cropName => {
        const cropEntries = cropGroups[cropName];
        
        // Sort by date descending to get the latest record
        // FIXED: Using Arrival_Date instead of non-existent Month property (Line 64)
        const latestRecord = [...cropEntries].sort((a, b) => 
            getDateTimestamp(b.Arrival_Date) - getDateTimestamp(a.Arrival_Date)
        )[0];

        // 4. Calculate Price (Sales / Production) with safety check
        const price = latestRecord.Production > 0 
            ? Math.round(latestRecord.Sales / latestRecord.Production) 
            : 0;

        return {
            crop: latestRecord.Commodity,
            market: latestRecord.Market,
            currentPrice: price,
            // FIXED: Using Arrival_Date instead of non-existent Month property (Line 76)
            month: latestRecord.Arrival_Date
        };
    });

    return results;
};

/**
 * EXAMPLE USAGE:
 * 
 * import { getAllCurrentPricesByMarket } from './services/marketPriceService';
 * 
 * const marketData = getAllCurrentPricesByMarket("Azadpur, Delhi");
 * console.log(marketData);
 * 
 * EXAMPLE JSON OUTPUT:
 * [
 *   {
 *     "crop": "Rice",
 *     "market": "Azadpur, Delhi",
 *     "currentPrice": 112,
 *     "month": "2025-04-10"
 *   },
 *   {
 *     "crop": "Soybean",
 *     "market": "Azadpur, Delhi",
 *     "currentPrice": 67,
 *     "month": "2025-05-08"
 *   }
 * ]
 */
