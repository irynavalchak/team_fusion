import React from 'react';
import { 
  SUPPORTED_LANGUAGES, 
  setLanguageCookie 
} from '@/utils/translations';

interface LanguageSwitcherProps {
  currentLanguage: string;
  onChange: (lang: string) => void;
  translations: any;
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ 
  currentLanguage, 
  onChange, 
  translations 
}) => {
  const handleLanguageChange = (lang: string) => {
    // Set the cookie
    setLanguageCookie(lang);
    // Call the onChange callback
    onChange(lang);
  };

  return (
    <div className="language-switcher">
      <div className="language-buttons">
        {SUPPORTED_LANGUAGES.map((language) => (
          <button
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            className={`language-button ${currentLanguage === language.code ? 'active' : ''}`}
            aria-label={`Switch to ${language.name}`}
            aria-pressed={currentLanguage === language.code}
          >
            {(() => {
              const key = language.code === 'en' 
                ? 'english' 
                : language.code === 'ru' 
                  ? 'russian' 
                  : 'thai';
              return translations?.languageSwitcher?.[key] || language.name;
            })()}
          </button>
        ))}
      </div>

      <style jsx>{`
        .language-switcher {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        
        .language-buttons {
          display: flex;
          gap: 0.5rem;
        }
        
        .language-button {
          padding: 0.5rem 1rem;
          border: 1px solid #e0e0e0;
          background: white;
          border-radius: 4px;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .language-button:hover {
          background-color: #f8f9ff;
          border-color: #0057b8;
        }
        
        .language-button.active {
          background-color: #0057b8;
          color: white;
          border-color: #0057b8;
        }
      `}</style>
    </div>
  );
};

export default LanguageSwitcher; 