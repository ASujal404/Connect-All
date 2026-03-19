import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { RiskAnalysis } from '@/app/visualizer/lib/data';

interface ExportData {
    timestamp: string;
    regionName: string;
    riskScore: number;
    riskStatus: string;
    metrics: {
        terrain: number;
        weather: number;
        distance: number;
        load: number;
    };
    recommendations: {
        id: string;
        type: string;
        priority: string;
        impact: number;
        description: string;
    }[];
}

export async function generatePDF(data: ExportData) {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(20);
    doc.setTextColor(15, 23, 42); // slate-900
    doc.text('Rural Broadband Risk Report', 14, 22);

    // Metadata
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139); // slate-500
    doc.text(`Region: ${data.regionName}`, 14, 30);
    doc.text(`Generated: ${data.timestamp}`, 14, 35);

    // Score Card
    doc.setFillColor(241, 245, 249); // slate-100
    doc.roundedRect(14, 45, 182, 30, 3, 3, 'F');

    doc.setFontSize(14);
    doc.setTextColor(15, 23, 42);
    doc.text('Overall Resilience Score', 20, 55);

    doc.setFontSize(24);
    doc.setTextColor(
        data.riskScore > 75 ? 220 : 5,
        data.riskScore > 75 ? 38 : 150,
        data.riskScore > 75 ? 38 : 105
    ); // Simple logic: Red if high risk (score high? wait, high score usually means robust? No, 100 Risk is bad. Check logic)
    // Logic: 0-100 Risk. High is bad.
    // > 75: High Risk (Red)
    // < 75: Mod (Amber)
    // Low: Green

    // Actually let's assume standard colors
    const color = data.riskStatus === 'Critical' ? [239, 68, 68] : data.riskStatus === 'At-Risk' ? [245, 158, 11] : [16, 185, 129];
    doc.setTextColor(color[0], color[1], color[2]);
    doc.text(`${data.riskScore}/100`, 20, 68);

    doc.setFontSize(12);
    doc.text(data.riskStatus.toUpperCase(), 80, 68);

    // Metrics Table
    autoTable(doc, {
        startY: 85,
        head: [['Risk Factor', 'Impact Score (0-100)']],
        body: [
            ['Terrain Complexity', data.metrics.terrain],
            ['Weather Severity', data.metrics.weather],
            ['Distance from Backbone', data.metrics.distance],
            ['Network Load', data.metrics.load],
        ],
        theme: 'grid',
        headStyles: { fillColor: [15, 23, 42] },
        styles: { textColor: [51, 65, 85] },
    });

    // Recommendations Table
    autoTable(doc, {
        startY: (doc as any).lastAutoTable.finalY + 15,
        head: [['Priority', 'Strategy', 'Description', 'Impact']],
        body: data.recommendations.map(r => [
            r.priority,
            r.type,
            r.description,
            `-${r.impact}% Risk`
        ]),
        theme: 'striped',
        headStyles: { fillColor: [15, 23, 42] },
        columnStyles: {
            0: { fontStyle: 'bold', textColor: [15, 23, 42] },
        }
    });

    // Footer
    const pageCount = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text(`Page ${i} of ${pageCount} - Rural Broadband Resilience Platform \u00A9 2026`, 14, doc.internal.pageSize.height - 10);
    }

    doc.save(`risk-analysis-${data.regionName.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}.pdf`);
}

export function generateCSV(data: ExportData) {
    const headers = ['Segment', 'Item', 'Value', 'Priority/Description'];
    const rows = [
        ['Summary', 'Region', data.regionName, ''],
        ['Summary', 'Date', data.timestamp, ''],
        ['Summary', 'Risk Score', `${data.riskScore}`, data.riskStatus],
        [],
        ['Metrics', 'Terrain', `${data.metrics.terrain}`, ''],
        ['Metrics', 'Weather', `${data.metrics.weather}`, ''],
        ['Metrics', 'Distance', `${data.metrics.distance}`, ''],
        ['Metrics', 'Load', `${data.metrics.load}`, ''],
        [],
        ...data.recommendations.map(r => [
            'Recommendation',
            r.type,
            `-${r.impact}%`,
            `[${r.priority}] ${r.description}`
        ])
    ];

    const csvContent = "data:text/csv;charset=utf-8,"
        + headers.join(",") + "\n"
        + rows.map(e => e.map(c => `"${c}"`).join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `risk_data_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
