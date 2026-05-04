import React from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import ThemeToggle from '../common/ThemeToggle';
import Button from '../common/Button';
import { Icon } from '../common/Icon';
import { useLanguage } from '../../contexts/LanguageContext';
import { SUPPORTED_LANGUAGES } from '../../constants';

const LanguageSelector: React.FC = () => {
    const { language, changeLanguage } = useLanguage();
    return (
        <div className="relative">
            <Icon name="language" size={16} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500" />
            <select 
                value={language} 
                onChange={(e) => changeLanguage(e.target.value)}
                className="bg-gray-100 dark:bg-slate-700 text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-slate-600 rounded-lg py-1.5 pl-8 pr-8 text-sm font-black focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-sm transition-all cursor-pointer appearance-none"
            >
                {SUPPORTED_LANGUAGES.map(lang => (
                    <option key={lang.code} value={lang.code}>{lang.name}</option>
                ))}
            </select>
            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">▼</span>
        </div>
    );
};

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const homeLink = user ? (user.role === 'Admin' ? '/admin' : '/dashboard') : '/';

  const navLinkClass = ({isActive}: {isActive: boolean}) => 
    `flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg transition-colors ${
        isActive 
            ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/20' 
            : 'text-gray-400 hover:text-primary-600'
    }`;

  return (
    <header className="sticky top-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-gray-100 dark:border-slate-800 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <Link to={homeLink} className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Icon name="farm" size={24} className="text-white" />
              </div>
              <span className="text-2xl font-black text-gray-900 dark:text-white tracking-tighter italic group-hover:text-primary-600 transition-colors">{t('app_name')}</span>
          </Link>
          
          <nav className="hidden sm:flex items-center gap-1 border-l border-gray-100 dark:border-slate-800 pl-6">
              <NavLink to="/" className={navLinkClass}><Icon name="home" size={14} />{t('nav_home')}</NavLink>
              <NavLink to="/about" className={navLinkClass}><Icon name="info" size={14} />{t('nav_about')}</NavLink>
              <NavLink to="/contact" className={navLinkClass}><Icon name="user" size={14} />{t('nav_contact')}</NavLink>
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          <LanguageSelector />
          <ThemeToggle />
          {user ? (
            <div className="flex items-center space-x-4 border-l border-gray-100 dark:border-slate-800 pl-6">
              <div className="hidden md:flex flex-col items-end">
                  <span className="text-[9px] font-black text-primary-600 uppercase tracking-widest leading-none mb-1">{user.role}</span>
                  <span className="text-sm font-black text-gray-800 dark:text-gray-200 italic">{user.name}</span>
              </div>
              <Button onClick={logout} variant="secondary" icon="logout" className="!py-2 !px-4 !text-[10px] font-black uppercase tracking-widest !rounded-xl !bg-red-50 !text-red-600 hover:!bg-red-100 dark:!bg-red-900/10" />
            </div>
          ) : (
            <Link to="/login">
              <Button icon="user" className="!rounded-xl px-6 py-2.5 font-black uppercase tracking-widest shadow-lg">{t('login_button')}</Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
