import React, { useState, useEffect } from 'react';
import Card from '../common/Card';
import { getRegisteredUsersCount, getActiveUsersCount, getActivityLogs } from '../../services/activityService';
import { useLanguage } from '../../contexts/LanguageContext';

const UsersActivity: React.FC = () => {
    const { t, translateDynamic, language } = useLanguage();
    const [totalProfiles, setTotalProfiles] = useState(0);
    const [activeProfiles, setActiveProfiles] = useState(0);
    const [logs, setLogs] = useState<any[]>([]);

    useEffect(() => {
        setTotalProfiles(getRegisteredUsersCount());
        setActiveProfiles(getActiveUsersCount());
        setLogs(getActivityLogs());
    }, [language]);

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col gap-1">
                <h1 className="text-3xl font-black text-gray-900 dark:text-white italic tracking-tight uppercase leading-none">{t('users_activity_title')}</h1>
                <p className="text-xs font-black text-gray-500 uppercase tracking-widest">{t('users_activity_subtitle')}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border border-gray-100 dark:border-slate-700">
                    <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest">{t('total_registered_farmers')}</h2>
                    <p className="text-5xl font-black text-primary-600 mt-2">{totalProfiles}</p>
                </Card>
                <Card className="border border-gray-100 dark:border-slate-700">
                    <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest">{t('active_farmers_today')}</h2>
                    <p className="text-5xl font-black text-primary-600 mt-2">{activeProfiles}</p>
                </Card>
            </div>

            <Card className="!p-0 border border-gray-100 dark:border-slate-700 rounded-3xl overflow-hidden shadow-sm">
                <div className="p-6 border-b border-gray-100 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-800/50">
                    <h2 className="text-xl font-black text-gray-800 dark:text-white uppercase tracking-tight italic">{t('detailed_farmer_activity')}</h2>
                </div>
                <div className="overflow-x-auto">
                    <div className="min-w-[800px]">
                        <table className="w-full divide-y divide-gray-100 dark:divide-slate-800">
                            <thead className="bg-gray-50/30 dark:bg-slate-800/30">
                                <tr>
                                    <th className="px-4 py-3 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest w-32">{t('table_header_username')}</th>
                                    <th className="px-4 py-3 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest w-28">{t('table_header_state')}</th>
                                    <th className="px-4 py-3 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest w-36">{t('table_header_feature')}</th>
                                    <th className="px-4 py-3 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest w-32">{t('table_header_last_activity')}</th>
                                    <th className="px-4 py-3 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest min-w-64">{t('table_header_actions')}</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-slate-900 divide-y divide-gray-100 dark:divide-slate-800">
                                {logs.map((log) => (
                                    <tr key={log.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-4 py-4 whitespace-nowrap font-black text-gray-900 dark:text-white italic text-sm">{log.userName}</td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm font-bold text-gray-500">{translateDynamic(log.userState || 'Unknown')}</td>
                                        <td className="px-4 py-4">
                                            <div className="flex flex-wrap gap-1">
                                                {log.featureUsed.split(', ').map((f: string, idx: number) => (
                                                    <span key={f} className="inline-block px-2 py-1 text-xs font-black text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 rounded-md">
                                                        {translateDynamic(f)}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap text-xs font-black text-primary-600">{log.timestamp}</td>
                                        <td className="px-4 py-4">
                                            <div className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                                                {log.action.split(' → ').map((act: string, i: number, arr: any[]) => {
                                                    const parts = act.match(/(.+) \((.+)\)/);
                                                    if (parts) {
                                                        const [, message, time] = parts;
                                                        return (
                                                            <div key={i} className="flex items-center gap-2">
                                                                <span className="font-medium">{translateDynamic(message)}</span>
                                                                <span className="text-xs text-gray-400">({time})</span>
                                                                {i < arr.length - 1 && <span className="text-gray-300">→</span>}
                                                            </div>
                                                        );
                                                    }
                                                    return (
                                                        <div key={i} className="flex items-center gap-2">
                                                            <span className="font-medium">{translateDynamic(act)}</span>
                                                            {i < arr.length - 1 && <span className="text-gray-300">→</span>}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {logs.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-4 py-16 text-center text-gray-300 italic font-black text-xl tracking-tighter opacity-50">
                                            {t('no_activity_recorded')}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default UsersActivity;