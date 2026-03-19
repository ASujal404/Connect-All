'use client';

import { RiskAnalysis, Region } from '../lib/data';
import { Card, CardContent, CardHeader, CardTitle, CardReveal } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { AlertCircle, AlertTriangle, CheckCircle2, TrendingDown, ArrowRight, FileText, FileSpreadsheet, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { generatePDF, generateCSV } from '@/lib/export';

interface SidebarRightProps {
    analysis: RiskAnalysis;
    region: Region;
}

export default function SidebarRight({ analysis, region }: SidebarRightProps) {
    const [isExporting, setIsExporting] = useState(false);

    const handleExport = async (type: 'pdf' | 'csv') => {
        // Build export data object
        const data = {
            timestamp: new Date().toLocaleString(),
            regionName: region.name,
            riskScore: analysis.score,
            riskStatus: analysis.status,
            metrics: {
                terrain: analysis.factors.terrain,
                weather: analysis.factors.weather,
                distance: analysis.factors.distance,
                load: analysis.factors.load,
            },
            recommendations: analysis.recommendations.map(r => ({
                id: r.id,
                type: r.type,
                priority: r.priority,
                impact: r.impact,
                description: r.description
            }))
        };

        if (type === 'pdf') {
            await generatePDF(data);
        } else {
            generateCSV(data);
        }

        setIsExporting(false);
    };

    const chartData = [
        { name: 'Terrain', value: analysis.factors.terrain },
        { name: 'Weather', value: analysis.factors.weather },
        { name: 'Distance', value: analysis.factors.distance },
        { name: 'Load', value: analysis.factors.load },
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Critical': return 'bg-destructive text-destructive-foreground hover:bg-destructive/90 border-transparent';
            case 'At-Risk': return 'bg-amber-500 text-white hover:bg-amber-600 border-transparent';
            default: return 'bg-emerald-600 text-white hover:bg-emerald-700 border-transparent';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'Critical': return <AlertCircle className="w-5 h-5 text-destructive" />;
            case 'At-Risk': return <AlertTriangle className="w-5 h-5 text-amber-600" />;
            default: return <CheckCircle2 className="w-5 h-5 text-emerald-600" />;
        }
    };

    return (
        <div className="w-full lg:w-96 flex flex-col gap-6 overflow-y-auto overflow-x-hidden pl-0 lg:pl-2 pb-4 lg:pb-0 order-3 lg:order-none relative">
            {/* Overall Score */}
            <Card className="border-l-4 border-l-primary bg-card shrink-0">
                <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Resilience Score</span>
                        <Badge className={getStatusColor(analysis.status)}>
                            {analysis.status}
                        </Badge>
                    </div>
                    <div className="flex items-baseline gap-2 mb-2">
                        <span className="text-4xl font-extrabold tracking-tighter text-foreground">
                            {analysis.score}
                        </span>
                        <span className="text-sm font-medium text-muted-foreground">/ 100 Risk</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        {getStatusIcon(analysis.status)}
                        <span className="text-foreground font-medium">
                            {analysis.status === 'Stable' ? 'System Within Limits' : 'Mitigation Required'}
                        </span>
                    </div>
                </CardContent>
            </Card>

            {/* Factor Breakdown Chart */}
            <Card className="shadow-sm border-border shrink-0">
                <CardHeader className="p-4 pb-0">
                    <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Risk Factors</CardTitle>
                </CardHeader>
                <CardContent className="p-4 h-[200px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} layout="vertical" margin={{ left: -10, right: 20, top: 0, bottom: 0 }}>
                            <XAxis type="number" domain={[0, 100]} hide />
                            <YAxis dataKey="name" type="category" width={65} tick={{ fontSize: 10, fill: 'var(--foreground)' }} tickLine={false} axisLine={false} />
                            <Tooltip
                                cursor={{ fill: 'transparent' }}
                                contentStyle={{
                                    borderRadius: 'var(--radius)',
                                    fontSize: '11px',
                                    border: '1px solid var(--border)',
                                    backgroundColor: 'var(--popover)',
                                    color: 'var(--popover-foreground)'
                                }}
                            />
                            <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.value > 75 ? '#dc2626' : entry.value > 45 ? '#f59e0b' : '#16a34a'} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* Recommendations */}
            <div className="space-y-3 pb-24">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground pl-1">Strategic Recommendations</h4>
                {analysis.recommendations.map((rec) => (
                    <Card key={rec.id} className="shadow-sm border-border hover:border-primary/50 transition-colors cursor-default group overflow-visible">
                        <CardContent className="p-4">
                            <div className="flex justify-between items-start mb-2">
                                <span className="font-semibold text-sm text-foreground leading-tight">{rec.type}</span>
                                <Badge variant={rec.priority === 'High' ? 'destructive' : 'secondary'} className="text-[10px] shrink-0 ml-2">
                                    {rec.priority}
                                </Badge>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                                <TrendingDown className="w-3 h-3 text-emerald-500 shrink-0" />
                                <span className="truncate">Reduces risk by {rec.impact}%</span>
                            </div>
                            <CardReveal className="mt-2 text-xs border-t border-border pt-2 leading-relaxed whitespace-normal break-words">
                                {rec.description}
                            </CardReveal>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Footer Actions */}
            <div className="sticky bottom-0 lg:bottom-0 pt-6 pb-6 mt-auto z-[20] flex flex-col gap-2 bg-gradient-to-t from-background via-background to-transparent px-2 -mx-2">
                {!isExporting ? (
                    <button
                        onClick={() => setIsExporting(true)}
                        className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-bold text-sm flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-lg active:scale-[0.98] border border-primary/20"
                    >
                        Export Report
                        <ArrowRight className="w-4 h-4" />
                    </button>
                ) : (
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-200 bg-card p-3 rounded-xl border border-border shadow-2xl">
                        <div className="flex gap-2">
                            <button
                                onClick={() => handleExport('pdf')}
                                className="flex-1 bg-rose-600 text-white py-3 rounded-lg font-bold text-sm flex items-center justify-center gap-2 hover:bg-rose-700 transition-colors shadow-sm"
                            >
                                <FileText className="w-4 h-4" />
                                PDF
                            </button>
                            <button
                                onClick={() => handleExport('csv')}
                                className="flex-1 bg-emerald-600 text-white py-3 rounded-lg font-bold text-sm flex items-center justify-center gap-2 hover:bg-emerald-700 transition-colors shadow-sm"
                            >
                                <FileSpreadsheet className="w-4 h-4" />
                                CSV
                            </button>
                        </div>
                        <button
                            onClick={() => setIsExporting(false)}
                            className="w-full mt-2 py-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
                        >
                            Cancel Export
                        </button>
                    </div>
                )}
            </div>

        </div>
    );
}