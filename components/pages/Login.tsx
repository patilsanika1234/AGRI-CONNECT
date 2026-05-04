
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Card from '../common/Card';
import Button from '../common/Button';
import { User } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';

const EyeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.644C3.301 8.844 6.942 5 12 5c5.058 0 8.698 3.844 9.964 6.678a1.012 1.012 0 0 1 0 .644C20.699 15.156 17.058 19 12 19c-5.058 0-8.698-3.844-9.964-6.678Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
  </svg>
);

const EyeSlashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
  </svg>
);

const Login: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'Farmer' | 'Admin'>('Farmer');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const { t } = useLanguage();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError(t('both_email_password_required'));
      return;
    }

    if (activeTab === 'Admin') {
      if (secretKey !== 'ADMIN123') {
        setError(t('invalid_secret_key'));
        return;
      }
    }

    if (activeTab === 'Farmer') {
      if (email === 'farmer@agriconnect.dev' && password === 'password123') {
        login({ email, name: 'Default Farmer', role: 'Farmer', state: 'Maharashtra' });
        return;
      }
    } else {
      if (email === 'admin@agriconnect.dev' && password === 'admin123') {
        login({ email, name: 'System Admin', role: 'Admin', state: 'All' });
        return;
      }
    }

    const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const foundUser: (User & { password?: string }) | undefined = storedUsers.find(
      (user: any) => user.email === email && user.password === password && user.role === activeTab
    );

    if (foundUser) {
      login({ email: foundUser.email, name: foundUser.name, role: foundUser.role, state: foundUser.state });
    } else {
      setError(activeTab === 'Farmer' 
        ? t('invalid_farmer_credentials')
        : t('invalid_admin_credentials'));
    }
  };

  const tabClass = (tab: 'Farmer' | 'Admin') => 
    `flex-1 py-4 text-xs font-black border-b-2 transition-all duration-300 uppercase tracking-widest ${
      activeTab === tab 
        ? 'border-primary-500 text-primary-600 bg-primary-50/50 dark:bg-primary-900/10' 
        : 'border-transparent text-gray-400 hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-slate-700/50'
    }`;

  const inputStyle = "mt-1.5 block w-full px-4 py-3 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent sm:text-sm transition-all placeholder-gray-400 font-medium";

  return (
    <div className="flex items-center justify-center min-h-[70vh] py-12 px-4 sm:px-6">
      <Card className="max-w-md w-full !p-0 overflow-hidden shadow-2xl border border-gray-100 dark:border-slate-700 rounded-3xl">
        <div className="flex w-full">
          <button onClick={() => { setActiveTab('Farmer'); setError(''); }} className={tabClass('Farmer')}>
            {t('farmer_login')}
          </button>
          <button onClick={() => { setActiveTab('Admin'); setError(''); }} className={tabClass('Admin')}>
            {t('admin_login')}
          </button>
        </div>
        
        <div className="p-8 sm:p-10">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
              {activeTab === 'Farmer' ? t('farmer_login') : t('admin_login')}
            </h2>
            <p className="text-sm text-gray-500 font-bold mt-2 uppercase tracking-widest">{t('access_marketplace_portal')}</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">
                {t('email_label')}
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputStyle}
                required
                autoComplete="email"
                placeholder=""
              />
            </div>
            <div>
              <div className="flex justify-between items-center">
                <label htmlFor="password" className="block text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">
                  {t('password_label')}
                </label>
                <Link to="/forgot-password" university-link="true" className="text-xs font-bold text-primary-600 hover:text-primary-500 transition-colors">
                  {t('forgot_password_link')}
                </Link>
              </div>
              <div className="mt-1.5 relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={inputStyle}
                  required
                  autoComplete="current-password"
                  placeholder=""
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-primary-500 transition-colors"
                >
                  {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>
            
            {activeTab === 'Admin' && (
              <div>
                <label htmlFor="secretKey" className="block text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">
                  {t('secret_key_label')}
                </label>
                <input
                  type="password"
                  id="secretKey"
                  value={secretKey}
                  onChange={(e) => setSecretKey(e.target.value)}
                  className={inputStyle}
                  required={activeTab === 'Admin'}
                  placeholder=""
                />
              </div>
            )}
            
            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/50 rounded-xl text-red-600 dark:text-red-400 text-xs font-bold text-center">
                {error}
              </div>
            )}

            <div className="pt-2">
              <Button type="submit" className="w-full py-4 rounded-xl text-sm font-black uppercase tracking-[0.2em] shadow-xl active:scale-[0.98] transition-all">
                {activeTab === 'Farmer' ? t('farmer_login') : t('admin_login')}
              </Button>
            </div>
             <div className="text-sm text-center pt-4">
                <p className="text-gray-500 dark:text-gray-400 font-medium">
                  {t('not_a_member')}{' '}
                  <Link to="/register" className="font-black text-primary-600 hover:text-primary-500 underline decoration-2 underline-offset-4 transition-all">
                    {t('signup_now_link')}
                  </Link>
                </p>
              </div>
          </form>
        </div>
      </Card>
    </div>
  );
};

export default Login;
