import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

export default function AnalyticsDashboard() {
    const [metrics, setMetrics] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMetrics();
    }, []);

    const fetchMetrics = async () => {
        try {
            // In a real app, this would fetch historical data
            // For prototype, we'll mock some history based on the single metric we have
            const response = await fetch('/api/metrics');
            const current = await response.json();

            // Generate mock history
            const history = Array.from({ length: 10 }, (_, i) => ({
                id: i + 1,
                duration: Math.max(100, current.duration + (Math.random() * 200 - 100)),
                assets: Math.max(1, current.assets + Math.floor(Math.random() * 2)),
                timestamp: new Date(Date.now() - (9 - i) * 3600000).toLocaleTimeString()
            }));

            setMetrics(history);
        } catch (error) {
            console.error('Failed to fetch metrics:', error);
            // Fallback mock data if API fails (e.g. dev mode without backend)
            setMetrics(Array.from({ length: 10 }, (_, i) => ({
                id: i + 1,
                duration: 100 + Math.random() * 50,
                assets: 5 + Math.floor(Math.random() * 3),
                timestamp: new Date(Date.now() - (9 - i) * 3600000).toLocaleTimeString()
            })));
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-8">Loading metrics...</div>;

    return (
        <div className="p-8 space-y-8">
            <h1 className="text-3xl font-bold text-foreground">Build Analytics</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Build Duration Chart */}
                <div className="bg-card p-6 rounded-lg shadow-sm border border-border" role="region" aria-label="Build Duration Chart">
                    <h2 className="text-xl font-semibold mb-4">Build Duration (ms)</h2>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={metrics}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                <XAxis dataKey="timestamp" stroke="#9CA3AF" />
                                <YAxis stroke="#9CA3AF" />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1F2937', border: 'none' }}
                                    itemStyle={{ color: '#E5E7EB' }}
                                />
                                <Legend />
                                <Line type="monotone" dataKey="duration" stroke="#8884d8" activeDot={{ r: 8 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Asset Count Chart */}
                <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
                    <h2 className="text-xl font-semibold mb-4">Asset Count</h2>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={metrics}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                <XAxis dataKey="timestamp" stroke="#9CA3AF" />
                                <YAxis stroke="#9CA3AF" />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1F2937', border: 'none' }}
                                    itemStyle={{ color: '#E5E7EB' }}
                                />
                                <Legend />
                                <Bar dataKey="assets" fill="#82ca9d" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}
