export interface Region {
    id: string;
    name: string;
    center: [number, number];
    zoom: number;
    riskFactors: {
        terrain: number; // 0-100
        weather: number; // 0-100
        distance: number; // 0-100
        popDensity: number; // 0-100
    };
    villages: Village[];
}

export interface Village {
    id: string;
    name: string;
    coords: [number, number];
    population: number;
}

export interface SimulationSettings {
    weatherSeverity: number; // 0-100 (slider)
    infraFailure: boolean;   // toggle
    userLoad: number;        // 1-10 multiplier
    showHeatmap: boolean;    // new toggle
}

export interface RiskAnalysis {
    score: number; // 0-100
    status: 'Stable' | 'At-Risk' | 'Critical';
    factors: {
        terrain: number;
        weather: number;
        distance: number;
        load: number;
    };
    recommendations: Recommendation[];
}

export interface Recommendation {
    id: string;
    type: string;
    priority: 'Low' | 'Medium' | 'High';
    impact: number; // Score reduction
    description: string;
}

export const MOCK_REGIONS: Region[] = [
    {
        id: 'vihirgaon',
        name: 'Vihirgaon (Nagpur - Rural)',
        center: [21.0904, 79.1641],
        zoom: 13,
        riskFactors: { terrain: 15, weather: 75, distance: 45, popDensity: 60 },
        villages: [
            { id: 'v1', name: 'Suryodaya College Campus', coords: [21.0904, 79.1641], population: 3500 },
            { id: 'v2', name: 'Bahadura', coords: [21.0850, 79.1550], population: 1200 },
            { id: 'v3', name: 'Kharbi', coords: [21.1100, 79.1400], population: 5500 },
            { id: 'v4', name: 'Dighori', coords: [21.1000, 79.1200], population: 4800 },
        ]
    },
    {
        id: 'himalayan',
        name: 'Himalayan Valley (Mountainous)',
        center: [32.2432, 77.1892],
        zoom: 12,
        riskFactors: { terrain: 85, weather: 60, distance: 70, popDensity: 30 },
        villages: [
            { id: 'v_h1', name: 'Solang', coords: [32.3166, 77.1576], population: 450 },
            { id: 'v_h2', name: 'Vashisht', coords: [32.2600, 77.1900], population: 1200 },
            { id: 'v_h3', name: 'Naggar', coords: [32.1130, 77.1720], population: 2500 },
        ]
    },
    {
        id: 'desert',
        name: 'Thar Desert (Arid)',
        center: [26.9157, 70.9083],
        zoom: 10,
        riskFactors: { terrain: 20, weather: 40, distance: 90, popDensity: 15 },
        villages: [
            { id: 'v_d1', name: 'Sam', coords: [26.82, 70.50], population: 800 },
            { id: 'v_d2', name: 'Khuri', coords: [26.61, 70.72], population: 600 },
        ]
    },
    {
        id: 'ghats',
        name: 'Western Ghats (Dense Forest)',
        center: [18.5204, 73.8567],
        zoom: 11,
        riskFactors: { terrain: 65, weather: 80, distance: 40, popDensity: 75 },
        villages: [
            { id: 'v_g1', name: 'Mulshi', coords: [18.50, 73.51], population: 3000 },
            { id: 'v_g2', name: 'Lavasa', coords: [18.40, 73.50], population: 1500 },
        ]
    },
];