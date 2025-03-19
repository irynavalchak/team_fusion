'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  FileText, 
  MessageSquare, 
  Settings,
  Globe,
  Trello,
  CircleDollarSign
} from 'lucide-react';

import styles from './page.module.css';
import { 
  loadTranslations, 
  getTranslation, 
  getLanguageCookie, 
  DEFAULT_LANGUAGE, 
  isLanguageSupported 
} from '@/utils/translations';

// Feature-flagged items that can be toggled
const featureFlaggedItems = [
  { href: '/ai_assistant', icon: MessageSquare, label: 'featureFlags.aiAssistant' },
  { href: '/finance', icon: CircleDollarSign, label: 'featureFlags.financeModule' },
  { href: '/projects', icon: Trello, label: 'featureFlags.projectManagement' },
  { href: '/land', icon: Globe, label: 'featureFlags.landModule' }
];

// Regular navigation items
const navigationItems = [
  { href: '/documents', icon: FileText, label: 'navigation.documents' },
  { href: '/settings', icon: Settings, label: 'navigation.settings' }
];

export default function DashboardPage() {
  // State for feature flag toggle
  const [showExperimentalFeatures, setShowExperimentalFeatures] = useState(false);
  // State for translations
  const [translations, setTranslations] = useState<any>({});
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
      
      // Load translations
      const loadedTranslations = await loadTranslations(finalLanguage);
      setTranslations(loadedTranslations);
      
      // Load toggle state from local storage
      const savedToggleState = localStorage.getItem('showExperimentalFeatures');
      if (savedToggleState !== null) {
        setShowExperimentalFeatures(savedToggleState === 'true');
      }
      
      setIsLoading(false);
    };
    
    initializeLanguage();
  }, []);

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
      <h1 className={styles.title}>{t('title')}</h1>
      
      <section 
        className={styles.grid}
        aria-label="Navigation options"
      >
        {/* Show regular navigation items */}
        {navigationItems.map((item) => (
          <Link 
            key={item.href} 
            href={item.href} 
            className={styles.card}
            aria-label={`Navigate to ${t(item.label)}`}
          >
            <item.icon className={styles.icon} aria-hidden="true" />
            <strong className={styles.label}>{t(item.label)}</strong>
          </Link>
        ))}
        
        {/* Show feature-flagged items when toggle is enabled */}
        {showExperimentalFeatures && featureFlaggedItems.map((item) => (
          <Link 
            key={item.href} 
            href={item.href} 
            className={styles.card}
            aria-label={`Navigate to ${t(item.label)}`}
          >
            <item.icon className={styles.icon} aria-hidden="true" />
            <strong className={styles.label}>{t(item.label)}</strong>
          </Link>
        ))}
      </section>
    </main>
  );
}
