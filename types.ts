
export interface User {
  name: string;
  email: string;
  role: 'Farmer' | 'Admin';
  state: string;
  loginTime?: number;
}

export interface ActivityLog {
    id: string;
    userName: string;
    userState?: string;
    action: string;
    timestamp: string;
    status: 'Active' | 'Offline';
    featureUsed: string;
    loginTime?: number;
    fullTimestamp: number;
}

// Added Scheme interface
export interface Scheme {
    id: number;
    name: string;
    state: string;
    // Changed category to optional to support MOCK_SCHEMES in constants.ts
    category?: string;
    status: 'Active' | 'Inactive' | 'Upcoming';
    description: string;
    eligibility?: string;
    benefits?: string;
    documents?: string;
    link: string;
}

// Added FarmerProfile interface
export interface FarmerProfile {
    name: string;
    state: string;
    landHolding: string;
    crops: string[];
    annualIncome: string;
    hasLoan: boolean;
    loanAmount: string;
    gender: 'Male' | 'Female' | 'Other';
    casteCategory: 'General' | 'OBC' | 'SC' | 'ST';
    irrigationType: 'Canal' | 'Borewell' | 'Rainfed' | 'Drip/Sprinkler';
    farmerType: 'Marginal' | 'Small' | 'Medium' | 'Large';
}

export interface MandiIntelligence {
    crop: string;
    market: string;
    state: string;
    arrival_date: string;
    modal_price_quintal: number;
    price_per_kg: number;
    min_price_per_kg: number;
    max_price_per_kg: number;
    min_price: number;
    max_price: number;
    ai_advice: 'SELL NOW' | 'HOLD' | 'MONITOR MARKET';
    last_updated: string;
    note: string;
    source: string;
    is_real_time: boolean;
    warning?: string;
}

export interface CropPrice {
    crop: string;
    market: string;
    price: number;
}

export interface MarketIntelligenceResult {
    crop: string;
    market: string;
    currentPrice: number;
    trend: 'Rising' | 'Falling' | 'Stable';
    recommendation: string;
    advice: string;
    confidenceScore: number;
    profitMargin: number;
    lastUpdated: string;
}

export interface FarmInput {
    crop: string;
    state: string;
    soilType: string;
    landSize: number; // in hectares
    irrigationType: string;
    season: string;
}

export interface FertilizerDetail {
    label: string;
    amountKg: number;
    bags: number;
}

export interface FarmAdvisoryResult {
    compatibilityScore: number;
    soilMatchStatus: 'Optimal' | 'Sub-optimal' | 'Mismatch' | 'Compatible' | 'Moderate' | 'Not Suitable';
    resourceEstimates: {
        waterRequirement: string;
        waterLitres: number;
        irrigationSessions: number;
        fertilizerNeeds: string;
        fertilizerDetails: FertilizerDetail[];
    };
    climateSuitability: string;
    tempRange: string;
    spacing: string;
    recommendations: string[];
    warnings: string[];
    summary: string;
    irrigationStrategy: string;
}

export interface AlternativeMarket {
    marketName: string;
    reason: string;
}

export interface MarketRecommendation {
    currentPriceAssessment: string;
    priceTrendForecast: {
        trend: 'Rising' | 'Stable' | 'Falling' | 'Slightly Rising' | 'Slightly Falling';
        justification: string;
    };
    alternativeMarkets: AlternativeMarket[];
    optimalSellingStrategy: {
        recommendation: string;
        advice: string;
    };
}

export interface AdvisoryStep {
    title: string;
    description: string;
}

export interface ResourceRequirement {
    type: 'Water' | 'Fertilizer' | 'Soil' | 'Other';
    detail: string;
    quantity?: string;
}

export interface CropAdvisoryRecommendation {
    topicSummary: string;
    keyTakeaways: string[];
    resources: ResourceRequirement[];
    detailedSteps: AdvisoryStep[];
    criticalWarning?: string;
}
