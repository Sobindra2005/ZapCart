"use client";

import {
    MousePointer2,
    TrendingUp,
    Smartphone,
    Zap,
    AlertTriangle,
    Sparkles,
    Calendar,
    Target
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@repo/ui/ui/button";
import { Badge } from "@repo/ui/ui/badge";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@repo/ui/ui/card";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    ScatterChart,
    Scatter,
    ZAxis
} from "recharts";
import { AdminCard } from "@/components/AdminCard";
import { Stat, StatsCards } from "@/components/common/StatsCards";

// --- Mock Data ---

const trafficData = [
    { name: "00:00", organic: 400, paid: 240, social: 210 },
    { name: "04:00", organic: 300, paid: 139, social: 221 },
    { name: "08:00", organic: 900, paid: 980, social: 229 },
    { name: "12:00", organic: 1200, paid: 1500, social: 300 },
    { name: "16:00", organic: 1500, paid: 1200, social: 400 },
    { name: "20:00", organic: 1100, paid: 800, social: 380 },
    { name: "23:59", organic: 600, paid: 400, social: 250 },
];

const deviceData = [
    { name: "Mobile", value: 65, color: "#3b82f6" },
    { name: "Desktop", value: 30, color: "#10b981" },
    { name: "Tablet", value: 5, color: "#f59e0b" },
];

const funnelData = [
    { stage: "Sessions", count: 12500, color: "bg-blue-500" },
    { stage: "Product View", count: 8200, color: "bg-indigo-500" },
    { stage: "Add to Cart", count: 4100, color: "bg-purple-500" },
    { stage: "Checkout", count: 2100, color: "bg-pink-500" },
    { stage: "Purchased", count: 1200, color: "bg-rose-500" },
];

const performanceScatterData = [
    { x: 100, y: 200, z: 200, name: "Product A" },
    { x: 120, y: 100, z: 260, name: "Product B" },
    { x: 170, y: 300, z: 400, name: "Product C" },
    { x: 140, y: 250, z: 280, name: "Product D" },
    { x: 150, y: 400, z: 500, name: "Product E" },
    { x: 110, y: 280, z: 200, name: "Product F" },
];

const TrafficChart = () => (
    <AdminCard className="px-0">
        <CardHeader className="flex flex-row items-center justify-between">
            <div>
                <CardTitle className="text-lg font-bold">Traffic Source Breakdown</CardTitle>
                <CardDescription>Visualizing organic vs paid sessions across 24h.</CardDescription>
            </div>
            <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-100 rounded-lg text-[10px] font-bold">
                    <div className="h-2 w-2 rounded-full bg-blue-500" /> Organic
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-100 rounded-lg text-[10px] font-bold">
                    <div className="h-2 w-2 rounded-full bg-green-500" /> Paid
                </div>
            </div>
        </CardHeader>
        <CardContent className="h-75">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trafficData}>
                    <defs>
                        <linearGradient id="colorOrg" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorPaid" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.1} />
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: 700 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: 700 }} />
                    <Tooltip contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)" }} />
                    <Area type="monotone" dataKey="organic" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorOrg)" stackId="1" />
                    <Area type="monotone" dataKey="paid" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorPaid)" stackId="1" />
                </AreaChart>
            </ResponsiveContainer>
        </CardContent>
    </AdminCard>
);

const FunnelStep = ({ step, max }: { step: typeof funnelData[0], max: number }) => {
    const percentage = (step.count / max) * 100;
    return (
        <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold">
                <span className="text-gray-500 uppercase tracking-tighter">{step.stage}</span>
                <span className="text-gray-900">{step.count.toLocaleString()}</span>
            </div>
            <div className="relative h-12 w-full bg-gray-50 rounded-lg overflow-hidden flex items-center px-4">
                <div
                    className={cn("absolute left-0 top-0 bottom-0 transition-all duration-1000", step.color)}
                    style={{ width: `${percentage}%`, opacity: 0.15 }}
                />
                <div
                    className={cn("h-1 rounded-full transition-all duration-1000", step.color)}
                    style={{ width: `${percentage}%` }}
                />
                <span className="absolute right-4 text-[10px] font-black text-gray-400">
                    {Math.round(percentage)}%
                </span>
            </div>
        </div>
    );
};

const AnomalyAlert = () => (
    <AdminCard className=" bg-red-50/50 flex items-start gap-4 ">
        <div className="p-2 rounded-lg bg-red-100">
            <AlertTriangle className="h-5 w-5 text-red-600" />
        </div>
        <div>
            <h4 className="text-sm font-bold text-red-900">Traffic Anomaly Detected</h4>
            <p className="text-xs text-red-700/80 mt-1 leading-relaxed">
                Organic search traffic from <b>United States</b> dropped by <b>24%</b> in the last 2 hours. Potential indexing issue detected.
            </p>
            <div className="mt-3 flex items-center gap-3">
                <Button variant="outline" size="sm" className="h-7 text-[10px] font-black uppercase text-red-600 border-red-200 bg-white hover:bg-red-50">Investigate</Button>
                <Button variant="ghost" size="sm" className="h-7 text-[10px] font-black uppercase text-red-400">Dismiss</Button>
            </div>
        </div>
    </AdminCard>
);

const AIInsightsPanel = () => (
    <AdminCard className="shadow-sm border-indigo-200 bg-indigo-50/10 h-full px-0">
        <CardHeader className="pb-3 flex flex-row items-center justify-between border-b border-indigo-50">
            <CardTitle className="text-sm font-bold flex items-center gap-2 text-indigo-900">
                <Sparkles className="h-4 w-4 text-indigo-500" />
                AI Insights Engine
            </CardTitle>
            <Badge variant="outline" className="text-[8px] font-black border-indigo-200 text-indigo-500 uppercase">Beta</Badge>
        </CardHeader>
        <CardContent className="pt-4 space-y-4">
            {[
                { tip: "Product performance in 'Electronics' is 12% above benchmark.", icon: TrendingUp },
                { tip: "Mobile checkout bounce rate is unusually high (42%).", icon: Smartphone },
                { tip: "Suggested: Increase ad spend on 'Instagram' between 6 PM - 10 PM.", icon: Zap }
            ].map((insight, i) => (
                <div key={i} className="flex gap-3 animate-in fade-in slide-in-from-left-4" style={{ animationDelay: `${i * 150}ms` }}>
                    <div className="h-5 w-5 rounded-full bg-white border border-indigo-100 flex items-center justify-center shrink-0">
                        <insight.icon className="h-3 w-3 text-indigo-500" />
                    </div>
                    <p className="text-xs text-indigo-900/70 font-medium leading-relaxed">{insight.tip}</p>
                </div>
            ))}
            <Button className="w-full mt-2 bg-indigo-600 hover:bg-indigo-700 font-bold text-xs gap-2 py-5 shadow-lg shadow-indigo-600/20">
                Generate Full Report
            </Button>
        </CardContent>
    </AdminCard>
);

const RetentionHeatmap = () => (
    <div className="space-y-4">
        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Cohort Retention Heatmap</h4>
        <div className="grid grid-cols-13 gap-1">
            {Array.from({ length: 13 * 6 }).map((_, i) => {
                const intensity = Math.max(0.1, 1 - (i % 13) * 0.08 - (Math.floor(i / 13) * 0.05));
                return (
                    <div
                        key={i}
                        className="aspect-square rounded-[3px] transition-all hover:scale-110 cursor-help group relative border border-white/50"
                        style={{ backgroundColor: `rgba(59, 130, 246, ${intensity})` }}
                    >
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-[8px] font-bold rounded opacity-0 group-hover:opacity-100 pointer-events-none z-10 whitespace-nowrap">
                            {Math.round(intensity * 100)}% Retention
                        </div>
                    </div>
                );
            })}
        </div>
        <div className="flex justify-between text-[8px] font-black text-gray-400 uppercase tracking-tighter">
            <span>New Users</span>
            <span>Week 12</span>
        </div>
    </div>
);

const stats: Stat[] = [
    { label: "Conversion Rate", value: "3.24%", trend: "+0.8%", trendDir: "up", vs: "vs last month" },
    { label: "Bounce Rate", value: "24.1%", trend: "-2.4%", trendDir: "down", vs: "vs last month" },
    { label: "Avg. Session", value: "4m 12s", trend: "+12s", trendDir: "up", vs: "vs last month" },
];

export default function AnalyticsPage() {
    return (
        <div className="p-8 max-w-400 mx-auto space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-baseline sm:items-center justify-end gap-6">
            
                <div className="flex items-center gap-3">
                    <div className="flex bg-gray-100 p-1 rounded-xl">
                        <Button variant="ghost" size="sm" className="h-8 px-4 font-bold text-[10px] uppercase bg-white shadow-sm">Real-time</Button>
                        <Button variant="ghost" size="sm" className="h-8 px-4 font-bold text-[10px] uppercase text-gray-500">Historical</Button>
                    </div>
                    <Button variant="outline" className="font-bold border-gray-200 shadow-sm">
                        <Calendar className="h-4 w-4 mr-2" /> Jan 1 - Jan 24
                    </Button>
                </div>
            </div>

            {/* Top Grid - Metrics & Anomaly */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <StatsCards stats={stats} className="lg:grid-cols-3 md:grid-cols-2 grid-cols-1" />
                    <AnomalyAlert />
                    <TrafficChart />
                </div>

                <AIInsightsPanel />
            </div>

            {/* Bottom Grid - Behavioral Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Conversion Funnel */}
                <AdminCard className="px-0">
                    <CardHeader>
                        <CardTitle className="text-lg font-bold">Conversion Funnel</CardTitle>
                        <CardDescription>Visualizing the path from session to purchase.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {funnelData.map((step) => (
                            <FunnelStep key={step.stage} step={step} max={funnelData[0].count} />
                        ))}
                    </CardContent>
                </AdminCard>

                {/* Device & Correlation */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Device Breakdown */}
                        <AdminCard className="px-0 ">
                            <CardHeader className="pb-0">
                                <CardTitle className="text-base font-bold">Session by Device</CardTitle>
                            </CardHeader>
                            <CardContent className="flex items-center pt-0">
                                <div className="h-50 w-1/2">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={deviceData}
                                                innerRadius={40}
                                                outerRadius={65}
                                                paddingAngle={8}
                                                dataKey="value"
                                            >
                                                {deviceData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="w-1/2 space-y-3">
                                    {deviceData.map((d) => (
                                        <div key={d.name} className="flex flex-col">
                                            <div className="flex items-center justify-between text-[10px] font-black uppercase text-gray-400">
                                                <span>{d.name}</span>
                                                <span className="text-gray-900">{d.value}%</span>
                                            </div>
                                            <div className="h-1 w-full bg-gray-100 rounded-full mt-1">
                                                <div className="h-full rounded-full" style={{ width: `${d.value}%`, backgroundColor: d.color }} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </AdminCard>

                        {/* Retention */}
                        <AdminCard className="p-0 h-full">
                            <CardContent className="pt-6">
                                <RetentionHeatmap />
                            </CardContent>
                        </AdminCard>
                    </div>

                    {/* Product Performance Correlation */}
                    <AdminCard className="px-0">
                        <CardHeader>
                            <CardTitle className="text-lg font-bold">Performance Matrix</CardTitle>
                            <CardDescription>Correlation between Price (X) and Views (Y). Bubble size = Conversion Rate.</CardDescription>
                        </CardHeader>
                        <CardContent className="h-75">
                            <ResponsiveContainer width="100%" height="100%">
                                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis type="number" dataKey="x" name="price" unit="$" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: 700 }} />
                                    <YAxis type="number" dataKey="y" name="views" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: 700 }} />
                                    <ZAxis type="number" dataKey="z" range={[100, 1000]} name="conversion" />
                                    <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                                    <Scatter name="Products" data={performanceScatterData} fill="#3b82f6" fillOpacity={0.6} stroke="#3b82f6" strokeWidth={2} />
                                </ScatterChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </AdminCard>
                </div>
            </div>
        </div>
    );
}
