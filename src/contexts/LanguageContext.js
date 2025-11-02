import React, { createContext, useContext, useState, useEffect } from 'react';
import i18n from '../utils/i18n';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState(i18n.getCurrentLanguage());
  const [, forceUpdate] = useState({});

  useEffect(() => {
    // Initialize i18n
    i18n.init().then(() => {
      setCurrentLanguage(i18n.getCurrentLanguage());
    });

    // Subscribe to language changes
    const unsubscribe = i18n.subscribe(() => {
      setCurrentLanguage(i18n.getCurrentLanguage());
      forceUpdate({});
    });

    return unsubscribe;
  }, []);

  const changeLanguage = async (language) => {
    await i18n.setLanguage(language);
  };

  const t = (key) => {
    return i18n.t(key);
  };

  const value = {
    currentLanguage,
    changeLanguage,
    t,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};