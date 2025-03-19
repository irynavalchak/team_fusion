'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import LanguageSwitcher from '@/components/common/LanguageSwitcher';
import { 
  loadTranslations, 
  getTranslation, 
  getLanguageCookie, 
  DEFAULT_LANGUAGE,
  TranslationObject,
  isLanguageSupported,
  setLanguageCookie
} from '@/utils/translations';

import styles from './settings.module.css';

export default function SettingsPage() {
  // State for feature flag toggle
  const [showExperimentalFeatures, setShowExperimentalFeatures] = useState(false);
  // State for translations
  const [translations, setTranslations] = useState<TranslationObject>({});
  // State for current language
  const [currentLanguage, setCurrentLanguage] = useState(DEFAULT_LANGUAGE);
  // State for loading status
  const [isLoading, setIsLoading] = useState(true);

  // Load initial language and translations
  useEffect(() => {
    const initializeLanguage = async () => {
      setIsLoading(true);
      
      // Get language from cookie
      const cookieLanguage = getLanguageCookie();
      const finalLanguage = isLanguageSupported(cookieLanguage) 
        ? cookieLanguage 
        : DEFAULT_LANGUAGE;
      
      // Set current language
      setCurrentLanguage(finalLanguage);
      
      // Load translations for both dashboard and settings
      const [dashboardTranslations, settingsTranslations] = await Promise.all([
        loadTranslations(finalLanguage, 'dashboard'),
        loadTranslations(finalLanguage, 'settings')
      ]);
      
      // Merge translations
      setTranslations({
        ...dashboardTranslations,
        ...settingsTranslations
      });
      
      // Load toggle state from local storage
      const savedToggleState = localStorage.getItem('showExperimentalFeatures');
      if (savedToggleState !== null) {
        setShowExperimentalFeatures(savedToggleState === 'true');
      }
      
      setIsLoading(false);
    };
    
    initializeLanguage();
  }, []);

  // Handle language change
  const handleLanguageChange = async (lang: string) => {
    setIsLoading(true);
    setCurrentLanguage(lang);
    
    // Load translations for both dashboard and settings
    const [dashboardTranslations, settingsTranslations] = await Promise.all([
      loadTranslations(lang, 'dashboard'),
      loadTranslations(lang, 'settings')
    ]);
    
    // Merge translations
    setTranslations({
      ...dashboardTranslations,
      ...settingsTranslations
    });
    
    setIsLoading(false);
  };
  
  // Save toggle state to local storage when changed
  const handleToggleChange = (newValue: boolean) => {
    setShowExperimentalFeatures(newValue);
    localStorage.setItem('showExperimentalFeatures', newValue.toString());
  };

  // Helper function to get translated text
  const t = (key: string): string => {
    return getTranslation(translations, key) || key;
  };

  // Show loading state if translations are not loaded yet
  if (isLoading) {
    return (
      <main className={styles.container}>
        <div className={styles.loading}>Loading...</div>
      </main>
    );
  }

  return (
    <main className={styles.container}>
      <div className={styles.header}>
        <Link href="/" className={styles.backLink}>
          <ArrowLeft size={20} />
          <span>{t('backToDashboard')}</span>
        </Link>
        <h1 className={styles.title}>{t('title')}</h1>
      </div>

      <div className={styles.settingsSection}>
        <h2 className={styles.sectionTitle}>{t('features.title')}</h2>
        
        {/* Toggle for experimental features */}
        <div className={styles.toggleContainer}>
          <label htmlFor="feature-toggle" className={styles.toggleLabel}>
            {t('features.toggleLabel')}
            <input
              id="feature-toggle"
              type="checkbox"
              checked={showExperimentalFeatures}
              onChange={(e) => handleToggleChange(e.target.checked)}
              className={styles.toggleInput}
            />
            <span className={styles.toggleSwitch}></span>
          </label>
        </div>
      </div>

      <div className={styles.settingsSection}>
        <h2 className={styles.sectionTitle}>{t('language.title')}</h2>
        
        {/* Language switcher */}
        <LanguageSwitcher 
          currentLanguage={currentLanguage}
          onChange={handleLanguageChange}
          translations={translations}
        />
      </div>
    </main>
  );
}
