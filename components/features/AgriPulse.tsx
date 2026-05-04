
import React, { useState, useEffect } from 'react';
import Card from '../common/Card';
// Use the existing activity service instead of the missing activityLogService
import { 
    getRegisteredUsersCount as getTotalRegisteredFarmers, 
    getActiveUsersCount as getActiveFarmersTodayCount,
    getActivityLogs as getAllFarmersUsageDetails
} from '../../services/activityService';
// Use the defined ActivityLog type instead of the missing FarmerUsageDetails
import { ActivityLog } from '../../types';
import { useTranslation } from '../../hooks/useTranslation';

const UsageActivity: React.FC = () => {
    const { t } = useTranslation();
    const [totalProfiles, setTotalProfiles] = useState(0);
    const [activeProfiles, setActiveProfiles] = useState(0);
    const [logs, setLogs] = useState<ActivityLog[]>([]);

    useEffect(() => {
        // Fetch stats and logs from the correct service
        setTotalProfiles(getTotalRegisteredFarmers());
        setActiveProfiles(getActiveFarmersTodayCount());

        const rawLogs = getAllFarmersUsageDetails();
        setLogs(rawLogs);

    }, [t]);

    const formatDateTime = (dateString?: string) => {
        if (!dateString) return t('not_applicable') || 'N/A';
        return dateString;
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">
                {t('usage_dashboard_title') || 'Platform Usage Feed'}
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <h2 className="text-lg font-semibold text-gray-600 dark:text-gray-400">
                        {t('total_registered_farmers') || 'Total Registered Farmers'}
                    </h2>
                    <p className="text-4xl font-bold text-primary-600 dark:text-primary-400 mt-2">
                        {totalProfiles}
                    </p>
                </Card>

                <Card>
                    <h2 className="text-lg font-semibold text-gray-600 dark:text-gray-400">
                        {t('active_farmers_today') || 'Active Farmers (Recent)'}
                    </h2>
                    <p className="text-4xl font-bold text-primary-600 dark:text-primary-400 mt-2">
                        {activeProfiles}
                    </p>
                </Card>
            </div>

            <Card>
                <h2 className="text-xl font-semibold mb-4">
                    {t('detailed_farmer_activity') || 'Detailed Farmer Activity'}
                </h2>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
                        <thead className="bg-gray-50 dark:bg-slate-700">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    {t('table_header_username') || 'User'}
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    {t('table_header_state') || 'Region'}
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    {t('table_header_last_activity') || 'Time'}
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    {t('table_header_actions') || 'Action History'}
                                </th>
                            </tr>
                        </thead>

                        <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-700">
                            {logs.map((log) => (
                                <tr key={log.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {log.userName}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {log.userState || 'Unknown'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {formatDateTime(log.timestamp)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-normal text-sm text-gray-600 dark:text-gray-300">
                                        {log.action}
                                    </td>
                                </tr>
                            ))}
                            {logs.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                                        {t('no_activity_recorded') || 'No activity recorded'}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

export default UsageActivity;
