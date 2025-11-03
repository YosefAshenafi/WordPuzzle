import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
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

  useEffect(() => {
    // Initialize i18n
    i18n.init().then(() => {
      setCurrentLanguage(i18n.getCurrentLanguage());
    });

    // Subscribe to language changes
    const unsubscribe = i18n.subscribe(() => {
      setCurrentLanguage(i18n.getCurrentLanguage());
    });

    return unsubscribe;
  }, []);

  const changeLanguage = useCallback(async (language) => {
    await i18n.setLanguage(language);
  }, []);

  const t = useCallback((key) => {
    return i18n.t(key);
  }, [currentLanguage]); // Re-create when language changes

  const value = useMemo(() => ({
    currentLanguage,
    changeLanguage,
    t,
  }), [currentLanguage, changeLanguage, t]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};