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

// Define types for translations
export interface LanguageSwitcherTranslations {
  english?: string;
  russian?: string;
  thai?: string;
  [key: string]: string | undefined;
}

export interface TranslationObject {
  languageSwitcher?: LanguageSwitcherTranslations;
  [key: string]: any;
}
type Translations = { [lang: string]: TranslationObject };

// Cache for translations
const translationCache: Record<string, TranslationObject> = {};

/**
 * Load translations for a specific language and module
 * @param lang - Language code (e.g., 'en', 'ru', 'th')
 * @param module - Module name (e.g., 'dashboard', 'settings')
 * @returns Promise with translations object
 */
export async function loadTranslations(lang: string, module: string = 'dashboard'): Promise<TranslationObject> {
  // Check cache first
  const cacheKey = `${lang}-${module}`;
  if (translationCache[cacheKey]) {
    return translationCache[cacheKey];
  }

  try {
    const response = await fetch(`/api/translations?module=${module}`);
    if (!response.ok) {
      throw new Error(`Failed to load translations for module ${module}`);
    }
    
    const yaml = await response.text();
    const translations = parse(yaml) as Translations;
    
    // Cache the translations
    translationCache[cacheKey] = translations[lang];
    
    return translations[lang];
  } catch (error) {
    console.error(`Error loading translations for module ${module}:`, error);
    return {};
  }
}

/**
 * Get a translation by key
 * Supports nested keys using dot notation, e.g., 'title'
 */
export function getTranslation(translations: TranslationObject, key: string): string {
  const keys = key.split('.');
  let result: any = translations;
  
  for (const k of keys) {
    if (result && typeof result === 'object' && k in result) {
      result = result[k];
    } else {
      // Key not found
      return key;
    }
  }
  
  return typeof result === 'string' ? result : key;
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