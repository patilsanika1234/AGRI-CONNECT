
import React, { useEffect } from 'react';
import { HashRouter, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';

import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Sidebar from './components/layout/Sidebar';
import Home from './components/pages/Home';
import About from './components/pages/About';
import Contact from './components/pages/Contact';
import Login from './components/pages/Login';
import Register from './components/pages/Register';
import ForgotPassword from './components/pages/ForgotPassword';
import Dashboard from './components/features/Dashboard';
import MarketIntelligence from './components/features/MarketIntelligence';
import CropInsights from './components/features/CropInsights';
import GovSchemes from './components/features/GovSchemes';
import UsersActivity from './components/features/UsersActivity';
import Predictory from './components/features/Predictory';
import Admin from './components/pages/Admin';
import { addLog } from './services/activityService';

const NavigationTracker: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      const path = location.pathname;
      let feature = 'Navigation';
      let action = 'Viewed Page';

      switch(path) {
        case '/dashboard': feature = 'Dashboard'; action = 'Opened Dashboard'; break;
        case '/market-intelligence': feature = 'Market Intel'; action = 'Opened Market Intelligence'; break;
        case '/crop-insights': feature = 'Crop Insights'; action = 'Opened Crop Insights'; break;
        case '/agri-schemes': feature = 'AgriSchemes'; action = 'Explored Government Schemes'; break;
        case '/predictory': feature = 'Predictory'; action = 'Used Price Prediction'; break;
        case '/users-activity': feature = 'Users Activity'; action = 'Checked User Activities'; break;
        case '/admin': feature = 'Admin'; action = 'Accessed Admin Center'; break;
      }

      if (path !== '/login' && path !== '/register') {
          addLog(user.name, action, feature, user.loginTime);
      }
    }
  }, [location, user]);

  return null;
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <LanguageProvider>
          <HashRouter>
            <NavigationTracker />
            <MainContent />
          </HashRouter>
        </LanguageProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

const MainContent: React.FC = () => {
  const { user } = useAuth();

  const getLoginRedirect = () => {
    if (!user) return <Login />;
    return user.role === 'Admin' ? <Navigate to="/admin" /> : <Navigate to="/dashboard" />;
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-slate-900 text-gray-800 dark:text-gray-200 transition-colors duration-300">
      <Header />
      <div className="flex flex-1 container mx-auto">
        {user && <Sidebar />}
        <main className="flex-grow px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            
            <Route path="/login" element={getLoginRedirect()} />
            <Route path="/register" element={user ? <Navigate to={user.role === 'Admin' ? "/admin" : "/dashboard"} /> : <Register />} />
            <Route path="/forgot-password" element={user ? <Navigate to={user.role === 'Admin' ? "/admin" : "/dashboard"} /> : <ForgotPassword />} />
            
            <Route path="/dashboard" element={user ? (user.role === 'Farmer' ? <Dashboard /> : <Navigate to="/admin" />) : <Navigate to="/login" />} />
            <Route path="/market-intelligence" element={user ? <MarketIntelligence /> : <Navigate to="/login" />} />
            <Route path="/crop-insights" element={user ? <CropInsights /> : <Navigate to="/login" />} />
            <Route path="/agri-schemes" element={user ? <GovSchemes /> : <Navigate to="/login" />} />
            <Route path="/predictory" element={user ? <Predictory /> : <Navigate to="/login" />} />
            <Route path="/users-activity" element={user ? <UsersActivity /> : <Navigate to="/login" />} />
            
            <Route path="/admin" element={user?.role === 'Admin' ? <Admin /> : <Navigate to="/dashboard" />} />

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default App;
