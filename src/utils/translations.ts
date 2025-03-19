import { parse } from 'yaml';
import LANGUAGE from '../constants/language';

// Define the cookie name for storing language preference
export const LANGUAGE_COOKIE_NAME = 'team_fusion_language';

// Define the supported languages
export const SUPPORTED_LANGUAGES = [
  { code: LANGUAGE.EN, name: 'English' },
  { code: LANGUAGE.RU, name: 'Russian' },
  { code: LANGUAGE.TH, name: 'Thai' },
];

// Define the default language
export const DEFAULT_LANGUAGE = LANGUAGE.EN;

// Cache for loaded translations
let translationsCache: Record<string, any> = {};

/**
 * Load translations for a specific language
 */
export async function loadTranslations(lang: string): Promise<any> {
  // Check if translations are already in cache
  if (translationsCache[lang]) {
    return translationsCache[lang];
  }

  try {
    // Load the YAML file for the dashboard module
    const response = await fetch(`/api/translations?module=dashboard`);
    if (!response.ok) {
      console.error(`Failed to load translations for module dashboard`);
      return {};
    }

    const data = await response.text();
    const parsedData = parse(data);
    
    // Get translations for the requested language
    const translations = parsedData[lang];
    if (!translations) {
      console.error(`Translations not found for language ${lang}`);
      // Fall back to default language if specified language is not found
      if (lang !== DEFAULT_LANGUAGE) {
        return loadTranslations(DEFAULT_LANGUAGE);
      }
      return {};
    }
    
    // Cache the translations
    translationsCache[lang] = translations;
    return translations;
  } catch (error) {
    console.error(`Error loading translations:`, error);
    // Fall back to default language if specified language fails to load
    if (lang !== DEFAULT_LANGUAGE) {
      return loadTranslations(DEFAULT_LANGUAGE);
    }
    return {};
  }
}

/**
 * Get a translation by key
 * Supports nested keys using dot notation, e.g., 'title'
 */
export function getTranslation(translations: any, key: string): string {
  const keys = key.split('.');
  let result = translations;
  
  for (const k of keys) {
    if (result && typeof result === 'object' && k in result) {
      result = result[k];
    } else {
      // Key not found
      return key;
    }
  }
  
  return result;
}

/**
 * Set the language cookie
 */
export function setLanguageCookie(lang: string): void {
  // Set cookie to expire in 30 days
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + 30);
  
  document.cookie = `${LANGUAGE_COOKIE_NAME}=${lang}; expires=${expiryDate.toUTCString()}; path=/; SameSite=Lax`;
}

/**
 * Get the language from the cookie
 */
export function getLanguageCookie(): string {
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === LANGUAGE_COOKIE_NAME) {
      return value;
    }
  }
  return DEFAULT_LANGUAGE;
}

/**
 * Check if a language is supported
 */
export function isLanguageSupported(lang: string): boolean {
  return SUPPORTED_LANGUAGES.some(language => language.code === lang);
} 