'use client';

import { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { MOCK_REGIONS, SimulationSettings } from './lib/data';
import { calculateRisk } from './lib/engine';
import SidebarLeft from './components/SidebarLeft';
import SidebarRight from './components/SidebarRight';
import { Loader2, Globe } from 'lucide-react';

// Dynamically import Map to prevent SSR issues with Leaflet
const MapExplorer = dynamic(() => import('./components/MapExplorer'), {
    ssr: false,
    loading: () => (
        <div className="w-full h-full flex flex-col items-center justify-center bg-muted/20 text-muted-foreground gap-2">
            <Loader2 className="w-8 h-8 animate-spin" />
            <span className="text-xs font-bold uppercase tracking-widest">Loading Geospatial Engine...</span>
        </div>
    ),
});

export default function VisualizerPage() {
    // State
    const [selectedRegion, setSelectedRegion] = useState(MOCK_REGIONS[0]);
    const [settings, setSettings] = useState<SimulationSettings>({
        weatherSeverity: 0,
        infraFailure: false,
        userLoad: 1,
        showHeatmap: false,
    });

    // Derived State (Risk Analysis)
    const analysis = useMemo(() => {
        return calculateRisk(selectedRegion, settings);
    }, [selectedRegion, settings]);

    return (

        <div className="flex flex-col h-screen bg-background font-sans text-foreground overflow-hidden">
            {/* Header */}
            <header className="h-14 border-b border-border bg-card flex items-center px-6 shrink-0 justify-between z-[500]">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-background flex items-center justify-center shadow-sm">
                        <img
                            src="/fucklogo.png"
                            alt="App logo"
                            className="w-15 h-15 rounded-full object-contain"
                        />
                    </div>
                    <div>
                        <h1 className="text-sm font-bold tracking-tight text-foreground">Connect All</h1>
                        <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">Rural Broadband Risk Visualizer</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 px-3 py-1 bg-secondary rounded-full border border-border">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] font-bold text-secondary-foreground uppercase tracking-wide">System Online</span>
                    </div>
                </div>
            </header>

            {/* Main Workspace */}
            <main className="flex-1 flex flex-col lg:flex-row p-4 lg:p-6 gap-4 lg:gap-6 bg-muted/10 overflow-hidden">
                {/* Left Panel (Controls) */}
                <SidebarLeft
                    selectedRegion={selectedRegion}
                    onRegionChange={setSelectedRegion}
                    settings={settings}
                    onSettingsChange={setSettings}
                />

                {/* Center Map */}
                <div className="flex-1 flex flex-col min-w-0 min-h-[50vh] lg:min-h-0 order-1 lg:order-none">
                    <div className="flex-1 relative rounded-xl overflow-hidden shadow-sm border border-border">
                        <MapExplorer region={selectedRegion} analysis={analysis} settings={settings} />

                        {/* Map Overlay Info */}
                        <div className="absolute top-4 left-4 z-[400] bg-popover/90 backdrop-blur px-4 py-2 rounded-lg border border-border shadow-sm pointer-events-none max-w-[calc(100%-2rem)]">
                            <h2 className="text-sm font-bold text-popover-foreground">{selectedRegion.name}</h2>
                            <p className="text-xs text-muted-foreground font-mono mt-0.5">
                                Lat: {selectedRegion.center[0].toFixed(2)}, Lng: {selectedRegion.center[1].toFixed(2)}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right Panel (Metrics) */}
                <SidebarRight analysis={analysis} region={selectedRegion} />
            </main>

        </div>
    );
}
