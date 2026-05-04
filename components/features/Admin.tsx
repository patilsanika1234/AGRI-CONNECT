
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { Scheme } from '../../types';
import {
  getCrops,
  addCrop,
  deleteCrop,
  getStates,
  addState,
  deleteState,
  getMarkets,
  addMarket,
  deleteMarket,
  getSchemes,
  addScheme,
  deleteScheme,
  getFeatureVisibility,
  setFeatureVisibility,
  getDashboardWidgets,
  setDashboardWidget,
  getGlobalSettings,
  setGlobalSettings,
} from '../../services/dataService';
import { LayoutDashboard, Database, Settings, Eye, Grid, Plus, Trash2 } from 'lucide-react';

const Admin: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'overview' | 'data' | 'features' | 'widgets' | 'settings'>('overview');

  // Data states
  const [crops, setCrops] = useState<string[]>([]);
  const [states, setStates] = useState<string[]>([]);
  const [markets, setMarkets] = useState<string[]>([]);
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [newItem, setNewItem] = useState('');
  const [newScheme, setNewScheme] = useState<Partial<Scheme>>({
    name: '',
    state: '',
    category: '',
    status: 'Active',
    description: '',
    link: ''
  });
  const [activeDataTab, setActiveDataTab] = useState<'crops' | 'states' | 'markets' | 'schemes'>('crops');

  // Feature visibility states
  const [features, setFeatures] = useState({
    dashboard: true,
    marketIntel: true,
    cropAdvisory: true,
    schemes: true,
    activity: true
  });

  // Widget states
  const [widgets, setWidgets] = useState({
    revenue_velocity: true,
    price_volatility: true,
    production_mix: true,
    profit_waterfall: true,
    market_benchmarks: true,
    efficiency_matrix: true,
    seasonal_rainfall: false,
    soil_health_trend: false
  });

  // Settings states
  const [settings, setSettings] = useState({
    productionTarget: '50000',
    announcement: 'Welcome to AgriConnect.'
  });

  useEffect(() => {
    refreshData();
    setFeatures(getFeatureVisibility());
    setWidgets(getDashboardWidgets());
    const gs = getGlobalSettings();
    setSettings({
      productionTarget: gs.productionTarget,
      announcement: gs.announcement
    });
  }, []);

  const refreshData = () => {
    setCrops(getCrops());
    setStates(getStates());
    setMarkets(getMarkets());
    setSchemes(getSchemes());
  };

  const handleAddCrop = () => {
    if (newItem.trim()) {
      addCrop(newItem.trim());
      setNewItem('');
      refreshData();
    }
  };

  const handleDeleteCrop = (crop: string) => {
    deleteCrop(crop);
    refreshData();
  };

  const handleAddState = () => {
    if (newItem.trim()) {
      addState(newItem.trim());
      setNewItem('');
      refreshData();
    }
  };

  const handleDeleteState = (state: string) => {
    deleteState(state);
    refreshData();
  };

  const handleAddMarket = () => {
    if (newItem.trim()) {
      addMarket(newItem.trim());
      setNewItem('');
      refreshData();
    }
  };

  const handleDeleteMarket = (market: string) => {
    deleteMarket(market);
    refreshData();
  };

  const handleAddScheme = () => {
    if (newScheme.name && newScheme.state && newScheme.category) {
      addScheme(newScheme as Omit<Scheme, 'id'>);
      setNewScheme({
        name: '',
        state: '',
        category: '',
        status: 'Active',
        description: '',
        link: ''
      });
      refreshData();
    }
  };

  const handleDeleteScheme = (id: number) => {
    deleteScheme(id);
    refreshData();
  };

  const toggleFeature = (feature: string) => {
    const current = features[feature as keyof typeof features];
    setFeatureVisibility(feature, !current);
    setFeatures(prev => ({ ...prev, [feature]: !current }));
  };

  const toggleWidget = (widget: string) => {
    const current = widgets[widget as keyof typeof widgets];
    setDashboardWidget(widget, !current);
    setWidgets(prev => ({ ...prev, [widget]: !current }));
  };

  const saveSettings = () => {
    setGlobalSettings({
      productionTarget: settings.productionTarget,
      announcement: settings.announcement
    });
    alert('Settings saved successfully!');
  };

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 dark:bg-blue-900/30 p-6 rounded-lg">
          <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{crops.length}</div>
          <div className="text-sm text-gray-600 dark:text-gray-300">{t('total_crops') || 'Total Crops'}</div>
        </div>
        <div className="bg-green-50 dark:bg-green-900/30 p-6 rounded-lg">
          <div className="text-3xl font-bold text-green-600 dark:text-green-400">{states.length}</div>
          <div className="text-sm text-gray-600 dark:text-gray-300">{t('total_states') || 'Total States'}</div>
        </div>
        <div className="bg-purple-50 dark:bg-purple-900/30 p-6 rounded-lg">
          <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">{markets.length}</div>
          <div className="text-sm text-gray-600 dark:text-gray-300">{t('total_markets') || 'Total Markets'}</div>
        </div>
        <div className="bg-orange-50 dark:bg-orange-900/30 p-6 rounded-lg">
          <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">{schemes.length}</div>
          <div className="text-sm text-gray-600 dark:text-gray-300">{t('total_schemes') || 'Total Schemes'}</div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">{t('platform_stats') || 'Platform Statistics'}</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center py-2 border-b dark:border-gray-700">
            <span className="text-gray-600 dark:text-gray-300">{t('active_features') || 'Active Features'}</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {Object.values(features).filter(Boolean).length} / {Object.keys(features).length}
            </span>
          </div>
          <div className="flex justify-between items-center py-2 border-b dark:border-gray-700">
            <span className="text-gray-600 dark:text-gray-300">{t('visible_widgets') || 'Visible Widgets'}</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {Object.values(widgets).filter(Boolean).length} / {Object.keys(widgets).length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDataManagement = () => (
    <div className="space-y-4">
      <div className="flex space-x-2 mb-4">
        {(['crops', 'states', 'markets', 'schemes'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveDataTab(tab)}
            className={`px-4 py-2 rounded-lg font-medium capitalize ${
              activeDataTab === tab
                ? 'bg-emerald-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            {t(`tab_${tab}`) || tab}
          </button>
        ))}
      </div>

      {activeDataTab === 'crops' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">{t('manage_crops') || 'Manage Crops'}</h3>
          <div className="flex space-x-2 mb-4">
            <input
              type="text"
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              placeholder={t('enter_crop_name') || 'Enter new crop name'}
              className="flex-1 px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            <button
              onClick={handleAddCrop}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              {t('add') || 'Add'}
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 max-h-96 overflow-y-auto">
            {crops.map((crop) => (
              <div
                key={crop}
                className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <span className="text-gray-900 dark:text-white">{crop}</span>
                <button
                  onClick={() => handleDeleteCrop(crop)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeDataTab === 'states' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">{t('manage_states') || 'Manage States'}</h3>
          <div className="flex space-x-2 mb-4">
            <input
              type="text"
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              placeholder={t('enter_state_name') || 'Enter new state name'}
              className="flex-1 px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            <button
              onClick={handleAddState}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              {t('add') || 'Add'}
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 max-h-96 overflow-y-auto">
            {states.map((state) => (
              <div
                key={state}
                className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <span className="text-gray-900 dark:text-white">{state}</span>
                <button
                  onClick={() => handleDeleteState(state)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeDataTab === 'markets' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">{t('manage_markets') || 'Manage Markets'}</h3>
          <div className="flex space-x-2 mb-4">
            <input
              type="text"
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              placeholder={t('enter_market_name') || 'Enter new market name'}
              className="flex-1 px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            <button
              onClick={handleAddMarket}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              {t('add') || 'Add'}
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-96 overflow-y-auto">
            {markets.map((market) => (
              <div
                key={market}
                className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <span className="text-gray-900 dark:text-white text-sm">{market}</span>
                <button
                  onClick={() => handleDeleteMarket(market)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeDataTab === 'schemes' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">{t('manage_schemes') || 'Manage Schemes'}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              value={newScheme.name}
              onChange={(e) => setNewScheme({ ...newScheme, name: e.target.value })}
              placeholder={t('scheme_name') || 'Scheme Name'}
              className="px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            <input
              type="text"
              value={newScheme.state}
              onChange={(e) => setNewScheme({ ...newScheme, state: e.target.value })}
              placeholder={t('state_all') || 'State (or All)'}
              className="px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            <input
              type="text"
              value={newScheme.category}
              onChange={(e) => setNewScheme({ ...newScheme, category: e.target.value })}
              placeholder={t('category') || 'Category'}
              className="px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            <select
              value={newScheme.status}
              onChange={(e) => setNewScheme({ ...newScheme, status: e.target.value })}
              className="px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="Active">{t('active') || 'Active'}</option>
              <option value="Inactive">{t('inactive') || 'Inactive'}</option>
            </select>
            <textarea
              value={newScheme.description}
              onChange={(e) => setNewScheme({ ...newScheme, description: e.target.value })}
              placeholder={t('description') || 'Description'}
              className="px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white md:col-span-2"
              rows={2}
            />
            <input
              type="text"
              value={newScheme.link}
              onChange={(e) => setNewScheme({ ...newScheme, link: e.target.value })}
              placeholder={t('website_link') || 'Website Link'}
              className="px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white md:col-span-2"
            />
          </div>
          <button
            onClick={handleAddScheme}
            className="w-full px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center justify-center mb-4"
          >
            <Plus className="w-4 h-4 mr-2" />
            {t('add_scheme') || 'Add Scheme'}
          </button>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {schemes.map((scheme) => (
              <div
                key={scheme.id}
                className="flex justify-between items-start p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div className="flex-1">
                  <div className="font-medium text-gray-900 dark:text-white">{scheme.name}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">{scheme.state} | {scheme.category}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{scheme.description}</div>
                </div>
                <button
                  onClick={() => handleDeleteScheme(scheme.id)}
                  className="text-red-500 hover:text-red-700 ml-4"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderFeatures = () => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">{t('feature_visibility') || 'Feature Visibility'}</h3>
      <div className="space-y-3">
        {Object.entries(features).map(([key, value]) => (
          <div
            key={key}
            className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
          >
            <div>
              <span className="font-medium text-gray-900 dark:text-white capitalize">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </span>
            </div>
            <button
              onClick={() => toggleFeature(key)}
              className={`px-4 py-2 rounded-lg font-medium ${
                value
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
              }`}
            >
              {value ? (t('enabled') || 'Enabled') : (t('disabled') || 'Disabled')}
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderWidgets = () => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">{t('dashboard_widgets') || 'Dashboard Widgets'}</h3>
      <div className="space-y-3">
        {Object.entries(widgets).map(([key, value]) => (
          <div
            key={key}
            className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
          >
            <div>
              <span className="font-medium text-gray-900 dark:text-white">
                {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </span>
            </div>
            <button
              onClick={() => toggleWidget(key)}
              className={`px-4 py-2 rounded-lg font-medium ${
                value
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
              }`}
            >
              {value ? (t('visible') || 'Visible') : (t('hidden') || 'Hidden')}
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">{t('system_settings') || 'System Settings'}</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('production_target') || 'Production Target (₹)'}
          </label>
          <input
            type="text"
            value={settings.productionTarget}
            onChange={(e) => setSettings({ ...settings, productionTarget: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('platform_announcement') || 'Platform Announcement'}
          </label>
          <textarea
            value={settings.announcement}
            onChange={(e) => setSettings({ ...settings, announcement: e.target.value })}
            rows={3}
            className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
        <button
          onClick={saveSettings}
          className="w-full px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
        >
          {t('save_settings') || 'Save Settings'}
        </button>
      </div>
    </div>
  );

  if (!user || user.role !== 'admin') {
    return (
      <div className="p-6 text-center text-gray-600 dark:text-gray-400">
        {t('access_denied') || 'Access Denied. Admin privileges required.'}
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('admin_dashboard') || 'Admin Dashboard'}</h1>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {t('logged_in_as') || 'Logged in as'}: {user.email}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { id: 'overview', label: t('overview') || 'Overview', icon: LayoutDashboard },
          { id: 'data', label: t('data_mgmt') || 'Data Management', icon: Database },
          { id: 'features', label: t('features') || 'Features', icon: Eye },
          { id: 'widgets', label: t('widgets') || 'Widgets', icon: Grid },
          { id: 'settings', label: t('settings') || 'Settings', icon: Settings },
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id as typeof activeTab)}
            className={`flex items-center px-4 py-2 rounded-lg font-medium ${
              activeTab === id
                ? 'bg-emerald-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            <Icon className="w-4 h-4 mr-2" />
            {label}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === 'overview' && renderOverview()}
      {activeTab === 'data' && renderDataManagement()}
      {activeTab === 'features' && renderFeatures()}
      {activeTab === 'widgets' && renderWidgets()}
      {activeTab === 'settings' && renderSettings()}
    </div>
  );
};

export default Admin;
