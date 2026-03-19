'use client';

import { Region, SimulationSettings, MOCK_REGIONS } from '../lib/data';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Globe, Wind, Zap, Users, BarChart3 } from 'lucide-react';

interface SidebarLeftProps {
    selectedRegion: Region;
    onRegionChange: (region: Region) => void;
    settings: SimulationSettings;
    onSettingsChange: (settings: SimulationSettings) => void;
}

export default function SidebarLeft({
    selectedRegion,
    onRegionChange,
    settings,
    onSettingsChange
}: SidebarLeftProps) {

    const updateSetting = (key: keyof SimulationSettings, value: any) => {
        onSettingsChange({
            ...settings,
            [key]: value
        });
    };

    return (
        <div className="w-full lg:w-80 flex flex-col gap-4 overflow-y-auto overflow-x-hidden pr-0 lg:pr-2 pb-4 order-2 lg:order-none shrink-0">
            {/* Region Selection */}
            <Card>
                <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-xs font-bold flex items-center gap-2 text-muted-foreground uppercase tracking-widest">
                        <Globe className="w-4 h-4" />
                        Select Region
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-2">
                    <Select
                        value={selectedRegion.id}
                        onValueChange={(val) => {
                            const r = MOCK_REGIONS.find(m => m.id === val);
                            if (r) onRegionChange(r);
                        }}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select region..." />
                        </SelectTrigger>
                        <SelectContent>
                            {MOCK_REGIONS.map(r => (
                                <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <div className="mt-4 text-xs text-muted-foreground flex gap-4">
                        <div className="flex flex-col min-w-0">
                            <span className="uppercase tracking-widest text-[10px] opacity-70 truncate">Terrain Risk</span>
                            <span className="font-mono font-medium text-foreground">{selectedRegion.riskFactors.terrain}%</span>
                        </div>
                        <div className="flex flex-col min-w-0">
                            <span className="uppercase tracking-widest text-[10px] opacity-70 truncate">Pop. Density</span>
                            <span className="font-mono font-medium text-foreground">{selectedRegion.riskFactors.popDensity}%</span>
                        </div>
                    </div>

                </CardContent>
            </Card>

            {/* Simulation Controls */}
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-2 pl-1">Simulation Parameters</h3>

            {/* Weather Control */}
            <Card>
                <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-xs font-bold flex items-center justify-between">
                        <span className="flex items-center gap-2 text-foreground">
                            <Wind className="w-4 h-4 text-sky-600" />
                            Weather Severity
                        </span>
                        <span className="text-sky-700 font-mono">{settings.weatherSeverity}%</span>
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-2">
                    <Slider
                        value={[settings.weatherSeverity]}
                        max={100}
                        step={1}
                        onValueChange={(vals) => updateSetting('weatherSeverity', vals[0])}
                        className="py-4"
                    />
                    <p className="text-xs text-muted-foreground leading-relaxed">
                        Simulates monsoon intensity and visibility reduction.
                    </p>
                </CardContent>
            </Card>

            {/* Load Control */}
            <Card>
                <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-xs font-bold flex items-center justify-between">
                        <span className="flex items-center gap-2 text-foreground">
                            <Users className="w-4 h-4 text-amber-600" />
                            User Load Factor
                        </span>
                        <span className="text-amber-700 font-mono">{settings.userLoad}x</span>
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-2">
                    <Slider
                        value={[settings.userLoad]}
                        min={1}
                        max={10}
                        step={0.5}
                        onValueChange={(vals) => updateSetting('userLoad', vals[0])}
                        className="py-4"
                    />
                    <p className="text-xs text-muted-foreground leading-relaxed">
                        Multiplies base population density.
                    </p>
                </CardContent>
            </Card>

            {/* Compact Toggles Section */}
            <Card className="border-border shadow-sm">
                <CardContent className="p-3 space-y-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Zap className="w-3.5 h-3.5 text-red-600" />
                            <span className="text-xs font-bold text-foreground">Backbone Failure</span>
                        </div>
                        <Switch
                            checked={settings.infraFailure}
                            onCheckedChange={(val) => updateSetting('infraFailure', val)}
                            className="scale-90"
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <BarChart3 className="w-3.5 h-3.5 text-indigo-600" />
                            <span className="text-xs font-bold text-foreground">Risk Heatmap</span>
                        </div>
                        <Switch
                            checked={settings.showHeatmap}
                            onCheckedChange={(val) => updateSetting('showHeatmap', val)}
                            className="scale-90"
                        />
                    </div>
                </CardContent>
            </Card>

        </div>
    );
}