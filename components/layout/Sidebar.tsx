
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from '../../hooks/useTranslation';
import { useAuth } from '../../hooks/useAuth';
import { getFeatureVisibility } from '../../services/dataService';

const Sidebar: React.FC = () => {
    const { t } = useTranslation();
    const { user } = useAuth();
    const visibility = getFeatureVisibility();

    const baseLinkClasses = "flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 rounded-lg transition-colors duration-200";
    const activeLinkClasses = "bg-primary-600 text-white font-semibold shadow-lg";
    const inactiveLinkClasses = "hover:bg-gray-200 dark:hover:bg-slate-700";

    const farmerNavItems = [
        { id: 'dashboard', to: '/dashboard', label: t('sidebar_dashboard'), icon: '📊' },
        { id: 'marketIntel', to: '/market-intelligence', label: t('sidebar_market_intel'), icon: '📈' },
        { id: 'predictory', to: '/predictory', label: t('sidebar_predictory'), icon: '🔮' },
        { id: 'cropInsights', to: '/crop-insights', label: t('sidebar_crop_insights'), icon: '🌾' },
        { id: 'schemes', to: '/agri-schemes', label: t('sidebar_schemes'), icon: '📜' },
        { id: 'home', to: '/', label: t('sidebar_home_link'), icon: '🏠', exact: true },
    ].filter(item => {
        if (item.id === 'home') return true;
        return visibility[item.id as keyof typeof visibility] !== false;
    });

    const adminNavItems = [
        { to: '/admin', label: t('admin_title'), icon: '🛡️' },
        { to: '/', label: t('sidebar_home_link'), icon: '🏠', exact: true },
    ];

    const navItems = user?.role === 'Admin' ? adminNavItems : farmerNavItems;

    return (
        <aside className="w-64 flex-shrink-0 bg-white dark:bg-slate-800 p-4 hidden md:block border-r border-gray-200 dark:border-slate-700">
            <div className="mb-6 px-4">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                    {user?.role === 'Admin' ? t('sidebar_management_label') : t('sidebar_farmer_tools_label')}
                </p>
            </div>
            <nav className="flex flex-col space-y-2">
                {navItems.map(item => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        end={(item as any).exact}
                        className={({ isActive }) => `${baseLinkClasses} ${isActive ? activeLinkClasses : inactiveLinkClasses}`}
                    >
                        <span className="mr-3 text-lg">{item.icon}</span>
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </nav>
        </aside>
    );
};

export default Sidebar;
