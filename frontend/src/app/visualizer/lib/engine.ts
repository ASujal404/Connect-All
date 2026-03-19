import { Region, SimulationSettings, RiskAnalysis } from './data';

export function calculateRisk(region: Region, settings: SimulationSettings): RiskAnalysis {
    // Extract base factors
    const { terrain, weather: baseWeather, distance, popDensity } = region.riskFactors;

    // Apply simulation modifiers
    // Ensure values don't go below 0 or above 100 to prevent RangeErrors in UI
    const weatherImpact = baseWeather + (settings.weatherSeverity * 0.5);
    const serviceLoad = popDensity * settings.userLoad * 0.5; // Scale down to keeping it reasonable 

    const weatherFactor = Math.min(100, Math.max(0, weatherImpact));
    const loadFactor = Math.min(100, Math.max(0, serviceLoad));
    const distanceFactor = Math.min(100, Math.max(0, distance + (settings.infraFailure ? 40 : 0)));
    const terrainFactor = Math.min(100, Math.max(0, terrain));

    // Weights
    // Terrain: 30%, Weather: 25%, Distance: 25%, Load: 20%
    let score = (terrainFactor * 0.3) +
        (weatherFactor * 0.25) +
        (distanceFactor * 0.25) +
        (loadFactor * 0.2);

    score = Math.round(score);

    let status: RiskAnalysis['status'] = 'Stable';
    if (score >= 75) status = 'Critical';
    else if (score >= 45) status = 'At-Risk';

    // Recommendations
    const recommendations: RiskAnalysis['recommendations'] = [];

    if (terrainFactor > 60) {
        recommendations.push({
            id: 'rec_sat',
            type: 'Satellite Uplink',
            priority: 'High',
            impact: 20,
            description: 'Terrain obstruction requires non-terrestrial backhaul.'
        });
    }

    if (distanceFactor > 70) {
        recommendations.push({
            id: 'rec_mw',
            type: 'Microwave Repeater',
            priority: 'Medium',
            impact: 15,
            description: 'Long-distance signal degradation detected.'
        });
    }

    if (loadFactor > 80) {
        recommendations.push({
            id: 'rec_fib',
            type: 'Fiber Node Split',
            priority: 'High',
            impact: 25,
            description: 'High user density requires capacity increase.'
        });
    }

    if (recommendations.length === 0) {
        recommendations.push({
            id: 'rec_maint',
            type: 'Routine Maintenance',
            priority: 'Low',
            impact: 5,
            description: 'System operating within normal parameters.'
        })
    }

    return {
        score,
        status,
        factors: {
            terrain: terrainFactor,
            weather: weatherFactor,
            distance: distanceFactor,
            load: loadFactor
        },
        recommendations
    };
}
