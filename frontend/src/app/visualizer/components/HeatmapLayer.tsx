'use client';

import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet.heat';

interface HeatmapLayerProps {
    points: [number, number, number][]; // [lat, lng, intensity]
    options?: {
        radius?: number;
        blur?: number;
        maxZoom?: number;
        max?: number;
        gradient?: { [key: string]: string };
    };
}

export default function HeatmapLayer({ points, options }: HeatmapLayerProps) {
    const map = useMap();

    useEffect(() => {
        if (!map) return;

        // @ts-ignore
        const heatLayer = L.heatLayer(points, {
            radius: options?.radius || 30,
            blur: options?.blur || 20,
            maxZoom: 17,
            max: options?.max || 1.0,
            gradient: options?.gradient || {
                0.4: '#94a3b8', // slate-400
                0.6: '#6366f1', // indigo-500
                0.9: '#4338ca', // indigo-700
            },
            ...options,
        });

        heatLayer.addTo(map);

        return () => {
            if (map && heatLayer) {
                map.removeLayer(heatLayer);
            }
        };
    }, [map, points, options]);

    return null;
}
