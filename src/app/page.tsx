'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { 
  FileText, 
  MessageSquare, 
  Settings,
  Globe
} from 'lucide-react';

import styles from './page.module.css';

// Feature-flagged items that can be toggled
const featureFlaggedItems = [
  { href: '/ai_assistant', icon: MessageSquare, label: 'AI Assistant' },
  { href: '/finance', icon: FileText, label: 'Finance Module' },
  { href: '/projects', icon: Settings, label: 'Project Management' },
  { href: '/land', icon: Globe, label: 'Land Module' }
];

export default function DashboardPage() {
  // State to toggle feature-flagged items display with local storage persistence
  const [showExperimentalFeatures, setShowExperimentalFeatures] = useState(false);
  
  // Load toggle state from local storage on mount
  useEffect(() => {
    const savedState = localStorage.getItem('showExperimentalFeatures');
    if (savedState !== null) {
      setShowExperimentalFeatures(savedState === 'true');
    }
  }, []);

  // Save toggle state to local storage when changed
  const handleToggleChange = (newValue: boolean) => {
    setShowExperimentalFeatures(newValue);
    localStorage.setItem('showExperimentalFeatures', newValue.toString());
  };
  
  const navigationItems = [
    { href: '/documents', icon: FileText, label: 'Documents' }
  ];

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>Welcome to TeamFusion</h1>
      
      {/* Toggle for experimental features */}
      <div className={styles.toggleContainer}>
        <label htmlFor="feature-toggle" className={styles.toggleLabel}>
          Show Experimental Features
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
            aria-label={`Navigate to ${item.label}`}
          >
            <item.icon className={styles.icon} aria-hidden="true" />
            <strong className={styles.label}>{item.label}</strong>
          </Link>
        ))}
        
        {/* Show feature-flagged items when toggle is enabled */}
        {showExperimentalFeatures && featureFlaggedItems.map((item) => (
          <Link 
            key={item.href} 
            href={item.href} 
            className={styles.card}
            aria-label={`Navigate to ${item.label}`}
          >
            <item.icon className={styles.icon} aria-hidden="true" />
            <strong className={styles.label}>{item.label}</strong>
          </Link>
        ))}
      </section>
    </main>
  );
}
