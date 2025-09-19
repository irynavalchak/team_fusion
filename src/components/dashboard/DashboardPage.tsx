'use client';

import React, {useState, useEffect, useRef} from 'react';
import Link from 'next/link';
import {
  FileText,
  MessageSquare,
  Settings,
  Globe,
  Trello,
  CircleDollarSign,
  ChevronDown,
  FolderOpen
} from 'lucide-react';

import styles from './dashboard.module.css';

import {
  loadTranslations,
  getTranslation,
  getLanguageCookie,
  DEFAULT_LANGUAGE,
  TranslationObject,
  isLanguageSupported
} from 'utils/translations';
import {fetchProjectList} from 'services/apiService';
import {ProjectItem, ProjectGridItem, ProjectGridItems} from 'typings/project';

// Feature-flagged items that can be toggled
const featureFlaggedItems: ProjectGridItem[] = [
  {href: '/ai-assistant', icon: MessageSquare, label: 'featureFlags.aiAssistant'},
  {href: '/finance', icon: CircleDollarSign, label: 'featureFlags.financeModule'},
  {href: '/projects', icon: Trello, label: 'featureFlags.projectManagement'},
  {href: '/land', icon: Globe, label: 'featureFlags.landModule'}
];

// Regular navigation items
const navigationItems: ProjectGridItem[] = [
  {href: '/documents', icon: FileText, label: 'navigation.documents'},
  {href: '/project-context', icon: FolderOpen, label: 'navigation.projectContext'},
  {href: '/settings', icon: Settings, label: 'navigation.settings'}
];

// Project-specific grid items
const projectGridItems: ProjectGridItems = {
  ollc: [
    {href: '/documents', icon: FileText, label: 'navigation.documents'},
    {href: '/project-context', icon: FolderOpen, label: 'navigation.projectContext'},
    {href: '/finance', icon: CircleDollarSign, label: 'featureFlags.financeModule'},
    {href: '/settings', icon: Settings, label: 'navigation.settings'}
  ],
  ocamp: [
    {href: '/documents', icon: FileText, label: 'navigation.documents'},
    {href: '/project-context', icon: FolderOpen, label: 'navigation.projectContext'},
    {href: '/projects', icon: Trello, label: 'featureFlags.projectManagement'},
    {href: '/land', icon: Globe, label: 'featureFlags.landModule'},
    {href: '/settings', icon: Settings, label: 'navigation.settings'}
  ],
  tf: [
    {href: '/documents', icon: FileText, label: 'navigation.documents'},
    {href: '/project-context', icon: FolderOpen, label: 'navigation.projectContext'},
    {href: '/ai-assistant', icon: MessageSquare, label: 'featureFlags.aiAssistant'},
    {href: '/settings', icon: Settings, label: 'navigation.settings'},
    {href: '/profile', icon: MessageSquare, label: 'navigation.profile'}

  ],
  lingva: [
    {href: '/documents', icon: FileText, label: 'navigation.documents'},
    {href: '/project-context', icon: FolderOpen, label: 'navigation.projectContext'},
    {href: '/settings', icon: Settings, label: 'navigation.settings'}
  ],
  default: [
    {href: '/documents', icon: FileText, label: 'navigation.documents'},
    {href: '/project-context', icon: FolderOpen, label: 'navigation.projectContext'},
    {href: '/settings', icon: Settings, label: 'navigation.settings'}
  ]
};

function DashboardPage() {
  const [showExperimentalFeatures, setShowExperimentalFeatures] = useState(false);
  const [translations, setTranslations] = useState<TranslationObject>({});
  const [currentLanguage, setCurrentLanguage] = useState(DEFAULT_LANGUAGE);
  const [isLoading, setIsLoading] = useState(true);
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [isProjectMenuOpen, setIsProjectMenuOpen] = useState(false);

  const projectMenuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (projectMenuRef.current && !projectMenuRef.current.contains(event.target as Node)) {
        setIsProjectMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Load initial language and translations
  useEffect(() => {
    const initializeLanguage = async () => {
      setIsLoading(true);

      // Get language from cookie
      const cookieLanguage = getLanguageCookie();
      const finalLanguage = isLanguageSupported(cookieLanguage) ? cookieLanguage : DEFAULT_LANGUAGE;

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

  // Fetch projects on component mount
  useEffect(() => {
    const getProjects = async () => {
      const projectsList = await fetchProjectList();
      setProjects(projectsList);

      // Set default selected project if available
      if (projectsList.length > 0) {
        // Try to get previously selected project from localStorage
        const savedProjectId = localStorage.getItem('selectedProjectId');
        if (savedProjectId) {
          const savedProject = projectsList.find(p => p.id.toString() === savedProjectId);
          if (savedProject) {
            setSelectedProject(savedProject);
            return;
          }
        }

        // Otherwise, select "ocamp" project by default if it exists
        const ocampProject = projectsList.find(p => p.project_code === 'ocamp');
        if (ocampProject) {
          setSelectedProject(ocampProject);
          localStorage.setItem('selectedProjectId', ocampProject.id.toString());
        } else {
          // If ocamp doesn't exist, select the first project
          setSelectedProject(projectsList[0]);
          localStorage.setItem('selectedProjectId', projectsList[0].id.toString());
        }
      }
    };

    getProjects();
  }, []);

  // Helper function to get translated text
  const t = (key: string): string => {
    return getTranslation(translations, key) || key;
  };

  // Helper function to get project label based on current language
  const getProjectLabel = (project: ProjectItem): string => {
    if (!project) return '';

    switch (currentLanguage) {
      case 'ru':
        return project.label_ru;
      case 'th':
        return project.label_th;
      case 'en':
      default:
        return project.label_en;
    }
  };

  // Handle project selection
  const handleProjectSelect = (project: ProjectItem) => {
    setSelectedProject(project);
    setIsProjectMenuOpen(false);

    // Save selected project to localStorage
    localStorage.setItem('selectedProjectId', project.id.toString());
  };

  // Get grid items based on selected project
  const getGridItems = (): ProjectGridItem[] => {
    if (!selectedProject) return projectGridItems.default;

    const projectCode = selectedProject.project_code;
    return projectGridItems[projectCode] || projectGridItems.default;
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
      <div className={styles.projectSelectionContainer}>
        {selectedProject && <div className={styles.projectName}>{getProjectLabel(selectedProject)}</div>}

        <div className={styles.projectDropdownWrapper} ref={projectMenuRef}>
          <button
            className={styles.projectSelectButton}
            onClick={() => setIsProjectMenuOpen(!isProjectMenuOpen)}
            aria-expanded={isProjectMenuOpen}
            aria-haspopup="true">
            {selectedProject ? getProjectLabel(selectedProject) : ''}
            <ChevronDown className={styles.projectSelectIcon} />
          </button>

          <div
            className={styles.projectSelectMenu}
            role="menu"
            aria-hidden={!isProjectMenuOpen}
            aria-label="Select project">
            {projects.map(project => (
              <button
                key={project.id}
                className={styles.projectSelectOption}
                onClick={() => handleProjectSelect(project)}
                role="menuitem">
                {getProjectLabel(project)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <section className={styles.grid} aria-label="Navigation options">
        {/* Show grid items based on selected project */}
        {selectedProject &&
          getGridItems().map(item => (
            <Link key={item.href} href={item.href} className={styles.card} aria-label={`Navigate to ${t(item.label)}`}>
              <item.icon className={styles.icon} aria-hidden="true" />
              <strong className={styles.label}>{t(item.label)}</strong>
            </Link>
          ))}

        {/* Show all items when no project is selected or with experimental features */}
        {!selectedProject && (
          <>
            {/* Show regular navigation items */}
            {navigationItems.map(item => (
              <Link
                key={item.href}
                href={item.href}
                className={styles.card}
                aria-label={`Navigate to ${t(item.label)}`}>
                <item.icon className={styles.icon} aria-hidden="true" />
                <strong className={styles.label}>{t(item.label)}</strong>
              </Link>
            ))}

            {/* Show feature-flagged items when toggle is enabled */}
            {showExperimentalFeatures &&
              featureFlaggedItems.map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={styles.card}
                  aria-label={`Navigate to ${t(item.label)}`}>
                  <item.icon className={styles.icon} aria-hidden="true" />
                  <strong className={styles.label}>{t(item.label)}</strong>
                </Link>
              ))}
          </>
        )}
      </section>
    </main>
  );
}

export default DashboardPage;
