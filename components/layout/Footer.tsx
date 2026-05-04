import React from 'react';
import { useTranslation } from '../../hooks/useTranslation';

const Footer: React.FC = () => {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gray-100 dark:bg-slate-800 border-t border-gray-200 dark:border-slate-700">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
          {t('footer_copyright', { year: year.toString() })}
        </p>
      </div>
    </footer>
  );
};

export default Footer;