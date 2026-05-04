
import React from 'react';
import Card from '../common/Card';
import Button from '../common/Button';
import { useLanguage } from '../../contexts/LanguageContext';

const Contact: React.FC = () => {
  const { t } = useLanguage();
  return (
    <Card>
      <h1 className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-6">{t('contact_title')}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-2">{t('contact_get_in_touch')}</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {t('contact_subtitle')}
          </p>
          <div className="space-y-3">
            <p><strong>{t('contact_email_label')}:</strong> support@agriconnect.dev</p>
            <p><strong>{t('contact_phone_label')}:</strong> +91-123-456-7890</p>
            <p><strong>{t('contact_address_label')}:</strong> AgriTech Park, Pune, Maharashtra, India</p>
          </div>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); alert(t('contact_form_success')); }}>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium">{t('contact_form_name')}</label>
              <input type="text" id="name" className="mt-1 block w-full rounded-md bg-gray-100 dark:bg-slate-700 border-transparent focus:border-primary-500 focus:bg-white dark:focus:bg-slate-600 focus:ring-0" required />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium">{t('contact_form_email')}</label>
              <input type="email" id="email" className="mt-1 block w-full rounded-md bg-gray-100 dark:bg-slate-700 border-transparent focus:border-primary-500 focus:bg-white dark:focus:bg-slate-600 focus:ring-0" required />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium">{t('contact_form_message')}</label>
              <textarea id="message" rows={4} className="mt-1 block w-full rounded-md bg-gray-100 dark:bg-slate-700 border-transparent focus:border-primary-500 focus:bg-white dark:focus:bg-slate-600 focus:ring-0" required></textarea>
            </div>
            <Button type="submit">{t('contact_form_send')}</Button>
          </div>
        </form>
      </div>
    </Card>
  );
};

export default Contact;
