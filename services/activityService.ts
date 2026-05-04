
import { ActivityLog, User } from '../types';

const LOGS_KEY = 'agri_activity_logs';
const USERS_KEY = 'users';

export const addLog = (userName: string, action: string, featureUsed: string, loginTime?: number) => {
    const logs: any[] = JSON.parse(localStorage.getItem(LOGS_KEY) || '[]');
    
    // If loginTime isn't provided, try to get it from current session storage
    let sessionTime = loginTime;
    let userState = 'Unknown';

    const currentUser = sessionStorage.getItem('user');
    if (currentUser) {
        try {
            const userObj = JSON.parse(currentUser);
            if (!sessionTime) {
                sessionTime = userObj.loginTime;
            }
            userState = userObj.state;
        } catch (e) {
            console.error("Failed to parse user session for logging", e);
        }
    }

    const newLog: ActivityLog = {
        id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        userName,
        userState,
        action,
        featureUsed,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        fullTimestamp: Date.now(),
        loginTime: sessionTime,
        status: 'Active'
    };
    
    logs.unshift(newLog);
    // Keep a substantial buffer of raw logs to ensure we can reconstruct session histories
    localStorage.setItem(LOGS_KEY, JSON.stringify(logs.slice(0, 1000))); 
};

export const getActivityLogs = (): ActivityLog[] => {
    const rawLogs: ActivityLog[] = JSON.parse(localStorage.getItem(LOGS_KEY) || '[]');
    const now = Date.now();
    
    // Grouping by Session (User Name + Login Timestamp)
    const sessionMap = new Map<string, ActivityLog[]>();

    rawLogs.forEach(log => {
        const sessionKey = `${log.userName}-${log.loginTime || 'no-session'}`;
        if (!sessionMap.has(sessionKey)) {
            sessionMap.set(sessionKey, []);
        }
        sessionMap.get(sessionKey)!.push(log);
    });

    const processedSessions = Array.from(sessionMap.values()).map(group => {
        // Sort actions in the session chronologically (ascending)
        const chronologicalActions = [...group].sort((a, b) => a.fullTimestamp - b.fullTimestamp);
        
        // The display record uses the most recent metadata
        const latestEntry = chronologicalActions[chronologicalActions.length - 1];

        // Aggregate all unique actions with their respective times
        const sessionHistory = chronologicalActions.map(l => `${l.action} (${l.timestamp})`).join(' → ');
        
        // Aggregate features touched
        const featuresUsed = Array.from(new Set(chronologicalActions.map(l => l.featureUsed))).join(', ');

        return {
            ...latestEntry,
            action: sessionHistory,
            featureUsed: featuresUsed,
            timestamp: latestEntry.timestamp 
        };
    });

    // Sort the unique sessions by their latest activity
    return processedSessions
        .sort((a, b) => b.fullTimestamp - a.fullTimestamp)
        .slice(0, 50) // Show last 50 unique user sessions
        .map(log => ({
            ...log,
            // Mark as active if any action in this session happened in the last 10 minutes
            status: (now - log.fullTimestamp < 600000) ? 'Active' : 'Offline'
        }));
};

export const getRegisteredUsersCount = (): number => {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    return users.length + 2; // Demo accounts
};

export const getActiveUsersCount = (): number => {
    const logs = getActivityLogs();
    const uniqueActiveUsers = new Set(
        logs
            .filter(log => log.status === 'Active')
            .map(log => log.userName)
    );
    return Math.max(uniqueActiveUsers.size, 1);
};
