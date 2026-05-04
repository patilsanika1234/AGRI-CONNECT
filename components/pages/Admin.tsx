import React, { useState, useEffect } from 'react';
import Card from '../common/Card';
import Button from '../common/Button';
import Select from '../common/Select';
import { 
  getStates, addState, deleteState,
  getCrops, addCrop, deleteCrop, 
  getMarkets, addMarket, deleteMarket, 
  getSchemes, addScheme, deleteScheme,
  getFeatureVisibility, setFeatureVisibility,
  getDashboardWidgets, setDashboardWidget,
  getGlobalSettings, setGlobalSettings
} from '../../services/dataService';
import { useLanguage } from '../../contexts/LanguageContext';

// Sub-components for Admin Control
import Dashboard from '../features/Dashboard';
import MarketIntelligence from '../features/MarketIntelligence';
import GovSchemes from '../features/GovSchemes';
import UsersActivity from '../features/UsersActivity';

const Admin: React.FC = () => {
  const { t, translateDynamic } = useLanguage();
  const [activePanel, setActivePanel] = useState<'overview' | 'dashboard' | 'markets' | 'crops' | 'states' | 'schemes' | 'access' | 'activity'>('overview');
  
  // Data States
  const [states, setStates] = useState<string[]>([]);
  const [crops, setCrops] = useState<string[]>([]);
  const [markets, setMarkets] = useState<string[]>([]);
  const [schemes, setSchemes] = useState<any[]>([]);
  const [visibility, setVisibility] = useState<any>(getFeatureVisibility());
  const [widgets, setWidgets] = useState<any>(getDashboardWidgets());
  const [settings, setSettingsState] = useState(getGlobalSettings());

  // Form States
  const [newState, setNewState] = useState('');
  const [newCrop, setNewCrop] = useState('');
  const [newMarket, setNewMarket] = useState('');
  const [newScheme, setNewScheme] = useState({ name: '', state: 'All', description: '', link: '', status: 'Active' });

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = () => {
    setStates(getStates());
    setCrops(getCrops());
    setMarkets(getMarkets());
    setSchemes(getSchemes());
    setVisibility(getFeatureVisibility());
    setWidgets(getDashboardWidgets());
    setSettingsState(getGlobalSettings());
  };

  const handleToggleVisibility = (feature: string) => {
    const newVal = !visibility[feature];
    setFeatureVisibility(feature, newVal);
    setVisibility({ ...visibility, [feature]: newVal });
  };

  const handleToggleWidget = (widget: string) => {
    const newVal = !widgets[widget];
    setDashboardWidget(widget, newVal);
    setWidgets({ ...widgets, [widget]: newVal });
  };

  const handleUpdateSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setGlobalSettings(settings);
    alert(t('platform_params_updated'));
    refreshData();
  };

  const handleAddState = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newState) return;
    addState(newState);
    setNewState('');
    refreshData();
  };

  const handleDeleteState = (s: string) => {
    if (confirm(t('confirm_delete_state', { state: s }))) {
      deleteState(s);
      refreshData();
    }
  };

  const handleAddCrop = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCrop) return;
    addCrop(newCrop);
    setNewCrop('');
    refreshData();
  };

  const handleDeleteCrop = (c: string) => {
    if (confirm(t('confirm_delete_crop', { crop: c }))) {
      deleteCrop(c);
      refreshData();
    }
  };

  const handleAddMarket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMarket) return;
    addMarket(newMarket);
    setNewMarket('');
    refreshData();
  };

  const handleDeleteMarket = (m: string) => {
    if (confirm(t('confirm_delete_market', { market: m }))) {
      deleteMarket(m);
      refreshData();
    }
  };

  const handleAddScheme = (e: React.FormEvent) => {
    e.preventDefault();
    addScheme(newScheme as any);
    setNewScheme({ name: '', state: 'All', description: '', link: '', status: 'Active' });
    refreshData();
  };

  const handleDeleteScheme = (id: number) => {
    if (confirm(t('confirm_delete_scheme'))) {
      deleteScheme(id);
      refreshData();
    }
  };

  const ControlSidebarLink = ({ id, label, icon }: { id: any, label: string, icon: string }) => (
    <button
      onClick={() => setActivePanel(id)}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
        activePanel === id 
          ? 'bg-primary-600 text-white shadow-lg' 
          : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-800'
      }`}
    >
      <span className="text-lg">{icon}</span>
      {label}
    </button>
  );

  return (
    <div className="flex flex-col lg:flex-row gap-8 pb-12 min-h-[80vh]">
      {/* Sidebar Control Panel */}
      <aside className="lg:w-72 flex-shrink-0 space-y-6">
        <div className="p-2">
          <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tighter italic uppercase mb-1">
            {t('admin_title')}
          </h1>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            {t('admin_subtitle')}
          </p>
        </div>
        
        <nav className="space-y-1">
          <ControlSidebarLink id="overview" label={t('protocol_overview')} icon="🛡️" />
          <ControlSidebarLink id="access" label={t('access_control')} icon="🔑" />
          <hr className="my-4 border-gray-100 dark:border-slate-800" />
          <p className="px-4 text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">{t('resource_management')}</p>
          <ControlSidebarLink id="dashboard" label={t('dashboard_config')} icon="📊" />
          <ControlSidebarLink id="states" label={t('state_regions')} icon="🌍" />
          <ControlSidebarLink id="markets" label={t('market_hubs')} icon="📍" />
          <ControlSidebarLink id="crops" label={t('crop_inventory')} icon="🌾" />
          <ControlSidebarLink id="schemes" label={t('policy_manager')} icon="📜" />
          <hr className="my-4 border-gray-100 dark:border-slate-800" />
          <p className="px-4 text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">{t('live_monitoring')}</p>
          <ControlSidebarLink id="activity" label={t('activity_pulse')} icon="📡" />
        </nav>
      </aside>

      {/* Main Panel Content */}
      <main className="flex-grow animate-fade-in">
        {activePanel === 'overview' && (
          <div className="space-y-8">
            <Card className="bg-slate-900 text-white border-none rounded-[3rem] shadow-2xl p-12 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-12 opacity-10 text-[10rem]">🛡️</div>
              <h2 className="text-4xl font-black italic mb-6">{t('administrative_node')}</h2>
              <div className="max-w-xl space-y-4 text-slate-400 font-medium">
                <p>{t('manage_agricultural_data')}</p>
              </div>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-8 bg-white dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-slate-700 shadow-sm">
                <p className="text-xs font-black text-gray-400 uppercase mb-2">{t('total_states')}</p>
                <p className="text-4xl font-black text-emerald-600">{states.length}</p>
              </div>
              <div className="p-8 bg-white dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-slate-700 shadow-sm">
                <p className="text-xs font-black text-gray-400 uppercase mb-2">{t('total_crops')}</p>
                <p className="text-4xl font-black text-primary-600">{crops.length}</p>
              </div>
              <div className="p-8 bg-white dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-slate-700 shadow-sm">
                <p className="text-xs font-black text-gray-400 uppercase mb-2">{t('tracked_mandis')}</p>
                <p className="text-4xl font-black text-orange-600">{markets.length}</p>
              </div>
              <div className="p-8 bg-white dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-slate-700 shadow-sm">
                <p className="text-xs font-black text-gray-400 uppercase mb-2">{t('active_policies')}</p>
                <p className="text-4xl font-black text-indigo-600">{schemes.length}</p>
              </div>
            </div>
          </div>
        )}

        {activePanel === 'access' && (
          <div className="space-y-6">
            <Card className="rounded-[2.5rem] border border-gray-100 dark:border-slate-700">
              <h2 className="text-xl font-black italic mb-6 uppercase tracking-tight">{t('access_control_layer')}</h2>
              <div className="space-y-4">
                {[
                  { id: 'dashboard', label: t('sidebar_dashboard'), icon: '📊' },
                  { id: 'marketIntel', label: t('market_intel_title'), icon: '📈' },
                  { id: 'cropAdvisory', label: t('sidebar_advisory'), icon: '🌿' },
                  { id: 'schemes', label: t('gov_schemes_title'), icon: '📜' },
                  { id: 'activity', label: t('users_activity_title'), icon: '📡' }
                ].map(feat => (
                  <div key={feat.id} className="flex items-center justify-between p-6 bg-gray-50 dark:bg-slate-900/50 rounded-2xl border border-gray-100 dark:border-slate-800">
                    <div className="flex items-center gap-4">
                      <span className="text-2xl">{feat.icon}</span>
                      <span className="font-black uppercase text-xs tracking-widest text-gray-700 dark:text-gray-300">{feat.label}</span>
                    </div>
                    <button 
                      onClick={() => handleToggleVisibility(feat.id)}
                      className={`relative inline-flex h-6 w-11 rounded-full border-2 border-transparent transition-colors duration-200 ${visibility[feat.id] ? 'bg-primary-600' : 'bg-gray-200 dark:bg-slate-700'}`}
                    >
                      <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition duration-200 ${visibility[feat.id] ? 'translate-x-5' : 'translate-x-0'}`} />
                    </button>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {activePanel === 'dashboard' && (
            <div className="space-y-8 animate-fade-in">
                <Card className="rounded-[2.5rem] border border-gray-100 dark:border-slate-700">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-black italic uppercase tracking-tight">{t('dashboard_configuration')}</h2>
                        <span className="px-3 py-1 bg-primary-50 text-primary-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-primary-100">{t('live_control')}</span>
                    </div>
                    
                    <div className="space-y-8">
                        <form onSubmit={handleUpdateSettings} className="space-y-4 p-6 bg-gray-50 dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800">
                            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">{t('global_platform_metrics')}</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-black text-gray-500 uppercase mb-1">{t('regional_production_target')}</label>
                                    <input 
                                        type="number" 
                                        value={settings.productionTarget} 
                                        onChange={e => setSettingsState({...settings, productionTarget: e.target.value})}
                                        className="w-full px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 font-bold"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-gray-500 uppercase mb-1">{t('dashboard_announcement')}</label>
                                    <input 
                                        type="text" 
                                        value={settings.announcement} 
                                        onChange={e => setSettingsState({...settings, announcement: e.target.value})}
                                        className="w-full px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 font-bold"
                                    />
                                </div>
                            </div>
                            <Button type="submit" className="!rounded-xl !py-2 !text-[10px] font-black uppercase tracking-widest px-6">{t('apply_changes')}</Button>
                        </form>

                        <div>
                            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">{t('analytical_widget_visibility')}</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[
                                    { id: 'revenue_velocity', label: t('chart_revenue_velocity'), icon: '📈' },
                                    { id: 'price_volatility', label: t('chart_price_volatility'), icon: '📉' },
                                    { id: 'production_mix', label: t('chart_production_mix'), icon: '🥧' },
                                    { id: 'profit_waterfall', label: t('chart_profit_waterfall'), icon: '🌊' },
                                    { id: 'market_benchmarks', label: t('chart_market_benchmarks'), icon: '📊' },
                                    { id: 'efficiency_matrix', label: t('chart_efficiency_matrix'), icon: '🎯' },
                                    { id: 'seasonal_rainfall', label: t('chart_rainfall_yield'), icon: '🌧️' },
                                    { id: 'soil_health_trend', label: t('chart_soil_health'), icon: '🧪' }
                                ].map(widget => (
                                    <div key={widget.id} className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-2xl border-2 border-gray-50 dark:border-slate-700 shadow-sm hover:border-primary-100 transition-all">
                                        <div className="flex items-center gap-3">
                                            <span className="text-lg">{widget.icon}</span>
                                            <span className="font-black uppercase text-[10px] tracking-widest text-gray-800 dark:text-gray-200">{widget.label}</span>
                                        </div>
                                        <button 
                                            onClick={() => handleToggleWidget(widget.id)}
                                            className={`relative inline-flex h-5 w-10 rounded-full border-2 border-transparent transition-colors duration-200 ${widgets[widget.id] ? 'bg-primary-600' : 'bg-gray-200 dark:bg-slate-700'}`}
                                        >
                                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ${widgets[widget.id] ? 'translate-x-5' : 'translate-x-0'}`} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </Card>

                <div className="bg-primary-50 dark:bg-primary-900/10 p-6 rounded-[2rem] border-2 border-primary-100 dark:border-primary-800 flex items-center justify-between">
                    <div>
                        <p className="text-xs font-black text-primary-700 dark:text-primary-300 uppercase italic">{t('preview_status')}</p>
                        <p className="text-sm font-bold text-primary-900 dark:text-white mt-1">
                            {Object.values(widgets).filter(v => v).length} {t('widgets_active')} | {t('target')}: {settings.productionTarget}T
                        </p>
                    </div>
                    <Button onClick={() => window.open('#/dashboard', '_blank')} className="!rounded-xl !py-2.5 !px-6 !text-[10px] font-black uppercase">{t('inspect_live_view')}</Button>
                </div>
            </div>
        )}

        {activePanel === 'states' && (
          <div className="space-y-6">
            <Card className="rounded-[2.5rem] border border-gray-100 dark:border-slate-700">
              <h2 className="text-xl font-black italic mb-6 uppercase tracking-tight">{t('regional_state_management')}</h2>
              <form onSubmit={handleAddState} className="flex flex-col sm:flex-row gap-3 mb-8">
                <input
                  type="text"
                  value={newState}
                  onChange={(e) => setNewState(e.target.value)}
                  placeholder={t('new_state_placeholder')}
                  className="flex-grow px-6 py-4 bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-2xl font-bold"
                />
                <Button type="submit" className="!rounded-2xl px-8 py-4 font-black uppercase tracking-widest">{t('add')}</Button>
              </form>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {states.map((s, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-900/50 rounded-2xl border border-gray-100 dark:border-slate-800 group">
                    <span className="text-xs font-black uppercase text-gray-700 dark:text-gray-300">{translateDynamic(s)}</span>
                    <button onClick={() => handleDeleteState(s)} className="p-2 text-red-400 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100">🗑️</button>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {activePanel === 'markets' && (
          <div className="space-y-8">
            <Card className="rounded-[2.5rem] border border-gray-100 dark:border-slate-700">
              <h2 className="text-xl font-black italic mb-6 uppercase tracking-tight">{t('regional_hub_management')}</h2>
              <form onSubmit={handleAddMarket} className="flex flex-col sm:flex-row gap-3 mb-8">
                <input
                  type="text"
                  value={newMarket}
                  onChange={(e) => setNewMarket(e.target.value)}
                  placeholder={t('new_market_placeholder')}
                  className="flex-grow px-6 py-4 bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-2xl font-bold"
                />
                <Button type="submit" className="!rounded-2xl px-8 py-4 font-black uppercase tracking-widest">{t('add')}</Button>
              </form>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {markets.map((m, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl group shadow-sm">
                    <span className="text-xs font-black uppercase text-gray-700 dark:text-gray-300 tracking-tight">{translateDynamic(m)}</span>
                    <button onClick={() => handleDeleteMarket(m)} className="p-2 text-red-400 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100">🗑️</button>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {activePanel === 'crops' && (
          <div className="space-y-6">
            <Card className="rounded-[2.5rem] border border-gray-100 dark:border-slate-700">
              <h2 className="text-xl font-black italic mb-6 uppercase tracking-tight">{t('commodity_inventory_control')}</h2>
              <form onSubmit={handleAddCrop} className="flex flex-col sm:flex-row gap-3 mb-8">
                <input
                  type="text"
                  value={newCrop}
                  onChange={(e) => setNewCrop(e.target.value)}
                  placeholder={t('new_crop_placeholder')}
                  className="flex-grow px-6 py-4 bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-2xl font-bold"
                />
                <Button type="submit" className="!rounded-2xl px-8 py-4 font-black uppercase tracking-widest">{t('add')}</Button>
              </form>

              <div className="flex flex-wrap gap-3">
                {crops.map((c, i) => (
                  <div key={i} className="flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-xl text-[10px] font-black uppercase tracking-tight border border-blue-100 dark:border-blue-800/50 group">
                    {translateDynamic(c)}
                    <button onClick={() => handleDeleteCrop(c)} className="hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 ml-1">🗑️</button>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {activePanel === 'schemes' && (
          <div className="space-y-8">
            <Card className="rounded-[2.5rem] border border-gray-100 dark:border-slate-700">
              <h2 className="text-xl font-black italic mb-6 uppercase tracking-tight">{t('policy_injection_center')}</h2>
              <form onSubmit={handleAddScheme} className="space-y-4 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input type="text" placeholder={t('policy_name_placeholder')} className="w-full px-6 py-3 bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl font-bold" value={newScheme.name} onChange={e => setNewScheme({...newScheme, name: e.target.value})} required />
                  <Select label="" options={['All', ...states]} renderOption={o => o === 'All' ? t('target_national') : `${t('target')}: ${translateDynamic(o)}`} value={newScheme.state} onChange={e => setNewScheme({...newScheme, state: e.target.value})} />
                </div>
                <input type="text" placeholder={t('portal_url_placeholder')} className="w-full px-6 py-3 bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl font-bold" value={newScheme.link} onChange={e => setNewScheme({...newScheme, link: e.target.value})} required />
                <textarea placeholder={t('description_placeholder')} className="w-full px-6 py-3 bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl font-bold min-h-[80px]" value={newScheme.description} onChange={e => setNewScheme({...newScheme, description: e.target.value})} required />
                <Button type="submit" className="!rounded-2xl px-10 py-4 font-black uppercase tracking-widest w-full md:w-auto">{t('add_policy')}</Button>
              </form>

              <div className="space-y-3 max-h-[400px] overflow-y-auto no-scrollbar pr-2">
                {schemes.map((s, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-900/50 rounded-2xl border border-gray-100 dark:border-slate-800 group">
                    <div className="min-w-0">
                      <p className="font-black text-xs uppercase text-gray-800 dark:text-white truncate">{translateDynamic(s.name)}</p>
                      <p className="text-[10px] font-bold text-gray-500 uppercase">{translateDynamic(s.state)}</p>
                    </div>
                    <button onClick={() => handleDeleteScheme(s.id)} className="p-2 text-red-400 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100">🗑️</button>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {activePanel === 'activity' && <UsersActivity />}
      </main>
    </div>
  );
};

export default Admin;