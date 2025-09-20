import { Globe, Languages } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const languages = [
  { 
    code: 'en', 
    name: 'English', 
    nativeName: 'English',
    flag: '🇺🇸'
  },
  { 
    code: 'ml', 
    name: 'Malayalam', 
    nativeName: 'മലയാളം',
    flag: '🇮🇳'
  },
];

export default function LanguageSwitcher() {
  const { i18n, t } = useTranslation();

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  const handleLanguageChange = (langCode: string) => {
    i18n.changeLanguage(langCode);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-9 w-9 hover-elevate cursor-target relative group"
          data-testid="button-language-switcher"
        >
          <Globe className="h-4 w-4 transition-transform group-hover:scale-110" />
          <span className="sr-only">{t('nav.language')}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[160px]">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className={`flex items-center gap-3 cursor-pointer transition-colors hover:bg-accent/10 ${
              i18n.language === lang.code ? 'bg-accent/5 font-medium' : ''
            }`}
            data-testid={`language-option-${lang.code}`}
          >
            <span className="text-lg">{lang.flag}</span>
            <div className="flex flex-col">
              <span className="text-sm">{lang.nativeName}</span>
              {i18n.language === lang.code && (
                <span className="text-xs text-muted-foreground">{t('nav.language')}</span>
              )}
            </div>
            {i18n.language === lang.code && (
              <div className="ml-auto w-2 h-2 bg-primary rounded-full"></div>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}