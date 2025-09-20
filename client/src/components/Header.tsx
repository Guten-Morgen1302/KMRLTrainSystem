import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { useTheme } from '@/components/ThemeProvider';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '@/components/LanguageSwitcher';

// Metro Yukthi Logo Component
const KochiMetroLogo = () => (
  <div className="flex items-center">
    <img 
      src="/metro-logo.webp" 
      alt="Metro Yukthi Logo" 
      className="h-10 w-auto drop-shadow-lg dark:drop-shadow-2xl dark:filter dark:brightness-110"
    />
  </div>
);

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();
  const { t } = useTranslation();

  const navigation = [
    { name: t('nav.home'), href: '#home' },
    { name: t('nav.problem'), href: '#problem' },
    { name: t('nav.features'), href: '#features' },
    { name: t('nav.demo'), href: '#demo' },
    { name: t('nav.live_allocation_engine'), href: '#live-allocation-engine' },
    { name: t('nav.faq'), href: '#faq' },
  ];

  const scrollToSection = (href: string) => {
    // If it's a route path, navigate using window.location
    if (href.startsWith('/')) {
      window.location.href = href;
      return;
    }
    
    // Otherwise, scroll to section
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border dark:bg-gradient-to-r dark:from-background dark:via-background dark:to-background dark:border-primary/30 dark:backdrop-blur-md dark:shadow-lg dark:shadow-primary/10">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Top">
        <div className="flex w-full items-center justify-between py-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => scrollToSection('#home')}
              className="hover-elevate p-2 rounded-md transition-all duration-300 dark:hover:bg-primary/10 dark:hover:shadow-lg dark:hover:shadow-primary/20"
              data-testid="button-logo"
            >
              <KochiMetroLogo />
            </button>
            <div className="hidden lg:block border-l border-border/50 pl-4 dark:border-primary/30">
              <div className="text-lg font-bold text-foreground dark:text-transparent dark:bg-gradient-to-r dark:from-primary dark:to-accent dark:bg-clip-text">
                {t('hero.title')}
              </div>
              <div className="text-xs text-muted-foreground dark:text-accent/80 dark:font-medium">
                {t('hero.subtitle')}
              </div>
            </div>
          </div>
          
          {/* Desktop navigation */}
          <div className="hidden md:flex md:items-center md:space-x-1">
            {navigation.map((item) => (
              <button
                key={item.name}
                onClick={() => scrollToSection(item.href)}
                className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover-elevate rounded-md transition-all duration-300 dark:hover:text-primary dark:hover:bg-primary/10 dark:hover:shadow-md dark:hover:shadow-primary/25"
                data-testid={`link-${item.name.toLowerCase()}`}
              >
                {item.name}
              </button>
            ))}
            
            {/* Language Switcher */}
            <LanguageSwitcher />
            
            {/* Theme Toggle Button - Desktop */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="ml-4 hover-elevate text-muted-foreground hover:text-foreground transition-all duration-300 dark:hover:text-accent dark:hover:bg-accent/10 dark:hover:shadow-lg dark:hover:shadow-accent/30"
              aria-label="Toggle theme"
              data-testid="button-theme-toggle"
            >
              {isDark ? (
                <Sun className="h-5 w-5 transition-all duration-300" />
              ) : (
                <Moon className="h-5 w-5 transition-all duration-300" />
              )}
            </Button>
          </div>

          {/* Mobile menu and theme toggle */}
          <div className="md:hidden flex items-center space-x-2">
            {/* Theme Toggle Button - Mobile */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="hover-elevate text-muted-foreground hover:text-foreground transition-all duration-300 dark:hover:text-accent dark:hover:bg-accent/10 dark:hover:shadow-lg dark:hover:shadow-accent/30"
              aria-label="Toggle theme"
              data-testid="button-theme-toggle-mobile"
            >
              {isDark ? (
                <Sun className="h-5 w-5 transition-all duration-300" />
              ) : (
                <Moon className="h-5 w-5 transition-all duration-300" />
              )}
            </Button>
            
            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              data-testid="button-mobile-menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile navigation menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border dark:border-primary/30 dark:bg-gradient-to-b dark:from-background dark:to-card">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => (
                <button
                  key={item.name}
                  onClick={() => scrollToSection(item.href)}
                  className="block w-full text-left px-3 py-2 text-base font-medium text-muted-foreground hover:text-foreground hover-elevate rounded-md transition-all duration-300 dark:hover:text-primary dark:hover:bg-primary/10 dark:hover:shadow-md dark:hover:shadow-primary/25"
                  data-testid={`mobile-link-${item.name.toLowerCase()}`}
                >
                  {item.name}
                </button>
              ))}
              
              {/* Theme toggle in mobile menu */}
              <div className="border-t border-border dark:border-primary/30 mt-2 pt-2">
                <button
                  onClick={toggleTheme}
                  className="flex items-center space-x-3 w-full text-left px-3 py-2 text-base font-medium text-muted-foreground hover:text-foreground hover-elevate rounded-md transition-all duration-300 dark:hover:text-accent dark:hover:bg-accent/10 dark:hover:shadow-md dark:hover:shadow-accent/25"
                  data-testid="mobile-theme-toggle"
                >
                  {isDark ? (
                    <>
                      <Sun className="h-5 w-5" />
                      <span>Light Mode</span>
                    </>
                  ) : (
                    <>
                      <Moon className="h-5 w-5" />
                      <span>Dark Mode</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}