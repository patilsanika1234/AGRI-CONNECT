
import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../common/Button';
import { useLanguage } from '../../contexts/LanguageContext';

const Home: React.FC = () => {
  const { t } = useLanguage();

  const farmingActivities = [
    { src: 'https://tse3.mm.bing.net/th/id/OIP.YHvH4f3ggq3HGjCsSqDD4AHaE8?pid=Api&P=0&h=180', alt: 'Tractor plowing a field' },
    { src: 'https://tse4.mm.bing.net/th/id/OIP.uzZvD69VhG2YG_YL4yi-wAHaFb?pid=Api&P=0&h=180', alt: 'Farmer sowing seeds by hand' },
    { src: 'https://tse4.mm.bing.net/th/id/OIP._qoa8apVMV_cO6HGhn3XGgHaE8?pid=Api&P=0&h=180', alt: 'Irrigation system watering crops' },
    { src: 'https://tse3.mm.bing.net/th/id/OIP.u3SMqugy3CGpWINKqnymgAHaE3?pid=Api&P=0&h=180', alt: 'Combine harvester in a wheat field' },
    { src: 'https://tse1.mm.bing.net/th/id/OIP.GrOsZs3LDsk8q1oMEPWBDwHaE8?pid=Api&P=0&h=180', alt: 'Farmer inspecting fresh vegetables' },
    { src: 'https://tse3.mm.bing.net/th/id/OIP.67dX7Ew3tjzeh74R2i5s2QHaD4?pid=Api&P=0&h=180', alt: 'An agricultural drone spraying a crop field' },
  ];

  return (
    <div className="space-y-12">
      <section className="text-center bg-primary-50 dark:bg-primary-950/50 rounded-lg p-12 relative overflow-hidden">
        <h1 className="text-4xl md:text-6xl font-black text-primary-700 dark:text-primary-200 tracking-tighter italic uppercase">
          {t('home_title')}
        </h1>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto font-bold uppercase tracking-wide">
          {t('home_subtitle')}
        </p>
        <div className="mt-10">
          <Link to="/login">
            <Button className="px-10 py-4 text-xl font-black rounded-2xl shadow-xl shadow-primary-500/30 active:scale-95 transition-all">{t('home_get_started')}</Button>
          </Link>
        </div>
      </section>

      <section>
        <h2 className="text-3xl font-black text-center mb-10 italic tracking-tight uppercase">{t('home_farming_in_action')}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {farmingActivities.map((activity, index) => (
            <div key={index} className="overflow-hidden rounded-[2rem] shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-4 border-white dark:border-slate-800">
              <img
                src={activity.src}
                alt={activity.alt}
                className="w-full h-72 object-cover"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
