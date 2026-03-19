'use client';

import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Region, RiskAnalysis, SimulationSettings } from '../lib/data';
import { useEffect, useMemo } from 'react';
import HeatmapLayer from './HeatmapLayer';

// Reset Default Icons
const DefaultIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

interface MapExplorerProps {
    region: Region;
    analysis: RiskAnalysis;
    settings: SimulationSettings;
}

function ChangeView({ center, zoom }: { center: [number, number]; zoom: number }) {
    const map = useMap();
    useEffect(() => {
        map.setView(center, zoom);
    }, [center, zoom, map]);
    return null;
}

export default function MapExplorer({ region, analysis, settings }: MapExplorerProps) {

    const getRiskColor = (score: number) => {
        if (score > 75) return '#ef4444';
        if (score > 45) return '#f59e0b';
        return '#22c55e';
    };

    const riskColor = getRiskColor(analysis.score);

    // Generate weird randomly spreading heatmap data for demonstration
    const heatmapPoints = useMemo(() => {
        if (!settings || !settings.showHeatmap) return [];

        const pts: [number, number, number][] = [];
        const baseCenter = region.center;

        // Add jittered points around each village + random noise clusters
        region.villages.forEach(v => {
            for (let i = 0; i < 20; i++) {
                const latJitter = (Math.random() - 0.5) * 0.05;
                const lngJitter = (Math.random() - 0.5) * 0.05;
                const weight = Math.random() * 1.5; // Increased weight
                pts.push([v.coords[0] + latJitter, v.coords[1] + lngJitter, weight]);
            }
        });

        // Add some weird "climate front" noise
        for (let i = 0; i < 80; i++) {
            const lat = baseCenter[0] + (Math.random() - 0.5) * 0.14;
            const lng = baseCenter[1] + (Math.random() - 0.5) * 0.14;
            const weight = Math.random() * 3.0; // Higher weight for deeper colors
            pts.push([lat, lng, weight]);
        }

        return pts;
    }, [region, settings.showHeatmap]);

    const climateGradient = {
        0.3: '#fbbf24', // deep yellow-400
        0.5: '#16a34a', // intense green-600
        0.75: '#dc2626', // vivid red-600
        0.9: '#000000', // deep black
    };

    return (
        <div className="relative w-full h-full rounded-xl overflow-hidden border border-border shadow-md bg-muted/20">
            <MapContainer
                center={region.center}
                zoom={region.zoom}
                style={{ height: '100%', width: '100%' }}
                zoomControl={false}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <ChangeView center={region.center} zoom={region.zoom} />

                {/* Heatmap Overlay - Visible only when toggled */}
                {settings?.showHeatmap && (
                    <HeatmapLayer
                        points={heatmapPoints}
                        options={{
                            radius: 55,
                            blur: 35,
                            max: 2.5,
                            gradient: climateGradient
                        }}
                    />
                )}

                {/* Conditional Visibility: Hide markers and system circles when heatmap is ON */}
                {!settings?.showHeatmap && (
                    <>
                        {region.villages.map(v => (
                            <Marker
                                key={v.id}
                                position={v.coords}
                                opacity={1}
                            >
                                <Popup>
                                    <div className="p-1">
                                        <strong className="block text-sm text-foreground">{v.name}</strong>
                                        <span className="text-xs text-muted-foreground">Pop: {v.population}</span>
                                    </div>
                                </Popup>
                            </Marker>
                        ))}

                        <Circle
                            center={region.center}
                            radius={4000}
                            pathOptions={{
                                fillColor: riskColor,
                                color: riskColor,
                                weight: 1,
                                fillOpacity: 0.2
                            }}
                        />
                    </>
                )}

            </MapContainer>

            {/* Legend update */}
            <div className="absolute bottom-4 right-4 z-[999] bg-popover/95 backdrop-blur px-3 py-2 rounded-lg border border-border shadow-sm text-xs text-popover-foreground">
                <div className="font-bold mb-1 text-muted-foreground uppercase tracking-wider text-[10px]">
                    {settings?.showHeatmap ? 'Mock Climate Intensity' : 'Resilience Zones'}
                </div>
                {settings?.showHeatmap ? (
                    <div className="flex flex-col gap-1 w-32">
                        <div className="h-2 w-full bg-gradient-to-r from-yellow-400 via-green-500 via-red-500 to-black rounded-full" />
                        <div className="flex justify-between items-center text-[8px] font-bold opacity-60">
                            <span>WARM</span>
                            <span>CRITICAL</span>
                            <span>SEVERE</span>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-1">
                        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-emerald-500" /> Stable</div>
                        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-amber-500" /> At-Risk</div>
                        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-red-500" /> Critical</div>
                    </div>
                )}
            </div>
        </div>
    );
}