
import React from 'react';
import Card from '../common/Card';
import { useLanguage } from '../../contexts/LanguageContext';

const About: React.FC = () => {
  const { t } = useLanguage();
  
  const features = [
    { id: 1, text: t('about_feature_1_title'), icon: '📈' },
    { id: 2, text: t('about_feature_2_title'), icon: '📊' },
    { id: 3, text: t('about_feature_3_title'), icon: '🌿' },
    { id: 4, text: t('about_feature_4_title'), icon: '📜' },
    { id: 5, text: t('about_feature_5_title'), icon: '🛡️' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <section className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-black text-primary-600 dark:text-primary-400 tracking-tight italic uppercase">
          {t('about_title')}
        </h1>
        <div className="w-24 h-1.5 bg-primary-500 mx-auto rounded-full"></div>
      </section>

      <Card className="border-none shadow-xl rounded-[2.5rem] overflow-hidden">
        <div className="space-y-8">
          <div className="space-y-4">
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
              {t('about_desc')}
            </p>
          </div>

          <div className="space-y-6">
            <h2 className="text-xl font-black text-gray-800 dark:text-gray-100 uppercase tracking-widest border-l-4 border-primary-500 pl-4">
              {t('about_features_title')}
            </h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {features.map((feature) => (
                <li key={feature.id} className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-slate-900/50 rounded-2xl border border-gray-100 dark:border-slate-800 group hover:border-primary-400 transition-all">
                  <span className="text-2xl">{feature.icon}</span>
                  <span className="text-sm font-bold text-gray-600 dark:text-gray-400 group-hover:text-primary-600 transition-colors">
                    {feature.text}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
            <div className="p-6 bg-primary-50 dark:bg-primary-900/10 rounded-3xl border border-primary-100 dark:border-primary-900/20">
              <h3 className="text-sm font-black text-primary-700 dark:text-primary-300 uppercase tracking-widest mb-2 flex items-center gap-2">
                <span className="text-xl">🎯</span> {t('about_mission_title')}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-bold leading-relaxed italic">
                {t('about_mission_text')}
              </p>
            </div>
            <div className="p-6 bg-indigo-50 dark:bg-indigo-900/10 rounded-3xl border border-indigo-100 dark:border-indigo-900/20">
              <h3 className="text-sm font-black text-indigo-700 dark:text-indigo-300 uppercase tracking-widest mb-2 flex items-center gap-2">
                <span className="text-xl">👁️</span> {t('about_vision_title')}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-bold leading-relaxed italic">
                {t('about_vision_text')}
              </p>
            </div>
          </div>
        </div>
      </Card>
      
      <div className="text-center pt-8">
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">
          {t('about_footer')}
        </p>
      </div>
    </div>
  );
};

export default About;
