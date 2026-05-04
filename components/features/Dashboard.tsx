import React, { useState, useEffect } from 'react';
import { 
    ResponsiveContainer, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, BarChart, Bar, ScatterChart, Scatter,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ZAxis
} from 'recharts';
import Card from '../common/Card';
import { 
    getSalesTrendsData, getMarketPriceTrends, getCropDistributionData,
    getMarketSalesPerformance, getEfficiencyMatrixData
} from '../../services/mockDataService';
import { getStates, getCrops, getMarkets, getDashboardWidgets, getGlobalSettings } from '../../services/dataService';
import Select from '../common/Select';
import Button from '../common/Button';
import { useTheme } from '../../hooks/useTheme';
import { useLanguage } from '../../contexts/LanguageContext';

const Dashboard: React.FC = () => {
    const { theme } = useTheme();
    const { t, fNum, translateDynamic, language } = useLanguage();
    
    const [stateOptions, setStateOptions] = useState<string[]>([]);
    const [cropOptions, setCropOptions] = useState<string[]>([]);
    const [marketOptions, setMarketOptions] = useState<string[]>([]);
    const [widgets, setWidgets] = useState<any>(getDashboardWidgets());
    const [globalSettings, setGlobalSettings] = useState(getGlobalSettings());

    const [selectedState, setSelectedState] = useState('All States');
    const [selectedCrop, setSelectedCrop] = useState('All Crops');
    const [selectedMarket, setSelectedMarket] = useState('All Markets');

    const [salesData, setSalesData] = useState<any[]>([]);
    const [priceTrends, setPriceTrends] = useState<any[]>([]);
    const [cropDistribution, setCropDistribution] = useState<any[]>([]);
    const [waterfallData, setWaterfallData] = useState<any[]>([]);
    const [marketPerformance, setMarketPerformance] = useState<any[]>([]);
    const [efficiencyMatrix, setEfficiencyMatrix] = useState<any[]>([]);

    useEffect(() => {
        setStateOptions(getStates());
        setCropOptions(getCrops());
        setMarketOptions(getMarkets());
        setWidgets(getDashboardWidgets());
        setGlobalSettings(getGlobalSettings());
    }, []);

    useEffect(() => {
        const filters = { state: selectedState, crop: selectedCrop, market: selectedMarket };
        const trends = getSalesTrendsData(filters);
        setSalesData(trends);
        setPriceTrends(getMarketPriceTrends(filters));
        setCropDistribution(getCropDistributionData(filters));
        setMarketPerformance(getMarketSalesPerformance(filters));
        setEfficiencyMatrix(getEfficiencyMatrixData(filters));

        let cumulative = 0;
        setWaterfallData(trends.map((item: any) => {
            const start = cumulative;
            cumulative += item.Profit;
            return { 
                name: item.name, 
                base: Math.min(start, cumulative), 
                profit: Math.abs(item.Profit), 
                isPositive: item.Profit >= 0 
            };
        }));
    }, [selectedState, selectedCrop, selectedMarket, language]);

    const COLORS = ['#16a34a', '#22c55e', '#4ade80', '#86efac', '#bbf7d0', '#059669', '#10b981', '#34d399'];
    const strokeColor = theme === 'dark' ? '#94a3b8' : '#64748b';
    const gridColor = theme === 'dark' ? '#334155' : '#e2e8f0';
    const tooltipBg = theme === 'dark' ? '#1e293b' : '#ffffff';

    const ChartHeader = ({ title, subtitle, tag, tagColor }: { title: string, subtitle: string, tag: string, tagColor: string }) => (
        <div className="p-4 border-b border-gray-50 dark:border-slate-700 bg-gray-50/30 dark:bg-slate-800/50 flex justify-between items-center">
            <div className="min-w-0 pr-4">
                <h2 className="text-xs font-black text-gray-800 dark:text-gray-200 uppercase tracking-widest truncate">{title}</h2>
                <p className="text-[10px] text-gray-500 font-bold mt-0.5 truncate">{subtitle}</p>
            </div>
            <span className={`text-[9px] font-black ${tagColor} px-2 py-1 rounded shadow-sm`}>{tag}</span>
        </div>
    );

    const filterMapper = (opt: string, type: 'state' | 'crop' | 'market') => {
        if (opt.includes('All')) return t(`filter_all_${type}s`);
        return translateDynamic(opt);
    };

    const totalProduction = cropDistribution.reduce((acc, curr) => acc + curr.value, 0);
    const targetVal = parseFloat(globalSettings.productionTarget) || 100000;
    const targetProgress = Math.min(100, (totalProduction / targetVal) * 100);

    return (
        <div className="space-y-8 animate-fade-in pb-12">
            {globalSettings.announcement && (
                <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30 p-4 rounded-2xl flex items-center gap-4 animate-slide-down">
                    <span className="text-xl">📢</span>
                    <p className="text-sm font-bold text-amber-900 dark:text-amber-200 italic">{globalSettings.announcement}</p>
                </div>
            )}

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white italic tracking-tight uppercase leading-none">{t('dashboard_title')}</h1>
                    <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mt-1">{t('dashboard_subtitle')}</p>
                </div>
                <div className="flex flex-col items-end">
                    <div className="w-64 h-2 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden mb-1">
                        <div className="h-full bg-primary-600 transition-all duration-1000" style={{ width: `${targetProgress}%` }}></div>
                    </div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t('target_progress')}: {Math.round(targetProgress)}% ({fNum(totalProduction)}T / {fNum(targetVal)}T)</p>
                </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6 bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-700">
                <Select label={t('filter_state_region')} options={['All States', ...stateOptions]} renderOption={(o) => filterMapper(o, 'state')} value={selectedState} onChange={(e) => setSelectedState(e.target.value)} />
                <Select label={t('filter_commodity')} options={['All Crops', ...cropOptions]} renderOption={(o) => filterMapper(o, 'crop')} value={selectedCrop} onChange={(e) => setSelectedCrop(e.target.value)} />
                <Select label={t('filter_mandi')} options={['All Markets', ...marketOptions]} renderOption={(o) => filterMapper(o, 'market')} value={selectedMarket} onChange={(e) => setSelectedMarket(e.target.value)} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* 1. Revenue Velocity (Line Chart) */}
                {widgets.revenue_velocity && (
                    <Card className="!p-0 border border-gray-100 dark:border-slate-700 rounded-3xl overflow-hidden shadow-sm h-[400px]">
                        <ChartHeader title={t('chart_revenue_velocity')} subtitle={t('chart_revenue_subtitle')} tag={t('chart_sales')} tagColor="bg-primary-100 text-primary-700" />
                        <div className="p-4 h-[320px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={salesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                                    <XAxis dataKey="name" stroke={strokeColor} tick={{fontSize: 9, fontWeight: 'bold'}} axisLine={{ stroke: strokeColor }} tickLine={{ stroke: strokeColor }} />
                                    <YAxis stroke={strokeColor} tick={{fontSize: 9, fontWeight: 'bold'}} tickFormatter={(v) => fNum(v, { notation: 'compact' })} axisLine={{ stroke: strokeColor }} tickLine={{ stroke: strokeColor }} />
                                    <Tooltip contentStyle={{ backgroundColor: tooltipBg, border: 'none', borderRadius: '12px' }} formatter={(v: number) => [fNum(v, { style: 'currency' }), t('chart_sales')]} />
                                    <Line name={t('chart_sales')} type="monotone" dataKey="Sales" stroke="#16a34a" strokeWidth={3} dot={{r: 4}} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                )}

                {/* 2. Price Volatility (Area Chart) */}
                {widgets.price_volatility && (
                    <Card className="!p-0 border border-gray-100 dark:border-slate-700 rounded-3xl overflow-hidden shadow-sm h-[400px]">
                        <ChartHeader title={t('chart_price_volatility')} subtitle={t('chart_price_subtitle')} tag={t('chart_forecast')} tagColor="bg-indigo-100 text-indigo-700" />
                        <div className="p-4 h-[320px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={priceTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorIndex" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                                            <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                                    <XAxis dataKey="name" stroke={strokeColor} tick={{fontSize: 9}} axisLine={{ stroke: strokeColor }} tickLine={{ stroke: strokeColor }} />
                                    <YAxis stroke={strokeColor} tick={{fontSize: 9}} axisLine={{ stroke: strokeColor }} tickLine={{ stroke: strokeColor }} />
                                    <Tooltip contentStyle={{ backgroundColor: tooltipBg, border: 'none', borderRadius: '12px' }} />
                                    <Area name={t('chart_index')} type="monotone" dataKey="Index" stroke="#4f46e5" fillOpacity={1} fill="url(#colorIndex)" />
                                    <Area name={t('chart_forecast')} type="monotone" dataKey="Forecast" stroke="#10b981" strokeDasharray="5 5" fill="transparent" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                )}

                {/* 3. Production Mix (Pie Chart) */}
                {widgets.production_mix && (
                    <Card className="!p-0 border border-gray-100 dark:border-slate-700 rounded-3xl overflow-hidden shadow-sm h-[400px]">
                        <ChartHeader title={t('chart_production_mix')} subtitle={t('chart_production_subtitle')} tag={t('chart_inventory')} tagColor="bg-orange-100 text-orange-700" />
                        <div className="p-4 h-[320px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={cropDistribution} cx="50%" cy="50%" innerRadius="40%" outerRadius="70%" paddingAngle={5} dataKey="value" nameKey="name">
                                        {cropDistribution.map((_, idx) => <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />)}
                                    </Pie>
                                    <Tooltip formatter={(v: number, name: string) => [fNum(v, { notation: 'compact' }), translateDynamic(name)]} />
                                    <Legend formatter={(v) => translateDynamic(v)} wrapperStyle={{fontSize: '10px', fontWeight: 'bold'}} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                )}

                {/* 4. Profit Waterfall (Custom Bar Chart) */}
                {widgets.profit_waterfall && (
                    <Card className="!p-0 border border-gray-100 dark:border-slate-700 rounded-3xl overflow-hidden shadow-sm h-[400px]">
                        <ChartHeader title={t('chart_profit_waterfall')} subtitle={t('chart_profit_subtitle')} tag={t('chart_finance')} tagColor="bg-emerald-100 text-emerald-700" />
                        <div className="p-4 h-[320px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={waterfallData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                                    <XAxis dataKey="name" stroke={strokeColor} tick={{fontSize: 9}} axisLine={{ stroke: strokeColor }} tickLine={{ stroke: strokeColor }} />
                                    <YAxis stroke={strokeColor} tick={{fontSize: 9}} axisLine={{ stroke: strokeColor }} tickLine={{ stroke: strokeColor }} />
                                    <Tooltip contentStyle={{ backgroundColor: tooltipBg, border: 'none', borderRadius: '12px' }} formatter={(v: number) => fNum(v, { notation: 'compact' })} />
                                    <Bar dataKey="base" stackId="a" fill="transparent" />
                                    <Bar dataKey="profit" stackId="a">
                                        {waterfallData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.isPositive ? '#16a34a' : '#ef4444'} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                )}

                {/* 5. Market Benchmarks (Bar Chart) */}
                {widgets.market_benchmarks && (
                    <Card className="!p-0 border border-gray-100 dark:border-slate-700 rounded-3xl overflow-hidden shadow-sm h-[400px]">
                        <ChartHeader title={t('chart_market_benchmarks')} subtitle={t('chart_market_subtitle')} tag={t('chart_global')} tagColor="bg-blue-100 text-blue-700" />
                        <div className="p-4 h-[320px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={marketPerformance} layout="vertical" margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke={gridColor} horizontal={false} />
                                    <XAxis type="number" stroke={strokeColor} tick={{fontSize: 9}} axisLine={{ stroke: strokeColor }} tickLine={{ stroke: strokeColor }} />
                                    <YAxis type="category" dataKey="name" stroke={strokeColor} tick={{fontSize: 8, fontWeight: 'bold'}} width={80} axisLine={{ stroke: strokeColor }} tickLine={{ stroke: strokeColor }} />
                                    <Tooltip contentStyle={{ backgroundColor: tooltipBg, border: 'none', borderRadius: '12px' }} formatter={(v: number) => fNum(v, { notation: 'compact' })} />
                                    <Bar dataKey="Sales" fill="#2563eb" radius={[0, 4, 4, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                )}

                {/* 6. Efficiency Matrix (Scatter Chart) */}
                {widgets.efficiency_matrix && (
                    <Card className="!p-0 border border-gray-100 dark:border-slate-700 rounded-3xl overflow-hidden shadow-sm h-[400px]">
                        <ChartHeader title={t('chart_efficiency_matrix')} subtitle={t('chart_efficiency_subtitle')} tag={t('chart_analytics')} tagColor="bg-purple-100 text-purple-700" />
                        <div className="p-4 h-[320px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: -20 }}>
                                    <CartesianGrid stroke={gridColor} />
                                    <XAxis type="number" dataKey="x" name={t('chart_production')} unit="T" stroke={strokeColor} tick={{fontSize: 9}} axisLine={{ stroke: strokeColor }} tickLine={{ stroke: strokeColor }} />
                                    <YAxis type="number" dataKey="y" name={t('chart_profit')} unit="₹" stroke={strokeColor} tick={{fontSize: 9}} tickFormatter={(v) => fNum(v, { notation: 'compact' })} axisLine={{ stroke: strokeColor }} tickLine={{ stroke: strokeColor }} />
                                    <ZAxis type="number" dataKey="price" range={[60, 400]} name="Price" unit="₹/kg" />
                                    <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ backgroundColor: tooltipBg, border: 'none', borderRadius: '12px' }} />
                                    <Scatter name="Crop Efficiency" data={efficiencyMatrix} fill="#9333ea" />
                                </ScatterChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                )}

                {/* 7. Seasonal Rainfall vs Yield (Controllable Widget) */}
                {widgets.seasonal_rainfall && (
                    <Card className="!p-0 border border-gray-100 dark:border-slate-700 rounded-3xl overflow-hidden shadow-sm h-[400px]">
                        <ChartHeader title={t('chart_rainfall_yield')} subtitle={t('chart_rainfall_subtitle')} tag={t('chart_climate')} tagColor="bg-cyan-100 text-cyan-700" />
                        <div className="p-4 h-[320px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: -20 }}>
                                    <CartesianGrid stroke={gridColor} />
                                    <XAxis type="number" dataKey="x" name={t('chart_rainfall')} unit="mm" stroke={strokeColor} tick={{fontSize: 9}} axisLine={{ stroke: strokeColor }} tickLine={{ stroke: strokeColor }} />
                                    <YAxis type="number" dataKey="y" name={t('chart_yield')} unit="T" stroke={strokeColor} tick={{fontSize: 9}} axisLine={{ stroke: strokeColor }} tickLine={{ stroke: strokeColor }} />
                                    <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                                    <Scatter name="Climatic Yield" data={[{x: 120, y: 15}, {x: 180, y: 22}, {x: 80, y: 10}, {x: 250, y: 28}, {x: 150, y: 19}]} fill="#0891b2" />
                                </ScatterChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                )}

                {/* 8. Soil Health Trend (Controllable Widget) */}
                {widgets.soil_health_trend && (
                    <Card className="!p-0 border border-gray-100 dark:border-slate-700 rounded-3xl overflow-hidden shadow-sm h-[400px]">
                        <ChartHeader title={t('chart_soil_health')} subtitle={t('chart_soil_subtitle')} tag={t('chart_soil')} tagColor="bg-lime-100 text-lime-700" />
                        <div className="p-4 h-[320px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={[{name: 'Jan', N: 65, P: 40, K: 50}, {name: 'Feb', N: 62, P: 38, K: 48}, {name: 'Mar', N: 70, P: 45, K: 55}, {name: 'Apr', N: 68, P: 42, K: 52}]} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                                    <XAxis dataKey="name" stroke={strokeColor} tick={{fontSize: 9}} axisLine={{ stroke: strokeColor }} tickLine={{ stroke: strokeColor }} />
                                    <YAxis stroke={strokeColor} tick={{fontSize: 9}} axisLine={{ stroke: strokeColor }} tickLine={{ stroke: strokeColor }} />
                                    <Tooltip />
                                    <Legend wrapperStyle={{fontSize: '9px'}} />
                                    <Line type="monotone" dataKey="N" stroke="#84cc16" strokeWidth={2} dot={{r: 3}} />
                                    <Line type="monotone" dataKey="P" stroke="#ef4444" strokeWidth={2} dot={{r: 3}} />
                                    <Line type="monotone" dataKey="K" stroke="#3b82f6" strokeWidth={2} dot={{r: 3}} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                )}
            </div>
            
            {Object.values(widgets).every(v => v === false) && (
                <div className="py-20 text-center opacity-40">
                    <p className="text-2xl font-black uppercase italic tracking-tighter">{t('no_widgets_active')}</p>
                    <p className="text-xs font-bold uppercase tracking-widest mt-2">{t('contact_admin_widgets')}</p>
                </div>
            )}
        </div>
    );
};

export default Dashboard;