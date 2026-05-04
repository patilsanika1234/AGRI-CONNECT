import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Card from '../common/Card';
import Button from '../common/Button';
import { useLanguage } from '../../contexts/LanguageContext';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const { t } = useLanguage();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && /\S+@\S+\.\S+/.test(email)) {
      setMessage(t('reset_link_sent', { email }));
    } else {
      setMessage(t('reset_link_invalid_email'));
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="max-w-md w-full !p-8 shadow-2xl border border-gray-100 dark:border-slate-700 rounded-3xl">
        <h2 className="text-3xl font-black text-center text-gray-900 dark:text-white tracking-tight mb-6">{t('forgot_password_title')}</h2>
        {message ? (
          <div className="space-y-6">
            <div className="p-4 bg-primary-50 dark:bg-primary-900/10 border border-primary-100 dark:border-primary-900/50 rounded-xl text-primary-700 dark:text-primary-300 text-sm font-bold text-center leading-relaxed">
              {message}
            </div>
            <div className="text-center">
              <Link to="/login">
                <Button className="w-full py-4 rounded-xl font-black uppercase tracking-widest">{t('return_to_login_link')}</Button>
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <p className="text-sm text-center text-gray-500 font-medium leading-relaxed">
              {t('forgot_password_prompt')}
            </p>
            <div>
              <label htmlFor="email" className="block text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1.5">
                {t('email_label')}
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-4 py-3 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 font-medium"
                required
                placeholder={t('login_email_placeholder')}
              />
            </div>
            <div>
              <Button type="submit" className="w-full py-4 rounded-xl font-black uppercase tracking-widest shadow-xl shadow-primary-500/20">
                {t('send_reset_link_button')}
              </Button>
            </div>
            <div className="text-sm text-center pt-2">
              <Link to="/login" className="font-black text-primary-600 hover:text-primary-500 underline decoration-2 underline-offset-4 transition-all">
                {t('return_to_login_link')}
              </Link>
            </div>
          </form>
        )}
      </Card>
    </div>
  );
};

export default ForgotPassword;