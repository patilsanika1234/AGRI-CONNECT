import { FarmInput, FarmAdvisoryResult, FertilizerDetail } from '../types';
import { getCropAgronomicData, STATE_CLIMATE_MAP } from './mockDataService';

export const getFarmSpecificAdvisory = (input: FarmInput, lang: string = 'en'): FarmAdvisoryResult => {
    const baseData = getCropAgronomicData(input.crop);
    const recommendations: string[] = [];
    const warnings: string[] = [];
    let compatibilityScore = 70;

    if (!baseData) {
        return {
            compatibilityScore: 0, soilMatchStatus: 'Not Suitable',
            resourceEstimates: { waterRequirement: 'N/A', waterLitres: 0, irrigationSessions: 0, fertilizerNeeds: 'N/A', fertilizerDetails: [] },
            climateSuitability: 'climate_Unknown', tempRange: 'N/A', spacing: 'N/A', recommendations: [], warnings: [], summary: 'Data unavailable.', irrigationStrategy: 'N/A'
        };
    }

    const isSuitable = baseData.soil.includes(input.soilType);
    const soilStatus = isSuitable ? 'soil_Compatible' : (baseData.soil.length > 0 ? 'soil_Moderate' : 'soil_Not_Suitable');
    compatibilityScore += isSuitable ? 20 : -20;

    const fertDetails: FertilizerDetail[] = [
        { label: 'N', amountKg: baseData.n_kg * input.landSize, bags: Math.ceil((baseData.n_kg * input.landSize) / 50) },
        { label: 'P', amountKg: baseData.p_kg * input.landSize, bags: Math.ceil((baseData.p_kg * input.landSize) / 50) },
        { label: 'K', amountKg: baseData.k_kg * input.landSize, bags: Math.ceil((baseData.k_kg * input.landSize) / 50) }
    ];

    const stateClimate = STATE_CLIMATE_MAP[input.state] || "Unknown";
    const climateMatch = stateClimate === baseData.climate ? 'climate_Optimal' : 'climate_Moderate';
    if (climateMatch === 'climate_Optimal') compatibilityScore += 10;

    const season = input.season.toLowerCase();
    if (season.includes('kharif')) recommendations.push('rec_kharif_rec');
    else if (season.includes('rabi')) recommendations.push('rec_rabi_rec');
    else recommendations.push('rec_zaid_rec');

    recommendations.push('rec_sowing');

    return {
        compatibilityScore: Math.min(100, Math.max(0, compatibilityScore)),
        soilMatchStatus: soilStatus as any,
        resourceEstimates: {
            waterRequirement: `${baseData.water_mm}mm`,
            waterLitres: baseData.water_mm * 10000 * input.landSize,
            irrigationSessions: baseData.irrigation_sessions,
            fertilizerNeeds: `${fertDetails.map(f => `${f.amountKg}kg ${f.label}`).join(', ')}`,
            fertilizerDetails: fertDetails
        },
        climateSuitability: climateMatch,
        tempRange: baseData.temp_range,
        spacing: baseData.spacing,
        recommendations, warnings,
        summary: `agri_guide_summary`,
        irrigationStrategy: input.irrigationType === 'Drip' ? 'rec_drip_strat' : 'rec_flood_strat'
    };
};